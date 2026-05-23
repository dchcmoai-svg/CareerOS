import logging

from django.db.models import Q
from django.utils import timezone
from scraper.models import Job, RawJob
from scraper.normalizers import is_valid_job, normalize_job

logger = logging.getLogger(__name__)


def extract_salary(raw_data):
    if not raw_data or not isinstance(raw_data, dict):
        return None

    salary = raw_data.get("salary") or raw_data.get("salary_str")
    if isinstance(salary, str) and salary.strip():
        return salary.strip()

    if isinstance(salary, dict):
        compensation = salary.get("range") or salary.get("display") or salary.get("amount")
        if isinstance(compensation, str) and compensation.strip():
            return compensation.strip()

    compensation = raw_data.get("compensation")
    if isinstance(compensation, str) and compensation.strip():
        return compensation.strip()
    if isinstance(compensation, dict):
        return compensation.get("range") or compensation.get("display")
    if isinstance(compensation, list):
        pieces = []
        for item in compensation:
            if isinstance(item, str) and item.strip():
                pieces.append(item.strip())
            elif isinstance(item, dict):
                text = item.get("range") or item.get("display") or item.get("amount")
                if isinstance(text, str) and text.strip():
                    pieces.append(text.strip())
        return "; ".join(pieces) if pieces else None

    return None


def save_jobs(jobs, run=None):
    """
    Base ingestion helper for saving jobs to database.
    Handles deduplication by URL and updates existing records.

    Args:
        jobs: List of job dictionaries with standardized format
        run: Optional ScrapeRun instance to update with metrics

    Returns:
        dict: Summary of save operation
    """
    saved_count = 0
    updated_count = 0
    errors = []

    rejected_count = 0
    duplicate_count = 0

    for job in jobs:
        raw_data = job.get("raw_data") if isinstance(job.get("raw_data"), dict) else job
        source = job.get("source") or raw_data.get("source") or "unknown"

        raw_job = RawJob.objects.create(
            source=source,
            raw_data=raw_data,
        )

        try:
            normalized = normalize_job(raw_data, source=source)

            # Merge key normalized fields back into raw_data to make them available to exporters
            try:
                if isinstance(normalized, dict):
                    for k in ("salary", "seniority", "employment_type", "office_location", "posted_at"):
                        v = normalized.get(k)
                        if v is not None and (not isinstance(v, str) or v.strip()):
                            # store datetimes as ISO strings
                            if hasattr(v, "isoformat"):
                                raw_data[k] = v.isoformat()
                            else:
                                raw_data[k] = v
            except Exception:
                pass

            if not is_valid_job(normalized):
                rejected_count += 1
                errors.append(
                    f"Rejected raw job from {source}: missing required fields; source_url={normalized.get('source_url')}"
                )
                raw_job.processed = True
                raw_job.processed_at = timezone.now()
                raw_job.save(update_fields=["processed", "processed_at"])
                continue

            # Prefer salary extracted by normalizer; fall back to legacy extractor
            salary = normalized.get("salary") or extract_salary(raw_data)
            job_url = normalized["source_url"]

            existing_job = Job.objects.filter(url__iexact=job_url).first()
            if not existing_job and normalized.get("canonical_company") and normalized.get("canonical_title"):
                existing_job = Job.objects.filter(
                    canonical_company__iexact=normalized["canonical_company"],
                    title__iexact=normalized["title"],
                ).first()

            defaults = {
                "title": normalized["title"],
                "company": normalized["company"],
                "canonical_company": normalized.get("canonical_company"),
                "department": job.get("department"),
                "team": job.get("team"),
                "office_location": normalized["office_location"],
                "remote_location": job.get("remote_location"),
                "work_mode": normalized["remote_type"],
                "city": normalized["city"],
                "country": normalized["country"],
                "remote_type": normalized["remote_type"],
                "description": normalized["description"],
                "posted_at": normalized["posted_at"],
                "source": normalized["source"],
                "raw_data": raw_data,
                "salary": salary,
                "last_seen_at": timezone.now(),
                "is_active": True,
                "expired_at": None,
            }

            if existing_job:
                obj = existing_job
                for field, value in defaults.items():
                    setattr(obj, field, value)
                obj.save()
                updated_count += 1
                if obj.url.lower() != job_url.lower():
                    duplicate_count += 1
            else:
                obj = Job.objects.create(url=job_url, **defaults)
                saved_count += 1

            raw_job.processed = True
            raw_job.processed_at = timezone.now()
            raw_job.save(update_fields=["processed", "processed_at"])
        except Exception as e:
            logger.warning("Normalization or save failure for raw job from %s: %s", source, str(e))
            errors.append(f"Error saving job {raw_data.get('url', 'unknown')}: {str(e)}")
            raw_job.processed = True
            raw_job.processed_at = timezone.now()
            raw_job.save(update_fields=["processed", "processed_at"])

    result = {
        "records_received": len(jobs),
        "records_saved": saved_count,
        "records_updated": updated_count,
        "records_rejected": rejected_count,
        "duplicate_records": duplicate_count,
        "errors": errors,
        "total_processed": len(jobs),
    }

    if run is not None:
        run.records_received = result["records_received"]
        run.records_saved = result["records_saved"]
        run.records_rejected = result["records_rejected"]
        run.records_updated = result["records_updated"]
        run.duplicate_records = result["duplicate_records"]
        run.errors = result["errors"] or None
        run.status = "success" if not errors else "partial"
        run.finished_at = timezone.now()
        run.save()

    if rejected_count > 0 or duplicate_count > 0:
        logger.warning(
            "Save pipeline stats: saved=%s updated=%s rejected=%s duplicate=%s",
            saved_count,
            updated_count,
            rejected_count,
            duplicate_count,
        )

    return result
