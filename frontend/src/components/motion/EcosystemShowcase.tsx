"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  Briefcase,
  FileText,
  KanbanSquare,
  Eye,
  Command,
  Sparkles,
  Building2,
  TrendingUp,
} from "lucide-react";
import { layoutSpring, springs } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { LivePulse } from "./LivePulse";
import { AnimatedProgress } from "./AnimatedProgress";

const DEMO_JOBS = [
  { company: "Linear", role: "Product Engineer", fit: 96, response: 91 },
  { company: "Stripe", role: "Senior Frontend", fit: 92, response: 85 },
  { company: "Vercel", role: "Staff Engineer", fit: 88, response: 78 },
];

const FLOAT_PANELS = [
  { id: "resume", icon: FileText, className: "left-0 top-[8%] -translate-x-1/4" },
  { id: "tracker", icon: KanbanSquare, className: "right-0 top-[6%] translate-x-1/4" },
  { id: "recruiter", icon: Eye, className: "right-0 bottom-[12%] translate-x-1/5" },
];

export function EcosystemShowcase() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [jobIdx, setJobIdx] = useState(0);
  const [resumeScore, setResumeScore] = useState(76);

  const job = DEMO_JOBS[jobIdx];

  useEffect(() => {
    const t1 = setInterval(() => setJobIdx((i) => (i + 1) % DEMO_JOBS.length), 4500);
    const t2 = setInterval(() => {
      setResumeScore((s) => (s >= 88 ? 76 : s + 2));
    }, 3200);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-float]", {
        y: "+=5",
        duration: 2.8,
        ease: "sine.inOut",
        stagger: { each: 0.35, from: "random" },
        repeat: -1,
        yoyo: true,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={rootRef} className="relative w-full min-h-[400px] sm:min-h-[440px] lg:min-h-[500px]">
      <div className="absolute inset-0 ecosystem-grid opacity-50 rounded-2xl pointer-events-none" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-ai/8 via-transparent to-intelligence/6 pointer-events-none" />

      {!reduced &&
        FLOAT_PANELS.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.id}
              data-float
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.12, ...springs.panel }}
              className={`absolute hidden lg:flex flex-col w-[132px] glass-panel p-3 z-20 shadow-lg ${p.className}`}
            >
              <Icon className="w-4 h-4 text-ai mb-2" />
              {p.id === "resume" && (
                <>
                  <p className="text-[10px] font-bold text-text-primary">Resume score</p>
                  <p className="text-lg font-bold text-success tabular-nums">{resumeScore}%</p>
                  <AnimatedProgress value={resumeScore} barClassName="bg-ai" className="mt-2 h-1" />
                </>
              )}
              {p.id === "tracker" && (
                <>
                  <p className="text-[10px] font-bold text-text-primary">Applications</p>
                  <p className="text-[11px] text-text-secondary mt-1">Stripe → Interview</p>
                  <p className="text-[11px] text-warning mt-0.5">Acme · follow up</p>
                </>
              )}
              {p.id === "recruiter" && (
                <>
                  <p className="text-[10px] font-bold text-text-primary flex items-center gap-1">
                    <LivePulse tone="ai" /> Active now
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1 leading-snug">
                    Recruiter viewed your profile
                  </p>
                </>
              )}
            </motion.div>
          );
        })}

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex h-full min-h-[400px] sm:min-h-[440px] lg:min-h-[500px] flex-col glass-panel surface-elevated glow-border-subtle overflow-hidden rounded-2xl"
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-hairline bg-surface-2/90 shrink-0">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-warning/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-success/80" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary ml-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-ai" /> CareerOS
          </span>
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-3 border border-hairline text-[10px] text-text-tertiary">
            <Command className="w-3 h-3" />
            <kbd className="font-mono text-[9px]">⌘K</kbd>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 min-h-0">
          <div className="hidden sm:flex sm:col-span-1 border-r border-hairline p-2 flex-col gap-1 bg-surface-1/60">
            {[Briefcase, KanbanSquare, FileText, Eye].map((Icon, i) => (
              <div
                key={i}
                className={`p-2 rounded-md flex justify-center ${i === 0 ? "bg-ai/15 border border-ai/25" : ""}`}
              >
                <Icon className={`w-4 h-4 ${i === 0 ? "text-ai" : "text-text-tertiary"}`} />
              </div>
            ))}
          </div>

          <div className="sm:col-span-2 border-b sm:border-b-0 sm:border-r border-hairline p-3 flex flex-col gap-2 min-h-[180px]">
            <p className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary">Find Jobs</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={job.company}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={layoutSpring}
                className="p-3 rounded-lg border border-ai/35 bg-ai/8"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-text-primary">{job.role}</span>
                  <span className="text-[10px] font-bold text-success tabular-nums">{job.fit}% match</span>
                </div>
                <span className="text-[10px] text-text-tertiary flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> {job.company}
                </span>
                <div className="flex gap-1 mt-2">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-success/10 text-success border border-success/20">
                    {job.response}% likely to respond
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
            {DEMO_JOBS.filter((_, i) => i !== jobIdx).map((j) => (
              <div key={j.company} className="p-2 rounded-lg border border-hairline/60 opacity-55 text-[10px]">
                <span className="font-semibold text-text-secondary">{j.role}</span>
                <span className="text-text-tertiary block">{j.company}</span>
              </div>
            ))}
          </div>

          <div className="sm:col-span-2 p-3 flex flex-col gap-3 bg-surface-1/40 min-h-[160px]">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary mb-2">
                Why this matches
              </p>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Your React and TypeScript experience align strongly. Tailoring your resume could push match to 95%+.
              </p>
            </div>
            <div className="mt-auto space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-text-tertiary flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-success" /> Hiring pace
                </span>
                <span className="font-bold text-success">Fast</span>
              </div>
              <AnimatedProgress value={job.fit} barClassName="bg-success" />
              <div className="w-full py-2 rounded-lg bg-ai text-canvas text-[10px] font-bold text-center">
                Apply with tailored resume
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
