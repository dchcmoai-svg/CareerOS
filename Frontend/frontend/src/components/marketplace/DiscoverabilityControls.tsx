"use client";

import React, { useState } from "react";
import { ShieldCheck, EyeOff, Building2, BadgeDollarSign, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function DiscoverabilityControls() {
  const [stealthMode, setStealthMode] = useState(false);

  return (
    <div className="w-full bg-surface-1 border border-hairline rounded-lg p-lg shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="w-5 h-5 text-text-primary" />
        <h2 className="text-base font-bold text-text-primary tracking-tight">Trust & Discoverability</h2>
      </div>

      <div className="space-y-6">
        
        {/* Stealth Mode Master Toggle */}
        <div className="flex items-start justify-between pb-6 border-b border-hairline">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <EyeOff className="w-4 h-4 text-text-secondary" />
              <h3 className="text-[14px] font-semibold text-text-primary">Global Stealth Mode</h3>
            </div>
            <p className="text-[12px] text-text-secondary max-w-[400px] leading-relaxed">
              When active, your profile is entirely hidden from the talent graph. You can still apply to jobs and use the Tracker, but recruiters cannot surface you.
            </p>
          </div>
          <button 
            onClick={() => setStealthMode(!stealthMode)}
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 mt-1",
              stealthMode ? "bg-ai" : "bg-surface-3"
            )}
          >
            <span className={cn(
              "absolute top-0.5 left-0.5 bg-canvas w-4 h-4 rounded-full transition-transform duration-200 shadow-sm",
              stealthMode ? "translate-x-5" : "translate-x-0"
            )} />
          </button>
        </div>

        {/* Operational Toggles */}
        <div className="grid grid-cols-2 gap-4">
          
          <div className="bg-surface-2 border border-hairline rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-3.5 h-3.5 text-text-tertiary" />
              <h4 className="text-[12px] font-bold text-text-primary">Block Employer</h4>
            </div>
            <p className="text-[11px] text-text-tertiary mb-3">Stripe recruiters cannot see you.</p>
            <button className="text-[11px] font-bold bg-surface-3 px-2 py-1 rounded hover:bg-surface-4 active:scale-[0.98] transition-all">Edit Blocklist</button>
          </div>

          <div className="bg-surface-2 border border-hairline rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-3.5 h-3.5 text-text-tertiary" />
              <h4 className="text-[12px] font-bold text-text-primary">Stage Visibility</h4>
            </div>
            <p className="text-[11px] text-text-tertiary mb-3">Visible to Series B & Enterprise.</p>
            <button className="text-[11px] font-bold bg-surface-3 px-2 py-1 rounded hover:bg-surface-4 active:scale-[0.98] transition-all">Adjust Stages</button>
          </div>

          <div className="bg-surface-2 border border-hairline rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <BadgeDollarSign className="w-3.5 h-3.5 text-text-tertiary" />
              <h4 className="text-[12px] font-bold text-text-primary">Salary Enforcement</h4>
            </div>
            <p className="text-[11px] text-text-tertiary mb-3">Strictly blocking &lt; $180k offers.</p>
            <button className="text-[11px] font-bold bg-surface-3 px-2 py-1 rounded hover:bg-surface-4 active:scale-[0.98] transition-all">Modify Threshold</button>
          </div>

          <div className="bg-surface-2 border border-hairline rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-3.5 h-3.5 text-text-tertiary" />
              <h4 className="text-[12px] font-bold text-text-primary">Geo Focus</h4>
            </div>
            <p className="text-[11px] text-text-tertiary mb-3">Remote & SF Bay Area only.</p>
            <button className="text-[11px] font-bold bg-surface-3 px-2 py-1 rounded hover:bg-surface-4 active:scale-[0.98] transition-all">Update Geo</button>
          </div>

        </div>
      </div>
    </div>
  );
}
