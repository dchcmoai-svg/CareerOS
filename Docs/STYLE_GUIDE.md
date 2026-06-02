# Style Guide (Concise)

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
