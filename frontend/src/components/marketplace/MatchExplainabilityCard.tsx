"use client";

import React from "react";
import { BrainCircuit, Search, Briefcase, Zap } from "lucide-react";

export function MatchExplainabilityCard() {
  return (
    <div className="w-full bg-surface-1 border border-hairline rounded-lg p-md mt-4 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-hairline">
        <BrainCircuit className="w-4 h-4 text-intelligence" />
        <h3 className="text-sm font-bold text-text-primary tracking-tight">Match Quality Rationale</h3>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3 items-start">
          <div className="mt-0.5 p-1.5 rounded bg-surface-2 border border-hairline">
            <Search className="w-3.5 h-3.5 text-text-secondary" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-text-primary">Search Pattern Overlap</h4>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              These recruiters explicitly queried "Distributed Systems" AND "React", which matches your active resume variant perfectly.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="mt-0.5 p-1.5 rounded bg-surface-2 border border-hairline">
            <Zap className="w-3.5 h-3.5 text-text-secondary" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-text-primary">Historical Velocity</h4>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              Enterprise Fintech recruiters typically extend interview requests within 48 hours for profiles with &gt;85% ATS alignment.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="mt-0.5 p-1.5 rounded bg-surface-2 border border-hairline">
            <Briefcase className="w-3.5 h-3.5 text-text-secondary" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-text-primary">Preferences Verified</h4>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              We confirmed these roles support remote work and meet your $180k+ base compensation threshold.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
