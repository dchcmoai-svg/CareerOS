"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion";
import type { AccentDomain } from "@/lib/mission-control";

const domainStyles: Record<
  AccentDomain,
  { border: string; glow: string; icon: string; bar: string }
> = {
  primary: {
    border: "border-primary/25 hover:border-primary/40",
    glow: "group-hover:shadow-[0_0_24px_-8px_rgba(59,130,246,0.35)]",
    icon: "text-primary bg-primary/10 border-primary/20",
    bar: "bg-primary",
  },
  resume: {
    border: "border-resume/25 hover:border-resume/40",
    glow: "group-hover:shadow-[0_0_24px_-8px_rgba(139,92,246,0.3)]",
    icon: "text-resume bg-resume/10 border-resume/20",
    bar: "bg-resume",
  },
  market: {
    border: "border-market/25 hover:border-market/40",
    glow: "group-hover:shadow-[0_0_24px_-8px_rgba(6,182,212,0.3)]",
    icon: "text-market bg-market/10 border-market/20",
    bar: "bg-market",
  },
  recruiter: {
    border: "border-recruiter/25 hover:border-recruiter/40",
    glow: "group-hover:shadow-[0_0_24px_-8px_rgba(236,72,153,0.28)]",
    icon: "text-recruiter bg-recruiter/10 border-recruiter/20",
    bar: "bg-recruiter",
  },
  pipeline: {
    border: "border-intelligence/25 hover:border-intelligence/40",
    glow: "group-hover:shadow-[0_0_24px_-8px_rgba(87,193,255,0.28)]",
    icon: "text-intelligence bg-intelligence/10 border-intelligence/20",
    bar: "bg-intelligence",
  },
  success: {
    border: "border-success/25 hover:border-success/40",
    glow: "group-hover:shadow-[0_0_24px_-8px_rgba(34,197,94,0.25)]",
    icon: "text-success bg-success/10 border-success/20",
    bar: "bg-success",
  },
  warning: {
    border: "border-warning/25 hover:border-warning/40",
    glow: "group-hover:shadow-[0_0_24px_-8px_rgba(245,158,11,0.28)]",
    icon: "text-warning bg-warning/10 border-warning/20",
    bar: "bg-warning",
  },
};

interface IntelligenceCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  domain?: AccentDomain;
  href?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  progress?: number;
}

export function IntelligenceCard({
  title,
  subtitle,
  icon: Icon,
  domain = "primary",
  href,
  footer,
  children,
  className,
  progress,
}: IntelligenceCardProps) {
  const styles = domainStyles[domain];
  const router = useRouter();

  const inner = (
    <motion.div
      whileHover={{ y: -2 }}
      transition={springs.snappy}
      className={cn(
        "group relative flex flex-col h-full rounded-xl border bg-surface-1 p-md transition-shadow duration-200",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        styles.border,
        styles.glow,
        href && "cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between gap-sm mb-sm">
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-text-primary tracking-tight">{title}</h3>
          {subtitle && (
            <p className="text-[11px] text-text-tertiary mt-0.5 leading-snug">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "w-8 h-8 rounded-lg border flex items-center justify-center shrink-0",
              styles.icon
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
        {href && (
          <ArrowUpRight className="w-3.5 h-3.5 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        )}
      </div>

      <div className="flex-1">{children}</div>

      {progress !== undefined && (
        <div className="mt-sm h-1 w-full bg-surface-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={cn("h-full rounded-full", styles.bar)}
          />
        </div>
      )}

      {footer && <div className="mt-sm pt-sm border-t border-hairline">{footer}</div>}
    </motion.div>
  );

  if (href) {
    return (
      <div
        role="link"
        tabIndex={0}
        onClick={() => router.push(href)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            router.push(href);
          }
        }}
      >
        {inner}
      </div>
    );
  }
  return inner;
}
