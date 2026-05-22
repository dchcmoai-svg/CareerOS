#!/usr/bin/env python3
"""Export jobs as JSON for Next.js when Django server is not running."""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# Prefer local SQLite for offline/dev export
if not os.getenv("DATABASE_URL"):
    os.environ["DATABASE_URL"] = f"sqlite:///{ROOT}/db.sqlite3"

import django

django.setup()

from scraper.job_api import filter_jobs, job_to_dict
from scraper.models import Job


def main():
    q = os.getenv("JOBS_Q", "")
    remote = os.getenv("JOBS_REMOTE") or None
    work_mode = os.getenv("JOBS_WORK_MODE") or None
    category = os.getenv("JOBS_CATEGORY") or None
    source = os.getenv("JOBS_SOURCE") or None
    limit = int(os.getenv("JOBS_LIMIT", "100"))
    offset = int(os.getenv("JOBS_OFFSET", "0"))

    jobs = filter_jobs(
        Job.objects.all(),
        q=q,
        remote=remote,
        work_mode=work_mode,
        source=source,
        category=category,
    )
    total = len(jobs)
    page = jobs[offset : offset + limit]
    print(
        json.dumps(
            {
                "jobs": [job_to_dict(j) for j in page],
                "total": total,
                "offset": offset,
                "limit": limit,
            }
        )
    )


if __name__ == "__main__":
    main()
