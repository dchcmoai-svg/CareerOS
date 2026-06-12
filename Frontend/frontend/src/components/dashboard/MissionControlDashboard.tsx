"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  ChevronDown,
  ThumbsDown,
  Check,
  Search,
  Briefcase,
  Plus,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";
import { useCareerGraph } from "@/lib/career-graph";
import { staggerContainer, slideUpVariants, staggerItem } from "@/lib/motion";
import { IntelligenceCard } from "@/components/intelligence/IntelligenceCard";
import {
  PRIORITY_ACTIONS,
  HEALTH_METRICS,
} from "@/lib/mission-control";
import { missionControl as mc } from "@/lib/copy";
import { cn } from "@/lib/utils";

// Custom premium SVG brand logos
const SwiggyLogo = () => (
  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#FF512F] to-[#DD2476] flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm shrink-0">Sw</div>
);

const ZomatoLogo = () => (
  <div className="w-6 h-6 rounded-lg bg-[#E23744] flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm shrink-0">Zo</div>
);

const InMobiLogo = () => (
  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#11998e] to-[#38ef7d] flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm shrink-0">In</div>
);

const RazorpayLogo = () => (
  <div className="w-6 h-6 rounded-lg bg-[#0072ff] flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm shrink-0">Rz</div>
);

const CredLogo = () => (
  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#1f1f1f] to-[#3a3a3a] flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm shrink-0">Cr</div>
);

const ZeptoLogo = () => (
  <div className="w-6 h-6 rounded-lg bg-[#654ea3] flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm shrink-0">Zp</div>
);

const GenericLogo = ({ name }: { name: string }) => {
  const initial = name.slice(0, 2).toUpperCase();
  return (
    <div className="w-6 h-6 rounded-lg bg-surface-3 border border-hairline flex items-center justify-center text-text-secondary text-[10px] font-extrabold shadow-sm shrink-0">{initial}</div>
  );
};

const getLogo = (company: string) => {
  const c = company.toLowerCase();
  if (c.includes("swiggy")) return <SwiggyLogo />;
  if (c.includes("zomato")) return <ZomatoLogo />;
  if (c.includes("inmobi")) return <InMobiLogo />;
  if (c.includes("razorpay")) return <RazorpayLogo />;
  if (c.includes("cred")) return <CredLogo />;
  if (c.includes("zepto")) return <ZeptoLogo />;
  if (c.includes("stripe")) return <div className="w-6 h-6 rounded-lg bg-[#635BFF] flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm shrink-0">St</div>;
  if (c.includes("vercel")) return <div className="w-6 h-6 rounded-lg bg-black flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm shrink-0">▲</div>;
  if (c.includes("linear")) return <div className="w-6 h-6 rounded-lg bg-[#5E6AD2] flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm shrink-0">L</div>;
  return <GenericLogo name={company} />;
};

const healthIcons = {
  career: Radar,
  resume: FileText,
  pipeline: Activity,
  market: TrendingUp,
} as const;

interface MissionControlDashboardProps {
  userName: string;
}

interface JobCardData {
  id: string;
  role: string;
  company: string;
  location: string;
  postedAt: string;
  fitScore: number;
  skills: string[];
  applicantsCount: number;
  backgroundColor: string;
  borderColor: string;
  salary: string;
  noticePeriod: string;
  workMode: "remote" | "hybrid" | "onsite";
  degree: string;
  experienceYears: number;
  criteria: {
    experience: string;
    expPassed: boolean;
    skills: string;
    skillsPassed: boolean;
    notice: string;
    noticePassed: boolean;
  };
  summary: string;
}

const INITIAL_JOBS: JobCardData[] = [
  {
    id: "job-swiggy",
    role: "Senior Frontend Engineer",
    company: "Swiggy",
    location: "Bengaluru, KA",
    postedAt: "2 days ago",
    fitScore: 88,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    applicantsCount: 2,
    backgroundColor: "bg-[#FFF9F2]",
    borderColor: "border-[#FFE2C2]",
    salary: "24 - 28 LPA",
    noticePeriod: "30 days",
    workMode: "hybrid",
    degree: "B.Tech/BE",
    experienceYears: 3,
    criteria: {
      experience: "Requires 3+ years (Candidate has 4 yrs)",
      expPassed: true,
      skills: "React, TS (Candidate matches profile)",
      skillsPassed: true,
      notice: "Max 30 days (Candidate matches profile)",
      noticePassed: true,
    },
    summary: "Build and scale high-performance user interfaces for Swiggy's consumer application. Lead migrations to Next.js App Router and optimize core web vitals performance (LCP, FID).",
  },
  {
    id: "job-zomato",
    role: "SDE-2 (Backend)",
    company: "Zomato",
    location: "Gurugram, HR",
    postedAt: "1 day ago",
    fitScore: 85,
    skills: ["Node.js", "Express", "PostgreSQL", "Redis"],
    applicantsCount: 4,
    backgroundColor: "bg-[#FAF5FF]",
    borderColor: "border-[#E8D5FF]",
    salary: "28 - 32 LPA",
    noticePeriod: "Immediate",
    workMode: "onsite",
    degree: "B.Tech/BE",
    experienceYears: 2,
    criteria: {
      experience: "Requires 2+ years (Candidate has 4 yrs)",
      expPassed: true,
      skills: "Node.js, Postgres (Candidate matches profile)",
      skillsPassed: true,
      notice: "Immediate Notice (Candidate matches profile)",
      noticePassed: true,
    },
    summary: "Work on the core ordering API and backend microservices at Zomato. Optimize database queries, manage caching layers with Redis, and handle spike traffic during peak ordering hours.",
  },
  {
    id: "job-inmobi",
    role: "SDE-3 (Systems)",
    company: "InMobi",
    location: "Bengaluru, KA",
    postedAt: "4 days ago",
    fitScore: 74,
    skills: ["Go", "Java", "Kubernetes", "Docker"],
    applicantsCount: 1,
    backgroundColor: "bg-[#FEFDF2]",
    borderColor: "border-[#FBEFBE]",
    salary: "35 - 45 LPA",
    noticePeriod: "60 days",
    workMode: "hybrid",
    degree: "M.Tech/MS",
    experienceYears: 5,
    criteria: {
      experience: "Requires 5+ years (Candidate has 4 yrs)",
      expPassed: false,
      skills: "Go, Kubernetes (Candidate matches stack tools)",
      skillsPassed: true,
      notice: "Max 60 days (Candidate matches profile)",
      noticePassed: true,
    },
    summary: "Design and support highly concurrent advertising servers. Handle billions of requests daily using Go and scale containerized pipelines with Kubernetes across multi-cloud environments.",
  },
  {
    id: "job-razorpay",
    role: "Software Engineer (Fullstack)",
    company: "Razorpay",
    location: "Bengaluru, KA",
    postedAt: "3 days ago",
    fitScore: 92,
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    applicantsCount: 3,
    backgroundColor: "bg-[#F5F8FF]",
    borderColor: "border-[#D6E4FF]",
    salary: "20 - 25 LPA",
    noticePeriod: "30 days",
    workMode: "hybrid",
    degree: "B.Tech/BE",
    experienceYears: 3,
    criteria: {
      experience: "Requires 3+ years (Candidate has 4 yrs)",
      expPassed: true,
      skills: "React, Node (Candidate matches profile)",
      skillsPassed: true,
      notice: "Max 30 days (Candidate matches profile)",
      noticePassed: true,
    },
    summary: "Integrate new payment features, subscription modules, and checkout flows. Maintain frontend user dashboards while supporting server-side microservices on AWS EC2/Lambda.",
  },
  {
    id: "job-cred",
    role: "Senior Backend Engineer",
    company: "Cred",
    location: "Bengaluru, KA",
    postedAt: "6 days ago",
    fitScore: 82,
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
    applicantsCount: 2,
    backgroundColor: "bg-[#F3FDF5]",
    borderColor: "border-[#C2F0D0]",
    salary: "30 - 36 LPA",
    noticePeriod: "30 days",
    workMode: "remote",
    degree: "B.Tech/BE",
    experienceYears: 4,
    criteria: {
      experience: "Requires 4+ years (Candidate has 4 yrs)",
      expPassed: true,
      skills: "Python, SQL (Candidate matches profile)",
      skillsPassed: true,
      notice: "Max 30 days (Candidate matches profile)",
      noticePassed: true,
    },
    summary: "Build backend payment settlement modules and credit scoring engines. Design database schemas using PostgreSQL and ensure transaction integrity for card payment networks.",
  },
];

const LOCATIONS = ["All Locations", "Bengaluru", "Mumbai", "Gurugram", "Noida", "Hyderabad", "Pune", "Remote"];
const WORKPLACES = ["All Workplace Types", "On-site", "Hybrid", "Remote"];
const DEGREES = ["All Degree Levels", "B.Tech/BE", "M.Tech/MS", "MCA/BCA", "Any Graduate"];
const EXPERIENCES = ["All Experience Levels", "1 Year", "3 Years", "5 Years", "8+ Years"];
const CTC_RANGES = ["All Salary Ranges", "6 - 12 LPA", "12 - 25 LPA", "25 - 45 LPA", "45+ LPA"];
const ROLES = ["All Roles", "Frontend", "Backend", "Fullstack", "AI / ML", "Systems"];
const JOB_TYPES = ["All Job Types", "Full-time", "Internship", "Contract"];

const getCardStyles = (fitScore: number) => {
  if (fitScore >= 85) {
    return {
      border: "border-hairline hover:border-success/40",
      glow: "hover:shadow-[0_8px_20px_-8px_rgba(34,197,94,0.25)]",
      badge: "bg-success/10 text-success border-success/20",
    };
  } else if (fitScore >= 80) {
    return {
      border: "border-hairline hover:border-primary/40",
      glow: "hover:shadow-[0_8px_20px_-8px_rgba(59,130,246,0.25)]",
      badge: "bg-primary/10 text-primary border-primary/20",
    };
  } else {
    return {
      border: "border-hairline hover:border-intelligence/40",
      glow: "hover:shadow-[0_8px_20px_-8px_rgba(87,193,255,0.25)]",
      badge: "bg-intelligence/10 text-intelligence border-intelligence/20",
    };
  }
};

export function MissionControlDashboard({ userName }: MissionControlDashboardProps) {
  const { profile, refreshProfile } = useUserEcosystem();
  const applications = useCareerGraph((s) => s.applications);
  const setApplications = useCareerGraph((s) => s.setApplications);

  // States for search and dropdown filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("All Time");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedWorkplace, setSelectedWorkplace] = useState("All Workplace Types");
  const [selectedDegree, setSelectedDegree] = useState("All Degree Levels");
  const [selectedExp, setSelectedExp] = useState("All Experience Levels");
  const [selectedCTC, setSelectedCTC] = useState("All Salary Ranges");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedJobType, setSelectedJobType] = useState("All Job Types");

  // Open dropdown tracker
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Referral states
  const [claimCode, setClaimCode] = useState("");
  const [submittingClaim, setSubmittingClaim] = useState(false);

  // Matches list
  const [jobs, setJobs] = useState<JobCardData[]>(INITIAL_JOBS);
  const [passedJobIds, setPassedJobIds] = useState<string[]>([]);
  const [selectedJobSummary, setSelectedJobSummary] = useState<JobCardData | null>(null);

  // Tracker application tab states
  const [activeAppTab, setActiveAppTab] = useState<string>("All");
  const [appSearchQuery, setAppSearchQuery] = useState("");

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

  const handlePassJob = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPassedJobIds((prev) => [...prev, id]);
    if (selectedJobSummary?.id === id) {
      setSelectedJobSummary(null);
    }
  };

  const handleApplyJob = (job: JobCardData, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const alreadyApplied = applications.some((a) => a.company === job.company && a.role === job.role);
    if (alreadyApplied) {
      alert(`You have already applied for the ${job.role} position at ${job.company}.`);
      return;
    }

    const newApp = {
      id: `t-added-${Date.now()}`,
      company: job.company,
      role: job.role,
      stage: "Applied" as const,
      stageDays: 0,
      lastInteraction: "Applied via CareerOS matches panel",
      historicalVelocity: "Fast" as const,
      responseProbability: job.fitScore,
      ghostRisk: "Low" as const,
      resumeBranch: job.company.toLowerCase() === "swiggy" ? "feature/swiggy-frontend" : "feature/general-sde",
      followUpIn: "Wait for response",
      nextAction: "N/A",
      jobId: job.id,
      matchScore: job.fitScore,
      expectedResponseDate: "5–10 business days",
    };

    setApplications([newApp, ...applications]);
    alert(`Successfully applied to ${job.role} at ${job.company}!`);
    setPassedJobIds((prev) => [...prev, job.id]);
    setSelectedJobSummary(null);
  };

  const handleApplyFilters = () => {
    setOpenDropdown(null);
  };

  // Filter logic based on options
  const filteredJobsList = useMemo(() => {
    return jobs
      .filter((j) => !passedJobIds.includes(j.id))
      .filter((j) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = j.role.toLowerCase().includes(q);
          const matchCompany = j.company.toLowerCase().includes(q);
          const matchSkills = j.skills.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchCompany && !matchSkills) return false;
        }

        if (selectedLocation !== "All Locations") {
          if (!j.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }
        }

        if (selectedWorkplace !== "All Workplace Types") {
          const wm = selectedWorkplace.toLowerCase();
          if (wm === "on-site" && j.workMode !== "onsite") return false;
          if (wm === "hybrid" && j.workMode !== "hybrid") return false;
          if (wm === "remote" && j.workMode !== "remote") return false;
        }

        if (selectedDegree !== "All Degree Levels") {
          if (j.degree !== selectedDegree) return false;
        }

        if (selectedExp !== "All Experience Levels") {
          const reqExp = parseInt(selectedExp);
          if (!isNaN(reqExp) && j.experienceYears > reqExp) return false;
        }

        if (selectedCTC !== "All Salary Ranges") {
          if (selectedCTC === "6 - 12 LPA" && !j.salary.includes("12") && !j.salary.includes("8")) return false;
          if (selectedCTC === "12 - 25 LPA" && !j.salary.includes("20") && !j.salary.includes("24") && !j.salary.includes("25")) return false;
          if (selectedCTC === "25 - 45 LPA" && !j.salary.includes("28") && !j.salary.includes("30") && !j.salary.includes("32") && !j.salary.includes("35")) return false;
          if (selectedCTC === "45+ LPA" && !j.salary.includes("45")) return false;
        }

        if (selectedRole !== "All Roles") {
          if (selectedRole === "Systems" && j.role.toLowerCase().includes("systems")) return true;
          if (!j.role.toLowerCase().includes(selectedRole.toLowerCase())) return false;
        }

        return true;
      });
  }, [
    jobs,
    passedJobIds,
    searchQuery,
    selectedLocation,
    selectedWorkplace,
    selectedDegree,
    selectedExp,
    selectedCTC,
    selectedRole,
  ]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (appSearchQuery.trim()) {
        const q = appSearchQuery.toLowerCase();
        if (!app.company.toLowerCase().includes(q) && !app.role.toLowerCase().includes(q)) {
          return false;
        }
      }

      if (activeAppTab === "All") return true;
      if (activeAppTab === "Submitted") return app.stage === "Applied";
      if (activeAppTab === "In flight") return app.stage === "Interviewing" || app.stage === "Offer";
      if (activeAppTab === "Needs you") return app.stage === "Stalled" || app.followUpIn?.toLowerCase().includes("overdue") || app.followUpIn?.toLowerCase().includes("nudge");
      if (activeAppTab === "Failed") return app.stage === "Rejected" || app.stage === "Ghosted";
      if (activeAppTab === "Skipped") return false;

      return true;
    });
  }, [applications, activeAppTab, appSearchQuery]);

  const tabCounts = useMemo(() => {
    return {
      All: applications.length,
      Submitted: applications.filter(a => a.stage === "Applied").length,
      InFlight: applications.filter(a => a.stage === "Interviewing" || a.stage === "Offer").length,
      NeedsYou: applications.filter(a => a.stage === "Stalled" || a.followUpIn?.toLowerCase().includes("overdue") || a.followUpIn?.toLowerCase().includes("nudge")).length,
      Failed: applications.filter(a => a.stage === "Rejected" || a.stage === "Ghosted").length,
      Skipped: 0,
    };
  }, [applications]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedLocation !== "All Locations") count++;
    if (selectedWorkplace !== "All Workplace Types") count++;
    if (selectedDegree !== "All Degree Levels") count++;
    if (selectedExp !== "All Experience Levels") count++;
    if (selectedCTC !== "All Salary Ranges") count++;
    if (selectedRole !== "All Roles") count++;
    if (selectedJobType !== "All Job Types") count++;
    return count;
  }, [selectedLocation, selectedWorkplace, selectedDegree, selectedExp, selectedCTC, selectedRole, selectedJobType]);

  const resetAllFilters = () => {
    setSelectedLocation("All Locations");
    setSelectedWorkplace("All Workplace Types");
    setSelectedDegree("All Degree Levels");
    setSelectedExp("All Experience Levels");
    setSelectedCTC("All Salary Ranges");
    setSelectedRole("All Roles");
    setSelectedJobType("All Job Types");
    setSearchQuery("");
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-lg py-md pb-xl"
    >
      {/* Header */}
      <motion.header variants={slideUpVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-hairline pb-md">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
            {mc.eyebrow}
          </p>
          <h1 className="text-display text-2xl md:text-3xl font-semibold text-text-primary tracking-[-0.03em]">
            {mc.title(userName)}
          </h1>
          <p className="text-[13px] text-text-secondary max-w-2xl leading-relaxed">{mc.subtitle}</p>
        </div>

        {/* Referrals Stats Banner */}
        <div className="flex items-center gap-md bg-surface-2 border border-hairline p-3 rounded-xl shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Gift className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wide">Referrals Earned</p>
            <p className="text-sm font-bold text-text-primary">
              ${profile?.referralEarnings || 0} <span className="text-xs font-normal text-text-tertiary">({profile?.referredUsersCount || 0} friends)</span>
            </p>
          </div>
        </div>
      </motion.header>

      {/* Search and Filters Strip */}
      <motion.section variants={slideUpVariants} className="space-y-sm bg-surface-1 border border-hairline rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Main Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by title, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-2 border border-hairline focus:border-border-strong hover:border-hairline rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Filters Dropdowns */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Location Filter */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "location" ? null : "location")}
                className={cn(
                  "px-3 py-2 border rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                  selectedLocation !== "All Locations"
                    ? "bg-[#0F1E16] border-[#A3E635]/30 text-[#A3E635]"
                    : "bg-surface-2 border-hairline text-text-secondary hover:bg-surface-3"
                )}
              >
                <span>{selectedLocation === "All Locations" ? "Location" : selectedLocation}</span>
                <ChevronDown className="w-3 h-3 opacity-85 shrink-0" />
              </button>
              {openDropdown === "location" && (
                <div className="absolute top-full left-0 mt-2 bg-surface-1 border border-border-strong rounded-xl shadow-xl z-50 p-1 min-w-[160px] text-xs">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-surface-2 rounded-lg text-text-primary transition-colors text-[11px]"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Workplace Filter */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "workplace" ? null : "workplace")}
                className={cn(
                  "px-3 py-2 border rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                  selectedWorkplace !== "All Workplace Types"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-surface-2 border-hairline text-text-secondary hover:bg-surface-3"
                )}
              >
                <span>{selectedWorkplace === "All Workplace Types" ? "Workplace" : selectedWorkplace}</span>
                <ChevronDown className="w-3 h-3 opacity-85 shrink-0" />
              </button>
              {openDropdown === "workplace" && (
                <div className="absolute top-full left-0 mt-2 bg-surface-1 border border-border-strong rounded-xl shadow-xl z-50 p-1 min-w-[160px] text-xs">
                  {WORKPLACES.map((wp) => (
                    <button
                      key={wp}
                      onClick={() => {
                        setSelectedWorkplace(wp);
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-surface-2 rounded-lg text-text-primary transition-colors text-[11px]"
                    >
                      {wp}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Degree Filter */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "degree" ? null : "degree")}
                className={cn(
                  "px-3 py-2 border rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                  selectedDegree !== "All Degree Levels"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-surface-2 border-hairline text-text-secondary hover:bg-surface-3"
                )}
              >
                <span>{selectedDegree === "All Degree Levels" ? "Degree" : selectedDegree}</span>
                <ChevronDown className="w-3 h-3 opacity-85 shrink-0" />
              </button>
              {openDropdown === "degree" && (
                <div className="absolute top-full left-0 mt-2 bg-surface-1 border border-border-strong rounded-xl shadow-xl z-50 p-1 min-w-[160px] text-xs">
                  {DEGREES.map((deg) => (
                    <button
                      key={deg}
                      onClick={() => {
                        setSelectedDegree(deg);
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-surface-2 rounded-lg text-text-primary transition-colors text-[11px]"
                    >
                      {deg}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Max Experience Filter */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "experience" ? null : "experience")}
                className={cn(
                  "px-3 py-2 border rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                  selectedExp !== "All Experience Levels"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-surface-2 border-hairline text-text-secondary hover:bg-surface-3"
                )}
              >
                <span>{selectedExp === "All Experience Levels" ? "Max Exp" : selectedExp}</span>
                <ChevronDown className="w-3 h-3 opacity-85 shrink-0" />
              </button>
              {openDropdown === "experience" && (
                <div className="absolute top-full left-0 mt-2 bg-surface-1 border border-border-strong rounded-xl shadow-xl z-50 p-1 min-w-[160px] text-xs">
                  {EXPERIENCES.map((exp) => (
                    <button
                      key={exp}
                      onClick={() => {
                        setSelectedExp(exp);
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-surface-2 rounded-lg text-text-primary transition-colors text-[11px]"
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Expected CTC Filter */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "ctc" ? null : "ctc")}
                className={cn(
                  "px-3 py-2 border rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                  selectedCTC !== "All Salary Ranges"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-surface-2 border-hairline text-text-secondary hover:bg-surface-3"
                )}
              >
                <span>{selectedCTC === "All Salary Ranges" ? "Salary (CTC)" : selectedCTC}</span>
                <ChevronDown className="w-3 h-3 opacity-85 shrink-0" />
              </button>
              {openDropdown === "ctc" && (
                <div className="absolute top-full left-0 mt-2 bg-surface-1 border border-border-strong rounded-xl shadow-xl z-50 p-1 min-w-[160px] text-xs">
                  {CTC_RANGES.map((ctc) => (
                    <button
                      key={ctc}
                      onClick={() => {
                        setSelectedCTC(ctc);
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-surface-2 rounded-lg text-text-primary transition-colors text-[11px]"
                    >
                      {ctc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Filter */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "role" ? null : "role")}
                className={cn(
                  "px-3 py-2 border rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
                  selectedRole !== "All Roles"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-surface-2 border-hairline text-text-secondary hover:bg-surface-3"
                )}
              >
                <span>{selectedRole === "All Roles" ? "Role" : selectedRole}</span>
                <ChevronDown className="w-3 h-3 opacity-85 shrink-0" />
              </button>
              {openDropdown === "role" && (
                <div className="absolute top-full left-0 mt-2 bg-surface-1 border border-border-strong rounded-xl shadow-xl z-50 p-1 min-w-[160px] text-xs">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setSelectedRole(r);
                        setOpenDropdown(null);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-surface-2 rounded-lg text-text-primary transition-colors text-[11px]"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Apply & Reset Buttons */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="px-2.5 py-2 hover:bg-surface-2 border border-dashed border-hairline rounded-xl text-[11.5px] font-medium text-text-tertiary flex items-center gap-1 cursor-pointer"
              >
                Clear all ({activeFiltersCount})
              </button>
            )}
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-primary text-white rounded-xl text-[11px] font-bold shadow-md hover:bg-primary/95 transition-all cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Selected Filter Pills Row */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-hairline/80">
            {selectedLocation !== "All Locations" && (
              <div className="bg-[#0F1E16] border border-[#A3E635]/30 text-[#A3E635] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                <span>Location: {selectedLocation}</span>
                <X className="w-3.5 h-3.5 cursor-pointer text-[#A3E635] hover:opacity-80 shrink-0" onClick={() => setSelectedLocation("All Locations")} />
              </div>
            )}
            {selectedWorkplace !== "All Workplace Types" && (
              <div className="bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
                <span>Workplace: {selectedWorkplace}</span>
                <X className="w-3.5 h-3.5 cursor-pointer text-primary hover:opacity-80 shrink-0" onClick={() => setSelectedWorkplace("All Workplace Types")} />
              </div>
            )}
            {selectedDegree !== "All Degree Levels" && (
              <div className="bg-surface-2 border border-hairline text-text-secondary px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
                <span>Degree: {selectedDegree}</span>
                <X className="w-3.5 h-3.5 cursor-pointer text-text-tertiary hover:text-text-primary shrink-0" onClick={() => setSelectedDegree("All Degree Levels")} />
              </div>
            )}
            {selectedExp !== "All Experience Levels" && (
              <div className="bg-surface-2 border border-hairline text-text-secondary px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
                <span>Experience &lt;= {selectedExp}</span>
                <X className="w-3.5 h-3.5 cursor-pointer text-text-tertiary hover:text-text-primary shrink-0" onClick={() => setSelectedExp("All Experience Levels")} />
              </div>
            )}
            {selectedCTC !== "All Salary Ranges" && (
              <div className="bg-surface-2 border border-hairline text-text-secondary px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
                <span>Salary Budget: {selectedCTC}</span>
                <X className="w-3.5 h-3.5 cursor-pointer text-text-tertiary hover:text-text-primary shrink-0" onClick={() => setSelectedCTC("All Salary Ranges")} />
              </div>
            )}
            {selectedRole !== "All Roles" && (
              <div className="bg-surface-2 border border-hairline text-text-secondary px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
                <span>Role: {selectedRole}</span>
                <X className="w-3.5 h-3.5 cursor-pointer text-text-tertiary hover:text-text-primary shrink-0" onClick={() => setSelectedRole("All Roles")} />
              </div>
            )}
          </div>
        )}
      </motion.section>

      {/* Top Job Matches (opportunities horizontal scroll list) */}
      <motion.section variants={slideUpVariants} className="space-y-sm">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-sm">
          <div>
            <h2 className="text-[14px] font-bold text-text-primary tracking-tight">Top job matches</h2>
            <p className="text-[11px] text-text-tertiary">Real-time curated fits matched against your profile timeline</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="px-3 py-1.5 bg-surface-1 border border-hairline hover:bg-surface-2 rounded-lg text-[10.5px] font-semibold text-text-secondary flex items-center gap-1 transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5" />
              Add your own
            </button>
            <Link href="/jobs" className="px-3 py-1.5 bg-surface-1 border border-hairline hover:bg-surface-2 rounded-lg text-[10.5px] font-semibold text-text-secondary flex items-center gap-1 transition-colors">
              <Briefcase className="w-3.5 h-3.5" />
              Browse jobs
            </Link>
            {filteredJobsList.length > 0 && (
              <button
                onClick={() => {
                  filteredJobsList.forEach((j) => handleApplyJob(j));
                }}
                className="px-3 py-1.5 bg-text-primary text-background hover:bg-text-secondary rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                Apply to all {filteredJobsList.length} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Job Cards Row */}
        <div className="relative">
          {filteredJobsList.length === 0 ? (
            <div className="text-center py-xl border border-dashed border-hairline rounded-2xl bg-surface-1">
              <Briefcase className="w-8 h-8 text-text-tertiary mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-text-primary">No job matches fit your current filters</p>
              <p className="text-xs text-text-tertiary mt-1">Try loosening your location, workplace, or CTC filters</p>
              <button onClick={resetAllFilters} className="mt-3 text-xs font-bold text-primary hover:underline cursor-pointer">
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-md pb-3 pt-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <AnimatePresence mode="popLayout">
                {filteredJobsList.map((job) => {
                  const cardStyles = getCardStyles(job.fitScore);
                  return (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -50 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      onClick={() => setSelectedJobSummary(job)}
                      className={cn(
                        "w-[290px] p-4 bg-surface-1/50 hover:bg-surface-1 border rounded-2xl transition-all duration-300 hover:-translate-y-1 shrink-0 cursor-pointer flex flex-col justify-between group relative overflow-hidden shadow-sm",
                        cardStyles.border,
                        cardStyles.glow
                      )}
                    >
                      {/* Top Row: Location & Match */}
                      <div className="flex justify-between items-start gap-md mb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-text-primary">{job.location}</span>
                            <span className="bg-surface-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-text-secondary border border-hairline flex items-center gap-0.5 shadow-sm">
                              <span>{job.applicantsCount}</span>
                              <span className="text-[8px] opacity-80 font-normal">👥</span>
                            </span>
                          </div>
                          <span className="text-[10px] text-text-tertiary mt-0.5 block">{job.postedAt}</span>
                        </div>

                        {/* Circular Match score SVG */}
                        <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
                          <svg className="w-11 h-11 transform -rotate-90">
                            <circle
                              cx="22"
                              cy="22"
                              r="18"
                              className="stroke-hairline"
                              strokeWidth="2"
                              fill="transparent"
                            />
                            <circle
                              cx="22"
                              cy="22"
                              r="18"
                              className={cn(
                                "transition-all duration-500",
                                job.fitScore >= 85 ? "stroke-success" : job.fitScore >= 80 ? "stroke-primary" : "stroke-intelligence"
                              )}
                              strokeWidth="2.5"
                              strokeDasharray={2 * Math.PI * 18}
                              strokeDashoffset={2 * Math.PI * 18 * (1 - job.fitScore / 100)}
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold text-text-primary leading-none">{job.fitScore}%</span>
                            <span className="text-[6px] text-text-tertiary font-bold tracking-wider uppercase scale-90 mt-0.5">FIT</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Title */}
                      <div className="mb-3">
                        <h3 className="text-[13.5px] font-bold text-text-primary group-hover:text-primary transition-colors leading-snug h-10 overflow-hidden line-clamp-2">
                          {job.role}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className="bg-surface-2/60 px-2 py-0.5 rounded-md text-[9.5px] text-text-secondary font-semibold border border-hairline/45">
                            {job.salary}
                          </span>
                          <span className="bg-surface-2/60 px-2 py-0.5 rounded-md text-[9.5px] text-text-secondary font-semibold border border-hairline/45">
                            {job.noticePeriod} Notice
                          </span>
                        </div>
                      </div>

                      {/* Skills pills */}
                      <div className="flex flex-wrap gap-1 mb-3.5">
                        {job.skills.slice(0, 3).map((skill) => (
                          <span key={skill} className="bg-surface-3/40 border border-hairline/60 px-2 py-0.5 rounded-md text-[9px] text-text-secondary font-medium tracking-wide">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="bg-surface-3/40 border border-hairline/60 px-1.5 py-0.5 rounded-md text-[8.5px] text-text-tertiary font-bold">
                            +{job.skills.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Criteria Check list (representing criteria for joining) */}
                      <div className="mb-4 bg-surface-2/40 border border-hairline/50 p-2.5 rounded-xl text-[9.5px] space-y-1.5 transition-colors group-hover:bg-surface-2/70">
                        <p className="text-[8px] font-bold text-text-tertiary uppercase tracking-wider mb-1 border-b border-hairline/45 pb-1 flex justify-between">
                          <span>Joining Criteria Match</span>
                          <span className="opacity-80 font-normal">Details ➔</span>
                        </p>
                        
                        <div className="flex items-center gap-1.5 text-text-secondary min-w-0">
                          {job.criteria.expPassed ? (
                            <Check className="w-3 h-3 text-success shrink-0" />
                          ) : (
                            <X className="w-3 h-3 text-danger shrink-0" />
                          )}
                          <span className="truncate">{job.criteria.experience}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-text-secondary min-w-0">
                          <Check className="w-3 h-3 text-success shrink-0" />
                          <span className="truncate">{job.criteria.skills}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-text-secondary min-w-0">
                          {job.criteria.noticePassed ? (
                            <Check className="w-3 h-3 text-success shrink-0" />
                          ) : (
                            <X className="w-3 h-3 text-danger shrink-0" />
                          )}
                          <span className="truncate">{job.criteria.notice}</span>
                        </div>
                      </div>

                      {/* Bottom Row: Company Brand + Actions */}
                      <div className="flex justify-between items-center border-t border-hairline pt-3 mt-auto">
                        <div className="flex items-center gap-2 min-w-0">
                          {getLogo(job.company)}
                          <span className="text-[11.5px] font-bold text-text-primary truncate">{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={(e) => handlePassJob(job.id, e)}
                            className="px-2.5 py-1.5 bg-surface-1 hover:bg-surface-2 border border-hairline rounded-lg text-[10px] font-semibold text-text-secondary flex items-center gap-0.5 transition-colors cursor-pointer"
                          >
                            <ThumbsDown className="w-3 h-3 text-text-tertiary" />
                            Pass
                          </button>
                          <button
                            onClick={(e) => handleApplyJob(job, e)}
                            className="px-3 py-1.5 bg-text-primary text-background hover:bg-text-secondary rounded-lg text-[10px] font-bold transition-all shadow-sm cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.section>

      {/* Grid containing prior features: Priority actions, Health metrics, Recruiter view signals, and Referral Claims */}
      <motion.section variants={slideUpVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Left Column (2/3): Priority actions + Health metrics */}
        <div className="lg:col-span-2 space-y-md">
          {/* Priority Actions */}
          <div className="space-y-sm">
            <div className="flex items-center justify-between gap-md">
              <h2 className="text-[12.5px] font-semibold text-text-primary">{mc.level1}</h2>
              <span className="text-[10px] text-text-tertiary">{mc.level1Hint}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
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
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                          {action.urgency === "high" ? mc.urgent : mc.recommended}
                        </span>
                        <span className="text-[11.5px] font-semibold text-primary flex items-center gap-0.5">
                          {action.cta}
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    }
                  >
                    <div className="h-1" />
                  </IntelligenceCard>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Career state health metrics */}
          <div className="space-y-sm">
            <h2 className="text-[12.5px] font-semibold text-text-primary">{mc.level2}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
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
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-text-primary tabular-nums tracking-tight">
                          {metric.value}
                        </span>
                        {metric.delta && (
                          <span
                            className={cn(
                              "text-[10px] font-medium",
                              metric.trend === "up" ? "text-success" : "text-text-tertiary"
                            )}
                          >
                            {metric.delta}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-text-tertiary mt-1.5 leading-relaxed h-8 overflow-hidden">{metric.hint}</p>
                    </IntelligenceCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): Recruiter signals + Referral claiming */}
        <div className="flex flex-col gap-md">
          {/* Recruiter signals */}
          <IntelligenceCard
            title={mc.recruiterSignals}
            subtitle={mc.recruiterHint}
            icon={Users}
            domain="recruiter"
            href="/marketplace"
          >
            <ul className="space-y-3 text-[11.5px] my-auto">
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

          {/* Referral Reward management */}
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
                  className="px-2 py-1 bg-surface-1 hover:bg-surface-3 border border-hairline rounded text-[10px] font-semibold text-text-secondary shrink-0 cursor-pointer"
                >
                  Copy
                </button>
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
        </div>
      </motion.section>

      {/* All Applications Section */}
      <motion.section variants={slideUpVariants} className="space-y-sm bg-surface-1 border border-hairline rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-md border-b border-hairline/60 pb-3">
          <div>
            <h2 className="text-[14px] font-bold text-text-primary tracking-tight">All applications</h2>
            <p className="text-[11px] text-text-tertiary">Monitor the progress of your active applications in real time</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/tracker" className="px-3 py-1.5 bg-surface-1 border border-hairline hover:bg-surface-2 rounded-lg text-[10.5px] font-semibold text-text-secondary">
              Open tracker
            </Link>
            <button className="px-3 py-1.5 bg-surface-2 border border-hairline rounded-lg text-[10.5px] font-semibold text-text-tertiary cursor-not-allowed" disabled>
              Approve all
            </button>
          </div>
        </div>

        {/* Tabs and search filters row */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-md pt-2">
          {/* Status Tabs pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "All", label: "All", count: tabCounts.All },
              { id: "Submitted", label: "Submitted", count: tabCounts.Submitted },
              { id: "In flight", label: "In flight", count: tabCounts.InFlight },
              { id: "Needs you", label: "Needs you", count: tabCounts.NeedsYou },
              { id: "Failed", label: "Failed", count: tabCounts.Failed },
              { id: "Skipped", label: "Skipped", count: tabCounts.Skipped },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAppTab(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer",
                  activeAppTab === tab.id
                    ? "bg-text-primary text-background border-text-primary"
                    : "bg-surface-2 border-hairline text-text-secondary hover:bg-surface-3"
                )}
              >
                <span>{tab.label}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                  activeAppTab === tab.id ? "bg-background/25 text-background" : "bg-surface-3 text-text-secondary"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search company input */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search company..."
              value={appSearchQuery}
              onChange={(e) => setAppSearchQuery(e.target.value)}
              className="w-full bg-surface-2 border border-hairline focus:border-border-strong rounded-xl pl-9 pr-4 py-2 text-[11px] text-text-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Applications table */}
        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hairline/80 text-[10.5px] uppercase font-bold tracking-wider text-text-tertiary">
                <th className="py-2.5 px-3">Company & Role</th>
                <th className="py-2.5 px-3">Resume Variant</th>
                <th className="py-2.5 px-3">Cover Letter</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline/60">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[12px] text-text-tertiary bg-surface-2/20">
                    No applications match this filter.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-2/30 transition-colors text-[11.5px] text-text-secondary group">
                    <td className="py-3 px-3 flex items-center gap-2.5 min-w-[200px]">
                      {getLogo(app.company)}
                      <div>
                        <p className="font-bold text-text-primary group-hover:text-primary transition-colors leading-none">{app.company}</p>
                        <p className="text-[10px] text-text-tertiary mt-0.5 leading-none">{app.role}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 min-w-[150px]">
                      <span className="inline-flex items-center gap-1 bg-[#F5F8FF] border border-[#D6E4FF] text-primary px-2 py-0.5 rounded-md text-[10px] font-semibold">
                        <GitBranch className="w-3 h-3" />
                        {app.resumeBranch}
                      </span>
                    </td>
                    <td className="py-3 px-3 min-w-[150px]">
                      <span className="inline-flex items-center bg-surface-2 border border-hairline text-text-secondary px-2 py-0.5 rounded-md text-[10px] font-medium">
                        {app.company.toLowerCase() === "swiggy" ? "feature/general-sde-cl" : "general-cl-template"}
                      </span>
                    </td>
                    <td className="py-3 px-3 min-w-[110px]">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9.5px] font-bold inline-block border",
                        app.stage === "Offer" && "bg-success/10 border-success/20 text-success",
                        app.stage === "Interviewing" && "bg-intelligence/10 border-intelligence/20 text-intelligence",
                        app.stage === "Applied" && "bg-primary/10 border-primary/20 text-primary",
                        app.stage === "Ghosted" && "bg-text-tertiary/10 border-text-tertiary/20 text-text-tertiary",
                        app.stage === "Rejected" && "bg-danger/10 border-danger/20 text-danger",
                        app.stage === "Stalled" && "bg-warning/10 border-warning/20 text-warning"
                      )}>
                        {app.stage}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-text-tertiary min-w-[90px]">
                      {app.stageDays ? `${app.stageDays}d ago` : "Today"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Brief Job Summary Modal / Sidebar Drawer */}
      <AnimatePresence>
        {selectedJobSummary && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJobSummary(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            {/* Slide-over Summary Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:max-w-lg bg-surface-1 border-l border-hairline shadow-2xl z-50 p-6 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-md mb-6">
                  <div className="flex items-center gap-3">
                    {getLogo(selectedJobSummary.company)}
                    <div>
                      <h2 className="text-[16px] font-bold text-text-primary">{selectedJobSummary.role}</h2>
                      <p className="text-xs text-text-secondary font-medium">{selectedJobSummary.company} · {selectedJobSummary.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedJobSummary(null)}
                    className="p-1.5 hover:bg-surface-2 rounded-lg text-text-tertiary hover:text-text-primary transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Match Score Badge */}
                <div className="bg-surface-2 border border-hairline p-4 rounded-xl flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wide">AI Recommendation fit</p>
                    <p className="text-[13px] font-semibold text-text-primary">Very strong candidate profile matching!</p>
                  </div>
                  {/* Circular Match score SVG */}
                  <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        className="stroke-hairline"
                        strokeWidth="2.5"
                        fill="transparent"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        className={cn(
                          "transition-all duration-500",
                          selectedJobSummary.fitScore >= 85 ? "stroke-success" : selectedJobSummary.fitScore >= 80 ? "stroke-primary" : "stroke-intelligence"
                        )}
                        strokeWidth="3"
                        strokeDasharray={2 * Math.PI * 20}
                        strokeDashoffset={2 * Math.PI * 20 * (1 - selectedJobSummary.fitScore / 100)}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-[11px] font-bold text-text-primary leading-none">{selectedJobSummary.fitScore}%</span>
                      <span className="text-[6.5px] text-text-tertiary font-bold tracking-wider uppercase scale-90 mt-0.5">FIT</span>
                    </div>
                  </div>
                </div>

                {/* Job Specs */}
                <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                  <div className="p-3 bg-surface-2/50 border border-hairline/80 rounded-xl">
                    <p className="text-[10px] text-text-tertiary uppercase font-bold mb-1">Expected CTC</p>
                    <p className="font-bold text-text-primary text-sm">{selectedJobSummary.salary}</p>
                  </div>
                  <div className="p-3 bg-surface-2/50 border border-hairline/80 rounded-xl">
                    <p className="text-[10px] text-text-tertiary uppercase font-bold mb-1">Notice Period</p>
                    <p className="font-bold text-text-primary text-sm">{selectedJobSummary.noticePeriod}</p>
                  </div>
                  <div className="p-3 bg-surface-2/50 border border-hairline/80 rounded-xl">
                    <p className="text-[10px] text-text-tertiary uppercase font-bold mb-1">Work Mode</p>
                    <p className="font-bold text-text-primary text-sm capitalize">{selectedJobSummary.workMode}</p>
                  </div>
                  <div className="p-3 bg-surface-2/50 border border-hairline/80 rounded-xl">
                    <p className="text-[10px] text-text-tertiary uppercase font-bold mb-1">Degree Requirement</p>
                    <p className="font-bold text-text-primary text-sm">{selectedJobSummary.degree}</p>
                  </div>
                </div>

                {/* Joining Criteria checklist */}
                <div className="mb-6 space-y-2 bg-surface-2/40 border border-hairline p-4 rounded-xl">
                  <p className="text-[10px] font-bold text-text-primary uppercase tracking-wide">Detailed Joining Criteria Match</p>
                  <div className="space-y-3 text-xs pt-1">
                    <div className="flex items-start gap-2.5">
                      {selectedJobSummary.criteria.expPassed ? (
                        <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold text-text-primary">Experience Requirement</p>
                        <p className="text-[11px] text-text-tertiary">{selectedJobSummary.criteria.experience}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-text-primary">Required Tech Skills</p>
                        <p className="text-[11px] text-text-tertiary">{selectedJobSummary.criteria.skills}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      {selectedJobSummary.criteria.noticePassed ? (
                        <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold text-text-primary">Availability Notice Period</p>
                        <p className="text-[11px] text-text-tertiary">{selectedJobSummary.criteria.notice}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary / Description */}
                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wide">Role Overview</p>
                  <p className="text-xs text-text-secondary leading-relaxed bg-surface-2/30 border border-hairline/60 p-3.5 rounded-xl">
                    {selectedJobSummary.summary}
                  </p>
                </div>

                {/* Target Stack tags */}
                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wide">Key Technology Stack</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedJobSummary.skills.map((skill) => (
                      <span key={skill} className="bg-surface-2 border border-hairline px-3 py-1 rounded-full text-xs text-text-secondary font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-hairline">
                <button
                  onClick={() => handlePassJob(selectedJobSummary.id)}
                  className="flex-1 py-3 bg-surface-2 hover:bg-surface-3 border border-hairline rounded-xl text-xs font-semibold text-text-secondary flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Pass Job Role
                </button>
                <button
                  onClick={() => handleApplyJob(selectedJobSummary)}
                  className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary/95 transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Apply Instantly
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
