# CareerOS UX Clarity Doctrine

**Source of truth for product language and page structure:** `CareerOS designs/MASTER_DESIGN_SYSTEM.md` + `PRODUCTION_ECOSYSTEM_DOCTRINE.md`.

Design references (`linear.txt`, `vercel.txt`, `stripe.txt`, etc.) control **visual/interaction** quality. Overrides are route-specific only when explicitly building that route.

UI acceleration: `shadcn/ui` (foundation), Framer Motion, GSAP (hero), Lenis — per stack in MASTER.

## Principle

Every major surface must answer, without jargon:

- Where am I?
- What does this page do?
- Why does it matter?
- What can I do next?
- How does it help my career?

## Tone

- Calm, professional, helpful
- LinkedIn/Notion simplicity for copy
- Linear/Stripe quality for motion and hierarchy

Avoid: operating system, orchestration, infrastructure, pipeline, velocity, telemetry, AI-native, continuity layer.

Prefer: job search, applications, resume, recruiters, match, follow-up, visibility.

## Implementation

- **Copy:** `frontend/src/lib/copy.ts` — all user-facing strings
- **Guides:** `ContextualGuide` + `ScoreHint` on platform pages
- **Assistant:** practical sentences in `agent.insights`

## Page goals

| Page | User should feel |
|------|------------------|
| Landing | "This helps me manage my career better." |
| Dashboard | "Everything important in one organized place." |
| Jobs | "I understand why this role matches." |
| Resume | "This helps improve my resume." |
| Get Discovered | "I'm in control of my visibility." |
| Assistant | "Helpful guidance, not a black box." |

## Design MD usage

✅ Spacing, motion, typography, hover, density  
❌ Product copy, abstract terminology, template cloning
