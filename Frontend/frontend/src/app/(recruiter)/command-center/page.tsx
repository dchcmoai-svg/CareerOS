"use client";

import React, { useEffect } from "react";
import { TalentExplorer } from "@/components/recruiter/TalentExplorer";
import { RecruiterTrustScore } from "@/components/recruiter/RecruiterTrustScore";
import { useEcosystem } from "@/lib/EcosystemContext";

export default function CommandCenterPage() {
  const { setActiveIntelligence } = useEcosystem();

  useEffect(() => {
    // When entering the Command Center, the AI transitions to Intelligence Augmentation
    setActiveIntelligence(
      "Intelligence Augmentation: Demand for Backend Engineers with Rust experience has increased 18% this month. Candidate Alex C. perfectly matches your infrastructure hiring trajectory and has a very high response likelihood."
    );

    return () => setActiveIntelligence(null);
  }, [setActiveIntelligence]);

  return (
    <div className="flex flex-col h-full pt-md pb-32">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Recruiter Command Center</h1>
        <p className="text-sm text-text-secondary mt-1 font-medium max-w-2xl">
          Market Intelligence and Candidate Probability orchestration.
        </p>
      </div>

      <div className="flex gap-lg">
        
        {/* Left Column: Talent Intelligence Explorer */}
        <div className="flex-1 max-w-3xl space-y-8">
          <TalentExplorer />
        </div>

        {/* Right Column: Recruiter Trust Infrastructure */}
        <div className="w-[300px] flex-shrink-0">
          <RecruiterTrustScore />
        </div>

      </div>
    </div>
  );
}
