# CareerOS Project Structure

## Folder Organization

```
CareerOS/
├── Backend/              # Django backend application
│   ├── config/          # Django configuration (settings, urls, wsgi)
│   ├── scraper/         # Job scraping application
│   ├── core/            # Core application
│   ├── db_schema/       # Database schema files
│   ├── manage.py        # Django management script
│   ├── requirements.txt # Python dependencies
│   ├── db.sqlite3       # SQLite database
│   └── celerybeat-*     # Celery scheduler state files
│
├── Frontend/            # Next.js frontend application
│   └── frontend/        # Next.js app (package.json, src/, etc.)
│
├── Deployment/          # Deployment and scripting utilities
│   └── scripts/         # Python scripts for data export and automation
│
├── Samplecode/          # Example code and test notebooks
│   ├── Scraping_test.ipynb
│   ├── Untitled.ipynb
│   └── sample data files
│
├── Etc/                 # Documentation and miscellaneous files
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   ├── CareerOS designs/
│   ├── docs/
│   └── other docs
│
└── venv/                # Python virtual environment
```

## Running the Project

### Backend (Django)

```bash
cd Backend

# Activate virtual environment (if not already activated)
source ../venv/bin/activate

# Run development server
python manage.py runserver

# Access admin at http://127.0.0.1:8000/admin/
```

### Frontend (Next.js)

```bash
cd Frontend/frontend

# Install dependencies (if needed)
npm install

# Run development server
npm run dev

# Access app at http://localhost:3000
```

### Deployment Scripts

```bash
cd Deployment/scripts

# Export jobs as JSON
python jobs_json.py

# Export from SQLite database
python jobs_json_sqlite.py

# Run scraping pipeline
python run_scrapes_and_export.py

# Run LinkedIn discovery
python linkedin_discovery.py
```

## Key Notes

- Django settings are in `Backend/config/settings.py`
- Database is at `Backend/db.sqlite3`
- Deployment scripts automatically reference `Backend/` for Django imports and database
- All documentation and design files are in `Etc/`
- Sample code and test notebooks are in `Samplecode/`
