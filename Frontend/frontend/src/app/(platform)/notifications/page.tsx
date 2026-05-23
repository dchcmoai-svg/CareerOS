"use client";

import React from "react";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { TelemetryStrip } from "@/components/ecosystem/TelemetryStrip";
import { OperationalCard } from "@/components/ecosystem/OperationalCard";
import { TactileButton } from "@/components/ecosystem/TactileButton";
import { Bell, ShieldAlert, Sparkles, Briefcase, Eye, TrendingUp, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

const ALL_ALERTS = [
  { id: 1, category: "ATS", title: "Resume Score Drop", message: "ATS score for Senior Frontend Roles dropped below 80%. Review diagnostics in Resume Lab.", time: "2 minutes ago", icon: ShieldAlert, priority: "high" },
  { id: 2, category: "Discovery", title: "Ghost Job Filtered", message: "3 roles hidden from feed with >80% ghost probability based on hiring velocity signals.", time: "1 hour ago", icon: Sparkles, priority: "medium" },
  { id: 3, category: "Marketplace", title: "Recruiter Profile View", message: "Infrastructure recruiter at Stripe viewed your profile. Match: React Architecture (91%).", time: "3 hours ago", icon: Eye, priority: "low" },
  { id: 4, category: "Tracker", title: "Pipeline Stalled — Acme Corp", message: "12 days in Applied stage. Historical velocity suggests follow-up at day 7.", time: "5 hours ago", icon: Briefcase, priority: "high" },
  { id: 5, category: "Discovery", title: "High-Velocity Opportunity", message: "New Stripe Senior Frontend role: 94% fit, 12% ghost risk, fast hiring velocity.", time: "6 hours ago", icon: TrendingUp, priority: "medium" },
  { id: 6, category: "Tracker", title: "Interview Reminder", message: "Stripe System Design interview in 48 hours. Prep guide available.", time: "1 day ago", icon: Briefcase, priority: "high" },
];

const priorityStyles = {
  high: "border-l-warning",
  medium: "border-l-ai",
  low: "border-l-text-tertiary/30",
};

export default function NotificationsPage() {
  return (
    <div className="py-lg pb-xxl">
      <PageHeader
        title="Operational Alerts"
        subtitle="Intelligence-driven notifications. Not social noise — workflow signals that require action."
        actions={
          <TactileButton variant="secondary" size="sm" icon={Filter}>
            Filter
          </TactileButton>
        }
        telemetry={
          <TelemetryStrip
            metrics={[
              { label: "Unread", value: "4", sublabel: "Action required", status: "warning", icon: Bell },
              { label: "This Week", value: "12", sublabel: "Operational signals", status: "neutral" },
              { label: "High Priority", value: "3", sublabel: "Needs response", status: "danger" },
              { label: "Resolved", value: "28", sublabel: "Last 30 days", status: "success" },
            ]}
          />
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-sm"
      >
        {ALL_ALERTS.map((alert) => {
          const Icon = alert.icon;
          return (
            <motion.div key={alert.id} variants={staggerItem}>
              <OperationalCard
                interactive
                density="compact"
                className={`border-l-2 ${priorityStyles[alert.priority as keyof typeof priorityStyles]}`}
              >
                <div className="flex items-start gap-md">
                  <div className="w-9 h-9 rounded-md bg-surface-3 border border-hairline flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-sm mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">{alert.category}</span>
                      <span className="text-[10px] text-text-tertiary">·</span>
                      <span className="text-[10px] text-text-tertiary">{alert.time}</span>
                    </div>
                    <h3 className="text-[14px] font-semibold text-text-primary mb-1">{alert.title}</h3>
                    <p className="text-[12px] text-text-secondary leading-relaxed">{alert.message}</p>
                  </div>
                  <TactileButton variant="ghost" size="sm">Review</TactileButton>
                </div>
              </OperationalCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
