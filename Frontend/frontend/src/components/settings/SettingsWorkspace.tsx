"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Sliders,
  Bell,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  Save,
} from "lucide-react";
import { staggerContainer, slideUpVariants } from "@/lib/motion";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { IntelligenceCard } from "@/components/intelligence/IntelligenceCard";
import { settings as settingsCopy } from "@/lib/copy";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { cn } from "@/lib/utils";

type SectionId = "connections" | "privacy" | "applications" | "assistant" | "notifications";

const SECTIONS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "connections", label: settingsCopy.sections.connections, icon: Lock },
  { id: "privacy", label: settingsCopy.sections.privacy, icon: Lock },
  { id: "applications", label: settingsCopy.sections.applications, icon: Sliders },
  { id: "assistant", label: settingsCopy.sections.assistant, icon: Sparkles },
  { id: "notifications", label: settingsCopy.sections.notifications, icon: Bell },
];

export function SettingsWorkspace() {
  const [active, setActive] = useState<SectionId>("privacy");
  const [stealth, setStealth] = useState(true);
  const [blocked, setBlocked] = useState(["stripe.com", "meta.com"]);
  const [newDomain, setNewDomain] = useState("");
  const [minSalary, setMinSalary] = useState(180000);
  const [workplace, setWorkplace] = useState("Hybrid");
  const [memory, setMemory] = useState(true);
  const [rules, setRules] = useState("Prefer staff-level frontend roles. Emphasize measurable impact.");
  const [notify, setNotify] = useState({ recruiter: true, resume: true, followUp: true });
  const [saved, setSaved] = useState(false);
  const [resumeMode, setResumeMode] = useState<"off" | "honest" | "aggressive">("honest");

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-lg py-md pb-xl"
    >
      <motion.div variants={slideUpVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-md">
        <PageHeader
          title={settingsCopy.title}
          subtitle={settingsCopy.subtitle}
          guide={settingsCopy.pageGuide}
        />
        <button
          type="button"
          onClick={save}
          className="shrink-0 px-4 py-2.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary-hover flex items-center gap-2 h-fit"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save changes
            </>
          )}
        </button>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-lg">
        <nav className="lg:w-52 shrink-0 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-[13px] font-medium whitespace-nowrap transition-colors",
                  active === s.id
                    ? "bg-surface-2 text-text-primary border border-hairline"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-surface-1"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {s.label}
              </button>
            );
          })}
        </nav>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 min-w-0"
        >
          {active === "connections" && (
            <IntelligenceCard title={settingsCopy.sections.connections} domain="primary">
              <div className="space-y-2 mt-2">
                <ConnectionRow icon={GithubIcon} name="GitHub" status="Connected" detail="Skills & repos synced" />
                <ConnectionRow icon={LinkedinIcon} name="LinkedIn" status="Connected" detail="Experience imported" />
              </div>
            </IntelligenceCard>
          )}

          {active === "privacy" && (
            <div className="space-y-md">
              <IntelligenceCard title={settingsCopy.stealth} subtitle={settingsCopy.stealthHint} domain="recruiter">
                <Toggle on={stealth} onChange={setStealth} />
              </IntelligenceCard>
              <IntelligenceCard title={settingsCopy.blocked} domain="warning">
                <form
                  className="flex gap-2 mt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newDomain && !blocked.includes(newDomain)) {
                      setBlocked([...blocked, newDomain.trim()]);
                      setNewDomain("");
                    }
                  }}
                >
                  <input
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="company.com"
                    className="flex-1 px-3 py-2 rounded-lg bg-surface-2 border border-hairline text-sm focus:outline-none focus:border-primary/50"
                  />
                  <button type="submit" className="p-2 rounded-lg border border-hairline hover:bg-surface-2">
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {blocked.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md bg-surface-2 border border-hairline"
                    >
                      {d}
                      <button type="button" onClick={() => setBlocked(blocked.filter((x) => x !== d))}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </IntelligenceCard>
            </div>
          )}

          {active === "applications" && (
            <div className="space-y-md">
              <IntelligenceCard title="Resume tailoring" subtitle="How much we customize per job" domain="resume">
                <RadioGroup
                  options={[
                    { id: "off", label: "Off", hint: "Use your resume as-is" },
                    { id: "honest", label: "Smart tailoring", hint: "Highlight relevant experience — no fabrication" },
                    { id: "aggressive", label: "Deep tailoring", hint: "Stronger keyword alignment per role" },
                  ]}
                  value={resumeMode}
                  onChange={(v) => setResumeMode(v as typeof resumeMode)}
                />
              </IntelligenceCard>
              <IntelligenceCard title={settingsCopy.salary} domain="market">
                <p className="text-sm font-semibold text-text-primary tabular-nums mt-2">
                  ${minSalary.toLocaleString()}+ / year
                </p>
                <input
                  type="range"
                  min={100000}
                  max={300000}
                  step={5000}
                  value={minSalary}
                  onChange={(e) => setMinSalary(Number(e.target.value))}
                  className="w-full mt-3 accent-primary h-1"
                />
              </IntelligenceCard>
              <IntelligenceCard title={settingsCopy.workplace} domain="primary">
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["Remote", "Hybrid", "On-site"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setWorkplace(m)}
                      className={cn(
                        "py-2 rounded-lg border text-[12px] font-semibold transition-colors",
                        workplace === m
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-hairline text-text-secondary hover:bg-surface-2"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </IntelligenceCard>
            </div>
          )}

          {active === "assistant" && (
            <IntelligenceCard
              title={settingsCopy.memory}
              subtitle={settingsCopy.memoryHint}
              domain="primary"
            >
              <Toggle on={memory} onChange={setMemory} className="mt-2" />
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="w-full mt-4 min-h-[100px] p-3 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-secondary leading-relaxed focus:outline-none focus:border-primary/50"
                placeholder="Tell the assistant what roles and companies you prefer…"
              />
            </IntelligenceCard>
          )}

          {active === "notifications" && (
            <IntelligenceCard title={settingsCopy.sections.notifications} domain="pipeline">
              <div className="space-y-3 mt-2">
                <NotifyRow
                  label={settingsCopy.notifyRecruiter}
                  on={notify.recruiter}
                  onChange={(v) => setNotify({ ...notify, recruiter: v })}
                />
                <NotifyRow
                  label={settingsCopy.notifyResume}
                  on={notify.resume}
                  onChange={(v) => setNotify({ ...notify, resume: v })}
                />
                <NotifyRow
                  label={settingsCopy.notifyFollowUp}
                  on={notify.followUp}
                  onChange={(v) => setNotify({ ...notify, followUp: v })}
                />
              </div>
            </IntelligenceCard>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function Toggle({
  on,
  onChange,
  className,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={cn(
        "w-10 h-5 rounded-full p-0.5 transition-colors relative",
        on ? "bg-primary" : "bg-surface-3",
        className
      )}
    >
      <div
        className={cn(
          "w-4 h-4 bg-white rounded-full shadow transition-transform",
          on ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function ConnectionRow({
  icon: Icon,
  name,
  status,
  detail,
}: {
  icon: React.ElementType;
  name: string;
  status: string;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-hairline bg-surface-2/50">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-text-secondary" />
        <div>
          <p className="text-[13px] font-semibold text-text-primary">{name}</p>
          <p className="text-[11px] text-text-tertiary">{detail}</p>
        </div>
      </div>
      <span className="text-[10px] font-bold text-success uppercase">{status}</span>
    </div>
  );
}

function NotifyRow({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string; hint: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2 mt-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "w-full text-left p-3 rounded-lg border transition-colors",
            value === o.id
              ? "border-primary/40 bg-primary/5"
              : "border-hairline hover:bg-surface-2"
          )}
        >
          <p className="text-[13px] font-semibold text-text-primary">{o.label}</p>
          <p className="text-[11px] text-text-tertiary mt-0.5">{o.hint}</p>
        </button>
      ))}
    </div>
  );
}
