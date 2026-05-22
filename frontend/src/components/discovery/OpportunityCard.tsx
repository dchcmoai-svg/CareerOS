"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { premiumCardHover, layoutSpring } from "@/lib/motion";
import { jobs as jobsCopy } from "@/lib/copy";
import {
  Building2,
  MapPin,
  DollarSign,
  Globe,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Sparkles,
  Clock,
  ExternalLink,
} from "lucide-react";

export interface OpportunityData {
  id: string;
  role: string;
  company: string;
  location: string;
  compensation: string;
  remote: boolean;
  sponsorshipRealism: "High" | "Low" | "Unknown";
  fitScore: number;
  ghostScore: number;
  hiringVelocity: "Fast" | "Slow" | "Stalled" | "Steady";
  applicationDifficulty: "Easy" | "Medium" | "High";
  aiRationale: string;
  url?: string;
  postedAt?: string | null;
  category?: string;
  source?: string;
}

interface OpportunityCardProps {
  data: OpportunityData;
  isFocused: boolean;
  onExpand?: () => void;
}

function formatPosted(postedAt?: string | null) {
  if (!postedAt) return null;
  try {
    const d = new Date(postedAt);
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days === 0) return "Posted today";
    if (days === 1) return "Posted yesterday";
    return `Posted ${days}d ago`;
  } catch {
    return null;
  }
}

export function OpportunityCard({ data, isFocused, onExpand }: OpportunityCardProps) {
  const responsePct = Math.max(5, 100 - data.ghostScore);
  const posted = formatPosted(data.postedAt);
  const isStrongMatch = data.fitScore >= 85;
  const responseGood = data.ghostScore < 40;

  return (
    <motion.article
      onClick={onExpand}
      {...premiumCardHover}
      transition={layoutSpring}
      className={cn(
        "group w-full rounded-xl border p-4 cursor-pointer text-left relative overflow-hidden",
        isFocused
          ? "bg-surface-2 border-border-strong shadow-md ring-1 ring-ai/20 glow-border-subtle"
          : "bg-surface-1 border-hairline"
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 right-0 w-28 opacity-[0.07] blur-2xl pointer-events-none",
          responseGood ? "bg-success" : data.ghostScore > 65 ? "bg-danger" : "bg-warning",
          isFocused ? "opacity-[0.12]" : "opacity-0 group-hover:opacity-[0.07]"
        )}
      />

      <div className="flex justify-between items-start mb-3 relative z-10 gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "text-base font-bold tracking-tight truncate",
              isFocused ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"
            )}
          >
            {data.role}
          </h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-text-tertiary">
            <span className="flex items-center gap-1 font-medium">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              {data.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {data.location}
            </span>
            {data.compensation !== "Salary not listed" && (
              <span className="flex items-center gap-1 text-text-secondary">
                <DollarSign className="w-3.5 h-3.5 shrink-0" />
                {data.compensation}
              </span>
            )}
            {posted && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 shrink-0" />
                {posted}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border",
              isStrongMatch
                ? "bg-success/10 text-success border-success/25"
                : "bg-surface-3 text-text-primary border-hairline"
            )}
          >
            <Sparkles className="w-3 h-3 text-ai" />
            {data.fitScore}% {isStrongMatch ? jobsCopy.strongMatch : jobsCopy.resumeFits}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3 relative z-10">
        {data.remote && (
          <span className="text-[11px] font-medium text-text-secondary bg-surface-3/80 px-2 py-1 rounded-md border border-hairline/60">
            <Globe className="w-3 h-3 inline mr-1 opacity-70" />
            Remote
          </span>
        )}

        <span
          className={cn(
            "text-[11px] font-medium px-2 py-1 rounded-md border",
            responseGood
              ? "text-success bg-success/10 border-success/20"
              : "text-warning bg-warning/10 border-warning/20"
          )}
        >
          {responsePct}% {jobsCopy.responseLikelihood}
        </span>

        <span className="text-[11px] font-medium text-text-secondary bg-surface-3/80 px-2 py-1 rounded-md border border-hairline/60">
          <Activity className="w-3 h-3 inline mr-1 opacity-70" />
          {data.hiringVelocity === "Fast"
            ? jobsCopy.recruiterActive
            : `${jobsCopy.hiringPace}: ${data.hiringVelocity}`}
        </span>

        {data.sponsorshipRealism !== "Unknown" && (
          <span
            className={cn(
              "text-[11px] font-medium px-2 py-1 rounded-md border",
              data.sponsorshipRealism === "High"
                ? "text-success bg-success/10 border-success/20"
                : "text-text-tertiary bg-surface-3/50 border-hairline/60"
            )}
          >
            <ShieldCheck className="w-3 h-3 inline mr-1" />
            {jobsCopy.sponsorship}: {data.sponsorshipRealism}
          </span>
        )}
      </div>

      <div className="pt-3 border-t border-hairline/80 flex items-start justify-between gap-2 relative z-10">
        <p className="text-[13px] text-text-secondary leading-relaxed line-clamp-2 flex-1">
          {data.aiRationale}
        </p>
        {data.url && isFocused && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 p-1.5 rounded-md hover:bg-surface-3 text-text-tertiary hover:text-ai transition-colors"
            title={jobsCopy.viewRole}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.article>
  );
}
