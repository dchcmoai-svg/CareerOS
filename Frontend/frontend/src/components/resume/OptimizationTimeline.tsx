"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitCommit, TrendingUp, AlertTriangle } from "lucide-react";

const EVENTS = [
  { type: "commit", label: "Branch created", detail: "feature/stripe-frontend", time: "2d ago" },
  { type: "warning", label: "ATS diagnostic", detail: "Weak verb on RSC bullet", time: "1d ago" },
  { type: "gain", label: "Score improvement", detail: "78% → 82% after keyword add", time: "4h ago" },
];

export function OptimizationTimeline() {
  return (
    <div className="bg-surface-1 border-l border-hairline w-[220px] flex-shrink-0 flex flex-col">
      <div className="px-sm py-sm border-b border-hairline">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
          Optimization Timeline
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-sm space-y-md">
        {EVENTS.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative pl-4 border-l border-hairline"
          >
            <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-surface-3 border border-hairline" />
            {e.type === "commit" && <GitCommit className="w-3 h-3 text-ai mb-1" />}
            {e.type === "warning" && <AlertTriangle className="w-3 h-3 text-warning mb-1" />}
            {e.type === "gain" && <TrendingUp className="w-3 h-3 text-success mb-1" />}
            <span className="text-[11px] font-semibold text-text-primary block">{e.label}</span>
            <span className="text-[10px] text-text-tertiary block">{e.detail}</span>
            <span className="text-[9px] text-text-tertiary font-mono mt-0.5 block">{e.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
