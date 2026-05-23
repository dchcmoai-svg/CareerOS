"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { OperationalCard } from "@/components/ecosystem/OperationalCard";
import { TactileButton } from "@/components/ecosystem/TactileButton";
import {
  Sparkles,
  Briefcase,
  KanbanSquare,
  FileText,
  Network,
  Brain,
  ArrowRight,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { featureSystems, marketingPages, landing } from "@/lib/copy";

const ICON_MAP = {
  brain: Brain,
  briefcase: Briefcase,
  kanban: KanbanSquare,
  file: FileText,
  network: Network,
  sparkles: Sparkles,
};

export default function FeaturesPage() {
  const copy = marketingPages.features;
  return (
    <main className="min-h-screen bg-canvas text-text-primary">
      <div className="absolute inset-0 mesh-gradient-hero pointer-events-none" />
      <MarketingNav />

      <section className="relative z-10 px-lg py-section max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-xxl"
        >
          <span className="text-[11px] font-bold uppercase tracking-widest text-ai mb-md block">
            {copy.eyebrow} ·{" "}
            <Link href="/product" className="hover:text-ai-hover">
              Product overview →
            </Link>
          </span>
          <h1 className="text-display text-5xl font-semibold tracking-[-0.03em] mb-md">{copy.title}</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">{copy.subtitle}</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-md"
        >
          {featureSystems.map((system) => {
            const Icon = ICON_MAP[system.icon];
            return (
              <motion.div key={system.title} variants={staggerItem}>
                <OperationalCard
                  title={system.title}
                  subtitle={system.subtitle}
                  icon={Icon}
                  accent={system.accent}
                  density="rich"
                  className="h-full"
                >
                  <p className="text-[13px] text-text-secondary leading-relaxed">{system.description}</p>
                </OperationalCard>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-xxl p-lg bg-surface-1 border border-hairline rounded-xl surface-elevated"
        >
          <div className="flex items-start gap-md">
            <Shield className="w-6 h-6 text-success flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">{copy.trustTitle}</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed mb-md">{copy.trustBody}</p>
              <div className="flex flex-wrap gap-sm">
                {copy.trustTags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-semibold px-sm py-1 bg-surface-2 border border-hairline rounded text-text-tertiary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-xxl text-center">
          <Link href="/sign-up">
            <TactileButton variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
              {landing.ctaPrimary}
            </TactileButton>
          </Link>
        </div>
      </section>
    </main>
  );
}
