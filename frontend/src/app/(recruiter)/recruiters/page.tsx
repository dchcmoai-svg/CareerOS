"use client";

import React from "react";
import { motion } from "framer-motion";
import { staggerContainer, slideUpVariants } from "@/lib/motion";
import { Users } from "lucide-react";
import Link from "next/link";

export default function RecruitersPage() {
  return (
    <main className="min-h-screen bg-canvas text-text-primary overflow-hidden flex flex-col relative">
      <header className="h-16 flex items-center px-lg border-b border-hairline/50 z-10">
        <Link href="/" className="font-semibold text-text-primary">CareerOS</Link>
      </header>
      <section className="flex-1 flex flex-col items-center justify-center text-center px-lg py-[120px]">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl flex flex-col items-center gap-md">
          <Users className="w-12 h-12 text-text-tertiary mb-sm" />
          <motion.h1 variants={slideUpVariants} className="text-4xl md:text-5xl font-semibold tracking-tight">
            Recruiter Intelligence Platform
          </motion.h1>
          <motion.p variants={slideUpVariants} className="text-text-secondary text-lg">
            Source, rank, and connect with top talent using an AI-native B2B infrastructure.
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}
