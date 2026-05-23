"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerItem, springs } from "@/lib/motion";
import { LucideIcon } from "lucide-react";

export interface TelemetryMetric {
  label: string;
  value: string;
  sublabel?: string;
  status?: "neutral" | "success" | "warning" | "danger" | "intelligence";
  icon?: LucideIcon;
}

interface TelemetryStripProps {
  metrics: TelemetryMetric[];
  className?: string;
}

const statusStyles = {
  neutral: "text-text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  intelligence: "text-intelligence",
};

export function TelemetryStrip({ metrics, className }: TelemetryStripProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 6 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
      }}
      className={cn(
        "grid gap-px bg-hairline rounded-lg overflow-hidden border border-hairline",
        metrics.length === 2 && "grid-cols-2",
        metrics.length === 3 && "grid-cols-3",
        metrics.length >= 4 && "grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.label}
            variants={staggerItem}
            whileHover={{ y: -1 }}
            transition={springs.snappy}
            className="bg-surface-1 px-md py-sm flex flex-col gap-xxs group hover:bg-surface-2 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
                {metric.label}
              </span>
              {Icon && <Icon className="w-3 h-3 text-text-tertiary opacity-60 group-hover:opacity-100 transition-opacity" />}
            </div>
            <span className={cn("text-xl font-semibold tracking-tight tabular-nums", statusStyles[metric.status || "neutral"])}>
              {metric.value}
            </span>
            {metric.sublabel && (
              <span className="text-[11px] text-text-tertiary font-medium">{metric.sublabel}</span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
