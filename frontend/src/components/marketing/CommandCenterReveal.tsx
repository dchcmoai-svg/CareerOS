"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  FileText,
  Network,
  Maximize2,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";
import { TactileButton } from "../ecosystem/TactileButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EMBEDDED_MODULES = [
  { label: "Job matches", value: "12 strong fits", status: "Live" },
  { label: "Resume score", value: "82%", status: "Improving" },
  { label: "Applications", value: "3 active", status: "On track" },
  { label: "Recruiter views", value: "2 today", status: "Profile" },
];

const FOCUS_MODES = [
  { name: "Find Jobs", href: "/jobs", icon: Briefcase, desc: "Browse roles with match scores" },
  { name: "Applications", href: "/tracker", icon: KanbanSquare, desc: "Track every application" },
  { name: "Resume", href: "/resume", icon: FileText, desc: "Improve your resume" },
  { name: "Get Discovered", href: "/marketplace", icon: Network, desc: "Recruiter visibility" },
];

export function CommandCenterReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !panelRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(panelRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-6xl mx-auto px-lg py-section"
    >
      <div className="grid lg:grid-cols-2 gap-xl items-center">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-intelligence mb-md block">
            Your career hub
          </span>
          <h2 className="text-display text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-text-primary mb-md">
            Everything important — on one dashboard.
          </h2>
          <p className="text-text-secondary text-[15px] leading-relaxed mb-lg max-w-lg">
            After sign-in, your dashboard shows job matches, resume performance, application
            progress, and recruiter activity — all connected, so nothing falls through the cracks.
          </p>
          <p className="text-[13px] text-text-tertiary leading-relaxed mb-lg max-w-lg">
            Open full pages for jobs, applications, or resume editing when you need depth — your
            progress stays connected across the whole workflow.
          </p>
          <Link href="/sign-up">
            <TactileButton variant="primary" icon={ArrowRight} iconPosition="right">
              Open your dashboard
            </TactileButton>
          </Link>
        </div>

        <div
          ref={panelRef}
          className="bg-surface-1 border border-hairline rounded-xl overflow-hidden surface-elevated"
        >
          <div className="px-md py-sm border-b border-hairline flex items-center justify-between bg-surface-2/40">
            <div className="flex items-center gap-sm">
              <LayoutDashboard className="w-4 h-4 text-ai" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">
                Your Career Hub
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-ai animate-pulse" />
              <span className="text-[9px] font-bold text-success uppercase">In sync</span>
            </div>
          </div>

          <div className="p-md grid grid-cols-2 gap-px bg-hairline">
            {EMBEDDED_MODULES.map((m) => (
              <div key={m.label} className="bg-surface-1 p-sm flex flex-col gap-xxs">
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary">
                  {m.label}
                </span>
                <span className="text-lg font-semibold text-text-primary tabular-nums">{m.value}</span>
                <span className="text-[10px] text-ai font-medium">{m.status}</span>
              </div>
            ))}
          </div>

          <div className="px-md py-sm border-t border-hairline">
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary block mb-sm">
              Expand to focus mode
            </span>
            <div className="grid grid-cols-2 gap-xs">
              {FOCUS_MODES.map((mode) => {
                const Icon = mode.icon;
                return (
                  <Link
                    key={mode.name}
                    href={mode.href}
                    className="flex items-center gap-2 p-2 rounded-md bg-surface-2/50 border border-hairline/60 hover:bg-surface-2 hover:border-border-strong transition-all group"
                  >
                    <Icon className="w-3.5 h-3.5 text-text-tertiary group-hover:text-ai transition-colors" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-semibold text-text-primary block truncate">
                        {mode.name}
                      </span>
                      <span className="text-[9px] text-text-tertiary block truncate">{mode.desc}</span>
                    </div>
                    <Maximize2 className="w-3 h-3 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
