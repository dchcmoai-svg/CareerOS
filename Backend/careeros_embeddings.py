#!/usr/bin/env python3
"""CareerOS: Embedding abstraction and lightweight provider implementation."""

import math
import re
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional

# A simple vocabulary for placeholder embeddings.
EMBEDDING_VOCABULARY = sorted(set([
    "python", "javascript", "typescript", "react", "node", "sql", "aws", "kubernetes",
    "docker", "java", "c++", "go", "rust", "machine learning", "data", "ai",
    "nlp", "cloud", "api", "frontend", "backend", "product", "design",
    "devops", "security", "staff", "leadership", "management", "analytics",
    "research", "strategy", "customer", "platform", "infrastructure",
]))


@dataclass
class ProfileEmbedding:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    reference_id: str = ""
    embedding: List[float] = field(default_factory=list)
    model_name: str = ""
    created_at: datetime = field(default_factory=datetime.now)

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "reference_id": self.reference_id,
            "embedding": self.embedding,
            "model_name": self.model_name,
            "created_at": self.created_at.isoformat(),
        }


@dataclass
class ResumeVariantEmbedding:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    reference_id: str = ""
    embedding: List[float] = field(default_factory=list)
    model_name: str = ""
    created_at: datetime = field(default_factory=datetime.now)

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "reference_id": self.reference_id,
            "embedding": self.embedding,
            "model_name": self.model_name,
            "created_at": self.created_at.isoformat(),
        }


@dataclass
class JobEmbedding:
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    reference_id: str = ""
    embedding: List[float] = field(default_factory=list)
    model_name: str = ""
    created_at: datetime = field(default_factory=datetime.now)

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "reference_id": self.reference_id,
            "embedding": self.embedding,
            "model_name": self.model_name,
            "created_at": self.created_at.isoformat(),
        }


class EmbeddingProvider:
    """Embedding provider abstraction for CareerOS."""

    def embed_profile(self, profile: Dict) -> List[float]:
        raise NotImplementedError

    def embed_resume_variant(self, variant: Dict) -> List[float]:
        raise NotImplementedError

    def embed_job(self, job: Dict) -> List[float]:
        raise NotImplementedError


class SimpleEmbeddingProvider(EmbeddingProvider):
    """A lightweight text-based embedding provider used as a placeholder."""

    def embed_profile(self, profile: Dict) -> List[float]:
        text = " ".join(
            [profile.get("name", ""), profile.get("summary", ""), " ".join(profile.get("skills", []))]
        )
        return self._embed_text(text)

    def embed_resume_variant(self, variant: Dict) -> List[float]:
        text = " ".join(
            [variant.get("summary", ""), " ".join(variant.get("keywords", [])), " ".join(variant.get("priority_skills", []))]
        )
        return self._embed_text(text)

    def embed_job(self, job: Dict) -> List[float]:
        text = " ".join([job.get("title", ""), job.get("description", ""), " ".join(job.get("keywords", []))])
        return self._embed_text(text)

    def _embed_text(self, text: str) -> List[float]:
        normalized = re.sub(r"[^a-zA-Z0-9 ]", " ", text.lower())
        tokens = normalized.split()
        token_set = set(tokens)
        vector = [1.0 if term in token_set else 0.0 for term in EMBEDDING_VOCABULARY]
        return self._normalize(vector)

    def _normalize(self, vector: List[float]) -> List[float]:
        magnitude = math.sqrt(sum(x * x for x in vector))
        if magnitude == 0:
            return vector
        return [x / magnitude for x in vector]


def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    mag_a = math.sqrt(sum(a * a for a in vec_a))
    mag_b = math.sqrt(sum(b * b for b in vec_b))
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot / (mag_a * mag_b)
