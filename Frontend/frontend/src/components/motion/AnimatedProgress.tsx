"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion";

interface AnimatedProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  delay?: number;
}

export function AnimatedProgress({
  value,
  className,
  barClassName = "bg-success",
  delay = 0,
}: AnimatedProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("h-1.5 w-full bg-surface-3 rounded-full overflow-hidden", className)}>
      <motion.div
        className={cn("h-full rounded-full", barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ ...springs.gentle, delay }}
      />
    </div>
  );
}
