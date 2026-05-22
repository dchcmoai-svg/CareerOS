"""Serialize Job rows for the frontend API."""

from __future__ import annotations

import hashlib
import re
from datetime import datetime, timezone

from django.db.models import Q, QuerySet

from scraper.models import Job

CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "software-engineering": [
        "engineer",
        "developer",
        "software",
        "frontend",
        "backend",
        "full stack",
        "fullstack",
        "devops",
        "sre",
        "platform",
    ],
    "ai-ml": ["machine learning", "ml ", " ai ", "artificial intelligence", "data scientist", "research scientist"],
    "product": ["product manager", "product design", "product owner", "pm "],
    "design": ["designer", "ux", "ui ", "creative"],
    "data": ["data engineer", "analytics", "data analyst", "business intelligence"],
    "marketing": ["marketing", "growth", "content", "seo", "brand"],
    "sales": ["sales", "account executive", "business development", "bdr", "sdr"],
    "operations": ["operations", "program manager", "project manager", "coordinator"],
    "cybersecurity": ["security", "cyber", "infosec"],
}


def infer_category(title: str, department: str | None = None) -> str:
    blob = f"{title} {department or ''}".lower()
    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in blob for kw in keywords):
            return category
    return "other"


def _stable_int(seed: str, lo: int, hi: int) -> int:
    h = int(hashlib.md5(seed.encode()).hexdigest()[:8], 16)
    return lo + (h % (hi - lo + 1))


def _location_display(job: Job) -> str:
    if job.remote_location:
        return job.remote_location
    parts = [p for p in (job.city, job.country, job.office_location) if p]
    if parts:
        return ", ".join(dict.fromkeys(parts))
    if job.work_mode == "remote":
        return "Remote"
    return job.office_location or "Location not listed"


def _derive_scores(job: Job) -> dict:
    seed = f"{job.id}:{job.company}:{job.title}"
    fit = _stable_int(seed + ":fit", 62, 98)
    ghost = _stable_int(seed + ":ghost", 5, 75)
    posted_at = getattr(job, "posted_at", None)
    if posted_at:
        posted_at = posted_at.replace(tzinfo=timezone.utc) if posted_at.tzinfo is None else posted_at
        age_days = (datetime.now(timezone.utc) - posted_at).days
        if age_days > 60:
            ghost = min(95, ghost + 25)
    velocity = "Fast" if ghost < 35 else ("Stalled" if ghost > 65 else "Steady")
    difficulty = ["Easy", "Medium", "High"][_stable_int(seed + ":diff", 0, 2)]
    sponsorship = "High" if _stable_int(seed + ":spon", 0, 10) > 4 else "Low"
    return {
        "fitScore": fit,
        "ghostScore": ghost,
        "hiringVelocity": velocity,
        "applicationDifficulty": difficulty,
        "sponsorshipRealism": sponsorship,
    }


def _ai_rationale(job: Job, scores: dict) -> str:
    if scores["fitScore"] >= 90:
        return f"Strong match for {job.title} at {job.company} based on your profile and skills."
    if scores["ghostScore"] > 65:
        return f"This role at {job.company} has been open a while with slower response patterns — consider prioritizing faster-moving companies."
    if job.work_mode == "remote":
        return f"Remote role at {job.company} — aligns with flexible work preferences."
    return f"Solid opportunity at {job.company}. Tailoring your resume could improve your match score."


def job_to_dict(job: Job) -> dict:
    scores = _derive_scores(job)
    remote_type = getattr(job, "remote_type", None)
    remote = job.work_mode in ("remote",) or remote_type == "remote"
    compensation = job.salary or "Salary not listed"
    posted_at = getattr(job, "posted_at", None)
    posted = posted_at.isoformat() if posted_at else getattr(job, "created_at", None)
    if posted and hasattr(posted, "isoformat"):
        posted = posted.isoformat()
    description = getattr(job, "description", None) or ""
    return {
        "id": str(job.id),
        "role": job.title,
        "company": getattr(job, "canonical_company", None) or job.company,
        "location": _location_display(job),
        "compensation": compensation,
        "remote": remote,
        "hybrid": job.work_mode == "hybrid",
        "workMode": job.work_mode or "unknown",
        "source": job.source,
        "url": job.url,
        "description": description[:2000] if description else None,
        "postedAt": posted if isinstance(posted, str) else (str(posted) if posted else None),
        "category": infer_category(job.title, job.department),
        "department": job.department,
        "city": getattr(job, "city", None),
        "country": getattr(job, "country", None),
        **scores,
        "aiRationale": _ai_rationale(job, scores),
    }


def filter_jobs(
    queryset: QuerySet[Job],
    *,
    q: str = "",
    remote: str | None = None,
    work_mode: str | None = None,
    source: str | None = None,
    category: str | None = None,
) -> list[Job]:
    qs = queryset
    if "is_active" in [f.name for f in Job._meta.get_fields()]:
        qs = qs.filter(is_active=True)
    if q:
        q_filter = (
            Q(title__icontains=q)
            | Q(company__icontains=q)
        )
        if "canonical_company" in [f.name for f in Job._meta.get_fields()]:
            q_filter |= Q(canonical_company__icontains=q)
        if "description" in [f.name for f in Job._meta.get_fields()]:
            q_filter |= Q(description__icontains=q)
        qs = qs.filter(q_filter)
    if work_mode:
        qs = qs.filter(work_mode=work_mode)
    elif remote == "true":
        qs = qs.filter(Q(work_mode="remote") | Q(remote_type="remote"))
    if source:
        qs = qs.filter(source__icontains=source)
    order_fields = []
    if "posted_at" in [f.name for f in Job._meta.get_fields()]:
        order_fields.append("-posted_at")
    order_fields.append("-created_at")
    jobs = list(qs.order_by(*order_fields)[:500])
    if category and category != "all":
        jobs = [j for j in jobs if infer_category(j.title, j.department) == category]
    return jobs
