"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type GuideVariant = "default" | "compact" | "tip";

interface ContextualGuideProps {
  title?: string;
  body: string;
  variant?: GuideVariant;
  className?: string;
}

const icons = {
  default: Info,
  compact: Info,
  tip: Lightbulb,
};

export function ContextualGuide({
  title,
  body,
  variant = "default",
  className,
}: ContextualGuideProps) {
  const Icon = variant === "tip" ? Sparkles : icons[variant];

  if (variant === "compact") {
    return (
      <p className={cn("text-[12px] text-text-secondary leading-relaxed", className)}>
        {body}
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-lg border border-hairline bg-surface-1/80 p-md flex gap-sm",
        variant === "tip" && "border-ai/20 bg-ai/5",
        className
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg border border-hairline flex items-center justify-center shrink-0",
          variant === "tip" ? "bg-ai/10 border-ai/20" : "bg-surface-2"
        )}
      >
        <Icon className={cn("w-4 h-4", variant === "tip" ? "text-ai" : "text-text-tertiary")} />
      </div>
      <div className="min-w-0">
        {title && (
          <p className="text-[13px] font-semibold text-text-primary mb-0.5">{title}</p>
        )}
        <p className="text-[12px] text-text-secondary leading-relaxed">{body}</p>
      </div>
    </motion.div>
  );
}

interface ScoreHintProps {
  label: string;
  value: string;
  hint: string;
  tone?: "success" | "warning" | "neutral";
  className?: string;
}

export function ScoreHint({ label, value, hint, tone = "neutral", className }: ScoreHintProps) {
  const valueTone = {
    success: "text-success",
    warning: "text-warning",
    neutral: "text-text-primary",
  };

  return (
    <div className={cn("bg-surface-2/80 border border-hairline/60 p-3 rounded-lg", className)}>
      <p className="text-[10px] text-text-tertiary font-medium">{label}</p>
      <p className={cn("text-lg font-bold mt-0.5 tabular-nums", valueTone[tone])}>{value}</p>
      <p className="text-[10px] text-text-tertiary mt-1.5 leading-snug">{hint}</p>
    </div>
  );
}
