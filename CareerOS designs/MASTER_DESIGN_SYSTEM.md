# CareerOS Master Design System

**This is the global source of truth for the CareerOS UI/UX infrastructure.**
All AI agents (Claude Code, Cursor, Windsurf, Antigravity) MUST abide by this doctrine before generating any frontend code.

## 1. System Philosophy
CareerOS is **ecosystem software**, not a disconnected collection of pages.
It is an intelligent professional operating environment.
The frontend MUST feel: **elite, operational, cinematic outside, calm inside, intelligent, premium, futuristic, and high-trust.**

## 2. Core Design Doctrines (The Authority)
The entire product follows four primary UI/UX doctrines:
- **Linear (PRIMARY CORE):** Operational shell, dark UI, spacing rhythm, typography hierarchy, calm workflows, deterministic UX. *Linear for careers.*
- **Raycast (INTERACTION CORE):** Command palette (`Cmd+K`), keyboard-first UX, omnipresent search, instant responsiveness.
- **Airtable (WORKFLOW CORE):** Tracker systems, marketplace tables, kanban, dense information architecture.
- **Notion (HUMAN / EDUCATION CORE):** Onboarding, Resume Lab, readable long-form UX, warmth, guidance.

*Secondary Storytelling References (ONLY for Landing / Emotion / Transitions):*
- **Vercel:** Landing storytelling, technical sophistication.
- **Apple:** Emotional sequencing, reveal pacing, focus management, reverence for the product.
- **Stripe:** Infrastructure storytelling, layered motion systems (mesh gradients).
- **Arc Browser & Perplexity:** Alive transitions, fluidity, calm AI interaction.

## 3. Component Quality Requirements
- **Cards:** Layered, subtle hierarchy, restrained borders (`1px solid hairline`), premium stacked shadows. NO excessive glassmorphism.
- **Buttons:** Tactile, intentional. Premium hover states via `transform: scale(0.95)` or subtle brightness shifts. NO childish gradients.
- **General UI:** Custom-designed feel. Avoid generic Tailwind defaults. Everything must feel dense, intentional, and operational.

## 4. Motion Stack
- **Tools:** Framer Motion, Motion Primitives, GSAP (selectively), Lenis.
- **Philosophy:** Motion must assist cognition, create continuity, and reduce friction. It should feel deterministic, not gimmicky.

## 5. Trust Architecture (CRITICAL)
- AI decisions MUST be explainable.
- Recruiter visibility MUST be user-controlled.
- NO manipulative UX or dark patterns.
- Notifications are high-signal workflow infrastructure, not spammy UI utilities.

## 6. Overrides Architecture
When building specific pages, this Master file is the baseline. You MUST check the `overrides/` directory for page-specific deviations (e.g., `overrides/dashboard.md`). If an override exists, it takes precedence for that specific route.

## 7. Typography Doctrine
- Inter Variable as primary typeface
- Tight tracking for headlines
- Dense operational typography
- Strong hierarchy via spacing, not excessive weight
- Avoid oversized startup typography
- Operational pages prioritize scanability
- Marketing pages prioritize emotional sequencing

## 8. Surface Hierarchy
- Backgrounds should remain near-black (`#07080A`)
- Surface hierarchy should be subtle and layered
- Avoid flat monochrome darkness
- Use restrained elevation differences
- Borders should communicate structure, not decoration
- Bright accents reserved for intelligence moments

## 9. AI Interaction Doctrine
- AI should feel contextual, not interruptive
- AI panels should adapt to workflows
- AI explanations should be concise and actionable
- AI confidence should be transparent
- AI recommendations should always explain WHY
- AI should augment decision-making, not replace user agency

## 10. Notification Philosophy
- Notifications are operational infrastructure
- Prioritize relevance over engagement
- Group low-priority updates intelligently
- Reduce anxiety-inducing patterns
- Notifications should help users regain clarity quickly

## 11. Marketplace Energy
- Marketplace interactions should feel high-signal
- Avoid social media engagement mechanics
- No vanity metrics
- No infinite dopamine loops
- Prioritize opportunity relevance over virality
- Discovery should feel curated and intentional

## 12. System Continuity Rules (OPERATING SYSTEM DOCTRINE)
- State transitions should feel continuous
- Resume updates should propagate ecosystem-wide
- Recommendations should evolve dynamically
- AI memory persists across workflows
- The user should never feel context resets
- Navigation should preserve operational continuity

## 13. Explicit Anti-Patterns (DO NOT DO THESE)
- DO NOT create flashy crypto aesthetics
- DO NOT use oversized gradients
- DO NOT create social feed UX
- DO NOT use oversized empty whitespace
- DO NOT overanimate workflows
- DO NOT prioritize visual spectacle over usability
- DO NOT create Dribbble-style fake interfaces
