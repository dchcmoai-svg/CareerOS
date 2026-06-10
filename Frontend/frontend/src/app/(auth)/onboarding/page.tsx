"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Briefcase, Building, AlertCircle, Loader2 } from "lucide-react";
import { slideUpVariants, staggerContainer } from "@/lib/motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OnboardingPage() {
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");
  const [initializing, setInitializing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
      return;
    }

    if (status === "authenticated") {
      // First, initialize the profile in filesystem if not exists
      fetch("/api/user/initialize", { method: "POST" })
        .then(() => setInitializing(false))
        .catch(() => setInitializing(false));
    }
  }, [status, router]);

  const handleCompleteOnboarding = async () => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/user/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to complete onboarding");
      }

      // Update session so middleware sees onboardingComplete = true
      await update({ onboardingComplete: true });
      
      // Let the browser session refresh properly before routing
      setTimeout(() => {
        if (role === "recruiter") {
          router.push("/command-center");
        } else {
          router.push("/dashboard");
        }
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  if (status === "loading" || initializing) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-ai border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient-hero pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg z-10 flex flex-col px-lg py-xl"
      >
        <div className="flex items-center gap-2.5 mb-6 justify-center">
          <div className="w-10 h-10 bg-surface-1 border border-hairline rounded-xl flex items-center justify-center surface-elevated">
            <Sparkles className="w-5 h-5 text-ai animate-pulse" />
          </div>
          <span className="text-lg font-bold tracking-tight">CareerOS Onboarding</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2 text-text-primary">
            Choose Your Operating Mode
          </h1>
          <p className="text-[13px] text-text-secondary max-w-sm mx-auto">
            Select how you want to interact with CareerOS. You can sign in as a candidate or a recruiter, not both.
          </p>
        </div>

        {errorMessage && (
          <div className="w-full mb-6 p-3 bg-danger/10 border border-danger/20 rounded-lg flex gap-2 text-left items-start">
            <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-danger leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Mode Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Candidate Card */}
          <div
            onClick={() => setRole("candidate")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex flex-col gap-3 relative overflow-hidden ${
              role === "candidate"
                ? "bg-primary/5 border-primary shadow-[0_0_12px_rgba(var(--color-primary),0.1)]"
                : "bg-surface-1 border-hairline hover:border-border-strong"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              role === "candidate" ? "bg-primary text-white" : "bg-surface-2 text-text-secondary"
            }`}>
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Job Candidate</h3>
              <p className="text-[11px] text-text-secondary mt-1 leading-normal">
                Search and apply for jobs, tailor your resume variants, and track your interviews in one dashboard.
              </p>
            </div>
            {role === "candidate" && (
              <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full" />
            )}
          </div>

          {/* Recruiter Card */}
          <div
            onClick={() => setRole("recruiter")}
            className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 flex flex-col gap-3 relative overflow-hidden ${
              role === "recruiter"
                ? "bg-ai/5 border-ai shadow-[0_0_12px_rgba(147,51,234,0.15)]"
                : "bg-surface-1 border-hairline hover:border-border-strong"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              role === "recruiter" ? "bg-ai text-white" : "bg-surface-2 text-text-secondary"
            }`}>
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Company / Recruiter</h3>
              <p className="text-[11px] text-text-secondary mt-1 leading-normal">
                Post job openings, scout candidate profiles completely, send interview invites, and track applicants.
              </p>
            </div>
            {role === "recruiter" && (
              <div className="absolute top-3 right-3 w-2 h-2 bg-ai rounded-full" />
            )}
          </div>
        </div>

        <button
          onClick={handleCompleteOnboarding}
          disabled={submitting}
          className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
            role === "recruiter"
              ? "bg-ai text-white hover:bg-ai-hover"
              : "bg-primary text-white hover:bg-primary-hover"
          } disabled:opacity-50`}
        >
          {submitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Initializing system...
            </>
          ) : (
            <>
              Activate CareerOS Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
