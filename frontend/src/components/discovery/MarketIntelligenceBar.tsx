"use client";

import React from "react";
import { TrendingUp, Users, Globe, Zap } from "lucide-react";

const SIGNALS = [
  { icon: TrendingUp, label: "Engineering demand", value: "+18%", tone: "text-success" },
  { icon: Users, label: "Recruiters active", value: "High this week", tone: "text-intelligence" },
  { icon: Globe, label: "Remote roles", value: "62%", tone: "text-text-primary" },
  { icon: Zap, label: "Fast hiring", value: "14 roles", tone: "text-ai" },
];

export function MarketIntelligenceBar() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-lg overflow-hidden border border-hairline mb-md">
      {SIGNALS.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="bg-surface-1 px-md py-sm flex items-center gap-sm">
            <Icon className={`w-4 h-4 ${s.tone} opacity-80`} />
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary block">
                {s.label}
              </span>
              <span className={`text-sm font-semibold tabular-nums ${s.tone}`}>{s.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
