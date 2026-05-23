"use client";

import { motion } from "framer-motion";
import { MarketingNav } from "@/components/layout/MarketingNav";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { marketingPages } from "@/lib/copy";

const VALUES = [
  { title: "Built for daily use", body: "CareerOS is meant for your actual job search — not a profile you update once a year." },
  { title: "Clear, not mysterious", body: "Every match score and suggestion comes with a plain explanation you can understand." },
  { title: "You're in control", body: "Your visibility, data, and applications belong to you — not advertisers or recruiters by default." },
  { title: "Everything connected", body: "Update your resume and your job matches improve. Apply and it shows up in your tracker. No re-entering data." },
];

export default function AboutPage() {
  const copy = marketingPages.about;
  return (
    <main className="min-h-screen bg-canvas text-text-primary">
      <div className="absolute inset-0 mesh-gradient-hero pointer-events-none" />
      <MarketingNav />

      <section className="relative z-10 px-lg py-section max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-xxl">
          <span className="text-[11px] font-bold uppercase tracking-widest text-ai mb-md block">{copy.eyebrow}</span>
          <h1 className="text-display text-4xl font-semibold tracking-[-0.03em] mb-md">{copy.title}</h1>
          <p className="text-text-secondary text-[16px] leading-relaxed">{copy.subtitle}</p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-md mb-xxl"
        >
          {VALUES.map((v) => (
            <motion.div
              key={v.title}
              variants={staggerItem}
              className="bg-surface-1 border border-hairline rounded-lg p-lg"
            >
              <h3 className="text-[15px] font-semibold text-text-primary mb-xs">{v.title}</h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center p-lg border border-hairline rounded-xl bg-surface-1/60">
          <p className="text-[14px] text-text-secondary mb-md">{copy.footer}</p>
          <Link href="/docs" className="text-ai font-semibold text-sm hover:text-ai-hover">
            {copy.docsLink} →
          </Link>
        </div>
      </section>
    </main>
  );
}
