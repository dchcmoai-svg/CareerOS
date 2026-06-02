"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Layers,
  FolderGit2,
  Briefcase,
  FileText,
  KanbanSquare,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCareerGraph } from "@/lib/career-graph";
import type { GraphNode } from "@/lib/career-graph";
import { staggerContainer, staggerItem } from "@/lib/motion";

const NODE_META: Record<
  GraphNode["type"],
  { icon: React.ElementType; ring: string; dot: string }
> = {
  profile: { icon: User, ring: "border-primary/40", dot: "bg-primary" },
  skills: { icon: Layers, ring: "border-resume/40", dot: "bg-resume" },
  projects: { icon: FolderGit2, ring: "border-ai/40", dot: "bg-ai" },
  experience: { icon: Briefcase, ring: "border-intelligence/40", dot: "bg-intelligence" },
  resume: { icon: FileText, ring: "border-resume/40", dot: "bg-resume" },
  applications: { icon: KanbanSquare, ring: "border-warning/40", dot: "bg-warning" },
  market: { icon: TrendingUp, ring: "border-market/40", dot: "bg-market" },
};

export function ProfessionalGraphView({ className }: { className?: string }) {
  const graphNodes = useCareerGraph((s) => s.graphNodes);
  const activeVariant = useCareerGraph((s) => s.getActiveResumeVariant());

  const center = graphNodes.find((n) => n.type === "profile");
  const orbit = graphNodes.filter((n) => n.type !== "profile");

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={cn("rounded-xl border border-hairline bg-surface-1 p-md", className)}
    >
      <div className="mb-md">
        <h3 className="text-sm font-semibold text-text-primary">Professional graph</h3>
        <p className="text-[12px] text-text-tertiary mt-1">
          CareerOS connects profile, skills, resumes, applications, and market signals into one
          knowledge graph — active variant:{" "}
          <span className="font-mono text-resume">{activeVariant.branch}</span>
        </p>
      </div>

      <div className="relative min-h-[280px] flex items-center justify-center">
        {center && (
          <motion.div
            variants={staggerItem}
            className="absolute z-10 flex flex-col items-center"
          >
            <div
              className={cn(
                "w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center bg-surface-2",
                NODE_META.profile.ring
              )}
            >
              <User className="w-6 h-6 text-primary" />
            </div>
            <p className="text-[11px] font-semibold mt-2">{center.label}</p>
            <p className="text-[10px] text-text-tertiary">{center.sublabel}</p>
          </motion.div>
        )}

        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" aria-hidden>
          <circle cx="50%" cy="50%" r="38%" fill="none" stroke="currentColor" className="text-hairline" strokeDasharray="4 6" />
          <circle cx="50%" cy="50%" r="28%" fill="none" stroke="currentColor" className="text-hairline/60" strokeDasharray="2 8" />
        </svg>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-2xl relative z-[1] pt-4">
          {orbit.map((node, i) => {
            const meta = NODE_META[node.type];
            const Icon = meta.icon;
            return (
              <motion.div
                key={node.id}
                variants={staggerItem}
                custom={i}
                className={cn(
                  "rounded-lg border bg-surface-2/80 p-3 flex flex-col gap-1",
                  meta.ring
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} />
                  <Icon className="w-3.5 h-3.5 text-text-secondary" />
                  <span className="text-[12px] font-medium text-text-primary">{node.label}</span>
                </div>
                {node.sublabel && (
                  <p className="text-[10px] text-text-tertiary pl-3.5">{node.sublabel}</p>
                )}
                <p className="text-[10px] text-text-tertiary pl-3.5">
                  Linked to {node.connections.length} nodes
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
