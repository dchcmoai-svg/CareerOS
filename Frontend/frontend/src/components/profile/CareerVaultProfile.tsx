"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  GitBranch,
  Layers,
  Building2,
  Download,
  Eye,
  Upload,
  Pencil,
  CheckCircle2,
  Plus,
} from "lucide-react";
import { staggerContainer, slideUpVariants, staggerItem } from "@/lib/motion";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { IntelligenceCard } from "@/components/intelligence/IntelligenceCard";
import { AnimatedProgress } from "@/components/motion/AnimatedProgress";
import { profile as profileCopy } from "@/lib/copy";
import { useCareerGraph } from "@/lib/career-graph";
import { ProfessionalGraphView } from "@/components/graph/ProfessionalGraphView";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";

const SKILLS = [
  { name: "React / Next.js", verified: true },
  { name: "TypeScript", verified: true },
  { name: "Distributed Systems", verified: false },
  { name: "Rust", verified: true },
];

const EXPERIENCE = [
  {
    id: "1",
    role: "Lead Frontend Engineer",
    company: "Vercel",
    duration: "2024 — Present",
    impact: "Shipped RSC improvements used by 40% of enterprise customers",
    keywords: ["Next.js", "React", "Performance"],
  },
  {
    id: "2",
    role: "Senior UI Engineer",
    company: "Stripe",
    duration: "2021 — 2024",
    impact: "Reduced dashboard load time 18% across core products",
    keywords: ["React", "TypeScript", "Design systems"],
  },
];

export function CareerVaultProfile() {
  const profileHealth = useCareerGraph((s) => s.profileHealth);
  const resumeVariants = useCareerGraph((s) => s.resumeVariants);
  const activeVariantId = useCareerGraph((s) => s.activeResumeVariantId);
  const setActiveResumeVariant = useCareerGraph((s) => s.setActiveResumeVariant);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-lg py-md pb-xl max-w-5xl"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title={profileCopy.title}
          subtitle={profileCopy.subtitle}
          guide={profileCopy.pageGuide}
        />
      </motion.div>

      <motion.div variants={slideUpVariants}>
        <ProfessionalGraphView className="mb-md" />
      </motion.div>

      <motion.div variants={slideUpVariants}>
        <IntelligenceCard title="Profile strength" domain="resume" className="!p-lg">
          <div className="flex flex-col sm:flex-row gap-lg items-start sm:items-center">
            <div className="flex-1">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-semibold text-text-primary tabular-nums">
                  {profileHealth.score}%
                </span>
                <span className="text-[12px] text-success font-medium">{profileHealth.delta}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mt-3 mb-2">
                Why
              </p>
              <ul className="space-y-1.5">
                {profileHealth.factors.map((f, i) => (
                  <li
                    key={i}
                    className={cn(
                      "text-[13px] leading-relaxed",
                      f.type === "positive" ? "text-text-secondary" : "text-warning"
                    )}
                  >
                    {f.type === "positive" ? "•" : "−"} {f.text}
                  </li>
                ))}
              </ul>
              <AnimatedProgress value={profileHealth.score} barClassName="bg-resume" className="mt-4 h-1.5" />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-hairline bg-surface-2 text-[11px] text-text-secondary">
                <GithubIcon className="w-3.5 h-3.5" /> GitHub synced
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-hairline bg-surface-2 text-[11px] text-text-secondary">
                <LinkedinIcon className="w-3.5 h-3.5" /> LinkedIn synced
              </span>
            </div>
          </div>
        </IntelligenceCard>
      </motion.div>

      <motion.div variants={slideUpVariants} className="grid md:grid-cols-2 gap-md">
        <IntelligenceCard title="Resume" subtitle={profileCopy.resumeDesc} icon={FileText} domain="resume">
          <div className="flex flex-wrap gap-2 mt-1">
            <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hairline text-[11px] font-semibold text-text-secondary hover:bg-surface-2">
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hairline text-[11px] font-semibold text-text-secondary hover:bg-surface-2">
              <Upload className="w-3.5 h-3.5" /> Upload
            </button>
            <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hairline text-[11px] font-semibold text-text-secondary hover:bg-surface-2">
              <Download className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </IntelligenceCard>
        <IntelligenceCard title="Cover letter" subtitle={profileCopy.coverLetterDesc} icon={FileText} domain="primary">
          <Link
            href="/resume"
            className="inline-flex items-center gap-1.5 mt-1 text-[12px] font-semibold text-primary hover:underline"
          >
            <Pencil className="w-3.5 h-3.5" /> Preview & edit
          </Link>
        </IntelligenceCard>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-md">
        <motion.div variants={staggerItem} className="lg:col-span-1 space-y-md">
          <IntelligenceCard title={profileCopy.skills} icon={Layers} domain="market">
            <ul className="space-y-2 mt-1">
              {SKILLS.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between py-2 px-2 rounded-lg border border-hairline bg-surface-2/40 text-[12px]"
                >
                  <span className="font-medium text-text-primary">{s.name}</span>
                  {s.verified ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <button type="button" className="text-[10px] font-semibold text-primary">
                      Verify
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <button type="button" className="mt-2 text-[11px] font-semibold text-text-tertiary flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add skill
            </button>
          </IntelligenceCard>

          <IntelligenceCard title={profileCopy.resumeVersions} icon={GitBranch} domain="resume">
            <ul className="space-y-2 mt-1">
              {resumeVariants.map((b) => (
                <li key={b.id} className="p-2.5 rounded-lg border border-hairline bg-surface-2/40">
                  <button
                    type="button"
                    onClick={() => setActiveResumeVariant(b.id)}
                    className={cn(
                      "w-full text-left",
                      b.id === activeVariantId && "ring-1 ring-resume/40 rounded-md"
                    )}
                  >
                    <p className="text-[11px] font-mono text-resume truncate">{b.branch}</p>
                    <p className="text-[10px] text-text-tertiary mt-0.5">{b.target}</p>
                    <p className="text-[11px] font-bold text-success mt-1 tabular-nums">{b.score}% score</p>
                    <p className="text-[10px] text-text-tertiary mt-1">{b.performanceNote}</p>
                  </button>
                </li>
              ))}
            </ul>
            <Link href="/resume" className="mt-2 inline-block text-[11px] font-semibold text-primary hover:underline">
              Edit in resume lab →
            </Link>
          </IntelligenceCard>
        </motion.div>

        <motion.div variants={staggerItem} className="lg:col-span-2">
          <IntelligenceCard title={profileCopy.experience} icon={Building2} domain="primary">
            <div className="space-y-6 mt-2">
              {EXPERIENCE.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-primary/30">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                  <h4 className="text-[15px] font-semibold text-text-primary">{exp.role}</h4>
                  <p className="text-[12px] text-text-tertiary">
                    {exp.company} · {exp.duration}
                  </p>
                  <p className="text-[13px] text-text-secondary mt-2 leading-relaxed">{exp.impact}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {exp.keywords.map((k) => (
                      <span
                        key={k}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-surface-2 border border-hairline text-text-secondary"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </IntelligenceCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
