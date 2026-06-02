"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Sparkles, Send, GitBranch, TrendingUp, AlertTriangle } from "lucide-react";
import type { ApplicationRecord } from "@/lib/career-graph";
import { springs } from "@/lib/motion";
import { tracker as copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface PipelineDetailPanelProps {
  item: ApplicationRecord;
  onClose: () => void;
}

export function PipelineDetailPanel({ item, onClose }: PipelineDetailPanelProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={springs.panel}
      className="w-full lg:w-[380px] shrink-0 flex flex-col rounded-xl border border-hairline bg-surface-1 surface-elevated overflow-hidden h-full max-h-[calc(100vh-220px)]"
    >
      <div className="flex items-start justify-between gap-2 p-md border-b border-hairline">
        <div>
          <h3 className="font-semibold text-base text-text-primary">{item.company}</h3>
          <p className="text-sm text-text-secondary">{item.role}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-surface-2 text-text-tertiary"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-md space-y-4 overflow-y-auto flex-1">
        <div className="grid grid-cols-2 gap-2">
          <MetricBox label={copy.responseProb} value={`${item.responseProbability}%`} tone="success" />
          <MetricBox label={copy.ghostRisk} value={item.ghostRisk} tone={item.ghostRisk === "High" ? "warning" : "neutral"} />
          <MetricBox label="Match score" value={`${item.matchScore}%`} tone="neutral" />
          <MetricBox label="Expected response" value={item.expectedResponseDate} tone="neutral" />
        </div>

        <div className="p-3 rounded-lg border border-hairline bg-surface-2/50 space-y-2 text-[12px]">
          <Row icon={GitBranch} label="Best resume version" value={item.resumeBranch} valueClass="text-resume font-mono" />
          <Row icon={TrendingUp} label="Company response pace" value={item.historicalVelocity} />
          <Row icon={AlertTriangle} label="Suggested timing" value={item.followUpIn} />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-2">
            Timeline
          </p>
          <div className="border-l border-hairline pl-4 space-y-4">
            <TimelineItem title="Latest activity" time="2d ago" body={item.lastInteraction} active />
            <TimelineItem
              title="Application sent"
              time={`${item.stageDays}d ago`}
              body={`Submitted with ${item.resumeBranch}`}
            />
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Suggested follow-up
          </div>
          <textarea
            readOnly
            value={`Hi — I wanted to follow up on my application for the ${item.role} role at ${item.company}. I'm still very interested and happy to share anything helpful for your review.`}
            className="w-full bg-surface-1 border border-hairline rounded-md p-2 text-[11px] text-text-secondary leading-relaxed resize-none min-h-[72px] focus:outline-none"
          />
          <button
            type="button"
            className="mt-2 w-full py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-semibold flex items-center justify-center gap-1.5"
          >
            Copy message <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

function MetricBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success" | "warning" | "neutral";
}) {
  const valueClass =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-text-primary";
  return (
    <div className="p-3 rounded-lg border border-hairline bg-surface-2/60">
      <p className="text-[10px] text-text-tertiary">{label}</p>
      <p className={cn("text-lg font-bold tabular-nums mt-0.5", valueClass)}>{value}</p>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between gap-2">
      <span className="flex items-center gap-1.5 text-text-tertiary">
        <Icon className="w-3.5 h-3.5 shrink-0" />
        {label}
      </span>
      <span className={cn("text-text-primary text-right font-medium", valueClass)}>{value}</span>
    </div>
  );
}

function TimelineItem({
  title,
  time,
  body,
  active,
}: {
  title: string;
  time: string;
  body: string;
  active?: boolean;
}) {
  return (
    <div className="relative">
      <div
        className={cn(
          "absolute -left-[17px] top-1 w-2 h-2 rounded-full border-2 border-surface-1",
          active ? "bg-primary" : "bg-surface-3"
        )}
      />
      <div className="flex justify-between gap-2">
        <span className="text-[12px] font-semibold text-text-primary">{title}</span>
        <span className="text-[10px] text-text-tertiary">{time}</span>
      </div>
      <p className="text-[11px] text-text-secondary mt-0.5">{body}</p>
    </div>
  );
}
