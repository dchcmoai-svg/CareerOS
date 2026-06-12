"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Building2,
  Download,
  Eye,
  Upload,
  Pencil,
  CheckCircle2,
  Plus,
  MapPin,
  Mail,
  GraduationCap,
  Layers,
  Award,
  Terminal,
  ExternalLink,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Trash2,
  X,
  RefreshCw,
  FileCheck
} from "lucide-react";
import { staggerContainer, slideUpVariants, staggerItem } from "@/lib/motion";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { IntelligenceCard } from "@/components/intelligence/IntelligenceCard";
import { cn } from "@/lib/utils";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";
import { UserProject, UserExperience, UserEducation, ApplicationDefaultsData } from "@/lib/profile-types";

// Default Fallback Datasets (used if profile data is loading or empty)
const DEFAULT_PROJECTS: UserProject[] = [
  {
    id: "waterborne",
    title: "WaterBorne",
    tags: ["React.js", "Vercel", "REST APIs"],
    bullets: [
      "Designed and deployed a full-stack awareness web application focused on water-borne health issues, accessible via public URL on Vercel.",
      "Implemented a responsive, mobile-first UI using React.js with dynamic content rendering and clean component architecture.",
      "Configured end-to-end deployment pipeline with CI/CD via Vercel, reducing deployment time and ensuring zero-downtime updates."
    ]
  },
  {
    id: "weatherui",
    title: "WeatherUI",
    tags: ["JavaScript", "OpenWeather API", "HTML", "CSS"],
    bullets: [
      "Developed a real-time weather interface application that fetches live meteorological data via external APIs and renders it through a responsive UI.",
      "Implemented location-based search with dynamic data handling, displaying temperature, humidity, and forecast information with smooth UI state transitions.",
      "Optimized API call efficiency with client-side caching logic, reducing redundant requests and improving application performance."
    ]
  },
  {
    id: "usc-kiit",
    title: "USC KIIT Members Management System",
    tags: ["JavaScript", "Node.js", "JSON", "Database"],
    bullets: [
      "Architected a membership management system for a university student community, supporting structured storage and retrieval of member profiles, roles, and activity data.",
      "Designed admin-level access control and data organization modules, enabling efficient member onboarding and record management.",
      "Applied modular code design principles to ensure system scalability and ease of future feature integration."
    ]
  }
];

const DEFAULT_EXPERIENCE: UserExperience[] = [
  {
    id: "1",
    role: "Web Development Lead",
    company: "Cyber Peace Corps, KIIT Chapter",
    duration: "Apr 2026 — Present (3 mos)",
    bullets: [
      "Developed and maintained web interfaces for cyber awareness initiatives, contributing to digital safety outreach campaigns.",
      "Collaborated with a cross-functional team to design responsive, accessible front-end components using React.js and modern CSS.",
      "Participated in code reviews and sprint planning, applying agile workflows to deliver features on schedule."
    ],
    tags: ["React.js", "Agile", "Team Lead"]
  }
];

const DEFAULT_EDUCATION: UserEducation[] = [
  {
    id: "edu-1",
    school: "KIIT University",
    degree: "Bachelor of Technology · Computer Science and Engineering",
    duration: "Aug 2024 — Present"
  }
];

const DEFAULT_DEFAULTS: ApplicationDefaultsData = {
  visaType: "None",
  authorizedToWork: true,
  needsSponsorship: false,
  inPersonOk: true,
  canRelocate: true,
  startImmediately: true,
  hasTransport: true,
  needsAccommodations: false,
  priorEmployee: false,
  govClearance: false,
  govTies: false,
  gender: "Male",
  ethnicity: "Asian",
  veteran: false,
  disability: false,
  noticePeriod: "Immediate",
  currentCtc: "₹8 LPA",
  expectedCtc: "₹12 LPA",
  preferredLocations: ["Bengaluru", "Noida", "Gurgaon"],
  panCardName: "KUMAR KUSHANG"
};

const SKILL_GROUPS = [
  {
    category: "Programming Languages",
    skills: ["TypeScript", "JavaScript", "Python", "C++", "SQL", "HTML/CSS"]
  },
  {
    category: "Frameworks & Libraries",
    skills: ["React.js", "Next.js", "Node.js", "Express.js", "Tailwind CSS"]
  },
  {
    category: "Tools & Platforms",
    skills: ["PostgreSQL", "MongoDB", "Git", "GitHub", "Vercel", "Firebase"]
  },
  {
    category: "Soft Skills & Process",
    skills: ["Data Structures", "Algorithms", "REST APIs", "Agile Workflows", "Team Lead"]
  }
];

export function CareerVaultProfile() {
  const { profile, refreshProfile } = useUserEcosystem();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    waterborne: true,
    weatherui: false
  });

  const [activeProfileTab, setActiveProfileTab] = useState("default");
  const [isUpdating, setIsUpdating] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Form Modal States
  const [modalType, setModalType] = useState<"project" | "experience" | "education" | "coverLetter" | "resumePreview" | null>(null);
  
  // Project Form
  const [projectTitle, setProjectTitle] = useState("");
  const [projectTags, setProjectTags] = useState("");
  const [projectBullets, setProjectBullets] = useState("");

  // Experience Form
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDuration, setExpDuration] = useState("");
  const [expBullets, setExpBullets] = useState("");
  const [expTags, setExpTags] = useState("");

  // Education Form
  const [eduSchool, setEduSchool] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduDuration, setEduDuration] = useState("");

  // Cover Letter Form
  const [coverLetterContent, setCoverLetterContent] = useState("");

  const projects = profile?.projectsList || DEFAULT_PROJECTS;
  const experiences = profile?.experienceList || DEFAULT_EXPERIENCE;
  const education = profile?.educationList || DEFAULT_EDUCATION;
  const currentDefaults = profile?.appDefaults || DEFAULT_DEFAULTS;
  const resumeFileName = profile?.resumeFileName || "Kushang_Resume.pdf";
  const coverLetterText = profile?.coverLetterText || "";

  useEffect(() => {
    if (profile?.coverLetterText) {
      setCoverLetterContent(profile.coverLetterText);
    }
  }, [profile]);

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const saveProfileChanges = async (payload: any) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await refreshProfile();
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Indian Job Pool toggles & changes
  const handleToggleDefault = async (field: keyof ApplicationDefaultsData) => {
    const updatedDefaults = {
      ...currentDefaults,
      [field]: !currentDefaults[field]
    };
    await saveProfileChanges({ appDefaults: updatedDefaults });
  };

  const handleVisaChange = async (visaType: string) => {
    const updatedDefaults = {
      ...currentDefaults,
      visaType
    };
    await saveProfileChanges({ appDefaults: updatedDefaults });
  };

  const handleDemographicsChange = async (field: "gender" | "ethnicity" | "noticePeriod", value: string) => {
    const updatedDefaults = {
      ...currentDefaults,
      [field]: value
    };
    await saveProfileChanges({ appDefaults: updatedDefaults });
  };

  const handleCtcChange = async (field: "currentCtc" | "expectedCtc", value: string) => {
    const updatedDefaults = {
      ...currentDefaults,
      [field]: value
    };
    await saveProfileChanges({ appDefaults: updatedDefaults });
  };

  const handleToggleLocation = async (loc: string) => {
    const currentLocs = currentDefaults.preferredLocations || [];
    let updatedLocs: string[];
    if (currentLocs.includes(loc)) {
      updatedLocs = currentLocs.filter(l => l !== loc);
    } else {
      updatedLocs = [...currentLocs, loc];
    }
    const updatedDefaults = {
      ...currentDefaults,
      preferredLocations: updatedLocs
    };
    await saveProfileChanges({ appDefaults: updatedDefaults });
  };

  const handlePanChange = async (val: string) => {
    const updatedDefaults = {
      ...currentDefaults,
      panCardName: val
    };
    await saveProfileChanges({ appDefaults: updatedDefaults });
  };

  // Resume Upload Simulation
  const triggerResumeUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleResumeFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    // Simulate upload progress
    setTimeout(async () => {
      await saveProfileChanges({
        resumeFileName: file.name,
        resumeUploadedAt: new Date().toISOString()
      });
      setUploadingResume(false);
    }, 1500);
  };

  // Resume Download Action
  const handleDownloadResume = () => {
    const bulletsText = (bullets: string[]) => bullets.map(b => `  - ${b}`).join("\n");
    const tagsText = (tags: string[]) => tags.join(", ");

    const cvText = `
=========================================
KUMAR KUSHANG
Location: Jayant, Madhya Pradesh, India
Email: ${profile?.email || "dchcmoai@gmail.com"}
GitHub: https://github.com/dchcmoai
LinkedIn: https://linkedin.com/in/kushang
=========================================

PROFESSIONAL EXPERIENCE:
${experiences.map(exp => `
* ${exp.role} | ${exp.company}
  Duration: ${exp.duration}
  Tech Stack: ${tagsText(exp.tags)}
${bulletsText(exp.bullets)}
`).join("\n")}

EDUCATION:
${education.map(edu => `
* ${edu.degree}
  School: ${edu.school}
  Duration: ${edu.duration}
`).join("\n")}

PROJECTS:
${projects.map(proj => `
* ${proj.title}
  Tech: ${tagsText(proj.tags)}
${bulletsText(proj.bullets)}
`).join("\n")}

SKILLS:
${SKILL_GROUPS.map(g => `
* ${g.category}:
  ${g.skills.join(", ")}
`).join("\n")}

=========================================
Generated via CareerOS - Career Vault
=========================================
`;

    const blob = new Blob([cvText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(profile?.name || "Kumar_Kushang").replace(/\s+/g, "_")}_Resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Add Project Action
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    const newProject: UserProject = {
      id: `proj_${Date.now()}`,
      title: projectTitle,
      tags: projectTags.split(",").map(t => t.trim()).filter(Boolean),
      bullets: projectBullets.split("\n").map(b => b.trim()).filter(Boolean)
    };

    const updatedProjects = [...projects, newProject];
    await saveProfileChanges({ projectsList: updatedProjects });

    // Reset Form
    setProjectTitle("");
    setProjectTags("");
    setProjectBullets("");
    setModalType(null);
  };

  // Delete Project Action
  const handleDeleteProject = async (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    await saveProfileChanges({ projectsList: updatedProjects });
  };

  // Add Experience Action
  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole.trim() || !expCompany.trim()) return;

    const newExp: UserExperience = {
      id: `exp_${Date.now()}`,
      role: expRole,
      company: expCompany,
      duration: expDuration || "Present",
      bullets: expBullets.split("\n").map(b => b.trim()).filter(Boolean),
      tags: expTags.split(",").map(t => t.trim()).filter(Boolean)
    };

    const updatedExperiences = [...experiences, newExp];
    await saveProfileChanges({ experienceList: updatedExperiences });

    // Reset Form
    setExpRole("");
    setExpCompany("");
    setExpDuration("");
    setExpBullets("");
    setExpTags("");
    setModalType(null);
  };

  // Delete Experience Action
  const handleDeleteExperience = async (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    await saveProfileChanges({ experienceList: updatedExperiences });
  };

  // Add Education Action
  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduSchool.trim() || !eduDegree.trim()) return;

    const newEdu: UserEducation = {
      id: `edu_${Date.now()}`,
      school: eduSchool,
      degree: eduDegree,
      duration: eduDuration || "Present"
    };

    const updatedEducation = [...education, newEdu];
    await saveProfileChanges({ educationList: updatedEducation });

    // Reset Form
    setEduSchool("");
    setEduDegree("");
    setEduDuration("");
    setModalType(null);
  };

  // Delete Education Action
  const handleDeleteEducation = async (id: string) => {
    const updatedEducation = education.filter(edu => edu.id !== id);
    await saveProfileChanges({ educationList: updatedEducation });
  };

  // Save Cover Letter Action
  const handleSaveCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfileChanges({ coverLetterText: coverLetterContent });
    setModalType(null);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-lg py-md pb-xl"
    >
      {/* Hidden file input for resume upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleResumeFileSelected}
        accept=".pdf,.docx,.txt"
        className="hidden"
      />

      {/* Top Header */}
      <motion.div variants={slideUpVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div className="flex items-center gap-3">
          <PageHeader
            title="Career Vault"
            subtitle="Your professional story, verified skills, and application defaults — unified."
          />
          {isUpdating && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-2 border border-hairline text-[11px] text-text-tertiary font-medium h-fit mb-4 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" /> Syncing database...
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={activeProfileTab}
            onChange={(e) => setActiveProfileTab(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-surface-2 border border-hairline text-[12px] text-text-secondary focus:outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="default">Default Profile</option>
            <option value="new">+ Create New Profile</option>
          </select>
          <button type="button" className="px-3.5 py-1.5 rounded-lg border border-hairline hover:bg-surface-2 text-[12px] font-semibold text-text-primary transition-colors flex items-center gap-1.5 cursor-pointer">
            <Pencil className="w-3.5 h-3.5" /> Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Two Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">
        {/* Left Side: Profile Summary, Documents & Defaults */}
        <div className="lg:col-span-1 space-y-lg">
          {/* Identity Card */}
          <motion.div variants={slideUpVariants}>
            <IntelligenceCard title="Profile Health" domain="resume">
              <div className="space-y-4 mt-2">
                <div className="flex items-center justify-between gap-md">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary tracking-tight">
                      {profile?.name || "Kumar Kushang"}
                    </h3>
                    <p className="text-[12px] text-text-tertiary mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" /> Jayant, Madhya Pradesh, India
                    </p>
                    <p className="text-[11px] text-text-tertiary mt-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 shrink-0" /> {profile?.email || "dchcmoai@gmail.com"}
                    </p>
                  </div>
                  
                  {/* Circular completion meter */}
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="4"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#8B5CF6"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={2 * Math.PI * 28 * (1 - 0.83)}
                      />
                    </svg>
                    <span className="absolute text-[12px] font-black text-text-primary">83%</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 border-t border-hairline">
                  <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-surface-2 border border-hairline text-text-secondary">
                    <LinkedinIcon className="w-3 h-3 text-blue-400" /> LinkedIn Connected
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded bg-surface-2 border border-hairline text-text-secondary">
                    <GithubIcon className="w-3 h-3 text-text-primary" /> GitHub Synced
                  </span>
                </div>
              </div>
            </IntelligenceCard>
          </motion.div>

          {/* Documents Asset Hub */}
          <motion.div variants={slideUpVariants} className="grid grid-cols-1 gap-md">
            <IntelligenceCard title="Resume" subtitle="Master document for optimizations" icon={FileText} domain="resume">
              <div className="flex items-center justify-between border border-hairline bg-surface-2/40 rounded-lg p-2.5 mt-2">
                <span className="text-[11px] font-semibold text-text-primary truncate">
                  {uploadingResume ? "Uploading document..." : resumeFileName}
                </span>
                {uploadingResume ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                ) : (
                  <span className="text-[9px] font-bold text-success uppercase">PDF</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5 mt-3">
                <button
                  type="button"
                  onClick={() => setModalType("resumePreview")}
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded border border-hairline bg-surface-2 hover:bg-surface-3 text-[10px] font-semibold text-text-secondary cursor-pointer transition-colors"
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <button
                  type="button"
                  onClick={triggerResumeUpload}
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded border border-hairline bg-surface-2 hover:bg-surface-3 text-[10px] font-semibold text-text-secondary cursor-pointer transition-colors"
                >
                  <Upload className="w-3 h-3" /> Upload
                </button>
                <button
                  type="button"
                  onClick={handleDownloadResume}
                  className="flex items-center justify-center gap-1.5 py-1.5 rounded border border-hairline bg-surface-2 hover:bg-surface-3 text-[10px] font-semibold text-text-secondary cursor-pointer transition-colors"
                >
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            </IntelligenceCard>

            <IntelligenceCard title="Cover Letter" subtitle="Customizable default template" icon={FileText} domain="primary">
              <div className="border border-hairline bg-surface-2/40 rounded-lg p-2.5 mt-2 min-h-12 flex items-center">
                <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                  {coverLetterText || "Click 'Preview & Edit' to initialize your default cover letter template."}
                </p>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setModalType("coverLetter")}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded border border-hairline bg-surface-2 hover:bg-surface-3 text-[10px] font-semibold text-text-secondary cursor-pointer transition-colors"
                >
                  <Pencil className="w-3 h-3" /> Preview & Edit
                </button>
              </div>
            </IntelligenceCard>
          </motion.div>

          {/* Application Defaults */}
          <motion.div variants={slideUpVariants}>
            <IntelligenceCard
              title="Application Defaults"
              subtitle="What we auto-fill on every job portal form."
              domain="primary"
            >
              <div className="space-y-4 mt-2 divide-y divide-hairline">
                
                {/* Indian Job Pool CTC & Notice Period */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> Indian Job Market Defaults
                  </h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-text-secondary">Notice Period:</span>
                      <select
                        value={currentDefaults.noticePeriod || "Immediate"}
                        onChange={(e) => handleDemographicsChange("noticePeriod", e.target.value)}
                        className="bg-surface-2 border border-hairline text-text-primary text-[11px] font-semibold px-2 py-0.5 rounded focus:outline-none cursor-pointer"
                      >
                        <option value="Immediate">Immediate Joiner</option>
                        <option value="15 days">15 Days</option>
                        <option value="30 days">30 Days (1 Month)</option>
                        <option value="60 days">60 Days (2 Months)</option>
                        <option value="90 days">90 Days (3 Months)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex justify-between items-center pr-2 border-r border-hairline">
                        <span className="text-text-tertiary">Current CTC:</span>
                        <input
                          type="text"
                          value={currentDefaults.currentCtc || "₹8 LPA"}
                          onChange={(e) => handleCtcChange("currentCtc", e.target.value)}
                          className="bg-transparent border-none text-text-primary text-[11px] font-semibold text-right focus:outline-none w-14"
                          placeholder="e.g. ₹8 LPA"
                        />
                      </div>
                      <div className="flex justify-between items-center pl-2">
                        <span className="text-text-tertiary">Expected CTC:</span>
                        <input
                          type="text"
                          value={currentDefaults.expectedCtc || "₹12 LPA"}
                          onChange={(e) => handleCtcChange("expectedCtc", e.target.value)}
                          className="bg-transparent border-none text-text-primary text-[11px] font-semibold text-right focus:outline-none w-14"
                          placeholder="e.g. ₹12 LPA"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-text-tertiary block mb-1">PAN Card Full Name:</span>
                      <input
                        type="text"
                        value={currentDefaults.panCardName || "KUMAR KUSHANG"}
                        onChange={(e) => handlePanChange(e.target.value)}
                        placeholder="Name on PAN Card"
                        className="w-full px-2 py-1 rounded bg-surface-2 border border-hairline text-[11px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary/50"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-text-tertiary block mb-1.5">Preferred Job Locations in India:</span>
                      <div className="flex flex-wrap gap-1">
                        {["Bengaluru", "Noida", "Gurgaon", "Hyderabad", "Pune", "Mumbai"].map((loc) => {
                          const isSel = (currentDefaults.preferredLocations || []).includes(loc);
                          return (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => handleToggleLocation(loc)}
                              className={cn(
                                "text-[9px] font-semibold px-2 py-0.5 rounded border cursor-pointer transition-colors",
                                isSel
                                  ? "bg-primary/15 border-primary/30 text-primary"
                                  : "bg-surface-2 border-hairline text-text-tertiary opacity-70 hover:opacity-100"
                              )}
                            >
                              {loc}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Authorization */}
                <div className="pt-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-2">Work Authorization</h4>
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <span className="text-text-secondary">Visa status:</span>
                    <select
                      value={currentDefaults.visaType}
                      onChange={(e) => handleVisaChange(e.target.value)}
                      className="bg-surface-2 border border-hairline text-text-primary text-[11px] font-semibold px-2 py-0.5 rounded focus:outline-none cursor-pointer"
                    >
                      <option value="None">Indian Resident (No Visa)</option>
                      <option value="F-1">F-1 Visa</option>
                      <option value="H-1B">H-1B Visa</option>
                      <option value="Citizen">US Citizen</option>
                      <option value="Green Card">US Permanent Resident</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("authorizedToWork")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.authorizedToWork
                          ? "bg-success/15 border-success/30 text-success"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.authorizedToWork && <Check className="w-3 h-3" />} Authorized to work
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("needsSponsorship")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.needsSponsorship
                          ? "bg-warning/15 border-warning/30 text-warning"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.needsSponsorship && <Check className="w-3 h-3" />} Needs sponsorship
                    </button>
                  </div>
                </div>

                {/* Work Preferences */}
                <div className="pt-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-2">Work Preferences</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("inPersonOk")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.inPersonOk
                          ? "bg-success/15 border-success/30 text-success"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.inPersonOk && <Check className="w-3 h-3" />} In-person OK
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("startImmediately")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.startImmediately
                          ? "bg-success/15 border-success/30 text-success"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.startImmediately && <Check className="w-3 h-3" />} Start immediately
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("canRelocate")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.canRelocate
                          ? "bg-success/15 border-success/30 text-success"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.canRelocate && <Check className="w-3 h-3" />} Can relocate
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("hasTransport")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.hasTransport
                          ? "bg-success/15 border-success/30 text-success"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.hasTransport && <Check className="w-3 h-3" />} Has transport
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("needsAccommodations")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.needsAccommodations
                          ? "bg-success/15 border-success/30 text-success"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.needsAccommodations && <Check className="w-3 h-3" />} Needs accommodations
                    </button>
                  </div>
                </div>

                {/* Background Checks */}
                <div className="pt-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-2">Background Checks</h4>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("priorEmployee")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.priorEmployee
                          ? "bg-success/15 border-success/30 text-success"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.priorEmployee && <Check className="w-3 h-3" />} Prior employee
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("govClearance")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.govClearance
                          ? "bg-success/15 border-success/30 text-success"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.govClearance && <Check className="w-3 h-3" />} Gov clearance
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("govTies")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.govTies
                          ? "bg-success/15 border-success/30 text-success"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.govTies && <Check className="w-3 h-3" />} Gov ties
                    </button>
                  </div>
                </div>

                {/* Demographic Information */}
                <div className="pt-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-2">Voluntary Self-ID</h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-2.5">
                    <div className="flex justify-between items-center pr-2 border-r border-hairline">
                      <span className="text-text-tertiary">Gender:</span>
                      <select
                        value={currentDefaults.gender}
                        onChange={(e) => handleDemographicsChange("gender", e.target.value)}
                        className="bg-transparent border-none text-text-primary text-[11px] font-semibold focus:outline-none cursor-pointer text-right"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Decline to State">Decline</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center pl-2">
                      <span className="text-text-tertiary">Ethnicity:</span>
                      <select
                        value={currentDefaults.ethnicity}
                        onChange={(e) => handleDemographicsChange("ethnicity", e.target.value)}
                        className="bg-transparent border-none text-text-primary text-[11px] font-semibold focus:outline-none cursor-pointer text-right max-w-[80px]"
                      >
                        <option value="Asian">Asian</option>
                        <option value="White">White</option>
                        <option value="Black">Black</option>
                        <option value="Hispanic">Hispanic</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("veteran")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.veteran
                          ? "bg-success/15 border-success/30 text-success"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.veteran && <Check className="w-3 h-3" />} Veteran
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleDefault("disability")}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-semibold cursor-pointer transition-colors",
                        currentDefaults.disability
                          ? "bg-success/15 border-success/30 text-success"
                          : "bg-surface-2 border-hairline text-text-tertiary opacity-60 hover:opacity-100"
                      )}
                    >
                      {currentDefaults.disability && <Check className="w-3 h-3" />} Disability
                    </button>
                  </div>
                </div>
              </div>
            </IntelligenceCard>
          </motion.div>
        </div>

        {/* Right Side: Experience, Education, Skills, Projects */}
        <div className="lg:col-span-2 space-y-lg">
          {/* Experience Timeline */}
          <motion.div variants={slideUpVariants}>
            <IntelligenceCard 
              title="Professional Experience" 
              icon={Building2} 
              domain="primary"
              footer={
                <button
                  type="button"
                  onClick={() => setModalType("experience")}
                  className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Professional Experience
                </button>
              }
            >
              <div className="space-y-6 mt-3">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l border-hairline group">
                    {/* Glowing timeline node */}
                    <div className="absolute -left-[4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                    
                    <div className="flex justify-between items-start gap-md">
                      <div>
                        <h4 className="text-[14px] font-bold text-text-primary flex items-center gap-2">
                          {exp.role}
                          <button
                            type="button"
                            onClick={() => handleDeleteExperience(exp.id)}
                            className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-danger transition-all p-0.5 rounded hover:bg-surface-3 cursor-pointer"
                            title="Delete experience"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </h4>
                        <p className="text-[12px] text-text-secondary mt-0.5">{exp.company}</p>
                      </div>
                      <span className="text-[10px] text-text-tertiary font-medium bg-surface-2 px-2 py-0.5 rounded border border-hairline shrink-0">
                        {exp.duration}
                      </span>
                    </div>

                    <ul className="list-disc list-outside space-y-1.5 mt-3 pl-4 text-[12.5px] text-text-secondary leading-relaxed">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>

                    {exp.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {exp.tags.map((t) => (
                          <span key={t} className="text-[10px] font-semibold text-text-tertiary bg-surface-2 px-2 py-0.5 rounded border border-hairline">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </IntelligenceCard>
          </motion.div>

          {/* Education Timeline */}
          <motion.div variants={slideUpVariants}>
            <IntelligenceCard 
              title="Education" 
              icon={GraduationCap} 
              domain="primary"
              footer={
                <button
                  type="button"
                  onClick={() => setModalType("education")}
                  className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Education
                </button>
              }
            >
              <div className="space-y-4 mt-3">
                {education.map((edu) => (
                  <div key={edu.id} className="relative pl-6 border-l border-hairline group">
                    <div className="absolute -left-[4.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-ai ring-4 ring-ai/20" />
                    
                    <div className="flex justify-between items-start gap-md">
                      <div>
                        <h4 className="text-[14px] font-bold text-text-primary flex items-center gap-2">
                          {edu.school}
                          <button
                            type="button"
                            onClick={() => handleDeleteEducation(edu.id)}
                            className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-danger transition-all p-0.5 rounded hover:bg-surface-3 cursor-pointer"
                            title="Delete education"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </h4>
                        <p className="text-[12px] text-text-secondary mt-0.5">{edu.degree}</p>
                      </div>
                      <span className="text-[10px] text-text-tertiary font-medium bg-surface-2 px-2 py-0.5 rounded border border-hairline shrink-0">
                        {edu.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </IntelligenceCard>
          </motion.div>

          {/* Skills Grid */}
          <motion.div variants={slideUpVariants}>
            <IntelligenceCard title="Skills" icon={Layers} domain="market">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {SKILL_GROUPS.map((group) => (
                  <div key={group.category} className="p-3.5 rounded-xl border border-hairline bg-surface-2/40">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary mb-2.5">
                      {group.category}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-surface-3 border border-hairline text-text-secondary hover:text-text-primary hover:border-primary/20 transition-all cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </IntelligenceCard>
          </motion.div>

          {/* Certifications Card */}
          <motion.div variants={slideUpVariants}>
            <IntelligenceCard title="Certifications" icon={Award} domain="primary">
              <div className="p-4 rounded-xl border border-dashed border-hairline bg-surface-1/30 text-center mt-2">
                <p className="text-[12px] text-text-tertiary">Add your credentials, badges, or licenses to display on optimized resumes.</p>
                <button type="button" className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 border border-hairline text-[11.5px] font-semibold text-text-primary transition-colors cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Add Credentials
                </button>
              </div>
            </IntelligenceCard>
          </motion.div>

          {/* Projects (GitHub Dashboard format) */}
          <motion.div variants={slideUpVariants}>
            <IntelligenceCard 
              title="Featured Projects" 
              icon={Terminal} 
              domain="resume"
              footer={
                <button
                  type="button"
                  onClick={() => setModalType("project")}
                  className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Featured Project
                </button>
              }
            >
              <div className="grid grid-cols-1 gap-md mt-3">
                {projects.map((project) => {
                  const isExpanded = !!expandedProjects[project.id];
                  return (
                    <div
                      key={project.id}
                      className="p-4 rounded-xl border border-hairline bg-surface-2/40 hover:bg-surface-2/60 transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h4 className="text-[14px] font-bold text-text-primary flex items-center gap-2">
                              {project.title}
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(project.id)}
                                className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-danger transition-all p-0.5 rounded hover:bg-surface-3 cursor-pointer"
                                title="Delete project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {project.tags.map((t) => (
                                <span key={t} className="text-[9px] font-semibold bg-surface-3 px-1.5 py-0.5 rounded border border-hairline text-text-tertiary">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleProject(project.id)}
                          className="text-[11px] font-semibold text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3.5 h-3.5" /> Collapse
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3.5 h-3.5" /> Expand
                            </>
                          )}
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <ul className="list-disc pl-4 space-y-1.5 text-[12.5px] text-text-secondary mt-3.5 border-t border-hairline/50 pt-3 leading-relaxed">
                              {project.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </IntelligenceCard>
          </motion.div>
        </div>
      </div>

      {/* Backdrop Form Modal Overlay */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-canvas/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-xl border border-hairline bg-surface-1 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center px-lg py-md border-b border-hairline shrink-0">
                <h3 className="text-[15px] font-bold text-text-primary flex items-center gap-2">
                  {modalType === "project" && "Add Featured Project"}
                  {modalType === "experience" && "Add Experience"}
                  {modalType === "education" && "Add Education"}
                  {modalType === "coverLetter" && "Edit Cover Letter"}
                  {modalType === "resumePreview" && "Master Resume Preview"}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-3 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Project Form */}
                {modalType === "project" && (
                  <form onSubmit={handleAddProject} className="p-lg space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                        Project Title
                      </label>
                      <input
                        required
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Personal Knowledge Vault"
                        className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                        Technologies / Tags
                      </label>
                      <input
                        type="text"
                        value={projectTags}
                        onChange={(e) => setProjectTags(e.target.value)}
                        placeholder="e.g. Next.js, Local DB, Vercel (comma separated)"
                        className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                        Description Bullets (one per line)
                      </label>
                      <textarea
                        required
                        value={projectBullets}
                        onChange={(e) => setProjectBullets(e.target.value)}
                        placeholder="Designed with local-first architecture for speed and privacy...&#10;Built full-text search capability..."
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setModalType(null)}
                        className="px-4 py-2 rounded-lg border border-hairline text-[12px] font-semibold text-text-secondary hover:bg-surface-2 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-[12px] font-semibold text-white shadow-sm cursor-pointer"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                )}

                {/* Experience Form */}
                {modalType === "experience" && (
                  <form onSubmit={handleAddExperience} className="p-lg space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                          Role Title
                        </label>
                        <input
                          required
                          type="text"
                          value={expRole}
                          onChange={(e) => setExpRole(e.target.value)}
                          placeholder="e.g. Web Developer"
                          className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                          Company Name
                        </label>
                        <input
                          required
                          type="text"
                          value={expCompany}
                          onChange={(e) => setExpCompany(e.target.value)}
                          placeholder="e.g. USC KIIT"
                          className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                        Duration Date Range
                      </label>
                      <input
                        type="text"
                        value={expDuration}
                        onChange={(e) => setExpDuration(e.target.value)}
                        placeholder="e.g. Oct 2025 — Present (9 mos)"
                        className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                        Tags / Tech Stack
                      </label>
                      <input
                        type="text"
                        value={expTags}
                        onChange={(e) => setExpTags(e.target.value)}
                        placeholder="e.g. React.js, Agile, JavaScript (comma separated)"
                        className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                        Experience Bullets (one per line)
                      </label>
                      <textarea
                        required
                        value={expBullets}
                        onChange={(e) => setExpBullets(e.target.value)}
                        placeholder="Built and maintained the club's member management system...&#10;Engineered structured data storage..."
                        rows={4}
                        className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setModalType(null)}
                        className="px-4 py-2 rounded-lg border border-hairline text-[12px] font-semibold text-text-secondary hover:bg-surface-2 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-[12px] font-semibold text-white shadow-sm cursor-pointer"
                      >
                        Save Experience
                      </button>
                    </div>
                  </form>
                )}

                {/* Education Form */}
                {modalType === "education" && (
                  <form onSubmit={handleAddEducation} className="p-lg space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                        School / University
                      </label>
                      <input
                        required
                        type="text"
                        value={eduSchool}
                        onChange={(e) => setEduSchool(e.target.value)}
                        placeholder="e.g. KIIT University"
                        className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                        Degree / Course
                      </label>
                      <input
                        required
                        type="text"
                        value={eduDegree}
                        onChange={(e) => setEduDegree(e.target.value)}
                        placeholder="e.g. Bachelor of Technology · Computer Science"
                        className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                        Duration Date Range
                      </label>
                      <input
                        type="text"
                        value={eduDuration}
                        onChange={(e) => setEduDuration(e.target.value)}
                        placeholder="e.g. Aug 2024 — Present"
                        className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setModalType(null)}
                        className="px-4 py-2 rounded-lg border border-hairline text-[12px] font-semibold text-text-secondary hover:bg-surface-2 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-[12px] font-semibold text-white shadow-sm cursor-pointer"
                      >
                        Save Education
                      </button>
                    </div>
                  </form>
                )}

                {/* Cover Letter Edit Form */}
                {modalType === "coverLetter" && (
                  <form onSubmit={handleSaveCoverLetter} className="p-lg space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1">
                        Cover Letter Content
                      </label>
                      <textarea
                        required
                        value={coverLetterContent}
                        onChange={(e) => setCoverLetterContent(e.target.value)}
                        rows={12}
                        className="w-full p-3 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 font-sans leading-relaxed"
                      />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setModalType(null)}
                        className="px-4 py-2 rounded-lg border border-hairline text-[12px] font-semibold text-text-secondary hover:bg-surface-2 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-[12px] font-semibold text-white shadow-sm cursor-pointer"
                      >
                        Save Template
                      </button>
                    </div>
                  </form>
                )}

                {/* Resume Print Preview */}
                {modalType === "resumePreview" && (
                  <div className="p-lg space-y-6 bg-surface-2/40 border border-hairline m-4 rounded-lg font-sans text-text-primary text-[12.5px] max-w-xl mx-auto shadow-inner">
                    <div className="text-center space-y-1 pb-4 border-b border-hairline">
                      <h2 className="text-xl font-bold tracking-tight text-text-primary">{profile?.name || "Kumar Kushang"}</h2>
                      <p className="text-text-secondary text-[11px] flex items-center justify-center gap-1.5">
                        <MapPin className="w-3 h-3 text-text-tertiary" /> Jayant, India · <Mail className="w-3 h-3 text-text-tertiary" /> {profile?.email || "dchcmoai@gmail.com"}
                      </p>
                      <p className="text-[10px] text-text-tertiary">
                        github.com/dchcmoai · linkedin.com/in/kushang
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Experience */}
                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 border-b border-hairline/50 pb-1">
                          Experience
                        </h3>
                        <div className="space-y-3">
                          {experiences.map(exp => (
                            <div key={exp.id}>
                              <div className="flex justify-between font-semibold text-text-primary text-[12px]">
                                <span>{exp.role} — <span className="font-normal text-text-secondary">{exp.company}</span></span>
                                <span className="text-text-tertiary font-mono text-[10px]">{exp.duration}</span>
                              </div>
                              <ul className="list-disc pl-4 space-y-1 text-text-secondary text-[11.5px] mt-1.5">
                                {exp.bullets.map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 border-b border-hairline/50 pb-1">
                          Education
                        </h3>
                        <div className="space-y-2">
                          {education.map(edu => (
                            <div key={edu.id} className="flex justify-between text-[12px]">
                              <div>
                                <span className="font-semibold">{edu.school}</span> · <span className="text-text-secondary">{edu.degree}</span>
                              </div>
                              <span className="text-text-tertiary font-mono text-[10px]">{edu.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Featured Projects */}
                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 border-b border-hairline/50 pb-1">
                          Projects
                        </h3>
                        <div className="space-y-3">
                          {projects.map(proj => (
                            <div key={proj.id}>
                              <div className="flex justify-between font-semibold text-text-primary text-[12px]">
                                <span>{proj.title} <span className="text-[10px] text-text-tertiary font-normal">({proj.tags.join(", ")})</span></span>
                              </div>
                              <ul className="list-disc pl-4 space-y-1 text-text-secondary text-[11.5px] mt-1">
                                {proj.bullets.map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 border-b border-hairline/50 pb-1">
                          Skills
                        </h3>
                        <div className="space-y-1.5 text-[11.5px] text-text-secondary">
                          {SKILL_GROUPS.map(g => (
                            <div key={g.category}>
                              <span className="font-semibold text-text-primary">{g.category}:</span> {g.skills.join(", ")}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-center border-t border-hairline">
                      <button
                        type="button"
                        onClick={handleDownloadResume}
                        className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-[11px] font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" /> Download TXT Version
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
