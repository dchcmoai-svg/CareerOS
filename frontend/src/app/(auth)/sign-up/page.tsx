"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Shield, Zap } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { product, landing } from "@/lib/copy";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary flex relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient-hero pointer-events-none" />

      {/* Left: Story */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-xxl relative z-10 border-r border-hairline">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-xs mb-xl">
            <div className="w-8 h-8 bg-ai rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-canvas" />
            </div>
            <span className="font-bold tracking-tight">CareerOS</span>
          </div>
          <h1 className="text-display text-4xl font-semibold text-text-primary max-w-md mb-md">
            {landing.headline}
          </h1>
          <p className="text-text-secondary text-[15px] leading-relaxed max-w-sm mb-xl">
            {product.description}
          </p>
          <div className="flex flex-col gap-md">
            {[
              { icon: Shield, text: "Clear explanations — no dark patterns" },
              { icon: Zap, text: "Quick setup — no 50-field forms" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-sm text-[13px] text-text-secondary">
                <div className="w-7 h-7 rounded-md bg-surface-2 border border-hairline flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-ai" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: Auth */}
      <div className="flex-1 flex flex-col items-center justify-center px-lg py-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-xs mb-8 justify-center">
            <div className="w-8 h-8 bg-ai rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-canvas" />
            </div>
            <span className="font-bold">CareerOS</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight mb-2 text-center lg:text-left">
            Enter the ecosystem
          </h2>
          <p className="text-text-secondary text-[14px] mb-4 text-center lg:text-left">
            Connect your professional identity. Onboarding hydrates your graph in under 60 seconds.
          </p>
          <p className="text-[11px] text-text-tertiary mb-8 text-center lg:text-left font-mono">
            OAuth only → Identity graph → Dashboard OS
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
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

            <button
              onClick={() => signIn("linkedin", { callbackUrl: "/onboarding" })}
              className="w-full h-12 bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 border border-[#0a66c2]/30 rounded-lg font-medium text-sm flex items-center justify-center gap-3 text-[#0a66c2] transition-all duration-150 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Continue with LinkedIn
            </button>

            <button
              onClick={() => signIn("github", { callbackUrl: "/onboarding" })}
              className="w-full h-12 bg-surface-1 hover:bg-surface-2 border border-hairline rounded-lg font-medium text-sm flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-[11px] text-text-tertiary leading-relaxed">
            By continuing, you agree to our Terms and Privacy Policy.
            CareerOS uses OAuth only — we never store your passwords.
          </p>

          <div className="mt-8 text-center text-sm text-text-secondary">
            Already operating?{" "}
            <Link href="/sign-in" className="text-ai hover:text-ai-hover font-semibold inline-flex items-center gap-1">
              Sign in <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
