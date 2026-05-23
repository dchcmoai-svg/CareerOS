"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User, Search, Send, KanbanSquare, FileText, Network, ArrowRight } from "lucide-react";
import { landing } from "@/lib/copy";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PIPELINE = [
  { id: "identity", label: "Profile", sub: "Import skills automatically", icon: User, tone: "text-ai" },
  { id: "discovery", label: "Find Jobs", sub: "Match scores & hiring signals", icon: Search, tone: "text-intelligence" },
  { id: "apply", label: "Apply", sub: "Tailored resumes per role", icon: Send, tone: "text-success" },
  { id: "tracker", label: "Applications", sub: "Track every stage", icon: KanbanSquare, tone: "text-warning" },
  { id: "resume", label: "Resume", sub: "Get more interviews", icon: FileText, tone: "text-ai" },
  { id: "marketplace", label: "Get Discovered", sub: "Recruiter visibility", icon: Network, tone: "text-text-secondary" },
];

export function OrchestrationPipeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(trackRef.current?.children || [], {
        opacity: 0,
        y: 24,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-6xl mx-auto px-lg py-section border-t border-hairline/40"
    >
      <div className="text-center mb-xxl">
        <span className="text-[11px] font-bold uppercase tracking-widest text-ai mb-md block">
          One connected workflow
        </span>
        <h2 className="text-display text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-text-primary mb-md">
          Everything about your job search — in one place.
        </h2>
        <p className="text-text-secondary text-[15px] max-w-2xl mx-auto leading-relaxed">
          Find jobs, improve your resume, track applications, and get discovered by recruiters — without
          switching between LinkedIn, spreadsheets, and five other tools.
        </p>
      </div>

      <div ref={lineRef} className="hidden md:block h-px bg-gradient-to-r from-transparent via-ai/40 to-transparent mb-xl origin-left" />

      <div ref={trackRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
        {PIPELINE.map((step, i) => (
          <div
            key={step.id}
            className="group relative flex flex-col gap-sm p-md rounded-xl border border-hairline bg-surface-1/50 hover:bg-surface-2/80 hover:border-border-strong/60 transition-all duration-300"
          >
            <div className={`w-9 h-9 rounded-lg bg-surface-2 border border-hairline flex items-center justify-center ${step.tone}`}>
              <step.icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">{step.label}</h3>
              <p className="text-[11px] text-text-tertiary mt-0.5 leading-snug">{step.sub}</p>
            </div>
            {i < PIPELINE.length - 1 && (
              <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hairline opacity-40" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
