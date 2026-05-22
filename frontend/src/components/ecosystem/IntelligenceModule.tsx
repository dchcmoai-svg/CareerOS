"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntelligenceModuleProps {
  title?: string;
  insight: string;
  action?: { label: string; onClick?: () => void };
  variant?: "ai" | "warning" | "neutral";
  className?: string;
}

export function IntelligenceModule({
  title = "Tip",
  insight,
  action,
  variant = "ai",
  className,
}: IntelligenceModuleProps) {
  const accentBar = {
    ai: "bg-ai/60",
    warning: "bg-warning/60",
    neutral: "bg-text-tertiary/40",
  };

  const labelColor = {
    ai: "text-ai",
    warning: "text-warning",
    neutral: "text-text-tertiary",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "bg-surface-2 border border-hairline rounded-lg p-sm relative overflow-hidden group",
        className
      )}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-0.5", accentBar[variant])} />
      <div className={cn("flex items-center gap-1.5 mb-1.5 font-bold text-[10px] uppercase tracking-widest pl-1", labelColor[variant])}>
        <Lightbulb className="w-3 h-3" />
        {title}
      </div>
      <p className="text-text-primary text-[12px] font-medium leading-relaxed tracking-tight pl-1">
        {insight}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 pl-1 flex items-center gap-1 text-[11px] font-semibold text-ai hover:text-ai-hover transition-colors group/btn"
        >
          {action.label}
          <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      )}
    </motion.div>
  );
}
