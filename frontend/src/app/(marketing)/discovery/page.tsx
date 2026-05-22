"use client";

import { Target, BarChart3, Filter, Sparkles, Clock } from "lucide-react";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";
import { SystemCapabilityGrid } from "@/components/marketing/SystemCapabilityGrid";
import { marketingPages } from "@/lib/copy";

const CAPABILITIES = [
  { icon: Target, title: "Match scores", description: "See how well each role fits your profile — with a clear explanation of why.", metric: "Per role" },
  { icon: Clock, title: "Response likelihood", description: "Know which companies tend to respond — before you spend time applying.", metric: "Save time" },
  { icon: BarChart3, title: "Hiring pace", description: "See if a company is hiring quickly or if a role has been open too long.", metric: "Real signals" },
  { icon: Filter, title: "Practical filters", description: "Remote, hybrid, category, salary, sponsorship — filter the way you actually search.", metric: "LinkedIn-clear" },
  { icon: Sparkles, title: "Apply with confidence", description: "Tailor your resume for each role and track the application in one click.", metric: "Connected" },
];

export default function DiscoveryStoryPage() {
  const copy = marketingPages.discovery;
  return (
    <PublicPageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      cta={{ label: copy.cta, href: "/jobs" }}
    >
      <SystemCapabilityGrid capabilities={CAPABILITIES} />
      <div className="bg-surface-1 border border-hairline rounded-lg p-md text-[13px] text-text-secondary leading-relaxed">
        <span className="text-ai font-bold block mb-2 uppercase text-[10px] tracking-widest">Example job card</span>
        {copy.sampleSignal}
      </div>
    </PublicPageShell>
  );
}
