"use client";

import React, { useState } from "react";
import { DollarSign, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function SalaryPreferenceCard() {
  const [salary, setSalary] = useState(120000);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    // In real app, trigger server action to update OpportunityPreferences
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-surface-1 border border-hairline rounded-lg p-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-intelligence" />
          <span className="text-sm font-semibold text-text-primary">Target Compensation</span>
        </div>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="flex items-center gap-1 text-success text-xs font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Saved to Graph
          </motion.div>
        )}
      </div>

      <p className="text-xs text-text-secondary mb-4">
        Set your baseline. We will automatically filter out opportunities below this threshold to protect your time.
      </p>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xl font-bold text-text-primary">
          ${(salary / 1000).toFixed(0)}k+
        </span>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">
          Base USD
        </span>
      </div>

      <input
        type="range"
        min="60000"
        max="300000"
        step="5000"
        value={salary}
        onChange={(e) => {
          setSalary(Number(e.target.value));
          setIsSaved(false);
        }}
        className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-intelligence mb-4 outline-none"
      />

      <button
        onClick={handleSave}
        disabled={isSaved}
        className="w-full py-2 bg-surface-2 hover:bg-surface-3 text-text-primary text-[13px] font-medium rounded-md transition-all duration-75 active:scale-[0.98] border border-hairline shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]"
      >
        {isSaved ? "Updated" : "Confirm Threshold"}
      </button>
    </div>
  );
}
