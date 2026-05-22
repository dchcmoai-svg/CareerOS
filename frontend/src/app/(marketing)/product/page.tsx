"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard, Maximize2 } from "lucide-react";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";
import { SystemCapabilityGrid } from "@/components/marketing/SystemCapabilityGrid";
import { Brain, Briefcase, KanbanSquare, FileText, Network, Sparkles } from "lucide-react";
import { marketingPages, nav, dashboard } from "@/lib/copy";

const CAPABILITIES = [
  { icon: LayoutDashboard, title: dashboard.title, description: "See job matches, resume score, applications, and recruiter activity — all in one view.", metric: "Home base" },
  { icon: Brain, title: "Your profile", description: "Import skills from GitHub, LinkedIn, or your resume. No long onboarding forms.", metric: "Auto-built" },
  { icon: Briefcase, title: nav.jobs, description: "Browse scraped jobs with match scores, response likelihood, and filters by role and location.", metric: "Real jobs" },
  { icon: KanbanSquare, title: nav.tracker, description: "Track every application stage, follow-ups, and interviews in one organized board.", metric: "Stay on top" },
  { icon: FileText, title: nav.resume, description: "Role-specific suggestions, ATS checks, and multiple resume versions.", metric: "More interviews" },
  { icon: Network, title: nav.marketplace, description: "Stealth mode, employer blocks, and recruiter visibility — you decide who sees you.", metric: "In control" },
  { icon: Sparkles, title: "Career assistant", description: "Quick help with jobs, resumes, and applications — right when you need it.", metric: "Always there" },
];

export default function ProductPage() {
  const copy = marketingPages.product;
  return (
    <PublicPageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      cta={{ label: copy.cta, href: "/sign-up" }}
    >
      <SystemCapabilityGrid capabilities={CAPABILITIES} />

      <div className="bg-surface-1 border border-hairline rounded-xl p-lg surface-elevated mb-xxl">
        <div className="flex items-center gap-sm mb-md">
          <Maximize2 className="w-4 h-4 text-ai" />
          <h3 className="text-lg font-semibold tracking-tight">{copy.expansionTitle}</h3>
        </div>
        <p className="text-[14px] text-text-secondary leading-relaxed mb-md">{copy.expansionBody}</p>
        <div className="flex flex-wrap gap-sm">
          {[
            { route: "/dashboard", label: nav.dashboard },
            { route: "/jobs", label: nav.jobs },
            { route: "/tracker", label: nav.tracker },
            { route: "/resume", label: nav.resume },
            { route: "/marketplace", label: nav.marketplace },
            { route: "/profile", label: nav.profile },
          ].map(({ route, label }) => (
            <span key={route} className="text-[11px] font-medium px-sm py-1 bg-surface-2 border border-hairline rounded text-text-secondary">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link href="/features" className="text-[13px] font-semibold text-ai hover:text-ai-hover inline-flex items-center gap-1">
          {copy.deepDive} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </PublicPageShell>
  );
}
