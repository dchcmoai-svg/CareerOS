"use client";

import React, { useEffect } from "react";
import { DiscoverabilityControls } from "@/components/marketplace/DiscoverabilityControls";
import { MarketSignalFeed } from "@/components/marketplace/MarketSignalFeed";
import { MatchExplainabilityCard } from "@/components/marketplace/MatchExplainabilityCard";
import { RecruiterHeatmap } from "@/components/marketplace/RecruiterHeatmap";
import { useEcosystem } from "@/lib/EcosystemContext";
import { motion } from "framer-motion";
import { staggerContainer, slideUpVariants } from "@/lib/motion";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { TelemetryStrip } from "@/components/ecosystem/TelemetryStrip";
import { Eye, Shield, TrendingUp, Radio } from "lucide-react";
import { marketplace as marketCopy } from "@/lib/copy";

export default function MarketplacePage() {
  const { setActiveIntelligence } = useEcosystem();

  useEffect(() => {
    setActiveIntelligence(
      "Recruiters at startups are actively searching for profiles like yours this week. Want to adjust visibility for Series A & B companies?"
    );
    return () => setActiveIntelligence(null);
  }, [setActiveIntelligence]);

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-full pt-md overflow-y-auto pb-32"
    >
      <motion.div variants={slideUpVariants} className="mb-md">
        <PageHeader
          title={marketCopy.title}
          subtitle={marketCopy.subtitle}
          guide={marketCopy.pageGuide}
          telemetry={
            <TelemetryStrip
              metrics={[
                { label: marketCopy.metrics.views, value: "12", sublabel: "Last 7 days", status: "intelligence", icon: Eye },
                { label: marketCopy.metrics.stealth, value: "On", sublabel: marketCopy.metrics.stealthOn, status: "success", icon: Shield },
                { label: marketCopy.metrics.demand, value: "+18%", sublabel: "Roles like yours", status: "success", icon: TrendingUp },
                { label: marketCopy.metrics.signals, value: "2", sublabel: "Today", status: "neutral", icon: Radio },
              ]}
            />
          }
        />
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-lg">
        
        {/* Left Column: Intelligence, Signals, Heatmaps */}
        <motion.div variants={slideUpVariants} className="flex-1 space-y-6">
          <MarketSignalFeed />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <MatchExplainabilityCard />
            <RecruiterHeatmap />
          </div>
        </motion.div>

        {/* Right Column: Trust Controls */}
        <motion.div variants={slideUpVariants} className="w-full lg:w-[340px] flex-shrink-0">
          <DiscoverabilityControls />
        </motion.div>

      </div>
    </motion.div>
  );
}
