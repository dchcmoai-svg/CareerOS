"use client";

import React, { useState } from "react";
import { GitBranch, ChevronDown, Check, GitCommit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VersionControlStripProps {
  activeBranch: string;
  onChangeBranch: (branch: string) => void;
  hint?: string;
}

export function VersionControlStrip({ activeBranch, onChangeBranch, hint }: VersionControlStripProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const branches = [
    "feature/stripe-frontend",
    "feature/staff-generalist"
  ];

  return (
    <div className="flex items-center justify-between px-lg py-3 border-b border-hairline bg-surface-1 z-30 relative select-none">
      <div className="flex items-center gap-4">
        {/* Branch Selector */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-2 border border-hairline hover:bg-surface-3 transition-colors active:scale-[0.98]"
          >
            <GitBranch className="w-4 h-4 text-text-secondary" />
            <span className="text-[13px] font-mono font-bold text-text-primary">{activeBranch}</span>
            <ChevronDown className="w-3.5 h-3.5 text-text-tertiary ml-1" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.1 }}
                className="absolute left-0 mt-1 w-56 bg-surface-1 border border-hairline rounded-md shadow-xl z-50 p-1"
              >
                {branches.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      onChangeBranch(b);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-mono rounded hover:bg-surface-2 transition-colors ${
                      activeBranch === b ? "text-ai font-bold bg-surface-2/40" : "text-text-secondary"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sync Status */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-tertiary">
          <Check className="w-3.5 h-3.5 text-success" /> Saved across your job search
        </div>
        {hint && (
          <p className="hidden xl:block text-[11px] text-text-tertiary max-w-md truncate border-l border-hairline pl-3 ml-1">
            {hint}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-text-secondary bg-surface-2 px-2 py-1 rounded font-mono">
          <GitCommit className="w-3.5 h-3.5" /> {activeBranch === "feature/stripe-frontend" ? "14" : "8"} optimizations
        </span>
        <button className="text-[13px] font-semibold bg-text-primary text-canvas px-4 py-1.5 rounded-md hover:bg-text-secondary transition-colors active:scale-[0.98]">
          Export PDF
        </button>
      </div>
    </div>
  );
}
