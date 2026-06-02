#!/usr/bin/env python3
"""
CareerOS: Professional Graph Implementation

This is the foundation of the entire platform.
Everything else reads/writes to this graph.
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Dict, Optional, Set
from enum import Enum
import json
from pathlib import Path
import uuid

from careeros_embeddings import ProfileEmbedding, ResumeVariantEmbedding, JobEmbedding


# ============================================================================
# Data Models
# ============================================================================

class SkillLevel(Enum):
    """Proficiency levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class EmploymentType(Enum):
    """Job types"""
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    FREELANCE = "freelance"
    INTERNSHIP = "internship"


@dataclass
class Identity:
    """Personal information"""
    name: str
    email: str
    location: str
    country: str
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    
    def to_dict(self) -> dict:
        return {
            k: v for k, v in self.__dict__.items()
            if v is not None
        }


@dataclass
class Skill:
    """
    A skill the candidate possesses.
    NOT just a string - a full data structure with evidence.
    """
    skill_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    category: str = ""  # "technical", "soft", "domain"
    level: SkillLevel = SkillLevel.INTERMEDIATE
    
    # Evidence and context
    years_experience: float = 0.0
    first_acquired: Optional[datetime] = None
    last_used: Optional[datetime] = None
    
    # Where was this skill demonstrated?
    demonstrated_in: List[str] = field(default_factory=list)  # experience_ids
    
    # Evidence artifacts
    projects: List[str] = field(default_factory=list)  # project_ids
    achievements: List[str] = field(default_factory=list)  # achievement_ids
    certifications: List[str] = field(default_factory=list)  # cert_ids
    
    # Proficiency markers
    tools_used: List[str] = field(default_factory=list)
    languages_supported: Optional[List[str]] = None
    
    # Keywords for matching
    keywords: List[str] = field(default_factory=list)
    
    def to_dict(self) -> dict:
        return {
            "skill_id": self.skill_id,
            "name": self.name,
            "category": self.category,
            "level": self.level.value,
            "years_experience": self.years_experience,
            "demonstrated_in": self.demonstrated_in,
            "projects": self.projects,
            "achievements": self.achievements,
            "keywords": self.keywords,
        }


@dataclass
class Experience:
    """
    Work experience - the primary container for career information.
    """
    experience_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    job_title: str = ""
    company: str = ""
    location: str = ""
    employment_type: EmploymentType = EmploymentType.FULL_TIME
    start_date: datetime = field(default_factory=datetime.now)
    end_date: Optional[datetime] = None
    current: bool = False
    
    # What did they actually do?
    description: str = ""
    responsibilities: List[str] = field(default_factory=list)
    
    # What did they achieve?
    achievements: List[str] = field(default_factory=list)
    
    # What skills were developed/used?
    skills_used: List[str] = field(default_factory=list)  # skill_ids
    skills_developed: List[str] = field(default_factory=list)  # skill_ids
    
    # What projects were worked on?
    projects: List[str] = field(default_factory=list)  # project_ids
    
    # Measurable impact
    impact_metrics: Dict[str, str] = field(default_factory=dict)
    
    def duration_months(self) -> float:
        """Calculate duration in months"""
        end = self.end_date or datetime.now()
        delta = end - self.start_date
        return delta.days / 30.0
    
    def to_dict(self) -> dict:
        return {
            "experience_id": self.experience_id,
            "job_title": self.job_title,
            "company": self.company,
            "employment_type": self.employment_type.value,
            "duration_months": self.duration_months(),
            "achievements": self.achievements,
            "skills_used": self.skills_used,
            "impact_metrics": self.impact_metrics,
        }


@dataclass
class Achievement:
    """
    A specific accomplishment with evidence and impact.
    """
    achievement_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    description: str = ""
    impact: str = ""  # What was the result?
    skills_demonstrated: List[str] = field(default_factory=list)  # skill_ids
    
    # Where did this happen?
    experience_id: Optional[str] = None
    project_id: Optional[str] = None
    
    # Measurable outcomes
    metrics: Dict[str, str] = field(default_factory=dict)
    
    # Evidence/verification
    evidence: List[str] = field(default_factory=list)  # links, artifacts
    
    def to_dict(self) -> dict:
        return {
            "achievement_id": self.achievement_id,
            "title": self.title,
            "description": self.description,
            "impact": self.impact,
            "skills_demonstrated": self.skills_demonstrated,
            "metrics": self.metrics,
        }


@dataclass
class Project:
    """
    Personal or work project showcasing skills.
    """
    project_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    description: str = ""
    url: Optional[str] = None
    github_url: Optional[str] = None
    
    # Skills demonstrated
    skills: List[str] = field(default_factory=list)  # skill_ids
    
    # Timeline
    start_date: datetime = field(default_factory=datetime.now)
    end_date: Optional[datetime] = None
    
    # Impact
    impact: str = ""
    metrics: Dict[str, str] = field(default_factory=dict)
    
    def to_dict(self) -> dict:
        return {
            "project_id": self.project_id,
            "title": self.title,
            "skills": self.skills,
            "impact": self.impact,
            "url": self.url or self.github_url,
        }


@dataclass
class Education:
    """
    Formal education and certifications.
    """
    education_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    degree: str = ""  # "B.S. Computer Science"
    institution: str = ""
    field_of_study: str = ""
    start_year: int = 0
    end_year: int = 0
    gpa: Optional[float] = None
    
    # Relevant coursework and topics
    relevant_coursework: List[str] = field(default_factory=list)
    honors: List[str] = field(default_factory=list)
    
    # Skills acquired
    skills_acquired: List[str] = field(default_factory=list)  # skill_ids
    
    def to_dict(self) -> dict:
        return {
            "education_id": self.education_id,
            "degree": self.degree,
            "institution": self.institution,
            "field": self.field_of_study,
            "skills_acquired": self.skills_acquired,
        }


@dataclass
class CareerGoal:
    """
    Career aspirations and direction.
    """
    goal_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""  # e.g., "Become ML Platform Lead"
    description: str = ""
    target_roles: List[str] = field(default_factory=list)
    target_companies: List[str] = field(default_factory=list)
    target_locations: List[str] = field(default_factory=list)
    
    # Skills needed to reach goal
    required_skills: List[str] = field(default_factory=list)  # skill_ids
    
    # Timeline
    timeframe_months: int = 12
    priority: int = 0  # 0-10, higher = more important
    
    def to_dict(self) -> dict:
        return {
            "goal_id": self.goal_id,
            "title": self.title,
            "target_roles": self.target_roles,
            "required_skills": self.required_skills,
            "timeframe_months": self.timeframe_months,
        }


@dataclass
class Certification:
    """Professional certification or credential."""
    certification_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    issuer: str = ""
    date_obtained: Optional[datetime] = None
    expiration_date: Optional[datetime] = None
    url: Optional[str] = None
    skills_covered: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "certification_id": self.certification_id,
            "name": self.name,
            "issuer": self.issuer,
            "date_obtained": self.date_obtained.isoformat() if self.date_obtained else None,
            "expiration_date": self.expiration_date.isoformat() if self.expiration_date else None,
            "url": self.url,
            "skills_covered": self.skills_covered,
        }


@dataclass
class LeadershipRole:
    """A leadership or mentorship role held by the candidate."""
    role_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    organization: str = ""
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    description: str = ""
    impact: str = ""
    skills_demonstrated: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "role_id": self.role_id,
            "title": self.title,
            "organization": self.organization,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "description": self.description,
            "impact": self.impact,
            "skills_demonstrated": self.skills_demonstrated,
        }


@dataclass
class OpenSourceProject:
    """Open source or community contribution."""
    project_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    description: str = ""
    repo_url: Optional[str] = None
    skills: List[str] = field(default_factory=list)
    contributions: List[str] = field(default_factory=list)
    impact_metrics: Dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "project_id": self.project_id,
            "name": self.name,
            "description": self.description,
            "repo_url": self.repo_url,
            "skills": self.skills,
            "contributions": self.contributions,
            "impact_metrics": self.impact_metrics,
        }


@dataclass
class ResearchWork:
    """Research, publications, or technical writing."""
    research_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    description: str = ""
    venue: Optional[str] = None
    url: Optional[str] = None
    skills: List[str] = field(default_factory=list)
    metrics: Dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "research_id": self.research_id,
            "title": self.title,
            "description": self.description,
            "venue": self.venue,
            "url": self.url,
            "skills": self.skills,
            "metrics": self.metrics,
        }


@dataclass
class Award:
    """A career award, recognition, or honor."""
    award_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    issuer: str = ""
    date_awarded: Optional[datetime] = None
    description: str = ""
    skills: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "award_id": self.award_id,
            "title": self.title,
            "issuer": self.issuer,
            "date_awarded": self.date_awarded.isoformat() if self.date_awarded else None,
            "description": self.description,
            "skills": self.skills,
        }


@dataclass
class Publication:
    """A publication, blog, article, or paper."""
    publication_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    publication_name: str = ""
    date_published: Optional[datetime] = None
    url: Optional[str] = None
    summary: str = ""
    skills: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "publication_id": self.publication_id,
            "title": self.title,
            "publication_name": self.publication_name,
            "date_published": self.date_published.isoformat() if self.date_published else None,
            "url": self.url,
            "summary": self.summary,
            "skills": self.skills,
        }


@dataclass
class SpeakingEngagement:
    """A speaking event or presentation."""
    speaking_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    event: str = ""
    date: Optional[datetime] = None
    url: Optional[str] = None
    summary: str = ""
    skills: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "speaking_id": self.speaking_id,
            "title": self.title,
            "event": self.event,
            "date": self.date.isoformat() if self.date else None,
            "url": self.url,
            "summary": self.summary,
            "skills": self.skills,
        }


@dataclass
class Patent:
    """A patent or invention disclosure."""
    patent_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    patent_number: str = ""
    date_filed: Optional[datetime] = None
    date_issued: Optional[datetime] = None
    url: Optional[str] = None
    summary: str = ""
    skills: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "patent_id": self.patent_id,
            "title": self.title,
            "patent_number": self.patent_number,
            "date_filed": self.date_filed.isoformat() if self.date_filed else None,
            "date_issued": self.date_issued.isoformat() if self.date_issued else None,
            "url": self.url,
            "summary": self.summary,
            "skills": self.skills,
        }


@dataclass
class VolunteerWork:
    """Volunteer work or community contributions."""
    volunteer_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    organization: str = ""
    role: str = ""
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    description: str = ""
    skills: List[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "volunteer_id": self.volunteer_id,
            "organization": self.organization,
            "role": self.role,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "description": self.description,
            "skills": self.skills,
        }


@dataclass
class ResumeDocument:
    """A canonical resume source stored in Career Vault."""
    resume_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    source_name: Optional[str] = None
    uploaded_at: datetime = field(default_factory=datetime.now)
    sections: Dict[str, str] = field(default_factory=dict)
    branch_tags: List[str] = field(default_factory=list)
    source_text: Optional[str] = None
    artifact_path: Optional[str] = None

    def to_dict(self) -> dict:
        return {
            "resume_id": self.resume_id,
            "title": self.title,
            "source_name": self.source_name,
            "uploaded_at": self.uploaded_at.isoformat(),
            "sections": self.sections,
            "branch_tags": self.branch_tags,
            "artifact_path": self.artifact_path,
        }


@dataclass
class ResumeVariant:
    """A generated resume variant for a specific branch or target."""
    variant_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    resume_id: str = ""
    branch: str = "general"
    variant_type: str = "GENERAL"
    target_role: str = ""
    target_industry: str = ""
    title: str = ""
    summary: str = ""
    sections: Dict[str, str] = field(default_factory=dict)
    keywords: List[str] = field(default_factory=list)
    priority_skills: List[str] = field(default_factory=list)
    score_metrics: Dict[str, float] = field(default_factory=dict)
    ats_score: float = 0.0
    generated_at: datetime = field(default_factory=datetime.now)

    def to_dict(self) -> dict:
        return {
            "variant_id": self.variant_id,
            "resume_id": self.resume_id,
            "branch": self.branch,
            "variant_type": self.variant_type,
            "target_role": self.target_role,
            "target_industry": self.target_industry,
            "title": self.title,
            "summary": self.summary,
            "sections": self.sections,
            "keywords": self.keywords,
            "priority_skills": self.priority_skills,
            "score_metrics": self.score_metrics,
            "ats_score": self.ats_score,
            "generated_at": self.generated_at.isoformat(),
        }


# ============================================================================
# Professional Graph
# ============================================================================

class ProfessionalGraph:
    """
    The single source of truth for career data.
    
    This is NOT just a serialized resume.
    It's a rich, interconnected graph of career information.
    
    Every piece of information is:
    - Structured (not free-form text)
    - Relational (connected to other data)
    - Temporal (when was it acquired/used)
    - Evidenced (backed by artifacts)
    """
    
    def __init__(self):
        # Core entities
        self.identity: Optional[Identity] = None
        self.skills: Dict[str, Skill] = {}
        self.experiences: Dict[str, Experience] = {}
        self.achievements: Dict[str, Achievement] = {}
        self.projects: Dict[str, Project] = {}
        self.education: Dict[str, Education] = {}
        self.career_goals: Dict[str, CareerGoal] = {}
        self.certifications: Dict[str, Certification] = {}
        self.leadership_roles: Dict[str, LeadershipRole] = {}
        self.open_source_projects: Dict[str, OpenSourceProject] = {}
        self.research_entries: Dict[str, ResearchWork] = {}
        self.awards: Dict[str, Award] = {}
        self.publications: Dict[str, Publication] = {}
        self.speaking_engagements: Dict[str, SpeakingEngagement] = {}
        self.patents: Dict[str, Patent] = {}
        self.volunteer_work: Dict[str, VolunteerWork] = {}
        self.resumes: Dict[str, ResumeDocument] = {}
        self.resume_variants: Dict[str, ResumeVariant] = {}
        self.profile_embeddings: Dict[str, ProfileEmbedding] = {}
        self.resume_variant_embeddings: Dict[str, ResumeVariantEmbedding] = {}
        self.job_embeddings: Dict[str, JobEmbedding] = {}
        
        # Preferences and constraints
        self.preferences: Dict[str, any] = {}
        self.deal_breakers: List[str] = []
    
    # ========================================================================
    # Skill Queries
    # ========================================================================
    
    def get_skill(self, skill_id: str) -> Optional[Skill]:
        """Get a skill by ID"""
        return self.skills.get(skill_id)
    
    def find_skills_by_name(self, name: str) -> List[Skill]:
        """Find skills by name (case-insensitive substring)"""
        name_lower = name.lower()
        return [
            skill for skill in self.skills.values()
            if name_lower in skill.name.lower()
        ]
    
    def find_skills_by_category(self, category: str) -> List[Skill]:
        """Find skills by category (technical, soft, domain)"""
        return [
            skill for skill in self.skills.values()
            if skill.category == category
        ]
    
    def get_skill_level(self, skill_name: str) -> Optional[SkillLevel]:
        """Get proficiency level for a skill"""
        skills = self.find_skills_by_name(skill_name)
        if skills:
            return skills[0].level
        return None
    
    def get_top_skills(self, limit: int = 10) -> List[Skill]:
        """Get top skills by proficiency level and years of experience"""
        level_order = {
            SkillLevel.EXPERT: 4,
            SkillLevel.ADVANCED: 3,
            SkillLevel.INTERMEDIATE: 2,
            SkillLevel.BEGINNER: 1,
        }
        
        sorted_skills = sorted(
            self.skills.values(),
            key=lambda s: (level_order.get(s.level, 0), s.years_experience),
            reverse=True
        )
        
        return sorted_skills[:limit]
    
    def get_resume(self, resume_id: str) -> Optional[ResumeDocument]:
        """Get a resume document by ID."""
        return self.resumes.get(resume_id)
    
    def get_resume_variant(self, variant_id: str) -> Optional[ResumeVariant]:
        """Get a generated resume variant by ID."""
        return self.resume_variants.get(variant_id)
    
    def get_resume_variants_for_resume(self, resume_id: str) -> List[ResumeVariant]:
        """Get all variants for a given resume document."""
        return [
            variant for variant in self.resume_variants.values()
            if variant.resume_id == resume_id
        ]
    
    def get_resume_branches(self) -> List[str]:
        """List all resume branches available in the graph."""
        return list({variant.branch for variant in self.resume_variants.values()})
    
    # ========================================================================
    # Experience Queries
    # ========================================================================
    
    def get_experience(self, exp_id: str) -> Optional[Experience]:
        """Get an experience by ID"""
        return self.experiences.get(exp_id)
    
    def get_current_role(self) -> Optional[Experience]:
        """Get the current job (if any)"""
        for exp in self.experiences.values():
            if exp.current:
                return exp
        return None
    
    def get_experience_timeline(self) -> List[Experience]:
        """Get all experiences sorted by date (most recent first)"""
        return sorted(
            self.experiences.values(),
            key=lambda e: e.start_date,
            reverse=True
        )
    
    def get_total_experience_years(self) -> float:
        """Calculate total years of experience"""
        timeline = self.get_experience_timeline()
        if not timeline:
            return 0.0
        
        most_recent = timeline[0]
        earliest = timeline[-1]
        
        delta = (most_recent.start_date if most_recent.current else most_recent.end_date) - earliest.start_date
        return delta.days / 365.0
    
    # ========================================================================
    # Skill-Experience Relationships
    # ========================================================================
    
    def get_skill_history(self, skill_name: str) -> Dict:
        """
        Get complete history of a skill:
        - When acquired
        - Where used
        - Proficiency over time
        - Evidence
        """
        skills = self.find_skills_by_name(skill_name)
        if not skills:
            return {}
        
        skill = skills[0]
        
        # Find experiences where this skill was used
        experiences = [self.experiences.get(exp_id) for exp_id in skill.demonstrated_in]
        experiences = [e for e in experiences if e]
        
        # Find achievements demonstrating this skill
        achievements = [self.achievements.get(ach_id) for ach_id in skill.achievements]
        achievements = [a for a in achievements if a]
        
        # Find projects using this skill
        projects = [self.projects.get(proj_id) for proj_id in skill.projects]
        projects = [p for p in projects if p]
        
        return {
            "skill": skill.to_dict(),
            "experiences": [e.to_dict() for e in experiences],
            "achievements": [a.to_dict() for a in achievements],
            "projects": [p.to_dict() for p in projects],
            "years_experience": skill.years_experience,
            "last_used": skill.last_used.isoformat() if skill.last_used else None,
        }
    
    def get_experience_skills(self, experience_id: str) -> Dict[str, Skill]:
        """Get all skills from a specific experience"""
        exp = self.experiences.get(experience_id)
        if not exp:
            return {}
        
        skills = {}
        for skill_id in exp.skills_used:
            skill = self.skills.get(skill_id)
            if skill:
                skills[skill_id] = skill
        
        return skills
    
    # ========================================================================
    # Job Matching Queries
    # ========================================================================
    
    def get_role_fit(self, required_skills: List[str]) -> Dict:
        """
        Analyze fit for a role based on required skills.
        
        Returns:
        {
            "fit_score": 0.85,
            "skills_match": {
                "required": [...],
                "have": [...],
                "gaps": [...]
            },
            "evidence": {...}
        }
        """
        have_skills = set(self.skills.keys())
        required_set = set(required_skills)
        
        matched = required_set & have_skills
        gaps = required_set - have_skills
        
        fit_score = len(matched) / len(required_set) if required_set else 0
        
        return {
            "fit_score": fit_score,
            "skills_match": {
                "required": list(required_set),
                "have": list(matched),
                "gaps": list(gaps),
            },
            "evidence": {
                skill_id: self.get_skill_history(self.skills[skill_id].name)
                for skill_id in matched
            },
        }
    
    def suggest_positioning(self, target_role: str) -> Dict:
        """
        Suggest how to position existing experience for a target role.
        
        Returns:
        {
            "positioning": "Platform ML Engineer",
            "angle": "5 years building data pipelines → ML platform infrastructure",
            "key_experiences": [...],
            "recommended_bullets": [...]
        }
        """
        # This would typically call an agent, but we can provide the data structure
        return {
            "target_role": target_role,
            "key_experiences": [
                exp.to_dict() for exp in self.get_experience_timeline()[:3]
            ],
            "transferable_skills": [
                skill.to_dict() for skill in self.get_top_skills()
            ],
        }
    
    # ========================================================================
    # Serialization
    # ========================================================================
    
    def to_dict(self) -> dict:
        """Serialize entire graph"""
        return {
            "identity": self.identity.to_dict() if self.identity else None,
            "skills": {k: v.to_dict() for k, v in self.skills.items()},
            "experiences": {k: v.to_dict() for k, v in self.experiences.items()},
            "achievements": {k: v.to_dict() for k, v in self.achievements.items()},
            "projects": {k: v.to_dict() for k, v in self.projects.items()},
            "education": {k: v.to_dict() for k, v in self.education.items()},
            "goals": {k: v.to_dict() for k, v in self.career_goals.items()},
            "certifications": {k: v.to_dict() for k, v in self.certifications.items()},
            "leadership_roles": {k: v.to_dict() for k, v in self.leadership_roles.items()},
            "open_source_projects": {k: v.to_dict() for k, v in self.open_source_projects.items()},
            "research_entries": {k: v.to_dict() for k, v in self.research_entries.items()},
            "awards": {k: v.to_dict() for k, v in self.awards.items()},
            "publications": {k: v.to_dict() for k, v in self.publications.items()},
            "speaking_engagements": {k: v.to_dict() for k, v in self.speaking_engagements.items()},
            "patents": {k: v.to_dict() for k, v in self.patents.items()},
            "volunteer_work": {k: v.to_dict() for k, v in self.volunteer_work.items()},
            "resumes": {k: v.to_dict() for k, v in self.resumes.items()},
            "resume_variants": {k: v.to_dict() for k, v in self.resume_variants.items()},
            "profile_embeddings": {k: v.to_dict() for k, v in self.profile_embeddings.items()},
            "resume_variant_embeddings": {k: v.to_dict() for k, v in self.resume_variant_embeddings.items()},
            "job_embeddings": {k: v.to_dict() for k, v in self.job_embeddings.items()},
            "preferences": self.preferences,
            "deal_breakers": self.deal_breakers,
        }
    
    def save_to_file(self, path: Path):
        """Save graph to JSON file"""
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, 'w') as f:
            json.dump(self.to_dict(), f, indent=2, default=str)
    
    def load_from_file(self, path: Path):
        """Load graph from JSON file (simplified)"""
        with open(path, 'r') as f:
            data = json.load(f)
        
        # Basic loading (real implementation would be more robust)
        if data.get("identity"):
            self.identity = Identity(**data["identity"])
    
    def __repr__(self) -> str:
        """Summary of the graph"""
        return f"""
ProfessionalGraph(
    name={self.identity.name if self.identity else 'Unknown'},
    skills={len(self.skills)},
    experiences={len(self.experiences)},
    achievements={len(self.achievements)},
    years_experience={self.get_total_experience_years():.1f},
    top_skills={[s.name for s in self.get_top_skills(3)]}
)
"""


# ============================================================================
# Example Usage
# ============================================================================

if __name__ == "__main__":
    # Create a graph
    graph = ProfessionalGraph()
    
    # Add identity
    graph.identity = Identity(
        name="Alice Johnson",
        email="alice@example.com",
        location="San Francisco, CA",
        country="USA",
        github_url="https://github.com/alice"
    )
    
    # Add skills
    python_skill = Skill(
        name="Python",
        category="technical",
        level=SkillLevel.ADVANCED,
        years_experience=6.0,
    )
    graph.skills[python_skill.skill_id] = python_skill
    
    ml_skill = Skill(
        name="Machine Learning",
        category="technical",
        level=SkillLevel.ADVANCED,
        years_experience=4.0,
    )
    graph.skills[ml_skill.skill_id] = ml_skill
    
    # Add experience
    exp = Experience(
        job_title="Senior ML Engineer",
        company="Tech Company",
        employment_type=EmploymentType.FULL_TIME,
        start_date=datetime(2022, 1, 1),
        current=True,
        responsibilities=[
            "Built ML pipeline processing 10M events/day",
            "Led team of 3 ML engineers",
            "Reduced inference latency by 40%",
        ],
        skills_used=[python_skill.skill_id, ml_skill.skill_id],
        impact_metrics={
            "daily_events": "10M",
            "latency_reduction": "40%",
            "team_size": "3",
        }
    )
    graph.experiences[exp.experience_id] = exp
    
    # Link skill to experience
    python_skill.demonstrated_in.append(exp.experience_id)
    ml_skill.demonstrated_in.append(exp.experience_id)
    
    # Query the graph
    print(graph)
    print("\n=== Top Skills ===")
    for skill in graph.get_top_skills():
        print(f"  {skill.name}: {skill.level.value}")
    
    print("\n=== Current Role ===")
    current = graph.get_current_role()
    if current:
        print(f"  {current.job_title} at {current.company}")
    
    print("\n=== Skill History: Python ===")
    history = graph.get_skill_history("Python")
    print(f"  Level: {history['skill']['level']}")
    print(f"  Years: {history['skill']['years_experience']}")
    print(f"  Used in: {len(history['experiences'])} experiences")
    
    print("\n=== Role Fit for ML Engineer role ===")
    fit = graph.get_role_fit([python_skill.skill_id, ml_skill.skill_id])
    print(f"  Fit Score: {fit['fit_score']*100:.0f}%")
    print(f"  Matched Skills: {len(fit['skills_match']['have'])}")
    print(f"  Skill Gaps: {len(fit['skills_match']['gaps'])}")
