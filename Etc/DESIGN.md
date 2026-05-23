# CareerOS — Ultra Elite AI-Native SaaS Frontend Blueprint

## Product Identity

CareerOS is an AI-native global career operating system.
It is NOT a traditional job board, a generic SaaS dashboard, a CRUD admin panel, a LinkedIn clone, or a startup template.

The frontend must feel like:
- **Linear** (operational shell, dark surfaces, calmness, minimal chrome)
- **Raycast** (command palette, AI interactions, keyboard-first, responsiveness)
- **Airtable** (tracker systems, structured data, kanban workflows, operational tables)
- **Notion** (onboarding warmth, Resume Lab, AI coaching, educational guidance)

combined into a **calm operational AI command center for careers**.

---

## Interaction Philosophy Governance (CRITICAL)

Every interaction must adhere to these rules:
- **Immediate Feel:** Every action should feel immediate. Optimistic updates are required.
- **Keyboard-First:** Keyboard interactions are preferred over mouse interactions. Full keyboard navigability is non-negotiable.
- **Subtle Hover:** Hover states should be subtle; no aggressive scaling or bright glow effects unless specifically required for emphasis.
- **Cognitive Motion:** Motion should assist cognition. Use motion to guide the eye, not distract it.
- **Contextual AI:** AI recommendations should feel contextual and deeply integrated, not like a bolted-on chatbot.
- **Guided Empty States:** Empty states must guide users to the next best action; they should never feel like dead ends.
- **Reduce Overwhelm:** The interface should proactively reduce overwhelm through intelligent filtering and grouping.
- **Noisy-Free:** Surfaces should never feel noisy or cluttered.
- **Progressive Disclosure:** Disclose complexity progressively rather than showing everything at once.

---

## Design Constraints (DO NOTs)

To prevent UI drift, the following are strictly prohibited:
- **DO NOT** introduce random gradients or mesh backgrounds.
- **DO NOT** create oversized cards or bloated padding. Keep it dense and operational.
- **DO NOT** overuse blur/glassmorphism. Use it sparingly for command palettes or overlays.
- **DO NOT** use excessive whitespace that breaks the operational feel.
- **DO NOT** use colorful dashboards. Use color for semantic meaning or specific accents.
- **DO NOT** use flashy startup aesthetics or "gaming-like" neon.
- **DO NOT** create an inconsistent surface hierarchy. Follow the defined elevation ladder.

---

## Core Frontend Philosophy

The product should optimize for **career progression and intelligent decision-making**, NOT infinite browsing.
The UX should constantly guide users. CareerOS is workflow-first, NOT page-first.

Every component must support from Day 1:
- Loading states
- Skeleton loaders
- Empty states
- Optimistic updates
- Keyboard interactions

---

## Color System

### Base Surfaces
- **Primary Canvas:** `#07080A` (Near-black base)
- **Surface 1:** `#0D0D0D`
- **Surface 2:** `#111214`
- **Surface 3:** `#17181B`
- **Surface 4:** `#1D1F23`

### Borders
- **Hairline:** `rgba(255,255,255,0.08)`
- **Strong Border:** `rgba(255,255,255,0.14)`

### Text
- **Primary Text:** `#F4F4F6`
- **Secondary Text:** `#B7BCC7`
- **Tertiary Text:** `#7C828D`
- **Disabled:** `#5B606A`

### Accent Palette
- **AI Accent:** `#7684F0` (Restrained Lavender, slightly softened from #6D7DFF)
- **AI Accent Hover:** `#8693FF`
- **Intelligence Accent:** `#57C1FF` (Cyan)
- **Success:** `#59D499` (Green)
- **Warning:** `#FFC857` (Amber)
- **Danger:** `#FF6161` (Soft Red)

---

## Typography System

**Font Stack:** Inter Variable (fallback: system-ui)
Enable `ss03` stylistic set (single-story 'g'), proper ligatures, and kerning (inherited from Raycast/Linear).

### Hierarchy
- **Hero Display:** 72px / 600 / tight negative tracking
- **Dashboard Headings:** 32px / 600, 24px / 600, 20px / 500
- **Body:** 16px / 400, 14px / 400
- **Operational Labels:** 13px / 500 / slightly positive tracking

Typography should feel operational and intelligent.

---

## Spacing & Layout (Centralized Tokens)

Consistency in spacing is what gives operational software its quality. Use these centralized tokens:
- **Base Unit:** 4px
- **Tokens:** 
  - `xxs`: 4px
  - `xs`: 8px
  - `sm`: 12px
  - `md`: 16px
  - `lg`: 24px
  - `xl`: 32px
  - `xxl`: 48px
  - `section`: 96px (used for major vertical rhythm)

---

## Motion Philosophy & Reusable Primitives

Motion must communicate speed, intelligence, polish, and responsiveness.
- Use **Framer Motion** for spring transitions, subtle staggered reveals, and layout animations.
- **Centralize Primitives:** All motion (transitions, easing, spring configs, stagger systems) MUST be centralized in `src/lib/motion/`.
- Do not overanimate. Do not use flashy transitions or huge bounces.

---

## Core Product Areas Strategy

### Dashboard — Action-Oriented Command Center
The dashboard is the operational intelligence center, **NOT** an analytics dashboard. Avoid heavy charts.
Focus on:
- Opportunities
- Next actions
- Recommendations
- Progression
- ATS Health, Pipeline Overview, Missing Skills.

### Jobs Feed — Highly Opinionated AI-Ranked Feed
This is the retention engine. It determines engagement and AI perception.
- The feed must be AI-ranked and highly opinionated.
- Cards must contain: Company logo, title, location, salary, fit score, ghost score, freshness, matched/missing skills, quick apply actions.
- Right Intelligence Panel for deep dives (ATS analysis, missing skills, competition estimate).

### Tracker — Operational Pipeline Software
Inspired heavily by Airtable and Linear. It is NOT a generic kanban board.
- Must feel like dense, clear, operational pipeline software.
- Features: fast transitions, excellent drag feedback, intelligent metadata, inline actions.
- Views: Kanban, Table, Timeline.
- Columns: Saved, Applying, Applied, Interview, Offer, Rejected, Archived.

### Resume Lab
Inspired by Notion. Warmer, educational UI for resume optimization. ATS scoring, keyword optimization, and AI guidance.

### Command System
Raycast-inspired command palette (`cmdk`). Keyboard-first, fuzzy search, global AI quick actions. This is the interaction layer of the product.

---

## Frontend Architecture & Adaptive Intelligence

The frontend MUST be modular, scalable, and component-driven.
- **Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, Framer Motion, React Hook Form, Zod.
- **Adaptive Intelligence:** The architecture must support adaptive UI that changes based on user behavior, applications, fit patterns, preferences, and recruiter interactions. Modularity is key here.

### Folder Structure
```txt
src/
├── app/
├── components/
│   ├── dashboard/
│   ├── jobs/
│   ├── tracker/
│   ├── resume/
│   ├── ai/
│   ├── layout/
│   ├── command/
│   ├── insights/
│   ├── onboarding/
│   ├── shared/
│   └── ui/
├── hooks/
├── services/
├── store/
├── providers/
├── config/
├── styles/
├── lib/
│   ├── motion/   <-- Reusable motion primitives
│   └── utils.ts
├── types/
└── utils/
```
