import json
from scraper.sources.brightdata import scrape_linkedin_by_keyword
from scraper.services import save_jobs

# Dynamic discovery inputs for LinkedIn BrightData
KEYWORDS = [
    "backend engineer",
    "software engineer",
    "data engineer",
    "machine learning engineer",
    "frontend engineer",
]

LOCATIONS = [
    "United States",
    "India",
    "United Kingdom",
]

SENIORITY_TERMS = [
    "junior",
    "senior",
]

REMOTE_FILTERS = [
    "remote",
    "onsite",
    "hybrid",
]

TIME_RANGES = [
    "past_week",
    "past_month",
]

MAX_COMBINATIONS = 60
BATCH_SIZE = 5


def generate_search_inputs():
    combinations = []
    for keyword in KEYWORDS:
        for location in LOCATIONS:
            for seniority in SENIORITY_TERMS:
                for remote in REMOTE_FILTERS:
                    for time_range in TIME_RANGES:
                        if len(combinations) >= MAX_COMBINATIONS:
                            return combinations
                        combinations.append(
                            {
                                "keyword": f"{seniority} {keyword}",
                                "location": location,
                                "remote": remote,
                                "experience_level": seniority,
                                "time_range": time_range,
                            }
                        )
    return combinations


def run_discovery_batch():
    inputs = generate_search_inputs()
    print(f"Generated {len(inputs)} LinkedIn BrightData search inputs")

    total_jobs = 0
    total_saved = 0
    total_duplicates = 0
    total_rejected = 0
    batch_index = 0

    for i in range(0, len(inputs), BATCH_SIZE):
        batch = inputs[i : i + BATCH_SIZE]
        batch_index += 1
        print(f"\n=== Running batch {batch_index}: {len(batch)} searches ===")
        print(json.dumps(batch, indent=2))
        try:
            jobs = scrape_linkedin_by_keyword(batch)
        except Exception as exc:
            print(f"Batch {batch_index} failed: {exc}")
            continue

        total_jobs += len(jobs)
        print(f"Batch {batch_index} returned {len(jobs)} raw jobs")

        result = save_jobs(jobs)
        total_saved += result.get("records_saved", 0)
        total_duplicates += result.get("duplicate_records", 0)
        total_rejected += result.get("records_rejected", 0)

        print(
            f"Batch {batch_index} saved={result.get('records_saved')} updated={result.get('records_updated')} rejected={result.get('records_rejected')} duplicates={result.get('duplicate_records')}"
        )

    print("\n=== Discovery Summary ===")
    print(f"Total search combos: {len(inputs)}")
    print(f"Total raw jobs returned: {total_jobs}")
    print(f"Total saved: {total_saved}")
    print(f"Total duplicates: {total_duplicates}")
    print(f"Total rejected: {total_rejected}")


if __name__ == "__main__":
    run_discovery_batch()
