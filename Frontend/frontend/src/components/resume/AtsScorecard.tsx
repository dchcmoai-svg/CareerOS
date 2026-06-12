"use client";

import React from "react";
import { FileText, Search, ScanLine, Target } from "lucide-react";
import { resume as resumeCopy } from "@/lib/copy";

interface AtsScorecardProps {
  activeBranch: string;
}

export function AtsScorecard({ activeBranch }: AtsScorecardProps) {
  const isSwiggy = activeBranch === "feature/swiggy-frontend";
  const isInMobi = activeBranch === "feature/inmobi-systems";

  let targetRole = "General SDE roles";
  let score = 92;
  let scoreText: string = resumeCopy.scoreReady;
  let keywordsScore = "89%";
  let keywordsProgress = "w-[89%]";
  let keywordsHint = "Core SDE keywords for general roles are covered.";
  let readabilityScore = "96%";
  let readabilityProgress = "w-[96%]";
  let readabilityHint = "Sections are clean and easy to scan in 5 seconds.";
  let impactScore = "88%";
  let impactProgress = "w-[88%]";
  let impactHint = "Strong use of project action verbs and outcomes.";

  if (isSwiggy) {
    targetRole = "Swiggy — Frontend Developer";
    score = 85;
    scoreText = "Needs 2 optimizations";
    keywordsScore = "78%";
    keywordsProgress = "w-[78%]";
    keywordsHint = 'Add "Next.js", "Page Speed Metrics", or "WASM" keywords.';
    readabilityScore = "92%";
    readabilityProgress = "w-[92%]";
    readabilityHint = "Great structural layout; clean markdown format.";
    impactScore = "65%";
    impactProgress = "w-[65%]";
    impactHint = "Add web performance speed metrics to CPC projects.";
  } else if (isInMobi) {
    targetRole = "InMobi — Systems Backend Engineer";
    score = 82;
    scoreText = "Needs 3 optimizations";
    keywordsScore = "72%";
    keywordsProgress = "w-[72%]";
    keywordsHint = 'Add "System Design", "Concurrency", or "Kafka" keywords.';
    readabilityScore = "94%";
    readabilityProgress = "w-[94%]";
    readabilityHint = "Standard ATS format; highly readable font setup.";
    impactScore = "45%";
    impactProgress = "w-[45%]";
    impactHint = "Replace passive action verbs like 'worked on' or 'participated'.";
  }

  return (
    <div className="w-64 border-l border-hairline bg-surface-1 h-full p-lg flex flex-col flex-shrink-0 select-none">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-ai" />
          <h3 className="text-sm font-bold text-text-primary tracking-tight">{resumeCopy.score}</h3>
        </div>
        <p className="text-[11px] text-text-secondary font-medium">
          {resumeCopy.targetRole(targetRole)}
        </p>
      </div>

      <div className="mb-8">
        <div className="text-4xl font-bold text-text-primary tracking-tighter mb-1 tabular-nums">
          {score}
          <span className="text-xl text-text-tertiary">%</span>
        </div>
        <div
          className={`text-[10px] font-bold px-2 py-1 rounded inline-block border ${
            score >= 90
              ? "text-success bg-success/10 border-success/20"
              : "text-warning bg-warning/10 border-warning/20"
          }`}
        >
          {scoreText}
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5 text-[12px] font-bold text-text-primary">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-text-secondary" /> {resumeCopy.keywords}
            </span>
            <span className={score >= 90 ? "text-success" : "text-warning"}>{keywordsScore}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
            <div className={`h-full ${score >= 90 ? "bg-success" : "bg-warning"} ${keywordsProgress}`} />
          </div>
          <p className="text-[10px] text-text-tertiary mt-1.5 leading-snug">
            {keywordsHint}
          </p>
          <p className="text-[10px] text-text-tertiary mt-1 opacity-80">{resumeCopy.keywordsHint}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 text-[12px] font-bold text-text-primary">
            <span className="flex items-center gap-1.5">
              <ScanLine className="w-3.5 h-3.5 text-text-secondary" /> {resumeCopy.readability}
            </span>
            <span className="text-success">{readabilityScore}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
            <div className={`h-full bg-success ${readabilityProgress}`} />
          </div>
          <p className="text-[10px] text-text-tertiary mt-1.5 leading-snug">
            {readabilityHint}
          </p>
          <p className="text-[10px] text-text-tertiary mt-1 opacity-80">{resumeCopy.readabilityHint}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 text-[12px] font-bold text-text-primary">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-text-secondary" /> {resumeCopy.impact}
            </span>
            <span className={score >= 90 ? "text-success" : (impactScore === "45%" ? "text-danger" : "text-warning")}>
              {impactScore}
            </span>
          </div>
          <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
            <div className={`h-full ${score >= 90 ? "bg-success" : (impactScore === "45%" ? "bg-danger" : "bg-warning")} ${impactProgress}`} />
          </div>
          <p className="text-[10px] text-text-tertiary mt-1.5 leading-snug">
            {impactHint}
          </p>
          <p className="text-[10px] text-text-tertiary mt-1 opacity-80">{resumeCopy.impactHint}</p>
        </div>
      </div>
    </div>
  );
}
