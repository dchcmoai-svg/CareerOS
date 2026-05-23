from typing import Dict, Iterable, List, Optional

from scraper.adapters import get_adapter, get_all_adapters
from scraper.query import JobSearchQuery


def deduplicate_jobs(jobs: List[Dict[str, any]]) -> List[Dict[str, any]]:
    seen_urls = set()
    deduped: List[Dict[str, any]] = []

    for job in jobs:
        url = job.get("url")
        if not url:
            continue
        normalized_url = url.strip().lower()
        if normalized_url in seen_urls:
            continue
        seen_urls.add(normalized_url)
        deduped.append(job)

    return deduped


def search_jobs(
    query: JobSearchQuery,
    sources: Optional[Iterable[str]] = None,
) -> List[Dict[str, any]]:
    if query.source:
        sources = [query.source]

    adapters = get_all_adapters() if not sources else [get_adapter(source) for source in sources]
    jobs: List[Dict[str, any]] = []

    for adapter in adapters:
        jobs.extend(adapter.search(query))

    return deduplicate_jobs(jobs)
