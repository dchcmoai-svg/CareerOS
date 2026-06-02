from django.db import models
from django.contrib.auth.models import User

# --- 1. IDENTITY GRAPH ---

class ProfessionalIdentity(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="professional_identity")
    
    # Core inferred identity
    inferred_seniority = models.CharField(max_length=50, blank=True, null=True)
    primary_industry = models.CharField(max_length=100, blank=True, null=True)
    
    # Enrichment Flags
    github_connected = models.BooleanField(default=False)
    linkedin_connected = models.BooleanField(default=False)
    resume_parsed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Professional Identity"


class Skill(models.Model):
    identity = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=100)
    inferred_from = models.CharField(max_length=50, choices=[("github", "GitHub"), ("linkedin", "LinkedIn"), ("resume", "Resume"), ("manual", "Manual")])
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name


# --- 2. MARKETPLACE GRAPH ---

class MarketplacePreferences(models.Model):
    identity = models.OneToOneField(ProfessionalIdentity, on_delete=models.CASCADE, related_name="marketplace_preferences")
    
    # Visibility controls (Trust Infrastructure)
    is_stealth_mode = models.BooleanField(default=False)
    blocked_companies = models.JSONField(default=list, blank=True)
    
    # Target Signals
    target_salary_min = models.IntegerField(null=True, blank=True)
    target_role_types = models.JSONField(default=list, blank=True) # e.g. ["Remote", "Hybrid"]
    target_stages = models.JSONField(default=list, blank=True) # e.g. ["Series A", "Enterprise"]

    def __str__(self):
        return f"Marketplace Prefs - {self.identity.user.username}"


# --- 3. CAREER OPERATIONS (TRACKER) ---

class TrackerItem(models.Model):
    STAGE_CHOICES = [
        ("discovered", "Discovered"),
        ("applied", "Applied"),
        ("interviewing", "Interviewing"),
        ("offer", "Offer"),
        ("rejected", "Rejected"),
        ("stalled", "Stalled")
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tracker_items")
    # Link to the scraped job model if it exists
    job = models.ForeignKey("scraper.Job", on_delete=models.SET_NULL, null=True, blank=True)
    
    company_name = models.CharField(max_length=255)
    role_title = models.CharField(max_length=255)
    
    stage = models.CharField(max_length=50, choices=STAGE_CHOICES, default="discovered")
    stage_updated_at = models.DateTimeField(auto_now_add=True)
    
    ats_score = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.role_title} @ {self.company_name} ({self.stage})"


class ResumeVariant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="resume_variants")
    
    # Git-like variant naming
    branch_name = models.CharField(max_length=100) # e.g., 'feature/stripe-frontend'
    target_role = models.CharField(max_length=100, blank=True, null=True)
    
    content_json = models.JSONField(default=dict)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.branch_name}"


# --- 4. RECRUITER GRAPH ---

class RecruiterInteraction(models.Model):
    tracker_item = models.ForeignKey(TrackerItem, on_delete=models.CASCADE, related_name="interactions")
    
    interaction_type = models.CharField(max_length=50, choices=[("outbound", "Outbound"), ("inbound", "Inbound"), ("interview", "Interview")])
    notes = models.TextField(blank=True, null=True)
    
    responded = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.interaction_type} for {self.tracker_item.company_name}"


# --- 5. AI MEMORY GRAPH ---

class AiMemory(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="ai_memory")
    
    # Key-value store of ecosystem context
    context_blob = models.JSONField(default=dict)
    
    last_interaction_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"AI Memory for {self.user.username}"


# ============================================================================
# LAYER 2 — PROFESSIONAL GRAPH EXTENSIONS
# ============================================================================
# These models enrich the professional identity with detailed career history,
# accomplishments, and portable professional equity.

class Experience(models.Model):
    identity = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="experiences")
    
    company = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)  # Null = current role
    
    seniority_level = models.CharField(max_length=50, blank=True, null=True)  # e.g., "Mid", "Senior", "Lead"
    industry = models.CharField(max_length=100, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} @ {self.company}"


class Education(models.Model):
    identity = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="education")
    
    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=100)  # e.g., "Bachelor's", "Master's"
    field_of_study = models.CharField(max_length=255, blank=True, null=True)
    
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    
    grade = models.CharField(max_length=10, blank=True, null=True)  # GPA or similar
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.degree} in {self.field_of_study} from {self.institution}"


class Project(models.Model):
    identity = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="projects")
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    url = models.URLField(blank=True, null=True)
    
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    
    skills_involved = models.JSONField(default=list, blank=True)  # e.g., ["Python", "React"]
    impact = models.TextField(blank=True, null=True)  # e.g., "Reduced load time by 40%"
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Achievement(models.Model):
    identity = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="achievements")
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    
    category = models.CharField(max_length=100, blank=True, null=True)  # e.g., "Performance", "Innovation"
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Certification(models.Model):
    identity = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="certifications")
    
    name = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255)
    credential_id = models.CharField(max_length=255, blank=True, null=True)
    credential_url = models.URLField(blank=True, null=True)
    
    issue_date = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (Issued by {self.issuer})"


class Award(models.Model):
    identity = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="awards")
    
    title = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} from {self.issuer}"


class Publication(models.Model):
    identity = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="publications")
    
    title = models.CharField(max_length=255)
    publisher = models.CharField(max_length=255, blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    
    publication_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Patent(models.Model):
    identity = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="patents")
    
    title = models.CharField(max_length=255)
    patent_number = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField()
    url = models.URLField(blank=True, null=True)
    
    filing_date = models.DateField()
    issue_date = models.DateField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class VolunteerWork(models.Model):
    identity = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="volunteer_work")
    
    organization = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    
    cause = models.CharField(max_length=100, blank=True, null=True)  # e.g., "Education", "Environment"
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.position} @ {self.organization}"


class SpeakingEngagement(models.Model):
    identity = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="speaking_engagements")
    
    title = models.CharField(max_length=255)
    event = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    event_date = models.DateField()
    url = models.URLField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} @ {self.event}"


# ============================================================================
# LAYER 3 — INTELLIGENCE LAYER
# ============================================================================
# These models represent the reasoning layer: how jobs match profiles,
# recommendations, market trends, and recruiter signals.

class JobProfile(models.Model):
    """
    Structured understanding of a job opportunity.
    Enriches the raw Job model with inferred intelligence.
    """
    job = models.OneToOneField("scraper.Job", on_delete=models.CASCADE, related_name="job_profile")
    
    seniority_level = models.CharField(max_length=50, blank=True, null=True)  # e.g., "Junior", "Mid", "Senior"
    work_mode = models.CharField(max_length=50, blank=True, null=True)  # e.g., "Remote", "Hybrid", "Onsite"
    visa_support = models.BooleanField(null=True, blank=True)  # Does employer sponsor visas?
    
    industry = models.CharField(max_length=100, blank=True, null=True)
    salary_band_min = models.IntegerField(null=True, blank=True)
    salary_band_max = models.IntegerField(null=True, blank=True)
    
    hiring_velocity = models.IntegerField(default=0)  # Number of similar roles posted recently
    role_stability_score = models.FloatField(default=0.5)  # 0-1: likelihood role persists
    
    confidence_score = models.FloatField(default=0.0)  # 0-1: confidence in profiling accuracy
    
    extracted_skills = models.JSONField(default=list, blank=True)  # Parsed skills from JD
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.job.title} @ {self.job.company}"


class MatchResult(models.Model):
    """
    Computed match between a professional profile and a job opportunity.
    Powers the "91% Match" UI widget.
    """
    RECOMMENDATION_LEVEL_CHOICES = [
        ("strong_yes", "Strong Yes"),
        ("yes", "Yes"),
        ("maybe", "Maybe"),
        ("no", "No"),
        ("strong_no", "Strong No"),
    ]
    
    profile = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="match_results")
    job = models.ForeignKey("scraper.Job", on_delete=models.CASCADE, related_name="match_results")
    resume_variant = models.ForeignKey(ResumeVariant, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Overall score and component scores
    overall_score = models.FloatField()  # 0-100
    skill_match_score = models.FloatField(default=0.0)
    experience_match_score = models.FloatField(default=0.0)
    salary_alignment_score = models.FloatField(default=0.0)
    location_match_score = models.FloatField(default=0.0)
    resume_relevance_score = models.FloatField(default=0.0)
    
    recommendation_level = models.CharField(max_length=20, choices=RECOMMENDATION_LEVEL_CHOICES, default="maybe")
    
    # Reasoning
    reasoning_json = models.JSONField(default=dict, blank=True)  # Breakdown of why this score
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.overall_score}% match: {self.profile.user.username} → {self.job.title} @ {self.job.company}"

    class Meta:
        unique_together = ("profile", "job", "resume_variant")


class Recommendation(models.Model):
    """
    AI-generated recommendation for why a job is good for a profile.
    """
    PRIORITY_CHOICES = [
        ("critical", "Critical"),
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    ]
    
    profile = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="recommendations")
    job = models.ForeignKey("scraper.Job", on_delete=models.CASCADE, related_name="recommendations")
    
    reason = models.TextField()  # e.g., "High Match on React & Node.js skills"
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="medium")
    score = models.FloatField()  # 0-100
    
    tags = models.JSONField(default=list, blank=True)  # e.g., ["high_match", "fast_hiring", "remote"]
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Recommendation: {self.reason}"


class MarketSignal(models.Model):
    """
    Market-level insights: demand for skills, salary trends, growth rates.
    """
    skill = models.CharField(max_length=100, db_index=True)
    region = models.CharField(max_length=100, db_index=True)  # e.g., "US-CA", "EU-UK"
    
    demand_score = models.FloatField()  # 0-100: How hot is this skill in this region?
    salary_trend = models.FloatField()  # -100 to +100: Salary change over 6 months
    growth_rate = models.FloatField()  # Job postings growth %
    
    data_points = models.IntegerField(default=0)  # Number of data points in calculation
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.skill} in {self.region}: Demand {self.demand_score}"

    class Meta:
        unique_together = ("skill", "region")


class VisibilityScore(models.Model):
    """
    How visible is a profile to recruiters?
    Affected by marketplace preferences, completeness, activity.
    """
    profile = models.OneToOneField(ProfessionalIdentity, on_delete=models.CASCADE, related_name="visibility_score")
    
    profile_completeness = models.FloatField(default=0.0)  # 0-100: How complete is the profile?
    activity_score = models.FloatField(default=0.0)  # 0-100: Recent activity level
    recruiter_engagement_score = models.FloatField(default=0.0)  # 0-100: Past recruiter interest
    
    overall_visibility = models.FloatField(default=0.0)  # 0-100: Overall visibility to recruiters
    
    # Factors
    is_searchable = models.BooleanField(default=True)
    has_recent_updates = models.BooleanField(default=False)
    open_to_opportunities = models.BooleanField(default=False)
    
    last_recalculated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Visibility Score: {self.overall_visibility} for {self.profile.user.username}"


class RecruiterSearch(models.Model):
    """
    Track when recruiters search for or contact candidates.
    Powers marketplace intelligence.
    """
    profile = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="recruiter_searches")
    
    recruiter_name = models.CharField(max_length=255, blank=True, null=True)
    recruiter_company = models.CharField(max_length=255, blank=True, null=True)
    
    search_query = models.TextField(blank=True, null=True)  # e.g., "Senior Python Engineer, SF"
    contact_method = models.CharField(max_length=50, blank=True, null=True)  # e.g., "LinkedIn", "Email"
    
    interest_level = models.IntegerField(default=1)  # 1-10: How interested is the recruiter?
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recruiter search for {self.profile.user.username} by {self.recruiter_company}"


# ============================================================================
# LAYER 4 — VECTOR LAYER (pgvector)
# ============================================================================
# These tables store embeddings. When deployed with PostgreSQL + pgvector,
# the "embedding" field will be a native VECTOR type for similarity search.

class ProfileEmbedding(models.Model):
    """
    Vector representation of a professional profile.
    Enables semantic search and similarity matching.
    """
    profile = models.OneToOneField(ProfessionalIdentity, on_delete=models.CASCADE, related_name="embedding")
    
    # When using pgvector: embedding = VectorField(dimensions=1536)
    # For now (SQLite): stored as JSON array
    embedding = models.JSONField(default=list)  # List of floats: [0.123, 0.456, ...]
    
    embedding_model = models.CharField(max_length=100, default="default")  # e.g., "openai-ada-002"
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Embedding for {self.profile.user.username}"


class JobEmbedding(models.Model):
    """
    Vector representation of a job opportunity.
    Enables job-to-profile semantic matching.
    """
    job = models.OneToOneField("scraper.Job", on_delete=models.CASCADE, related_name="embedding")
    
    embedding = models.JSONField(default=list)  # List of floats
    embedding_model = models.CharField(max_length=100, default="default")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Embedding for {self.job.title} @ {self.job.company}"


class CompanyEmbedding(models.Model):
    """
    Vector representation of a company.
    Enables company-to-profile and company-to-company similarity.
    """
    company_name = models.CharField(max_length=255, unique=True, db_index=True)
    
    embedding = models.JSONField(default=list)
    embedding_model = models.CharField(max_length=100, default="default")
    
    company_metadata = models.JSONField(default=dict, blank=True)  # Size, stage, industry, etc.
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Embedding for {self.company_name}"


# ============================================================================
# LAYER 5 — MCP / AGENT LAYER
# ============================================================================
# These models track AI agent executions and tool invocations.

class ToolInvocation(models.Model):
    """
    A single invocation of a tool by an AI agent.
    """
    profile = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="tool_invocations")
    
    tool_name = models.CharField(max_length=255)  # e.g., "search_jobs", "analyze_resume"
    tool_input = models.JSONField(default=dict)
    tool_output = models.JSONField(default=dict)
    
    status = models.CharField(max_length=50, default="pending")  # pending, success, failure
    error_message = models.TextField(blank=True, null=True)
    
    execution_time_ms = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tool: {self.tool_name} ({self.status})"


class AgentExecution(models.Model):
    """
    A complete agent execution session.
    Contains multiple tool invocations.
    """
    profile = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="agent_executions")
    
    agent_name = models.CharField(max_length=255)  # e.g., "JobSearchAgent", "ResumeOptimizer"
    task_description = models.TextField()
    
    status = models.CharField(max_length=50, default="running")  # running, success, failure
    
    tool_invocations = models.ManyToManyField(ToolInvocation, related_name="agent_execution", blank=True)
    
    result_json = models.JSONField(default=dict)
    error_message = models.TextField(blank=True, null=True)
    
    execution_time_ms = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Agent: {self.agent_name} ({self.status})"


class AgentMemory(models.Model):
    """
    Persistent memory for an AI agent across executions.
    Used by agents to maintain context and learn from past decisions.
    """
    profile = models.ForeignKey(ProfessionalIdentity, on_delete=models.CASCADE, related_name="agent_memories")
    
    agent_name = models.CharField(max_length=255)
    memory_key = models.CharField(max_length=255)  # e.g., "user_preferred_companies"
    memory_value = models.JSONField()  # Flexible storage
    
    relevance_score = models.FloatField(default=1.0)  # 0-1: How relevant is this memory?
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.agent_name}: {self.memory_key}"

    class Meta:
        unique_together = ("profile", "agent_name", "memory_key")
