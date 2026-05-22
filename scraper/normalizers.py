import logging
import re
import json
import html as html_lib
from bs4 import BeautifulSoup
from datetime import datetime
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)

HTML_TAG_RE = re.compile(r'<[^>]+>')


def _strip_html(text: str) -> str:
    if not isinstance(text, str):
        text = str(text or "")
    # Use BeautifulSoup to handle nested tags and entities
    try:
        soup = BeautifulSoup(text, "html.parser")
        cleaned = soup.get_text(separator="\n")
    except Exception:
        cleaned = HTML_TAG_RE.sub('', text)
    # Unescape HTML entities
    return html_lib.unescape(cleaned)


def clean_html_description(text: Any) -> str:
    """
    Convert raw HTML job descriptions into clean readable text.
    Removes script/style tags, decodes entities, and collapses whitespace.
    """
    if text is None:
        return ""
    if not isinstance(text, str):
        text = _flatten_value(text)
    # Unescape then parse
    try:
        text = html_lib.unescape(text)
        soup = BeautifulSoup(text, "html.parser")
        for tag in soup(["script", "style"]):
            tag.decompose()
        cleaned = soup.get_text(separator=" ", strip=True)
    except Exception:
        cleaned = _strip_html(text)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def _flatten_value(value: Any) -> str:
    if value is None:
        return ''
    if isinstance(value, str):
        return value
    if isinstance(value, (list, tuple, set)):
        return ' '.join(_flatten_value(item) for item in value if _flatten_value(item))
    if isinstance(value, dict):
        flattened_items = []
        for key, item in value.items():
            item_text = _flatten_value(item)
            if item_text:
                flattened_items.append(f"{key}: {item_text}")
        return ' '.join(flattened_items)
    return str(value)


def _clean_text(value: Any) -> str:
    if value is None:
        return ''
    if isinstance(value, str):
        return _strip_html(value).strip()
    return _strip_html(_flatten_value(value)).strip()

REMOTE_MAP = {
    "remote": "remote",
    "remote-first": "remote",
    "remote only": "remote",
    "onsite": "onsite",
    "on-site": "onsite",
    "hybrid": "hybrid",
    "unknown": "unknown",
}

COMPANY_SUFFIXES = [
    "inc", "inc.", "llc", "llp", "ltd", "ltd.", "corp", "corp.", "co", "co.", "company", "group", "plc", "sa", "gmbh", "bv", "sarl", "pte", "pty", "limited"
]


# Note: `_clean_text` defined above uses HTML stripping and unescape.


def normalize_remote_type(value: Any) -> str:
    raw_value = _clean_text(value).lower()
    if not raw_value:
        return "unknown"

    for token, normalized in REMOTE_MAP.items():
        if token in raw_value:
            return normalized

    if "remote" in raw_value:
        return "remote"
    if "hybrid" in raw_value:
        return "hybrid"
    if "onsite" in raw_value or "on site" in raw_value:
        return "onsite"
    return "unknown"


def parse_location(raw_location: Any) -> Dict[str, str]:
    location = _clean_text(raw_location)
    if not location:
        return {
            "location": "Unknown",
            "city": "",
            "country": "",
        }

    if location.lower() == "remote":
        return {
            "location": "Remote",
            "city": "",
            "country": "",
        }

    parts = [part.strip() for part in location.split(",") if part.strip()]
    city = parts[0] if parts else ""
    country = parts[-1] if len(parts) > 1 else ""
    return {
        "location": location[:255],
        "city": city[:255],
        "country": country[:255],
    }


def parse_posted_at(raw_posted_at: Any) -> Optional[datetime]:
    if raw_posted_at is None:
        return None

    if isinstance(raw_posted_at, datetime):
        return raw_posted_at

    if isinstance(raw_posted_at, (int, float)):
        try:
            return datetime.fromtimestamp(raw_posted_at)
        except (OSError, ValueError):
            return None

    posted_text = _clean_text(raw_posted_at)
    if not posted_text:
        return None

    try:
        if posted_text.endswith("Z"):
            posted_text = posted_text[:-1] + "+00:00"
        return datetime.fromisoformat(posted_text)
    except ValueError:
        pass

    date_formats = [
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    ]
    for fmt in date_formats:
        try:
            return datetime.strptime(posted_text, fmt)
        except ValueError:
            continue

    logger.debug("Unable to parse posted_at value: %s", raw_posted_at)
    return None


def normalize_company_name(name: Any) -> str:
    name_text = _clean_text(name).lower()
    if not name_text:
        return ""

    tokens = [token for token in name_text.replace(",", " ").split() if token]
    if not tokens:
        return ""

    if tokens[-1] in COMPANY_SUFFIXES:
        tokens = tokens[:-1]

    normalized = " ".join(tokens)
    return normalized.title()


def normalize_job_title(title: Any) -> str:
    return _clean_text(title).title()


def _fallback_get(raw: Dict[str, Any], *keys):
    for k in keys:
        v = raw.get(k)
        if v is not None and (not isinstance(v, str) or v.strip()):
            return v
    return None


def _detect_seniority_from_tags(tags: Any) -> str:
    if not tags:
        return ""
    text = _flatten_value(tags).lower()
    if "senior" in text or "sr" in text:
        return "Senior"
    if "mid" in text or "mid-level" in text:
        return "Mid"
    if "junior" in text or "jr" in text:
        return "Junior"
    if "lead" in text:
        return "Lead"
    return ""


def normalize_remoteok(raw: Dict[str, Any]) -> Dict[str, Any]:
    title = normalize_job_title(_fallback_get(raw, "position", "title", "job_title"))
    company = _clean_text(_fallback_get(raw, "company", "company_name"))
    location = _fallback_get(raw, "location", "tags")
    # tags often contain seniority/employment info on RemoteOK
    seniority = _detect_seniority_from_tags(raw.get("tags"))
    employment = _fallback_get(raw, "type", "employment_type") or ""
    salary = _fallback_get(raw, "salary", "salary_min", "salary_max", "compensation")
    description = _clean_text(_fallback_get(raw, "description", "job_description", "body"))
    source_url = _clean_text(_fallback_get(raw, "url", "link", "apply_link"))
    posted_at = parse_posted_at(_fallback_get(raw, "date", "posted_at", "posted"))

    loc = parse_location(location)

    return {
        "title": title,
        "canonical_title": normalize_job_title(title),
        "company": company,
        "canonical_company": normalize_company_name(company),
        "office_location": loc["location"],
        "city": loc["city"],
        "country": loc["country"],
        "remote_type": normalize_remote_type(location),
        "source_url": source_url,
        "source": _clean_text(raw.get("source") or "remoteok"),
        "description": description,
        "posted_at": posted_at,
        "raw_data": raw,
        "salary": _clean_text(salary),
        "seniority": seniority,
        "employment_type": _clean_text(employment),
    }


def normalize_greenhouse(raw: Dict[str, Any]) -> Dict[str, Any]:
    title = normalize_job_title(_fallback_get(raw, "title", "job_title"))
    company = _clean_text(_fallback_get(raw, "company", "company_name", "employer"))
    location = None
    if isinstance(raw.get("location"), dict):
        location = raw.get("location").get("name")
    else:
        location = _fallback_get(raw, "location", "job_location")

    seniority = _fallback_get(raw, "seniority", "level", "job_seniority_level") or _detect_seniority_from_tags(raw.get("tags"))
    employment = _fallback_get(raw, "employment_type", "job_type", "type")
    salary = _fallback_get(raw, "compensation", "salary", "salary_range")
    description = _clean_text(_fallback_get(raw, "description", "job_description", "body"))
    source_url = _clean_text(_fallback_get(raw, "url", "apply_url", "job_url"))
    posted_at = parse_posted_at(_fallback_get(raw, "posted_at", "job_posted_date", "posted"))

    loc = parse_location(location)

    return {
        "title": title,
        "canonical_title": normalize_job_title(title),
        "company": company,
        "canonical_company": normalize_company_name(company),
        "office_location": loc["location"],
        "city": loc["city"],
        "country": loc["country"],
        "remote_type": normalize_remote_type(location),
        "source_url": source_url,
        "source": _clean_text(raw.get("source") or "greenhouse"),
        "description": description,
        "posted_at": posted_at,
        "raw_data": raw,
        "salary": _clean_text(salary),
        "seniority": _clean_text(seniority),
        "employment_type": _clean_text(employment),
    }


def normalize_linkedin(raw: Dict[str, Any]) -> Dict[str, Any]:
    # BrightData LinkedIn payloads often use job_title, job_location, employment_type
    title = normalize_job_title(_fallback_get(raw, "job_title", "jobTitle", "title", "position"))
    company = _clean_text(_fallback_get(raw, "company", "companyName", "employer"))
    location = _fallback_get(raw, "job_location", "jobLocation", "location")
    employment = _fallback_get(raw, "employment_type", "type")
    salary = _fallback_get(raw, "salary", "compensation")
    seniority = _fallback_get(raw, "seniority", "level") or _detect_seniority_from_tags(raw.get("tags"))
    description = _clean_text(_fallback_get(raw, "description", "job_description", "summary"))
    source_url = _clean_text(_fallback_get(raw, "job_url", "url", "link", "apply_link"))
    posted_at = parse_posted_at(_fallback_get(raw, "posted_at", "date", "posted"))

    loc = parse_location(location)

    return {
        "title": title,
        "canonical_title": normalize_job_title(title),
        "company": company,
        "canonical_company": normalize_company_name(company),
        "office_location": loc["location"],
        "city": loc["city"],
        "country": loc["country"],
        "remote_type": normalize_remote_type(location),
        "source_url": source_url,
        "source": _clean_text(raw.get("source") or "linkedin"),
        "description": description,
        "posted_at": posted_at,
        "raw_data": raw,
        "salary": _clean_text(salary),
        "seniority": _clean_text(seniority),
        "employment_type": _clean_text(employment),
    }


def normalize_job(raw_data: Dict[str, Any], source: Optional[str] = None) -> Dict[str, Any]:
    if not isinstance(raw_data, dict):
        raw_data = {}

    src = (source or _clean_text(raw_data.get("source")) or "").lower()

    # Dispatch to source-specific normalizers when available
    try:
        if "remoteok" in src or src == "remoteok":
            return normalize_remoteok(raw_data)
        if "greenhouse" in src or src == "greenhouse":
            return normalize_greenhouse(raw_data)
        if "linkedin" in src or "brightdata" in src or src == "linkedin":
            return normalize_linkedin(raw_data)
    except Exception:
        logger.exception("Error in source-specific normalizer for %s", src)

    # Generic fallback normalization (keeps previous behavior)
    title = normalize_job_title(
        raw_data.get("title")
        or raw_data.get("job_title")
        or raw_data.get("position")
        or raw_data.get("headline")
    )

    company = _clean_text(
        raw_data.get("company")
        or raw_data.get("company_name")
        or raw_data.get("employer")
        or raw_data.get("organization")
    )

    canonical_company = normalize_company_name(company)
    canonical_title = normalize_job_title(title)

    location_value = (
        raw_data.get("location")
        or raw_data.get("job_location")
        or raw_data.get("office_location")
        or raw_data.get("remote_location")
        or raw_data.get("location_name")
    )
    location_data = parse_location(location_value)

    source_url = _clean_text(
        raw_data.get("url")
        or raw_data.get("source_url")
        or raw_data.get("jobUrl")
        or raw_data.get("link")
        or raw_data.get("apply_link")
    )

    description = _clean_text(
        raw_data.get("job_summary")
        or raw_data.get("job_description_formatted")
        or raw_data.get("description")
        or raw_data.get("job_description")
        or raw_data.get("summary")
    )

    remote_type = normalize_remote_type(
        raw_data.get("remote")
        or raw_data.get("work_mode")
        or raw_data.get("job_type")
        or raw_data.get("employment_type")
        or location_value
    )

    posted_at = parse_posted_at(
        raw_data.get("job_posted_date")
        or raw_data.get("job_posted_time")
        or raw_data.get("posted_date")
        or raw_data.get("posted_at")
        or raw_data.get("posted")
    )

    # Fallback extractions
    salary = _clean_text(_fallback_get(raw_data, "salary", "salary_str", "compensation", "base_salary"))
    seniority = _clean_text(_fallback_get(raw_data, "seniority", "level", "job_seniority_level")) or _detect_seniority_from_tags(raw_data.get("tags"))
    employment_type = _clean_text(_fallback_get(raw_data, "employment_type", "job_type", "type"))

    normalized = {
        "title": title,
        "canonical_title": canonical_title,
        "company": company,
        "canonical_company": canonical_company,
        "office_location": location_data["location"],
        "city": location_data["city"],
        "country": location_data["country"],
        "remote_type": remote_type,
        "source_url": source_url,
        "source": source or _clean_text(raw_data.get("source")) or "unknown",
        "description": description,
        "posted_at": posted_at,
        "raw_data": raw_data,
        "salary": salary,
        "seniority": seniority,
        "employment_type": employment_type,
    }

    if raw_data.get("work_mode") and not remote_type:
        normalized["remote_type"] = normalize_remote_type(raw_data.get("work_mode"))

    # Debug logging to help trace unmapped payloads
    if logger.isEnabledFor(logging.DEBUG):
        missing = [k for k in ("office_location", "salary", "seniority", "employment_type") if not normalized.get(k)]
        if missing:
            logger.debug("Normalization missing fields %s for source=%s keys=%s", missing, src, list(raw_data.keys()))

    return normalized


def is_valid_job(normalized_job: Dict[str, Any]) -> bool:
    required_fields = ["title", "company", "source_url"]
    for field in required_fields:
        value = normalized_job.get(field)
        if not value or (isinstance(value, str) and not value.strip()):
            logger.warning("Job rejected during validation: missing %s", field)
            return False
    return True

def normalize_company_name(name: Any) -> str:
    name_text = _clean_text(name).lower()
    if not name_text:
        return ""

    tokens = [token for token in name_text.replace(',', ' ').split() if token]
    if not tokens:
        return ""

    if tokens[-1] in COMPANY_SUFFIXES:
        tokens = tokens[:-1]

    normalized = " ".join(tokens)
    return normalized.title()


def normalize_job_title(title: Any) -> str:
    return _clean_text(title).title()


def normalize_job(raw_data: Dict[str, Any], source: Optional[str] = None) -> Dict[str, Any]:
    if not isinstance(raw_data, dict):
        raw_data = {}

    src = (source or _clean_text(raw_data.get("source")) or "").lower()

    # Dispatch to source-specific normalizers when available
    try:
        if "remoteok" in src or src == "remoteok":
            return normalize_remoteok(raw_data)
        if "greenhouse" in src or src == "greenhouse":
            return normalize_greenhouse(raw_data)
        if "linkedin" in src or "brightdata" in src or src == "linkedin":
            return normalize_linkedin(raw_data)
    except Exception:
        logger.exception("Error in source-specific normalizer for %s", src)

    # Generic fallback normalization (keeps previous behavior)
    title = normalize_job_title(
        raw_data.get("title")
        or raw_data.get("job_title")
        or raw_data.get("position")
        or raw_data.get("headline")
    )

    company = _clean_text(
        raw_data.get("company")
        or raw_data.get("company_name")
        or raw_data.get("employer")
        or raw_data.get("organization")
    )

    canonical_company = normalize_company_name(company)
    canonical_title = normalize_job_title(title)

    location_value = (
        raw_data.get("location")
        or raw_data.get("job_location")
        or raw_data.get("office_location")
        or raw_data.get("remote_location")
        or raw_data.get("location_name")
    )
    location_data = parse_location(location_value)

    source_url = _clean_text(
        raw_data.get("url")
        or raw_data.get("source_url")
        or raw_data.get("jobUrl")
        or raw_data.get("link")
        or raw_data.get("apply_link")
    )

    description = _clean_text(
        raw_data.get("job_summary")
        or raw_data.get("job_description_formatted")
        or raw_data.get("description")
        or raw_data.get("job_description")
        or raw_data.get("summary")
    )

    remote_type = normalize_remote_type(
        raw_data.get("remote")
        or raw_data.get("work_mode")
        or raw_data.get("job_type")
        or raw_data.get("employment_type")
        or location_value
    )

    posted_at = parse_posted_at(
        raw_data.get("job_posted_date")
        or raw_data.get("job_posted_time")
        or raw_data.get("posted_date")
        or raw_data.get("posted_at")
        or raw_data.get("posted")
    )

    # Fallback extractions
    salary = _clean_text(_fallback_get(raw_data, "salary", "salary_str", "compensation", "base_salary"))
    seniority = _clean_text(_fallback_get(raw_data, "seniority", "level", "job_seniority_level")) or _detect_seniority_from_tags(raw_data.get("tags"))
    employment_type = _clean_text(_fallback_get(raw_data, "employment_type", "job_type", "type"))

    normalized = {
        "title": title,
        "canonical_title": canonical_title,
        "company": company,
        "canonical_company": canonical_company,
        "office_location": location_data["location"],
        "city": location_data["city"],
        "country": location_data["country"],
        "remote_type": remote_type,
        "source_url": source_url,
        "source": source or _clean_text(raw_data.get("source")) or "unknown",
        "description": description,
        "posted_at": posted_at,
        "raw_data": raw_data,
        "salary": salary,
        "seniority": seniority,
        "employment_type": employment_type,
    }

    if raw_data.get("work_mode") and not remote_type:
        normalized["remote_type"] = normalize_remote_type(raw_data.get("work_mode"))

    # Debug logging to help trace unmapped payloads
    if logger.isEnabledFor(logging.DEBUG):
        missing = [k for k in ("office_location", "salary", "seniority", "employment_type") if not normalized.get(k)]
        if missing:
            logger.debug("Normalization missing fields %s for source=%s keys=%s", missing, src, list(raw_data.keys()))

    return normalized


def is_valid_job(normalized_job: Dict[str, Any]) -> bool:
    required_fields = ["title", "company", "source_url"]
    for field in required_fields:
        value = normalized_job.get(field)
        if not value or (isinstance(value, str) and not value.strip()):
            logger.warning("Job rejected during validation: missing %s", field)
            return False
    return True


def is_valid_job(normalized_job: Dict[str, Any]) -> bool:
    required_fields = ["title", "company", "source_url"]
    for field in required_fields:
        value = normalized_job.get(field)
        if not value or (isinstance(value, str) and not value.strip()):
            logger.warning("Job rejected during validation: missing %s", field)
            return False
    return True
