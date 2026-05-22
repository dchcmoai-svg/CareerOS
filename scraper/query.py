from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class JobSearchQuery:
    keywords: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    source: Optional[str] = None
    remote: Optional[bool] = None
    countries: List[str] = field(default_factory=list)
    industries: List[str] = field(default_factory=list)
    job_types: List[str] = field(default_factory=list)
    urls: List[str] = field(default_factory=list)
    raw: Dict[str, Any] = field(default_factory=dict)

    def is_url_search(self) -> bool:
        return bool(self.urls)

    def has_search_terms(self) -> bool:
        return bool(
            self.keywords
            or self.company
            or self.location
            or self.remote is not None
            or self.countries
            or self.industries
            or self.job_types
        )

    def build_keyword_inputs(self) -> List[Dict[str, Any]]:
        payload: Dict[str, Any] = {}

        if self.keywords:
            payload["keyword"] = self.keywords
        if self.company:
            payload["company"] = self.company
        if self.location:
            payload["location"] = self.location
        if self.remote is not None:
            payload["remote"] = self.remote
        if self.countries:
            payload["country"] = ",".join(self.countries)
        if self.industries:
            payload["industry"] = ",".join(self.industries)
        if self.job_types:
            payload["job_type"] = ",".join(self.job_types)
        if self.raw:
            payload.update(self.raw)

        if not payload:
            raise ValueError(
                "JobSearchQuery requires at least one search field: keywords, company, location, remote, countries, industries, job_types, or urls."
            )

        return [payload]

    def build_url_inputs(self) -> List[Dict[str, Any]]:
        if not self.urls:
            return []
        return [{"url": url} for url in self.urls]
