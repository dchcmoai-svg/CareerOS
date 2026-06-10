"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, Users, Calendar, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { useEcosystem } from "@/lib/EcosystemContext";
import Link from "next/link";

interface Applicant {
  id: string;
  candidateName: string;
  candidateEmail: string;
  stage: "Applied" | "Interviewing" | "Offer" | "Rejected" | "Ghosted" | "Stalled";
  resumeBranch: string;
  matchScore: number;
  appliedAt: string;
  role: string;
  company: string;
  jobId: string;
}

interface RecruiterJob {
  id: string;
  role: string;
  company: string;
  applicants: Applicant[];
}

export default function PipelinePage() {
  const { setActiveIntelligence } = useEcosystem();
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobFilter, setSelectedJobFilter] = useState("all");
  const [selectedStageFilter, setSelectedStageFilter] = useState("all");

  const fetchPipeline = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recruiter/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to load recruiter pipeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();

    setActiveIntelligence(
      "Recruiter Pipeline: Review applicant funnel metrics. Filter applications by position or hiring state, and advance top candidates to interviews or offers."
    );

    return () => setActiveIntelligence(null);
  }, [setActiveIntelligence]);

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

  // Extract all applicants across all jobs
  const allApplicants: Applicant[] = [];
  jobs.forEach((job) => {
    if (job.applicants) {
      job.applicants.forEach((app) => {
        allApplicants.push({
          ...app,
          role: job.role,
          company: job.company,
          jobId: job.id,
        });
      });
    }
  });

  // Filter applicants
  const filteredApplicants = allApplicants.filter((app) => {
    const jobMatch = selectedJobFilter === "all" || app.jobId === selectedJobFilter;
    const stageMatch = selectedStageFilter === "all" || app.stage === selectedStageFilter;
    return jobMatch && stageMatch;
  });

  return (
    <div className="flex flex-col h-full pt-md pb-32">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <Link href="/command-center" className="inline-flex items-center gap-1 text-[11px] font-bold text-text-secondary hover:text-text-primary mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Command Center
          </Link>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Recruiter Pipeline</h1>
          <p className="text-sm text-text-secondary mt-1 font-medium max-w-2xl">
            A centralized dashboard to review and manage all applicants across your active job postings.
          </p>
        </div>
        <button
          onClick={fetchPipeline}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-2 border border-hairline text-text-secondary text-xs font-semibold hover:bg-surface-3 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Funnel
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6 bg-surface-1 border border-hairline rounded-xl p-4">
        {/* Job opening filter */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-text-tertiary uppercase">Filter by Job Posting</span>
          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="bg-surface-2 border border-hairline rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-ai font-semibold cursor-pointer max-w-xs"
          >
            <option value="all">All Postings ({jobs.length})</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>{job.role} · {job.company}</option>
            ))}
          </select>
        </div>

        {/* Stage filter */}
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-text-tertiary uppercase">Filter by Progress Phase</span>
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="bg-surface-2 border border-hairline rounded px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:border-ai font-semibold cursor-pointer"
          >
            <option value="all">All Stages</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer / Hired</option>
            <option value="Stalled">Stalled</option>
            <option value="Ghosted">Ghosted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-text-secondary gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-ai" /> Loading applicant funnel data...
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-hairline rounded-2xl bg-surface-1">
          <Users className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
          <h3 className="text-sm font-bold text-text-primary">No Matching Candidates Found</h3>
          <p className="text-xs text-text-secondary mt-1">There are no candidates in your pipeline matching the selected filters.</p>
        </div>
      ) : (
        <div className="bg-surface-1 border border-hairline rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-hairline bg-surface-2/40 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Role Opening</th>
                  <th className="py-3 px-4">Match</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Resume variant</th>
                  <th className="py-3 px-4">Recruitment Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-surface-2/30">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-text-primary">{app.candidateName}</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">{app.candidateEmail}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-text-primary">{app.role}</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">{app.company}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-success">
                      {app.matchScore}%
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-text-tertiary" />
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-text-tertiary">
                      {app.resumeBranch}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={app.stage}
                        onChange={(e) => handleUpdateStage(app.id, e.target.value)}
                        className="bg-surface-2 border border-hairline text-text-primary rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-ai font-semibold cursor-pointer"
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
        </div>
      )}

    </div>
  );
}
