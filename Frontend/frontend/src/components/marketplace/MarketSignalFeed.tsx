"use client";

import React from "react";
import { Activity, BrainCircuit, Users, CheckCircle2 } from "lucide-react";

export function MarketSignalFeed() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-text-primary tracking-tight">Market Intelligence</h2>
        <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider bg-surface-2 px-2 py-1 rounded border border-hairline">
          Live Sync
        </span>
      </div>

      <div className="relative border-l-2 border-surface-3 ml-3 space-y-6 pb-4">
        
        {/* Signal Item */}
        <div className="relative pl-6">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-ai border-[3px] border-canvas shadow-sm" />
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-ai uppercase tracking-wider">Opportunity Surge</span>
            <span className="text-[10px] text-text-tertiary">2 hours ago</span>
          </div>
          <div className="bg-surface-1 border border-hairline rounded-md p-3 mt-2 hover:bg-surface-2 transition-colors">
            <h4 className="text-[13px] font-bold text-text-primary mb-1">High Demand for React + Rust</h4>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Recruiter searches for your exact tech stack combo have surged 18% in the Series B infrastructure space this week.
            </p>
          </div>
        </div>

        {/* Signal Item */}
        <div className="relative pl-6">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface-3 border-[3px] border-canvas shadow-sm" />
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Profile Variant Impact</span>
            <span className="text-[10px] text-text-tertiary">Yesterday</span>
          </div>
          <div className="bg-surface-1 border border-hairline rounded-md p-3 mt-2 hover:bg-surface-2 transition-colors">
            <h4 className="text-[13px] font-bold text-text-primary mb-1">ATS Optimization Success</h4>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Since activating your `feature/stripe-frontend` resume variant, your visibility to enterprise Fintech recruiters increased by 32%.
            </p>
          </div>
        </div>

        {/* Signal Item */}
        <div className="relative pl-6">
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-success border-[3px] border-canvas shadow-sm" />
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-success uppercase tracking-wider">Graph Match</span>
            <span className="text-[10px] text-text-tertiary">2 days ago</span>
          </div>
          <div className="bg-surface-1 border border-hairline rounded-md p-3 mt-2 hover:bg-surface-2 transition-colors cursor-pointer active:scale-[0.98]">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-[13px] font-bold text-text-primary mb-1">3 Enterprise Recruiters Searching</h4>
                <p className="text-[12px] text-text-secondary leading-relaxed">
                  Recruiters matching your strict salary and geo preferences surfaced your profile.
                </p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
            </div>
            <div className="mt-3 text-[11px] font-bold text-text-primary bg-surface-3 inline-block px-2 py-1 rounded border border-hairline">
              View Match Explainability
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
