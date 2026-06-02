"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AMBIENT_SIGNALS, type AccentDomain } from "@/lib/mission-control";

const dotColor: Record<AccentDomain, string> = {
  primary: "bg-primary",
  resume: "bg-resume",
  market: "bg-market",
  recruiter: "bg-recruiter",
  pipeline: "bg-intelligence",
  success: "bg-success",
  warning: "bg-warning",
};

export function AmbientIntelligenceStrip({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % AMBIENT_SIGNALS.length), 5200);
    return () => clearInterval(t);
  }, []);

  const signal = AMBIENT_SIGNALS[index];

  return (
    <div
      className={cn(
        "flex items-center gap-sm px-md py-2 border-b border-hairline bg-surface-1/80 backdrop-blur-sm",
        className
      )}
    >
      <Sparkles className="w-3.5 h-3.5 text-ai shrink-0 opacity-80" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary shrink-0">
        Live
      </span>
      <div className="flex-1 min-w-0 h-5 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={signal.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="text-[12px] text-text-secondary truncate absolute inset-0 flex items-center gap-2"
          >
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor[signal.domain])} />
            {signal.message}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
