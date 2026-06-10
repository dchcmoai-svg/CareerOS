"use client";

import React, { useState, useEffect } from "react";
import { TrackerBoard } from "@/components/tracker/TrackerBoard";
import { PipelineDetailPanel } from "@/components/tracker/PipelineDetailPanel";
import { useCareerGraph } from "@/lib/career-graph";
import { Plus, Search, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, slideUpVariants } from "@/lib/motion";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { TelemetryStrip } from "@/components/ecosystem/TelemetryStrip";
import { IntelligenceCard } from "@/components/intelligence/IntelligenceCard";
import { tracker as trackerCopy } from "@/lib/copy";
import { Activity, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function TrackerPage() {
  const applications = useCareerGraph((s) => s.applications);
  const selectApplication = useCareerGraph((s) => s.selectApplication);
  const selectedApplicationId = useCareerGraph((s) => s.selectedApplicationId);
  const setApplications = useCareerGraph((s) => s.setApplications);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => {
        if (data.applications) {
          setApplications(data.applications);
        }
      })
      .catch((err) => console.error("Failed to load applications:", err));
  }, [setApplications]);

  const selectedItem =
    applications.find((a) => a.id === selectedApplicationId) ?? applications[0] ?? null;

  const items = applications.filter(
    (i) =>
      !search ||
      i.company.toLowerCase().includes(search.toLowerCase()) ||
      i.role.toLowerCase().includes(search.toLowerCase())
  );

  const stalled = items.filter(
    (i) => i.stageDays > 7 && !["Offer", "Rejected", "Ghosted"].includes(i.stage)
  ).length;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-full pb-section"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title={trackerCopy.title}
          subtitle={trackerCopy.subtitle}
          guide={trackerCopy.pageGuide}
          actions={
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-2 rounded-lg border border-hairline text-[12px] font-semibold text-text-secondary hover:bg-surface-2 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Import
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary-hover flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add application
              </button>
            </div>
          }
          telemetry={
            <TelemetryStrip
              metrics={[
                { label: "Active", value: String(items.length), sublabel: "In pipeline", status: "success", icon: Activity },
                { label: "Need follow-up", value: String(stalled), sublabel: "Stalled", status: "warning", icon: AlertTriangle },
                { label: "Avg response", value: "3.2d", sublabel: "Your targets", status: "intelligence", icon: Clock },
                { label: "Interview rate", value: "40%", sublabel: "This month", status: "success", icon: TrendingUp },
              ]}
            />
          }
        />
      </motion.div>

      <motion.div variants={slideUpVariants} className="grid grid-cols-1 md:grid-cols-3 gap-md mb-md">
        <IntelligenceCard title="Needs follow-up" domain="warning">
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Acme Corp — 12 days, 34% response odds. A short follow-up could help.
          </p>
        </IntelligenceCard>
        <IntelligenceCard title="Interview coming up" domain="primary">
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Stripe system design in ~48h. Your tailored resume is ready.
          </p>
        </IntelligenceCard>
        <IntelligenceCard title="Ghosted" domain="pipeline">
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Nova Systems — 21 days, no reply. Consider archiving to stay focused.
          </p>
        </IntelligenceCard>
      </motion.div>

      <motion.div variants={slideUpVariants} className="flex items-center gap-3 mb-md">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="search"
            placeholder="Search companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-surface-1 border border-hairline text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary/50"
          />
        </div>
        <Link
          href="/jobs"
          className="text-[12px] font-semibold text-primary hover:underline whitespace-nowrap"
        >
          Add from job matches →
        </Link>
      </motion.div>

      <div className="flex-1 flex flex-col lg:flex-row gap-md min-h-0">
        <div className="flex-1 min-w-0 overflow-x-auto">
          <TrackerBoard
            items={items}
            onSelectCard={(item) => selectApplication(item.id)}
            selectedId={selectedItem?.id}
          />
        </div>
        <AnimatePresence mode="wait">
          {selectedItem && (
            <PipelineDetailPanel
              key={selectedItem.id}
              item={selectedItem}
              onClose={() => selectApplication(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
