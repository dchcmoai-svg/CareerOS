"use client";

import { Eye, Shield, TrendingUp, Users, Radio } from "lucide-react";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";
import { SystemCapabilityGrid } from "@/components/marketing/SystemCapabilityGrid";
import { marketingPages } from "@/lib/copy";

const CAPABILITIES = [
  { icon: Eye, title: "Visibility controls", description: "Stealth mode, employer blocks, and location focus — you choose who can find you.", metric: "Your rules" },
  { icon: Shield, title: "No spam, no noise", description: "We don't blast recruiters or post on your behalf. High-signal visibility only.", metric: "Respectful" },
  { icon: TrendingUp, title: "Hiring trends", description: "See demand for your skills and seniority level in the market.", metric: "Weekly insights" },
  { icon: Users, title: "Recruiter activity", description: "Know when recruiters are searching for profiles like yours.", metric: "Stay informed" },
  { icon: Radio, title: "Get noticed quietly", description: "When your profile matches what recruiters need, you can appear in their searches — opt in.", metric: "Opt-in" },
];

export default function DiscoverabilityStoryPage() {
  const copy = marketingPages.discoverability;
  return (
    <PublicPageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      cta={{ label: copy.cta, href: "/sign-up" }}
    >
      <SystemCapabilityGrid capabilities={CAPABILITIES} />
      <div className="grid md:grid-cols-2 gap-md">
        <div className="bg-surface-1 border border-hairline rounded-lg p-md">
          <span className="text-[10px] font-bold uppercase tracking-widest text-success block mb-2">{copy.stealthLabel}</span>
          <p className="text-[13px] text-text-secondary">{copy.stealthDetail}</p>
        </div>
        <div className="bg-surface-1 border border-hairline rounded-lg p-md">
          <span className="text-[10px] font-bold uppercase tracking-widest text-ai block mb-2">Recruiter activity</span>
          <p className="text-[13px] text-text-secondary">{copy.recruiterSignal}</p>
        </div>
      </div>
    </PublicPageShell>
  );
}
