"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { slideUpVariants, staggerContainer } from "@/lib/motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { onboarding as onboardCopy } from "@/lib/copy";

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [initializing, setInitializing] = useState(true);
  const [profileReady, setProfileReady] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const steps = onboardCopy.steps.map((s, i) =>
    i === 0 ? { ...s, detail: session?.user?.email ?? s.detail } : s
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/sign-in");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/user/initialize", { method: "POST" })
        .then((res) => res.ok && setProfileReady(true))
        .finally(() => setInitializing(false));
    }
  }, [status, router]);

  useEffect(() => {
    if (initializing || step >= steps.length) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(timer);
  }, [step, initializing, steps.length]);

  const handleEnter = async () => {
    const res = await fetch("/api/user/onboarding/complete", { method: "POST" });
    if (res.ok) {
      await update({ onboardingComplete: true });
      router.push("/dashboard");
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
        className="w-full max-w-md z-10 flex flex-col items-center px-lg"
      >
        <div className="w-16 h-16 bg-surface-1 border border-hairline rounded-2xl flex items-center justify-center mb-6 surface-elevated">
          <Sparkles className="w-7 h-7 text-ai" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight mb-2 text-center">
          Setting up your career hub
        </h1>
        <p className="text-[13px] text-text-secondary mb-4 text-center">
          {session?.user?.name
            ? `Welcome, ${session.user.name.split(" ")[0]} — this only takes a moment.`
            : "Welcome — this only takes a moment."}
        </p>
        <div className="w-full h-1 bg-surface-2 rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-ai"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(100, ((step + 1) / steps.length) * 100)}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="w-full flex flex-col gap-3">
          {steps.map((item, index) => {
            const isActive = index === step;
            const isPast = index < step;

            return (
              <motion.div
                key={item.label}
                variants={slideUpVariants}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                  isActive
                    ? "border-ai bg-ai/5"
                    : isPast
                    ? "border-hairline bg-surface-1/50"
                    : "border-transparent opacity-40"
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                  {isPast ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-ai border-t-transparent rounded-full"
                    />
                  ) : (
                    <div className="w-2 h-2 bg-text-tertiary rounded-full" />
                  )}
                </div>
                <div>
                  <span className={`text-[14px] font-medium block ${isActive ? "text-text-primary" : "text-text-secondary"}`}>
                    {item.label}
                  </span>
                  {item.detail && isPast && (
                    <span className="text-[11px] text-text-tertiary">{item.detail}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {step >= steps.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col items-center gap-3 w-full"
          >
            {profileReady && (
              <p className="text-[11px] text-success text-center">{onboardCopy.welcome}</p>
            )}
            <button
              onClick={handleEnter}
              className="w-full px-8 py-3 bg-text-primary text-canvas rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-text-secondary transition-all active:scale-[0.98]"
            >
              {onboardCopy.enter} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
