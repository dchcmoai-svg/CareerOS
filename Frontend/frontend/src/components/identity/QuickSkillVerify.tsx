"use client";

import React, { useState } from "react";
import { Check, X, Code, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuickSkillVerifyProps {
  inferredSkills: string[];
  source?: "github" | "linkedin" | "resume";
  onComplete?: () => void;
}

export function QuickSkillVerify({ inferredSkills, source = "github", onComplete }: QuickSkillVerifyProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  const handleAction = (skill: string, action: "accept" | "reject") => {
    if (action === "accept") {
      setAccepted([...accepted, skill]);
    } else {
      setRejected([...rejected, skill]);
    }
    
    // If all skills are processed, auto-dismiss
    if (accepted.length + rejected.length + 1 === inferredSkills.length) {
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 600); // Wait for animation
    }
  };

  const getSourceIcon = () => {
    if (source === "github") return <Code className="w-3.5 h-3.5 text-text-tertiary" />;
    return <Sparkles className="w-3.5 h-3.5 text-ai" />;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className="w-[280px] bg-surface-2 border border-hairline rounded-lg p-4 relative group"
        >
          <div className="flex items-center gap-2 mb-3">
            {getSourceIcon()}
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Identity Inference
            </span>
          </div>
          
          <p className="text-[13px] text-text-primary leading-relaxed mb-4">
            Based on your {source} activity, we inferred these skills. Add to your Career Graph?
          </p>

          <div className="flex flex-wrap gap-2">
            {inferredSkills.map((skill) => {
              const isAccepted = accepted.includes(skill);
              const isRejected = rejected.includes(skill);
              
              if (isAccepted || isRejected) return null; // Hide once acted upon

              return (
                <motion.div
                  key={skill}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1 bg-surface-2 border border-hairline rounded-full pl-3 pr-1 py-1"
                >
                  <span className="text-[13px] font-medium text-text-primary mr-1">{skill}</span>
                  <button
                    onClick={() => handleAction(skill, "accept")}
                    className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center hover:bg-success hover:text-canvas transition-colors active:scale-[0.95]"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAction(skill, "reject")}
                    className="w-6 h-6 rounded-full bg-surface-3 flex items-center justify-center hover:bg-danger hover:text-canvas transition-colors active:scale-[0.95]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
