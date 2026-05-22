"use client";

import React from "react";
import { OpportunityData } from "./OpportunityCard";

interface OpportunityCompareStripProps {
  jobs: OpportunityData[];
}

export function OpportunityCompareStrip({ jobs }: OpportunityCompareStripProps) {
  const top = [...jobs].sort((a, b) => b.fitScore - a.fitScore).slice(0, 3);
  if (top.length < 2) return null;

  return (
    <div className="mb-md p-sm bg-surface-1 border border-hairline rounded-lg">
      <span className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary block mb-sm">
        Top matches compared
      </span>
      <div className="grid grid-cols-3 gap-px bg-hairline rounded overflow-hidden">
        {top.map((j) => (
          <div key={j.id} className="bg-surface-2/50 px-sm py-xs text-center">
            <span className="text-[11px] font-bold text-text-primary block truncate">{j.company}</span>
            <span className="text-[10px] text-ai font-mono tabular-nums">{j.fitScore}%</span>
            <span className="text-[9px] text-text-tertiary block">{100 - j.ghostScore}% response</span>
          </div>
        ))}
      </div>
    </div>
  );
}
