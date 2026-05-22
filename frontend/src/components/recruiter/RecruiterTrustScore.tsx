"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, CheckCircle2 } from "lucide-react";

export function RecruiterTrustScore() {
  return (
    <div className="w-full bg-surface-1 border border-hairline rounded-lg p-md shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-hairline">
        <ShieldCheck className="w-4 h-4 text-success" />
        <h3 className="text-sm font-bold text-text-primary tracking-tight">Trust Infrastructure</h3>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5 text-[12px] font-bold text-text-primary">
            <span>Platform Standing</span>
            <span className="text-success">Excellent</span>
          </div>
          <p className="text-[11px] text-text-tertiary mb-3">
            Your high response rate guarantees maximum visibility to top-tier candidates on the Marketplace graph.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-text-secondary">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Response Rate</span>
            <span>94%</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-text-secondary">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-success" /> Avg Response Time</span>
            <span>12 hours</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-text-secondary">
            <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-warning" /> Ghosted Candidates</span>
            <span className="text-text-primary font-bold">1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
