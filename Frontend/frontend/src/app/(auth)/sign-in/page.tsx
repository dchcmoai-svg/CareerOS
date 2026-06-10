"use client";

import React, { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, AlertTriangle, User, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { landing, nav } from "@/lib/copy";

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Could not start OAuth flow. Check provider credentials.",
  OAuthCallback: "OAuth callback failed. Verify redirect URIs match exactly.",
  OAuthCreateAccount: "Could not create account. Try again.",
  Callback: "Authentication callback error.",
  AccessDenied: "Access denied. You may have cancelled sign-in.",
  Configuration: "Server auth misconfiguration. Check NEXTAUTH_SECRET and provider keys.",
  Default: "Authentication failed. Please try again.",
};

function SignInContent() {
  const searchParams = useSearchParams();
  const authStatus = useAuthStatus();
  const error = searchParams.get("error");

  // Developer Credentials state
  const [email, setEmail] = useState("candidate@careeros.dev");
  const [name, setName] = useState("Alex Candidate");
  const [devRole, setDevRole] = useState<"candidate" | "recruiter">("candidate");
  const [submittingDev, setSubmittingDev] = useState(false);

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/onboarding" });
  };

  const handleDevSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingDev(true);
    signIn("credentials", {
      email,
      name,
      role: devRole,
      callbackUrl: "/onboarding",
    });
  };

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col items-center justify-center relative overflow-hidden py-12">
      <div className="absolute inset-0 mesh-gradient-hero pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 flex flex-col items-center px-lg"
      >
        <Link href="/" className="w-12 h-12 bg-surface-1 border border-hairline rounded-xl flex items-center justify-center mb-6 hover:border-border-strong transition-colors">
          <Sparkles className="w-5 h-5 text-ai" />
        </Link>

        <h1 className="text-3xl font-semibold tracking-[-0.02em] mb-2 text-center">
          Welcome back
        </h1>
        <p className="text-text-secondary text-[15px] mb-4 text-center max-w-sm leading-relaxed">
          {landing.subheadline}
        </p>

        {error && (
          <div className="w-full mb-4 p-3 bg-danger/10 border border-danger/20 rounded-lg flex gap-2 text-left">
            <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-danger leading-relaxed">
              {ERROR_MESSAGES[error] || ERROR_MESSAGES.Default}
            </p>
          </div>
        )}

        {/* Developer Mock Sign-In Card */}
        <div className="w-full bg-surface-1 border border-hairline rounded-2xl p-5 mb-5 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3 text-xs font-bold uppercase tracking-wider text-ai">
            <ShieldCheck className="w-4 h-4" />
            <span>Developer Sandbox Sign-In</span>
          </div>
          <p className="text-[11px] text-text-secondary mb-4 leading-normal">
            For local testing, log in directly as a Candidate or Recruiter/Company. No OAuth keys required!
          </p>
          <form onSubmit={handleDevSignIn} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-text-tertiary uppercase block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-surface-2 border border-hairline rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-ai"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-tertiary uppercase block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Auto-suggest role based on email if appropriate
                  if (e.target.value.includes("recruiter") || e.target.value.includes("company")) {
                    setDevRole("recruiter");
                  } else if (e.target.value.includes("candidate") || e.target.value.includes("user")) {
                    setDevRole("candidate");
                  }
                }}
                required
                className="w-full bg-surface-2 border border-hairline rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-ai"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-tertiary uppercase block mb-1">Operating Mode</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setDevRole("candidate");
                    if (name === "Alex Recruiter") setName("Alex Candidate");
                    if (email === "recruiter@careeros.dev") setEmail("candidate@careeros.dev");
                  }}
                  className={`py-2 rounded-lg border text-[11px] font-bold transition-all ${
                    devRole === "candidate"
                      ? "bg-primary/5 text-primary border-primary"
                      : "bg-surface-2 border-hairline text-text-secondary hover:bg-surface-3"
                  }`}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDevRole("recruiter");
                    if (name === "Alex Candidate") setName("Alex Recruiter");
                    if (email === "candidate@careeros.dev") setEmail("recruiter@careeros.dev");
                  }}
                  className={`py-2 rounded-lg border text-[11px] font-bold transition-all ${
                    devRole === "recruiter"
                      ? "bg-ai/5 text-ai border-ai"
                      : "bg-surface-2 border-hairline text-text-secondary hover:bg-surface-3"
                  }`}
                >
                  Recruiter / Company
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={submittingDev}
              className="w-full py-2.5 mt-2 bg-text-primary hover:bg-text-secondary text-canvas rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              {submittingDev ? "Signing in..." : "Sandbox Enter"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* OAuth Sections (shown below sandbox options) */}
        {authStatus.ready && (
          <div className="w-full space-y-3 mt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-hairline"></div>
              <span className="flex-shrink mx-4 text-[10px] text-text-tertiary font-bold uppercase">Or Continue With</span>
              <div className="flex-grow border-t border-hairline"></div>
            </div>

            <div className="w-full flex flex-col gap-3">
              {authStatus.configured.google && (
                <button
                  onClick={() => handleOAuthSignIn("google")}
                  className="w-full h-12 bg-surface-1 hover:bg-surface-2 border border-hairline rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.98] hover:border-border-strong"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              )}

              {authStatus.configured.linkedin && (
                <button
                  onClick={() => handleOAuthSignIn("linkedin")}
                  className="w-full h-12 bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 border border-[#0a66c2]/30 rounded-lg font-medium text-sm flex items-center justify-center gap-3 text-[#0a66c2] transition-all duration-150 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Continue with LinkedIn
                </button>
              )}

              {authStatus.configured.github && (
                <button
                  onClick={() => handleOAuthSignIn("github")}
                  className="w-full h-12 bg-surface-1 hover:bg-surface-2 border border-hairline rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12" />
                  </svg>
                  Continue with GitHub
                </button>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-[10px] text-text-tertiary max-w-xs leading-relaxed">
          CareerOS local sandbox environment. Sign in as Candidate or Recruiter.
        </p>

        <div className="mt-8 text-center text-sm text-text-secondary">
          New to CareerOS?{" "}
          <Link href="/sign-up" className="text-ai hover:text-ai-hover font-semibold inline-flex items-center gap-1">
            Enter ecosystem <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <SignInContent />
    </Suspense>
  );
}
