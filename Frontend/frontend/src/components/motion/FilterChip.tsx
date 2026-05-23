"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={springs.snappy}
      className={cn(
        "relative px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
        active
          ? "text-ai border-ai/30"
          : "bg-surface-2 text-text-secondary border-hairline hover:border-border-strong hover:text-text-primary"
      )}
    >
      {active && (
        <motion.span
          layoutId="filter-chip-bg"
          className="absolute inset-0 rounded-full bg-ai/15 border border-ai/25"
          transition={springs.panel}
        />
      )}
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}
