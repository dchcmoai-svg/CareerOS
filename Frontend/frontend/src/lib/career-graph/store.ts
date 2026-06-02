"use client";

import { create } from "zustand";
import type {
  PageContext,
  ResumeVariant,
  IntelligenceOpportunity,
  ApplicationRecord,
  LiveSignal,
  ActivityEvent,
  ProfileHealth,
  GraphNode,
  CareerHealthSnapshot,
  RecommendedAction,
} from "./types";
import {
  RESUME_VARIANTS,
  INITIAL_APPLICATIONS,
  INITIAL_LIVE_SIGNALS,
  INITIAL_ACTIVITY,
  PROFILE_HEALTH,
  CAREER_HEALTH,
  RECOMMENDED_ACTIONS,
  PROFESSIONAL_GRAPH,
  enrichOpportunity,
} from "./seed";
import type { OpportunityData } from "@/components/discovery/OpportunityCard";

interface CareerGraphState {
  pageContext: PageContext;
  activeResumeVariantId: string;
  selectedOpportunityId: string | null;
  selectedApplicationId: string | null;
  resumeVariants: ResumeVariant[];
  opportunities: IntelligenceOpportunity[];
  applications: ApplicationRecord[];
  liveSignals: LiveSignal[];
  activity: ActivityEvent[];
  profileHealth: ProfileHealth;
  careerHealth: CareerHealthSnapshot;
  recommendedActions: RecommendedAction[];
  graphNodes: GraphNode[];
  marketSignals: { id: string; message: string }[];

  setPageContext: (ctx: PageContext) => void;
  setActiveResumeVariant: (id: string, reason?: string) => void;
  selectOpportunity: (id: string | null) => void;
  selectApplication: (id: string | null) => void;
  setOpportunitiesFromApi: (jobs: OpportunityData[]) => void;
  setApplications: (apps: ApplicationRecord[]) => void;
  pushLiveSignal: (signal: Omit<LiveSignal, "id">) => void;
  pushActivity: (event: Omit<ActivityEvent, "id">) => void;
  linkJobToApplication: (jobId: string, applicationId: string) => void;

  getActiveResumeVariant: () => ResumeVariant;
  getOpportunity: (id: string) => IntelligenceOpportunity | undefined;
  getApplication: (id: string) => ApplicationRecord | undefined;
}

let signalCounter = 100;
let activityCounter = 100;

export const useCareerGraph = create<CareerGraphState>((set, get) => ({
  pageContext: "global",
  activeResumeVariantId: RESUME_VARIANTS[0].id,
  selectedOpportunityId: null,
  selectedApplicationId: INITIAL_APPLICATIONS[0]?.id ?? null,
  resumeVariants: RESUME_VARIANTS,
  opportunities: [],
  applications: INITIAL_APPLICATIONS,
  liveSignals: INITIAL_LIVE_SIGNALS,
  activity: INITIAL_ACTIVITY,
  profileHealth: PROFILE_HEALTH,
  careerHealth: CAREER_HEALTH,
  recommendedActions: RECOMMENDED_ACTIONS,
  graphNodes: PROFESSIONAL_GRAPH,
  marketSignals: [
    { id: "m1", message: "3 recruiters searched Rust + TypeScript today" },
    { id: "m2", message: "Series B frontend demand up 11%" },
  ],

  setPageContext: (ctx) => set({ pageContext: ctx }),

  setActiveResumeVariant: (id, reason) => {
    const variant = get().resumeVariants.find((v) => v.id === id);
    if (!variant) return;
    set({ activeResumeVariantId: id });
    get().pushActivity({
      message: reason ?? `Active resume: ${variant.branch}`,
      time: "Just now",
      domain: "resume",
    });
    get().pushLiveSignal({
      message: `Using ${variant.branch} across jobs & applications`,
      domain: "resume",
      href: "/resume",
    });
  },

  selectOpportunity: (id) => {
    const opp = id ? get().opportunities.find((o) => o.id === id) : null;
    if (opp) {
      get().setActiveResumeVariant(opp.bestResumeVariantId, `Best resume for ${opp.role} at ${opp.company}`);
    }
    set({ selectedOpportunityId: id });
  },

  selectApplication: (id) => set({ selectedApplicationId: id }),

  setOpportunitiesFromApi: (jobs) => {
    const enriched = jobs.map((j) =>
      enrichOpportunity({
        id: j.id,
        role: j.role,
        company: j.company,
        location: j.location,
        compensation: j.compensation,
        remote: j.remote,
        fitScore: j.fitScore,
        ghostScore: j.ghostScore,
        hiringVelocity: j.hiringVelocity,
        applicationDifficulty: j.applicationDifficulty,
        sponsorshipRealism: j.sponsorshipRealism,
        aiRationale: j.aiRationale,
        url: j.url,
        postedAt: j.postedAt,
        category: j.category,
        source: j.source,
      })
    );
    set({ opportunities: enriched });
  },

  setApplications: (apps) => set({ applications: apps }),

  pushLiveSignal: (signal) =>
    set((s) => ({
      liveSignals: [{ ...signal, id: `ls-${++signalCounter}` }, ...s.liveSignals].slice(0, 8),
    })),

  pushActivity: (event) =>
    set((s) => ({
      activity: [{ ...event, id: `act-${++activityCounter}` }, ...s.activity].slice(0, 12),
    })),

  linkJobToApplication: (jobId, applicationId) => {
    set((s) => ({
      applications: s.applications.map((a) =>
        a.id === applicationId ? { ...a, jobId } : a
      ),
    }));
  },

  getActiveResumeVariant: () => {
    const s = get();
    return s.resumeVariants.find((v) => v.id === s.activeResumeVariantId) ?? s.resumeVariants[0];
  },

  getOpportunity: (id) => get().opportunities.find((o) => o.id === id),

  getApplication: (id) => get().applications.find((a) => a.id === id),
}));
