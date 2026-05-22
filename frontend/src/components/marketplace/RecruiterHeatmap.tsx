"use client";

import React from "react";
import { Users, TrendingUp } from "lucide-react";

export function RecruiterHeatmap() {
  const heatNodes = [
    { region: "FinTech", location: "SF", level: "high", val: 92 },
    { region: "DevTools", location: "Remote", level: "high", val: 96 },
    { region: "AI Platforms", location: "SF", level: "high", val: 88 },
    { region: "SaaS", location: "Seattle", level: "medium", val: 64 },
    { region: "Crypto", location: "Remote", level: "low", val: 24 },
    { region: "Cybersecurity", location: "NYC", level: "medium", val: 56 }
  ];

  return (
    <div className="w-full bg-surface-1 border border-hairline rounded-lg p-md mt-4 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-hairline/60">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-ai" />
          <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Demand Telemetry Heatmap</h3>
        </div>
        <span className="text-[9px] font-mono text-text-tertiary">Updated: Just now</span>
      </div>

      <div className="grid grid-cols-2 gap-sm">
        {heatNodes.map((node, i) => (
          <div key={i} className="bg-surface-2/60 border border-hairline/50 p-2.5 rounded flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-text-primary block">{node.region}</span>
              <span className="text-[10px] text-text-tertiary">{node.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-12 bg-surface-3 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    node.level === "high" ? "bg-success" : node.level === "medium" ? "bg-warning" : "bg-text-tertiary"
                  }`} 
                  style={{ width: `${node.val}%` }} 
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-text-secondary">{node.val}%</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 flex items-center justify-between text-[10px] text-text-tertiary font-medium">
        <span>Average Recruiter Alignment: <strong className="text-success">Optimal (84%)</strong></span>
        <span className="flex items-center gap-0.5 text-success"><TrendingUp className="w-3 h-3" /> +12% Surge</span>
      </div>
    </div>
  );
}
