"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Sliders,
  Bell,
  CreditCard,
  Gift,
  Inbox,
  User,
  CheckCircle2,
  Save,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { staggerContainer, slideUpVariants } from "@/lib/motion";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { IntelligenceCard } from "@/components/intelligence/IntelligenceCard";
import { settings as settingsCopy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";

type SectionId =
  | "apply"
  | "workday"
  | "notifications"
  | "billing"
  | "referrals"
  | "emailIntegration"
  | "account";

const SECTIONS: { id: SectionId; label: string; sublabel: string; icon: React.ElementType }[] = [
  {
    id: "apply",
    label: "Apply Settings",
    sublabel: "Configure resume optimization and submit behavior",
    icon: Sliders,
  },
  {
    id: "workday",
    label: "Workday Password",
    sublabel: "Store your Workday password securely for automated applications",
    icon: Lock,
  },
  {
    id: "notifications",
    label: "Email Notifications",
    sublabel: "Manage daily job recommendation emails",
    icon: Bell,
  },
  {
    id: "billing",
    label: "Plans & Billing",
    sublabel: "Manage your subscription and billing information",
    icon: CreditCard,
  },
  {
    id: "referrals",
    label: "Referrals",
    sublabel: "Invite a friend, both get 200 free applications",
    icon: Gift,
  },
  {
    id: "emailIntegration",
    label: "Email Integration",
    sublabel: "Connect Gmail and Outlook for automatic OTP retrieval",
    icon: Inbox,
  },
  {
    id: "account",
    label: "Account Settings",
    sublabel: "Manage your account preferences and profile",
    icon: User,
  },
];

export function SettingsWorkspace() {
  const { profile, refreshProfile } = useUserEcosystem();

  const [active, setActive] = useState<SectionId>("apply");
  const [saved, setSaved] = useState(false);
  const [savingState, setSavingState] = useState(false);

  // Apply Settings State
  const [resumeMode, setResumeMode] = useState<"off" | "honest" | "aggressive">("honest");
  const [coverLetterMode, setCoverLetterMode] = useState<"off" | "honest" | "aggressive">("honest");
  const [autoApprove, setAutoApprove] = useState(true);

  // Workday Password State
  const [workdayUsername, setWorkdayUsername] = useState("");
  const [workdayPassword, setWorkdayPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [workdaySaved, setWorkdaySaved] = useState(true);

  // Email Notifications State
  const [notifyDailyJobs, setNotifyDailyJobs] = useState(true);
  const [notifyAppStatus, setNotifyAppStatus] = useState(true);
  const [notifyWeeklySummary, setNotifyWeeklySummary] = useState(false);

  // Plans & Billing State
  const [autoRenew, setAutoRenew] = useState(true);

  // Referrals State
  const [copied, setCopied] = useState(false);
  const referralCode = profile?.referralCode || "CAREEROS-200-USER";
  const referralLink = `https://careeros.com/signup?ref=${referralCode}`;

  // Email Integration State
  const [gmailConnected, setGmailConnected] = useState(true);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [connectingService, setConnectingService] = useState<"gmail" | "outlook" | null>(null);

  // Account Settings State
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light" | "system">("dark");
  const [timezone, setTimezone] = useState("Asia/Kolkata (GMT+5:30)");

  // Load initial state from profile
  useEffect(() => {
    if (profile) {
      if (profile.name) setFullName(profile.name);
      if (profile.email) setEmailAddress(profile.email);
      if (profile.settings) {
        setResumeMode(profile.settings.resumeMode || "honest");
        setCoverLetterMode(profile.settings.coverLetterMode || "honest");
        setAutoApprove(profile.settings.autoApprove !== false);
        setWorkdayUsername(profile.settings.workdayUsername || "");
        setWorkdayPassword(profile.settings.workdayPassword || "");
        setNotifyDailyJobs(profile.settings.notifyDailyJobs !== false);
        setNotifyAppStatus(profile.settings.notifyAppStatus !== false);
        setNotifyWeeklySummary(!!profile.settings.notifyWeeklySummary);
      }
    }
  }, [profile]);

  const save = async () => {
    setSavingState(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: emailAddress,
          settings: {
            resumeMode,
            coverLetterMode,
            autoApprove,
            workdayUsername,
            workdayPassword,
            notifyDailyJobs,
            notifyAppStatus,
            notifyWeeklySummary,
          },
        }),
      });

      if (res.ok) {
        setSaved(true);
        await refreshProfile();
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSavingState(false);
    }
  };

  const handleWorkdaySave = async () => {
    await save();
    setWorkdaySaved(true);
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
          disabled={savingState}
          className="shrink-0 px-4 py-2.5 rounded-lg bg-primary text-white text-[12px] font-semibold hover:bg-primary-hover flex items-center gap-2 h-fit transition-colors shadow-sm disabled:opacity-70 cursor-pointer"
        >
          {savingState ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : saved ? (
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
        {/* Navigation Sidebar */}
        <nav className="lg:w-80 shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={cn(
                  "flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 border",
                  active === s.id
                    ? "bg-surface-2 text-text-primary border-hairline shadow-sm"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-surface-1/50 border-transparent"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg border shrink-0 mt-0.5 transition-colors",
                  active === s.id
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-surface-3 border-hairline text-text-tertiary"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold tracking-tight text-text-primary">{s.label}</p>
                  <p className="hidden lg:block text-[11px] text-text-tertiary mt-0.5 leading-normal truncate">
                    {s.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Content Pane */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 min-w-0"
        >
          {active === "apply" && (
            <div className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <IntelligenceCard
                  title="Resume Optimization"
                  subtitle="How much we customize your resume per job"
                  domain="resume"
                >
                  <RadioGroup
                    options={[
                      { id: "off", label: "Off", hint: "Use your original resume as-is" },
                      { id: "honest", label: "Honest", hint: "Reorder and highlight relevant experience for each job" },
                      { id: "aggressive", label: "Aggressive", hint: "Rewrite and tailor content to match the job description" },
                    ]}
                    value={resumeMode}
                    onChange={(v) => setResumeMode(v as typeof resumeMode)}
                  />
                </IntelligenceCard>

                <IntelligenceCard
                  title="Cover Letter Optimization"
                  subtitle="How we generate and align cover letters"
                  domain="primary"
                >
                  <RadioGroup
                    options={[
                      { id: "off", label: "Off", hint: "Don't generate a cover letter" },
                      { id: "honest", label: "Honest", hint: "Tailor tone and emphasis to each job, no fabrication" },
                      { id: "aggressive", label: "Aggressive", hint: "Rewrite to closely match the job description" },
                    ]}
                    value={coverLetterMode}
                    onChange={(v) => setCoverLetterMode(v as typeof coverLetterMode)}
                  />
                </IntelligenceCard>
              </div>

              <IntelligenceCard
                title="Auto-Submit Mode"
                subtitle="Configure validation and submit behavior"
                domain="success"
              >
                <div className="flex items-center justify-between p-4 rounded-xl border border-hairline bg-surface-2/30 mt-2">
                  <div className="space-y-1 pr-4">
                    <p className="text-[13px] font-semibold text-text-primary">Auto-approve (skip preview steps)</p>
                    <p className="text-[11px] text-text-tertiary">
                      Skip final preview screens and allow the system to submit applications instantly once optimized.
                    </p>
                  </div>
                  <Toggle on={autoApprove} onChange={setAutoApprove} />
                </div>
              </IntelligenceCard>
            </div>
          )}

          {active === "workday" && (
            <div className="space-y-md">
              <IntelligenceCard
                title="Secure Credentials Store"
                subtitle="Your login details are encrypted at the client level before transit."
                domain="warning"
              >
                <div className="space-y-4 mt-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/5 border border-warning/15 text-warning">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <span className="text-[12px] leading-relaxed">
                      Credentials are encrypted using AES-256 and only used in isolated secure containers to automate applications.
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1.5">
                        Workday Username / Email
                      </label>
                      <input
                        type="email"
                        value={workdayUsername}
                        onChange={(e) => {
                          setWorkdayUsername(e.target.value);
                          setWorkdaySaved(false);
                        }}
                        placeholder="your-email@example.com"
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1.5">
                        Workday Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={workdayPassword}
                          onChange={(e) => {
                            setWorkdayPassword(e.target.value);
                            setWorkdaySaved(false);
                          }}
                          placeholder="Enter your Workday password"
                          className="w-full pl-3 pr-10 py-2.5 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-text-tertiary flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      Encrypted connection active
                    </span>
                    <button
                      type="button"
                      onClick={handleWorkdaySave}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[12px] font-semibold transition-all flex items-center gap-2 border",
                        workdaySaved
                          ? "bg-surface-3 border-hairline text-text-tertiary cursor-default"
                          : "bg-primary border-primary hover:bg-primary-hover text-white shadow-sm cursor-pointer"
                      )}
                      disabled={workdaySaved}
                    >
                      {workdaySaved ? "Saved Securely" : "Save Credentials"}
                    </button>
                  </div>
                </div>
              </IntelligenceCard>
            </div>
          )}

          {active === "notifications" && (
            <div className="space-y-md">
              <IntelligenceCard
                title="Email Preferences"
                subtitle="Configure when and how CareerOS contacts you."
                domain="pipeline"
              >
                <div className="divide-y divide-hairline space-y-4 mt-2">
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5 pr-4">
                      <p className="text-[13px] font-semibold text-text-primary">Daily job recommendation emails</p>
                      <p className="text-[11px] text-text-tertiary">
                        Get tailored job matches matched to your profile and resume daily.
                      </p>
                    </div>
                    <Toggle on={notifyDailyJobs} onChange={setNotifyDailyJobs} />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-0.5 pr-4">
                      <p className="text-[13px] font-semibold text-text-primary">Application status alerts</p>
                      <p className="text-[11px] text-text-tertiary">
                        Receive instant notifications when recruiters view your resume or when automatic submissions finish.
                      </p>
                    </div>
                    <Toggle on={notifyAppStatus} onChange={setNotifyAppStatus} />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-0.5 pr-4">
                      <p className="text-[13px] font-semibold text-text-primary">Weekly career summaries</p>
                      <p className="text-[11px] text-text-tertiary">
                        Get weekly statistics on profile performance, salary trends, and recommended next steps.
                      </p>
                    </div>
                    <Toggle on={notifyWeeklySummary} onChange={setNotifyWeeklySummary} />
                  </div>
                </div>
              </IntelligenceCard>
            </div>
          )}

          {active === "billing" && (
            <div className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div className="md:col-span-2 space-y-md">
                  <IntelligenceCard title="Active Subscription" domain="success">
                    <div className="space-y-4 mt-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/25 text-[10px] font-bold uppercase tracking-wider">
                            Active
                          </span>
                          <h4 className="text-lg font-bold text-text-primary mt-1">CareerOS Pro Plan</h4>
                          <p className="text-[11px] text-text-tertiary mt-0.5">Unlimited automated submissions & resumes</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-text-primary">$29<span className="text-sm font-normal text-text-secondary">/mo</span></p>
                          <p className="text-[11px] text-text-tertiary mt-1">Next bill: July 12, 2026</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-hairline">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 rounded bg-surface-3 border border-hairline flex items-center justify-center font-bold text-[10px] text-text-secondary tracking-wider">
                            VISA
                          </div>
                          <div>
                            <p className="text-[12px] font-semibold text-text-primary">Visa ending in 4242</p>
                            <p className="text-[10px] text-text-tertiary">Expires 12/29</p>
                          </div>
                        </div>
                        <button type="button" className="text-[11px] font-semibold text-primary hover:text-primary-hover hover:underline">
                          Update
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-hairline">
                        <span className="text-[12px] text-text-secondary">Auto-renew subscription</span>
                        <Toggle on={autoRenew} onChange={setAutoRenew} />
                      </div>
                    </div>
                  </IntelligenceCard>
                </div>

                <div className="space-y-md">
                  <IntelligenceCard title="Applications Quota" domain="primary">
                    <div className="space-y-4 mt-2">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-text-secondary">Current cycle applications</span>
                          <span className="font-semibold text-text-primary">850 / Unlimited</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-[85%]" />
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-[11px] text-text-tertiary leading-relaxed">
                          Your quota resets monthly. Refer friends to earn permanently free credits or upgrade to enterprise.
                        </p>
                      </div>
                    </div>
                  </IntelligenceCard>
                </div>
              </div>

              <IntelligenceCard title="Invoice History" domain="primary">
                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-hairline text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                        <th className="py-2.5">Billing Date</th>
                        <th className="py-2.5">Invoice Ref</th>
                        <th className="py-2.5">Amount</th>
                        <th className="py-2.5">Status</th>
                        <th className="py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline text-[12px] text-text-secondary">
                      <tr>
                        <td className="py-3">June 12, 2026</td>
                        <td className="py-3 text-mono-operational text-text-primary">INV-2026-004</td>
                        <td className="py-3 font-semibold text-text-primary">$29.00</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success uppercase">
                            <span className="w-1 h-1 rounded-full bg-success" /> Paid
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button type="button" className="text-primary hover:text-primary-hover hover:underline inline-flex items-center gap-1 text-[11px]">
                            Download <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3">May 12, 2026</td>
                        <td className="py-3 text-mono-operational text-text-primary">INV-2026-003</td>
                        <td className="py-3 font-semibold text-text-primary">$29.00</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success uppercase">
                            <span className="w-1 h-1 rounded-full bg-success" /> Paid
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button type="button" className="text-primary hover:text-primary-hover hover:underline inline-flex items-center gap-1 text-[11px]">
                            Download <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3">April 12, 2026</td>
                        <td className="py-3 text-mono-operational text-text-primary">INV-2026-002</td>
                        <td className="py-3 font-semibold text-text-primary">$0.00</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success uppercase">
                            <span className="w-1 h-1 rounded-full bg-success" /> Paid
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button type="button" className="text-primary hover:text-primary-hover hover:underline inline-flex items-center gap-1 text-[11px]">
                            Download <ExternalLink className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </IntelligenceCard>
            </div>
          )}

          {active === "referrals" && (
            <div className="space-y-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div className="md:col-span-2 space-y-md">
                  <IntelligenceCard
                    title="Share the Love, Earn Apps"
                    subtitle="Refer your friends to CareerOS. When they join, you both get 200 free applications."
                    domain="primary"
                  >
                    <div className="space-y-4 mt-2">
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1.5">
                          Your Unique Referral Link
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-1 px-3 py-2.5 rounded-lg bg-surface-2 border border-hairline text-[12px] text-text-primary font-mono select-all truncate flex items-center">
                            {referralLink}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(referralLink);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className={cn(
                              "px-4 py-2.5 rounded-lg border text-[12px] font-semibold transition-all flex items-center gap-2",
                              copied
                                ? "bg-success/10 border-success/20 text-success"
                                : "border-hairline bg-surface-3 hover:bg-surface-4 text-text-primary cursor-pointer"
                            )}
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" /> Copy Link
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-surface-2/50 border border-hairline flex items-center justify-between text-[12px]">
                        <span className="text-text-secondary">Referral Code</span>
                        <span className="font-bold text-text-primary font-mono bg-surface-3 px-2 py-1 rounded border border-hairline tracking-wider">
                          {referralCode}
                        </span>
                      </div>
                    </div>
                  </IntelligenceCard>
                </div>

                <div className="space-y-md">
                  <IntelligenceCard title="Earned Rewards" domain="success">
                    <div className="space-y-4 mt-2">
                      <div className="text-center py-2">
                        <p className="text-4xl font-extrabold text-success tracking-tight">
                          {((profile?.referredUsersCount || 2) * 200)}
                        </p>
                        <p className="text-[11px] text-text-secondary uppercase font-semibold tracking-wider mt-1">
                          Free Applications Earned
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-text-tertiary">Max referral limit</span>
                          <span className="font-semibold text-text-secondary">
                            {((profile?.referredUsersCount || 2) * 200)} / 1,000 apps
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-3 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (((profile?.referredUsersCount || 2) * 200) / 1000) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </IntelligenceCard>
                </div>
              </div>

              <IntelligenceCard title="Referral History" domain="primary">
                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-hairline text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                        <th className="py-2.5">Invited Email</th>
                        <th className="py-2.5">Date Invited</th>
                        <th className="py-2.5">Reward Status</th>
                        <th className="py-2.5 text-right">Reward</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline text-[12px] text-text-secondary">
                      <tr>
                        <td className="py-3 text-text-primary">rahul.sinha@example.com</td>
                        <td className="py-3">June 08, 2026</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/15 border border-success/20 text-success text-[10px] font-semibold uppercase">
                            Joined
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-success">+200 apps</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-text-primary">priyanka.g@example.com</td>
                        <td className="py-3">May 24, 2026</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/15 border border-success/20 text-success text-[10px] font-semibold uppercase">
                            Joined
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-success">+200 apps</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-text-primary">shreya.m@example.com</td>
                        <td className="py-3">June 11, 2026</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-warning/15 border border-warning/20 text-warning text-[10px] font-semibold uppercase">
                            Pending Signup
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold text-text-tertiary">0 apps</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </IntelligenceCard>
            </div>
          )}

          {active === "emailIntegration" && (
            <div className="space-y-md">
              <IntelligenceCard
                title="Secure One-Time Password Retrieval"
                subtitle="Automatically retrieve job portal verification codes straight from your inbox."
                domain="primary"
              >
                <p className="text-[12px] text-text-secondary leading-relaxed mt-2">
                  Many employer career portals (Workday, Greenhouse, Taleo) send verification codes or OTPs to verify your identity.
                  Connecting your email allows CareerOS to securely query and read only incoming verification emails, allowing automated
                  applications to proceed without manual interruption.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Google Card */}
                  <div className="p-5 rounded-xl border border-hairline bg-surface-2/40 flex flex-col justify-between h-48 relative overflow-hidden transition-all duration-350 hover:border-primary/25">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center font-bold text-red-500 border border-hairline">
                            G
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold text-text-primary">Google Gmail</h4>
                            <p className="text-[10px] text-text-tertiary">For @gmail.com & Workspace</p>
                          </div>
                        </div>
                      </div>
                      {gmailConnected ? (
                        <span className="px-2 py-0.5 rounded-full bg-success/15 border border-success/20 text-success text-[9px] font-bold uppercase tracking-wider">
                          Connected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-surface-3 border border-hairline text-text-tertiary text-[9px] font-bold uppercase tracking-wider">
                          Not Connected
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-text-tertiary mt-2">
                      {gmailConnected
                        ? "Querying inbox for verification codes from workday.com, greenhouse.io, and icims.com."
                        : "Requires read-only access to messages containing 'verification code' or 'one-time password'."}
                    </div>

                    <div className="mt-4 flex gap-2">
                      {gmailConnected ? (
                        <button
                          type="button"
                          onClick={() => setGmailConnected(false)}
                          className="w-full py-2 rounded-lg border border-hairline text-[11px] font-semibold text-danger hover:bg-danger/10 hover:border-danger/20 transition-all cursor-pointer"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setConnectingService("gmail");
                            setTimeout(() => {
                              setGmailConnected(true);
                              setConnectingService(null);
                            }, 1500);
                          }}
                          className="w-full py-2 rounded-lg bg-primary hover:bg-primary-hover text-[11px] font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                          disabled={connectingService === "gmail"}
                        >
                          {connectingService === "gmail" ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Connecting...
                            </>
                          ) : (
                            "Connect Gmail"
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Microsoft Card */}
                  <div className="p-5 rounded-xl border border-hairline bg-surface-2/40 flex flex-col justify-between h-48 relative overflow-hidden transition-all duration-350 hover:border-primary/25">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center font-bold text-blue-500 border border-hairline">
                            O
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold text-text-primary">Outlook / Microsoft 365</h4>
                            <p className="text-[10px] text-text-tertiary">For @outlook.com & Office 365</p>
                          </div>
                        </div>
                      </div>
                      {outlookConnected ? (
                        <span className="px-2 py-0.5 rounded-full bg-success/15 border border-success/20 text-success text-[9px] font-bold uppercase tracking-wider">
                          Connected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-surface-3 border border-hairline text-text-tertiary text-[9px] font-bold uppercase tracking-wider">
                          Not Connected
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-text-tertiary mt-2">
                      {outlookConnected
                        ? "Querying inbox for verification codes from workday.com, greenhouse.io, and icims.com."
                        : "Requires read-only access to messages containing 'verification code' or 'one-time password'."}
                    </div>

                    <div className="mt-4 flex gap-2">
                      {outlookConnected ? (
                        <button
                          type="button"
                          onClick={() => setOutlookConnected(false)}
                          className="w-full py-2 rounded-lg border border-hairline text-[11px] font-semibold text-danger hover:bg-danger/10 hover:border-danger/20 transition-all cursor-pointer"
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setConnectingService("outlook");
                            setTimeout(() => {
                              setOutlookConnected(true);
                              setConnectingService(null);
                            }, 1500);
                          }}
                          className="w-full py-2 rounded-lg bg-primary hover:bg-primary-hover text-[11px] font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                          disabled={connectingService === "outlook"}
                        >
                          {connectingService === "outlook" ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Connecting...
                            </>
                          ) : (
                            "Connect Outlook"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </IntelligenceCard>
            </div>
          )}

          {active === "account" && (
            <div className="space-y-md">
              <IntelligenceCard
                title="Profile Details"
                subtitle="Update your basic account information."
                domain="primary"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </IntelligenceCard>

              <IntelligenceCard
                title="System Preferences"
                subtitle="Configure display themes and timezone alignment."
                domain="primary"
              >
                <div className="space-y-4 mt-2">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1.5">
                      Workspace Theme
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["light", "dark", "system"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTheme(t as typeof selectedTheme)}
                          className={cn(
                            "py-2.5 rounded-lg border text-[12px] font-semibold capitalize transition-all cursor-pointer",
                            selectedTheme === t
                              ? "border-primary/45 bg-primary/10 text-primary shadow-sm"
                              : "border-hairline text-text-secondary hover:bg-surface-2"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary block mb-1.5">
                      Preferred Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-hairline text-[13px] text-text-primary focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="Asia/Kolkata (GMT+5:30)">Asia/Kolkata (GMT+5:30)</option>
                      <option value="America/New_York (GMT-4:00)">America/New_York (GMT-4:00)</option>
                      <option value="Europe/London (GMT+1:00)">Europe/London (GMT+1:00)</option>
                      <option value="America/Los_Angeles (GMT-7:00)">America/Los_Angeles (GMT-7:00)</option>
                    </select>
                  </div>
                </div>
              </IntelligenceCard>

              <IntelligenceCard
                title="Danger Zone"
                subtitle="Irreversible actions regarding your CareerOS account."
                domain="warning"
              >
                <div className="p-4 rounded-xl border border-danger/15 bg-danger/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                  <div className="pr-4">
                    <p className="text-[13px] font-semibold text-danger flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Deactivate Account
                    </p>
                    <p className="text-[11px] text-text-tertiary mt-1 max-w-xl">
                      Permanently delete your profile, linked integration credentials, billing records, and your entire application pipeline. This action is instantaneous and cannot be undone.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-lg bg-danger text-white text-[12px] font-semibold hover:bg-danger/90 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" /> Deactivate
                  </button>
                </div>
              </IntelligenceCard>
            </div>
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
        "w-10 h-5 rounded-full p-0.5 transition-colors relative shrink-0 cursor-pointer",
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
            "w-full text-left p-3 rounded-lg border transition-all cursor-pointer",
            value === o.id
              ? "border-primary/45 bg-primary/5 shadow-sm"
              : "border-hairline hover:bg-surface-2"
          )}
        >
          <p className="text-[13px] font-semibold text-text-primary">{o.label}</p>
          <p className="text-[11px] text-text-tertiary mt-0.5 leading-normal">{o.hint}</p>
        </button>
      ))}
    </div>
  );
}
