import logging
import os
import requests
from celery import shared_task
from datetime import timedelta
from django.utils import timezone
from datetime import timedelta
from scraper.models import Job, ScrapeRun, ScrapeSource
from scraper.services import save_jobs
from scraper.sources.brightdata import (
    scrape_linkedin_by_keyword,
    scrape_linkedin_by_url,
    scrape_linkedin_companies,
)
from scraper.sources.greenhouse import scrape_greenhouse_company_jobs, GREENHOUSE_COMPANIES
from scraper.sources.lever import scrape_lever_jobs_multiple_companies, scrape_stripe_lever_jobs
from scraper.sources.remoteok import scrape_remoteok_jobs
from scraper.exporters.google_sheets import export_jobs_to_google_sheets

logger = logging.getLogger(__name__)


def trigger_jobs_cache_revalidation():
    """Trigger Next.js cache revalidation for jobs API after scraping completes."""
    try:
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        revalidate_token = os.getenv("REVALIDATE_TOKEN", "")
        
        if not revalidate_token:
            logger.warning("REVALIDATE_TOKEN not set, skipping cache revalidation")
            return False
        
        response = requests.post(
            f"{frontend_url}/api/revalidate-jobs",
            headers={
                "X-Revalidate-Token": revalidate_token,
                "Content-Type": "application/json",
            },
            timeout=10,
        )
        
        if response.status_code == 200:
            logger.info("Successfully triggered jobs cache revalidation")
            return True
        else:
            logger.warning(f"Cache revalidation failed with status {response.status_code}")
            return False
    except Exception as e:
        logger.error(f"Error triggering cache revalidation: {str(e)}")
        return False


def create_scrape_run(source: str, company: str | None = None) -> ScrapeRun:
    return ScrapeRun.objects.create(
        source=source,
        company=company,
        status="running",
        started_at=timezone.now(),
    )


def _build_brightdata_inputs(source: ScrapeSource) -> list[dict]:
    inputs = []

    if source.metadata and isinstance(source.metadata, dict):
        urls = source.metadata.get("urls") or []
        if urls:
            return [{"url": url} for url in urls if isinstance(url, str)]

    keywords = source.keywords or []
    locations = source.locations or []

    if keywords:
        for keyword in keywords:
            if locations:
                for location in locations:
                    inputs.append({"keyword": keyword, "location": location})
            else:
                inputs.append({"keyword": keyword})

    return inputs


def _dispatch_source_task(source: ScrapeSource) -> str:
    if source.source_type == "greenhouse":
        scrape_greenhouse_jobs_task.delay()
        return "greenhouse"
    if source.source_type == "remoteok":
        scrape_remoteok_jobs_task.delay()
        return "remoteok"
    if source.source_type == "lever":
        scrape_lever_jobs_task.delay()
        return "lever"
    if source.source_type == "stripe-lever":
        scrape_stripe_lever_jobs_task.delay()
        return "stripe-lever"
    if source.source_type == "linkedin-brightdata":
        inputs = _build_brightdata_inputs(source)
        if inputs:
            scrape_brightdata_linkedin_keyword_task.delay(inputs)
            return "linkedin-brightdata-keyword"
        return "linkedin-brightdata-skip"

    return "unknown"


@shared_task
def run_due_scrape_sources_task():
    """Dispatch enabled ScrapeSource records when they become due."""
    dispatched = []
    now = timezone.now()

    for source in ScrapeSource.objects.filter(enabled=True):
        due_at = (source.last_run_at or now - timedelta(days=365)) + timedelta(minutes=source.scrape_frequency_minutes)
        if due_at > now:
            continue

        dispatched_task = _dispatch_source_task(source)
        source.last_run_at = now
        source.save(update_fields=["last_run_at"])
        dispatched.append(f"{source.name}:{dispatched_task}")

    return f"Dispatched {len(dispatched)} sources: {dispatched}"


@shared_task
def refresh_recent_jobs_task(limit: int = 50):
    """Refresh the most recently posted active LinkedIn jobs."""
    cutoff = timezone.now() - timedelta(days=1)
    urls = list(
        Job.objects.filter(
            is_active=True,
            source="linkedin-brightdata",
            posted_at__gte=cutoff,
        )
        .order_by("-last_seen_at")
        .values_list("url", flat=True)[:limit]
    )

    if not urls:
        return "No recent LinkedIn jobs to refresh."

    scrape_brightdata_linkedin_urls_task.delay(urls)
    return f"Queued LinkedIn refresh for {len(urls)} recent jobs."


@shared_task
def refresh_old_jobs_task(limit: int = 25):
    """Refresh older active LinkedIn jobs on a slower cadence."""
    cutoff = timezone.now() - timedelta(days=7)
    urls = list(
        Job.objects.filter(
            is_active=True,
            source="linkedin-brightdata",
            posted_at__lt=cutoff,
        )
        .order_by("last_seen_at")
        .values_list("url", flat=True)[:limit]
    )

    if not urls:
        return "No old LinkedIn jobs to refresh."

    scrape_brightdata_linkedin_urls_task.delay(urls)
    return f"Queued LinkedIn refresh for {len(urls)} older jobs."


@shared_task
def scrape_greenhouse_jobs_task():
    """Scrape jobs from all Greenhouse-based platforms"""
    results = []
    total_saved = 0
    total_updated = 0
    
    for company_slug in GREENHOUSE_COMPANIES.keys():
        run = create_scrape_run(source="greenhouse", company=company_slug)
        try:
            jobs = scrape_greenhouse_company_jobs(company_slug)
            result = save_jobs(jobs, run=run)
            total_saved += result.get("records_saved", 0)
            total_updated += result.get("records_updated", 0)
            results.append(f"{company_slug}: {result}")
        except Exception as e:
            run.status = "failure"
            run.errors = [str(e)]
            run.finished_at = timezone.now()
            run.save()
            results.append(f"{company_slug} failed: {str(e)}")
    
    # Trigger cache revalidation if jobs were saved or updated
    if total_saved > 0 or total_updated > 0:
        trigger_jobs_cache_revalidation()
    
    return f"Greenhouse: {results}"


@shared_task
def scrape_lever_jobs_task():
    """Scrape jobs from Lever-based platforms"""
    run = create_scrape_run(source="lever")
    try:
        jobs = scrape_lever_jobs_multiple_companies()
        result = save_jobs(jobs, run=run)
        # Trigger cache revalidation if jobs were saved or updated
        if result.get("records_saved", 0) > 0 or result.get("records_updated", 0) > 0:
            trigger_jobs_cache_revalidation()
        return f"Lever: {result}"
    except Exception as e:
        run.status = "failure"
        run.errors = [str(e)]
        run.finished_at = timezone.now()
        run.save()
        return f"Lever failed: {str(e)}"


@shared_task
def scrape_stripe_lever_jobs_task():
    """Scrape jobs from Stripe's Lever board."""
    run = create_scrape_run(source="stripe-lever", company="stripe")
    try:
        jobs = scrape_stripe_lever_jobs()
        result = save_jobs(jobs, run=run)
        # Trigger cache revalidation if jobs were saved or updated
        if result.get("records_saved", 0) > 0 or result.get("records_updated", 0) > 0:
            trigger_jobs_cache_revalidation()
        return f"Stripe Lever: {result}"
    except Exception as e:
        run.status = "failure"
        run.errors = [str(e)]
        run.finished_at = timezone.now()
        run.save()
        return f"Stripe Lever failed: {str(e)}"


@shared_task
def scrape_remoteok_jobs_task():
    """Scrape jobs from RemoteOK"""
    run = create_scrape_run(source="remoteok")
    try:
        jobs = scrape_remoteok_jobs()
        result = save_jobs(jobs, run=run)
        # Trigger cache revalidation if jobs were saved or updated
        if result.get("records_saved", 0) > 0 or result.get("records_updated", 0) > 0:
            trigger_jobs_cache_revalidation()
        return f"RemoteOK: {result}"
    except Exception as e:
        run.status = "failure"
        run.errors = [str(e)]
        run.finished_at = timezone.now()
        run.save()
        return f"RemoteOK failed: {str(e)}"


@shared_task
def scrape_brightdata_linkedin_urls_task(urls: list):
    """Scrape LinkedIn pages by URL via Brightdata."""
    run = create_scrape_run(source="linkedin-brightdata", company="url")
    try:
        jobs = scrape_linkedin_by_url(urls)
        result = save_jobs(jobs, run=run)
        # Trigger cache revalidation if jobs were saved or updated
        if result.get("records_saved", 0) > 0 or result.get("records_updated", 0) > 0:
            trigger_jobs_cache_revalidation()
        return f"Brightdata LinkedIn URLs: {result}"
    except Exception as e:
        run.status = "failure"
        run.errors = [str(e)]
        run.finished_at = timezone.now()
        run.save()
        return f"Brightdata LinkedIn URLs failed: {str(e)}"


@shared_task
def scrape_brightdata_linkedin_keyword_task(inputs: list):
    """Scrape LinkedIn search results by keyword via Brightdata."""
    run = create_scrape_run(source="linkedin-brightdata", company="keyword")
    try:
        jobs = scrape_linkedin_by_keyword(inputs)
        result = save_jobs(jobs, run=run)
        # Trigger cache revalidation if jobs were saved or updated
        if result.get("records_saved", 0) > 0 or result.get("records_updated", 0) > 0:
            trigger_jobs_cache_revalidation()
        return f"Brightdata LinkedIn Keyword: {result}"
    except Exception as e:
        run.status = "failure"
        run.errors = [str(e)]
        run.finished_at = timezone.now()
        run.save()
        return f"Brightdata LinkedIn Keyword failed: {str(e)}"


@shared_task
def scrape_brightdata_linkedin_companies_task(urls: list):
    """Scrape LinkedIn company pages via Brightdata."""
    run = create_scrape_run(source="linkedin-brightdata", company="company")
    try:
        company_data = scrape_linkedin_companies(urls)
        run.jobs_found = len(company_data)
        run.jobs_saved = 0
        run.status = "success"
        run.finished_at = timezone.now()
        run.errors = None
        run.save()
        return f"Brightdata LinkedIn Companies: {len(company_data)} records returned"
    except Exception as e:
        run.status = "failure"
        run.errors = [str(e)]
        run.finished_at = timezone.now()
        run.save()
        return f"Brightdata LinkedIn Companies failed: {str(e)}"


@shared_task
def scrape_all_jobs():
    """
    Master orchestration task that triggers all individual scrapers.
    
    PRIORITY ORDER (highest to lowest data quality + stability):
    
    1. GREENHOUSE (high value, stable, no captcha)
    2. REMOTEOK (API-based, reliable, good coverage)
    3. ASHBY (future: growing platform, many startups)
    4. OTHER SOURCES (future: stable APIs, no proxy required)
    5. LEVER (low priority: 404s common, many companies migrated)
    
    This runs platform tasks asynchronously for scalability.
    """
    
    # TIER 1: PRIMARY SOURCES (high data density + stability)
    # Greenhouse: 100+ jobs, predictable HTML, no anti-bot friction
    scrape_greenhouse_jobs_task.delay()
    
    # RemoteOK: API-based, reliable, good remote job coverage
    scrape_remoteok_jobs_task.delay()
    
    # TIER 2: SECONDARY SOURCES (future implementation)
    # ASHBY: Rapidly growing among AI/startup companies
    # TODO: scrape_ashby_jobs_task.delay()
    
    # TIER 3: OTHER PLATFORMS (future)
    # High-quality sources without captcha/proxy requirements
    # TODO: scrape_wellfound_jobs_task.delay()
    # TODO: scrape_yc_jobs_task.delay()
    
    # TIER 4: LOW PRIORITY (minimal usefulness currently)
    # Lever: Many companies migrated to Greenhouse/Ashby/Workday
    # 404s are expected and not failures
    scrape_lever_jobs_task.delay()
    scrape_stripe_lever_jobs_task.delay()

    return "Triggered all scraper tasks (priority-ordered)"


@shared_task
def export_jobs_to_google_sheets_task():
    """Export all saved jobs to Google Sheets."""
    export_jobs_to_google_sheets()
    return "Exported jobs to Google Sheets"


@shared_task
def expire_stale_jobs_task(days: int = 7):
    """Mark jobs inactive when they have not been refreshed recently."""
    cutoff = timezone.now() - timedelta(days=days)
    updated = Job.objects.filter(is_active=True, last_seen_at__lt=cutoff).update(
        is_active=False,
        expired_at=timezone.now(),
    )
    return f"Expired {updated} stale jobs older than {days} days."


@shared_task
def search_jobs_task(query_params: dict):
    """Run a reusable ingestion pipeline for a standardized search query."""
    from scraper.query import JobSearchQuery
    from scraper.ingestion import search_jobs

    query = JobSearchQuery(
        keywords=query_params.get("keywords"),
        company=query_params.get("company"),
        location=query_params.get("location"),
        source=query_params.get("source"),
        remote=query_params.get("remote"),
        countries=query_params.get("countries") or [],
        industries=query_params.get("industries") or [],
        job_types=query_params.get("job_types") or [],
        urls=query_params.get("urls") or [],
        raw=query_params.get("raw") or {},
    )

    jobs = search_jobs(query)
    result = save_jobs(jobs)

    return {
        "status": "success",
        "query": query_params,
        "result": result,
    }
