"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Clock, GitBranch, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { springs } from "@/lib/motion";

export interface TrackerItemData {
  id: string;
  company: string;
  role: string;
  stage: "Applied" | "Interviewing" | "Offer" | "Rejected" | "Ghosted" | "Stalled";
  stageDays: number;
  lastInteraction: string;
  historicalVelocity: "Fast" | "Average" | "Slow";
  responseProbability: number;
  ghostRisk: "Low" | "Medium" | "High";
  resumeBranch: string;
  followUpIn: string;
  nextAction: string;
}

interface TrackerItemCardProps {
  data: TrackerItemData;
  isSelected?: boolean;
}

function ghostTone(risk: TrackerItemData["ghostRisk"]) {
  if (risk === "High") return "text-danger bg-danger/10 border-danger/20";
  if (risk === "Medium") return "text-warning bg-warning/10 border-warning/20";
  return "text-success bg-success/10 border-success/20";
}

export function TrackerItemCard({ data, isSelected = false }: TrackerItemCardProps) {
  const isStalled = data.stageDays > 7 && !["Offer", "Rejected", "Ghosted"].includes(data.stage);
  const responseGood = data.responseProbability >= 60;

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={springs.snappy}
      className={cn(
        "group w-full rounded-xl border p-3 cursor-pointer text-left relative overflow-hidden",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-shadow duration-200",
        isSelected
          ? "bg-surface-2 border-primary/40 ring-1 ring-primary/25"
          : "bg-surface-1 border-hairline hover:border-border-strong hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]"
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-0.5",
          responseGood ? "bg-success/80" : data.ghostRisk === "High" ? "bg-danger/80" : "bg-warning/80"
        )}
      />

      <div className="flex justify-between items-start gap-2 mb-1.5">
        <div className="min-w-0">
          <h4 className="text-[13px] font-semibold text-text-primary truncate">{data.company}</h4>
          <p className="text-[11px] text-text-secondary truncate">{data.role}</p>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold tabular-nums shrink-0 px-1.5 py-0.5 rounded border",
            responseGood ? "text-success bg-success/10 border-success/20" : "text-warning bg-warning/10 border-warning/20"
          )}
        >
          {data.responseProbability}%
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded border", ghostTone(data.ghostRisk))}>
          Ghost risk: {data.ghostRisk}
        </span>
        {isStalled && (
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded border text-warning bg-warning/10 border-warning/20 flex items-center gap-0.5">
            <AlertTriangle className="w-2.5 h-2.5" /> Stalled
          </span>
        )}
      </div>

      <div className="space-y-1.5 pt-2 border-t border-hairline/80 text-[10px]">
        <div className="flex justify-between text-text-tertiary">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> In stage
          </span>
          <span className={cn("font-medium tabular-nums", isStalled ? "text-warning" : "text-text-secondary")}>
            {data.stageDays}d
          </span>
        </div>
        <div className="flex justify-between text-text-tertiary">
          <span className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" /> Resume
          </span>
          <span className="text-resume font-mono truncate max-w-[120px] text-right">{data.resumeBranch}</span>
        </div>
        <div className="flex justify-between text-text-tertiary">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> Follow-up
          </span>
          <span className="text-text-secondary text-right truncate max-w-[130px]">{data.followUpIn}</span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-hairline/60 flex items-center justify-between">
        <span className="text-[10px] text-primary font-semibold">{data.nextAction}</span>
        <TrendingUp className="w-3 h-3 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
}
