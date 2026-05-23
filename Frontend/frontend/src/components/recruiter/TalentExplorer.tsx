"use client";

import React from "react";
import { CandidateMatchCard } from "./CandidateMatchCard";
import { SlidersHorizontal, ListFilter } from "lucide-react";

export function TalentExplorer() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-text-primary tracking-tight">Intelligence Graph</h2>
          <p className="text-[11px] text-text-secondary mt-0.5">Surfacing candidates based on response probability and ATS alignment.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-2 border border-hairline text-text-secondary text-[12px] font-medium hover:bg-surface-3 transition-colors active:scale-[0.98]">
            <ListFilter className="w-3.5 h-3.5" /> High Probability
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-2 border border-hairline text-text-secondary text-[12px] font-medium hover:bg-surface-3 transition-colors active:scale-[0.98]">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Match Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* We would map through candidate matches here */}
        <CandidateMatchCard />
        
        <div className="w-full bg-surface-1 border border-hairline rounded-lg p-4 hover:bg-surface-2 transition-colors cursor-pointer group shadow-sm opacity-70">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-text-primary tracking-tight">Sarah J.</h3>
              <p className="text-[12px] text-text-secondary font-medium">Backend Engineer</p>
            </div>
            <div className="bg-warning/10 border border-warning/20 text-warning text-[11px] font-bold px-2 py-1 rounded">
              52% Probability
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-hairline">
            <div>
              <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Response Likelihood</div>
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
                 Low Activity
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">ATS Alignment</div>
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
                 Missing Rust keywords
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
