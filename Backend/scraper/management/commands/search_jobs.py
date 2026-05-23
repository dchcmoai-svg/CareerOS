import json

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from scraper.ingestion import search_jobs
from scraper.query import JobSearchQuery
from scraper.services import save_jobs
from scraper.models import JobSearchQuery as JobSearchQueryModel


class Command(BaseCommand):
    help = "Run a reusable job search ingestion pipeline using standardized query inputs."

    def add_arguments(self, parser):
        parser.add_argument("--keywords", type=str, help="Search keywords, e.g. 'python backend'.")
        parser.add_argument("--company", type=str, help="Company name, e.g. 'Google'.")
        parser.add_argument("--location", type=str, help="Location filter, e.g. 'India' or 'Remote'.")
        parser.add_argument("--source", type=str, help="Optional source adapter to target, e.g. 'linkedin-brightdata'.")
        parser.add_argument("--remote", action="store_true", help="Filter to remote jobs.")
        parser.add_argument("--url", action="append", dest="urls", help="Direct job or company URL to ingest. Repeatable.")
        parser.add_argument("--countries", type=str, help="Comma-separated country codes or country names.")
        parser.add_argument("--industries", type=str, help="Comma-separated industries.")
        parser.add_argument("--job-types", type=str, help="Comma-separated job types or employment types.")
        parser.add_argument("--raw", type=str, help="Optional JSON string of raw provider query parameters.")

    def handle(self, *args, **options):
        query = JobSearchQuery(
            keywords=options.get("keywords"),
            company=options.get("company"),
            location=options.get("location"),
            source=options.get("source"),
            remote=options.get("remote") or None,
            countries=[c.strip() for c in (options.get("countries") or "").split(",") if c.strip()],
            industries=[i.strip() for i in (options.get("industries") or "").split(",") if i.strip()],
            job_types=[j.strip() for j in (options.get("job_types") or "").split(",") if j.strip()],
            urls=options.get("urls") or [],
        )

        if options.get("raw"):
            try:
                query.raw = json.loads(options.get("raw"))
            except json.JSONDecodeError as exc:
                raise CommandError(f"Invalid raw JSON argument: {exc}")

        if not query.is_url_search() and not query.has_search_terms():
            raise CommandError(
                "Provide at least one search field: --keywords, --company, --location, --URL, --countries, --industries, or --job-types."
            )

        record = JobSearchQueryModel.objects.create(
            keywords=query.keywords,
            company=query.company,
            location=query.location,
            source=query.source,
            remote=query.remote,
            countries=query.countries or None,
            industries=query.industries or None,
            job_types=query.job_types or None,
            urls=query.urls or None,
            raw_params=query.raw or None,
            status="running",
        )

        try:
            jobs = search_jobs(query)
            result = save_jobs(jobs)

            record.status = "success"
            record.results_count = result["total_processed"]
            record.completed_at = timezone.now()
            record.save()

            self.stdout.write(self.style.SUCCESS(
                f"Query saved {result['saved']} jobs, updated {result['updated']}, duplicates {result['duplicates']}"
            ))
        except Exception as exc:
            record.status = "failure"
            record.raw_params = record.raw_params or {}
            record.raw_params["error"] = str(exc)
            record.save()
            raise CommandError(str(exc))
