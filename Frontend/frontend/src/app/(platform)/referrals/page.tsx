"use client";

import React, { useState } from "react";
import { Gift, Copy, CheckCircle2, DollarSign, Users, AlertCircle, Sparkles } from "lucide-react";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";
import { PageHeader } from "@/components/ecosystem/PageHeader";
import { motion } from "framer-motion";
import { staggerContainer, slideUpVariants } from "@/lib/motion";

export default function ReferralsPage() {
  const { profile, refreshProfile } = useUserEcosystem();
  const [claimCode, setClaimCode] = useState("");
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleClaimReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimCode.trim()) return;
    
    setSubmittingClaim(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/user/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: claimCode.trim() }),
      });
      
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Referral claimed successfully! Your friend has been credited $50.");
        setClaimCode("");
        await refreshProfile();
      } else {
        setErrorMessage(data.error || "Failed to claim referral code.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setSubmittingClaim(false);
    }
  };

  const handleCopyLink = () => {
    if (profile?.referralCode) {
      const link = `${window.location.origin}/sign-in?ref=${profile.referralCode}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="pb-section flex flex-col h-full gap-lg pt-md"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title="Referrals & Rewards"
          subtitle="Invite friends to CareerOS. You'll get paid $50 for every developer that completes onboarding!"
          guide="Copy your referral link to share, or enter a friend's code below to credit them."
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        
        {/* Left Columns: Share & Stats */}
        <div className="lg:col-span-2 space-y-lg">
          
          {/* Share Box Card */}
          <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-success animate-bounce" />
              <span>Share the Ecosystem</span>
            </h3>
            <p className="text-xs text-text-secondary mb-5 leading-normal">
              Copy your unique referral link. When developers register using this link and select the Candidate role, you earn $50 directly!
            </p>

            <div className="flex gap-2 bg-surface-2 border border-hairline rounded-xl p-2 items-center">
              <span className="text-xs font-mono text-text-secondary truncate pl-2 select-all flex-1">
                {profile?.referralCode ? `${typeof window !== "undefined" ? window.location.origin : ""}/sign-in?ref=${profile.referralCode}` : "Generating code..."}
              </span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy Link"}
              </button>
            </div>
          </motion.div>

          {/* Stats Breakdown */}
          <motion.div variants={slideUpVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="bg-surface-1 border border-hairline rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wide">Total Referrals</p>
                <p className="text-2xl font-bold text-text-primary mt-0.5 tabular-nums">{profile?.referredUsersCount || 0}</p>
              </div>
            </div>
            <div className="bg-surface-1 border border-hairline rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wide">Rewards Earned</p>
                <p className="text-2xl font-bold text-success mt-0.5 tabular-nums">${profile?.referralEarnings || 0}</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Claim Referral Box */}
        <div className="space-y-lg">
          <motion.div variants={slideUpVariants} className="bg-surface-1 border border-hairline rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Claim Referral</h3>
              <p className="text-xs text-text-secondary mt-1 leading-normal">
                Were you invited by another developer? Enter their referral code to credit them.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg flex gap-2 text-left items-start">
                <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-danger leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg flex gap-2 text-left items-start">
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-success leading-relaxed">{successMessage}</p>
              </div>
            )}

            {profile?.referredBy ? (
              <div className="p-4 bg-success/5 border border-success/20 rounded-xl text-center flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-success" />
                <p className="text-xs font-bold text-text-primary">Referral Status Active</p>
                <p className="text-[10px] text-text-secondary leading-normal">
                  You successfully verified your onboarding referral and rewarded your referrer!
                </p>
              </div>
            ) : (
              <form onSubmit={handleClaimReferral} className="space-y-3">
                <div>
                  <label className="text-[9px] font-bold text-text-tertiary uppercase block mb-1">Friend's Referral Code</label>
                  <input
                    type="text"
                    placeholder="e.g. alex_c_48ef"
                    value={claimCode}
                    onChange={(e) => setClaimCode(e.target.value)}
                    disabled={submittingClaim}
                    required
                    className="w-full bg-surface-2 border border-hairline rounded-lg px-3 py-2.5 text-xs text-text-primary focus:outline-none focus:border-ai"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingClaim || !claimCode.trim()}
                  className="w-full py-2.5 bg-text-primary hover:bg-text-secondary text-canvas rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {submittingClaim ? "Validating code..." : "Submit Referral Claim"}
                </button>
              </form>
            )}
          </motion.div>
        </div>

      </div>

    </motion.div>
  );
}
