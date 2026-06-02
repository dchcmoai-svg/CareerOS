import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface CareerCommand {
  id: string;
  label: string;
  keywords: string[];
  group: "actions" | "intelligence" | "navigate";
  run: (ctx: CommandContext) => void;
}

export interface CommandContext {
  router: AppRouterInstance;
  setAgentOpen: (open: boolean) => void;
  selectOpportunity: (id: string | null) => void;
  setActiveResumeVariant: (id: string, reason?: string) => void;
  pushActivity: (event: { message: string; time: string; domain: "primary" | "resume" | "pipeline" }) => void;
}

export function buildCareerCommands(): CareerCommand[] {
  return [
    {
      id: "high-priority-opps",
      label: "Find high-priority opportunities",
      keywords: ["priority", "match", "jobs", "opportunities"],
      group: "actions",
      run: ({ router, pushActivity }) => {
        pushActivity({ message: "Surfaced roles with 90%+ match", time: "Just now", domain: "primary" });
        router.push("/jobs");
      },
    },
    {
      id: "create-resume-variant",
      label: "Create resume variant",
      keywords: ["resume", "branch", "variant"],
      group: "actions",
      run: ({ router }) => router.push("/resume"),
    },
    {
      id: "analyze-profile",
      label: "Analyze profile",
      keywords: ["profile", "strength", "health"],
      group: "intelligence",
      run: ({ router, setAgentOpen }) => {
        router.push("/profile");
        setAgentOpen(true);
      },
    },
    {
      id: "follow-up-candidates",
      label: "Show follow-up candidates",
      keywords: ["follow", "stalled", "ghost"],
      group: "actions",
      run: ({ router, pushActivity }) => {
        pushActivity({ message: "Filtered applications needing follow-up", time: "Just now", domain: "pipeline" });
        router.push("/tracker");
      },
    },
    {
      id: "interview-prep",
      label: "Generate interview prep",
      keywords: ["interview", "prep", "stripe"],
      group: "intelligence",
      run: ({ router, setAgentOpen, pushActivity }) => {
        pushActivity({ message: "Interview prep queued for Stripe", time: "Just now", domain: "pipeline" });
        router.push("/tracker");
        setAgentOpen(true);
      },
    },
    {
      id: "recruiter-activity",
      label: "Show recruiter activity",
      keywords: ["recruiter", "views", "discovered"],
      group: "intelligence",
      run: ({ router }) => router.push("/marketplace"),
    },
    {
      id: "tailor-top-match",
      label: "Improve resume for top match",
      keywords: ["tailor", "ats", "keywords"],
      group: "actions",
      run: ({ router, setActiveResumeVariant }) => {
        setActiveResumeVariant("rv-staff", "Opened for top match tailoring");
        router.push("/resume");
      },
    },
    {
      id: "pipeline-summary",
      label: "Summarize my job search",
      keywords: ["summary", "pipeline", "status"],
      group: "intelligence",
      run: ({ setAgentOpen, router }) => {
        router.push("/dashboard");
        setAgentOpen(true);
      },
    },
    {
      id: "today-priorities",
      label: "What should I focus on today?",
      keywords: ["today", "priority", "focus"],
      group: "intelligence",
      run: ({ router, setAgentOpen }) => {
        router.push("/dashboard");
        setAgentOpen(true);
      },
    },
  ];
}
