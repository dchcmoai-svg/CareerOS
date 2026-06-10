"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  GitBranch,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { IntelligenceOpportunity } from "@/lib/career-graph";
import { useCareerGraph } from "@/lib/career-graph";
import { springs } from "@/lib/motion";
import { jobs as jobsCopy } from "@/lib/copy";

interface OpportunityIntelligenceTableProps {
  opportunities: IntelligenceOpportunity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}

function responsePct(ghostScore: number) {
  return Math.max(0, Math.min(100, 100 - ghostScore));
}

function velocityTone(v: string) {
  if (v === "Fast") return "text-success";
  if (v === "Stalled") return "text-danger";
  return "text-text-secondary";
}

export function OpportunityIntelligenceTable({
  opportunities,
  selectedId,
  onSelect,
  loading,
}: OpportunityIntelligenceTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const resumeVariants = useCareerGraph((s) => s.resumeVariants);
  const setActiveResumeVariant = useCareerGraph((s) => s.setActiveResumeVariant);

  const handleApplyCareerOS = async (e: React.MouseEvent, opp: any, variantBranch: string) => {
    e.stopPropagation();
    setApplyingId(opp.id);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: opp.id,
          company: opp.company,
          role: opp.role,
          resumeBranch: variantBranch,
        }),
      });
      if (res.ok) {
        setAppliedIds((prev) => [...prev, opp.id]);
        alert(`Successfully applied to ${opp.role} at ${opp.company} via CareerOS!`);
      } else {
        alert("Failed to apply. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to apply. Please try again.");
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-hairline overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 border-b border-hairline bg-surface-2/30 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!opportunities.length) {
    return (
      <div className="text-center py-16 border border-dashed border-hairline rounded-xl text-text-tertiary text-sm">
        {jobsCopy.noResults}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-hairline overflow-hidden bg-surface-1">
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_52px_72px_80px_minmax(0,1fr)_72px] gap-2 px-3 py-2 border-b border-hairline bg-surface-2/50 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
        <span>Role</span>
        <span>Company</span>
        <span className="text-right">Match</span>
        <span className="text-right">Response</span>
        <span className="text-right">Velocity</span>
        <span>Best resume</span>
        <span className="text-right">Action</span>
      </div>

      <div className="divide-y divide-hairline">
        {opportunities.map((opp) => {
          const isExpanded = expandedId === opp.id;
          const isSelected = selectedId === opp.id;
          const variant = resumeVariants.find((v) => v.id === opp.bestResumeVariantId);
          const resp = responsePct(opp.ghostScore);

          return (
            <div key={opp.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(opp.id);
                  setExpandedId(isExpanded ? null : opp.id);
                  if (variant) setActiveResumeVariant(variant.id, `Selected for ${opp.company}`);
                }}
                className={cn(
                  "w-full grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_52px_72px_80px_minmax(0,1fr)_72px] gap-2 px-3 py-2.5 text-left text-[12px] transition-colors",
                  isSelected ? "bg-primary/5" : "hover:bg-surface-2/60"
                )}
              >
                <span className="flex items-center gap-1.5 min-w-0 font-medium text-text-primary truncate">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 shrink-0 text-text-tertiary" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-text-tertiary" />
                  )}
                  {opp.role}
                </span>
                <span className="text-text-secondary truncate">{opp.company}</span>
                <span
                  className={cn(
                    "text-right font-semibold tabular-nums",
                    opp.fitScore >= 85 ? "text-success" : "text-text-primary"
                  )}
                >
                  {opp.fitScore}%
                </span>
                <span
                  className={cn(
                    "text-right tabular-nums",
                    resp >= 60 ? "text-success" : "text-warning"
                  )}
                >
                  {resp}%
                </span>
                <span className={cn("text-right text-[11px]", velocityTone(opp.hiringVelocity))}>
                  {opp.hiringVelocity}
                </span>
                <span className="flex items-center gap-1 min-w-0 font-mono text-[10px] text-text-tertiary truncate">
                  <GitBranch className="w-3 h-3 shrink-0" />
                  {variant?.branch ?? "—"}
                </span>
                <span className="text-right text-[11px] font-medium text-ai">{opp.recommendedAction}</span>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={springs.panel}
                    className="overflow-hidden bg-surface-2/30 border-t border-hairline/50"
                  >
                    <div className="px-4 py-4 grid md:grid-cols-2 gap-4 text-[12px]">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-ai" />
                          {jobsCopy.whyMatch}
                        </p>
                        <p className="text-text-secondary leading-relaxed">{opp.aiRationale}</p>
                      </div>
                      <div className="space-y-3">
                        {opp.missingSkills.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase text-text-tertiary mb-1">
                              Missing skills
                            </p>
                            <p className="text-warning">{opp.missingSkills.join(" · ")}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] font-bold uppercase text-text-tertiary mb-1">
                            Salary alignment
                          </p>
                          <p className={opp.salaryAligned ? "text-success" : "text-text-secondary"}>
                            {opp.salaryAligned ? opp.salaryNote : "Comp not listed — verify on apply"}
                          </p>
                        </div>
                        <div className="flex gap-2 pt-1">
                          {opp.url && (
                            <a
                              href={opp.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-ai text-canvas text-[11px] font-semibold hover:bg-ai-hover"
                            >
                              {jobsCopy.applyNow}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            type="button"
                            disabled={applyingId !== null || appliedIds.includes(opp.id)}
                            onClick={(e) => handleApplyCareerOS(e, opp, variant?.branch || "main")}
                            className={`px-3 py-1.5 rounded-md border text-[11px] font-semibold transition-all cursor-pointer ${
                              appliedIds.includes(opp.id)
                                ? "bg-success/15 text-success border-success/30 cursor-default"
                                : "bg-primary text-white border-primary hover:bg-primary-hover active:scale-[0.98]"
                            } disabled:opacity-60`}
                          >
                            {appliedIds.includes(opp.id) ? "Applied ✓" : applyingId === opp.id ? "Applying..." : "Apply via CareerOS"}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (variant) setActiveResumeVariant(variant.id);
                            }}
                            className="px-3 py-1.5 rounded-md border border-hairline text-[11px] font-medium text-text-secondary hover:bg-surface-2 cursor-pointer"
                          >
                            {jobsCopy.tailorResume}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
