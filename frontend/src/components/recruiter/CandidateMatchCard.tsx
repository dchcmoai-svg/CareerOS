"use client";

import React from "react";
import { BrainCircuit, Search, Briefcase, ChevronRight, Zap } from "lucide-react";

export function CandidateMatchCard() {
  return (
    <div className="w-full bg-surface-1 border border-hairline rounded-lg p-4 hover:bg-surface-2 transition-colors cursor-pointer group shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[15px] font-bold text-text-primary tracking-tight">Alex C. (Stealth)</h3>
          <p className="text-[12px] text-text-secondary font-medium">Senior Frontend Engineer • Stripe Variant</p>
        </div>
        <div className="bg-success/10 border border-success/20 text-success text-[11px] font-bold px-2 py-1 rounded">
          96% Probability
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-hairline">
        <div>
          <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Response Likelihood</div>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
            <Zap className="w-3.5 h-3.5 text-ai" /> Extremely High
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">ATS Alignment</div>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
            <Search className="w-3.5 h-3.5 text-text-secondary" /> Perfect Keyword Match
          </div>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BrainCircuit className="w-3.5 h-3.5" /> Explainability Engine
        </div>
        <div className="space-y-2">
          <p className="text-[11px] text-text-secondary flex items-start gap-2">
            <span className="text-ai mt-0.5">•</span>
            Candidate actively optimizing their resume for "Distributed Systems" and "React" this week.
          </p>
          <p className="text-[11px] text-text-secondary flex items-start gap-2">
            <span className="text-ai mt-0.5">•</span>
            Your role passes their strict strict $180k+ compensation blocklist.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-hairline flex justify-end">
        <button className="flex items-center gap-1 text-[11px] font-bold text-text-primary group-hover:text-ai transition-colors">
          View Operational Graph <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
