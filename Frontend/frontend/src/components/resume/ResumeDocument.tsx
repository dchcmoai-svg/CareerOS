"use client";

import React from "react";
import { DiagnosticOverlay } from "./DiagnosticOverlay";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";

interface ResumeDocumentProps {
  activeBranch: string;
}

export function ResumeDocument({ activeBranch }: ResumeDocumentProps) {
  const { profile } = useUserEcosystem();

  const name = profile?.name || "Kumar Kushang";
  const email = profile?.email || "dchcmoai@gmail.com";
  const location = profile?.appDefaults?.preferredLocations?.join(", ") || "Jayant, Madhya Pradesh, India";

  const experiences = profile?.experienceList && profile.experienceList.length > 0
    ? profile.experienceList
    : [
        {
          id: "exp-1",
          role: "Web Development Lead",
          company: "Cyber Peace Corps, KIIT Chapter",
          duration: "Apr 2026 — Present",
          bullets: [
            "Developed and maintained web interfaces for cyber awareness initiatives, contributing to digital safety outreach campaigns.",
            "Collaborated with a cross-functional team to design responsive, accessible front-end components using React.js and modern CSS.",
            "Participated in code reviews and sprint planning, applying agile workflows to deliver features on schedule."
          ],
          tags: ["React.js", "Agile", "Team Lead"]
        }
      ];

  const education = profile?.educationList && profile.educationList.length > 0
    ? profile.educationList
    : [
        {
          id: "edu-1",
          school: "KIIT University",
          degree: "Bachelor of Technology · Computer Science and Engineering",
          duration: "Aug 2024 — Present"
        }
      ];

  const projects = profile?.projectsList && profile.projectsList.length > 0
    ? profile.projectsList
    : [
        {
          id: "proj-1",
          title: "WaterBorne",
          tags: ["React.js", "Vercel", "REST APIs"],
          bullets: [
            "Designed and deployed a full-stack awareness web application focused on water-borne health issues, accessible via public URL on Vercel.",
            "Implemented a responsive, mobile-first UI using React.js with dynamic content rendering and clean component architecture.",
            "Configured end-to-end deployment pipeline with CI/CD via Vercel, reducing deployment time and ensuring zero-downtime updates."
          ]
        }
      ];

  // Gutter lines
  const lineCount = 30;
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  const targetEmployer =
    activeBranch === "feature/swiggy-frontend"
      ? "Swiggy Ltd"
      : activeBranch === "feature/inmobi-systems"
      ? "InMobi Technologies"
      : "General SDE";

  return (
    <div className="flex-1 overflow-y-auto bg-canvas relative pb-32 flex">
      {/* Editor Gutter / Line Numbers */}
      <div className="w-12 bg-surface-1/40 border-r border-hairline/80 pt-16 flex flex-col items-center select-none text-[11px] font-mono text-text-tertiary/70 leading-[26px]">
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 px-8 pt-12">
        <div className="max-w-3xl mx-auto bg-surface-1 border border-hairline rounded shadow-sm p-12 min-h-[900px] font-sans relative">
          
          {/* Top IDE hint bar */}
          <div className="absolute top-2 right-4 flex items-center gap-xs text-[9px] font-mono text-text-tertiary select-none">
            <span>Encoding: UTF-8</span>
            <span>•</span>
            <span>Target: {targetEmployer}</span>
          </div>

          {/* Header */}
          <div className="border-b border-border-strong pb-4 mb-6">
            <h1 className="text-xl font-black text-text-primary tracking-tight mb-1">{name}</h1>
            <p className="text-xs font-semibold text-text-secondary">
              Software Engineer | {location} | {email}
            </p>
            <p className="text-[10px] text-text-tertiary font-mono mt-0.5">
              github.com/dchcmoai • linkedin.com/in/kushang
            </p>
          </div>

          {/* Experience Section */}
          <div className="mb-6">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest mb-3 font-mono text-ai">
              01. Professional Experience
            </h2>
            
            {experiences.map((exp, expIdx) => (
              <div key={exp.id} className={expIdx > 0 ? "mt-4 pt-4 border-t border-hairline/60" : ""}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-bold text-text-primary">{exp.role}</h3>
                  <span className="text-xs font-medium text-text-tertiary font-mono">{exp.duration}</span>
                </div>
                <p className="text-xs font-semibold text-text-secondary mb-2">{exp.company}</p>
                
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-primary leading-relaxed">
                  {exp.bullets.map((bullet, bulletIdx) => {
                    // Check if Swiggy branch is selected and we want to highlight frontend metrics
                    if (activeBranch === "feature/swiggy-frontend" && bullet.includes("React.js") && bulletIdx === 1) {
                      return (
                        <li key={bulletIdx}>
                          <DiagnosticOverlay
                            type="suggestion"
                            message="Add Web Vitals Metrics"
                            rationale="Swiggy values fast rendering. Mention hydration times or Lighthouse performance scores (e.g. 98+ score)."
                          >
                            {bullet}
                          </DiagnosticOverlay>
                        </li>
                      );
                    }
                    
                    // Check if InMobi systems branch is active and we want to highlight backend metrics
                    if (activeBranch === "feature/inmobi-systems" && bullet.includes("agile") && bulletIdx === 2) {
                      return (
                        <li key={bulletIdx}>
                          <DiagnosticOverlay
                            type="error"
                            message="Passive Lead Verb"
                            rationale="InMobi looks for backend systems leaders. Change 'Participated in code reviews' to 'Architected code inspection pipelines' to boost responses."
                          >
                            {bullet}
                          </DiagnosticOverlay>
                        </li>
                      );
                    }

                    return <li key={bulletIdx}>{bullet}</li>;
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects Section */}
          <div className="mb-6">
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest mb-3 font-mono text-ai">
              02. Technical Projects
            </h2>

            {projects.map((proj) => (
              <div key={proj.id} className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-bold text-text-primary">
                    {proj.title} <span className="text-[10px] text-text-tertiary font-normal">({proj.tags.join(", ")})</span>
                  </h3>
                </div>
                
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-text-primary leading-relaxed">
                  {proj.bullets.map((bullet, bulletIdx) => {
                    // Swiggy optimization overlay on first project
                    if (activeBranch === "feature/swiggy-frontend" && bullet.includes("Vercel") && bulletIdx === 2) {
                      return (
                        <li key={bulletIdx}>
                          <DiagnosticOverlay
                            type="warning"
                            message="Highlight Edge caching"
                            rationale="Highlight Next.js Edge routing or CDN caching metrics. Swiggy frontends handle huge transactional scales."
                          >
                            {bullet}
                          </DiagnosticOverlay>
                        </li>
                      );
                    }

                    // InMobi backend suggestion
                    if (activeBranch === "feature/inmobi-systems" && bullet.includes("Vercel") && bulletIdx === 2) {
                      return (
                        <li key={bulletIdx}>
                          <DiagnosticOverlay
                            type="suggestion"
                            message="Systems Keyword"
                            rationale="Systems roles value multi-region deploys. Mention distributed containers or Docker deployment steps."
                          >
                            {bullet}
                          </DiagnosticOverlay>
                        </li>
                      );
                    }

                    return <li key={bulletIdx}>{bullet}</li>;
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Education Section */}
          <div>
            <h2 className="text-[11px] font-bold text-text-primary uppercase tracking-widest mb-3 font-mono text-ai">
              03. Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs text-text-primary">
                <div>
                  <span className="font-bold">{edu.school}</span>
                  <span className="text-text-secondary"> — {edu.degree}</span>
                </div>
                <span className="text-text-tertiary font-mono">{edu.duration}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
