"use client";

import React, { useState, useEffect } from "react";
import { FocusModeStrip } from "@/components/tracker/FocusModeStrip";
import { TrackerBoard } from "@/components/tracker/TrackerBoard";
import { TrackerItemData, TrackerItemCard } from "@/components/tracker/TrackerItemCard";
import { useEcosystem } from "@/lib/EcosystemContext";
import { 
  ListFilter, 
  Activity, 
  Clock, 
  AlertTriangle, 
  Mail, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Sparkles, 
  Send 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, slideUpVariants } from "@/lib/motion";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { TelemetryStrip } from "@/components/ecosystem/TelemetryStrip";
import { TactileButton } from "@/components/ecosystem/TactileButton";
import { OperationalCard } from "@/components/ecosystem/OperationalCard";

const MOCK_TRACKER_ITEMS: TrackerItemData[] = [
  {
    id: "t1",
    company: "Stripe",
    role: "Senior Frontend Engineer",
    stage: "Interviewing",
    stageDays: 4,
    lastInteraction: "Recruiter email (2d ago)",
    historicalVelocity: "Fast"
  },
  {
    id: "t2",
    company: "Acme Corp",
    role: "Staff Software Engineer",
    stage: "Applied",
    stageDays: 12,
    lastInteraction: "Application submitted",
    historicalVelocity: "Slow"
  },
  {
    id: "t3",
    company: "Vercel",
    role: "Product Engineer",
    stage: "Applied",
    stageDays: 2,
    lastInteraction: "Application submitted",
    historicalVelocity: "Fast"
  },
  {
    id: "t4",
    company: "Linear",
    role: "Frontend Developer",
    stage: "Offer",
    stageDays: 1,
    lastInteraction: "Offer letter received",
    historicalVelocity: "Average"
  },
  {
    id: "t5",
    company: "Global Tech",
    role: "UI Engineer",
    stage: "Interviewing",
    stageDays: 9,
    lastInteraction: "Technical Screen (8d ago)",
    historicalVelocity: "Average"
  }
];

export default function TrackerPage() {
  const { setActiveIntelligence } = useEcosystem();
  const [selectedItem, setSelectedItem] = useState<TrackerItemData | null>(MOCK_TRACKER_ITEMS[0]);
  const [trackerItems, setTrackerItems] = useState<TrackerItemData[]>(MOCK_TRACKER_ITEMS);

  useEffect(() => {
    const stalledCount = trackerItems.filter(
      (item) => item.stageDays > 7 && item.stage !== "Offer" && item.stage !== "Rejected"
    ).length;

    if (stalledCount > 0) {
      setActiveIntelligence(
        `You have ${stalledCount} applications stalled beyond expected recruiter response time. Want me to draft follow-up templates?`
      );
    } else {
      setActiveIntelligence(
        "Your pipeline is moving at an optimal velocity. Applications with ATS alignment >82% are progressing 2.4x faster this week."
      );
    }
  }, [trackerItems, setActiveIntelligence]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-full pb-section overflow-hidden"
    >
      <motion.div variants={slideUpVariants} className="flex-shrink-0">
        <PageHeader
          title="Applications"
          subtitle="Track every application, follow-up, and interview in one place."
          actions={
            <TactileButton variant="secondary" size="sm" icon={ListFilter}>
              View: Active
            </TactileButton>
          }
          telemetry={
            <TelemetryStrip
              metrics={[
                { label: "Active Applications", value: "5", sublabel: "Running", status: "success", icon: Activity },
                { label: "Stalled Stages", value: "2", sublabel: "Action required", status: "warning", icon: AlertTriangle },
                { label: "Avg Response Time", value: "3.2d", sublabel: "Fast market", status: "success", icon: Clock },
                { label: "Interviewing Rate", value: "60%", sublabel: "High signal", status: "intelligence" },
              ]}
            />
          }
        />
      </motion.div>

      {/* Workflow Intelligence Alerts */}
      <motion.div variants={slideUpVariants} className="grid grid-cols-1 md:grid-cols-3 gap-sm mb-md flex-shrink-0">
        <OperationalCard accent="warning" density="compact" icon={AlertTriangle} iconColor="text-warning" title="Stalled Pipeline" interactive>
          <p className="text-[12px] text-text-secondary">2 applications exceeded historical recruiter response times.</p>
        </OperationalCard>
        <OperationalCard accent="intelligence" density="compact" icon={Calendar} title="Upcoming Interview" interactive>
          <p className="text-[12px] text-text-secondary">Stripe System Design in 48 hours. Prep guide available.</p>
        </OperationalCard>
        <OperationalCard accent="success" density="compact" icon={Activity} title="Velocity Metrics" interactive>
          <p className="text-[12px] text-text-secondary">ATS alignment &gt;85% yielding 40% interview conversion.</p>
        </OperationalCard>
      </motion.div>

      {/* Focus Mode Strip answers "What matters right now?" */}
      <FocusModeStrip />

      {/* 3. Main Board and Interactive Drawer Split */}
      <div className="flex-1 flex gap-md overflow-hidden min-h-0 relative -mx-lg px-lg">
        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto pb-4 h-full scrollbar-hide">
          <TrackerBoard items={trackerItems} onSelectCard={setSelectedItem} selectedId={selectedItem?.id} />
        </div>

        {/* Interaction Timeline Drawer */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="w-[360px] bg-surface-1 border-l border-hairline h-full flex flex-col gap-md p-md shadow-2xl relative flex-shrink-0"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-md right-md text-text-tertiary hover:text-text-primary p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div className="border-b border-hairline pb-sm mt-sm">
                <h3 className="font-bold text-base text-text-primary">{selectedItem.company}</h3>
                <span className="text-xs text-text-secondary">{selectedItem.role}</span>
              </div>

              {/* Recruiter Continuity Telemetry */}
              <div className="flex flex-col gap-sm">
                <span className="text-[9px] uppercase tracking-wider font-bold text-text-tertiary">Recruiter Memory</span>
                <div className="bg-surface-2/60 border border-hairline/50 p-2.5 rounded text-xs flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-text-secondary font-medium">Historical Response Velocity</span>
                    <span className="font-bold text-success">{selectedItem.historicalVelocity}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-1">
                    <span className="text-text-secondary font-medium">Last Interaction Event</span>
                    <span className="text-text-primary font-mono text-[9px]">{selectedItem.lastInteraction}</span>
                  </div>
                </div>
              </div>

              {/* Timeline steps */}
              <div className="flex-1 flex flex-col gap-sm overflow-y-auto">
                <span className="text-[9px] uppercase tracking-wider font-bold text-text-tertiary">Interaction Snapshots</span>
                <div className="flex flex-col gap-md pl-xs mt-xs relative border-l border-hairline/80">
                  <div className="relative pl-md">
                    <div className="absolute w-2 h-2 rounded-full bg-ai -left-[5px] top-[4px]" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-text-primary">Recruiter outreach</span>
                      <span className="text-[9px] text-text-tertiary font-mono">2d ago</span>
                    </div>
                    <p className="text-[10px] text-text-secondary mt-0.5">Stripe Recruiter sent link to schedule phone screening.</p>
                  </div>
                  
                  <div className="relative pl-md">
                    <div className="absolute w-2 h-2 rounded-full bg-success -left-[5px] top-[4px]" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-text-primary">Application submitted</span>
                      <span className="text-[9px] text-text-tertiary font-mono">4d ago</span>
                    </div>
                    <p className="text-[10px] text-text-secondary mt-0.5">Applied via tailored feature/stripe-frontend branch variant.</p>
                  </div>
                </div>
              </div>

              {/* AI Follow-up templates compiler */}
              <div className="bg-surface-2 p-3 rounded-lg border border-hairline/80 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                  <Sparkles className="w-3.5 h-3.5 text-ai" /> Suggested Follow-up
                </div>
                <textarea
                  readOnly
                  value={`Hi Talent Partner,\n\nI hope you are well. Just following up on my application for the ${selectedItem.role} role at ${selectedItem.company}...`}
                  className="bg-surface-3 border border-hairline/60 p-2 text-[10px] rounded text-text-secondary font-mono leading-relaxed resize-none focus:outline-none min-h-[70px]"
                />
                <button className="py-1 px-2.5 bg-ai hover:bg-ai-hover text-canvas rounded text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-xs mt-1">
                  Copy Follow-up <Send className="w-3 h-3" />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
