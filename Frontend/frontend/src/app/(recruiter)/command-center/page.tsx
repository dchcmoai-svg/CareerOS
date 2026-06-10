"use client";

import React, { useEffect, useState } from "react";
import { Plus, Briefcase, Users, Calendar, MapPin, DollarSign, Loader2, ArrowRight, ShieldCheck, UserCheck, Brain, Sparkles } from "lucide-react";
import { useEcosystem } from "@/lib/EcosystemContext";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { UserProfile } from "@/lib/profile-types";

interface Applicant {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  stage: "Applied" | "Interviewing" | "Offer" | "Rejected" | "Ghosted" | "Stalled";
  resumeBranch: string;
  matchScore: number;
  appliedAt: string;
}

interface RecruiterJob {
  id: string;
  role: string;
  company: string;
  location: string;
  compensation: string;
  remote: boolean;
  category: string;
  description?: string;
  postedAt: string;
  applicants: Applicant[];
}

export default function CommandCenterPage() {
  const { setActiveIntelligence } = useEcosystem();
  const { data: session } = useSession();
  
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  
  // Post Job form state
  const [formRole, setFormRole] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formCompensation, setFormCompensation] = useState("");
  const [formCategory, setFormCategory] = useState("software-engineering");
  const [formRemote, setFormRemote] = useState(false);
  const [formDescription, setFormDescription] = useState("");
  const [posting, setPosting] = useState(false);

  // Selected job for detailed applicant view
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Candidate scouting states
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<UserProfile | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Fetch recruiter's posted jobs
      const res = await fetch("/api/recruiter/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        if (data.jobs && data.jobs.length > 0 && !selectedJobId) {
          setSelectedJobId(data.jobs[0].id);
        }
      }

      // Fetch all candidate profiles to display applicant node graph details on click
      const resCand = await fetch("/api/recruiter/candidates");
      if (resCand.ok) {
        const dataCand = await resCand.json();
        setCandidates(dataCand.candidates || []);
      }
    } catch (err) {
      console.error("Failed to load recruiter data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    
    setActiveIntelligence(
      "Recruiter Hub Active: You have 100% scouting access. You can review applicant pipeline data, transition candidates through ATS stages, and publish new openings directly."
    );

    return () => setActiveIntelligence(null);
  }, [setActiveIntelligence]);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      const res = await fetch("/api/recruiter/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: formRole,
          company: formCompany,
          location: formLocation,
          compensation: formCompensation,
          category: formCategory,
          remote: formRemote,
          description: formDescription,
        }),
      });

      if (res.ok) {
        setShowPostModal(false);
        // Reset form
        setFormRole("");
        setFormCompany("");
        setFormLocation("");
        setFormCompensation("");
        setFormDescription("");
        setFormRemote(false);
        // Refresh
        await fetchJobs();
      } else {
        alert("Failed to post job. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to post job.");
    } finally {
      setPosting(false);
    }
  };

  const handleUpdateStage = async (appId: string, newStage: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, stage: newStage }),
      });

      if (res.ok) {
        // Update local state
        setJobs((prevJobs) =>
          prevJobs.map((job) => ({
            ...job,
            applicants: job.applicants.map((app) =>
              app.id === appId ? { ...app, stage: newStage as any } : app
            ),
          }))
        );
      } else {
        alert("Failed to update candidate stage.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const totalApplicantsCount = jobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0);

  return (
    <div className="flex flex-col h-full pt-md pb-32">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Recruiter Command Center</h1>
          <p className="text-sm text-text-secondary mt-1 font-medium max-w-2xl">
            Post job openings, manage your candidate pool, and advance applicant hiring stages.
          </p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-ai text-white rounded-lg text-xs font-bold hover:bg-ai-hover transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Post a New Job
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-8">
        <div className="bg-surface-1 border border-hairline rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-ai/10 text-ai rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wide">Active Openings</p>
            <p className="text-xl font-bold text-text-primary mt-0.5">{jobs.length}</p>
          </div>
        </div>
        <div className="bg-surface-1 border border-hairline rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wide">Total Applicants</p>
            <p className="text-xl font-bold text-text-primary mt-0.5">{totalApplicantsCount}</p>
          </div>
        </div>
        <div className="bg-surface-1 border border-hairline rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-success/10 text-success rounded-lg flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wide">Hired Candidates</p>
            <p className="text-xl font-bold text-text-primary mt-0.5">
              {jobs.reduce((sum, job) => sum + job.applicants.filter((a) => a.stage === "Offer").length, 0)}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-text-secondary gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-ai" /> Loading Command Center...
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-hairline rounded-2xl">
          <Briefcase className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
          <h3 className="text-sm font-bold text-text-primary">No Active Job Postings</h3>
          <p className="text-xs text-text-secondary mt-1">Get started by creating your first job opening.</p>
          <button
            onClick={() => setShowPostModal(true)}
            className="mt-4 px-4 py-2 bg-text-primary text-canvas rounded-lg text-xs font-bold hover:bg-text-secondary transition-all cursor-pointer"
          >
            Post a Job
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-lg items-start">
          
          {/* Left: Job Openings List */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-tertiary px-1">Your Job Listings</h3>
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all text-left ${
                  selectedJobId === job.id
                    ? "bg-surface-2 border-ai/50 shadow-sm"
                    : "bg-surface-1 border-hairline hover:border-border-strong"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-bold text-text-primary line-clamp-1">{job.role}</h4>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-surface-2 border border-hairline text-text-secondary rounded tabular-nums shrink-0">
                    {job.applicants?.length || 0} apps
                  </span>
                </div>
                <p className="text-[10px] text-text-secondary mt-1 font-medium">{job.company}</p>
                
                <div className="flex items-center gap-3 mt-3 text-[10px] text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <DollarSign className="w-3 h-3" /> {job.compensation}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Selected Job Applicants & Progress Phases */}
          <div className="flex-1 w-full bg-surface-1 border border-hairline rounded-2xl p-6">
            {selectedJob ? (
              <div className="space-y-6">
                
                {/* Selected Job Header */}
                <div className="pb-4 border-b border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                  <div>
                    <span className="text-[9px] font-bold text-ai uppercase tracking-wider bg-ai/5 px-2 py-0.5 rounded border border-ai/10">
                      ATS Stage Management
                    </span>
                    <h2 className="text-lg font-bold text-text-primary mt-2">{selectedJob.role}</h2>
                    <p className="text-xs text-text-secondary mt-0.5">{selectedJob.company} · Posted on {new Date(selectedJob.postedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-xs font-semibold text-text-tertiary flex gap-4">
                    <span>Remote: <strong className="text-text-primary">{selectedJob.remote ? "Yes" : "No"}</strong></span>
                    <span>Category: <strong className="text-text-primary uppercase">{selectedJob.category}</strong></span>
                  </div>
                </div>

                {/* Applicants List */}
                <div>
                  <h3 className="text-xs font-bold text-text-primary mb-4">Applicants & Progress Phases</h3>
                  
                  {selectedJob.applicants.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-hairline/80 rounded-xl">
                      <Users className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                      <p className="text-xs text-text-secondary">No candidates have applied to this role yet.</p>
                      <p className="text-[10px] text-text-tertiary mt-1">Go to Talent Explorer to scout and invite candidates.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-hairline text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                            <th className="py-2.5">Candidate</th>
                            <th className="py-2.5">Resume variant</th>
                            <th className="py-2.5">Match Score</th>
                            <th className="py-2.5">Progress Phase</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-hairline">
                          {selectedJob.applicants.map((app) => (
                            <tr key={app.id} className="hover:bg-surface-2/30">
                              <td className="py-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const matchProfile = candidates.find((c) => c.userId === app.candidateId);
                                    if (matchProfile) {
                                      setSelectedCandidate(matchProfile);
                                      setSelectedApplicant(app);
                                    } else {
                                      alert("Could not load candidate graph. They may be stealth.");
                                    }
                                  }}
                                  className="font-bold text-text-primary hover:text-ai transition-colors hover:underline text-left cursor-pointer flex flex-col"
                                >
                                  <span>{app.candidateName}</span>
                                  <span className="text-[10px] text-text-secondary font-medium mt-0.5">{app.candidateEmail}</span>
                                </button>
                              </td>
                              <td className="py-3 font-mono text-[10px] text-text-tertiary">
                                {app.resumeBranch}
                              </td>
                              <td className="py-3 font-semibold text-success">
                                {app.matchScore}%
                              </td>
                              <td className="py-3">
                                <select
                                  value={app.stage}
                                  onChange={(e) => handleUpdateStage(app.id, e.target.value)}
                                  className="bg-surface-2 border border-hairline text-text-primary rounded px-2.5 py-1 text-xs focus:outline-none focus:border-ai font-semibold cursor-pointer"
                                >
                                  <option value="Applied">Applied</option>
                                  <option value="Interviewing">Interviewing</option>
                                  <option value="Offer">Offer / Hired</option>
                                  <option value="Stalled">Stalled</option>
                                  <option value="Ghosted">Ghosted</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <p className="text-xs text-text-tertiary text-center py-20">Select a job listing on the left to manage candidates.</p>
            )}
          </div>

        </div>
      )}

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-canvas border border-hairline rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-left"
          >
            <div className="flex justify-between items-center pb-2 border-b border-hairline">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-ai" /> Create Job Opening
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-text-tertiary hover:text-text-primary text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-text-tertiary uppercase block mb-1">Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Backend Engineer"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  required
                  className="w-full bg-surface-1 border border-hairline rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-ai"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-text-tertiary uppercase block mb-1">Company</label>
                <input
                  type="text"
                  placeholder="e.g. Vercel"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  required
                  className="w-full bg-surface-1 border border-hairline rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-ai"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-text-tertiary uppercase block mb-1">Location / City</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    required
                    className="w-full bg-surface-1 border border-hairline rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-ai"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-tertiary uppercase block mb-1">Compensation</label>
                  <input
                    type="text"
                    placeholder="e.g. $140k - $170k"
                    value={formCompensation}
                    onChange={(e) => setFormCompensation(e.target.value)}
                    required
                    className="w-full bg-surface-1 border border-hairline rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-ai font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-text-tertiary uppercase block mb-1">Job Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-surface-1 border border-hairline rounded-lg px-2.5 py-2 text-xs text-text-primary focus:outline-none focus:border-ai"
                  >
                    <option value="software-engineering">Software Engineering</option>
                    <option value="ai-ml">AI / ML</option>
                    <option value="product">Product</option>
                    <option value="design">Design</option>
                    <option value="data">Data</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formRemote}
                      onChange={(e) => setFormRemote(e.target.checked)}
                      className="rounded text-ai focus:ring-ai"
                    />
                    Fully Remote Role
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-text-tertiary uppercase block mb-1">Job Description</label>
                <textarea
                  placeholder="Describe key responsibilities and stack..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-1 border border-hairline rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-ai resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={posting}
                className="w-full py-3 mt-2 bg-ai hover:bg-ai-hover text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                {posting ? "Publishing Job..." : "Publish Job Opening"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Candidate Profile Details Modal */}
      {selectedCandidate && selectedApplicant && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-canvas border border-hairline rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto flex flex-col gap-6 text-left"
          >
            <div className="flex justify-between items-center pb-3 border-b border-hairline">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-ai animate-pulse" />
                <h3 className="text-sm font-bold text-text-primary">Applicant Profile Scout Node</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedCandidate(null);
                  setSelectedApplicant(null);
                }}
                className="text-text-tertiary hover:text-text-primary text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              
              {/* Left Column: Personal and Preferences */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary">Candidate Identity</h4>
                  <p className="text-sm font-bold text-text-primary mt-1">{selectedCandidate.name || "Stealth Candidate"}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{selectedCandidate.email}</p>
                  <p className="text-[10px] text-text-tertiary mt-2">Seniority: <strong className="text-text-primary">{selectedCandidate.identity?.seniority || "Junior/Mid"}</strong></p>
                  <p className="text-[10px] text-text-tertiary">Primary Industry: <strong className="text-text-primary">{selectedCandidate.identity?.primaryIndustry || "Tech"}</strong></p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary">Skills Graph</h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(selectedCandidate.identity?.skills || []).map((sk) => (
                      <span
                        key={sk.name}
                        className={`text-[9px] font-medium px-2 py-0.5 border rounded flex items-center gap-1 ${
                          sk.isVerified 
                            ? "bg-success/5 border-success/20 text-success" 
                            : "bg-surface-2 border-hairline text-text-secondary"
                        }`}
                      >
                        {sk.name}
                        {sk.isVerified && <Sparkles className="w-2.5 h-2.5 text-success" />}
                      </span>
                    ))}
                    {(selectedCandidate.identity?.skills || []).length === 0 && (
                      <p className="text-xs text-text-tertiary">No skills listed.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary">Ecosystem Preferences</h4>
                  <ul className="text-xs space-y-1 mt-2 text-text-secondary font-medium">
                    <li>Minimum Salary: <strong className="text-text-primary">${selectedCandidate.preferences?.targetSalaryMin?.toLocaleString() || "120,000"}</strong></li>
                    <li>Remote Preference: <strong className="text-text-primary">{selectedCandidate.preferences?.remotePreferred ? "Fully Remote Preferred" : "On-site / Hybrid"}</strong></li>
                    <li>Sponsorship Required: <strong className="text-text-primary">{selectedCandidate.preferences?.sponsorshipRequired ? "Yes" : "No"}</strong></li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Match details and ATS Stage */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary">ATS Job Matching Analysis</h4>
                  <div className="p-3 bg-success/5 border border-success/20 rounded-xl mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-text-primary">Match Suitability</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">Calculated ATS Score compatibility</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-success tabular-nums">{selectedApplicant.matchScore}%</p>
                      <p className="text-[9px] text-text-tertiary">Very High Fit</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary">AI explainability rationale</h4>
                  <div className="p-3 bg-surface-2 border border-hairline rounded-lg mt-2 text-xs text-text-secondary leading-relaxed font-medium">
                    "{selectedCandidate.aiState?.lastContext || "Ecosystem path active. Professional node matching role requirements."}"
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary">Recruitment Details</h4>
                  <ul className="text-xs space-y-1 mt-2 text-text-secondary font-medium">
                    <li>Applied Resume Branch: <span className="font-mono text-resume">{selectedApplicant.resumeBranch}</span></li>
                    <li>Applied Date: <span>{new Date(selectedApplicant.appliedAt).toLocaleDateString()}</span></li>
                  </ul>
                </div>

                <div className="pt-2">
                  <h4 className="text-[10px] font-bold uppercase text-text-tertiary mb-2">Transition Progress Phase</h4>
                  <select
                    value={selectedApplicant.stage}
                    onChange={(e) => {
                      handleUpdateStage(selectedApplicant.id, e.target.value);
                      setSelectedApplicant((prev) => prev ? { ...prev, stage: e.target.value as any } : null);
                    }}
                    className="w-full bg-surface-2 border border-hairline text-text-primary rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-ai font-semibold cursor-pointer"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer / Hired</option>
                    <option value="Stalled">Stalled</option>
                    <option value="Ghosted">Ghosted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-hairline">
              <button
                onClick={() => {
                  setSelectedCandidate(null);
                  setSelectedApplicant(null);
                }}
                className="px-4 py-2 bg-surface-2 border border-hairline hover:bg-surface-3 text-text-secondary rounded-lg text-xs font-bold cursor-pointer"
              >
                Close Profile Preview
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
