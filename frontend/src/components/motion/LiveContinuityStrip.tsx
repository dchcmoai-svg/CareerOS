"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { springs } from "@/lib/motion";
import { LivePulse } from "./LivePulse";

const EVENTS = [
  { text: "Resume score improved to 84%", tone: "ai" as const },
  { text: "New strong match: Staff Engineer at Vercel", tone: "success" as const },
  { text: "Recruiter viewed your profile · 12 min ago", tone: "ai" as const },
  { text: "Stripe application moved to Interview", tone: "success" as const },
  { text: "3 remote roles match your filters today", tone: "success" as const },
];

export function LiveContinuityStrip() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % EVENTS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const event = EVENTS[idx];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2 rounded-lg border border-hairline/80 bg-surface-1/80 backdrop-blur-sm overflow-hidden"
    >
      <LivePulse tone={event.tone} />
      <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary shrink-0">
        Live
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={event.text}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={springs.snappy}
          className="text-[13px] text-text-secondary font-medium truncate"
        >
          {event.text}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}
