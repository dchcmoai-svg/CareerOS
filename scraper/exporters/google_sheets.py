import os

import gspread
from django.utils import timezone

from google.oauth2.service_account import Credentials

from scraper.models import Job


SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

EXPORT_HEADERS = [
    "Title",
    "Company",
    "City",
    "Country",
    "Remote Type",
    "Employment Type",
    "Seniority",
    "Salary",
    "Source",
    "Posted Date",
    "Job URL",
    "Exported At",
    "Short Description",
]


def _job_field(job: Job, field: str) -> str:
    raw_data = job.raw_data or {}
    REQUIRED_FILL_FIELDS = {
        "title",
        "company",
        "location",
        "job_seniority_level",
        "job_employment_type",
        "job_posted_date",
        "company_url",
        "url",
        "source",
        "salary",
    }

    if field == "title":
        return (
            str(getattr(job, "title", "") or "")
            or str(raw_data.get("job_title") or raw_data.get("title") or "")
        )

    if field == "company":
        return (
            str(getattr(job, "company", "") or "")
            or str(raw_data.get("company_name") or raw_data.get("company") or "")
        )

    if field == "location":
        return (
            str(getattr(job, "office_location", "") or "")
            or str(raw_data.get("job_location") or raw_data.get("location") or raw_data.get("office_location") or "")
        )

    if field == "job_seniority_level":
        return str(
            raw_data.get("job_seniority_level")
            or raw_data.get("seniority_level")
            or raw_data.get("seniority")
            or ""
        )

    if field == "job_employment_type":
        return str(
            raw_data.get("job_employment_type")
            or raw_data.get("employment_type")
            or ""
        )

    if field == "job_posted_date":
        return str(
            raw_data.get("job_posted_date")
            or raw_data.get("job_posted_time")
            or raw_data.get("job_posted_date")
            or raw_data.get("job_posted")
            or ""
        )

    if field == "company_url":
        return str(
            raw_data.get("company_url")
            or raw_data.get("company_website")
            or raw_data.get("company_link")
            or raw_data.get("company_page")
            or ""
        )

    if field == "url":
        return (
            str(getattr(job, "url", "") or "")
            or str(raw_data.get("url") or raw_data.get("jobUrl") or raw_data.get("link") or "")
        )

    if field == "source":
        return str(getattr(job, "source", "") or raw_data.get("source") or "")

    if field == "job_posting_id":
        return str(
            raw_data.get("job_posting_id")
            or raw_data.get("job_id")
            or raw_data.get("jobPostingId")
            or raw_data.get("title_id")
            or ""
        )

    if field == "job_num_applicants":
        return str(
            raw_data.get("job_num_applicants")
            or raw_data.get("num_applicants")
            or raw_data.get("applicants")
            or ""
        )

    if field == "job_industries":
        return str(
            raw_data.get("job_industries")
            or raw_data.get("industries")
            or raw_data.get("industry")
            or ""
        )

    if field == "job_function":
        return str(
            raw_data.get("job_function")
            or raw_data.get("function")
            or raw_data.get("job_function")
            or ""
        )

    if field == "is_easy_apply":
        value = raw_data.get("is_easy_apply")
        if value is None:
            value = raw_data.get("easy_apply")
        if value is True:
            return "Yes"
        if value is False:
            return "No"
        return str(value or "")

    if field == "salary":
        val = (
            str(getattr(job, "salary", "") or "")
            or str(raw_data.get("base_salary") or "")
            or str(raw_data.get("job_base_pay_range") or "")
            or str(raw_data.get("salary") or "")
            or str(raw_data.get("salary_standards") or "")
        )
        return val.strip()

    if field == "company_logo":
        return str(
            raw_data.get("company_logo")
            or raw_data.get("company_image")
            or raw_data.get("logo")
            or ""
        )

    if field == "discovery_input_url":
        return str(
            (raw_data.get("discovery_input") or {}).get("url")
            or ""
        )

    if field == "input_url":
        return str(
            (raw_data.get("input") or {}).get("url")
            or ""
        )

    return str(getattr(job, field, "") or raw_data.get(field, "") or "").strip()


def serialize_job(job: Job) -> list:
    exported_at = timezone.now().isoformat()
    # Clean primary fields from job (prefer model values; fallback to raw_data)
    raw = job.raw_data or {}

    title = str(getattr(job, "title", "") or raw.get("title") or raw.get("job_title") or "").strip() or "Unknown"
    company = str(getattr(job, "company", "") or raw.get("company") or raw.get("company_name") or "").strip() or "Unknown"
    city = str(getattr(job, "city", "") or raw.get("city") or "").strip() or "Unknown"
    country = str(getattr(job, "country", "") or raw.get("country") or "").strip() or "Unknown"
    remote = str(getattr(job, "remote_type", "") or raw.get("remote_type") or "").strip() or "Unknown"
    employment = str(getattr(job, "employment_type", "") or raw.get("employment_type") or raw.get("job_employment_type") or "").strip() or "Unknown"
    seniority = str(getattr(job, "seniority", "") or raw.get("seniority") or raw.get("job_seniority_level") or "").strip() or "Unknown"
    salary = str(getattr(job, "salary", "") or raw.get("salary") or raw.get("base_salary") or "").strip() or "Unknown"
    source = str(getattr(job, "source", "") or raw.get("source") or "").strip() or "Unknown"
    posted = str(getattr(job, "posted_at", "") or raw.get("posted_at") or raw.get("job_posted_date") or "").strip() or ""
    job_url = str(getattr(job, "url", "") or raw.get("url") or raw.get("jobUrl") or "").strip() or ""

    # Short description: prefer cleaned Job.description; fallback to raw fields
    desc_full = str(getattr(job, "description", "") or raw.get("job_summary") or raw.get("job_description") or raw.get("description") or "").strip()
    # Truncate to 300 chars
    short = (desc_full[:297] + "...") if len(desc_full) > 300 else desc_full

    return [
        title,
        company,
        city,
        country,
        remote,
        employment,
        seniority,
        salary,
        source,
        posted,
        job_url,
        exported_at,
        short,
    ]


# New `serialize_job` is defined below to emit only cleaned fields.

PIVOT_SHEET_TITLE = "Job Summary"
PIVOT_SOURCE_COLUMNS = len(EXPORT_HEADERS)
PIVOT_MIN_ROWS = 50


def get_or_create_sheet(spreadsheet, title, rows=100, cols=30):
    for worksheet in spreadsheet.worksheets():
        if worksheet.title == title:
            return worksheet
    return spreadsheet.add_worksheet(title=title, rows=rows, cols=cols)


def ensure_pivot_table(spreadsheet, data_sheet, total_rows):
    pivot_sheet = get_or_create_sheet(spreadsheet, PIVOT_SHEET_TITLE)
    pivot_sheet.clear()

    source_sheet_id = data_sheet.id
    pivot_sheet_id = pivot_sheet.id
    end_row_index = max(total_rows, PIVOT_MIN_ROWS)

    pivot_request = {
        "updateCells": {
            "rows": [
                {
                    "values": [
                        {
                            "pivotTable": {
                                "source": {
                                    "sheetId": source_sheet_id,
                                    "startRowIndex": 0,
                                    "startColumnIndex": 0,
                                    "endRowIndex": end_row_index,
                                    "endColumnIndex": PIVOT_SOURCE_COLUMNS,
                                },
                                "rows": [
                                    {
                                        "sourceColumnOffset": 4,
                                        "showTotals": True,
                                        "sortOrder": "ASCENDING"
                                    }
                                ],
                                "columns": [
                                    {
                                        "sourceColumnOffset": 6,
                                        "showTotals": True,
                                        "sortOrder": "ASCENDING"
                                    }
                                ],
                                "values": [
                                    {
                                        "summarizeFunction": "COUNTA",
                                        "sourceColumnOffset": 0
                                    }
                                ],
                                "valueLayout": "HORIZONTAL"
                            }
                        }
                    ]
                }
            ],
            "start": {
                "sheetId": pivot_sheet_id,
                "rowIndex": 0,
                "columnIndex": 0
            },
            "fields": "*"
        }
    }

    spreadsheet.batch_update({"requests": [pivot_request]})


def export_jobs_to_google_sheets():

    credentials = Credentials.from_service_account_file(
        os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE"),
        scopes=SCOPES
    )

    client = gspread.authorize(credentials)

    spreadsheet = client.open(os.getenv("GOOGLE_SHEET_NAME"))
    data_sheet = spreadsheet.sheet1

    # Only fetch jobs not yet exported (incremental export)
    jobs = Job.objects.filter(exported_to_sheets=False)

    existing_rows = data_sheet.get_all_values()

    if not existing_rows:
        data_sheet.append_row(EXPORT_HEADERS)
    elif existing_rows[0] != EXPORT_HEADERS:
        # If existing sheet headers do not match canonical schema, reset the sheet.
        data_sheet.clear()
        data_sheet.append_row(EXPORT_HEADERS)
        existing_rows = [EXPORT_HEADERS]

    rows = [serialize_job(job) for job in jobs]

    if rows:
        data_sheet.append_rows(rows)
        Job.objects.filter(exported_to_sheets=False).update(exported_to_sheets=True)

    total_rows = len(existing_rows) + len(rows)
    ensure_pivot_table(spreadsheet, data_sheet, total_rows)

    return {
        "status": "success",
        "exported_count": len(rows)
    }