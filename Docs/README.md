# CareerOS

CareerOS is an integrated suite for job discovery, resume tooling, and marketplace workflows. This repository contains the backend (Django), frontend (Next.js), scraper, design system, and deployment scripts.

## Quick start

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

## Documentation

Canonical doc index: [Docs/INDEX.md](Docs/INDEX.md)

Design system: [Etc/CareerOS designs/MASTER_DESIGN_SYSTEM.md](Etc/CareerOS%20designs/MASTER_DESIGN_SYSTEM.md)

Architecture notes and operational doctrine: [Etc/imp.txt](Etc/imp.txt)

## Testing

- Run backend tests:

```bash
python Backend/manage.py test
```

## Contributing

Please read and follow the proposed `CONTRIBUTING.md` (not created yet). Add changes as PRs against `main` and include tests for code changes.

## Next docs to add
- `CONTRIBUTING.md` — contribution and style guide
- `docs/api/` — generated API docs (OpenAPI/DRF)

---
File generated on 2026-05-29 by docs task.
