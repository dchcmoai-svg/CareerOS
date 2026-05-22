from django.db import models

class Job(models.Model):

    WORK_MODE_CHOICES = [
        ("remote", "Remote"),
        ("hybrid", "Hybrid"),
        ("onsite", "Onsite"),
        ("unknown", "Unknown"),
    ]

    title = models.CharField(
        max_length=255
    )

    company = models.CharField(
        max_length=255,
        db_index=True,
    )

    canonical_company = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        db_index=True,
    )

    department = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    team = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    office_location = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    remote_location = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    work_mode = models.CharField(
        max_length=20,
        choices=WORK_MODE_CHOICES,
        default="unknown"
    )

    url = models.URLField(
        unique=True
    )

    source = models.CharField(
        max_length=100,
        db_index=True,
    )

    raw_data = models.JSONField(
        blank=True,
        null=True
    )

    salary = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    city = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        db_index=True,
    )

    country = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        db_index=True,
    )

    remote_type = models.CharField(
        max_length=20,
        choices=WORK_MODE_CHOICES,
        default="unknown",
        db_index=True,
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    posted_at = models.DateTimeField(
        blank=True,
        null=True
    )

    last_seen_at = models.DateTimeField(
        blank=True,
        null=True,
        db_index=True,
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
    )

    expired_at = models.DateTimeField(
        blank=True,
        null=True
    )

    exported_to_sheets = models.BooleanField(
        default=False
    )

    scraped_at = models.DateTimeField(
        auto_now_add=True,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.title} - {self.company}"


class RawJob(models.Model):
    source = models.CharField(
        max_length=100
    )

    raw_data = models.JSONField()

    scraped_at = models.DateTimeField(
        auto_now_add=True
    )

    processed = models.BooleanField(
        default=False
    )

    processed_at = models.DateTimeField(
        blank=True,
        null=True
    )


class ScrapeSource(models.Model):
    SOURCE_TYPE_CHOICES = [
        ("linkedin-brightdata", "LinkedIn Brightdata"),
        ("greenhouse", "Greenhouse"),
        ("lever", "Lever"),
        ("remoteok", "RemoteOK"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=255, unique=True)
    source_type = models.CharField(max_length=100, choices=SOURCE_TYPE_CHOICES)
    enabled = models.BooleanField(default=True)
    scrape_frequency_minutes = models.IntegerField(default=60)
    keywords = models.JSONField(blank=True, null=True)
    locations = models.JSONField(blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True)
    last_run_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.source_type})"


class JobSearchQuery(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("running", "Running"),
        ("success", "Success"),
        ("failure", "Failure"),
    ]

    keywords = models.CharField(max_length=255, blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    source = models.CharField(max_length=100, blank=True, null=True)
    remote = models.BooleanField(null=True)
    countries = models.JSONField(blank=True, null=True)
    industries = models.JSONField(blank=True, null=True)
    job_types = models.JSONField(blank=True, null=True)
    urls = models.JSONField(blank=True, null=True)
    raw_params = models.JSONField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    results_count = models.IntegerField(default=0)
    requested_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        query_parts = [self.keywords or "", self.company or "", self.location or ""]
        label = " ".join(part for part in query_parts if part).strip() or "query"
        return f"{self.source or 'unknown'}: {label} ({self.status})"


class ScrapeRun(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("running", "Running"),
        ("success", "Success"),
        ("partial", "Partial"),
        ("failure", "Failure"),
    ]

    source = models.CharField(
        max_length=100
    )

    company = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    records_received = models.IntegerField(
        default=0
    )

    records_saved = models.IntegerField(
        default=0
    )

    records_rejected = models.IntegerField(
        default=0
    )

    records_updated = models.IntegerField(
        default=0
    )

    duplicate_records = models.IntegerField(
        default=0
    )

    errors = models.JSONField(
        blank=True,
        null=True
    )

    started_at = models.DateTimeField()

    finished_at = models.DateTimeField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        company_label = self.company or "all"
        return f"{self.source} ({company_label}) {self.status} @ {self.started_at.isoformat()}"

    @property
    def runtime_seconds(self):
        if not self.finished_at:
            return None
        return (self.finished_at - self.started_at).total_seconds()














    

   