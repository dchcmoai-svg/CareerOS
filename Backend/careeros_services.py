#!/usr/bin/env python3
"""
CareerOS: Services Layer

These services manage the Professional Graph and provide
domain-specific operations.

Each service:
- Reads/writes to the Professional Graph
- Encapsulates business logic
- Is independently testable
- Can be used by any agent or CLI command
"""

from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
from careeros_professional_graph import (
    ProfessionalGraph, Skill, Experience, Achievement, SkillLevel
)
from careeros_resume_intelligence import ResumeGraphBuilder, ResumeIntelligenceEngine, ResumeVariant


# ============================================================================
# Data Transfer Objects (DTOs)
# ============================================================================

@dataclass
class SkillMatch:
    """Result of skill matching"""
    skill_name: str
    skill_id: str
    match_type: str  # "exact", "related", "transferable"
    score: float  # 0.0 - 1.0
    evidence: List[str]  # Where this skill is demonstrated


@dataclass
class JobRequirement:
    """Parsed job requirement"""
    keyword: str
    type: str  # "required", "preferred", "nice_to_have"
    times_mentioned: int
    related_keywords: List[str]


@dataclass
class JobAnalysis:
    """Result of analyzing a job posting"""
    job_id: str
    title: str
    company: str
    requirements: List[JobRequirement]
    required_keywords: List[str]
    preferred_keywords: List[str]
    ats_keywords: List[str]  # High-frequency keywords


@dataclass
class MatchScore:
    """Match between candidate and job"""
    job_id: str
    overall_score: float  # 0.0 - 1.0
    skills_match: float
    experience_match: float
    culture_match: float
    gaps: List[str]
    strengths: List[str]
    recommendation: str  # "strong", "moderate", "weak"


# ============================================================================
# Skill Service
# ============================================================================

class SkillService:
    """Manage skills in the Professional Graph"""
    
    def __init__(self, graph: ProfessionalGraph):
        self.graph = graph
    
    def extract_skills_from_text(self, text: str) -> List[str]:
        """
        Extract skill keywords from text.
        
        In production, this would use:
        - NLP model (Qwen, BGE)
        - Skill taxonomy
        - Fuzzy matching
        
        For now, simple keyword matching.
        """
        common_skills = [
            "Python", "JavaScript", "Go", "Java", "C++", "SQL",
            "Machine Learning", "Data Science", "DevOps",
            "Leadership", "Communication", "Project Management",
            "AWS", "Kubernetes", "Docker",
        ]
        
        found = []
        text_lower = text.lower()
        
        for skill in common_skills:
            if skill.lower() in text_lower:
                found.append(skill)
        
        return found
    
    def add_skill(
        self,
        name: str,
        category: str,
        level: SkillLevel = SkillLevel.INTERMEDIATE,
        years_experience: float = 0.0,
    ) -> Skill:
        """Add a skill to the graph"""
        skill = Skill(
            name=name,
            category=category,
            level=level,
            years_experience=years_experience,
        )
        
        self.graph.skills[skill.skill_id] = skill
        return skill
    
    def match_skills(
        self,
        required_skills: List[str],
        threshold: float = 0.5
    ) -> List[SkillMatch]:
        """
        Match candidate skills against required skills.
        
        Returns: List of matches with scores
        """
        matches = []
        
        for req_skill in required_skills:
            # Try exact match
            candidate_skills = self.graph.find_skills_by_name(req_skill)
            
            if candidate_skills:
                skill = candidate_skills[0]
                match = SkillMatch(
                    skill_name=req_skill,
                    skill_id=skill.skill_id,
                    match_type="exact",
                    score=1.0,
                    evidence=skill.demonstrated_in,
                )
                matches.append(match)
            else:
                # No match
                match = SkillMatch(
                    skill_name=req_skill,
                    skill_id="",
                    match_type="none",
                    score=0.0,
                    evidence=[],
                )
                matches.append(match)
        
        return [m for m in matches if m.score >= threshold]
    
    def get_skill_gap_analysis(self, required_skills: List[str]) -> Dict:
        """
        Analyze gaps between candidate skills and requirements.
        """
        matches = self.match_skills(required_skills, threshold=0.0)
        
        have = [m for m in matches if m.score > 0]
        gaps = [m for m in matches if m.score == 0]
        
        return {
            "have": have,
            "gaps": gaps,
            "coverage": len(have) / len(matches) if matches else 0,
            "recommendations": self._gap_recommendations(gaps),
        }
    
    def _gap_recommendations(self, gaps: List[SkillMatch]) -> List[str]:
        """Generate recommendations for skill gaps"""
        if not gaps:
            return []
        
        gap_names = [g.skill_name for g in gaps[:3]]
        
        return [
            f"Consider learning {', '.join(gap_names)}",
            f"Take online courses to fill skill gaps",
            f"Look for roles where these skills are nice-to-have, not required",
        ]


# ============================================================================
# Experience Service
# ============================================================================

class ExperienceService:
    """Manage experiences in the Professional Graph"""
    
    def __init__(self, graph: ProfessionalGraph):
        self.graph = graph
    
    def get_transferable_skills(
        self,
        from_experience_id: str,
        to_role_title: str
    ) -> Dict:
        """
        Find transferable skills from one experience to a target role.
        
        Example:
        - From: "Data Engineer at Startup"
        - To: "ML Engineer"
        - Transferable: Python, SQL, Data pipelines, Statistics
        """
        exp = self.graph.experiences.get(from_experience_id)
        if not exp:
            return {}
        
        # Get skills from this experience
        skills = [self.graph.skills.get(sid) for sid in exp.skills_used]
        skills = [s for s in skills if s]
        
        # Determine which are likely transferable to the target role
        # In production, this would use skill taxonomy + embeddings
        
        transferable = []
        for skill in skills:
            # Simple heuristic: technical skills are usually transferable
            if skill.category == "technical":
                transferable.append({
                    "skill_name": skill.name,
                    "how_to_reframe": f"Used {skill.name} in {exp.job_title} role",
                    "relevance": "high",
                })
        
        return {
            "from_role": exp.job_title,
            "to_role": to_role_title,
            "transferable_skills": transferable,
            "recommendations": [
                f"Position your {exp.job_title} background as foundation for {to_role_title}",
                f"Emphasize technical aspects: {', '.join([s['skill_name'] for s in transferable[:3]])}",
            ]
        }
    
    def reposition_for_role(
        self,
        experience_id: str,
        target_role_keywords: List[str]
    ) -> Dict:
        """
        Suggest how to reframe an experience for a specific role.
        
        Example:
        Original: "Built ETL pipelines"
        Target Role: "Data Scientist"
        Reframed: "Built data infrastructure enabling 200+ ML experiments"
        """
        exp = self.graph.experiences.get(experience_id)
        if not exp:
            return {}
        
        # Match current responsibilities against target keywords
        matched_bullets = []
        for bullet in exp.responsibilities:
            for keyword in target_role_keywords:
                if keyword.lower() in bullet.lower():
                    matched_bullets.append(bullet)
                    break
        
        return {
            "original_bullets": exp.responsibilities,
            "target_keywords": target_role_keywords,
            "matched_bullets": matched_bullets,
            "reframing_suggestions": [
                f"Lead with impact on {', '.join(target_role_keywords[:2])}",
                f"Emphasize quantified results",
                f"Connect experience to target role",
            ]
        }


# ============================================================================
# ATS Service
# ============================================================================

class ATSService:
    """
    ATS (Applicant Tracking System) analysis.
    
    Helps understand:
    - What keywords a job posting emphasizes
    - How well candidate matches
    - Positioning suggestions
    """
    
    def __init__(self, graph: ProfessionalGraph):
        self.graph = graph
    
    def extract_job_keywords(self, job_posting: str) -> JobAnalysis:
        """
        Extract keywords from a job posting.
        
        Categorizes into:
        - Required (must-haves)
        - Preferred (nice-to-haves)
        - ATS keywords (high-frequency terms)
        
        In production, this would use NLP + job posting parser.
        """
        
        # Very simplified keyword extraction
        required_keywords = []
        preferred_keywords = []
        
        lines = job_posting.split('\n')
        
        for line in lines:
            line_lower = line.lower()
            
            if 'must have' in line_lower or 'required' in line_lower:
                # Extract keywords from this section
                if 'python' in line_lower:
                    required_keywords.append('Python')
                if 'sql' in line_lower:
                    required_keywords.append('SQL')
                if 'ml' in line_lower or 'machine learning' in line_lower:
                    required_keywords.append('Machine Learning')
            
            elif 'preferred' in line_lower or 'nice to have' in line_lower:
                if 'golang' in line_lower or 'go' in line_lower:
                    preferred_keywords.append('Go')
                if 'kubernetes' in line_lower:
                    preferred_keywords.append('Kubernetes')
        
        return JobAnalysis(
            job_id="",
            title="",
            company="",
            requirements=[
                JobRequirement(
                    keyword=kw,
                    type="required",
                    times_mentioned=1,
                    related_keywords=[]
                )
                for kw in required_keywords
            ],
            required_keywords=required_keywords,
            preferred_keywords=preferred_keywords,
            ats_keywords=required_keywords + preferred_keywords,
        )
    
    def calculate_match_score(
        self,
        candidate_graph: ProfessionalGraph,
        job_analysis: JobAnalysis
    ) -> MatchScore:
        """
        Calculate how well candidate matches job.
        
        Factors:
        - Skills match (required, preferred)
        - Experience level (years, seniority)
        - Industry/domain fit
        """
        
        # Skills matching
        skill_service = SkillService(candidate_graph)
        skill_matches = skill_service.match_skills(
            job_analysis.required_keywords,
            threshold=0.0
        )
        
        matched_required = sum(1 for m in skill_matches if m.score > 0)
        skills_match = matched_required / len(job_analysis.required_keywords) if job_analysis.required_keywords else 0
        
        # Experience match (simplified)
        candidate_years = candidate_graph.get_total_experience_years()
        experience_match = min(1.0, candidate_years / 5.0)  # Normalize to 5 years
        
        # Culture/industry match (placeholder)
        culture_match = 0.7  # Default to moderate
        
        # Overall score (weighted average)
        overall = (skills_match * 0.5 + experience_match * 0.3 + culture_match * 0.2)
        
        # Recommendation
        if overall >= 0.8:
            recommendation = "strong"
        elif overall >= 0.6:
            recommendation = "moderate"
        else:
            recommendation = "weak"
        
        return MatchScore(
            job_id=job_analysis.job_id,
            overall_score=overall,
            skills_match=skills_match,
            experience_match=experience_match,
            culture_match=culture_match,
            gaps=[m.skill_name for m in skill_matches if m.score == 0],
            strengths=[m.skill_name for m in skill_matches if m.score > 0][:3],
            recommendation=recommendation,
        )
    
    def suggest_positioning(
        self,
        job_analysis: JobAnalysis
    ) -> Dict:
        """
        Suggest how to position application for this job.
        
        Returns:
        - Key experiences to emphasize
        - How to reframe background
        - Keywords to include
        """
        
        exp_service = ExperienceService(self.graph)
        
        # Find most relevant experiences
        timeline = self.graph.get_experience_timeline()
        
        suggestions = {
            "positioning_angle": f"Emphasize {', '.join(job_analysis.required_keywords[:2])} expertise",
            "key_experiences": [e.to_dict() for e in timeline[:2]],
            "keywords_to_emphasize": job_analysis.required_keywords,
            "how_to_reframe": [],
        }
        
        for exp in timeline[:2]:
            reframing = exp_service.reposition_for_role(
                exp.experience_id,
                job_analysis.required_keywords
            )
            suggestions["how_to_reframe"].extend(
                reframing.get("reframing_suggestions", [])
            )
        
        return suggestions


# ============================================================================
# Resume Service
# ============================================================================

class ResumeService:
    """Manage resume ingestion and variant generation."""

    def __init__(self, graph: ProfessionalGraph):
        self.graph = graph
        self.builder = ResumeGraphBuilder(graph)
        self.engine = ResumeIntelligenceEngine(graph)

    def upload_resume_text(
        self,
        raw_text: str,
        source_name: str = "uploaded_resume",
        title: str = "Resume",
        branch_tags: Optional[List[str]] = None,
    ) -> List[ResumeVariant]:
        """Ingest raw resume text into the Professional Graph and generate default resume branches."""
        resume = self.builder.ingest_resume(
            raw_text,
            source_name=source_name,
            title=title,
            branch_tags=branch_tags,
        )
        variants = self.engine.generate_resume_variants(resume.resume_id)
        return variants

    def generate_resume_variant(
        self,
        resume_id: str,
        branch: str = "general",
        job_description: Optional[str] = None,
    ) -> ResumeVariant:
        """Generate a resume variant for a given branch and optional job."""
        return self.engine.generate_resume_variant(resume_id, branch=branch, job_description=job_description)

    def list_resume_variants(self, resume_id: str) -> List[ResumeVariant]:
        return self.graph.get_resume_variants_for_resume(resume_id)

    def select_best_variant(self, job_description: str) -> Optional[ResumeVariant]:
        return self.engine.select_best_variant(job_description)


# ============================================================================
# Application Service
# ============================================================================

@dataclass
class ApplicationPacket:
    """Complete package for a job application"""
    packet_id: str
    job_id: str
    variant_id: str
    ats_score: float
    match_score: float
    missing_skills: List[str]
    tailoring_notes: str
    generated_at: str
    
    # Optional components
    resume: Optional[str] = None
    cover_letter: Optional[str] = None
    fit_analysis: Optional[str] = None
    company_research: Optional[str] = None
    status: str = "draft"  # draft, pending_approval, approved, submitted
    submitted_at: Optional[str] = None


class ApplicationService:
    """Manage applications"""
    
    def __init__(self, graph: ProfessionalGraph):
        self.graph = graph
        self.applications: Dict[str, ApplicationPacket] = {}
    
    def create_application_packet(
        self,
        job_id: str,
        job_posting: str
    ) -> ApplicationPacket:
        """
        Create a complete application packet for a job.
        
        Includes:
        - Fit analysis
        - Tailored resume
        - Cover letter
        - Company research
        - ATS score
        """
        from datetime import datetime
        
        # Analyze job
        ats_service = ATSService(self.graph)
        job_analysis = ats_service.extract_job_keywords(job_posting)
        match_score = ats_service.calculate_match_score(self.graph, job_analysis)
        selected_variant = ResumeIntelligenceEngine(self.graph).select_best_variant(job_posting)
        
        # Create packet
        packet = ApplicationPacket(
            packet_id=f"app_{job_id}_{datetime.now().timestamp()}",
            job_id=job_id,
            variant_id=selected_variant.variant_id if selected_variant else "",
            ats_score=selected_variant.score_metrics.get("ats_score", 0.0) if selected_variant else match_score.overall_score,
            match_score=match_score.overall_score,
            missing_skills=match_score.gaps,
            tailoring_notes=(
                f"Selected {selected_variant.variant_type} variant for {selected_variant.target_role}."
                if selected_variant else "No variant selected."
            ),
            generated_at=datetime.now().isoformat(),
            resume=selected_variant.title if selected_variant else None,
            fit_analysis=f"Fit Score: {match_score.overall_score:.1%}",
            status="draft",
        )
        
        self.applications[packet.packet_id] = packet
        
        return packet
    
    def get_application_status(self, packet_id: str) -> Optional[ApplicationPacket]:
        """Get status of an application"""
        return self.applications.get(packet_id)


# ============================================================================
# Example Usage
# ============================================================================

if __name__ == "__main__":
    from careeros_professional_graph import Identity, SkillLevel, EmploymentType
    from datetime import datetime
    
    # Create a graph
    graph = ProfessionalGraph()
    
    # Add identity
    graph.identity = Identity(
        name="Alice Johnson",
        email="alice@example.com",
        location="San Francisco, CA",
        country="USA",
    )
    
    # Add skills using SkillService
    skill_service = SkillService(graph)
    python_skill = skill_service.add_skill(
        name="Python",
        category="technical",
        level=SkillLevel.ADVANCED,
        years_experience=6.0,
    )
    
    ml_skill = skill_service.add_skill(
        name="Machine Learning",
        category="technical",
        level=SkillLevel.ADVANCED,
        years_experience=4.0,
    )
    
    # Add experience
    exp_service = ExperienceService(graph)
    exp = Experience(
        job_title="Senior ML Engineer",
        company="TechCorp",
        employment_type=EmploymentType.FULL_TIME,
        start_date=datetime(2022, 1, 1),
        current=True,
        responsibilities=[
            "Built ML pipeline processing 10M events daily",
            "Led team of 3 engineers",
            "Reduced model inference latency by 40%",
        ],
        skills_used=[python_skill.skill_id, ml_skill.skill_id],
    )
    graph.experiences[exp.experience_id] = exp
    python_skill.demonstrated_in.append(exp.experience_id)
    ml_skill.demonstrated_in.append(exp.experience_id)
    
    # Use ATS Service to analyze a job
    print("=== Job Analysis ===")
    ats_service = ATSService(graph)
    
    job_posting = """
    Senior ML Engineer - TechCorp
    
    Must have:
    - 5+ years of Python
    - Experience with Machine Learning
    - SQL expertise
    
    Preferred:
    - Golang
    - Kubernetes
    """
    
    job_analysis = ats_service.extract_job_keywords(job_posting)
    print(f"Required Keywords: {job_analysis.required_keywords}")
    print(f"Preferred Keywords: {job_analysis.preferred_keywords}")
    
    # Calculate match
    match_score = ats_service.calculate_match_score(graph, job_analysis)
    print(f"\n=== Match Score ===")
    print(f"Overall: {match_score.overall_score:.1%}")
    print(f"Recommendation: {match_score.recommendation}")
    print(f"Strengths: {match_score.strengths}")
    print(f"Gaps: {match_score.gaps}")
    
    # Create application packet
    print(f"\n=== Application Packet ===")
    app_service = ApplicationService(graph)
    packet = app_service.create_application_packet("job_123", job_posting)
    print(f"Packet ID: {packet.packet_id}")
    print(f"ATS Score: {packet.ats_score:.1%}")
    print(f"Status: {packet.status}")
