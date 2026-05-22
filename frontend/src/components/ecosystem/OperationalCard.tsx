"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface OperationalCardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  accent?: "default" | "ai" | "warning" | "success" | "intelligence";
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  density?: "compact" | "default" | "rich";
}

const accentBorder = {
  default: "border-hairline",
  ai: "border-ai/20",
  warning: "border-warning/20",
  success: "border-success/20",
  intelligence: "border-intelligence/20",
};

const accentGlow = {
  default: "",
  ai: "shadow-[0_0_0_1px_rgba(118,132,240,0.08)]",
  warning: "shadow-[0_0_0_1px_rgba(255,200,87,0.08)]",
  success: "shadow-[0_0_0_1px_rgba(89,212,153,0.08)]",
  intelligence: "shadow-[0_0_0_1px_rgba(87,193,255,0.08)]",
};

export function OperationalCard({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-ai",
  accent = "default",
  children,
  footer,
  className,
  interactive = false,
  onClick,
  density = "default",
}: OperationalCardProps) {
  const padding = density === "compact" ? "p-sm" : density === "rich" ? "p-lg" : "p-md";

  return (
    <motion.div
      whileHover={interactive ? { y: -1 } : undefined}
      whileTap={interactive ? { scale: 0.995 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
      onClick={onClick}
      className={cn(
        "bg-surface-1 rounded-lg border relative overflow-hidden",
        accentBorder[accent],
        accentGlow[accent],
        interactive && "cursor-pointer hover:bg-surface-2 transition-colors duration-150",
        padding,
        className
      )}
    >
      {(title || Icon) && (
        <div className="flex items-start justify-between gap-sm mb-sm">
          <div>
            {title && (
              <h3 className="text-[13px] font-semibold text-text-primary tracking-tight">{title}</h3>
            )}
            {subtitle && (
              <p className="text-[11px] text-text-tertiary mt-0.5">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className={cn("w-7 h-7 rounded-md bg-surface-3 border border-hairline flex items-center justify-center flex-shrink-0", iconColor)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      )}
      <div className="relative">{children}</div>
      {footer && (
        <div className="mt-sm pt-sm border-t border-hairline">{footer}</div>
      )}
    </motion.div>
  );
}
