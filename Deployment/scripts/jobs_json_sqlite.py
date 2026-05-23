#!/usr/bin/env python3
"""Export jobs from local SQLite without Django ORM (legacy schema safe)."""
import hashlib
import html
import json
import os
import sqlite3
from datetime import datetime, timezone

# Navigate from Deployment/scripts/ to Backend/
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_ROOT = os.path.normpath(os.path.join(SCRIPT_DIR, "..", "..", "Backend"))
DB = os.getenv("SQLITE_PATH", os.path.join(BACKEND_ROOT, "db.sqlite3"))

CATEGORY_KEYWORDS = {
    "software-engineering": ["engineer", "developer", "software", "frontend", "backend", "devops", "sre"],
    "ai-ml": ["machine learning", " data scientist", " ai ", "ml engineer"],
    "product": ["product manager", "product owner"],
    "design": ["designer", " ux", " ui "],
    "data": ["data engineer", "analytics", "data analyst"],
    "marketing": ["marketing", "growth", "content"],
    "sales": ["sales", "account executive", "bdr", "sdr"],
    "operations": ["operations", "program manager", "project manager"],
    "cybersecurity": ["security", "cyber", "infosec"],
}


def infer_category(title: str, department: str = "") -> str:
    blob = f"{title} {department}".lower()
    for cat, kws in CATEGORY_KEYWORDS.items():
        if any(k in blob for k in kws):
            return cat
    return "other"


def stable_int(seed: str, lo: int, hi: int) -> int:
    h = int(hashlib.md5(seed.encode()).hexdigest()[:8], 16)
    return lo + (h % (hi - lo + 1))


def clean(s: str | None) -> str:
    if not s:
        return ""
    return html.unescape(str(s)).strip()


def row_to_job(row: dict) -> dict:
    title = clean(row["title"])
    company = clean(row["company"])
    seed = f"{row['id']}:{company}:{title}"
    fit = stable_int(seed + ":fit", 62, 98)
    ghost = stable_int(seed + ":ghost", 5, 75)
    velocity = "Fast" if ghost < 35 else ("Stalled" if ghost > 65 else "Steady")
    difficulty = ["Easy", "Medium", "High"][stable_int(seed + ":diff", 0, 2)]
    sponsorship = "High" if stable_int(seed + ":spon", 0, 10) > 4 else "Low"
    wm = (row.get("work_mode") or "unknown").lower()
    remote = wm == "remote"
    loc_parts = [row.get("office_location"), row.get("remote_location")]
    location = ", ".join(dict.fromkeys([p for p in loc_parts if p])) or ("Remote" if remote else "Location not listed")
    posted = row.get("created_at")
    return {
        "id": str(row["id"]),
        "role": title,
        "company": company,
        "location": location,
        "compensation": row.get("salary") or "Salary not listed",
        "remote": remote,
        "hybrid": wm == "hybrid",
        "workMode": wm,
        "source": row.get("source", ""),
        "url": row.get("url", ""),
        "postedAt": posted,
        "category": infer_category(row["title"], row.get("department") or ""),
        "fitScore": fit,
        "ghostScore": ghost,
        "hiringVelocity": velocity,
        "applicationDifficulty": difficulty,
        "sponsorshipRealism": sponsorship,
        "aiRationale": (
            f"Strong match for {row['title']} at {row['company']}."
            if fit >= 90
            else f"Good opportunity at {row['company']} — tailor your resume to stand out."
        ),
    }


def main():
    q = os.getenv("JOBS_Q", "").lower()
    category = os.getenv("JOBS_CATEGORY", "")
    remote_only = os.getenv("JOBS_REMOTE") == "true"
    limit = int(os.getenv("JOBS_LIMIT", "100"))
    offset = int(os.getenv("JOBS_OFFSET", "0"))

    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("SELECT * FROM scraper_job ORDER BY created_at DESC LIMIT 500")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()

    if q:
        rows = [
            r
            for r in rows
            if q in r["title"].lower()
            or q in r["company"].lower()
        ]
    if remote_only:
        rows = [r for r in rows if (r.get("work_mode") or "").lower() == "remote"]
    if category and category != "all":
        rows = [r for r in rows if infer_category(r["title"], r.get("department") or "") == category]

    total = len(rows)
    page = [row_to_job(r) for r in rows[offset : offset + limit]]
    print(json.dumps({"jobs": page, "total": total, "offset": offset, "limit": limit}))


if __name__ == "__main__":
    main()
