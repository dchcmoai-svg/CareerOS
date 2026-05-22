import json
import os
from pathlib import Path

from django.db import connection
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from scraper.job_api import filter_jobs, job_to_dict
from scraper.models import Job


def _cors_response(data, status=200):
    resp = JsonResponse(data, status=status, safe=isinstance(data, dict))
    origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    resp["Access-Control-Allow-Origin"] = origin
    resp["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    resp["Access-Control-Allow-Headers"] = "Content-Type"
    return resp


@require_GET
def jobs_list_api(request):
    """GET /api/jobs/ — list active scraped jobs with optional filters."""
    if request.method == "OPTIONS":
        return _cors_response({})

    q = request.GET.get("q", "").strip()
    remote = request.GET.get("remote")
    work_mode = request.GET.get("work_mode")
    source = request.GET.get("source")
    category = request.GET.get("category")
    limit = min(int(request.GET.get("limit", 100)), 200)
    offset = max(int(request.GET.get("offset", 0)), 0)

    try:
        base_qs = Job.objects.all()
        jobs = filter_jobs(
            base_qs,
            q=q,
            remote=remote,
            work_mode=work_mode,
            source=source,
            category=category,
        )
        total = len(jobs)
        page = jobs[offset : offset + limit]
        payload = {
            "jobs": [job_to_dict(j) for j in page],
            "total": total,
            "offset": offset,
            "limit": limit,
            "sources": list(
                Job.objects.values_list("source", flat=True).distinct()[:50]
            )
            if connection.introspection.table_names()
            else [],
        }
        return _cors_response(payload)
    except Exception as exc:
        return _cors_response({"error": str(exc), "jobs": [], "total": 0}, status=500)


@require_GET
def jobs_stats_api(request):
    """GET /api/jobs/stats/ — aggregate counts for filters UI."""
    try:
        qs = Job.objects.all()
        if hasattr(Job, "is_active"):
            qs = qs.filter(is_active=True)
        total = qs.count()
        remote_count = qs.filter(work_mode="remote").count()
        return _cors_response(
            {
                "total": total,
                "remote": remote_count,
                "db": connection.settings_dict.get("NAME", ""),
            }
        )
    except Exception as exc:
        return _cors_response({"error": str(exc), "total": 0}, status=500)
