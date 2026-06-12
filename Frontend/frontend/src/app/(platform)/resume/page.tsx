"use client";

import React, { useState, useEffect } from "react";
import { VersionControlStrip } from "@/components/resume/VersionControlStrip";
import { AtsScorecard } from "@/components/resume/AtsScorecard";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { CoverLetterDocument } from "@/components/resume/CoverLetterDocument";
import { OptimizationTimeline } from "@/components/resume/OptimizationTimeline";
import { useEcosystem } from "@/lib/EcosystemContext";
import { useCareerGraph } from "@/lib/career-graph";
import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/motion";
import { resume as resumeCopy } from "@/lib/copy";

export default function ResumeLabPage() {
  const { setActiveIntelligence } = useEcosystem();
  const [activeTab, setActiveTab] = useState<"resume" | "cover-letter">("resume");

  const resumeVariants = useCareerGraph((s) => s.resumeVariants);
  const activeResumeVariantId = useCareerGraph((s) => s.activeResumeVariantId);
  const setActiveResumeVariant = useCareerGraph((s) => s.setActiveResumeVariant);

  const activeVariant = resumeVariants.find(v => v.id === activeResumeVariantId) ?? resumeVariants[0];
  const activeBranch = activeVariant.branch;

  const handleBranchChange = (branchName: string) => {
    const v = resumeVariants.find(x => x.branch === branchName);
    if (v) {
      setActiveResumeVariant(v.id, `Selected branch: ${v.branch}`);
    }
  };

  useEffect(() => {
    if (activeBranch === "feature/swiggy-frontend") {
      setActiveIntelligence(
        "Swiggy matches well with your React/Next.js experience. Fix 2 metrics suggestions to boost score above 88%."
      );
    } else if (activeBranch === "feature/inmobi-systems") {
      setActiveIntelligence(
        "InMobi systems roles require high-throughput data handling. Highlight concurrency in your projects."
      );
    } else {
      setActiveIntelligence(
        "This general SDE variant is optimized for Indian product tech. Ready to download and apply."
      );
    }
  }, [activeBranch, setActiveIntelligence]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-full -mx-lg -mt-lg"
    >
      <VersionControlStrip
        activeBranch={activeBranch}
        onChangeBranch={handleBranchChange}
        activeTab={activeTab}
        hint={resumeCopy.pageGuide}
      />

      {/* Editor Tabs bar */}
      <div className="bg-surface-1 px-lg py-2 border-b border-hairline/80 flex items-center gap-2 select-none flex-shrink-0">
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider font-mono mr-2">
          Workspace View:
        </span>
        {(["resume", "cover-letter"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer border ${
              activeTab === t
                ? "bg-primary/10 border-primary/20 text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === "resume" ? (
          <ResumeDocument activeBranch={activeBranch} />
        ) : (
          <CoverLetterDocument activeBranch={activeBranch} />
        )}
        <AtsScorecard activeBranch={activeBranch} />
        <OptimizationTimeline />
      </div>
    </motion.div>
  );
}
