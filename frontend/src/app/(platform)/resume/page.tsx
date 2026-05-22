"use client";

import React, { useState, useEffect } from "react";
import { VersionControlStrip } from "@/components/resume/VersionControlStrip";
import { AtsScorecard } from "@/components/resume/AtsScorecard";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { OptimizationTimeline } from "@/components/resume/OptimizationTimeline";
import { useEcosystem } from "@/lib/EcosystemContext";
import { motion } from "framer-motion";
import { staggerContainer, slideUpVariants } from "@/lib/motion";
import { resume as resumeCopy } from "@/lib/copy";

export default function ResumeLabPage() {
  const { setActiveIntelligence } = useEcosystem();
  const [activeBranch, setActiveBranch] = useState("feature/stripe-frontend");

  useEffect(() => {
    if (activeBranch === "feature/stripe-frontend") {
      setActiveIntelligence(
        "Your backend-focused resume gets more responses. Fix 3 quick suggestions to boost your match score for Stripe above 85%."
      );
    } else {
      setActiveIntelligence(
        "This general version matches well with Vercel and Linear (~91%). Export as PDF when you're ready to apply."
      );
    }
  }, [activeBranch, setActiveIntelligence]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-full -mx-lg -mt-lg"
    >
      <VersionControlStrip
        activeBranch={activeBranch}
        onChangeBranch={setActiveBranch}
        hint={resumeCopy.pageGuide}
      />

      <div className="flex-1 flex overflow-hidden">
        <ResumeDocument activeBranch={activeBranch} />
        <AtsScorecard activeBranch={activeBranch} />
        <OptimizationTimeline />
      </div>
    </motion.div>
  );
}
