"use client";

import { FileText, GitBranch, AlertTriangle, BookOpen, Layers } from "lucide-react";
import { PublicPageShell } from "@/components/marketing/PublicPageShell";
import { SystemCapabilityGrid } from "@/components/marketing/SystemCapabilityGrid";
import { marketingPages } from "@/lib/copy";

const CAPABILITIES = [
  { icon: FileText, title: "Clear suggestions", description: "Inline tips flag weak phrases, missing keywords, and bullets that need numbers.", metric: "Easy to fix" },
  { icon: GitBranch, title: "Versions per role", description: "Keep a resume version for Stripe, another for Vercel — switch in one click.", metric: "Organized" },
  { icon: AlertTriangle, title: "ATS score", description: "See how well your resume matches applicant tracking systems for each role.", metric: "Track progress" },
  { icon: Layers, title: "Why it matters", description: "Every suggestion explains what to change and why recruiters care.", metric: "No guesswork" },
  { icon: BookOpen, title: "Improvement history", description: "Watch your score improve as you edit — see what changes made the difference.", metric: "Motivating" },
];

export default function ResumeLabStoryPage() {
  const copy = marketingPages.resumeLab;
  return (
    <PublicPageShell
      eyebrow={copy.eyebrow}
      title={copy.title}
      description={copy.description}
      cta={{ label: copy.cta, href: "/sign-up" }}
    >
      <SystemCapabilityGrid capabilities={CAPABILITIES} />
      <div className="bg-canvas border border-hairline rounded-lg p-md">
        <div className="text-[10px] text-text-tertiary uppercase tracking-widest mb-2">Example suggestion</div>
        <p className="text-[13px] text-text-secondary leading-relaxed">
          <span className="border-b-2 border-dashed border-warning bg-warning/5 px-1 rounded">improving velocities</span>
          {" → "}
          {copy.diagnosticHint}
        </p>
      </div>
    </PublicPageShell>
  );
}
