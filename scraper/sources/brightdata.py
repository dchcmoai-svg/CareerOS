import os
import time
import json
from typing import Any, Dict, List, Optional

import requests

BRIGHTDATA_API_SCRAPE_URL = "https://api.brightdata.com/datasets/v3/scrape"
BRIGHTDATA_API_TRIGGER_URL = "https://api.brightdata.com/datasets/v3/trigger"
BRIGHTDATA_API_SNAPSHOT_URL = "https://api.brightdata.com/datasets/v3/snapshot"
BRIGHTDATA_REQUEST_TIMEOUT = 120
BRIGHTDATA_MAX_RETRIES = 3


def _get_api_key() -> str:
    api_key = os.getenv("BRIGHTDATA_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "Brightdata API key is missing. Set BRIGHTDATA_API_KEY in your environment."
        )
    return api_key


def _brightdata_request_with_retry(
    method: str,
    url: str,
    headers: Dict[str, str],
    params: Optional[Dict[str, Any]] = None,
    json_data: Optional[Any] = None,
    timeout: Optional[int] = None,
    max_retries: int = BRIGHTDATA_MAX_RETRIES,
) -> requests.Response:
    timeout = timeout or BRIGHTDATA_REQUEST_TIMEOUT
    attempt = 0

    while True:
        try:
            return requests.request(
                method,
                url,
                headers=headers,
                params=params,
                json=json_data,
                timeout=timeout,
            )
        except (requests.exceptions.ReadTimeout, requests.exceptions.ConnectionError) as exc:
            attempt += 1
            if attempt >= max_retries:
                raise
            time.sleep(2 ** attempt)


def _build_headers(api_key: Optional[str] = None) -> Dict[str, str]:
    if api_key is None:
        api_key = _get_api_key()

    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }


def send_brightdata_request(
    input_data: List[Dict[str, Any]],
    dataset_id: Optional[str],
    notify: bool = False,
    include_errors: bool = True,
    request_type: Optional[str] = None,
    discover_by: Optional[str] = None,
    api_key: Optional[str] = None,
) -> Dict[str, Any]:
    """Send a Brightdata dataset scrape request."""
    if not dataset_id:
        dataset_id = os.getenv("BRIGHTDATA_DATASET_ID")
    if not dataset_id:
        raise ValueError("dataset_id is required for Brightdata scrape requests")

    params: Dict[str, Any] = {
        "dataset_id": dataset_id,
        "notify": str(notify).lower(),
        "include_errors": str(include_errors).lower(),
    }
    if request_type:
        params["type"] = request_type
    if discover_by:
        params["discover_by"] = discover_by

    response = _brightdata_request_with_retry(
        "post",
        BRIGHTDATA_API_SCRAPE_URL,
        headers=_build_headers(api_key),
        json_data={"input": input_data},
        params=params,
        timeout=BRIGHTDATA_REQUEST_TIMEOUT,
    )
    response.raise_for_status()
    return response.json()


def trigger_brightdata_dataset(
    input_data: List[Dict[str, Any]],
    dataset_id: Optional[str],
    notify: bool = False,
    include_errors: bool = True,
    request_type: Optional[str] = None,
    discover_by: Optional[str] = None,
    api_key: Optional[str] = None,
) -> Dict[str, Any]:
    """Trigger an async Brightdata dataset job and get a snapshot ID."""
    if not dataset_id:
        dataset_id = os.getenv("BRIGHTDATA_DATASET_ID")
    if not dataset_id:
        raise ValueError("dataset_id is required to trigger a Brightdata dataset")

    params: Dict[str, Any] = {
        "dataset_id": dataset_id,
        "notify": str(notify).lower(),
        "include_errors": str(include_errors).lower(),
    }
    if request_type:
        params["type"] = request_type
    if discover_by:
        params["discover_by"] = discover_by

    response = _brightdata_request_with_retry(
        "post",
        BRIGHTDATA_API_TRIGGER_URL,
        headers=_build_headers(api_key),
        json_data={"input": input_data},
        params=params,
        timeout=BRIGHTDATA_REQUEST_TIMEOUT,
    )
    response.raise_for_status()
    return response.json()


def fetch_brightdata_snapshot(
    snapshot_id: str,
    api_key: Optional[str] = None,
) -> Dict[str, Any]:
    """Fetch a Brightdata snapshot by ID."""
    if not snapshot_id:
        raise ValueError("snapshot_id is required to fetch Brightdata snapshot")

    url = f"{BRIGHTDATA_API_SNAPSHOT_URL}/{snapshot_id}"
    response = _brightdata_request_with_retry(
        "get",
        url,
        headers=_build_headers(api_key),
        timeout=BRIGHTDATA_REQUEST_TIMEOUT,
    )
    response.raise_for_status()

    content_type = response.headers.get("Content-Type", "")
    if content_type.startswith("application/jsonl") or content_type.startswith("application/x-ndjson"):
        lines = [line for line in response.text.splitlines() if line.strip()]
        return {
            "status": "completed",
            "output": [json.loads(line) for line in lines],
        }

    try:
        return response.json()
    except json.JSONDecodeError as exc:
        message = response.text.strip()
        raise RuntimeError(
            f"Failed to parse Brightdata snapshot {snapshot_id} response as JSON: {exc}\nResponse text:\n{message[:2000]}"
        )


def wait_for_brightdata_snapshot(
    snapshot_id: str,
    api_key: Optional[str] = None,
    poll_interval: int = 10,
    timeout_seconds: int = 300,
) -> Dict[str, Any]:
    """Poll Brightdata until the snapshot is finished or fails."""
    deadline = time.time() + timeout_seconds

    while True:
        snapshot = fetch_brightdata_snapshot(snapshot_id, api_key=api_key)
        status = (snapshot.get("status") or snapshot.get("state") or "").lower()

        if status in {"completed", "done", "finished"}:
            return snapshot
        if status in {"failed", "error", "declined"}:
            raise RuntimeError(
                f"Brightdata snapshot {snapshot_id} failed with status={status}: {snapshot}"
            )
        if time.time() >= deadline:
            raise TimeoutError(
                f"Timed out waiting for Brightdata snapshot {snapshot_id} after {timeout_seconds}s"
            )

        time.sleep(poll_interval)


def normalize_brightdata_jobs(
    raw_output: List[Dict[str, Any]],
    source: str = "linkedin-brightdata",
) -> List[Dict[str, Any]]:
    jobs: List[Dict[str, Any]] = []

    for item in raw_output:
        if not isinstance(item, dict):
            continue

        job_payload = item.get("job") if isinstance(item.get("job"), dict) else item

        url = (
            job_payload.get("url")
            or job_payload.get("jobUrl")
            or job_payload.get("link")
        )
        if not url:
            continue

        title = (
            job_payload.get("title")
            or job_payload.get("jobTitle")
            or job_payload.get("position")
            or ""
        )
        company = (
            job_payload.get("company")
            or job_payload.get("employer")
            or job_payload.get("organization")
            or ""
        )
        location = (
            job_payload.get("location")
            or job_payload.get("office_location")
            or job_payload.get("jobLocation")
            or ""
        )

        jobs.append(
            {
                "title": title.strip() if isinstance(title, str) else "",
                "company": company.strip() if isinstance(company, str) else "",
                "department": job_payload.get("department"),
                "team": job_payload.get("team"),
                "office_location": location.strip() if isinstance(location, str) else "",
                "remote_location": job_payload.get("remote_location") or job_payload.get("remote"),
                "work_mode": "remote" if job_payload.get("remote") else "onsite",
                "url": url,
                "source": source,
                "raw_data": item,
            }
        )

    return jobs


def scrape_linkedin_by_url(
    urls: List[str],
    dataset_id: Optional[str] = None,
    api_key: Optional[str] = None,
    output_jobs: bool = True,
) -> List[Dict[str, Any]]:
    """Scrape LinkedIn job/search/company pages by URL via Brightdata."""
    if dataset_id is None:
        dataset_id = os.getenv("BRIGHTDATA_DATASET_LINKEDIN_URL")
    if not dataset_id:
        raise EnvironmentError(
            "Brightdata LinkedIn URL dataset ID is missing. Set BRIGHTDATA_DATASET_LINKEDIN_URL."
        )

    payload = [{"url": url} for url in urls]
    response = send_brightdata_request(
        payload,
        dataset_id=dataset_id,
        request_type="discover_new",
        discover_by="url",
        api_key=api_key,
    )

    output = response.get("output") or response.get("results") or []
    if output_jobs:
        return normalize_brightdata_jobs(output)
    return output


def scrape_linkedin_by_keyword(
    inputs: List[Dict[str, Any]],
    dataset_id: Optional[str] = None,
    api_key: Optional[str] = None,
    output_jobs: bool = True,
) -> List[Dict[str, Any]]:
    """Scrape LinkedIn job search results by keyword/location via Brightdata."""
    if dataset_id is None:
        dataset_id = os.getenv("BRIGHTDATA_DATASET_LINKEDIN_KEYWORD")
    if not dataset_id:
        raise EnvironmentError(
            "Brightdata LinkedIn keyword dataset ID is missing. Set BRIGHTDATA_DATASET_LINKEDIN_KEYWORD."
        )

    response = send_brightdata_request(
        inputs,
        dataset_id=dataset_id,
        request_type="discover_new",
        discover_by="keyword",
        api_key=api_key,
    )

    output = response.get("output") or response.get("results") or []
    if output_jobs:
        return normalize_brightdata_jobs(output)
    return output


def scrape_linkedin_companies(
    urls: List[str],
    dataset_id: Optional[str] = None,
    api_key: Optional[str] = None,
    output_jobs: bool = False,
) -> List[Dict[str, Any]]:
    """Scrape LinkedIn company pages via Brightdata."""
    if dataset_id is None:
        dataset_id = os.getenv("BRIGHTDATA_DATASET_LINKEDIN_COMPANY")
    if not dataset_id:
        raise EnvironmentError(
            "Brightdata LinkedIn company dataset ID is missing. Set BRIGHTDATA_DATASET_LINKEDIN_COMPANY."
        )

    payload = [{"url": url} for url in urls]
    response = send_brightdata_request(
        payload,
        dataset_id=dataset_id,
        api_key=api_key,
    )

    return response.get("output") or response.get("results") or []
