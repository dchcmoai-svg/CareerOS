"use client";

import React, { useState } from "react";
import { GitBranch, ChevronDown, Check, GitCommit, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";

interface VersionControlStripProps {
  activeBranch: string;
  onChangeBranch: (branch: string) => void;
  hint?: string;
  activeTab?: "resume" | "cover-letter";
}

export function VersionControlStrip({
  activeBranch,
  onChangeBranch,
  hint,
  activeTab = "resume",
}: VersionControlStripProps) {
  const { profile } = useUserEcosystem();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const branches = [
    "feature/swiggy-frontend",
    "feature/inmobi-systems",
    "feature/general-sde",
  ];

  const handleExport = () => {
    const name = profile?.name || "Kumar Kushang";
    const email = profile?.email || "dchcmoai@gmail.com";
    const location = profile?.appDefaults?.preferredLocations?.join(", ") || "Jayant, Madhya Pradesh, India";
    const coverText = profile?.coverLetterText || "";

    let textContent = "";
    let filename = "";

    if (activeTab === "cover-letter") {
      filename = `${name.replace(/\s+/g, "_")}_Cover_Letter.txt`;
      if (profile?.coverLetterText) {
        textContent = profile.coverLetterText;
      } else {
        // Fallback to templates based on active branch
        if (activeBranch === "feature/swiggy-frontend") {
          textContent = `To: The Hiring Team\nSwiggy Ltd.\nBengaluru, India\n\nDear Hiring Team,\n\nI am writing to express my interest in the Frontend Developer position at Swiggy. With my experience as Web Development Lead at Cyber Peace Corps, KIIT Chapter, and building high-performance web applications like WaterBorne using React.js and Next.js, I am excited about the opportunity to contribute to Swiggy.\n\nSincerely,\n${name}`;
        } else if (activeBranch === "feature/inmobi-systems") {
          textContent = `To: The Hiring Team\nInMobi Technologies\nBengaluru, India\n\nDear Hiring Team,\n\nI am writing to apply for the Backend Systems Engineer role at InMobi. With my background in Computer Science and Engineering at KIIT University, and systems projects like the USC KIIT members management platform, I am confident in my systems development capabilities.\n\nSincerely,\n${name}`;
        } else {
          textContent = `Dear Hiring Manager,\n\nI am writing to express my interest in the Software Engineer position. With my background in React.js, Node.js, and studies at KIIT University, I look forward to contributing to your team.\n\nSincerely,\n${name}`;
        }
      }
    } else {
      filename = `${name.replace(/\s+/g, "_")}_Resume_${activeBranch.split("/").pop()}.txt`;
      
      const experiences = profile?.experienceList || [
        {
          role: "Web Development Lead",
          company: "Cyber Peace Corps, KIIT Chapter",
          duration: "Apr 2026 — Present",
          bullets: [
            "Developed and maintained web interfaces for cyber awareness initiatives, contributing to digital safety outreach campaigns.",
            "Collaborated with a cross-functional team to design responsive, accessible front-end components using React.js and modern CSS.",
            "Participated in code reviews and sprint planning, applying agile workflows to deliver features on schedule."
          ]
        }
      ];
      const education = profile?.educationList || [
        {
          school: "KIIT University",
          degree: "Bachelor of Technology · Computer Science and Engineering",
          duration: "Aug 2024 — Present"
        }
      ];
      const projects = profile?.projectsList || [
        {
          title: "WaterBorne",
          tags: ["React.js", "Vercel", "REST APIs"],
          bullets: [
            "Designed and deployed a full-stack awareness web application focused on water-borne health issues, accessible via public URL on Vercel.",
            "Implemented a responsive, mobile-first UI using React.js with dynamic content rendering and clean component architecture.",
            "Configured end-to-end deployment pipeline with CI/CD via Vercel, reducing deployment time and ensuring zero-downtime updates."
          ]
        }
      ];

      textContent = `
=========================================
${name.toUpperCase()}
Location: ${location}
Email: ${email}
GitHub: github.com/dchcmoai
LinkedIn: linkedin.com/in/kushang
Target: ${activeBranch}
=========================================

EXPERIENCE:
${experiences.map(exp => `
* ${exp.role} | ${exp.company}
  Duration: ${exp.duration}
${exp.bullets.map(b => `  - ${b}`).join("\n")}
`).join("\n")}

PROJECTS:
${projects.map(proj => `
* ${proj.title}
  Tech Stack: ${proj.tags.join(", ")}
${proj.bullets.map(b => `  - ${b}`).join("\n")}
`).join("\n")}

EDUCATION:
${education.map(edu => `
* ${edu.school}
  Degree: ${edu.degree}
  Duration: ${edu.duration}
`).join("\n")}
`;
    }

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const activeOptimizationsCount =
    activeBranch === "feature/swiggy-frontend"
      ? "2"
      : activeBranch === "feature/inmobi-systems"
      ? "3"
      : "0";

  return (
    <div className="flex items-center justify-between px-lg py-3 border-b border-hairline bg-surface-1 z-30 relative select-none flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Branch Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-2 border border-hairline hover:bg-surface-3 transition-colors active:scale-[0.98] cursor-pointer"
          >
            <GitBranch className="w-4 h-4 text-text-secondary" />
            <span className="text-[13px] font-mono font-bold text-text-primary">{activeBranch}</span>
            <ChevronDown className="w-3.5 h-3.5 text-text-tertiary ml-1" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.1 }}
                className="absolute left-0 mt-1 w-56 bg-surface-1 border border-hairline rounded-md shadow-xl z-50 p-1"
              >
                {branches.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      onChangeBranch(b);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-mono rounded hover:bg-surface-2 transition-colors cursor-pointer ${
                      activeBranch === b ? "text-ai font-bold bg-surface-2/40" : "text-text-secondary"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sync Status */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-text-tertiary">
          <Check className="w-3.5 h-3.5 text-success" /> Saved across your job search
        </div>
        {hint && (
          <p className="hidden xl:block text-[11px] text-text-tertiary max-w-md truncate border-l border-hairline pl-3 ml-1">
            {hint}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-text-secondary bg-surface-2 px-2 py-1 rounded font-mono">
          <GitCommit className="w-3.5 h-3.5" /> {activeOptimizationsCount} optimizations
        </span>
        <button
          onClick={handleExport}
          className="text-[13px] font-semibold bg-text-primary text-canvas px-4 py-1.5 rounded-md hover:bg-text-secondary transition-colors active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export {activeTab === "cover-letter" ? "Letter" : "Resume"}
        </button>
      </div>
    </div>
  );
}
