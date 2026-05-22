"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { landing } from "@/lib/copy";
import { TactileButton } from "../ecosystem/TactileButton";
import { staggerContainer, staggerItem } from "@/lib/motion";

const { comparison } = landing;

export function LandingComparison() {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-lg py-section border-t border-hairline/40">
      <div className="text-center mb-xxl max-w-3xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-widest text-ai mb-md block">
          {comparison.eyebrow}
        </span>
        <h2 className="text-display text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-text-primary mb-md">
          {comparison.title}
        </h2>
        <p className="text-text-secondary text-[15px] leading-relaxed">{comparison.subtitle}</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="rounded-xl border border-hairline overflow-hidden bg-surface-1/50"
      >
        <div className="hidden md:grid grid-cols-[1.1fr_1fr_1fr] gap-px bg-hairline text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
          <div className="bg-surface-1 px-md py-3" />
          <div className="bg-surface-1 px-md py-3">Typical tools</div>
          <div className="bg-surface-1 px-md py-3 text-ai">CareerOS</div>
        </div>
        {comparison.rows.map((row) => (
          <motion.div
            key={row.topic}
            variants={staggerItem}
            className="grid md:grid-cols-[1.1fr_1fr_1fr] gap-px bg-hairline border-t border-hairline first:border-t-0"
          >
            <div className="bg-surface-1 px-md py-4">
              <p className="text-sm font-semibold text-text-primary">{row.topic}</p>
            </div>
            <div className="bg-surface-1 px-md py-4">
              <p className="text-[13px] text-text-secondary leading-relaxed md:hidden text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-1">
                Typical tools
              </p>
              <p className="text-[13px] text-text-secondary leading-relaxed">{row.others}</p>
            </div>
            <div className="bg-surface-2/40 px-md py-4 border-l-0 md:border-l border-ai/10">
              <p className="text-[13px] text-text-secondary leading-relaxed md:hidden text-[10px] font-bold uppercase tracking-widest text-ai mb-1">
                CareerOS
              </p>
              <p className="text-[13px] text-text-primary leading-relaxed flex gap-2">
                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <span>{row.careeros}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-xl text-center">
        <Link href="/sign-up">
          <TactileButton variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
            {comparison.cta}
          </TactileButton>
        </Link>
      </div>
    </section>
  );
}
