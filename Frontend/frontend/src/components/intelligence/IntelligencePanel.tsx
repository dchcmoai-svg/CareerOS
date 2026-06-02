"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  HeartPulse,
  KanbanSquare,
  TrendingUp,
  FileText,
  Zap,
  Clock,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCareerGraph } from "@/lib/career-graph";
import type { PageContext } from "@/lib/career-graph";
import { springs } from "@/lib/motion";

interface IntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  variant?: "docked" | "overlay";
}

const PAGE_FOCUS: Record<
  PageContext,
  { title: string; subtitle: string; highlight: "career" | "pipeline" | "market" | "resume" }
> = {
  global: { title: "Career intelligence", subtitle: "Unified view across your career graph", highlight: "career" },
  discovery: { title: "Opportunity insights", subtitle: "Matches, response odds, and resume fit", highlight: "market" },
  tracker: { title: "Application insights", subtitle: "Pipeline health, follow-ups, and ghost risk", highlight: "pipeline" },
  ats: { title: "Resume signals", subtitle: "ATS gaps, variants, and keyword alignment", highlight: "resume" },
  marketplace: { title: "Market & visibility", subtitle: "Recruiter activity and demand signals", highlight: "market" },
  profile: { title: "Profile recommendations", subtitle: "Strengths, gaps, and graph connections", highlight: "career" },
};

function HealthBar({ value, tone }: { value: number; tone: string }) {
  return (
    <div className="h-1 rounded-full bg-surface-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={springs.panel}
        className={cn("h-full rounded-full", tone)}
      />
    </div>
  );
}

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function IntelligencePanel({
  isOpen,
  onClose,
  className,
  variant = "docked",
}: IntelligencePanelProps) {
  const pageContext = useCareerGraph((s) => s.pageContext);
  const careerHealth = useCareerGraph((s) => s.careerHealth);
  const recommendedActions = useCareerGraph((s) => s.recommendedActions);
  const activity = useCareerGraph((s) => s.activity);
  const marketSignals = useCareerGraph((s) => s.marketSignals);
  const profileHealth = useCareerGraph((s) => s.profileHealth);
  const activeVariant = useCareerGraph((s) => s.getActiveResumeVariant());
  const selectedOppId = useCareerGraph((s) => s.selectedOpportunityId);
  const selectedAppId = useCareerGraph((s) => s.selectedApplicationId);
  const getOpportunity = useCareerGraph((s) => s.getOpportunity);
  const getApplication = useCareerGraph((s) => s.getApplication);
  const resumeVariants = useCareerGraph((s) => s.resumeVariants);

  const meta = PAGE_FOCUS[pageContext];
  const selectedOpp = selectedOppId ? getOpportunity(selectedOppId) : undefined;
  const selectedApp = selectedAppId ? getApplication(selectedAppId) : undefined;

  const panel = (
    <motion.aside
      initial={variant === "overlay" ? { x: "100%" } : false}
      animate={variant === "overlay" ? { x: 0 } : undefined}
      exit={variant === "overlay" ? { x: "100%" } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 36 }}
      className={cn(
        "flex flex-col bg-surface-1 border-l border-hairline h-full",
        variant === "docked" ? "w-[360px] shrink-0" : "fixed right-0 top-0 bottom-0 w-full max-w-[380px] z-50 shadow-2xl",
        className
      )}
    >
      <div className="flex items-center justify-between px-md py-sm border-b border-hairline shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">{meta.title}</h2>
          <p className="text-[11px] text-text-tertiary mt-0.5">{meta.subtitle}</p>
        </div>
        {variant === "overlay" && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-surface-2 text-text-tertiary"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-md space-y-lg">
        <Section title="Career health">
          <div className="rounded-lg border border-hairline bg-surface-2/40 p-3 space-y-3">
            {(
              [
                { key: "career", icon: HeartPulse, data: careerHealth.career, bar: "bg-primary" },
                { key: "pipeline", icon: KanbanSquare, data: careerHealth.pipeline, bar: "bg-intelligence" },
              ] as const
            ).map(({ key, icon: Icon, data, bar }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-text-secondary flex items-center gap-1.5">
                    <Icon className="w-3 h-3" />
                    {data.label}
                  </span>
                  <span className="text-[11px] font-semibold text-text-primary">{data.value}</span>
                </div>
                <HealthBar value={data.progress} tone={bar} />
                <p className="text-[10px] text-text-tertiary mt-1">{data.hint}</p>
              </div>
            ))}
          </div>
        </Section>

        {pageContext === "tracker" && selectedApp && (
          <Section title="Selected application">
            <div className="rounded-lg border border-hairline p-3 space-y-2">
              <p className="text-sm font-medium text-text-primary">
                {selectedApp.role} · {selectedApp.company}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <Metric label="Response" value={`${selectedApp.responseProbability}%`} />
                <Metric label="Ghost risk" value={selectedApp.ghostRisk} />
                <Metric label="Match" value={`${selectedApp.matchScore}%`} />
                <Metric label="Expected" value={selectedApp.expectedResponseDate} />
              </div>
              <p className="text-[11px] text-warning flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedApp.followUpIn}
              </p>
              <p className="text-[10px] font-mono text-text-tertiary flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                {selectedApp.resumeBranch}
              </p>
            </div>
          </Section>
        )}

        {pageContext === "discovery" && selectedOpp && (
          <Section title="Selected opportunity">
            <div className="rounded-lg border border-hairline p-3 space-y-2">
              <p className="text-sm font-medium text-text-primary">
                {selectedOpp.role} · {selectedOpp.company}
              </p>
              <p className="text-[11px] text-text-secondary">{selectedOpp.aiRationale}</p>
              {selectedOpp.missingSkills.length > 0 && (
                <p className="text-[11px] text-warning">
                  Missing: {selectedOpp.missingSkills.join(", ")}
                </p>
              )}
              <p className="text-[11px] text-ai font-medium">{selectedOpp.recommendedAction}</p>
            </div>
          </Section>
        )}

        <Section title="Pipeline health">
          <div className="rounded-lg border border-hairline bg-surface-2/40 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-text-secondary">{careerHealth.pipeline.label}</span>
              <span className="text-[11px] font-semibold">{careerHealth.pipeline.value}</span>
            </div>
            <HealthBar value={careerHealth.pipeline.progress} tone="bg-intelligence" />
            <p className="text-[10px] text-text-tertiary mt-2">{careerHealth.pipeline.hint}</p>
          </div>
        </Section>

        <Section title="Market signals">
          <ul className="space-y-1.5">
            {marketSignals.map((m) => (
              <li
                key={m.id}
                className="flex items-start gap-2 text-[11px] text-text-secondary px-2 py-1.5 rounded-md bg-surface-2/50 border border-hairline/50"
              >
                <TrendingUp className="w-3 h-3 text-market shrink-0 mt-0.5" />
                {m.message}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Resume signals">
          <div className="rounded-lg border border-hairline p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text-secondary">{careerHealth.resume.label}</span>
              <span className="text-[11px] font-semibold text-resume">{careerHealth.resume.value}</span>
            </div>
            <HealthBar value={careerHealth.resume.progress} tone="bg-resume" />
            <p className="text-[10px] font-mono text-text-tertiary">{activeVariant.branch}</p>
            <p className="text-[10px] text-text-tertiary">{activeVariant.performanceNote}</p>
            {pageContext === "profile" && (
              <ul className="pt-2 border-t border-hairline space-y-1">
                {profileHealth.factors.slice(0, 4).map((f, i) => (
                  <li
                    key={i}
                    className={cn(
                      "text-[11px]",
                      f.type === "positive" ? "text-success" : "text-warning"
                    )}
                  >
                    {f.type === "positive" ? "+" : "−"} {f.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        {pageContext === "ats" && (
          <Section title="Variant performance">
            {resumeVariants.map((v) => (
              <div
                key={v.id}
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 rounded-md text-[11px] border",
                  v.id === activeVariant.id
                    ? "border-resume/30 bg-resume/5"
                    : "border-hairline/50"
                )}
              >
                <span className="font-mono truncate">{v.branch}</span>
                <span className="tabular-nums font-semibold">{v.score}%</span>
              </div>
            ))}
          </Section>
        )}

        <Section title="Recommended actions">
          <ul className="space-y-1.5">
            {recommendedActions.slice(0, 4).map((a) => (
              <Link
                key={a.id}
                href={a.href}
                className="flex items-start justify-between gap-2 px-2.5 py-2 rounded-lg border border-hairline hover:bg-surface-2 transition-colors group"
              >
                <div>
                  <p className="text-[12px] font-medium text-text-primary">{a.title}</p>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{a.reason}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-text-tertiary opacity-0 group-hover:opacity-100 shrink-0 mt-0.5" />
              </Link>
            ))}
          </ul>
        </Section>

        <Section title="Recent activity">
          <ul className="space-y-2">
            {activity.slice(0, 5).map((e) => (
              <li key={e.id} className="flex gap-2 text-[11px]">
                <Zap className="w-3 h-3 text-ai shrink-0 mt-0.5" />
                <div>
                  <p className="text-text-secondary">{e.message}</p>
                  <p className="text-[10px] text-text-tertiary">{e.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="p-md border-t border-hairline shrink-0">
        <Link
          href="/profile"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-hairline text-[11px] font-medium text-text-secondary hover:bg-surface-2 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          View professional graph
        </Link>
      </div>
    </motion.aside>
  );

  if (variant === "docked") {
    if (!isOpen) return null;
    return panel;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-canvas/40 backdrop-blur-[2px] z-40 lg:hidden"
            onClick={onClose}
          />
          {panel}
        </>
      )}
    </AnimatePresence>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-text-tertiary">{label}</p>
      <p className="font-semibold text-text-primary">{value}</p>
    </div>
  );
}
