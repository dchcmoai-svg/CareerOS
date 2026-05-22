"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Clock, History, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export interface TrackerItemData {
  id: string;
  company: string;
  role: string;
  stage: "Applied" | "Interviewing" | "Offer" | "Rejected" | "Stalled";
  stageDays: number;
  lastInteraction: string;
  historicalVelocity: "Fast" | "Average" | "Slow";
}

interface TrackerItemCardProps {
  data: TrackerItemData;
  isDragging?: boolean;
  isSelected?: boolean;
}

export function TrackerItemCard({ data, isDragging = false, isSelected = false }: TrackerItemCardProps) {
  // Determine if the item is stalled relative to its stage
  const isStalled = data.stageDays > 7 && data.stage !== "Offer" && data.stage !== "Rejected";

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className={cn(
        "group w-full rounded-md border p-3 cursor-pointer transition-all duration-150 relative text-left",
        isSelected 
          ? "bg-surface-2 border-ai shadow-md ring-1 ring-ai" 
          : "bg-surface-1 border-hairline shadow-[0_1px_3px_rgba(0,0,0,0.2)] hover:border-border-strong hover:bg-surface-2"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-[13px] font-bold text-text-primary tracking-tight">{data.company}</h4>
        {isStalled && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-warning uppercase bg-warning/10 px-1.5 py-0.5 rounded border border-warning/20">
            <AlertCircle className="w-3 h-3" /> Stalled
          </div>
        )}
      </div>
      
      <p className="text-[11px] text-text-secondary font-medium mb-3">{data.role}</p>

      {/* Operational Metadata */}
      <div className="space-y-1.5 border-t border-hairline pt-2">
        
        {/* Stage Duration */}
        <div className="flex items-center justify-between text-[10px] font-medium text-text-tertiary">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> In Stage:
          </span>
          <span className={cn(
            isStalled ? "text-warning" : "text-text-secondary"
          )}>
            {data.stageDays} days
          </span>
        </div>

        {/* Last Interaction */}
        <div className="flex items-center justify-between text-[10px] font-medium text-text-tertiary">
          <span className="flex items-center gap-1.5">
            <History className="w-3 h-3" /> Last Touch:
          </span>
          <span className="text-text-secondary truncate max-w-[90px] text-right">
            {data.lastInteraction}
          </span>
        </div>

      </div>
    </motion.div>
  );
}
