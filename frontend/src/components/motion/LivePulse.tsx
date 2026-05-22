"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LivePulseProps {
  className?: string;
  tone?: "success" | "ai" | "warning";
}

const tones = {
  success: "bg-success",
  ai: "bg-ai",
  warning: "bg-warning",
};

export function LivePulse({ className, tone = "success" }: LivePulseProps) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      <span
        className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-60",
          tones[tone]
        )}
      />
      <span className={cn("relative inline-flex rounded-full h-2 w-2", tones[tone])} />
    </span>
  );
}
