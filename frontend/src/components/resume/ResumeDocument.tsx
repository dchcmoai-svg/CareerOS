"use client";

import React from "react";
import { DiagnosticOverlay } from "./DiagnosticOverlay";

interface ResumeDocumentProps {
  activeBranch: string;
}

export function ResumeDocument({ activeBranch }: ResumeDocumentProps) {
  // Line counter for IDE gutter
  const lineCount = 28;
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="flex-1 overflow-y-auto bg-canvas relative pb-32 flex">
      {/* Editor Gutter / Line Numbers */}
      <div className="w-12 bg-surface-1/40 border-r border-hairline/80 pt-16 flex flex-col items-center select-none text-[11px] font-mono text-text-tertiary/70 leading-[26px]">
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      {/* Editor Canvas (Notion style document with IDE elements) */}
      <div className="flex-1 px-8 pt-12">
        <div className="max-w-3xl mx-auto bg-surface-1 border border-hairline rounded shadow-sm p-12 min-h-[900px] font-sans relative">
          
          {/* Top IDE hint bar */}
          <div className="absolute top-2 right-4 flex items-center gap-xs text-[9px] font-mono text-text-tertiary">
            <span>Encoding: UTF-8</span>
            <span>•</span>
            <span>Target: {activeBranch === "feature/stripe-frontend" ? "Stripe Inc" : "General Staff"}</span>
          </div>

          {/* Header */}
          <div className="border-b border-border-strong pb-4 mb-6">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight mb-1">Alex Chen</h1>
            <p className="text-xs font-medium text-text-secondary">Staff Software Engineer | SF Bay Area | alex.chen@dev.io</p>
          </div>

          {/* Experience Section */}
          <div className="mb-6">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest mb-3 font-mono text-ai">01. Experience</h2>
            
            {activeBranch === "feature/stripe-frontend" ? (
              // STRIPE TARGETING
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-bold text-text-primary">Staff Software Engineer (Frontend Core)</h3>
                  <span className="text-xs font-medium text-text-tertiary">2021 - Present</span>
                </div>
                <p className="text-xs font-semibold text-text-secondary mb-2">Vercel</p>
                
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-primary leading-relaxed">
                  <li>
                    Architected and shipped the new Edge Functions routing layer,{" "}
                    <DiagnosticOverlay
                      type="suggestion"
                      message="Strong Impact Metric"
                      rationale="Edge routing optimization metrics are highly valued. Shifting to numeric percentages increases response rates by 1.8x."
                    >
                      reducing latency by 45%
                    </DiagnosticOverlay>{" "}
                    across 2M+ domains.
                  </li>
                  <li>
                    <DiagnosticOverlay
                      type="error"
                      message="Weak Action Verb & Missing Impact"
                      rationale="Stripe searches for strong leadership verbs like 'Directed' or 'Spearheaded'. 'Worked on' is too passive for Staff level."
                    >
                      Worked on the React server components implementation
                    </DiagnosticOverlay>{" "}
                    for the core framework.
                  </li>
                  <li>
                    Mentored 4 mid-level engineers and established front-end testing infrastructure using Playwright.
                  </li>
                </ul>
              </div>
            ) : (
              // GENERAL STAFF TARGETING
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-bold text-text-primary">Lead Systems & UI Architect</h3>
                  <span className="text-xs font-medium text-text-tertiary">2021 - Present</span>
                </div>
                <p className="text-xs font-semibold text-text-secondary mb-2">Vercel</p>
                
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-primary leading-relaxed">
                  <li>
                    Led development of next-generation Server Side rendering engine, optimizing performance overhead.
                  </li>
                  <li>
                    <DiagnosticOverlay
                      type="warning"
                      message="Generic Phrasing"
                      rationale="For general staff roles, highlight compilation or WASM performance instead of generic performance gains."
                    >
                      Improved page hydration limits
                    </DiagnosticOverlay>{" "}
                    across the entire application lifecycle.
                  </li>
                  <li>
                    Co-authored React Server Component RFCs, aligning framework features with standards.
                  </li>
                </ul>
              </div>
            )}

            {/* Past role Stripe */}
            <div className="mt-4 pt-4 border-t border-hairline/60">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-sm font-bold text-text-primary">Senior UI Infrastructure Engineer</h3>
                <span className="text-xs font-medium text-text-tertiary">2018 - 2021</span>
              </div>
              <p className="text-xs font-semibold text-text-secondary mb-2">Stripe</p>
              
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-primary leading-relaxed">
                <li>
                  Led the migration of the payment dashboard from legacy React components to hooks,{" "}
                  <DiagnosticOverlay
                    type="warning"
                    message="Missing Target Keyword"
                    rationale="Stripe explicitly requests 'Distributed Systems' experience. Can you frame this architectural migration in that context?"
                  >
                    improving developer velocity
                  </DiagnosticOverlay>.
                </li>
                <li>
                  Implemented accessible design system primitives used by 40+ internal teams.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
