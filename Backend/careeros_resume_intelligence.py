#!/usr/bin/env python3
"""
CareerOS: Resume Intelligence Engine

This module powers the core Stage 2 moat:
- Resume upload and parsing
- Structured resume ingestion into the Professional Graph
- Resume branches and variants
- ATS-quality scoring and keyword coverage
- Variant selection for jobs
"""

import re
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Tuple

from careeros_embeddings import (
    EmbeddingProvider,
    SimpleEmbeddingProvider,
    ResumeVariantEmbedding,
    JobEmbedding,
)
from careeros_professional_graph import (
    ProfessionalGraph,
    Skill,
    Experience,
    Project,
    Achievement,
    Certification,
    LeadershipRole,
    OpenSourceProject,
    ResearchWork,
    Award,
    Publication,
    Patent,
    SpeakingEngagement,
    VolunteerWork,
    ResumeDocument,
    ResumeVariant,
    SkillLevel,
    EmploymentType,
)

# Heuristics for resume parsing and evaluation
RESUME_SECTIONS = [
    "summary", "profile", "experience", "work experience", "employment", "projects",
    "skills", "education", "certifications", "certifications & licenses",
    "leadership", "volunteer", "research", "publications", "honors",
    "awards", "patents", "presentations", "talks", "speaking", "speaking engagements",
    "volunteer work", "open source", "open-source",
]

TECH_KEYWORDS = [
    "python", "javascript", "typescript", "react", "node", "sql", "aws", "kubernetes",
    "docker", "java", "c++", "go", "rust", "machine learning", "data science",
    "nlp", "cloud", "api", "frontend", "backend", "product", "design",
    "devops", "security", "staff engineer", "manager", "leadership",
]

DEFAULT_BRANCH_TYPES = [
    "general",
    "frontend",
    "backend",
    "fullstack",
    "ai_ml",
    "data",
    "devops",
    "security",
    "product",
    "staff_engineer",
]

BRANCH_KEYWORDS = {
    "frontend": ["react", "ui", "ux", "typescript", "javascript", "css", "html"],
    "backend": ["python", "go", "node", "api", "sql", "kubernetes", "microservices"],
    "fullstack": ["react", "node", "typescript", "api", "graphql", "graphql", "docker", "aws"],
    "ai_ml": ["machine learning", "nlp", "deep learning", "model", "data pipeline", "analysis", "training"],
    "data": ["data", "analytics", "sql", "etl", "visualization", "tableau", "power bi", "spark"],
    "devops": ["infrastructure", "kubernetes", "docker", "ci/cd", "terraform", "aws", "monitoring"],
    "security": ["security", "vulnerability", "compliance", "penetration", "encryption", "threat"],
    "product": ["roadmap", "stakeholder", "strategy", "launch", "metrics", "customer", "user research"],
    "staff_engineer": ["architecture", "scaling", "mentorship", "technical leadership", "system design", "roadmap"],
    "general": [],
}

BRANCH_TITLE_TEMPLATES = {
    "general": "Professional Candidate",
    "frontend": "Frontend Engineer",
    "backend": "Backend Engineer",
    "fullstack": "Fullstack Engineer",
    "ai_ml": "AI/ML Engineer",
    "data": "Data Engineer",
    "devops": "DevOps Engineer",
    "security": "Security Engineer",
    "product": "Product Manager",
    "staff_engineer": "Staff Engineer",
}

BRANCH_INDUSTRY_TEMPLATES = {
    "general": "Technology",
    "frontend": "SaaS / Consumer Tech",
    "backend": "Enterprise Software",
    "fullstack": "Platform Engineering",
    "ai_ml": "Artificial Intelligence",
    "data": "Data & Analytics",
    "devops": "Cloud Infrastructure",
    "security": "Cybersecurity",
    "product": "Product & Growth",
    "staff_engineer": "Engineering Leadership",
}

WEAK_VERBS = [
    "helped", "assisted", "worked", "participated", "supported", "responsible",
    "managed", "involved",
]

IMPACT_TERMS = [
    "increased", "decreased", "reduced", "improved", "generated", "scaled",
    "saved", "accelerated", "optimized", "launched", "built", "designed",
]


@dataclass
class ParsedResume:
    text: str
    sections: Dict[str, str] = field(default_factory=dict)

    def get_section(self, name: str) -> str:
        return self.sections.get(name.lower(), "")

    def section_names(self) -> List[str]:
        return list(self.sections.keys())


class ResumeParser:
    """Parse resume text into structured sections."""

    def parse_text(self, text: str) -> ParsedResume:
        text = text.strip().replace("\r\n", "\n")
        sections: Dict[str, List[str]] = {}
        current_section = "summary"
        sections[current_section] = []

        for line in text.split("\n"):
            stripped = line.strip()
            if not stripped:
                continue

            header = self._normalize_header(stripped)
            if header and header in RESUME_SECTIONS:
                current_section = header
                sections.setdefault(current_section, [])
                continue

            sections.setdefault(current_section, []).append(stripped)

        merged_sections = {
            name: "\n".join(lines).strip()
            for name, lines in sections.items()
        }

        return ParsedResume(text=text, sections=merged_sections)

    def _normalize_header(self, line: str) -> Optional[str]:
        normalized = re.sub(r"[^a-zA-Z ]", " ", line).strip().lower()
        normalized = re.sub(r"\s+", " ", normalized)
        return normalized if normalized in RESUME_SECTIONS else None

    def extract_bullets(self, content: str) -> List[str]:
        bullets = []
        for line in content.split("\n"):
            stripped = line.strip()
            if not stripped:
                continue
            if stripped.startswith("-") or stripped.startswith("*") or stripped.startswith("•"):
                bullets.append(stripped.lstrip("-*• "))
            elif len(stripped.split()) > 5:
                bullets.append(stripped)
        return bullets

    def extract_skill_lines(self, content: str) -> List[str]:
        skill_lines = []
        for line in content.split("\n"):
            cleaned = line.strip().lstrip("-*• ")
            if not cleaned:
                continue
            if "," in cleaned or ";" in cleaned or "/" in cleaned:
                skill_lines.append(cleaned)
            elif len(cleaned.split()) <= 6:
                skill_lines.append(cleaned)
        return skill_lines


class ResumeGraphBuilder:
    """Ingest parsed resume content into the Professional Graph."""

    def __init__(self, graph: ProfessionalGraph, parser: Optional[ResumeParser] = None):
        self.graph = graph
        self.parser = parser or ResumeParser()

    def ingest_resume(self, raw_text: str, source_name: str = "uploaded_resume", title: str = "Resume", branch_tags: Optional[List[str]] = None) -> ResumeDocument:
        parsed = self.parser.parse_text(raw_text)
        resume = ResumeDocument(
            title=title,
            source_name=source_name,
            uploaded_at=datetime.now(),
            sections=parsed.sections,
            branch_tags=branch_tags or ["general"],
            source_text=raw_text,
        )
        self.graph.resumes[resume.resume_id] = resume

        self._ingest_skills(parsed, resume)
        self._ingest_experiences(parsed, resume)
        self._ingest_projects(parsed, resume)
        self._ingest_certifications(parsed, resume)
        self._ingest_awards(parsed, resume)
        self._ingest_publications(parsed, resume)
        self._ingest_patents(parsed, resume)
        self._ingest_speaking(parsed, resume)
        self._ingest_volunteer(parsed, resume)
        self._ingest_leadership(parsed, resume)
        self._ingest_research(parsed, resume)

        return resume

    def _ingest_skills(self, parsed: ParsedResume, resume: ResumeDocument):
        skills_text = parsed.get_section("skills")
        if not skills_text:
            return

        skill_lines = self.parser.extract_skill_lines(skills_text)
        for line in skill_lines:
            for token in re.split(r"[,;/]+", line):
                name = token.strip()
                if not name:
                    continue
                self._upsert_skill(name, resume=resume)

    def _ingest_experiences(self, parsed: ParsedResume, resume: ResumeDocument):
        content = parsed.get_section("experience") or parsed.get_section("work experience")
        if not content:
            return

        blocks = re.split(r"\n{2,}", content)
        for block in blocks:
            lines = [line.strip() for line in block.split("\n") if line.strip()]
            if not lines:
                continue

            header = lines[0]
            job_title, company = self._parse_experience_header(header)
            responsibilities = self.parser.extract_bullets("\n".join(lines[1:]))
            experience = Experience(
                job_title=job_title,
                company=company,
                location="",
                employment_type=EmploymentType.FULL_TIME,
                start_date=datetime.now(),
                current=True,
                description=" ".join(lines[1:]),
                responsibilities=responsibilities,
            )
            self.graph.experiences[experience.experience_id] = experience

            for bullet in responsibilities:
                self._ingest_experience_line(experience, bullet, resume)

    def _ingest_projects(self, parsed: ParsedResume, resume: ResumeDocument):
        content = parsed.get_section("projects")
        if not content:
            return

        blocks = re.split(r"\n{2,}", content)
        for block in blocks:
            title = block.split("\n", 1)[0].strip()
            skills = self._extract_skills_from_text(block)
            project_skill_ids = []
            for skill_name in skills:
                skill = self._upsert_skill(skill_name, resume=resume)
                if skill and skill.skill_id not in project_skill_ids:
                    project_skill_ids.append(skill.skill_id)

            project = Project(
                title=title,
                description=block,
                url=self._extract_first_url(block),
                skills=project_skill_ids,
                impact="",
            )
            self.graph.projects[project.project_id] = project

            for skill_id in project.skills:
                skill = self.graph.skills.get(skill_id)
                if skill and project.project_id not in skill.projects:
                    skill.projects.append(project.project_id)

    def _ingest_certifications(self, parsed: ParsedResume, resume: ResumeDocument):
        content = parsed.get_section("certifications")
        if not content:
            return

        lines = [line.strip().lstrip("-*• ") for line in content.split("\n") if line.strip()]
        for line in lines:
            certification = Certification(
                name=line,
                issuer="",
                skills_covered=self._extract_skills_from_text(line),
            )
            self.graph.certifications[certification.certification_id] = certification

    def _ingest_awards(self, parsed: ParsedResume, resume: ResumeDocument):
        content = parsed.get_section("awards") or parsed.get_section("honors")
        if not content:
            return

        lines = [line.strip().lstrip("-*• ") for line in content.split("\n") if line.strip()]
        for line in lines:
            award = Award(
                title=line,
                issuer="",
                description=line,
                skills=self._extract_skills_from_text(line),
            )
            self.graph.awards[award.award_id] = award

    def _ingest_publications(self, parsed: ParsedResume, resume: ResumeDocument):
        content = parsed.get_section("publications")
        if not content:
            return

        lines = [line.strip().lstrip("-*• ") for line in content.split("\n") if line.strip()]
        for line in lines:
            publication = Publication(
                title=line,
                publication_name=line,
                date_published=None,
                url=self._extract_first_url(line),
                summary=line,
                skills=self._extract_skills_from_text(line),
            )
            self.graph.publications[publication.publication_id] = publication

    def _ingest_patents(self, parsed: ParsedResume, resume: ResumeDocument):
        content = parsed.get_section("patents")
        if not content:
            return

        lines = [line.strip().lstrip("-*• ") for line in content.split("\n") if line.strip()]
        for line in lines:
            patent = Patent(
                title=line,
                patent_number="",
                date_filed=None,
                date_issued=None,
                url=self._extract_first_url(line),
                summary=line,
                skills=self._extract_skills_from_text(line),
            )
            self.graph.patents[patent.patent_id] = patent

    def _ingest_speaking(self, parsed: ParsedResume, resume: ResumeDocument):
        content = parsed.get_section("speaking") or parsed.get_section("presentations") or parsed.get_section("talks")
        if not content:
            return

        lines = [line.strip().lstrip("-*• ") for line in content.split("\n") if line.strip()]
        for line in lines:
            speaking = SpeakingEngagement(
                title=line,
                event=line,
                date=None,
                url=self._extract_first_url(line),
                summary=line,
                skills=self._extract_skills_from_text(line),
            )
            self.graph.speaking_engagements[speaking.speaking_id] = speaking

    def _ingest_volunteer(self, parsed: ParsedResume, resume: ResumeDocument):
        content = parsed.get_section("volunteer") or parsed.get_section("volunteer work")
        if not content:
            return

        lines = [line.strip().lstrip("-*• ") for line in content.split("\n") if line.strip()]
        for line in lines:
            volunteer = VolunteerWork(
                organization="",
                role=line,
                start_date=None,
                end_date=None,
                description=line,
                skills=self._extract_skills_from_text(line),
            )
            self.graph.volunteer_work[volunteer.volunteer_id] = volunteer

    def _ingest_leadership(self, parsed: ParsedResume, resume: ResumeDocument):
        content = parsed.get_section("leadership") or parsed.get_section("volunteer")
        if not content:
            return

        lines = [line.strip().lstrip("-*• ") for line in content.split("\n") if line.strip()]
        for line in lines:
            leadership = LeadershipRole(
                title=line,
                organization="",
                description=line,
                skills_demonstrated=self._extract_skills_from_text(line),
            )
            self.graph.leadership_roles[leadership.role_id] = leadership

    def _ingest_research(self, parsed: ParsedResume, resume: ResumeDocument):
        content = parsed.get_section("research") or parsed.get_section("publications")
        if not content:
            return

        lines = [line.strip().lstrip("-*• ") for line in content.split("\n") if line.strip()]
        for line in lines:
            research = ResearchWork(
                title=line,
                description=line,
                url=self._extract_first_url(line),
                skills=self._extract_skills_from_text(line),
            )
            self.graph.research_entries[research.research_id] = research

    def _parse_experience_header(self, header: str) -> Tuple[str, str]:
        if " at " in header.lower():
            parts = re.split(r"\s+at\s+", header, flags=re.IGNORECASE)
            if len(parts) == 2:
                return parts[0].strip(), parts[1].strip()
        if " - " in header:
            parts = header.split(" - ", 1)
            return parts[0].strip(), parts[1].strip()
        return header, ""

    def _extract_skills_from_text(self, text: str) -> List[str]:
        found = []
        text_lower = text.lower()
        for term in TECH_KEYWORDS:
            if term in text_lower and term not in found:
                found.append(term)
        return found

    def _extract_first_url(self, text: str) -> Optional[str]:
        match = re.search(r"https?://[\w\-./?=&%]+", text)
        return match.group(0) if match else None

    def _upsert_skill(self, name: str, resume: ResumeDocument) -> Optional[Skill]:
        if not name:
            return None
        existing = self.graph.find_skills_by_name(name)
        if existing:
            return existing[0]

        skill = Skill(
            name=name,
            category="technical" if any(token in name.lower() for token in TECH_KEYWORDS) else "soft",
            level=SkillLevel.INTERMEDIATE,
        )
        self.graph.skills[skill.skill_id] = skill
        return skill

    def _ingest_experience_line(self, experience: Experience, bullet: str, resume: ResumeDocument):
        skills = self._extract_skills_from_text(bullet)
        for skill_name in skills:
            skill = self._upsert_skill(skill_name, resume=resume)
            if skill and skill.skill_id not in experience.skills_used:
                experience.skills_used.append(skill.skill_id)
                if experience.experience_id not in skill.demonstrated_in:
                    skill.demonstrated_in.append(experience.experience_id)

        if any(term in bullet.lower() for term in IMPACT_TERMS) or re.search(r"\d+%|\d+\+|\$\d+", bullet):
            achievement_skill_ids = []
            for skill_name in skills:
                skill = self._upsert_skill(skill_name, resume=resume)
                if skill and skill.skill_id not in achievement_skill_ids:
                    achievement_skill_ids.append(skill.skill_id)

            achievement = Achievement(
                title=bullet[:80],
                description=bullet,
                impact=bullet,
                skills_demonstrated=achievement_skill_ids,
                evidence=[resume.artifact_path or resume.source_name or "uploaded text"],
            )
            self.graph.achievements[achievement.achievement_id] = achievement
            experience.achievements.append(achievement.achievement_id)


class ResumeIntelligenceEngine:
    """Generate resume variants, score them, and select the best fit."""

    def __init__(self, graph: ProfessionalGraph):
        self.graph = graph
        self.embedding_provider = SimpleEmbeddingProvider()

    def generate_resume_variants(self, resume_id: str, branches: Optional[List[str]] = None, job_description: Optional[str] = None) -> List[ResumeVariant]:
        branches = branches or DEFAULT_BRANCH_TYPES
        return [self.generate_resume_variant(resume_id, branch=branch, job_description=job_description) for branch in branches]

    def generate_resume_variant(self, resume_id: str, branch: str = "general", job_description: Optional[str] = None) -> ResumeVariant:
        resume = self.graph.get_resume(resume_id)
        if not resume:
            raise ValueError(f"Resume not found: {resume_id}")

        branch_key = self._normalize_branch(branch)
        priority_skills = self._branch_skills(branch_key)
        target_role = BRANCH_TITLE_TEMPLATES.get(branch_key, branch_key.replace("_", " ").title())
        target_industry = BRANCH_INDUSTRY_TEMPLATES.get(branch_key, "Technology")

        variant = ResumeVariant(
            resume_id=resume.resume_id,
            branch=branch_key,
            variant_type=branch_key.upper(),
            target_role=target_role,
            target_industry=target_industry,
            title=f"{resume.title} ({target_role} Variant)",
            summary=self._build_summary(resume, branch_key),
            sections=self._build_variant_sections(resume, branch_key),
            keywords=self._build_variant_keywords(resume, branch_key),
            priority_skills=priority_skills,
        )
        variant.score_metrics = self.score_resume_variant(variant, job_description)
        variant.ats_score = variant.score_metrics.get("ats_score", 0.0)
        self.graph.resume_variants[variant.variant_id] = variant
        self._ensure_resume_variant_embedding(variant)
        return variant

    def score_resume_variant(self, variant: ResumeVariant, job_description: Optional[str] = None) -> Dict[str, float]:
        text = self._variant_text(variant)
        metrics = {
            "impact_density": self._impact_density(text),
            "verb_strength": 1.0 - self._weak_verb_ratio(text),
            "readability": self._readability_score(text),
            "role_alignment": self._role_alignment(variant, job_description),
        }

        if job_description:
            coverage = self._job_coverage_metrics(text, job_description)
            metrics["keyword_coverage"] = coverage["keyword_coverage"]
            metrics["missing_keywords"] = coverage["missing_keywords"]
        else:
            metrics["keyword_coverage"] = 0.0
            metrics["missing_keywords"] = 1.0

        metrics["ats_score"] = self._aggregate_ats_score(metrics)
        return metrics

    def select_best_variant(self, job_description: str, provider: Optional[EmbeddingProvider] = None) -> Optional[ResumeVariant]:
        provider = provider or self.embedding_provider
        job_embedding = provider.embed_job({
            "title": "",
            "description": job_description,
            "keywords": self._extract_keywords(job_description),
        })
        self._ensure_job_embedding(job_description, provider)

        best_variant = None
        best_value = (-1.0, -1.0)

        for variant in self.graph.resume_variants.values():
            variant_embedding = self._ensure_resume_variant_embedding(variant, provider)
            similarity = self._cosine_similarity(job_embedding, variant_embedding.embedding)
            role_alignment = self._role_alignment(variant, job_description)
            candidate_value = (role_alignment, similarity)
            if candidate_value > best_value:
                best_value = candidate_value
                best_variant = variant

        return best_variant

    def _build_summary(self, resume: ResumeDocument, branch: str) -> str:
        branch_skills = self._branch_skills(branch)[:5]
        skills_text = ", ".join(branch_skills) if branch_skills else "a broad technical and leadership profile"
        return f"Targeted {branch.replace('_', ' ').title()} resume variant emphasizing {skills_text}."

    def _build_variant_sections(self, resume: ResumeDocument, branch: str) -> Dict[str, str]:
        sections: Dict[str, str] = {}
        sections["skills"] = self._build_skill_section(branch)
        sections["experience"] = self._build_experience_section(branch)
        sections["projects"] = self._build_project_section(branch)
        sections["certifications"] = self._build_certification_section()
        sections["awards"] = self._build_award_section()
        sections["publications"] = self._build_publication_section()
        sections["patents"] = self._build_patent_section()
        sections["speaking"] = self._build_speaking_section()
        sections["volunteer"] = self._build_volunteer_section()
        return {k: v for k, v in sections.items() if v}

    def _build_variant_keywords(self, resume: ResumeDocument, branch: str) -> List[str]:
        keywords = set(self._extract_keywords(resume.source_text or ""))
        keywords.update(self._branch_skills(branch))
        return sorted(keywords)

    def _branch_skills(self, branch: str) -> List[str]:
        branch = self._normalize_branch(branch)
        branch_terms = BRANCH_KEYWORDS.get(branch, [])
        graph_skills = [skill.name for skill in self.graph.skills.values()]
        matched = [term for term in branch_terms if any(term in skill.lower() for skill in graph_skills)]
        return matched or branch_terms

    def _build_skill_section(self, branch: str) -> str:
        skills = [skill.name for skill in self.graph.skills.values()]
        branch_skills = self._branch_skills(branch)
        prioritized = [skill for skill in skills if any(term in skill.lower() for term in branch_skills)]
        fallback = [skill for skill in skills if skill not in prioritized]
        return ", ".join(prioritized + fallback[:10])

    def _build_experience_section(self, branch: str) -> str:
        terms = BRANCH_KEYWORDS.get(branch, [])
        experiences = self.graph.get_experience_timeline()
        prioritized = []

        for exp in experiences:
            text = f"{exp.job_title} {exp.company} {' '.join(exp.responsibilities)} {exp.description}"
            if branch == "general" or any(term in text.lower() for term in terms):
                prioritized.append(exp)

        if not prioritized:
            prioritized = experiences[:3]

        bullets = []
        for exp in prioritized[:4]:
            bullets.append(f"{exp.job_title} at {exp.company}")
            bullets.extend([f"- {bullet}" for bullet in exp.responsibilities[:4]])

        return "\n".join(bullets)

    def _build_project_section(self, branch: str) -> str:
        terms = BRANCH_KEYWORDS.get(branch, [])
        projects = [p for p in self.graph.projects.values() if branch == "general" or any(term in p.description.lower() for term in terms)]
        if not projects:
            projects = list(self.graph.projects.values())[:3]
        lines = [f"{proj.title}: {proj.description}" for proj in projects[:3]]
        return "\n".join(lines)

    def _build_certification_section(self) -> str:
        if not self.graph.certifications:
            return ""
        return "\n".join([f"{cert.name}" for cert in self.graph.certifications.values()])

    def _build_award_section(self) -> str:
        if not self.graph.awards:
            return ""
        return "\n".join([f"{award.title}" for award in self.graph.awards.values()])

    def _build_publication_section(self) -> str:
        if not self.graph.publications:
            return ""
        return "\n".join([f"{pub.title}" for pub in self.graph.publications.values()])

    def _build_patent_section(self) -> str:
        if not self.graph.patents:
            return ""
        return "\n".join([f"{patent.title}" for patent in self.graph.patents.values()])

    def _build_speaking_section(self) -> str:
        if not self.graph.speaking_engagements:
            return ""
        return "\n".join([f"{talk.title} at {talk.event}" for talk in self.graph.speaking_engagements.values()])

    def _build_volunteer_section(self) -> str:
        if not self.graph.volunteer_work:
            return ""
        return "\n".join([f"{vol.role} at {vol.organization}" for vol in self.graph.volunteer_work.values()])

    def _role_alignment(self, variant: ResumeVariant, job_description: Optional[str]) -> float:
        if not job_description:
            return 0.0
        role_terms = self._extract_keywords(variant.target_role)
        job_keywords = self._extract_keywords(job_description)
        if not role_terms:
            return 0.0
        matched = sum(1 for term in role_terms if term in job_keywords)
        return matched / len(role_terms)

    def _aggregate_ats_score(self, metrics: Dict[str, float]) -> float:
        return max(0.0, min(1.0, (
            metrics.get("keyword_coverage", 0.0) * 0.35 +
            metrics.get("impact_density", 0.0) * 0.2 +
            metrics.get("verb_strength", 0.0) * 0.15 +
            metrics.get("readability", 0.0) * 0.15 +
            metrics.get("role_alignment", 0.0) * 0.15
        )))

    def _normalize_branch(self, branch: str) -> str:
        lower = branch.strip().lower().replace(" ", "_")
        return lower if lower in DEFAULT_BRANCH_TYPES else "general"

    def _ensure_resume_variant_embedding(self, variant: ResumeVariant, provider: Optional[EmbeddingProvider] = None) -> ResumeVariantEmbedding:
        provider = provider or self.embedding_provider
        existing = next((emb for emb in self.graph.resume_variant_embeddings.values() if emb.reference_id == variant.variant_id), None)
        if existing:
            return existing
        embedding = provider.embed_resume_variant(variant.to_dict())
        record = ResumeVariantEmbedding(
            reference_id=variant.variant_id,
            embedding=embedding,
            model_name="simple-text-v1",
        )
        self.graph.resume_variant_embeddings[record.id] = record
        return record

    def _ensure_job_embedding(self, job_description: str, provider: Optional[EmbeddingProvider] = None) -> JobEmbedding:
        provider = provider or self.embedding_provider
        existing = next((emb for emb in self.graph.job_embeddings.values() if emb.reference_id == job_description), None)
        if existing:
            return existing
        embedding = provider.embed_job({
            "title": "",
            "description": job_description,
            "keywords": self._extract_keywords(job_description),
        })
        record = JobEmbedding(
            reference_id=job_description,
            embedding=embedding,
            model_name="simple-text-v1",
        )
        self.graph.job_embeddings[record.id] = record
        return record

    def _cosine_similarity(self, vec_a: List[float], vec_b: List[float]) -> float:
        if not vec_a or not vec_b or len(vec_a) != len(vec_b):
            return 0.0
        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        mag_a = sum(a * a for a in vec_a) ** 0.5
        mag_b = sum(b * b for b in vec_b) ** 0.5
        if mag_a == 0 or mag_b == 0:
            return 0.0
        return dot / (mag_a * mag_b)

    def _aggregate_variant_score(self, metrics: Dict[str, float]) -> float:
        return (
            metrics.get("keyword_coverage", 0.0) * 0.5 +
            metrics.get("impact_density", 0.2) +
            metrics.get("readability", 0.15) +
            metrics.get("recruiter_scan", 0.15)
        )

    def _variant_text(self, variant: ResumeVariant) -> str:
        return "\n".join([variant.summary] + list(variant.sections.values()))

    def _impact_density(self, text: str) -> float:
        lines = [line for line in text.split("\n") if line.strip()]
        if not lines:
            return 0.0
        impactful = sum(1 for line in lines if re.search(r"\d+%|\d+\+|\$\d+|improved|reduced|increased|launched|built|designed", line.lower()))
        return impactful / len(lines)

    def _weak_verb_ratio(self, text: str) -> float:
        words = re.findall(r"\w+", text.lower())
        if not words:
            return 0.0
        weak = sum(1 for word in words if word in WEAK_VERBS)
        return weak / len(words)

    def _readability_score(self, text: str) -> float:
        sentences = re.split(r"[.!?]", text)
        sentences = [s.strip() for s in sentences if s.strip()]
        if not sentences:
            return 0.0
        words = sum(len(re.findall(r"\w+", sentence)) for sentence in sentences)
        avg = words / len(sentences)
        return max(0.0, min(1.0, 1.0 - abs(avg - 14) / 20))

    def _recruiter_scan_score(self, variant: ResumeVariant) -> float:
        score = 0.0
        if variant.summary:
            score += 0.2
        score += 0.2 if variant.sections.get("skills") else 0.0
        score += 0.2 if variant.sections.get("experience") else 0.0
        score += 0.2 if variant.sections.get("projects") else 0.0
        score += 0.2 if any(re.search(r"\d+%|\d+\+|\$\d+", variant.sections.get(section, "")) for section in ["experience", "projects"]) else 0.0
        return min(1.0, score)

    def _extract_keywords(self, text: str) -> List[str]:
        tokens = re.findall(r"\b[a-zA-Z0-9+#.+-]{2,}\b", text.lower())
        keywords = [token for token in tokens if token not in {"the", "and", "for", "with", "from", "that", "this", "have", "has", "are", "will", "use"}]
        return sorted(set(keywords))

    def parser_extract_skills(self, content: str) -> List[str]:
        return [skill.strip() for skill in re.split(r"[,;/]+", content) if skill.strip()]


# Example usage
if __name__ == "__main__":
    from careeros_professional_graph import Identity

    graph = ProfessionalGraph()
    graph.identity = Identity(
        name="Avery Lee",
        email="avery@example.com",
        location="New York, NY",
        country="USA",
    )

    raw_resume = """
    Summary
    Driven product leader with experience launching AI products and building customer-facing platforms.

    Experience
    Product Manager at FinTech Co
    - Launched payment intelligence product used by 50K customers
    - Designed metrics framework to track retention and engagement

    Skills
    Product Strategy, Roadmaps, AI, Machine Learning, SQL, Python, Stakeholder Management

    Projects
    AI Mentor
    - Built a recommendation engine for career path planning
    """

    builder = ResumeGraphBuilder(graph)
    resume = builder.ingest_resume(raw_resume, source_name="upload.txt", title="Avery Resume")

    engine = ResumeIntelligenceEngine(graph)
    variant = engine.generate_resume_variant(resume.resume_id, branch="product", job_description="Product Manager role with AI and customer engagement metrics.")

    print("=== Resume Variant ===")
    print(variant.title)
    print(variant.summary)
    print(variant.score_metrics)
