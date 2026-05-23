import json
import os
from django.core.management.base import BaseCommand, CommandError
from scraper.services import save_jobs
from scraper.sources.brightdata import (
    trigger_brightdata_dataset,
    wait_for_brightdata_snapshot,
    normalize_brightdata_jobs,
)


class Command(BaseCommand):
    help = "Scrape LinkedIn jobs using Brightdata and save them into the database."

    def add_arguments(self, parser):
        parser.add_argument(
            "--url",
            action="append",
            dest="urls",
            help="LinkedIn job/search/company URL to scrape. Repeatable.",
        )
        parser.add_argument(
            "--input-file",
            dest="input_file",
            help="Path to a JSON file containing an array of Brightdata inputs.",
        )
        parser.add_argument(
            "--dataset-id",
            dest="dataset_id",
            help="Optional Brightdata dataset ID to override environment defaults.",
        )
        parser.add_argument(
            "--timeout",
            type=int,
            default=300,
            help="Seconds to wait for Brightdata snapshot completion.",
        )
        parser.add_argument(
            "--poll-interval",
            type=int,
            default=10,
            help="Seconds between Brightdata snapshot status checks.",
        )

    def handle(self, *args, **options):
        urls = options.get("urls") or []
        input_file = options.get("input_file")

        if input_file:
            try:
                with open(input_file, "r", encoding="utf-8") as fp:
                    inputs = json.load(fp)
            except Exception as exc:
                raise CommandError(f"Unable to load input file: {exc}")

            if not isinstance(inputs, list):
                raise CommandError("Input file must contain a JSON array of Brightdata input objects.")

            payload = inputs
        elif urls:
            payload = [{"url": url} for url in urls]
        else:
            raise CommandError(
                "Provide at least one --url or --input-file containing Brightdata inputs."
            )

        # Select the expected dataset ID based on the payload structure.
        dataset_id = options.get("dataset_id")
        if not dataset_id:
            if any(item.get("keyword") for item in payload):
                dataset_id = os.getenv("BRIGHTDATA_DATASET_LINKEDIN_KEYWORD")
                discover_by = "keyword"
            elif any(item.get("url") for item in payload):
                first_url = next(item.get("url") for item in payload if item.get("url"))
                if "/company/" in first_url or "organization-guest/company" in first_url:
                    dataset_id = os.getenv("BRIGHTDATA_DATASET_LINKEDIN_COMPANY")
                else:
                    dataset_id = os.getenv("BRIGHTDATA_DATASET_LINKEDIN_URL")
                discover_by = "url"
            else:
                raise CommandError(
                    "Unable to determine Brightdata dataset type from the provided input."
                )

        if not dataset_id:
            raise CommandError(
                "Missing Brightdata dataset ID. Set BRIGHTDATA_DATASET_LINKEDIN_URL, "
                "BRIGHTDATA_DATASET_LINKEDIN_KEYWORD, BRIGHTDATA_DATASET_LINKEDIN_COMPANY, "
                "or pass --dataset-id."
            )

        self.stdout.write(self.style.NOTICE("Triggering Brightdata dataset..."))
        response = trigger_brightdata_dataset(
            payload,
            dataset_id=dataset_id,
            request_type="discover_new",
            discover_by=discover_by,
        )

        snapshot_id = response.get("snapshot_id") or response.get("snapshotId") or response.get("id")
        if not snapshot_id:
            raise CommandError(f"Brightdata trigger did not return a snapshot ID: {response}")

        self.stdout.write(self.style.SUCCESS(f"Snapshot started: {snapshot_id}"))
        self.stdout.write(
            f"Waiting for snapshot to complete (timeout={options['timeout']}s)..."
        )

        snapshot = wait_for_brightdata_snapshot(
            snapshot_id,
            poll_interval=options["poll_interval"],
            timeout_seconds=options["timeout"],
        )
        self.stdout.write(self.style.SUCCESS("Snapshot completed."))

        output = snapshot.get("output") or snapshot.get("results") or []
        jobs = normalize_brightdata_jobs(output)
        result = save_jobs(jobs)

        self.stdout.write(self.style.SUCCESS(
            f"Saved {result['saved']} jobs, updated {result['updated']}, duplicates {result['duplicates']}"
        ))
