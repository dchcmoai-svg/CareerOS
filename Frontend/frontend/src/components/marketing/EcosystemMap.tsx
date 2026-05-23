"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NODES = [
  { id: "dashboard", label: "Dashboard", x: 50, y: 50, primary: true },
  { id: "discovery", label: "Find Jobs", x: 18, y: 28 },
  { id: "compiler", label: "Resume", x: 82, y: 28 },
  { id: "tracker", label: "Applications", x: 18, y: 72 },
  { id: "market", label: "Get Discovered", x: 82, y: 72 },
];

const EDGES = [
  ["dashboard", "discovery"],
  ["dashboard", "compiler"],
  ["dashboard", "tracker"],
  ["dashboard", "market"],
  ["discovery", "compiler"],
  ["discovery", "tracker"],
  ["compiler", "market"],
  ["tracker", "market"],
];

function nodeById(id: string) {
  return NODES.find((n) => n.id === id)!;
}

export function EcosystemMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !svgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(svgRef.current?.querySelectorAll("[data-edge]") || [], {
        strokeDashoffset: 200,
        duration: 1.4,
        stagger: 0.06,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 68%",
        },
      });

      gsap.from(svgRef.current?.querySelectorAll("[data-node]") || [], {
        opacity: 0,
        scale: 0.85,
        stagger: 0.07,
        duration: 0.5,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-6xl mx-auto px-lg py-section border-t border-hairline/40 overflow-hidden"
    >
      <div className="absolute inset-0 mesh-gradient-hero opacity-40 pointer-events-none" />

      <div className="relative z-10 text-center mb-xl">
        <span className="text-[11px] font-bold uppercase tracking-widest text-ai mb-md block">
          Everything works together
        </span>
        <h2 className="text-display text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-text-primary mb-md">
          Update your resume → better job matches → stronger applications → more recruiter visibility.
        </h2>
        <p className="text-text-secondary text-[15px] max-w-2xl mx-auto leading-relaxed">
          Change your resume and your job matches update. Apply to a role and it appears in your tracker.
          Adjust visibility once — it applies everywhere, not per application.
        </p>
      </div>

      <div className="relative aspect-[16/9] max-h-[420px] bg-surface-1/60 border border-hairline rounded-xl surface-elevated overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(118,132,240,0.1)" />
              <stop offset="50%" stopColor="rgba(118,132,240,0.5)" />
              <stop offset="100%" stopColor="rgba(87,193,255,0.3)" />
            </linearGradient>
          </defs>

          {EDGES.map(([from, to]) => {
            const a = nodeById(from);
            const b = nodeById(to);
            return (
              <line
                key={`${from}-${to}`}
                data-edge
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="url(#edgeGrad)"
                strokeWidth="0.35"
                strokeDasharray="4 2"
                style={{ strokeDashoffset: 0 }}
              />
            );
          })}

          {NODES.map((node) => (
            <g key={node.id} data-node transform={`translate(${node.x}, ${node.y})`}>
              {node.primary ? (
                <>
                  <circle r="8" fill="rgba(118,132,240,0.15)" />
                  <circle r="5" fill="rgba(118,132,240,0.35)" stroke="rgba(118,132,240,0.6)" strokeWidth="0.4" />
                </>
              ) : (
                <circle r="3.5" fill="rgba(13,13,13,0.9)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.35" />
              )}
              <text
                y={node.primary ? 12 : 8}
                textAnchor="middle"
                className="fill-[#B7BCC7] text-[3.2px] font-semibold uppercase tracking-wide"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-sm justify-center text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
          <span className="px-2 py-1 bg-surface-2 border border-hairline rounded">Shared identity graph</span>
          <span className="px-2 py-1 bg-surface-2 border border-hairline rounded">Cross-surface AI memory</span>
          <span className="px-2 py-1 bg-surface-2 border border-hairline rounded">Operational continuity</span>
        </div>
      </div>
    </section>
  );
}
