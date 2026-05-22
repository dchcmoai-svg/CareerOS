"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { TactileButton } from "@/components/ecosystem/TactileButton";
import { ArrowRight, Upload, GitBranch, Search, Kanban, FileCheck, Eye, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { howItWorksSteps, marketingPages, landing } from "@/lib/copy";

const STEP_ICONS = [Upload, GitBranch, Search, Kanban, FileCheck, Eye, LayoutDashboard];

export default function HowItWorksPage() {
  const copy = marketingPages.howItWorks;
  return (
    <main className="min-h-screen bg-canvas text-text-primary">
      <div className="absolute inset-0 mesh-gradient-hero pointer-events-none" />
      <MarketingNav />

      <section className="relative z-10 px-lg py-section max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-xxl">
          <span className="text-[11px] font-bold uppercase tracking-widest text-ai mb-md block">{copy.eyebrow}</span>
          <h1 className="text-display text-4xl font-semibold tracking-[-0.03em] mb-md">{copy.title}</h1>
          <p className="text-text-secondary text-[16px] leading-relaxed">{copy.subtitle}</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[23px] top-8 bottom-8 w-px bg-hairline" />
          {howItWorksSteps.map((item, i) => {
            const Icon = STEP_ICONS[i] ?? ArrowRight;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 30 }}
                className="relative flex gap-lg mb-xl pl-2"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-2 border border-hairline flex items-center justify-center flex-shrink-0 z-10 surface-elevated">
                  <Icon className="w-5 h-5 text-ai" />
                </div>
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-ai uppercase tracking-widest">{item.step}</span>
                  <h3 className="text-xl font-semibold tracking-tight mt-1 mb-2">{item.title}</h3>
                  <p className="text-[14px] text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-xxl text-center p-lg bg-surface-1 border border-hairline rounded-xl"
        >
          <p className="text-[15px] text-text-secondary mb-md">{copy.ctaPrompt}</p>
          <Link href="/sign-up">
            <TactileButton variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
              {copy.cta}
            </TactileButton>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
