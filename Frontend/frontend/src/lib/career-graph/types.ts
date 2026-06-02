import type { OpportunityData } from "@/components/discovery/OpportunityCard";
import type { TrackerItemData } from "@/components/tracker/TrackerItemCard";

export type PageContext =
  | "global"
  | "discovery"
  | "tracker"
  | "ats"
  | "marketplace"
  | "profile";

export type AccentDomain =
  | "primary"
  | "resume"
  | "market"
  | "recruiter"
  | "pipeline"
  | "success"
  | "warning";

export interface ResumeVariant {
  id: string;
  branch: string;
  target: string;
  score: number;
  performanceNote: string;
}

export interface IntelligenceOpportunity extends OpportunityData {
  bestResumeVariantId: string;
  missingSkills: string[];
  salaryAligned: boolean;
  recommendedAction: string;
  salaryNote?: string;
}

export interface ApplicationRecord extends TrackerItemData {
  jobId?: string;
  matchScore: number;
  expectedResponseDate: string;
}

export interface LiveSignal {
  id: string;
  message: string;
  domain: AccentDomain;
  href?: string;
}

export interface ActivityEvent {
  id: string;
  message: string;
  time: string;
  domain: AccentDomain;
}

export interface HealthFactor {
  type: "positive" | "negative";
  text: string;
}

export interface ProfileHealth {
  score: number;
  delta: string;
  factors: HealthFactor[];
}

export interface GraphNode {
  id: string;
  type:
    | "profile"
    | "skills"
    | "projects"
    | "experience"
    | "resume"
    | "applications"
    | "market";
  label: string;
  sublabel?: string;
  connections: string[];
}

export interface CareerHealthSnapshot {
  career: { label: string; value: string; hint: string; progress: number };
  pipeline: { label: string; value: string; hint: string; progress: number };
  resume: { label: string; value: string; hint: string; progress: number };
  market: { label: string; value: string; hint: string; progress: number };
}

export interface RecommendedAction {
  id: string;
  title: string;
  reason: string;
  href: string;
  urgency: "high" | "medium" | "low";
}
