"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, slideUpVariants } from "@/lib/motion";
import { 
  Sparkles, 
  Code, 
  FileText, 
  CheckCircle2, 
  Plus, 
  Sliders, 
  TrendingUp, 
  UserCheck, 
  FolderGit, 
  Layers, 
  Building2, 
  History,
  GitBranch,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { TelemetryStrip } from "@/components/ecosystem/TelemetryStrip";

export default function ProfilePage() {
  // Ingested data states
  const [identity, setIdentity] = useState({
    seniority: "Staff Frontend Engineer",
    industry: "Developer Infrastructure & SaaS",
    githubConnected: true,
    linkedinConnected: true,
    resumeParsed: true
  });

  const [skills, setSkills] = useState([
    { name: "React / Next.js", level: "Expert", verified: true, source: "github" },
    { name: "TypeScript", level: "Expert", verified: true, source: "github" },
    { name: "Distributed Systems", level: "Intermediate", verified: false, source: "linkedin" },
    { name: "Rust", level: "Advanced", verified: true, source: "github" },
    { name: "GraphQL", level: "Advanced", verified: false, source: "resume" },
    { name: "PostgreSQL", level: "Advanced", verified: true, source: "resume" }
  ]);

  const [experience, setExperience] = useState([
    {
      id: "exp1",
      role: "Lead Frontend Engineer",
      company: "Vercel",
      duration: "2024 - Present",
      metric: "+45% Routing Velocity",
      keywords: ["Next.js", "Turbopack", "Rust", "WebAssembly"],
      description: "Directing the next-generation Server Components compilation optimization engine. Integrated core Rust compiler modules."
    },
    {
      id: "exp2",
      role: "Senior UI Infrastructure Engineer",
      company: "Stripe",
      duration: "2021 - 2024",
      metric: "-18% Core Dashboard Latency",
      keywords: ["React", "UI Components", "TypeScript", "Performance Tuning"],
      description: "Led core UI component design and framework updates. Reduced global dashboard hydration latency metrics."
    }
  ]);

  const [branches, setBranches] = useState([
    { name: "feature/stripe-frontend", target: "Stripe UI / Infrastructure Roles", status: "Active" },
    { name: "feature/staff-generalist", target: "General staff level engineering", status: "Active" },
    { name: "feature/rust-wasm", target: "Rust, Wasm, Compilers targeting", status: "Draft" }
  ]);

  const handleVerifySkill = (name: string) => {
    setSkills(skills.map(s => s.name === name ? { ...s, verified: true } : s));
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl flex flex-col gap-lg py-md pb-xl"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title="Identity Graph"
          subtitle="Living professional identity — experiences, skills, resume variants, market posture."
          telemetry={
            <TelemetryStrip
              metrics={[
                { label: "Skills verified", value: "4/6", sublabel: "Graph", status: "success", icon: UserCheck },
                { label: "Resume branches", value: "3", sublabel: "Active", status: "intelligence", icon: GitBranch },
                { label: "Experiences", value: "2", sublabel: "Parsed", status: "neutral", icon: Layers },
                { label: "Sync status", value: "Live", sublabel: "GitHub + LI", status: "success" },
              ]}
            />
          }
        />
      </motion.div>

      <motion.div variants={slideUpVariants} className="flex flex-col gap-xs pb-md border-b border-hairline relative">
        <p className="text-text-secondary text-sm">
          Your continuous, AI-enriched professional capability graph. Syncs live with discoverability metrics.
        </p>

        {/* Enrichment Status Badges */}
        <div className="flex gap-sm mt-sm flex-wrap">
          <div className="flex items-center gap-xs px-2.5 py-1 bg-surface-1 border border-hairline rounded text-xs">
            <GithubIcon className="w-3.5 h-3.5 text-text-secondary" />
            <span className="text-text-secondary font-medium">GitHub Ingested:</span>
            <span className="text-success font-semibold">Active</span>
          </div>
          <div className="flex items-center gap-xs px-2.5 py-1 bg-surface-1 border border-hairline rounded text-xs">
            <LinkedinIcon className="w-3.5 h-3.5 text-text-secondary" />
            <span className="text-text-secondary font-medium">LinkedIn Ingested:</span>
            <span className="text-success font-semibold">Active</span>
          </div>
          <div className="flex items-center gap-xs px-2.5 py-1 bg-surface-1 border border-hairline rounded text-xs">
            <FileText className="w-3.5 h-3.5 text-text-secondary" />
            <span className="text-text-secondary font-medium">Static Resume Parsed:</span>
            <span className="text-success font-semibold">Sync ✓</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* Left Column: Skills and Branch Variants */}
        <div className="md:col-span-1 flex flex-col gap-md">
          {/* Skills Graph */}
          <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center border-b border-hairline pb-xs">
              <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-ai" /> Skills Graph
              </h3>
              <button className="text-text-secondary hover:text-text-primary p-0.5 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-xs mt-xs">
              {skills.map((skill) => (
                <div key={skill.name} className="flex flex-col bg-surface-2/60 border border-hairline/50 p-2 rounded text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-text-primary">{skill.name}</span>
                    <span className="text-[10px] font-mono text-text-tertiary bg-surface-3 px-1 rounded">{skill.level}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1.5 text-[10px]">
                    <span className="text-text-tertiary font-mono">source: {skill.source}</span>
                    {skill.verified ? (
                      <span className="text-success font-bold flex items-center gap-0.5 text-[9px] uppercase tracking-wider">
                        ✓ Verified
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleVerifySkill(skill.name)}
                        className="text-ai font-bold hover:text-ai-hover transition-colors text-[9px] uppercase tracking-wider"
                      >
                        Verify Skill
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Resume Target Branches */}
          <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center border-b border-hairline pb-xs">
              <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5">
                <FolderGit className="w-3.5 h-3.5 text-ai" /> Targeting Branches
              </h3>
            </div>
            
            <div className="flex flex-col gap-xs mt-xs">
              {branches.map((branch) => (
                <div key={branch.name} className="bg-surface-2/60 border border-hairline/50 p-2 rounded flex flex-col gap-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-ai font-bold tracking-tight text-[11px] truncate max-w-[150px]">{branch.name}</span>
                    <span className={`text-[9px] font-bold px-1 rounded uppercase ${
                      branch.status === "Active" ? "bg-success/10 text-success" : "bg-surface-3 text-text-tertiary"
                    }`}>{branch.status}</span>
                  </div>
                  <span className="text-[10px] text-text-secondary leading-normal">{branch.target}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column (2 spans): Experience Graph & Career Timeline */}
        <div className="md:col-span-2 flex flex-col gap-md">
          {/* Experience list */}
          <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center border-b border-hairline pb-xs mb-xs">
              <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-ai" /> Experience Identity Timeline
              </h3>
            </div>

            <div className="flex flex-col gap-md">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-hairline pl-md relative flex flex-col gap-xs">
                  <div className="absolute w-2 h-2 rounded-full bg-ai -left-[5px] top-[6px]" />
                  <div className="flex justify-between items-start flex-wrap gap-xs">
                    <div>
                      <h4 className="text-sm font-bold text-text-primary leading-tight">{exp.role}</h4>
                      <div className="flex gap-xs items-center text-[11px] text-text-tertiary font-medium mt-0.5">
                        <span className="flex items-center gap-0.5"><Building2 className="w-3 h-3" /> {exp.company}</span>
                        <span>•</span>
                        <span>{exp.duration}</span>
                      </div>
                    </div>
                    <div className="px-2 py-0.5 bg-success/10 text-success border border-success/15 rounded text-[10px] font-bold uppercase tracking-wider">
                      {exp.metric}
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    {exp.description}
                  </p>

                  <div className="flex gap-xs flex-wrap mt-1">
                    {exp.keywords.map(kw => (
                      <span key={kw} className="text-[9px] font-semibold bg-surface-2 border border-hairline/80 px-2 py-0.5 rounded text-text-secondary">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Marketplace preferences quick-posture */}
          <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-hairline pb-xs mb-xs">
              <Sliders className="w-3.5 h-3.5 text-ai" /> Active Job Search Posture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              <div className="bg-surface-2/60 border border-hairline/50 p-2.5 rounded text-xs flex flex-col gap-0.5">
                <span className="text-text-tertiary uppercase text-[9px] tracking-wider font-bold">Base Compensation Target</span>
                <span className="text-sm font-bold text-text-primary mt-1">$180,000+ Base Salary</span>
                <span className="text-[10px] text-success font-semibold flex items-center gap-1 mt-1">✓ Strictly Enforced Filters</span>
              </div>
              <div className="bg-surface-2/60 border border-hairline/50 p-2.5 rounded text-xs flex flex-col gap-0.5">
                <span className="text-text-tertiary uppercase text-[9px] tracking-wider font-bold">Target scale / stages</span>
                <span className="text-sm font-bold text-text-primary mt-1">Series A, Series B, Enterprise</span>
                <span className="text-[10px] text-text-secondary mt-1">Preferences are shared with verified matches</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
