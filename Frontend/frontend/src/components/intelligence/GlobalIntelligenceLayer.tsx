"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCareerGraph } from "@/lib/career-graph";
import type { AccentDomain } from "@/lib/career-graph";

const dotColor: Record<AccentDomain, string> = {
  primary: "bg-primary",
  resume: "bg-resume",
  market: "bg-market",
  recruiter: "bg-recruiter",
  pipeline: "bg-intelligence",
  success: "bg-success",
  warning: "bg-warning",
};

export function GlobalIntelligenceLayer({ className }: { className?: string }) {
  const liveSignals = useCareerGraph((s) => s.liveSignals);
  const activeVariant = useCareerGraph((s) => s.getActiveResumeVariant());
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % liveSignals.length), 4800);
    return () => clearInterval(t);
  }, [liveSignals.length]);

  const primary = liveSignals[index] ?? liveSignals[0];
  const secondary = liveSignals.filter((_, i) => i !== index).slice(0, 2);

  if (!primary) return null;

  return (
    <div
      className={cn(
        "flex items-stretch gap-0 border-b border-hairline bg-surface-1/90 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex items-center gap-sm px-md py-2 flex-1 min-w-0 border-r border-hairline/60">
        <Activity className="w-3.5 h-3.5 text-ai shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary shrink-0">
          Live
        </span>
        <div className="flex-1 min-w-0 h-5 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={primary.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center gap-2 min-w-0"
            >
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor[primary.domain])} />
              {primary.href ? (
                <Link
                  href={primary.href}
                  className="text-[12px] text-text-secondary hover:text-text-primary truncate transition-colors"
                >
                  {primary.message}
                </Link>
              ) : (
                <p className="text-[12px] text-text-secondary truncate">{primary.message}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 px-md py-2 shrink-0">
        {secondary.map((s) => (
          <div key={s.id} className="flex items-center gap-1.5 max-w-[200px] min-w-0">
            <span className={cn("w-1 h-1 rounded-full shrink-0", dotColor[s.domain])} />
            <span className="text-[11px] text-text-tertiary truncate">{s.message}</span>
          </div>
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-1.5 px-md py-2 border-l border-hairline/60 shrink-0">
        <GitBranchDot />
        <span className="text-[11px] text-text-tertiary font-mono truncate max-w-[140px]">
          {activeVariant.branch}
        </span>
        <ChevronRight className="w-3 h-3 text-text-tertiary" />
      </div>
    </div>
  );
}

function GitBranchDot() {
  return <span className="w-1.5 h-1.5 rounded-full bg-resume shrink-0" />;
}
