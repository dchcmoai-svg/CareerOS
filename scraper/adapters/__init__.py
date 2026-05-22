from abc import ABC, abstractmethod
from typing import Dict, Iterable, List, Optional

from scraper.query import JobSearchQuery


class BaseSourceAdapter(ABC):
    source: str

    @abstractmethod
    def search(self, query: JobSearchQuery) -> List[Dict[str, any]]:
        raise NotImplementedError


_adapter_registry: Dict[str, BaseSourceAdapter] = {}


def register_adapter(adapter: BaseSourceAdapter) -> BaseSourceAdapter:
    _adapter_registry[adapter.source] = adapter
    return adapter


def get_adapter(source: str) -> BaseSourceAdapter:
    adapter = _adapter_registry.get(source)
    if adapter is None:
        raise ValueError(f"No adapter registered for source '{source}'")
    return adapter


def get_all_adapters() -> List[BaseSourceAdapter]:
    return list(_adapter_registry.values())


def resolve_sources(sources: Optional[Iterable[str]] = None) -> List[BaseSourceAdapter]:
    if not sources:
        return get_all_adapters()
    return [get_adapter(source) for source in sources]


# Import adapters in package init so registrations are available automatically.
from scraper.adapters import brightdata  # noqa: F401
