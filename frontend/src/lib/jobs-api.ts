import type { OpportunityData } from "@/components/discovery/OpportunityCard";

export interface JobApiRecord {
  id: string;
  role: string;
  company: string;
  location: string;
  compensation: string;
  remote: boolean;
  hybrid?: boolean;
  workMode?: string;
  source?: string;
  url?: string;
  description?: string | null;
  postedAt?: string | null;
  category?: string;
  fitScore: number;
  ghostScore: number;
  hiringVelocity: "Fast" | "Slow" | "Stalled" | "Steady";
  applicationDifficulty: "Easy" | "Medium" | "High";
  sponsorshipRealism: "High" | "Low" | "Unknown";
  aiRationale: string;
}

export interface JobsApiResponse {
  jobs: JobApiRecord[];
  total: number;
  offset?: number;
  limit?: number;
  error?: string;
}

export function mapJobToOpportunity(job: JobApiRecord): OpportunityData {
  return {
    id: job.id,
    role: job.role,
    company: job.company,
    location: job.location,
    compensation: job.compensation,
    remote: job.remote,
    sponsorshipRealism:
      job.sponsorshipRealism === "High" || job.sponsorshipRealism === "Low"
        ? job.sponsorshipRealism
        : "Unknown",
    fitScore: job.fitScore,
    ghostScore: job.ghostScore,
    hiringVelocity:
      job.hiringVelocity === "Fast" ||
      job.hiringVelocity === "Slow" ||
      job.hiringVelocity === "Stalled"
        ? job.hiringVelocity
        : "Slow",
    applicationDifficulty: job.applicationDifficulty,
    aiRationale: job.aiRationale,
    url: job.url,
    postedAt: job.postedAt,
    category: job.category,
    source: job.source,
  };
}

export const JOB_CATEGORIES = [
  { id: "all", label: "All roles" },
  { id: "software-engineering", label: "Software Engineering" },
  { id: "ai-ml", label: "AI / ML" },
  { id: "product", label: "Product" },
  { id: "design", label: "Design" },
  { id: "data", label: "Data" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "operations", label: "Operations" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "other", label: "Other" },
] as const;
