"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  SlidersHorizontal,
  Search,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, slideUpVariants } from "@/lib/motion";
import { FilterChip } from "@/components/motion/FilterChip";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { TactileButton } from "@/components/ecosystem/TactileButton";
import { OpportunityIntelligenceTable } from "@/components/jobs/OpportunityIntelligenceTable";
import { jobs as jobsCopy } from "@/lib/copy";
import { useCareerGraph } from "@/lib/career-graph";
import {
  JOB_CATEGORIES,
  mapJobToOpportunity,
  type JobApiRecord,
} from "@/lib/jobs-api";

type SortMode = "match" | "recent";

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filterRemote, setFilterRemote] = useState(false);
  const [filterHybrid, setFilterHybrid] = useState(false);
  const [category, setCategory] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("match");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const opportunities = useCareerGraph((s) => s.opportunities);
  const selectedOpportunityId = useCareerGraph((s) => s.selectedOpportunityId);
  const setOpportunitiesFromApi = useCareerGraph((s) => s.setOpportunitiesFromApi);
  const selectOpportunity = useCareerGraph((s) => s.selectOpportunity);
  const pushLiveSignal = useCareerGraph((s) => s.pushLiveSignal);

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
      setOpportunitiesFromApi(mapped);
      setTotal(data.total ?? mapped.length);
      if (mapped.length && !selectedOpportunityId) {
        selectOpportunity(mapped[0].id);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : jobsCopy.error);
      setOpportunitiesFromApi([]);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedQuery,
    filterRemote,
    category,
    setOpportunitiesFromApi,
    selectOpportunity,
    selectedOpportunityId,
  ]);

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

  const avgFit =
    filteredOpportunities.length > 0
      ? Math.round(
          filteredOpportunities.reduce((s, o) => s + o.fitScore, 0) / filteredOpportunities.length
        )
      : 0;

  const handleSelect = (id: string) => {
    selectOpportunity(id);
    const opp = filteredOpportunities.find((o) => o.id === id);
    if (opp && opp.fitScore >= 90) {
      pushLiveSignal({
        message: `Strong match: ${opp.role} at ${opp.company} — resume variant linked`,
        domain: "primary",
        href: "/jobs",
      });
    }
  };

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

      <motion.div
        variants={slideUpVariants}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-md mb-md flex-shrink-0"
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

      {error && !loading && (
        <div className="text-center py-8 px-4 border border-dashed border-danger/30 rounded-xl bg-danger/5 mb-md">
          <AlertTriangle className="w-6 h-6 text-danger mx-auto mb-2" />
          <p className="text-sm text-text-secondary">{error}</p>
          <button type="button" onClick={loadJobs} className="mt-2 text-xs font-bold text-ai hover:underline">
            Try again
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 gap-2 text-text-tertiary text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          {jobsCopy.loading}
        </div>
      )}

      {!loading && !error && (
        <motion.div variants={slideUpVariants} className="flex-1 min-h-0 overflow-y-auto pb-md">
          <OpportunityIntelligenceTable
            opportunities={filteredOpportunities}
            selectedId={selectedOpportunityId}
            onSelect={handleSelect}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
