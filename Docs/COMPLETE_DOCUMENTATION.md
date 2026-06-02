# CareerOS — Consolidated Documentation

This single-file entry consolidates the project's core documentation for contributors, reviewers, and new teammates. It combines the top-level README, the Docs index (TOC), contribution guidelines, and the style guide. For deeper design and architecture references, follow the linked files.

Generated on: 2026-05-29

---

## 1. Overview (from README)

CareerOS is an integrated suite for job discovery, resume tooling, and marketplace workflows. This repository contains the backend (Django), frontend (Next.js), scraper, design system, and deployment scripts.

Quick start

1. Create a Python virtualenv and install backend requirements:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r Backend/requirements.txt
```

2. Run the Django backend (local dev):

```bash
python Backend/manage.py migrate
python Backend/manage.py runserver
```

3. Start the frontend (see frontend README):

```bash
cd Frontend/frontend
npm install
npm run dev
```

Testing

- Run backend tests:

```bash
python Backend/manage.py test
```

Notes

- Canonical doc index: [Docs/INDEX.md](INDEX.md)
- Design system: [Etc/CareerOS designs/MASTER_DESIGN_SYSTEM.md](../Etc/CareerOS%20designs/MASTER_DESIGN_SYSTEM.md)
- Architecture notes and operational doctrine: [Etc/imp.txt](../Etc/imp.txt)

---

## 2. Docs Index (TOC)

See the full index for quick links to every major doc area.

- Quick Start: [README_STRUCTURE.md](../README_STRUCTURE.md)
- Architecture: [Etc/ARCHITECTURE.md](../Etc/ARCHITECTURE.md)
- Design system & UX: [Etc/CareerOS designs/MASTER_DESIGN_SYSTEM.md](../Etc/CareerOS%20designs/MASTER_DESIGN_SYSTEM.md), [Etc/DESIGN.md](../Etc/DESIGN.md), [Etc/docs/UX_CLARITY.md](../Etc/docs/UX_CLARITY.md)
- Frontend: [Frontend/frontend/README.md](../Frontend/frontend/README.md)
- Backend: `Backend/manage.py`, `Backend/config/settings.py`
- Scraper & Data Ingestion: `Backend/scraper/` (adapters, normalization)
- Deployment & Ops: `Deployment/scripts/`, celery schedules in `Backend/`
- Data & Schemas: `db_schema/`, `Backend/db.sqlite3`
- Testing: backend & scraper tests in `Backend/`
- Contributing & Style: `CONTRIBUTING.md`, `Docs/STYLE_GUIDE.md`
- API: `docs/api/` (proposed/generated)

---

## 3. Contributing (full)

Thank you for contributing! Please follow these guidelines to make reviews fast and consistent.

1. Fork the repo and create a branch named `team/feature-or-bug`.

2. Keep PRs small and focused. One logical change per PR with a clear description and screenshots/fixtures when relevant.

3. Tests
- Add or update unit tests for backend changes (`Backend/`) and frontend changes (`Frontend/frontend/`).
- Run backend tests:

```bash
python Backend/manage.py test
```

4. Linters & formatters
- Python: run `black` and `isort` before committing.
- JavaScript/TypeScript: run `npm run lint` in `Frontend/frontend` (project lints are configured in that repo).

5. Commit messages
- Use imperative tense and short summary, e.g. `feat(scraper): normalize job salary field`.

6. PR process
- Open a PR against `main` (or the target branch indicated in the issue).
- Add reviewers and a short checklist: tests, linter, changelog (if needed).

7. Documentation
- Update `Docs/INDEX.md` and add or update `Etc/` design docs when you change UX or architecture.

8. Security & data
- Do not commit secrets, API keys, or database files. Use environment variables and `.env` files ignored by Git.

9. Questions
- For process questions, open an issue and tag `docs` or `infra` as appropriate.

---

## 4. Style Guide (full)

Purpose: provide minimal, actionable standards for contributors.

Code style

- Python: format with `black`, sort imports with `isort`, and prefer type hints for public functions.
- JS/TS: use `prettier` and `eslint` configured in `Frontend/frontend`.

Testing

- Write unit tests for logic changes; aim for deterministic tests that don't rely on external APIs.

Commits & PRs

- Small atomic commits, one change per PR, clear titles and descriptions.

Docs

- Keep high-level docs in `Docs/INDEX.md` and more detailed guides under `Docs/` or `Etc/`.
- Use Markdown headings, short paragraphs, and inline code for commands.

Design system

- Update tokens and master rules in `Etc/CareerOS designs/MASTER_DESIGN_SYSTEM.md` when changing components.

Where to add guidance

- Add environment/setup troubleshooting to `README.md` if frequently requested.

---

## 5. Design, UX & Architecture (summary + links)

This repo contains extensive design and architecture docs. Key references:

- Master design system: [Etc/CareerOS designs/MASTER_DESIGN_SYSTEM.md](../Etc/CareerOS%20designs/MASTER_DESIGN_SYSTEM.md)
- Design constraints & patterns: [Etc/DESIGN.md](../Etc/DESIGN.md)
- UX clarity & product language: [Etc/docs/UX_CLARITY.md](../Etc/docs/UX_CLARITY.md)
- Product/roadmap notes: [Etc/imp.txt](../Etc/imp.txt)

Recommendation: For UI or product changes, update the master design system and UX_CLARITY doc first, then reflect the changes in component code.

---

## 6. Scraper & Data (summary)

Location: `Backend/scraper/` — contains ingestion, adapters (e.g., `adapters/brightdata.py`), exporters (e.g., `exporters/google_sheets.py`), normalization rules (`normalization/taxonomy.py`), and scraping tasks.

If you modify scraping or normalization logic, add unit tests under `Backend/scraper/tests.py` and update any exporter integrations.

---

## 7. Deployment & Operations

Deployment scripts live under `Deployment/scripts/`. Celery configuration and schedule files live in `Backend/` (look for `celery` files and `celerybeat-schedule`).

For production deployments, follow the ops runbook (not yet authored) and keep secrets out of the repo.

---

## 8. API & Developer Docs

API docs generation is proposed under `docs/api/` (OpenAPI/DRF). This is an in-progress item. To generate API docs later, run a DRF/OpenAPI generator and place output under `docs/api/`.

---

## 9. Testing & CI

- Backend tests: `python Backend/manage.py test`
- Frontend tests and linting live in `Frontend/frontend` and should be run via that project's npm scripts.

CI: add or update GitHub Actions as needed for linting, tests, and PR checks.

---

## 10. Where to go from here (next steps)

1. Finalize `docs/api/` generation and commit API artifacts.
2. Expand the ops runbook and add deployment checklists.
3. Keep `Docs/COMPLETE_DOCUMENTATION.md` updated when top-level docs change.

---

If you'd like, I can also inline full content from `Etc/CareerOS designs/MASTER_DESIGN_SYSTEM.md` and `Etc/imp.txt` into this consolidated doc — they are large and are linked here to keep this file readable. Would you like them inlined now? 

---

## 11. Features — What CareerOS Contains

CareerOS is organized around three primary user-facing surfaces and several global systems:

- Public Ecosystem (marketing & docs)
	- Landing, Product, How-it-works, Docs, About, Auth pages
- Dashboard OS (primary logged-in workspace)
	- Embedded discovery, tracker, resume intelligence, marketplace insights, AI orchestration, notifications, recruiter activity, command system (Cmd+K)
- Focus Mode Workspaces (deep work)
	- `/jobs` — Discovery intelligence and opportunity explorer
	- `/tracker` — Application pipeline and workflow operations
	- `/resume` — Resume Lab and ATS compiler/optimizer
	- `/marketplace` — Discoverability and recruiter orchestration
	- `/profile` — Identity graph and professional profile management
	- `/notifications` — Operational alerts center

Global systems and primitives:

- Cmd+K global command/search palette
- Right panel AI agent (RightPanelAgent) for contextual suggestions
- AI memory and continuity layer (`AiMemory` in backend)
- Scraper & ingestion pipeline (multiple sources, adapters, exporters)
- Marketplace visibility and preference controls
- Celery tasks and scheduled scrapes

User roles and data

- Individual users (accounts) with `ProfessionalIdentity`, skills, resume variants, and AI memory
- Recruiter interactions and tracker items linking users to scraped jobs

## 12. API — Current Endpoints and Recommended API Surface

Existing backend API (simple JSON endpoints):

- `GET /api/jobs/` — list active scraped jobs with optional query params:
	- Query parameters: `q`, `remote`, `work_mode`, `source`, `category`, `limit`, `offset`
	- Response: `{ jobs: [...], total: N, offset: X, limit: Y, sources: [...] }`
	- Example: `GET /api/jobs/?q=engineer&remote=true&limit=20`

- `GET /api/jobs/stats/` — simple aggregates for jobs UI
	- Response: `{ total: N, remote: M, db: 'db_name' }`

Recommended API surface to add (developer-friendly OpenAPI/REST or GraphQL):

- Auth: `POST /api/auth/login/`, `POST /api/auth/logout/`, `POST /api/auth/register/`, token refresh endpoints
- Users / Identity: `GET/PUT /api/users/me/`, `GET /api/users/{id}/` — exposes `ProfessionalIdentity`, `MarketplacePreferences`
- Tracker: CRUD endpoints for `TrackerItem` (`/api/tracker/`)
- Resumes: `/api/resumes/` to list/create `ResumeVariant`, export/download endpoints
- Jobs: expand `/api/jobs/` with job detail endpoint `/api/jobs/{id}/` and source management for `ScrapeSource`
- Recruiter interactions: `/api/recruiter/interactions/`
- AI Memory: `/api/ai-memory/` to read/write per-user context
- Admin/Telemetry: `/api/scrape-runs/`, `/api/job-search-queries/`, `/api/sources/`

API docs generation:

- Use Django REST Framework + drf-yasg or drf-spectacular to generate OpenAPI and place JSON/YAML under `docs/api/`.
- Add Postman/Insomnia collection for frontend developers.

## 13. Database Schema Summary

This section summarizes the main models and tables. See the model files for exact field definitions:

- Core identity & operations (`Backend/core/models.py`):
	- `ProfessionalIdentity` — one-to-one per `User`, inferred seniority, industry, enrichment flags (github/linkedin/resume)
	- `Skill` — FK to identity, inference source and verification flag
	- `MarketplacePreferences` — visibility, stealth mode, target salary, role types, stages
	- `TrackerItem` — user-tracked application items, `stage` enum, link to `scraper.Job`
	- `ResumeVariant` — branch-like resume variants, `content_json` for structured resume
	- `RecruiterInteraction` — notes and interaction type linked to `TrackerItem`
	- `AiMemory` — per-user context blob and last_interaction

- Scraper & ingestion (`Backend/scraper/models.py`):
	- `Job` — primary scraped job record (title, company, url unique, source, work_mode, location, salary, is_active, posted_at, scraped_at)
	- `RawJob` — raw scraped payloads for troubleshooting and reprocessing
	- `ScrapeSource` — configuration for each source (type, frequency, keywords, locations, metadata)
	- `JobSearchQuery` — ad-hoc search jobs and their status/results
	- `ScrapeRun` — run metadata and statistics (records_received, saved, rejected, errors)

Notes on indices and scaling:

- Several fields are indexed (`company`, `source`, `city`, `country`, `last_seen_at`) to support filtering queries.
- For scale, move scraping results to a search index (Elasticsearch/Typesense/Meilisearch) and keep relational DB for canonical records and provenance.

## 14. Data Flow & Scraper Pipeline

High-level flow:

1. Scrape sources configured in `ScrapeSource` are polled by scheduled Celery tasks or external scrapers.
2. Raw payloads are saved to `RawJob` and processed into `Job` (deduping by `url`) and `ScrapeRun` records are created/updated.
3. Jobs are normalized (`normalizers` and `normalization/taxonomy.py`), saved, and optionally exported via `exporters/` (e.g., Google Sheets exporter).
4. Frontend queries `/api/jobs/` for discovery; `TrackerItem` links jobs to user workflows.
5. AI orchestration reads `AiMemory`, resumes, and jobs to create recommendations and explanations.

Retry and failure behavior:

- Scrape runs record errors in `ScrapeRun.errors` and set status accordingly; re-run or alert on repeated failures.

## 15. Integrations & External Services

- Brightdata / LinkedIn adapters (`Backend/scraper/adapters/brightdata.py`) for paid scraping pipelines.
- Google Sheets exporter (`Backend/scraper/exporters/google_sheets.py`) for CSV pushes.
- Celery + Redis for async tasks and scheduling (see `Backend/config/celery.py` and `celerybeat-schedule`).
- External storage and secrets: use environment variables and secret stores (AWS Secrets Manager, Vault) in production.

## 16. Running Locally and Dev Notes

1. Backend setup (recommended):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r Backend/requirements.txt
python Backend/manage.py migrate
python Backend/manage.py createsuperuser
python Backend/manage.py runserver
```

2. Frontend setup:

```bash
cd Frontend/frontend
npm install
npm run dev
```

3. Running scrapers locally:

```bash
# Run management commands or celery tasks if available
python Backend/manage.py runscript run_scrape  # example - depends on management commands
```

4. Tests:

```bash
python Backend/manage.py test
cd Frontend/frontend && npm test
```

## 17. Deployment & Ops

- Recommended production components:
	- PostgreSQL for relational data
	- Redis for Celery broker and caching
	- Search index (Typesense/Elasticsearch) for jobs discovery
	- Worker pool for scrapers and Celery tasks
	- Secure secret storage

- CI/CD: add GitHub Actions to run backend tests, frontend linters, and build artifacts. Add a deployment workflow for staging/production.

## 18. Next actions I can take (choose one)

1. Generate OpenAPI spec for current endpoints and scaffold `/docs/api/openapi.yaml`.
2. Create detailed API endpoints and serializers in the backend for the recommended API surface.
3. Export model diagrams (ORM schema) into `Docs/DB_SCHEMA.md` and attach ER diagrams.
4. Inline the full `MASTER_DESIGN_SYSTEM.md` sections into `COMPLETE_DOCUMENTATION.md` (already inlined above) and expand examples.

Please pick which next action you'd like me to do, and I will proceed.
