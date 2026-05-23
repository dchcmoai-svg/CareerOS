import requests
import json
from typing import List, Dict, Any


def scrape_lever_jobs(company: str = "atlassian", source: str = "lever") -> List[Dict[str, Any]]:
    """
    Scrape jobs from Lever platform.

    Lever often exposes JSON APIs at: https://api.lever.co/v0/postings/{company}?mode=json

    Args:
        company: Company name for Lever board (e.g., 'atlassian', 'notion')
        source: Identifier to mark the origin of the job data

    Returns:
        List of standardized job dictionaries
    """
    jobs = []

    # Try JSON API first (preferred method)
    api_url = f"https://api.lever.co/v0/postings/{company}?mode=json"

    try:
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()
        data = response.json()

        print(f"Found {len(data)} jobs via Lever JSON API for {company}")

        for job_data in data:
            try:
                job = {
                    "title": job_data.get("text", "").strip(),
                    "company": job_data.get("company", company).strip(),
                    "department": job_data.get("categories", {}).get("department", "").strip(),
                    "team": job_data.get("categories", {}).get("team", "").strip(),
                    "office_location": job_data.get("categories", {}).get("location", "").strip(),
                    "remote_location": job_data.get("categories", {}).get("remote", "").strip() or "Remote",
                    "work_mode": "remote" if job_data.get("categories", {}).get("remote") else "onsite",
                    "url": job_data.get("hostedUrl", "").strip(),
                    "source": source,
                    "salary": "",  # Lever doesn't typically include salary
                }

                # Only add if we have essential fields
                if job["title"] and job["company"] and job["url"]:
                    jobs.append(job)

            except Exception as e:
                print(f"Error parsing job data for {company}: {e}")
                continue

    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print(f"JSON API failed for {company}: Company not using Lever (404)")
        else:
            print(f"JSON API failed for {company}: HTTP {e.response.status_code}")
    except Exception as e:
        print(f"JSON API failed for {company}: {str(e)}")

    print(f"Found {len(jobs)} jobs for {company}")
    return jobs


def scrape_stripe_lever_jobs() -> List[Dict[str, Any]]:
    """
    Scrape all jobs from Stripe's Lever board.

    Returns:
        List of standardized Stripe Lever job dictionaries
    """
    return scrape_lever_jobs(company="stripe", source="stripe-lever")


def scrape_lever_jobs_multiple_companies(companies: List[str] = None) -> List[Dict[str, Any]]:
    """
    Scrape jobs from multiple Lever companies.

    Args:
        companies: List of company names, defaults to popular ones

    Returns:
        Combined list of all jobs
    """
    if companies is None:
        # These companies have been tested and found to not use Lever (404s)
        # Keeping list minimal as Lever adoption is declining
        companies = ["atlassian"]

    all_jobs = []

    for company in companies:
        print(f"Scraping Lever jobs for {company}...")
        jobs = scrape_lever_jobs(company)
        all_jobs.extend(jobs)
        print(f"Found {len(jobs)} jobs for {company}")

    return all_jobs