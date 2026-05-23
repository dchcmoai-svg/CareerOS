"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, FileWarning, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type DiagnosticType = "warning" | "error" | "suggestion";

interface DiagnosticOverlayProps {
  children: React.ReactNode;
  type: DiagnosticType;
  message: string;
  rationale: string;
}

export function DiagnosticOverlay({ children, type, message, rationale }: DiagnosticOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStyles = () => {
    switch (type) {
      case "error":
        return "border-b-[1.5px] border-danger/70 bg-danger/5 text-danger cursor-help";
      case "warning":
        return "border-b-[1.5px] border-warning/70 bg-warning/5 text-warning cursor-help";
      case "suggestion":
        return "border-b-[1.5px] border-ai/70 bg-ai/5 text-ai cursor-help";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "error": return <AlertCircle className="w-3.5 h-3.5 text-danger" />;
      case "warning": return <FileWarning className="w-3.5 h-3.5 text-warning" />;
      case "suggestion": return <TrendingUp className="w-3.5 h-3.5 text-ai" />;
    }
  };

  return (
    <span className="relative inline-block">
      <span
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={cn("transition-colors", getStyles())}
      >
        {children}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="absolute top-full left-0 mt-2 w-[320px] bg-surface-1 border border-warning/30 rounded-lg p-3 shadow-lg z-50 pointer-events-none"
          >
            <div className="flex items-start gap-2 mb-1.5">
              <div className="mt-0.5">{getIcon()}</div>
              <h4 className="text-[12px] font-bold text-text-primary uppercase tracking-wider">
                {type}
              </h4>
            </div>
            <p className="text-[13px] text-text-primary font-medium leading-relaxed mb-1">
              {message}
            </p>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              {rationale}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
