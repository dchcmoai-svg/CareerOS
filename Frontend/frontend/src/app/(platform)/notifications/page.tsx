"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { TelemetryStrip } from "@/components/ecosystem/TelemetryStrip";
import { OperationalCard } from "@/components/ecosystem/OperationalCard";
import { TactileButton } from "@/components/ecosystem/TactileButton";
import {
  Bell,
  ShieldAlert,
  Sparkles,
  Briefcase,
  Eye,
  TrendingUp,
  Filter,
  Search,
  ArrowUpDown
} from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ALL_ALERTS = [
  { id: 1, category: "ATS", title: "Resume Score Drop", message: "ATS score for Senior Frontend Roles dropped below 80%. Review diagnostics in Resume Lab.", time: "2 minutes ago", ageMinutes: 2, icon: ShieldAlert, priority: "high" },
  { id: 2, category: "Discovery", title: "Ghost Job Filtered", message: "3 roles hidden from feed with >80% ghost probability based on hiring velocity signals.", time: "1 hour ago", ageMinutes: 60, icon: Sparkles, priority: "medium" },
  { id: 3, category: "Marketplace", title: "Recruiter Profile View", message: "Infrastructure recruiter at Stripe viewed your profile. Match: React Architecture (91%).", time: "3 hours ago", ageMinutes: 180, icon: Eye, priority: "low" },
  { id: 4, category: "Tracker", title: "Pipeline Stalled — Acme Corp", message: "12 days in Applied stage. Historical velocity suggests follow-up at day 7.", time: "5 hours ago", ageMinutes: 300, icon: Briefcase, priority: "high" },
  { id: 5, category: "Discovery", title: "High-Velocity Opportunity", message: "New Stripe Senior Frontend role: 94% fit, 12% ghost risk, fast hiring velocity.", time: "6 hours ago", ageMinutes: 360, icon: TrendingUp, priority: "medium" },
  { id: 6, category: "Tracker", title: "Interview Reminder", message: "Stripe System Design interview in 48 hours. Prep guide available.", time: "1 day ago", ageMinutes: 1440, icon: Briefcase, priority: "high" },
];

const priorityStyles = {
  high: "border-l-warning",
  medium: "border-l-ai",
  low: "border-l-text-tertiary/30",
};

const PRIORITY_LEVELS = {
  high: 3,
  medium: 2,
  low: 1,
};

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPriority, setSelectedPriority] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "priority-desc" | "priority-asc" | "category">("recent");

  // Filtering alerts
  const filteredAlerts = ALL_ALERTS.filter((alert) => {
    // 1. Category / Hiring Phase Filter
    if (selectedCategory !== "All" && alert.category !== selectedCategory) {
      return false;
    }
    // 2. Urgency / Priority Filter
    if (selectedPriority !== "All" && alert.priority !== selectedPriority) {
      return false;
    }
    // 3. Search Context Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchTitle = alert.title.toLowerCase().includes(query);
      const matchMessage = alert.message.toLowerCase().includes(query);
      const matchCategory = alert.category.toLowerCase().includes(query);
      if (!matchTitle && !matchMessage && !matchCategory) {
        return false;
      }
    }
    return true;
  });

  // Sorting alerts
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortBy === "recent") {
      return a.ageMinutes - b.ageMinutes;
    }
    if (sortBy === "oldest") {
      return b.ageMinutes - a.ageMinutes;
    }
    if (sortBy === "priority-desc") {
      return PRIORITY_LEVELS[b.priority as keyof typeof PRIORITY_LEVELS] - PRIORITY_LEVELS[a.priority as keyof typeof PRIORITY_LEVELS];
    }
    if (sortBy === "priority-asc") {
      return PRIORITY_LEVELS[a.priority as keyof typeof PRIORITY_LEVELS] - PRIORITY_LEVELS[b.priority as keyof typeof PRIORITY_LEVELS];
    }
    if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  return (
    <div className="py-lg pb-xxl">
      <PageHeader
        title="Operational Alerts"
        subtitle="Intelligence-driven notifications. Not social noise — workflow signals that require action."
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

      {/* Controls panel */}
      <div className="flex flex-col gap-sm md:flex-row md:items-center justify-between p-3 rounded-xl border border-hairline bg-surface-1 mb-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* Categories (Hiring Phases) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "ATS", "Discovery", "Marketplace", "Tracker"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer border",
                  selectedCategory === cat
                    ? "bg-surface-3 text-text-primary border-hairline shadow-sm"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-surface-2/50 border-transparent"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative min-w-[200px] flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search context, keywords..."
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-surface-2 border border-hairline text-[12px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary/50 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-tertiary hover:text-text-secondary"
              >
                Clear
              </button>
            )}
          </div>

          {/* Urgency select */}
          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface-2 border border-hairline text-[12px] text-text-secondary focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="All">All Priority</option>
              <option value="high">🔴 High Urgency</option>
              <option value="medium">🟡 Medium Urgency</option>
              <option value="low">🔵 Low Urgency</option>
            </select>
          </div>

          {/* Sort select */}
          <div className="relative flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-surface-2 border border-hairline text-[12px] text-text-secondary focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
            >
              <option value="recent">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority-desc">Urgency: High to Low</option>
              <option value="priority-asc">Urgency: Low to High</option>
              <option value="category">Category (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-sm"
      >
        {sortedAlerts.map((alert) => {
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

        {/* Empty state */}
        {sortedAlerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-xl border border-dashed border-hairline rounded-xl bg-surface-1/30 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mb-md border border-hairline">
              <Bell className="w-5 h-5 text-text-tertiary" />
            </div>
            <h4 className="text-[14px] font-semibold text-text-primary">No operational alerts found</h4>
            <p className="text-[12px] text-text-tertiary mt-1 max-w-sm">
              We couldn't find any signals matching your current category, priority, or search criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedPriority("All");
                setSortBy("recent");
              }}
              className="mt-lg text-[12px] font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
