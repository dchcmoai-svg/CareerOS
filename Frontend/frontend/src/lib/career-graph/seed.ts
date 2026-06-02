import type {
  ResumeVariant,
  IntelligenceOpportunity,
  ApplicationRecord,
  LiveSignal,
  ActivityEvent,
  ProfileHealth,
  GraphNode,
  CareerHealthSnapshot,
  RecommendedAction,
} from "./types";
import { PIPELINE_ITEMS } from "@/lib/pipeline-data";

export const RESUME_VARIANTS: ResumeVariant[] = [
  {
    id: "rv-stripe",
    branch: "feature/stripe-frontend",
    target: "Stripe & payments UI roles",
    score: 82,
    performanceNote: "Best response rate on frontend infra roles",
  },
  {
    id: "rv-staff",
    branch: "feature/staff-generalist",
    target: "Staff / generalist engineering",
    score: 91,
    performanceNote: "Highest match scores across product companies",
  },
  {
    id: "rv-rust",
    branch: "feature/rust-systems",
    target: "Systems & platform roles",
    score: 78,
    performanceNote: "Growing — add 2 more systems keywords",
  },
];

const EXPECTED_BY_STAGE: Record<string, string> = {
  Interviewing: "Within 3 days",
  Applied: "5–10 business days",
  Offer: "Respond within 48h",
  Ghosted: "Unlikely",
  Rejected: "Closed",
  Stalled: "Needs follow-up",
};

export const INITIAL_APPLICATIONS: ApplicationRecord[] = PIPELINE_ITEMS.map((item) => ({
  ...item,
  jobId: `job-${item.id}`,
  matchScore: item.responseProbability + 4,
  expectedResponseDate: EXPECTED_BY_STAGE[item.stage] ?? "5–10 business days",
}));

export const INITIAL_LIVE_SIGNALS: LiveSignal[] = [
  {
    id: "ls1",
    message: "Resume score improved 6% after your last edit",
    domain: "resume",
    href: "/resume",
  },
  {
    id: "ls2",
    message: "Frontend demand in your range increased 11%",
    domain: "market",
    href: "/marketplace",
  },
  {
    id: "ls3",
    message: "Follow-up recommended for Acme Corp application",
    domain: "warning",
    href: "/tracker",
  },
  {
    id: "ls4",
    message: "Recruiter searched profiles like yours (Rust + TypeScript)",
    domain: "recruiter",
    href: "/marketplace",
  },
];

export const INITIAL_ACTIVITY: ActivityEvent[] = [
  { id: "a1", message: "Selected feature/stripe-frontend for Vercel role", time: "2m ago", domain: "resume" },
  { id: "a2", message: "Stripe moved to Interviewing", time: "1h ago", domain: "pipeline" },
  { id: "a3", message: "Linear role surfaced — 96% match", time: "3h ago", domain: "primary" },
  { id: "a4", message: "Profile viewed by Vercel recruiter", time: "5h ago", domain: "recruiter" },
];

export const PROFILE_HEALTH: ProfileHealth = {
  score: 88,
  delta: "+6% this week",
  factors: [
    { type: "positive", text: "Strong React & TypeScript depth" },
    { type: "positive", text: "Consistent project history with measurable impact" },
    { type: "positive", text: "GitHub activity supports seniority claims" },
    { type: "negative", text: "Missing cloud certifications for some enterprise roles" },
    { type: "negative", text: "Leadership bullets could be stronger for staff roles" },
  ],
};

export const CAREER_HEALTH: CareerHealthSnapshot = {
  career: {
    label: "Career health",
    value: "Strong",
    hint: "Skills, experience, and market fit are aligned.",
    progress: 82,
  },
  pipeline: {
    label: "Pipeline health",
    value: "2 need action",
    hint: "1 interview active, 1 follow-up overdue.",
    progress: 68,
  },
  resume: {
    label: "Resume health",
    value: "82%",
    hint: "Stripe branch needs 2 keyword tweaks.",
    progress: 82,
  },
  market: {
    label: "Market position",
    value: "Rising",
    hint: "Frontend demand +11% in your target band.",
    progress: 74,
  },
};

export const RECOMMENDED_ACTIONS: RecommendedAction[] = [
  {
    id: "ra1",
    title: "Follow up with Acme Corp",
    reason: "12 days in Applied — response probability drops after day 10.",
    href: "/tracker",
    urgency: "high",
  },
  {
    id: "ra2",
    title: "Apply to Linear — 96% match",
    reason: "Actively hiring · staff-generalist resume ready.",
    href: "/jobs",
    urgency: "high",
  },
  {
    id: "ra3",
    title: "Improve Stripe resume branch",
    reason: "Adding Distributed Systems could push match to 90%+.",
    href: "/resume",
    urgency: "medium",
  },
];

export const PROFESSIONAL_GRAPH: GraphNode[] = [
  { id: "profile", type: "profile", label: "You", sublabel: "Career identity", connections: ["skills", "experience", "resume"] },
  { id: "skills", type: "skills", label: "Skills", sublabel: "12 verified", connections: ["profile", "experience", "market"] },
  { id: "projects", type: "projects", label: "Projects", sublabel: "GitHub synced", connections: ["skills", "experience"] },
  { id: "experience", type: "experience", label: "Experience", sublabel: "4 roles", connections: ["profile", "skills", "resume"] },
  { id: "resume", type: "resume", label: "Resume variants", sublabel: "3 active", connections: ["experience", "applications", "market"] },
  { id: "applications", type: "applications", label: "Applications", sublabel: "6 active", connections: ["resume", "market"] },
  { id: "market", type: "market", label: "Market signals", sublabel: "Demand + recruiter", connections: ["skills", "applications"] },
];

export function enrichOpportunity(job: {
  id: string;
  role: string;
  company: string;
  location: string;
  compensation: string;
  remote: boolean;
  fitScore: number;
  ghostScore: number;
  hiringVelocity: "Fast" | "Slow" | "Stalled" | "Steady";
  applicationDifficulty: "Easy" | "Medium" | "High";
  sponsorshipRealism: "High" | "Low" | "Unknown";
  aiRationale: string;
  url?: string;
  postedAt?: string | null;
  category?: string;
  source?: string;
}): IntelligenceOpportunity {
  const best =
    job.fitScore >= 90 && job.company.toLowerCase().includes("stripe")
      ? "rv-stripe"
      : "rv-staff";
  const variant = RESUME_VARIANTS.find((v) => v.id === best) ?? RESUME_VARIANTS[1];

  return {
    ...job,
    bestResumeVariantId: variant.id,
    missingSkills:
      job.fitScore < 82
        ? ["Distributed Systems", "GraphQL"]
        : job.fitScore < 88
          ? ["Distributed Systems"]
          : [],
    salaryAligned: job.compensation !== "Salary not listed",
    recommendedAction:
      job.fitScore >= 90 ? "Tailor & apply" : job.fitScore >= 75 ? "Review match" : "Low priority",
    salaryNote: job.compensation,
  };
}
