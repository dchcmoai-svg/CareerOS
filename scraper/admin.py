from django.contrib import admin
from .models import Job, ScrapeRun, ScrapeSource


class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "company", "source", "salary", "work_mode", "exported_to_sheets", "url", "created_at")
    list_filter = ("source", "company", "work_mode", "exported_to_sheets")
    search_fields = ("title", "company", "department", "team", "url")
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 50


class ScrapeRunAdmin(admin.ModelAdmin):
    list_display = (
        "source",
        "company",
        "status",
        "records_received",
        "records_saved",
        "records_updated",
        "duplicate_records",
        "started_at",
        "finished_at",
    )
    list_filter = ("source", "status", "company")
    search_fields = ("source", "company", "status")
    readonly_fields = ("started_at", "finished_at", "created_at", "updated_at")
    list_per_page = 50


admin.site.register(Job, JobAdmin)
admin.site.register(ScrapeRun, ScrapeRunAdmin)
admin.site.register(ScrapeSource)
