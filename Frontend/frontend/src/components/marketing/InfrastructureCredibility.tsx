"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Eye, BrainCircuit, GitBranch } from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";

const PILLARS = [
  {
    icon: BrainCircuit,
    title: "Clear recommendations",
    body: "Every match score and suggestion comes with a plain explanation — so you know why it matters.",
  },
  {
    icon: Eye,
    title: "You control visibility",
    body: "Stealth mode, employer blocks, and salary preferences apply everywhere — you decide who sees you.",
  },
  {
    icon: GitBranch,
    title: "Role-specific resumes",
    body: "Keep different resume versions for different roles. Each application gets the right version automatically.",
  },
  {
    icon: Lock,
    title: "Private & secure",
    body: "Sign in with Google or GitHub. We never store passwords or post on your behalf without permission.",
  },
];

const METRICS = [
  { label: "Tools replaced", value: "5+", sub: "One workspace" },
  { label: "Tab switching", value: "Less", sub: "Stay focused" },
  { label: "Job clarity", value: "High", sub: "Real match signals" },
];

export function InfrastructureCredibility() {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-lg py-section border-t border-hairline/40">
      <div className="text-center mb-xxl">
        <span className="text-[11px] font-bold uppercase tracking-widest text-success mb-md block flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Built for trust
        </span>
        <h2 className="text-display text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-text-primary mb-md">
          Your career data stays yours.
        </h2>
        <p className="text-text-secondary text-[15px] max-w-2xl mx-auto leading-relaxed">
          Simple, calm, and professional — the same quality bar you expect from Linear or Notion,
          applied to your job search.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid md:grid-cols-3 gap-px bg-hairline rounded-xl overflow-hidden border border-hairline mb-xl"
      >
        {METRICS.map((m) => (
          <motion.div
            key={m.label}
            variants={staggerItem}
            className="bg-surface-1 px-lg py-md text-center"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary block mb-xs">
              {m.label}
            </span>
            <span className="text-3xl font-semibold text-text-primary tabular-nums tracking-tight block">
              {m.value}
            </span>
            <span className="text-[11px] text-text-tertiary mt-1 block">{m.sub}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid md:grid-cols-2 gap-md"
      >
        {PILLARS.map((p) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.title}
              variants={staggerItem}
              className="bg-surface-1 border border-hairline rounded-lg p-lg surface-elevated"
            >
              <div className="w-9 h-9 rounded-lg bg-surface-2 border border-hairline flex items-center justify-center mb-md">
                <Icon className="w-4 h-4 text-ai" />
              </div>
              <h3 className="text-[15px] font-semibold text-text-primary mb-xs tracking-tight">
                {p.title}
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">{p.body}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-xl text-center">
        <Link
          href="/docs"
          className="text-[13px] font-semibold text-ai hover:text-ai-hover inline-flex items-center gap-1 transition-colors"
        >
          Read help & documentation →
        </Link>
      </div>
    </section>
  );
}
