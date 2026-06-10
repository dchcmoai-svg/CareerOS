"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  FileText,
  Radar,
  Users,
  Zap,
  TrendingUp,
  GitBranch,
  Eye,
  Gift,
} from "lucide-react";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";
import { useCareerGraph } from "@/lib/career-graph";
import { staggerContainer, slideUpVariants, staggerItem } from "@/lib/motion";
import { IntelligenceCard } from "@/components/intelligence/IntelligenceCard";
import {
  PRIORITY_ACTIONS,
  HEALTH_METRICS,
  TOP_OPPORTUNITIES,
} from "@/lib/mission-control";
import { missionControl as mc } from "@/lib/copy";
import { cn } from "@/lib/utils";

const healthIcons = {
  career: Radar,
  resume: FileText,
  pipeline: Activity,
  market: TrendingUp,
} as const;

interface MissionControlDashboardProps {
  userName: string;
}

export function MissionControlDashboard({ userName }: MissionControlDashboardProps) {
  const { profile, refreshProfile } = useUserEcosystem();
  const applications = useCareerGraph((s) => s.applications);
  const [claimCode, setClaimCode] = useState("");
  const [submittingClaim, setSubmittingClaim] = useState(false);

  const handleClaimReferral = async () => {
    if (!claimCode.trim()) return;
    setSubmittingClaim(true);
    try {
      const res = await fetch("/api/user/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: claimCode.trim() }),
      });
      if (res.ok) {
        alert("Referral claimed successfully! Your friend has been credited $50.");
        setClaimCode("");
        await refreshProfile();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to claim referral code.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to claim referral.");
    } finally {
      setSubmittingClaim(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-lg py-md pb-xl"
    >
      {/* Header */}
      <motion.header variants={slideUpVariants} className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
          {mc.eyebrow}
        </p>
        <h1 className="text-display text-2xl md:text-3xl font-semibold text-text-primary tracking-[-0.03em]">
          {mc.title(userName)}
        </h1>
        <p className="text-[14px] text-text-secondary max-w-2xl leading-relaxed">{mc.subtitle}</p>
      </motion.header>

      {/* Level 1 — What should I do next? */}
      <motion.section variants={slideUpVariants} className="space-y-sm">
        <div className="flex items-center justify-between gap-md">
          <h2 className="text-[13px] font-semibold text-text-primary">{mc.level1}</h2>
          <span className="text-[10px] text-text-tertiary">{mc.level1Hint}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          {PRIORITY_ACTIONS.map((action) => (
            <motion.div key={action.id} variants={staggerItem}>
              <IntelligenceCard
                title={action.title}
                subtitle={action.reason}
                domain={action.domain}
                href={action.href}
                className={cn(
                  action.urgency === "high" && "ring-1 ring-warning/20"
                )}
                footer={
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                      {action.urgency === "high" ? mc.urgent : mc.recommended}
                    </span>
                    <span className="text-[12px] font-semibold text-primary flex items-center gap-1">
                      {action.cta}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                }
              >
                <div className="h-1" />
              </IntelligenceCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Level 2 — Career state */}
      <motion.section variants={slideUpVariants} className="space-y-sm">
        <h2 className="text-[13px] font-semibold text-text-primary">{mc.level2}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          {HEALTH_METRICS.map((metric) => {
            const Icon = healthIcons[metric.id as keyof typeof healthIcons] ?? Radar;
            return (
              <motion.div key={metric.id} variants={staggerItem}>
                <IntelligenceCard
                  title={metric.label}
                  icon={Icon}
                  domain={metric.domain}
                  href={metric.href}
                  progress={metric.progress}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-text-primary tabular-nums tracking-tight">
                      {metric.value}
                    </span>
                    {metric.delta && (
                      <span
                        className={cn(
                          "text-[11px] font-medium",
                          metric.trend === "up" ? "text-success" : "text-text-tertiary"
                        )}
                      >
                        {metric.delta}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-text-tertiary mt-2 leading-relaxed">{metric.hint}</p>
                </IntelligenceCard>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Level 3 — Supporting intelligence */}
      <motion.section variants={slideUpVariants} className="space-y-sm">
        <h2 className="text-[13px] font-semibold text-text-primary">{mc.level3}</h2>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-md">
          {/* Opportunity intelligence */}
          <motion.div variants={staggerItem} className="xl:col-span-2">
            <IntelligenceCard
              title={mc.opportunities}
              subtitle={mc.opportunitiesHint}
              icon={Zap}
              domain="primary"
              href="/jobs"
            >
              <div className="space-y-2">
                {TOP_OPPORTUNITIES.map((opp) => (
                  <Link
                    key={opp.id}
                    href={opp.href}
                    className="block p-3 rounded-lg border border-hairline bg-surface-2/40 hover:bg-surface-2 hover:border-border-strong transition-all group"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div>
                        <p className="text-[13px] font-semibold text-text-primary group-hover:text-primary transition-colors">
                          {opp.role}
                        </p>
                        <p className="text-[11px] text-text-tertiary">{opp.company}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-success tabular-nums">{opp.match}%</p>
                        <p className="text-[10px] text-text-tertiary">{opp.response}% respond</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-text-secondary leading-snug mb-2">{opp.why}</p>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-resume/10 text-resume border border-resume/20">
                        <GitBranch className="w-3 h-3" />
                        {opp.resumeBranch}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-semibold">
                        {opp.action}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </IntelligenceCard>
          </motion.div>

          {/* Recruiter + vault column */}
          <motion.div variants={staggerItem} className="flex flex-col gap-md">
            <IntelligenceCard
              title={mc.recruiterSignals}
              subtitle={mc.recruiterHint}
              icon={Users}
              domain="recruiter"
              href="/marketplace"
            >
              <ul className="space-y-3 text-[12px]">
                <li className="flex gap-2">
                  <Eye className="w-3.5 h-3.5 text-recruiter shrink-0 mt-0.5" />
                  <span className="text-text-secondary">
                    Vercel recruiter searched <strong className="text-text-primary">Rust + WASM</strong>
                  </span>
                </li>
                <li className="flex gap-2">
                  <Eye className="w-3.5 h-3.5 text-recruiter shrink-0 mt-0.5" />
                  <span className="text-text-secondary">2 profile views today · stealth mode on</span>
                </li>
                <li className="flex gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-market shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Series B infra demand up 18% for your stack</span>
                </li>
              </ul>
            </IntelligenceCard>

            <IntelligenceCard
              title={mc.careerVault}
              subtitle={mc.vaultHint}
              icon={FileText}
              domain="pipeline"
              href="/profile"
              footer={
                <Link
                  href="/profile"
                  className="block w-full text-center py-2 rounded-lg border border-hairline text-[12px] font-semibold text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors"
                >
                  Open career vault
                </Link>
              }
            >
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-md bg-surface-2 border border-hairline">
                  <p className="text-text-tertiary">Applications</p>
                  <p className="text-lg font-bold text-text-primary tabular-nums">{applications.length}</p>
                </div>
                <div className="p-2 rounded-md bg-surface-2 border border-hairline">
                  <p className="text-text-tertiary">Resume versions</p>
                  <p className="text-lg font-bold text-text-primary tabular-nums">4</p>
                </div>
              </div>
              </IntelligenceCard>

            <IntelligenceCard
              title="Referral Rewards"
              subtitle="Refer developers to earn rewards!"
              icon={Gift}
              domain="success"
              href="#"
            >
              <div className="space-y-3 text-[11px]">
                <div className="p-2.5 rounded-md bg-surface-2 border border-hairline flex justify-between items-center">
                  <div className="min-w-0">
                    <p className="text-text-tertiary font-medium">Your Referral Code</p>
                    <p className="text-xs font-bold text-primary mt-0.5 select-all truncate">{profile?.referralCode || "—"}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (profile?.referralCode) {
                        navigator.clipboard.writeText(profile.referralCode);
                        alert("Referral code copied to clipboard!");
                      }
                    }}
                    className="px-2 py-1 bg-surface-1 hover:bg-surface-3 border border-hairline rounded text-[10px] font-semibold text-text-secondary shrink-0"
                  >
                    Copy
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-md bg-surface-2 border border-hairline">
                    <p className="text-text-tertiary">Referred Friends</p>
                    <p className="text-lg font-bold text-text-primary tabular-nums">{profile?.referredUsersCount || 0}</p>
                  </div>
                  <div className="p-2 rounded-md bg-success/10 border border-success/20">
                    <p className="text-success font-semibold">Earned</p>
                    <p className="text-lg font-bold text-success tabular-nums">${profile?.referralEarnings || 0}</p>
                  </div>
                </div>

                {!profile?.referredBy && (
                  <div className="pt-2 border-t border-hairline/80 flex flex-col gap-1.5">
                    <p className="text-[10px] font-bold text-text-secondary uppercase">Claim Referral Reward</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Friend's code (e.g. name_1234)"
                        value={claimCode}
                        onChange={(e) => setClaimCode(e.target.value)}
                        disabled={submittingClaim}
                        className="flex-1 bg-surface-2 border border-hairline rounded px-2.5 py-1 text-[11px] text-text-primary focus:outline-none focus:border-success/50"
                      />
                      <button
                        onClick={handleClaimReferral}
                        disabled={submittingClaim || !claimCode.trim()}
                        className="px-2.5 py-1 bg-success text-white text-[11px] font-semibold rounded hover:bg-success/90 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                      >
                        {submittingClaim ? "..." : "Claim"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </IntelligenceCard>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
