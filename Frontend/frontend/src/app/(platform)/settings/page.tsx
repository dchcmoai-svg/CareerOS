"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, slideUpVariants } from "@/lib/motion";
import { 
  Sparkles, 
  Lock, 
  Building2, 
  Sliders, 
  Brain, 
  BellRing, 
  Plus, 
  X, 
  CheckCircle2, 
  Save 
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { TelemetryStrip } from "@/components/ecosystem/TelemetryStrip";
import { Shield, BellRing as BellIcon } from "lucide-react";

export default function SettingsPage() {
  // 1. Interactive States
  const [stealthMode, setStealthMode] = useState(true);
  const [blockedDomains, setBlockedDomains] = useState(["stripe.com", "google.com", "facebook.com"]);
  const [newDomain, setNewDomain] = useState("");
  
  const [minSalary, setMinSalary] = useState(180000);
  const [remotePreference, setRemotePreference] = useState("Hybrid");
  
  const [aiMemoryEnabled, setAiMemoryEnabled] = useState(true);
  const [aiCustomRules, setAiCustomRules] = useState("Emphasize compiler design and low-level optimization metrics.");

  const [notificationRules, setNotificationRules] = useState({
    recruiterActivity: true,
    atsUpdates: true,
    stalledWorkflow: true
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // 2. State Actions
  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDomain && !blockedDomains.includes(newDomain)) {
      setBlockedDomains([...blockedDomains, newDomain.trim()]);
      setNewDomain("");
    }
  };

  const handleRemoveDomain = (domain: string) => {
    setBlockedDomains(blockedDomains.filter(d => d !== domain));
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl flex flex-col gap-lg py-md pb-xl"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title="System Configuration"
          subtitle="Account, OAuth, security, AI controls, visibility, and opportunity preferences."
          telemetry={
            <TelemetryStrip
              metrics={[
                { label: "Stealth", value: stealthMode ? "On" : "Off", status: "success", icon: Shield },
                { label: "AI memory", value: aiMemoryEnabled ? "On" : "Off", status: "intelligence", icon: Brain },
                { label: "Alerts", value: "3", sublabel: "Active rules", status: "neutral", icon: BellIcon },
                { label: "Blocked", value: String(blockedDomains.length), sublabel: "Domains", status: "warning" },
              ]}
            />
          }
        />
      </motion.div>

      <motion.div variants={slideUpVariants} className="flex justify-end items-center pb-md border-b border-hairline relative">
        
        <button
          onClick={handleSave}
          className="px-md py-2 bg-ai text-canvas rounded hover:bg-ai-hover font-bold text-xs uppercase tracking-wider flex items-center gap-sm active:scale-[0.98] transition-all"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" /> Save Changes
            </>
          )}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        
        {/* Left Column: Account, Identity, Marketplace Stealth */}
        <div className="flex flex-col gap-md">
          {/* Account Authentication & Identity Sync */}
          <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-hairline pb-xs mb-xs">
              <Lock className="w-3.5 h-3.5 text-ai" /> Identity Connections
            </h3>
            
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-surface-2 p-2.5 rounded border border-hairline/60">
                <div className="flex items-center gap-sm">
                  <GithubIcon className="w-4 h-4 text-text-secondary" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">GitHub Auth Provider</span>
                    <span className="text-[10px] text-text-tertiary">Ingesting repo metadata and parsed languages</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-success uppercase">Connected</span>
              </div>

              <div className="flex justify-between items-center bg-surface-2 p-2.5 rounded border border-hairline/60">
                <div className="flex items-center gap-sm">
                  <LinkedinIcon className="w-4 h-4 text-text-secondary" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">LinkedIn Profile Sync</span>
                    <span className="text-[10px] text-text-tertiary">Scraping historical employment timeline</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-success uppercase">Connected</span>
              </div>
            </div>
          </motion.div>

          {/* Marketplace stealth parameters */}
          <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-hairline pb-xs mb-xs">
              <Building2 className="w-3.5 h-3.5 text-ai" /> Stealth & Blocklists
            </h3>

            <div className="flex items-center justify-between bg-surface-2 p-2.5 border border-hairline rounded">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-text-primary">Stealth Search Mode</span>
                <span className="text-[10px] text-text-secondary mt-0.5">Strictly shield profile from recruiter intent</span>
              </div>
              <button
                onClick={() => setStealthMode(!stealthMode)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${stealthMode ? "bg-ai" : "bg-surface-3"}`}
              >
                <div className={`w-4 h-4 bg-canvas rounded-full transition-transform ${stealthMode ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Blocked companies domains */}
            <div className="flex flex-col gap-2 mt-sm">
              <label className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Blocked Employer Domains</label>
              
              <form onSubmit={handleAddDomain} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. apple.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="bg-surface-2 border border-hairline/80 px-2 py-1 text-xs rounded text-text-primary focus:outline-none focus:border-ai flex-1"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-surface-3 hover:bg-surface-2 border border-hairline rounded text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex flex-wrap gap-xs mt-1">
                {blockedDomains.map(domain => (
                  <span key={domain} className="flex items-center gap-1 text-[10px] font-mono bg-surface-3 border border-hairline px-2 py-0.5 rounded text-text-secondary">
                    {domain}
                    <button type="button" onClick={() => handleRemoveDomain(domain)} className="text-text-tertiary hover:text-text-primary">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Compensation Preferences, AI Memory, Notifications */}
        <div className="flex flex-col gap-md">
          {/* Base Opportunity Preferences */}
          <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-hairline pb-xs mb-xs">
              <Sliders className="w-3.5 h-3.5 text-ai" /> Opportunity Criteria
            </h3>

            <div className="flex flex-col gap-xs">
              <label className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Minimum Base Salary Floor</label>
              <div className="flex justify-between items-center text-xs text-text-secondary mt-1">
                <span>${minSalary.toLocaleString()} Base / year</span>
                <span className="text-ai font-mono font-bold">Strict Gate</span>
              </div>
              <input
                type="range"
                min="100000"
                max="300000"
                step="5000"
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-full h-1 bg-surface-3 rounded-lg appearance-none cursor-pointer mt-1 accent-ai"
              />
            </div>

            <div className="flex flex-col gap-xs mt-sm">
              <label className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Workplace Format</label>
              <div className="grid grid-cols-3 gap-xs">
                {["Remote", "Hybrid", "Onsite"].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setRemotePreference(mode)}
                    className={`py-1.5 rounded border text-xs font-medium transition-all ${
                      remotePreference === mode 
                        ? "bg-surface-3 text-text-primary border-ai" 
                        : "bg-surface-2 text-text-secondary border-hairline/60 hover:bg-surface-3"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* AI Cognitive Memory Settings */}
          <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-hairline pb-xs mb-xs">
              <Brain className="w-3.5 h-3.5 text-ai" /> AI Memory & Personalization
            </h3>

            <div className="flex items-center justify-between bg-surface-2 p-2.5 border border-hairline rounded">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-text-primary">Cognitive Memory Retention</span>
                <span className="text-[10px] text-text-secondary mt-0.5">Let AI learn from interview rejections and recruiter signals</span>
              </div>
              <button
                onClick={() => setAiMemoryEnabled(!aiMemoryEnabled)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${aiMemoryEnabled ? "bg-ai" : "bg-surface-3"}`}
              >
                <div className={`w-4 h-4 bg-canvas rounded-full transition-transform ${aiMemoryEnabled ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>

            <div className="flex flex-col gap-1.5 mt-sm">
              <label className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Personalized Match Guidelines</label>
              <textarea
                value={aiCustomRules}
                onChange={(e) => setAiCustomRules(e.target.value)}
                className="bg-surface-2 border border-hairline/80 p-2 text-xs rounded text-text-primary focus:outline-none focus:border-ai min-h-[60px] font-mono leading-relaxed"
                placeholder="Tell the career assistant your preferences…"
              />
            </div>
          </motion.div>

          {/* Operational Alerts Notifications */}
          <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-lg p-md flex flex-col gap-sm shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            <h3 className="font-semibold text-xs text-text-primary uppercase tracking-widest flex items-center gap-1.5 border-b border-hairline pb-xs mb-xs">
              <BellRing className="w-3.5 h-3.5 text-ai" /> Operational Alert Triggers
            </h3>

            <div className="flex flex-col gap-xs">
              <div className="flex items-center justify-between py-1 text-xs">
                <span className="text-text-secondary font-medium">Recruiter Activity (Inbounds & profile opens)</span>
                <button
                  onClick={() => setNotificationRules({...notificationRules, recruiterActivity: !notificationRules.recruiterActivity})}
                  className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${notificationRules.recruiterActivity ? "bg-ai" : "bg-surface-3"}`}
                >
                  <div className={`w-3.5 h-3.5 bg-canvas rounded-full transition-transform ${notificationRules.recruiterActivity ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-1 text-xs">
                <span className="text-text-secondary font-medium">Resume suggestions & improvements</span>
                <button
                  onClick={() => setNotificationRules({...notificationRules, atsUpdates: !notificationRules.atsUpdates})}
                  className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${notificationRules.atsUpdates ? "bg-ai" : "bg-surface-3"}`}
                >
                  <div className={`w-3.5 h-3.5 bg-canvas rounded-full transition-transform ${notificationRules.atsUpdates ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-1 text-xs">
                <span className="text-text-secondary font-medium">Application follow-up reminders</span>
                <button
                  onClick={() => setNotificationRules({...notificationRules, stalledWorkflow: !notificationRules.stalledWorkflow})}
                  className={`w-8 h-4 rounded-full p-0.5 transition-colors relative flex items-center ${notificationRules.stalledWorkflow ? "bg-ai" : "bg-surface-3"}`}
                >
                  <div className={`w-3.5 h-3.5 bg-canvas rounded-full transition-transform ${notificationRules.stalledWorkflow ? "translate-x-4" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
