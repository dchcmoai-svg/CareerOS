from typing import List, Dict

from scraper.adapters import BaseSourceAdapter, register_adapter
from scraper.query import JobSearchQuery
from scraper.sources.brightdata import (
    scrape_linkedin_by_keyword,
    scrape_linkedin_by_url,
)


class LinkedInBrightDataAdapter(BaseSourceAdapter):
    source = "linkedin-brightdata"

    def search(self, query: JobSearchQuery) -> List[Dict[str, any]]:
        if query.is_url_search():
            return scrape_linkedin_by_url(query.urls)

        if not query.has_search_terms():
            raise ValueError(
                "LinkedIn query requires keywords, company, location, remote, countries, industries, or job_types when URLs are not provided."
            )

        inputs = query.build_keyword_inputs()
        return scrape_linkedin_by_keyword(inputs)


register_adapter(LinkedInBrightDataAdapter())
