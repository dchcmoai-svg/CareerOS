"use client";

import React, { useEffect, useState } from "react";
import { Search, MapPin, DollarSign, Brain, Sparkles, Send, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { useEcosystem } from "@/lib/EcosystemContext";
import { UserProfile } from "@/lib/profile-types";
import Link from "next/link";
import { motion } from "framer-motion";

interface RecruiterJob {
  id: string;
  role: string;
  company: string;
}

export default function ScoutPage() {
  const { setActiveIntelligence } = useEcosystem();
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [recruiterJobs, setRecruiterJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Scout details modal
  const [selectedCandidate, setSelectedCandidate] = useState<UserProfile | null>(null);
  
  // Send Job Request states
  const [selectedJobId, setSelectedJobId] = useState("");
  const [sendingJobId, setSendingJobId] = useState<string | null>(null);
  const [sentJobMap, setSentJobMap] = useState<Record<string, boolean>>({}); // candidateId_jobId -> true

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch candidates
      const resCand = await fetch("/api/recruiter/candidates");
      if (resCand.ok) {
        const dataCand = await resCand.json();
        setCandidates(dataCand.candidates || []);
      }
      
      // Fetch recruiter jobs (to select for invite)
      const resJobs = await fetch("/api/recruiter/jobs");
      if (resJobs.ok) {
        const dataJobs = await resJobs.json();
        setRecruiterJobs(dataJobs.jobs || []);
        if (dataJobs.jobs && dataJobs.jobs.length > 0) {
          setSelectedJobId(dataJobs.jobs[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load scouting data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    setActiveIntelligence(
      "Talent Explorer: Browse all candidates in the CareerOS ecosystem. Open candidate nodes to inspect full professional graph details before sending job match requests."
    );

    return () => setActiveIntelligence(null);
  }, [setActiveIntelligence]);

  const handleSendRequest = async (candidate: UserProfile) => {
    if (!selectedJobId) {
      alert("Please select a job first.");
      return;
    }
    
    const job = recruiterJobs.find((j) => j.id === selectedJobId);
    if (!job) return;

    setSendingJobId(candidate.userId);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          candidateId: candidate.userId,
          company: job.company,
          role: job.role,
          stage: "Applied", // Place candidate in recruiter's pipeline
        }),
      });

      if (res.ok) {
        const key = `${candidate.userId}_${job.id}`;
        setSentJobMap((prev) => ({ ...prev, [key]: true }));
        alert(`Successfully sent job request to ${candidate.name}!`);
      } else {
        alert("Failed to send job request. They may have already applied.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send job request.");
    } finally {
      setSendingJobId(null);
    }
  };

  return (
    <div className="flex flex-col h-full pt-md pb-32">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/command-center" className="inline-flex items-center gap-1 text-[11px] font-bold text-text-secondary hover:text-text-primary mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Command Center
          </Link>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Talent Explorer</h1>
          <p className="text-sm text-text-secondary mt-1 font-medium max-w-2xl">
            Scout candidate profiles completely, verify active skills, and send direct job requests.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-text-secondary gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-ai" /> Loading candidates list...
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-hairline rounded-2xl">
          <Search className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
          <h3 className="text-sm font-bold text-text-primary">No Candidates Registered</h3>
          <p className="text-xs text-text-secondary mt-1">There are no candidates registered in the CareerOS sandbox database yet.</p>
          <p className="text-[10px] text-text-tertiary mt-2">Sign out and register a new candidate to populate the dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
          {candidates.map((cand) => (
            <div
              key={cand.userId}
              className="bg-surface-1 border border-hairline hover:border-border-strong rounded-2xl p-5 flex flex-col justify-between transition-all group hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-ai transition-colors">{cand.name || cand.email.split("@")[0]}</h3>
                    <p className="text-[10px] text-text-secondary mt-0.5 font-medium uppercase">
                      {cand.identity?.seniority || "Junior/Mid"} · {cand.identity?.primaryIndustry || "Tech"}
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                    cand.visibility?.isStealthMode 
                      ? "text-warning bg-warning/5 border-warning/20"
                      : "text-success bg-success/5 border-success/20"
                  }`}>
                    {cand.visibility?.isStealthMode ? "Stealth" : "Open to Work"}
                  </span>
                </div>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(cand.identity?.skills || []).slice(0, 4).map((sk) => (
                    <span
                      key={sk.name}
                      className="text-[9px] font-semibold px-2 py-0.5 bg-surface-2 border border-hairline text-text-secondary rounded"
                    >
                      {sk.name}
                    </span>
                  ))}
                  {(cand.identity?.skills || []).length === 0 && (
                    <span className="text-[9px] text-text-tertiary">No skills indexed</span>
                  )}
                </div>

                {/* Preferences */}
                <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-hairline text-[10px] text-text-secondary mb-4">
                  <div className="flex items-center gap-1.5 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-text-tertiary" />
                    <span>Min ${cand.preferences?.targetSalaryMin ? `${cand.preferences.targetSalaryMin / 1000}k` : "100k"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-text-tertiary" />
                    <span>{cand.preferences?.remotePreferred ? "Remote preferred" : "On-site / Hybrid"}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={() => setSelectedCandidate(cand)}
                  className="text-[11px] font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  Scout Node Graph →
                </button>
                
                {recruiterJobs.length > 0 && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleSendRequest(cand)}
                      disabled={sendingJobId === cand.userId || sentJobMap[`${cand.userId}_${selectedJobId}`]}
                      className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        sentJobMap[`${cand.userId}_${selectedJobId}`]
                          ? "bg-success/10 text-success border-success/30 cursor-default"
                          : "bg-ai/10 text-ai border-ai/20 hover:bg-ai hover:text-white"
                      }`}
                    >
                      {sentJobMap[`${cand.userId}_${selectedJobId}`] ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recruiter Selector Bar (if candidates exist) */}
      {!loading && candidates.length > 0 && recruiterJobs.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface-1 border border-hairline rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 z-40 max-w-sm w-full mx-auto">
          <div className="min-w-0 flex-1">
            <label className="text-[9px] font-bold text-text-tertiary uppercase block">Scouting Open Job Opening</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-transparent text-xs font-bold text-text-primary focus:outline-none w-full mt-0.5 cursor-pointer"
            >
              {recruiterJobs.map((j) => (
                <option key={j.id} value={j.id}>{j.role} ({j.company})</option>
              ))}
            </select>
          </div>
          <div className="w-px h-6 bg-hairline" />
          <span className="text-[10px] text-text-tertiary font-bold shrink-0">Scouting Active</span>
        </div>
      )}

      {/* Scout Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-canvas border border-hairline rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto flex flex-col gap-6 text-left"
          >
            <div className="flex justify-between items-center pb-3 border-b border-hairline">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-ai" />
                <h3 className="text-sm font-bold text-text-primary">Candidate Identity Graph</h3>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-text-tertiary hover:text-text-primary text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {/* Left Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary">Personal Information</h4>
                  <p className="text-sm font-bold text-text-primary mt-1">{selectedCandidate.name || "Stealth Candidate"}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{selectedCandidate.email}</p>
                  <p className="text-[10px] text-text-tertiary mt-2">Registered via: <span className="font-mono uppercase">{selectedCandidate.provider}</span></p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary">Indexed Skills Graph</h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(selectedCandidate.identity?.skills || []).map((sk) => (
                      <span
                        key={sk.name}
                        className={`text-[10px] font-medium px-2 py-0.5 border rounded flex items-center gap-1 ${
                          sk.isVerified 
                            ? "bg-success/5 border-success/20 text-success" 
                            : "bg-surface-2 border-hairline text-text-secondary"
                        }`}
                      >
                        {sk.name}
                        {sk.isVerified && <Sparkles className="w-2.5 h-2.5" />}
                      </span>
                    ))}
                    {(selectedCandidate.identity?.skills || []).length === 0 && (
                      <p className="text-xs text-text-tertiary">No skills indexed.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary">Compensation & Work Preferences</h4>
                  <ul className="text-xs space-y-1 mt-2 text-text-secondary font-medium">
                    <li>Minimum Salary: <strong className="text-text-primary">${selectedCandidate.preferences?.targetSalaryMin?.toLocaleString() || "120,000"}</strong></li>
                    <li>Remote Preference: <strong className="text-text-primary">{selectedCandidate.preferences?.remotePreferred ? "Fully Remote Preferred" : "On-site / Hybrid"}</strong></li>
                    <li>Sponsorship Required: <strong className="text-text-primary">{selectedCandidate.preferences?.sponsorshipRequired ? "Yes" : "No"}</strong></li>
                    <li>Preferred Roles: <strong className="text-text-primary">{selectedCandidate.preferences?.targetRoleTypes?.join(", ") || "Full-time"}</strong></li>
                  </ul>
                </div>
              </div>

              {/* Right Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary">Stealth & Visibility controls</h4>
                  <ul className="text-xs space-y-1 mt-2 text-text-secondary font-medium">
                    <li>Stealth Mode Enabled: <strong className={selectedCandidate.visibility?.isStealthMode ? "text-warning" : "text-success"}>{selectedCandidate.visibility?.isStealthMode ? "Active" : "Inactive"}</strong></li>
                    <li>Blocked Employers: <strong className="text-text-primary">{selectedCandidate.visibility?.blockedCompanies?.join(", ") || "None"}</strong></li>
                    <li>Visible to Funding Stages: <strong className="text-text-primary">{selectedCandidate.visibility?.visibleToStages?.join(", ") || "All"}</strong></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary">AI Continuity Memory Layer</h4>
                  <div className="p-3 bg-surface-2 border border-hairline rounded-lg mt-2">
                    <p className="text-xs text-text-secondary leading-relaxed font-medium">
                      "{selectedCandidate.aiState?.lastContext || "Ecosystem memory active. Professional path indexed."}"
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(selectedCandidate.aiState?.memoryKeys || []).map((k) => (
                        <span key={k} className="text-[8px] font-mono font-bold uppercase px-1 bg-surface-3 text-text-tertiary rounded">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-hairline">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-surface-2 border border-hairline hover:bg-surface-3 text-text-secondary rounded-lg text-xs font-bold cursor-pointer"
              >
                Close Graph
              </button>
              {recruiterJobs.length > 0 && (
                <button
                  onClick={() => {
                    handleSendRequest(selectedCandidate);
                    setSelectedCandidate(null);
                  }}
                  disabled={sendingJobId === selectedCandidate.userId || sentJobMap[`${selectedCandidate.userId}_${selectedJobId}`]}
                  className="px-4 py-2 bg-ai hover:bg-ai-hover text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                >
                  {sentJobMap[`${selectedCandidate.userId}_${selectedJobId}`] ? "Job Request Sent" : "Invite to Apply"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
