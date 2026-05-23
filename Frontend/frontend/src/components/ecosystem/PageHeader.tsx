"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional one-line contextual hint (merged below subtitle, Linear-density) */
  guide?: string;
  actions?: React.ReactNode;
  telemetry?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, guide, actions, telemetry, className }: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className={cn("flex flex-col gap-md mb-lg", className)}
    >
      <div className="flex items-start justify-between gap-md">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary">{title}</h1>
          {subtitle && (
            <p className="text-[13px] text-text-secondary mt-1 max-w-2xl leading-relaxed">{subtitle}</p>
          )}
          {guide && (
            <p className="text-[12px] text-text-tertiary mt-2 max-w-2xl leading-relaxed border-l-2 border-ai/30 pl-sm">
              {guide}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-sm flex-shrink-0">{actions}</div>}
      </div>
      {telemetry}
    </motion.header>
  );
}
