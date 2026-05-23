"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useEcosystem } from "@/lib/EcosystemContext";
import {
  SlidersHorizontal,
  Search,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Loader2,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { staggerContainer, slideUpVariants, listItemVariants, detailPanelVariants, layoutSpring } from "@/lib/motion";
import { FilterChip } from "@/components/motion/FilterChip";
import { JobListSkeleton } from "@/components/motion/JobListSkeleton";
import { OpportunityCard, OpportunityData } from "@/components/discovery/OpportunityCard";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { OpportunityCompareStrip } from "@/components/discovery/OpportunityCompareStrip";
import { TactileButton } from "@/components/ecosystem/TactileButton";
import { jobs as jobsCopy } from "@/lib/copy";
import { ScoreHint } from "@/components/ecosystem/ContextualGuide";
import {
  JOB_CATEGORIES,
  mapJobToOpportunity,
  type JobApiRecord,
} from "@/lib/jobs-api";

type SortMode = "match" | "recent";

export default function JobsPage() {
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [selectedJob, setSelectedJob] = useState<OpportunityData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filterRemote, setFilterRemote] = useState(false);
  const [filterHybrid, setFilterHybrid] = useState(false);
  const [category, setCategory] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("match");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const { setActiveIntelligence } = useEcosystem();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (filterRemote) params.set("remote", "true");
      if (category !== "all") params.set("category", category);

      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      if (!res.ok && data.error) throw new Error(data.error);

      const mapped = (data.jobs as JobApiRecord[]).map(mapJobToOpportunity);
      setOpportunities(mapped);
      setTotal(data.total ?? mapped.length);
      if (mapped.length && !selectedJob) setSelectedJob(mapped[0]);
    } catch (e) {
      setError(e instanceof Error ? e.message : jobsCopy.error);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filterRemote, category]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const sortedOpportunities = useMemo(() => {
    const list = [...opportunities];
    if (sortMode === "match") {
      list.sort((a, b) => b.fitScore - a.fitScore);
    } else {
      list.sort((a, b) => {
        const ta = a.postedAt ? new Date(a.postedAt).getTime() : 0;
        const tb = b.postedAt ? new Date(b.postedAt).getTime() : 0;
        return tb - ta;
      });
    }
    return list;
  }, [opportunities, sortMode]);

  const filteredOpportunities = useMemo(() => {
    if (!filterHybrid) return sortedOpportunities;
    return sortedOpportunities.filter((o) => o.location.toLowerCase().includes("hybrid"));
  }, [sortedOpportunities, filterHybrid]);

  const { focusedIndex } = useKeyboardNavigation(filteredOpportunities.length, (idx) => {
    setSelectedJob(filteredOpportunities[idx]);
  });

  useEffect(() => {
    const focusedJob = filteredOpportunities[focusedIndex];
    if (!focusedJob) return;
    setSelectedJob(focusedJob);
    if (focusedJob.ghostScore > 70) {
      setActiveIntelligence(
        `${focusedJob.company} tends to respond slowly. Consider roles with higher response likelihood first.`
      );
    } else if (focusedJob.fitScore > 90) {
      setActiveIntelligence(
        `Strong match for ${focusedJob.role} at ${focusedJob.company}. Want help tailoring your resume for this role?`
      );
    } else {
      setActiveIntelligence(
        `${focusedJob.company} — ${100 - focusedJob.ghostScore}% response likelihood. Small resume tweaks could raise your match to 90%+.`
      );
    }
  }, [focusedIndex, filteredOpportunities, setActiveIntelligence]);

  const avgFit =
    filteredOpportunities.length > 0
      ? Math.round(
          filteredOpportunities.reduce((s, o) => s + o.fitScore, 0) / filteredOpportunities.length
        )
      : 0;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="pb-section flex flex-col h-full overflow-hidden"
    >
      <motion.div variants={slideUpVariants} className="flex-shrink-0 mb-md">
        <PageHeader
          title={jobsCopy.title}
          subtitle={jobsCopy.subtitle}
          guide={jobsCopy.pageGuide}
          actions={
            <TactileButton
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={() => loadJobs()}
              disabled={loading}
            >
              Refresh
            </TactileButton>
          }
        />
      </motion.div>

      <motion.div variants={slideUpVariants} className="flex flex-wrap gap-2 mb-md flex-shrink-0">
        {JOB_CATEGORIES.map((cat) => (
          <FilterChip
            key={cat.id}
            label={cat.label}
            active={category === cat.id}
            onClick={() => setCategory(cat.id)}
          />
        ))}
      </motion.div>

      <motion.div variants={slideUpVariants}>
        <OpportunityCompareStrip jobs={filteredOpportunities.slice(0, 4)} />
      </motion.div>

      {/* Stats strip */}
      <motion.div
        variants={slideUpVariants}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-md flex-shrink-0"
      >
        {[
          { label: jobsCopy.stats.shown, value: String(filteredOpportunities.length), icon: Briefcase },
          { label: jobsCopy.stats.total, value: String(total), icon: Search },
          { label: jobsCopy.stats.avgMatch, value: `${avgFit}%`, icon: TrendingUp },
          {
            label: jobsCopy.stats.highResponse,
            value: String(filteredOpportunities.filter((o) => o.ghostScore < 35).length),
            icon: Sparkles,
          },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-surface-1 border border-hairline rounded-lg px-3 py-2 flex items-center gap-2"
          >
            <m.icon className="w-4 h-4 text-ai opacity-80" />
            <div>
              <p className="text-[10px] text-text-tertiary uppercase tracking-wide">{m.label}</p>
              <p className="text-sm font-bold text-text-primary">{m.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search + filters */}
      <motion.div
        variants={slideUpVariants}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md mb-lg flex-shrink-0"
      >
        <div className="flex-1 w-full max-w-xl relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder={jobsCopy.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-1 border border-hairline hover:border-border-strong focus:border-ai pl-9 pr-4 py-2.5 text-sm rounded-lg text-text-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterRemote((v) => !v)}
            className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${
              filterRemote
                ? "bg-ai/10 text-ai border-ai/30"
                : "bg-surface-2 border-hairline text-text-secondary hover:bg-surface-3"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 inline mr-1" />
            {jobsCopy.remote}
          </button>
          <button
            type="button"
            onClick={() => setFilterHybrid((v) => !v)}
            className={`px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${
              filterHybrid
                ? "bg-ai/10 text-ai border-ai/30"
                : "bg-surface-2 border-hairline text-text-secondary hover:bg-surface-3"
            }`}
          >
            {jobsCopy.hybrid}
          </button>
          <button
            type="button"
            onClick={() => setSortMode(sortMode === "match" ? "recent" : "match")}
            className="px-3 py-1.5 rounded-md bg-surface-2 border border-hairline text-text-secondary text-xs font-semibold hover:bg-surface-3"
          >
            Sort: {sortMode === "match" ? jobsCopy.sortMatch : jobsCopy.sortRecent}
          </button>
        </div>
      </motion.div>

      <LayoutGroup>
      <div className="flex-1 flex gap-lg min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-w-0">
          {loading && <JobListSkeleton count={6} />}
          {error && !loading && (
            <div className="text-center py-16 px-4 border border-dashed border-danger/30 rounded-xl bg-danger/5">
              <AlertTriangle className="w-8 h-8 text-danger mx-auto mb-2" />
              <p className="text-sm text-text-secondary">{error}</p>
              <button
                type="button"
                onClick={loadJobs}
                className="mt-3 text-xs font-bold text-ai hover:underline"
              >
                Try again
              </button>
            </div>
          )}
          {!loading && !error && (
            <AnimatePresence mode="popLayout">
              {filteredOpportunities.map((job, idx) => (
                <motion.div
                  key={job.id}
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <OpportunityCard
                    data={job}
                    isFocused={focusedIndex === idx || selectedJob?.id === job.id}
                    onExpand={() => setSelectedJob(job)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          {!loading && !error && filteredOpportunities.length === 0 && (
            <div className="text-center py-20 border border-dashed border-hairline rounded-xl text-text-tertiary text-sm">
              {jobsCopy.noResults}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {selectedJob && !loading && (
            <motion.aside
              key={selectedJob.id}
              variants={detailPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={layoutSpring}
              className="hidden lg:flex w-[360px] flex-col glass-panel surface-elevated p-5 overflow-y-auto shrink-0"
            >
              <div className="border-b border-hairline pb-4 mb-4">
                <h3 className="font-bold text-base text-text-primary leading-snug">
                  {selectedJob.role}
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  {selectedJob.company} · {selectedJob.location}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-success/10 text-success text-xs font-bold border border-success/20">
                  {selectedJob.fitScore}% {jobsCopy.strongMatch}
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-2">
                    What these numbers mean
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <ScoreHint
                      label={jobsCopy.responseLikelihood}
                      value={`${100 - selectedJob.ghostScore}%`}
                      hint={jobsCopy.scoreHints.response}
                      tone={selectedJob.ghostScore < 40 ? "success" : "warning"}
                    />
                    <ScoreHint
                      label={jobsCopy.hiringPace}
                      value={selectedJob.hiringVelocity}
                      hint={jobsCopy.scoreHints.hiring}
                      tone="neutral"
                    />
                  </div>
                  <div className="mt-2">
                    <ScoreHint
                      label="Match with your resume"
                      value={`${selectedJob.fitScore}%`}
                      hint={jobsCopy.scoreHints.match}
                      tone={selectedJob.fitScore >= 85 ? "success" : "neutral"}
                    />
                  </div>
                </div>

                {selectedJob.compensation !== "Salary not listed" && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin className="w-4 h-4 text-text-tertiary" />
                    <span>{selectedJob.compensation}</span>
                  </div>
                )}

                <div className="bg-surface-2 p-4 rounded-lg border border-hairline/80">
                  <p className="text-xs font-bold text-text-primary mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-ai" />
                    {jobsCopy.whyMatch}
                  </p>
                  <p className="text-[13px] text-text-secondary leading-relaxed">
                    {selectedJob.aiRationale}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-hairline flex flex-col gap-2">
                {selectedJob.url && (
                  <a
                    href={selectedJob.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-ai text-canvas rounded-lg hover:bg-ai-hover font-bold text-xs text-center flex items-center justify-center gap-2 transition-colors"
                  >
                    {jobsCopy.applyNow} <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  className="w-full py-2 border border-hairline rounded-lg text-xs font-semibold text-text-secondary hover:bg-surface-2 transition-colors"
                >
                  {jobsCopy.tailorResume}
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
      </LayoutGroup>
    </motion.div>
  );
}
