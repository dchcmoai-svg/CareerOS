/**
 * Mission Control — structured intelligence for the career OS dashboard.
 * Mock data until backend graph APIs wire in.
 */

export type AccentDomain = "primary" | "resume" | "market" | "recruiter" | "pipeline" | "success" | "warning";

export interface PriorityAction {
  id: string;
  title: string;
  reason: string;
  href: string;
  cta: string;
  urgency: "high" | "medium" | "low";
  domain: AccentDomain;
}

export interface HealthMetric {
  id: string;
  label: string;
  value: string;
  delta?: string;
  trend: "up" | "down" | "neutral";
  hint: string;
  href: string;
  domain: AccentDomain;
  progress?: number;
}

export interface AmbientSignal {
  id: string;
  message: string;
  domain: AccentDomain;
}

export interface IntelligenceOpportunity {
  id: string;
  company: string;
  role: string;
  match: number;
  response: number;
  resumeBranch: string;
  why: string;
  action: string;
  href: string;
}

export const PRIORITY_ACTIONS: PriorityAction[] = [
  {
    id: "a1",
    title: "Follow up with Acme Corp",
    reason: "12 days in interview stage — response probability drops after day 10.",
    href: "/tracker",
    cta: "Draft follow-up",
    urgency: "high",
    domain: "warning",
  },
  {
    id: "a2",
    title: "Apply to Linear — 96% match",
    reason: "Strong fit · actively hiring · resume branch ready.",
    href: "/jobs",
    cta: "Review role",
    urgency: "high",
    domain: "primary",
  },
  {
    id: "a3",
    title: "Add measurable impact to 4 bullets",
    reason: "Could raise resume score ~15% for frontend roles.",
    href: "/resume",
    cta: "Improve resume",
    urgency: "medium",
    domain: "resume",
  },
];

export const HEALTH_METRICS: HealthMetric[] = [
  {
    id: "career",
    label: "Career health",
    value: "Strong",
    delta: "+8 this week",
    trend: "up",
    hint: "Pipeline active, matches improving, visibility stable.",
    href: "/dashboard",
    domain: "primary",
    progress: 78,
  },
  {
    id: "resume",
    label: "Resume health",
    value: "82%",
    delta: "+7% after last edit",
    trend: "up",
    hint: "Stripe branch needs 2 keyword fixes for staff roles.",
    href: "/resume",
    domain: "resume",
    progress: 82,
  },
  {
    id: "pipeline",
    label: "Pipeline health",
    value: "3 active",
    delta: "2 need follow-up",
    trend: "neutral",
    hint: "1 interview, 1 stalled, 1 recently applied.",
    href: "/tracker",
    domain: "pipeline",
    progress: 65,
  },
  {
    id: "market",
    label: "Market position",
    value: "Rising",
    delta: "Frontend demand +11%",
    trend: "up",
    hint: "Recruiters searching React + TypeScript in your range.",
    href: "/marketplace",
    domain: "market",
    progress: 71,
  },
];

export const AMBIENT_SIGNALS: AmbientSignal[] = [
  { id: "s1", message: "You improved resume score by 7% this week", domain: "resume" },
  { id: "s2", message: "3 recruiters searched profiles like yours in the last 24h", domain: "recruiter" },
  { id: "s3", message: "Frontend demand in your target range increased 11%", domain: "market" },
  { id: "s4", message: "Resume branch v4 outperforms v3 on response rate", domain: "resume" },
  { id: "s5", message: "Stripe is actively reviewing applications — good time to apply", domain: "primary" },
];

export const TOP_OPPORTUNITIES: IntelligenceOpportunity[] = [
  {
    id: "o1",
    company: "Linear",
    role: "Product Engineer",
    match: 96,
    response: 91,
    resumeBranch: "feature/staff-generalist",
    why: "React + TypeScript depth matches role requirements.",
    action: "Tailor & apply",
    href: "/jobs",
  },
  {
    id: "o2",
    company: "Stripe",
    role: "Senior Frontend Engineer",
    match: 92,
    response: 85,
    resumeBranch: "feature/stripe-frontend",
    why: "Payments UI experience aligns; add Distributed Systems keyword.",
    action: "Improve resume first",
    href: "/resume",
  },
  {
    id: "o3",
    company: "Vercel",
    role: "Staff Engineer",
    match: 88,
    response: 78,
    resumeBranch: "feature/staff-generalist",
    why: "Strong platform fit; hiring pace is fast this week.",
    action: "Review & apply",
    href: "/jobs",
  },
];
