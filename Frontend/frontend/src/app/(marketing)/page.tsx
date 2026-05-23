"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Briefcase, 
  FileText, 
  BarChart, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Code, 
  Lock, 
  User, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Activity,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { CinematicHero } from "@/components/marketing/CinematicHero";
import { OrchestrationPipeline } from "@/components/marketing/OrchestrationPipeline";
import { CommandCenterReveal } from "@/components/marketing/CommandCenterReveal";
import { EcosystemMap } from "@/components/marketing/EcosystemMap";
import { InfrastructureCredibility } from "@/components/marketing/InfrastructureCredibility";
import { LandingComparison } from "@/components/marketing/LandingComparison";

import { landing } from "@/lib/copy";

const STEPS = landing.steps;

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState("identity");

  // Mock states for interactive showcases
  const [skills, setSkills] = useState([
    { name: "React", status: "pending" },
    { name: "Rust", status: "pending" },
    { name: "Distributed Systems", status: "pending" }
  ]);
  const [stealth, setStealth] = useState(true);
  const [rationalOpen, setRationaleOpen] = useState(true);

  const handleVerifySkill = (index: number, action: "accept" | "reject") => {
    const updated = [...skills];
    updated[index].status = action === "accept" ? "verified" : "rejected";
    setSkills(updated);
  };

  return (
    <main className="min-h-screen bg-canvas text-text-primary overflow-hidden flex flex-col relative selection:bg-ai/30">
      <MarketingNav />
      <CinematicHero />
      <OrchestrationPipeline />
      <CommandCenterReveal />
      <EcosystemMap />
      <LandingComparison />

      {/* Premium Interactive Showcase Section */}
      <section id="demo" className="w-full max-w-6xl mx-auto px-lg pb-[120px] relative z-10 scroll-mt-10">
        <div className="flex flex-col gap-sm mb-6 text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-ai">{landing.demoTitle}</h2>
          <p className="text-2xl font-bold text-text-primary">{landing.demoSubtitle}</p>
        </div>

        {/* Tab System */}
        <div className="grid grid-cols-2 md:grid-cols-5 border border-hairline bg-surface-1/40 rounded-t-xl overflow-hidden divide-x divide-hairline">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`px-md py-4 text-left transition-colors relative flex flex-col justify-between ${
                activeStep === step.id 
                  ? "bg-surface-2 text-text-primary" 
                  : "text-text-secondary hover:bg-surface-1/60 hover:text-text-primary"
              }`}
            >
              {activeStep === step.id && (
                <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-ai" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary block mb-1">{step.title}</span>
              <span className="text-[12px] font-bold tracking-tight">{step.short}</span>
            </button>
          ))}
        </div>

        {/* Interactive Viewer Screen */}
        <div className="w-full min-h-[460px] rounded-b-xl border-x border-b border-hairline bg-surface-1/25 backdrop-blur-md overflow-hidden relative shadow-2xl p-6 flex flex-col md:flex-row gap-6">
          
          {/* Left panel: Info & Explanation */}
          <div className="flex-1 flex flex-col justify-between p-2">
            <div>
              <div className="w-8 h-8 rounded bg-surface-2 border border-hairline flex items-center justify-center mb-4">
                {activeStep === "identity" && <User className="w-4 h-4 text-ai" />}
                {activeStep === "discovery" && <Briefcase className="w-4 h-4 text-ai" />}
                {activeStep === "tracker" && <Activity className="w-4 h-4 text-ai" />}
                {activeStep === "resume" && <Code className="w-4 h-4 text-ai" />}
                {activeStep === "marketplace" && <SlidersHorizontal className="w-4 h-4 text-ai" />}
              </div>
              <h3 className="text-lg font-bold text-text-primary tracking-tight mb-2">
                {STEPS.find(s => s.id === activeStep)?.title.split(". ")[1]}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                {STEPS.find(s => s.id === activeStep)?.description}
              </p>
            </div>

            <div className="bg-surface-2/40 border border-hairline rounded p-3 text-[11px] text-text-tertiary">
              <span className="text-ai font-bold block uppercase text-[9px] tracking-widest mb-1">Live update</span>
              {activeStep === "identity" && landing.demoSignals.identity}
              {activeStep === "discovery" && landing.demoSignals.discovery}
              {activeStep === "tracker" && landing.demoSignals.tracker}
              {activeStep === "resume" && landing.demoSignals.resume}
              {activeStep === "marketplace" && landing.demoSignals.marketplace}
            </div>
          </div>

          {/* Right panel: Living Interactive Mock Surface */}
          <div className="flex-[2] bg-surface-1 border border-hairline rounded-lg p-5 flex flex-col relative shadow-inner overflow-hidden min-h-[340px] justify-center">
            <AnimatePresence mode="wait">
              {activeStep === "identity" && (
                <motion.div
                  key="identity-showcase"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  className="flex flex-col gap-4 max-w-sm mx-auto w-full"
                >
                  <div className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1.5 border-b border-hairline pb-2">
                    <Sparkles className="w-3.5 h-3.5 text-ai" /> Quick Verification
                  </div>
                  <p className="text-[12px] text-text-secondary leading-relaxed">
                    We found these skills from your GitHub profile. Confirm them to improve your job matches:
                  </p>
                  <div className="flex flex-col gap-2">
                    {skills.map((skill, index) => (
                      <div key={skill.name} className="flex items-center justify-between bg-surface-2 border border-hairline p-2.5 rounded text-xs transition-colors">
                        <span className="font-semibold">{skill.name}</span>
                        {skill.status === "pending" ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleVerifySkill(index, "reject")}
                              className="px-2 py-1 bg-surface-3 hover:bg-danger/10 hover:text-danger border border-hairline rounded font-bold text-[10px] uppercase transition-all duration-75"
                            >
                              Ignore
                            </button>
                            <button
                              onClick={() => handleVerifySkill(index, "accept")}
                              className="px-2 py-1 bg-ai text-canvas hover:bg-ai-hover rounded font-bold text-[10px] uppercase transition-all duration-75"
                            >
                              Verify
                            </button>
                          </div>
                        ) : (
                          <span className={`text-[10px] font-bold uppercase ${
                            skill.status === "verified" ? "text-success" : "text-text-tertiary"
                          }`}>
                            {skill.status === "verified" ? "✓ Verified" : "✕ Ignored"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeStep === "discovery" && (
                <motion.div
                  key="discovery-showcase"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  className="flex flex-col gap-3 w-full"
                >
                  {/* High density OpportunityCard */}
                  <div className="border border-border-strong bg-surface-2 rounded-lg p-4 text-left relative shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-base font-bold">Staff Software Engineer</h4>
                        <div className="flex gap-2 text-[10px] text-text-tertiary font-medium mt-0.5">
                          <span>Vercel</span>
                          <span>•</span>
                          <span>San Francisco (Hybrid)</span>
                          <span>•</span>
                          <span>$210k - $240k Base</span>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 rounded bg-surface-3 border border-hairline text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-text-primary">
                        <Sparkles className="w-3 h-3 text-ai" /> 94% Fit
                      </div>
                    </div>

                    <div className="flex gap-1.5 flex-wrap my-3">
                      <span className="text-[9px] font-bold bg-success/10 text-success border border-success/20 px-1.5 py-0.5 rounded">
                        88% response likelihood
                      </span>
                      <span className="text-[9px] font-bold bg-success/10 text-success border border-success/20 px-1.5 py-0.5 rounded">
                        Hiring fast
                      </span>
                      <span className="text-[9px] font-bold bg-surface-3 border border-hairline text-text-secondary px-1.5 py-0.5 rounded">
                        Sponsorship: High
                      </span>
                    </div>

                    <button 
                      onClick={() => setRationaleOpen(!rationalOpen)}
                      className="text-[10px] font-bold text-text-secondary flex items-center gap-1 hover:text-text-primary transition-colors"
                    >
                      {rationalOpen ? "Hide why this matches" : "Why this matches"} <ChevronRight className={`w-3 h-3 transform transition-transform ${rationalOpen ? "rotate-90" : ""}`} />
                    </button>

                    {rationalOpen && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-hairline text-[11px] text-text-secondary leading-relaxed"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-ai inline mr-1 -mt-0.5" />
                        <strong>Why this matches</strong>: Your Next.js and React experience aligns strongly with this role. Your tailored resume covers most of the keywords recruiters search for.
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeStep === "tracker" && (
                <motion.div
                  key="tracker-showcase"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  className="flex flex-col gap-3 w-full"
                >
                  <div className="text-xs font-bold text-text-secondary uppercase tracking-widest border-b border-hairline pb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-warning" /> Your applications
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-surface-2 border border-hairline rounded p-2.5 text-left">
                      <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-wider block mb-2">Applied (3)</span>
                      <div className="bg-surface-3 border border-hairline rounded p-1.5 text-[11px]">
                        <span className="font-semibold block">Acme Corp</span>
                        <span className="text-[9px] text-text-tertiary block mt-0.5">Applied 4d ago</span>
                      </div>
                    </div>
                    <div className="bg-surface-2 border border-hairline rounded p-2.5 text-left">
                      <span className="text-[9px] font-bold text-warning uppercase tracking-wider block mb-2">Interview (1)</span>
                      <div className="bg-surface-3 border border-hairline rounded p-1.5 text-[11px] relative overflow-hidden">
                        <div className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-danger" />
                        <span className="font-semibold block text-text-primary">Stripe</span>
                        <span className="text-[9px] text-danger block mt-0.5">In stage 14d (Stalled)</span>
                      </div>
                    </div>
                    <div className="bg-surface-2 border border-hairline rounded p-2.5 text-left">
                      <span className="text-[9px] font-bold text-success uppercase tracking-wider block mb-2">Offers (1)</span>
                      <div className="bg-surface-3 border border-hairline rounded p-1.5 text-[11px] bg-success/5 border-success/20">
                        <span className="font-semibold block text-success">Linear</span>
                        <span className="text-[9px] text-success/80 block mt-0.5">$220k Base</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 p-2 bg-warning/5 border border-warning/15 rounded flex gap-2 items-start text-left text-[11px] leading-relaxed text-warning">
                    <Activity className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Reminder</strong>: Stripe hasn't moved in 14 days. Want help drafting a short follow-up message?</span>
                  </div>
                </motion.div>
              )}

              {activeStep === "resume" && (
                <motion.div
                  key="resume-showcase"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  className="flex flex-col gap-3 w-full"
                >
                  <div className="text-xs font-bold text-text-secondary uppercase tracking-widest border-b border-hairline pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-ai" /> Resume suggestions
                    </div>
                    <span className="text-[10px] bg-surface-3 px-1.5 py-0.5 rounded border border-hairline font-mono text-text-tertiary">branch: feature/stripe-frontend</span>
                  </div>
                  <div className="bg-canvas border border-hairline rounded p-4 font-mono text-xs text-left leading-relaxed text-text-secondary relative">
                    <div className="border-b border-hairline pb-2 mb-2 flex justify-between items-center text-[10px] text-text-tertiary">
                      <span>EXPERIENCE: VERCEL</span>
                      <span className="text-warning">2 Warnings</span>
                    </div>
                    <p>
                      - Lead development on Vercel RSC routing infrastructure,{" "}
                      <span className="relative inline-block border-b-2 border-dashed border-danger bg-danger/5 px-1 rounded cursor-pointer group">
                        improving velocities
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-1 border border-hairline text-[9px] rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 text-text-primary leading-normal">
                          <strong className="text-danger">Weak Action Verb & Metric Gap</strong><br/>
                          Specify *how much* velocity increased. (e.g. "improving routing velocity by 45%").
                        </span>
                      </span>{" "}
                      across all platforms.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeStep === "marketplace" && (
                <motion.div
                  key="marketplace-showcase"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                  className="flex flex-col gap-4 max-w-sm mx-auto w-full text-left"
                >
                  <div className="text-xs font-bold text-text-secondary uppercase tracking-widest border-b border-hairline pb-2 flex items-center justify-between">
                    <span>Who can see you</span>
                    <span className="text-[10px] text-success font-bold">Stealth: {stealth ? "On" : "Off"}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between bg-surface-2 border border-hairline p-3 rounded">
                      <div>
                        <span className="font-semibold text-xs block text-text-primary">Hide from current employer</span>
                        <span className="text-[10px] text-text-tertiary block mt-0.5">Your company won&apos;t see your profile</span>
                      </div>
                      <button
                        onClick={() => setStealth(!stealth)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${stealth ? "bg-ai" : "bg-surface-3"}`}
                      >
                        <div className={`w-4 h-4 bg-canvas rounded-full transition-transform ${stealth ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </div>

                    <div className="bg-surface-2 border border-hairline p-3 rounded flex flex-col gap-1">
                      <span className="font-semibold text-xs block text-text-primary">Minimum salary</span>
                      <div className="flex justify-between items-center text-[11px] text-text-secondary mt-1">
                        <span>Only show roles from <strong>$180k/yr</strong> and up</span>
                        <span className="text-ai font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      <InfrastructureCredibility />

      {/* Footer */}
      <footer className="h-14 border-t border-hairline/50 flex items-center justify-between px-lg text-xs text-text-tertiary bg-surface-1">
        <span>© 2026 CareerOS Inc. All rights reserved.</span>
        <div className="flex flex-wrap gap-md font-medium">
          <Link href="/product" className="hover:text-text-secondary">Product</Link>
          <Link href="/discovery" className="hover:text-text-secondary">{landing.footerJobs}</Link>
          <Link href="/docs" className="hover:text-text-secondary">{landing.footerHelp}</Link>
          <Link href="/about" className="hover:text-text-secondary">About</Link>
        </div>
      </footer>
    </main>
  );
}
