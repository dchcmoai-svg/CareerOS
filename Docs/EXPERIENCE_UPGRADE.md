# CareerOS Experience Upgrade Directive

**Not** a CRUD SaaS, job board, or prettier LinkedIn.

**Is** an AI-native career operating system — closer to Linear, Arc, Raycast, Vercel, Stripe, Attio than traditional hiring platforms.

## Design references

| Layer | Source |
|-------|--------|
| Structure + motion | `Etc/CareerOS designs/MASTER_DESIGN_SYSTEM.md`, `PRODUCTION_ECOSYSTEM_DOCTRINE.md` |
| Visual polish | `linear.txt`, `vercel.txt`, `stripe.txt`, `raycast.txt` |
| Copy + IA | `Frontend/frontend/src/lib/copy.ts` |
| Acceleration | `.ui-ux-pro-max-skill`, shadcn/ui, Framer Motion, GSAP, Lenis |

Tsenta is a workflow reference only — we exceed it on clarity, intelligence visibility, hierarchy, motion, and IA.

## Information hierarchy (every operational page)

1. **Level 1 — What should I do next?**  
   Recommended actions, urgent opportunities, follow-ups, resume improvements.

2. **Level 2 — Current state**  
   Career health · Resume health · Pipeline health · Market position.

3. **Level 3 — Supporting intelligence**  
   Top opportunities · Recruiter activity · Market demand · Profile strength.

## Ambient intelligence

Not chatbot popups. Short, rotating signals across the shell:

- Resume score improved
- Recruiter searches
- Demand shifts
- Branch performance

Implemented: `AmbientIntelligenceStrip` in `AppShell`.

## Color system (semantic)

| Token | Use |
|-------|-----|
| `#0B0F14` canvas | Base |
| `#111827`–`#252D38` | Surface ladder |
| `#3B82F6` primary | Actions, opportunity |
| `#8B5CF6` resume | Resume intelligence |
| `#06B6D4` market | Market intelligence |
| `#EC4899` recruiter | Recruiter signals |
| `#22C55E` / `#F59E0B` / `#EF4444` | Success / warning / error |

No rainbow dashboards — color communicates meaning.

## Stack

- **Foundation:** shadcn/ui + Tailwind
- **Motion:** Framer Motion (UI), GSAP (hero/story), Lenis (scroll)
- **Command:** cmdk
- **Data:** TanStack Table, Recharts (as needed)

## Implementation map

| Surface | Component / file |
|---------|------------------|
| Mission Control | `MissionControlDashboard.tsx` |
| Intelligence cards | `IntelligenceCard.tsx` |
| Ambient strip | `AmbientIntelligenceStrip.tsx` |
| Jobs intelligence | `OpportunityCard.tsx` + score hints |
| Copy | `copy.ts`, `mission-control.ts` |

## Priority order when building

1. Clarity  
2. Intelligence visibility  
3. Motion (only where it teaches)

Never sacrifice usability for visual effects.
