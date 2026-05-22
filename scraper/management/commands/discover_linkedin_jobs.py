import json
import os
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from scraper.services import save_jobs
from scraper.sources.brightdata import (
    trigger_brightdata_dataset,
    wait_for_brightdata_snapshot,
    normalize_brightdata_jobs,
)


class Command(BaseCommand):
    help = "Generate LinkedIn discovery searches for Brightdata and save discovered jobs."

    def add_arguments(self, parser):
        parser.add_argument(
            "--keywords",
            action="append",
            dest="keywords",
            help="Search keywords, e.g. 'software engineer'. Repeatable or comma-separated.",
        )
        parser.add_argument(
            "--locations",
            action="append",
            dest="locations",
            help="Search locations, e.g. 'United States'. Repeatable or comma-separated.",
        )
        parser.add_argument(
            "--keyword-file",
            dest="keyword_file",
            help="Path to a file containing one keyword per line.",
        )
        parser.add_argument(
            "--location-file",
            dest="location_file",
            help="Path to a file containing one location per line.",
        )
        parser.add_argument(
            "--dataset-id",
            dest="dataset_id",
            help="Optional Brightdata dataset ID to override environment defaults.",
        )
        parser.add_argument(
            "--max-inputs",
            type=int,
            default=50,
            help="Maximum number of generated Brightdata search inputs.",
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
        parser.add_argument(
            "--dry-run",
            action="store_true",
            dest="dry_run",
            help="Print generated discovery inputs without triggering Brightdata.",
        )

    def _parse_list(self, values):
        results = []
        for value in values or []:
            if not isinstance(value, str):
                continue
            parts = [item.strip() for item in value.split(",") if item.strip()]
            results.extend(parts)
        return results

    def _load_file_values(self, path):
        if not path:
            return []
        path_obj = Path(path)
        if not path_obj.exists():
            raise CommandError(f"File does not exist: {path}")
        return [line.strip() for line in path_obj.read_text(encoding="utf-8").splitlines() if line.strip()]

    def _build_inputs(self, keywords, locations, max_inputs):
        keywords = keywords or []
        locations = locations or []
        inputs = []
        seen = set()

        if not keywords and not locations:
            raise CommandError(
                "Provide at least one keyword or one location for discovery generation."
            )

        if keywords and locations:
            for keyword in keywords:
                for location in locations:
                    key = (keyword.lower(), location.lower())
                    if key in seen:
                        continue
                    seen.add(key)
                    inputs.append({"keyword": keyword, "location": location})
                    if len(inputs) >= max_inputs:
                        return inputs
        elif keywords:
            for keyword in keywords:
                key = (keyword.lower(), "")
                if key in seen:
                    continue
                seen.add(key)
                inputs.append({"keyword": keyword})
                if len(inputs) >= max_inputs:
                    return inputs
        else:
            for location in locations:
                key = ("", location.lower())
                if key in seen:
                    continue
                seen.add(key)
                inputs.append({"location": location})
                if len(inputs) >= max_inputs:
                    return inputs

        return inputs

    def handle(self, *args, **options):
        keywords = self._parse_list(options.get("keywords"))
        locations = self._parse_list(options.get("locations"))
        keywords += self._load_file_values(options.get("keyword_file"))
        locations += self._load_file_values(options.get("location_file"))

        max_inputs = options.get("max_inputs") or 50
        inputs = self._build_inputs(keywords, locations, max_inputs)

        if not inputs:
            raise CommandError(
                "No discovery inputs were generated. Provide keywords, locations, or files containing them."
            )

        self.stdout.write(self.style.NOTICE(f"Generated {len(inputs)} discovery inputs."))

        if options.get("dry_run"):
            self.stdout.write(json.dumps(inputs, indent=2))
            return

        dataset_id = options.get("dataset_id") or os.getenv("BRIGHTDATA_DATASET_LINKEDIN_KEYWORD")
        if not dataset_id:
            raise CommandError(
                "Missing Brightdata keyword dataset ID. Set BRIGHTDATA_DATASET_LINKEDIN_KEYWORD or pass --dataset-id."
            )

        self.stdout.write(self.style.NOTICE("Triggering Brightdata keyword dataset..."))
        response = trigger_brightdata_dataset(
            inputs,
            dataset_id=dataset_id,
            request_type="discover_new",
            discover_by="keyword",
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
            f"Saved {result['records_saved']} jobs, updated {result['records_updated']}, "
            f"rejected {result['records_rejected']}, duplicates {result['duplicate_records']}"
        ))
