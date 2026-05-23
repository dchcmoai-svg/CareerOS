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
