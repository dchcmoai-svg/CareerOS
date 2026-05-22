"use client";

import React from "react";
import { FileText, Search, ScanLine, Target } from "lucide-react";
import { resume as resumeCopy } from "@/lib/copy";

interface AtsScorecardProps {
  activeBranch: string;
}

export function AtsScorecard({ activeBranch }: AtsScorecardProps) {
  const isStripe = activeBranch === "feature/stripe-frontend";
  const targetRole = isStripe ? "Stripe — Frontend Engineer" : "General engineering roles";

  return (
    <div className="w-64 border-l border-hairline bg-surface-1 h-full p-lg flex flex-col flex-shrink-0">
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
          {isStripe ? "82" : "91"}
          <span className="text-xl text-text-tertiary">%</span>
        </div>
        <div
          className={`text-[10px] font-bold px-2 py-1 rounded inline-block border ${
            isStripe
              ? "text-warning bg-warning/10 border-warning/20"
              : "text-success bg-success/10 border-success/20"
          }`}
        >
          {isStripe ? resumeCopy.scoreNeedsWork : resumeCopy.scoreReady}
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5 text-[12px] font-bold text-text-primary">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-text-secondary" /> {resumeCopy.keywords}
            </span>
            <span className={isStripe ? "text-warning" : "text-success"}>{isStripe ? "76%" : "89%"}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
            <div className={`h-full ${isStripe ? "bg-warning w-[76%]" : "bg-success w-[89%]"}`} />
          </div>
          <p className="text-[10px] text-text-tertiary mt-1.5 leading-snug">
            {isStripe
              ? 'Add "Distributed Systems" and "WebGL" — common in this role.'
              : "Core keywords for this role are covered."}
          </p>
          <p className="text-[10px] text-text-tertiary mt-1 opacity-80">{resumeCopy.keywordsHint}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 text-[12px] font-bold text-text-primary">
            <span className="flex items-center gap-1.5">
              <ScanLine className="w-3.5 h-3.5 text-text-secondary" /> {resumeCopy.readability}
            </span>
            <span className="text-success">{isStripe ? "94%" : "96%"}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
            <div className={`h-full bg-success ${isStripe ? "w-[94%]" : "w-[96%]"}`} />
          </div>
          <p className="text-[10px] text-text-tertiary mt-1.5 leading-snug">
            Clear sections — easy to skim in about {isStripe ? "6" : "5"} seconds.
          </p>
          <p className="text-[10px] text-text-tertiary mt-1 opacity-80">{resumeCopy.readabilityHint}</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 text-[12px] font-bold text-text-primary">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-text-secondary" /> {resumeCopy.impact}
            </span>
            <span className={isStripe ? "text-danger" : "text-success"}>{isStripe ? "45%" : "88%"}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
            <div className={`h-full ${isStripe ? "bg-danger w-[45%]" : "bg-success w-[88%]"}`} />
          </div>
          <p className="text-[10px] text-text-tertiary mt-1.5 leading-snug">
            {isStripe ? "4 bullets could use numbers (%, time saved, scale)." : "Strong use of measurable outcomes."}
          </p>
          <p className="text-[10px] text-text-tertiary mt-1 opacity-80">{resumeCopy.impactHint}</p>
        </div>
      </div>
    </div>
  );
}
