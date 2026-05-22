"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { BookOpen, ChevronRight, Shield, HelpCircle, Layers, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { nav, marketingPages } from "@/lib/copy";

const SECTIONS = [
  {
    id: "overview",
    title: "What is CareerOS?",
    icon: HelpCircle,
    content: [
      "CareerOS helps you find jobs, improve your resume, track applications, and get discovered by recruiters — in one place.",
      "Your dashboard shows what needs attention today. Full pages let you go deeper on jobs, applications, or your resume.",
      "Everything stays connected: change your resume and your job matches update automatically.",
    ],
  },
  {
    id: "pages",
    title: "Main pages",
    icon: Map,
    content: [
      `${nav.dashboard} — see job matches, resume score, applications, and recruiter activity.`,
      `${nav.jobs} — browse scraped jobs with filters, match scores, and response likelihood.`,
      `${nav.tracker} — track every application stage and follow-up.`,
      `${nav.resume} — edit your resume and get clear improvement suggestions.`,
      `${nav.marketplace} — control who sees your profile and view recruiter activity.`,
      `${nav.profile} — your skills, preferences, and connected accounts.`,
    ],
  },
  {
    id: "trust",
    title: "Privacy & trust",
    icon: Shield,
    content: [
      "We explain every match score and suggestion in plain language.",
      "Notifications are about your job search — not engagement spam.",
      "Stealth mode, employer blocks, and salary preferences apply everywhere.",
      "We never post on your behalf without your permission.",
    ],
  },
  {
    id: "tips",
    title: "Getting started",
    icon: Layers,
    content: [
      "Upload your resume or connect GitHub/LinkedIn to build your profile.",
      "Browse Find Jobs and filter by role, remote, and category.",
      "Save roles you like and track them in Applications.",
      "Use the career assistant (right panel) for quick help anytime.",
      "Press ⌘K (or Ctrl+K) for quick search across pages and actions.",
    ],
  },
];

export default function DocsPage() {
  const [active, setActive] = useState("overview");
  const section = SECTIONS.find((s) => s.id === active)!;
  const Icon = section.icon;

  return (
    <main className="min-h-screen bg-canvas text-text-primary">
      <MarketingNav />

      <div className="max-w-6xl mx-auto px-lg py-section flex flex-col lg:flex-row gap-xl">
        <aside className="lg:w-[240px] flex-shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center gap-sm mb-md">
              <BookOpen className="w-5 h-5 text-ai" />
              <span className="font-bold text-sm tracking-tight">Help center</span>
            </div>
            <nav className="flex flex-col gap-xxs">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "text-left px-sm py-2 rounded-md text-[13px] font-medium transition-colors",
                    active === s.id
                      ? "bg-surface-2 text-text-primary border border-hairline"
                      : "text-text-secondary hover:bg-surface-1 hover:text-text-primary"
                  )}
                >
                  {s.title}
                </button>
              ))}
            </nav>
            <Link
              href="/sign-up"
              className="mt-lg inline-flex items-center gap-1 text-[12px] font-semibold text-ai hover:text-ai-hover"
            >
              Get started <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        <motion.article
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-surface-1 border border-hairline rounded-xl p-lg surface-elevated"
        >
          <div className="flex items-center gap-sm mb-lg pb-md border-b border-hairline">
            <div className="w-10 h-10 rounded-lg bg-ai/10 border border-ai/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-ai" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{section.title}</h1>
          </div>
          <ul className="space-y-4">
            {section.content.map((line, i) => (
              <li key={i} className="text-[15px] text-text-secondary leading-relaxed flex gap-2">
                <span className="text-ai mt-1.5">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </motion.article>
      </div>

      <footer className="border-t border-hairline/50 py-md text-center text-xs text-text-tertiary">
        {marketingPages.about.footer}
      </footer>
    </main>
  );
}
