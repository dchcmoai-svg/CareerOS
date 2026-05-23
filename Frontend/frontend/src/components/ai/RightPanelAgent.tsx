"use client";

import React, { useState } from "react";
import { Sparkles, X, ChevronRight, Zap, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QuickSkillVerify } from "../identity/QuickSkillVerify";
import { SalaryPreferenceCard } from "../identity/SalaryPreferenceCard";
import { ResumeUploadTrigger } from "../identity/ResumeUploadTrigger";
import { useEcosystem } from "@/lib/EcosystemContext";
import { IntelligenceModule } from "../ecosystem/IntelligenceModule";
import { cn } from "@/lib/utils";
import { agent } from "@/lib/copy";

interface RightPanelAgentProps {
  isOpen: boolean;
  onClose: () => void;
  context: "discovery" | "tracker" | "ats" | "marketplace" | "global";
}

const CONTEXT_META = {
  discovery: { label: agent.title, status: "Helping with job matches", color: "text-intelligence" },
  tracker: { label: agent.title, status: "2 need follow-up · 1 interview", color: "text-warning" },
  ats: { label: agent.title, status: "14 ways to improve your resume", color: "text-ai" },
  marketplace: { label: agent.title, status: "3 recruiters active", color: "text-success" },
  global: { label: agent.title, status: "Ready to help", color: "text-ai" },
};

const SUGGESTED_ACTIONS: Record<string, { label: string; command: string }[]> = {
  discovery: [
    { label: "Show only strong matches", command: "filter strong" },
    { label: "Sort by response likelihood", command: "sort response" },
  ],
  tracker: [
    { label: "Draft follow-up for stalled apps", command: "followup" },
    { label: "Prep for upcoming interview", command: "prep interview" },
  ],
  ats: [
    { label: "Add more measurable impact", command: "improve impact" },
    { label: "Match keywords for a role", command: "keywords" },
  ],
  marketplace: [
    { label: "Review visibility settings", command: "visibility" },
    { label: "Who viewed my profile?", command: "views" },
  ],
  global: [
    { label: "What should I do today?", command: "priorities" },
    { label: "Summarize my job search", command: "summary" },
  ],
};

export function RightPanelAgent({ isOpen, onClose, context }: RightPanelAgentProps) {
  const { activeIntelligence } = useEcosystem();
  const [input, setInput] = useState("");
  const meta = CONTEXT_META[context];
  const actions = SUGGESTED_ACTIONS[context] || SUGGESTED_ACTIONS.global;

  const defaultInsight = agent.insights;

  const insight = activeIntelligence || defaultInsight[context];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-canvas/40 backdrop-blur-[2px] z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[380px] z-50 bg-surface-1 border-l border-hairline flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-md py-sm border-b border-hairline">
              <div className="flex items-center gap-sm">
                <div className="w-8 h-8 rounded-lg bg-ai/10 border border-ai/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-ai" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text-primary">{meta.label}</h2>
                  <p className={cn("text-[10px] font-medium", meta.color)}>{meta.status}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-surface-2 text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-md space-y-md">
              <IntelligenceModule title={agent.suggestionTitle} insight={insight} />

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                  {agent.quickActions}
                </span>
                {actions.map((action) => (
                  <button
                    key={action.command}
                    type="button"
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-hairline bg-surface-2/50 hover:bg-surface-2 text-left text-xs font-medium text-text-secondary hover:text-text-primary transition-colors group"
                  >
                    {action.label}
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>

              {context === "global" && (
                <div className="space-y-md pt-sm border-t border-hairline">
                  <QuickSkillVerify />
                  <SalaryPreferenceCard />
                  <ResumeUploadTrigger />
                </div>
              )}
            </div>

            <div className="p-md border-t border-hairline">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={agent.placeholder}
                  className="flex-1 bg-surface-2 border border-hairline rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-ai"
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-ai text-canvas rounded-lg hover:bg-ai-hover transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
