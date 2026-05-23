import requests
import json
from typing import List, Dict, Any


def scrape_remoteok_jobs() -> List[Dict[str, Any]]:
    """
    Scrape jobs from RemoteOK using their JSON API.

    RemoteOK API: https://remoteok.com/api

    Returns:
        List of standardized job dictionaries
    """
    jobs = []
    seen_urls = set()

    api_url = "https://remoteok.com/api"

    try:
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()
        data = response.json()

        print(f"Found {len(data)} items from RemoteOK API")

        for job in data:
            # Skip non-job items (API returns metadata first)
            if not isinstance(job, dict) or not job.get("id"):
                continue

            url = job.get("url") or job.get("apply_url")
            if not url:
                continue
            if url in seen_urls:
                continue
            seen_urls.add(url)

            # Extract location information
            office_location = None
            remote_location = None
            work_mode = "remote"  # RemoteOK is remote-first

            # RemoteOK has various location formats
            if job.get("location"):
                remote_location = job.get("location")
            else:
                remote_location = "Remote"

            # Extract company name (may be in different fields)
            company = job.get("company") or job.get("company_name") or "Unknown"

            # Build standardized job dict
            job_dict = {
                "title": job.get("position", "").strip(),
                "company": company,
                "department": job.get("department", ""),
                "team": job.get("team", ""),
                "office_location": office_location,
                "remote_location": remote_location,
                "work_mode": work_mode,
                "url": url,
                "source": "remoteok",
                "raw_data": job  # Store full API response
            }

            jobs.append(job_dict)

    except requests.RequestException as e:
        print(f"RemoteOK API request failed: {e}")
        return []

    except json.JSONDecodeError as e:
        print(f"RemoteOK JSON parsing failed: {e}")
        return []

    return jobs


def scrape_remoteok_jobs_filtered(tags: List[str] = None) -> List[Dict[str, Any]]:
    """
    Scrape RemoteOK jobs filtered by tags.

    Args:
        tags: List of tags to filter by (e.g., ['python', 'react'])

    Returns:
        Filtered list of jobs
    """
    all_jobs = scrape_remoteok_jobs()

    if not tags:
        return all_jobs

    filtered_jobs = []
    for job in all_jobs:
        job_tags = job.get("raw_data", {}).get("tags", [])
        if any(tag.lower() in [t.lower() for t in job_tags] for tag in tags):
            filtered_jobs.append(job)

    return filtered_jobs