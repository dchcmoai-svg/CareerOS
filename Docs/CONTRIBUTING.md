# Contributing to CareerOS

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
