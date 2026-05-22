"use client";

import React from "react";
import { motion } from "framer-motion";
import { MarketingNav } from "@/components/layout/MarketingNav";
import Link from "next/link";
import { marketingPages } from "@/lib/copy";

interface PublicPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  cta?: { label: string; href: string };
}

export function PublicPageShell({ eyebrow, title, description, children, cta }: PublicPageShellProps) {
  return (
    <main className="min-h-screen bg-canvas text-text-primary">
      <div className="absolute inset-0 mesh-gradient-hero pointer-events-none" />
      <MarketingNav />

      <section className="relative z-10 px-lg pt-xl pb-lg max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-xxl"
        >
          <span className="text-[11px] font-bold uppercase tracking-widest text-ai mb-md block">
            {eyebrow}
          </span>
          <h1 className="text-display text-4xl md:text-5xl font-semibold tracking-[-0.03em] mb-md">
            {title}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">{description}</p>
        </motion.div>
        {children}
      </section>

      {cta && (
        <section className="relative z-10 px-lg pb-section max-w-5xl mx-auto text-center">
          <div className="p-lg bg-surface-1 border border-hairline rounded-xl surface-elevated">
            <p className="text-[15px] text-text-secondary mb-md">{marketingPages.publicCta}</p>
            <Link
              href={cta.href}
              className="inline-flex items-center justify-center px-lg py-3 bg-text-primary text-canvas rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-text-secondary transition-all active:scale-[0.98]"
            >
              {cta.label}
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
