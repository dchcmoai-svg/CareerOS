"use client";

import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { TrackerItemCard, TrackerItemData } from "./TrackerItemCard";
import { PIPELINE_COLUMNS } from "@/lib/pipeline-data";
import { cn } from "@/lib/utils";

interface TrackerBoardProps {
  items: TrackerItemData[];
  onSelectCard?: (item: TrackerItemData) => void;
  selectedId?: string;
}

export function TrackerBoard({ items, onSelectCard, selectedId }: TrackerBoardProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 h-full min-h-[420px]">
      {PIPELINE_COLUMNS.map((col) => {
        const colItems = items.filter((i) => i.stage === col.id);

        return (
          <div key={col.id} className="flex flex-col w-[min(100%,300px)] min-w-[280px] shrink-0">
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className={cn("w-1 h-4 rounded-full", col.bar)} />
              <h3 className={cn("text-[11px] font-bold uppercase tracking-wider", col.accent)}>
                {col.label}
              </h3>
              <span className="text-[10px] font-bold text-text-tertiary bg-surface-2 px-1.5 py-0.5 rounded-md border border-hairline tabular-nums">
                {colItems.length}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-2 rounded-xl border border-hairline bg-surface-1/60 p-2 min-h-[360px]">
              {colItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-hairline/80 rounded-lg">
                  <p className="text-[12px] text-text-tertiary leading-relaxed">
                    {col.id === "Ghosted"
                      ? "Roles that stopped responding land here — so you focus energy elsewhere."
                      : `No applications in ${col.label.toLowerCase()} yet.`}
                  </p>
                  {col.id === "Applied" && (
                    <button
                      type="button"
                      className="mt-3 text-[11px] font-semibold text-primary flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add from jobs
                    </button>
                  )}
                </div>
              ) : (
                colItems.map((item) => (
                  <div key={item.id} onClick={() => onSelectCard?.(item)}>
                    <TrackerItemCard data={item} isSelected={selectedId === item.id} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
