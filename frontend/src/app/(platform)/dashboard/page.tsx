"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, slideUpVariants } from "@/lib/motion";
import { useSession } from "next-auth/react";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";
import { 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Activity, 
  BrainCircuit, 
  Eye, 
  Search, 
  GitBranch, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  Maximize2,
  Bell,
  FileText,
  Send,
} from "lucide-react";
import Link from "next/link";
import { TelemetryStrip } from "@/components/ecosystem/TelemetryStrip";
import { LiveContinuityStrip } from "@/components/motion/LiveContinuityStrip";
import { AnimatedProgress } from "@/components/motion/AnimatedProgress";

import { dashboard as dashCopy, nav } from "@/lib/copy";

const FOCUS_ROUTES = [
  { href: "/jobs", label: nav.jobs },
  { href: "/tracker", label: nav.tracker },
  { href: "/resume", label: nav.resume },
  { href: "/marketplace", label: nav.marketplace },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const { profile, isHydrated } = useUserEcosystem();
  const firstName = profile?.name?.split(" ")[0] || session?.user?.name?.split(" ")[0] || "there";

  const [checklist, setChecklist] = useState([
    { id: "c1", task: "Review Vercel fit scoring details", done: false },
    { id: "c2", task: "Optimize Stripe resume version (add 'Distributed Systems')", done: false },
    { id: "c3", task: "Reply to Acme recruiter inquiry", done: true },
    { id: "c4", task: "Audit LinkedIn profile visibility status", done: false }
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full flex flex-col gap-lg py-md pb-xl"
    >
      {/* 1. Header with Stats Bar */}
      <motion.div variants={slideUpVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-md pb-md border-b border-hairline relative">
        <div className="flex flex-col gap-xs">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            {dashCopy.title}
          </h1>
          <p className="text-text-secondary text-sm max-w-2xl">
            {isHydrated ? dashCopy.subtitle(firstName) : "Loading your workspace…"}
          </p>
          <p className="text-[12px] text-text-tertiary mt-2 max-w-2xl border-l-2 border-ai/30 pl-sm leading-relaxed">
            {dashCopy.pageGuide}
          </p>
        </div>

        <div className="flex items-center gap-sm flex-wrap">
          <div className="bg-surface-1 border border-hairline px-3 py-1.5 rounded flex items-center gap-2 text-xs" title={dashCopy.badges.stealth}>
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span className="text-text-secondary">Stealth mode</span>
            <span className="text-text-primary font-bold">On</span>
          </div>
          <div className="bg-surface-1 border border-hairline px-3 py-1.5 rounded flex items-center gap-2 text-xs" title={dashCopy.badges.resume}>
            <FileText className="w-3.5 h-3.5 text-ai" />
            <span className="text-text-secondary">{dashCopy.resumeScore}</span>
            <span className="text-text-primary font-bold">82%</span>
          </div>
          <div className="bg-surface-1 border border-hairline px-3 py-1.5 rounded flex items-center gap-2 text-xs" title={dashCopy.badges.momentum}>
            <Activity className="w-3.5 h-3.5 text-success" />
            <span className="text-text-secondary">On track</span>
            <span className="text-text-primary font-bold">3 apps</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={slideUpVariants} className="mb-md">
        <LiveContinuityStrip />
      </motion.div>

      <motion.div variants={slideUpVariants}>
        <TelemetryStrip
          metrics={[
            { label: dashCopy.highFitRoles, value: "12", sublabel: "Updated today", status: "intelligence", icon: Search },
            { label: dashCopy.resumeScore, value: "82%", sublabel: "Keep improving", status: "success", icon: FileText },
            { label: dashCopy.applications, value: "7", sublabel: "2 need follow-up", status: "warning", icon: Activity },
            { label: dashCopy.recruiterActivity, value: "3", sublabel: "Last 24h", status: "neutral", icon: Eye },
          ]}
        />
      </motion.div>

      {/* Job search flow strip */}
      <motion.div
        variants={slideUpVariants}
        className="flex flex-wrap items-center gap-xs p-sm bg-surface-1 border border-hairline rounded-lg"
      >
        <span className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary mr-sm">
          {dashCopy.liveFlow}
        </span>
        {["Profile", "Find Jobs", "Apply", "Track", "Resume", "Discover"].map((step, i) => (
          <React.Fragment key={step}>
            <span className="text-[11px] font-semibold text-text-secondary">{step}</span>
            {i < 5 && <ArrowRight className="w-3 h-3 text-hairline" />}
          </React.Fragment>
        ))}
        <span className="ml-auto text-[10px] text-success font-bold uppercase">{dashCopy.continuity}</span>
      </motion.div>

      {/* 2. Four-Column High Density Operational Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
        
        {/* Column 1: Pipeline Velocity & Stalls */}
        <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center border-b border-hairline pb-xs">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-success" /> Your applications
            </h3>
            <Link href="/tracker" className="text-[10px] font-bold text-ai hover:underline">View Board</Link>
          </div>

          <div className="flex flex-col gap-xs mt-xs">
            <div className="bg-surface-2/60 border border-hairline/50 p-2 rounded text-xs flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-text-primary">Stripe</span>
                <span className="text-[9px] font-bold text-success uppercase">Interview</span>
              </div>
              <span className="text-[10px] text-text-secondary">In interview · 4 days</span>
              <AnimatedProgress value={33} barClassName="bg-success" className="mt-0.5 h-1" delay={0.1} />
            </div>

            <div className="bg-surface-2/60 border border-hairline/50 p-2 rounded text-xs flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-text-primary">Acme Corp</span>
                <span className="text-[9px] font-bold text-warning uppercase">Needs follow-up</span>
              </div>
              <span className="text-[10px] text-warning">In stage 12 days</span>
              <AnimatedProgress value={80} barClassName="bg-warning" className="mt-0.5 h-1" delay={0.2} />
            </div>

            <div className="bg-surface-2/60 border border-hairline/50 p-2 rounded text-xs flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-text-primary">Vercel</span>
                <span className="text-[9px] font-bold text-text-tertiary uppercase">Applied</span>
              </div>
              <span className="text-[10px] text-text-secondary">In stage 2 days</span>
              <AnimatedProgress value={20} barClassName="bg-ai" className="mt-0.5 h-1" delay={0.3} />
            </div>
          </div>
        </motion.div>

        {/* Column 2: Opportunity Momentum (Jobs Feed) */}
        <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center border-b border-hairline pb-xs">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-ai" /> {dashCopy.modules.jobs}
            </h3>
            <Link href="/jobs" className="text-[10px] font-bold text-ai hover:underline">Browse all</Link>
          </div>
          <p className="text-[10px] text-text-tertiary -mt-2 mb-1">{dashCopy.modules.jobsHint}</p>

          <div className="flex flex-col gap-xs mt-xs">
            <div className="bg-surface-2/60 border border-hairline/50 p-2 rounded text-xs flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-text-primary truncate">Linear</span>
                <span className="text-[9px] font-bold text-ai uppercase bg-ai/10 px-1 rounded">96% match</span>
              </div>
              <span className="text-[10px] text-text-secondary">Product Engineer • Remote</span>
              <span className="text-[9px] text-success">Actively hiring</span>
            </div>

            <div className="bg-surface-2/60 border border-hairline/50 p-2 rounded text-xs flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-text-primary truncate">Bloomberg</span>
                <span className="text-[9px] font-bold text-success uppercase bg-success/10 px-1 rounded">90% match</span>
              </div>
              <span className="text-[10px] text-text-secondary">Senior Engineer • NYC</span>
              <span className="text-[9px] text-text-tertiary">Steady hiring pace</span>
            </div>

            <div className="bg-surface-2/60 border border-hairline/50 p-2 rounded text-xs flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-text-primary truncate">Stripe</span>
                <span className="text-[9px] font-bold text-ai uppercase bg-ai/10 px-1 rounded">92% match</span>
              </div>
              <span className="text-[10px] text-text-secondary">Frontend Engineer • SF</span>
              <span className="text-[9px] text-success">Likely to respond</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center border-b border-hairline pb-xs">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-text-secondary" /> {dashCopy.modules.recruiters}
            </h3>
            <Link href="/marketplace" className="text-[10px] font-bold text-ai hover:underline">Settings</Link>
          </div>
          <p className="text-[10px] text-text-tertiary -mt-2 mb-1">{dashCopy.modules.recruitersHint}</p>

          <div className="flex flex-col gap-xs mt-xs">
            <div className="bg-surface-2/60 border border-hairline/50 p-2 rounded text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider font-bold text-text-tertiary">Recruiter search</span>
                <span className="text-[9px] text-text-tertiary">1h ago</span>
              </div>
              <p className="text-[11px] text-text-primary leading-tight">
                A Vercel recruiter searched for <span className="text-ai font-medium">Rust + WebAssembly</span> — skills on your profile.
              </p>
            </div>

            <div className="bg-surface-2/60 border border-hairline/50 p-2 rounded text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider font-bold text-text-tertiary">Resume viewed</span>
                <span className="text-[9px] text-text-tertiary">4h ago</span>
              </div>
              <p className="text-[11px] text-text-primary leading-tight">
                Someone at Stripe opened your tailored resume for frontend roles.
              </p>
            </div>

            <div className="bg-surface-2/60 border border-hairline/50 p-2 rounded text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-wider font-bold text-text-tertiary">Inbound interest</span>
                <span className="text-[9px] text-text-tertiary">1d ago</span>
              </div>
              <p className="text-[11px] text-text-primary leading-tight">
                A Series A startup requested to connect — your employer stays hidden in stealth mode.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center border-b border-hairline pb-xs">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-ai" /> {dashCopy.modules.assistant}
            </h3>
          </div>
          <p className="text-[10px] text-text-tertiary -mt-2 mb-1">{dashCopy.modules.assistantHint}</p>

          <div className="flex-1 flex flex-col gap-sm mt-xs">
            <div className="bg-surface-2/60 border border-hairline/50 p-3 rounded text-xs flex flex-col gap-2">
              <p className="text-[11px] text-text-secondary leading-relaxed font-medium">
                {dashCopy.assistantQuote}
              </p>
              <Link
                href="/resume"
                className="mt-2 text-canvas bg-ai hover:bg-ai-hover transition-colors px-2 py-1.5 rounded text-[11px] font-bold flex items-center justify-center gap-xs"
              >
                {dashCopy.assistantCta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Secondary operational row: ATS + Apply + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm">
          <div className="flex justify-between items-center border-b border-hairline pb-xs">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-ai" /> Resume score
            </h3>
            <Link href="/resume" className="text-[10px] font-bold text-ai hover:underline flex items-center gap-0.5">
              Focus <Maximize2 className="w-3 h-3" />
            </Link>
          </div>
          <div className="text-[11px] text-text-secondary space-y-2 mt-xs">
            <p>
              Active branch: <span className="font-mono text-ai">feature/stripe-frontend</span>
            </p>
            <p className="text-warning">2 suggestions · Add &quot;Distributed Systems&quot;</p>
            <AnimatedProgress value={82} barClassName="bg-success" delay={0.15} />
          </div>
        </motion.div>

        <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm">
          <div className="flex justify-between items-center border-b border-hairline pb-xs">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-success" /> {dashCopy.modules.apply}
            </h3>
            <Link href="/jobs" className="text-[10px] font-bold text-ai hover:underline flex items-center gap-0.5">
              Focus <Maximize2 className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-xs mt-xs">
            <div className="p-2 bg-surface-2/60 border border-hairline/50 rounded text-[11px]">
              <span className="font-bold text-text-primary block">Vercel — Staff Engineer</span>
              <span className="text-text-tertiary">Resume tailored · ready to submit</span>
            </div>
            <button className="w-full py-1.5 bg-ai hover:bg-ai-hover text-canvas rounded text-[10px] font-bold">
              Review & apply
            </button>
          </div>
        </motion.div>

        <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm">
          <div className="flex justify-between items-center border-b border-hairline pb-xs">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-warning" /> {dashCopy.modules.alerts}
            </h3>
            <Link href="/notifications" className="text-[10px] font-bold text-ai hover:underline flex items-center gap-0.5">
              All <Maximize2 className="w-3 h-3" />
            </Link>
          </div>
          <ul className="flex flex-col gap-xs mt-xs text-[11px] text-text-secondary">
            <li className="flex gap-2"><Clock className="w-3 h-3 text-warning flex-shrink-0" /> Acme interview stalled 12d</li>
            <li className="flex gap-2"><MessageSquare className="w-3 h-3 text-ai flex-shrink-0" /> Stripe recruiter reply pending</li>
            <li className="flex gap-2"><TrendingUp className="w-3 h-3 text-success flex-shrink-0" /> Profile visibility +12% this week</li>
          </ul>
        </motion.div>
      </div>

      {/* Focus mode expansion */}
      <motion.div variants={slideUpVariants} className="grid grid-cols-2 md:grid-cols-4 gap-xs">
        {FOCUS_ROUTES.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="flex items-center justify-between px-sm py-2.5 bg-surface-1 border border-hairline rounded-md hover:bg-surface-2 hover:border-border-strong transition-all group"
          >
            <span className="text-[11px] font-semibold text-text-secondary group-hover:text-text-primary">
              {route.label}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-ai transition-colors" />
          </Link>
        ))}
      </motion.div>

      {/* 3. Workflow Prioritization Checklist */}
      <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
        <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-hairline pb-xs mb-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" /> {dashCopy.modules.checklist}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
          {checklist.map(item => (
            <div 
              key={item.id} 
              onClick={() => toggleCheck(item.id)}
              className="flex items-center gap-3 p-3 bg-surface-2/40 border border-hairline/60 rounded cursor-pointer hover:bg-surface-2 transition-colors group"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                item.done 
                  ? "bg-success border-success text-canvas" 
                  : "border-hairline group-hover:border-text-secondary"
              }`}>
                {item.done && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-xs font-medium transition-all ${
                item.done ? "text-text-tertiary line-through" : "text-text-primary"
              }`}>
                {item.task}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
