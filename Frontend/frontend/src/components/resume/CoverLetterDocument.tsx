"use client";

import React, { useState, useEffect } from "react";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";
import { Pencil, Save, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { DiagnosticOverlay } from "./DiagnosticOverlay";

interface CoverLetterDocumentProps {
  activeBranch: string;
}

export function CoverLetterDocument({ activeBranch }: CoverLetterDocumentProps) {
  const { profile, refreshProfile } = useUserEcosystem();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Derive template based on active branch
  const getTemplate = (branch: string, name: string) => {
    if (branch === "feature/swiggy-frontend") {
      return `To: The Hiring Team\nSwiggy Ltd.\nBengaluru, Karnataka, India\n\nDear Hiring Team,\n\nI am writing to express my strong interest in the Frontend Developer position at Swiggy. With my experience as Web Development Lead at Cyber Peace Corps, KIIT Chapter, and building high-performance web applications like WaterBorne using React.js and Next.js, I am excited about the opportunity to contribute to Swiggy's consumer ordering experience.\n\nI have successfully designed responsive, mobile-first interfaces and optimized page loads. I look forward to bringing my UI development expertise and problem-solving skills to Swiggy.\n\nSincerely,\n${name}`;
    } else if (branch === "feature/inmobi-systems") {
      return `To: The Hiring Team\nInMobi Technologies\nBengaluru, Karnataka, India\n\nDear Hiring Team,\n\nI am writing to apply for the Backend Systems Engineer role at InMobi. With my background in Computer Science and Engineering at KIIT University, along with my project engineering experience building systems like the USC KIIT Members Management platform and real-time APIs, I am confident in my systems development capabilities.\n\nI have designed robust modular database schemas, implemented API query routing, and worked with scalable python workflows. I am eager to join InMobi's core engineering team to build high-concurrency systems.\n\nSincerely,\n${name}`;
    } else {
      return `To: The Hiring Team\n\nDear Hiring Manager,\n\nI am writing to express my interest in the Software Engineer position. With my background in full-stack web development, React.js, Node.js, and my ongoing Bachelor of Technology studies in Computer Science at KIIT University, I am confident in my ability to build robust, scalable developer products.\n\nI have designed and deployed multiple applications, including WaterBorne, WeatherUI, and USC KIIT member directories. I look forward to discussing how my experience aligns with your engineering goals.\n\nSincerely,\n${name}`;
    }
  };

  const candidateName = profile?.name || "Kumar Kushang";

  // Load content from profile or fallback to template
  useEffect(() => {
    if (profile?.coverLetterText) {
      setContent(profile.coverLetterText);
    } else {
      setContent(getTemplate(activeBranch, candidateName));
    }
  }, [profile, activeBranch, candidateName]);

  const handleResetToTemplate = () => {
    if (confirm("Reset cover letter to the default branch template? Any unsaved edits will be lost.")) {
      setContent(getTemplate(activeBranch, candidateName));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetterText: content }),
      });
      if (res.ok) {
        await refreshProfile();
        setSaved(true);
        setIsEditing(false);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert("Failed to save cover letter.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving cover letter.");
    } finally {
      setSaving(false);
    }
  };

  // Split content into lines for the editor gutter
  const lines = content.split("\n");
  const lineCount = Math.max(18, lines.length);
  const gutterNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  const targetEmployer =
    activeBranch === "feature/swiggy-frontend"
      ? "Swiggy"
      : activeBranch === "feature/inmobi-systems"
      ? "InMobi"
      : "General Engineering";

  return (
    <div className="flex-1 overflow-y-auto bg-canvas relative pb-32 flex">
      {/* Editor Gutter / Line Numbers */}
      <div className="w-12 bg-surface-1/40 border-r border-hairline/80 pt-16 flex flex-col items-center select-none text-[11px] font-mono text-text-tertiary/70 leading-[26px]">
        {gutterNumbers.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 px-8 pt-12">
        <div className="max-w-3xl mx-auto bg-surface-1 border border-hairline rounded shadow-sm p-12 min-h-[750px] font-sans relative">
          {/* Top IDE info bar */}
          <div className="absolute top-3 right-4 flex items-center gap-xs text-[9px] font-mono text-text-tertiary select-none">
            <span>Mode: cover_letter.txt</span>
            <span>•</span>
            <span>Target: {targetEmployer}</span>
          </div>

          {/* Action buttons bar */}
          <div className="flex items-center justify-between border-b border-hairline pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ai" />
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider font-mono">
                Cover Letter Template
              </h2>
            </div>
            <div className="flex items-center gap-2 select-none">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-lg border border-hairline bg-surface-2 hover:bg-surface-3 text-[11px] font-semibold text-text-secondary flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit Cover Letter
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleResetToTemplate}
                    className="px-3 py-1.5 rounded-lg border border-hairline bg-surface-2 hover:bg-surface-3 text-[11px] font-semibold text-text-secondary cursor-pointer transition-colors"
                  >
                    Reset Template
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-75 text-[11px] font-semibold text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" /> Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
              {saved && (
                <span className="text-[11px] font-semibold text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>
          </div>

          {/* Document Content Box */}
          <div className="mt-4">
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                className="w-full bg-surface-2 border border-hairline hover:border-border-strong focus:border-primary/50 rounded-lg p-4 font-mono text-[12.5px] leading-[26px] text-text-primary focus:outline-none transition-colors"
              />
            ) : (
              <div className="font-mono text-[12.5px] leading-[26px] whitespace-pre-wrap text-text-primary">
                {lines.map((line, idx) => {
                  // Add diagnostic highlights on matching sections
                  if (activeBranch === "feature/swiggy-frontend" && line.includes("WaterBorne")) {
                    return (
                      <span key={idx}>
                        <DiagnosticOverlay
                          type="suggestion"
                          message="Front-end Metric Hook"
                          rationale="Highlight loading speed (e.g. 45% faster hydration) when mentioning React/Next.js projects for Swiggy."
                        >
                          {line}
                        </DiagnosticOverlay>
                        {"\n"}
                      </span>
                    );
                  }
                  if (activeBranch === "feature/inmobi-systems" && line.includes("USC KIIT")) {
                    return (
                      <span key={idx}>
                        <DiagnosticOverlay
                          type="warning"
                          message="High Concurrency Check"
                          rationale="InMobi looks for high throughput data handling. Detail the database scaling parameters of USC KIIT."
                        >
                          {line}
                        </DiagnosticOverlay>
                        {"\n"}
                      </span>
                    );
                  }
                  return line + "\n";
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
