"use client";

import React from "react";
import { TrackerItemCard, TrackerItemData } from "./TrackerItemCard";

const COLUMNS = ["Applied", "Interviewing", "Offer", "Rejected"];

interface TrackerBoardProps {
  items: TrackerItemData[];
  onSelectCard?: (item: TrackerItemData) => void;
  selectedId?: string;
}

export function TrackerBoard({ items, onSelectCard, selectedId }: TrackerBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full scrollbar-hide">
      {COLUMNS.map((colName) => {
        const colItems = items.filter((i) => i.stage === colName);
        
        return (
          <div key={colName} className="flex-1 min-w-[280px] max-w-[320px] flex flex-col">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{colName}</h3>
                <span className="text-[10px] font-bold text-text-tertiary bg-surface-2 px-1.5 py-0.5 rounded-full border border-hairline">
                  {colItems.length}
                </span>
              </div>
            </div>

            {/* Column Body */}
            <div className="flex-1 flex flex-col gap-2 bg-surface-1/50 rounded-lg p-2 border border-hairline/50 overflow-y-auto">
              {colItems.map((item) => (
                <div key={item.id} onClick={() => onSelectCard?.(item)}>
                  <TrackerItemCard data={item} isSelected={selectedId === item.id} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
