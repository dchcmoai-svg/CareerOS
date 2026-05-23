"use client";

import React from "react";
import { Clock, AlertTriangle, CalendarDays, ArrowRight } from "lucide-react";

export function FocusModeStrip() {
  return (
    <div className="w-full flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      
      {/* Priority Action */}
      <div className="flex-1 min-w-[280px] bg-surface-1 border border-hairline rounded-lg p-3 flex items-start gap-3 hover:bg-surface-2 cursor-pointer transition-colors">
        <div className="mt-0.5 p-1.5 rounded-md bg-warning/10 border border-warning/20 text-warning">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-[13px] font-semibold text-text-primary mb-1">Stalled Pipeline</h4>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            2 applications have exceeded historical recruiter response times.
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-text-primary hover:text-warning transition-colors">
            Draft follow-up emails <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Upcoming Event */}
      <div className="flex-1 min-w-[280px] bg-surface-1 border border-hairline rounded-lg p-3 flex items-start gap-3 hover:bg-surface-2 cursor-pointer transition-colors">
        <div className="mt-0.5 p-1.5 rounded-md bg-ai/10 border border-ai/20 text-ai">
          <CalendarDays className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-[13px] font-semibold text-text-primary mb-1">Upcoming Interview</h4>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Stripe (System Design) in 48 hours.
          </p>
          <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-text-primary hover:text-ai transition-colors">
            Generate prep guide <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="flex-1 min-w-[280px] bg-surface-1 border border-hairline rounded-lg p-3 flex items-start gap-3 hover:bg-surface-2 cursor-pointer transition-colors">
        <div className="mt-0.5 p-1.5 rounded-md bg-surface-3 border border-hairline text-text-secondary">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-[13px] font-semibold text-text-primary mb-1">Velocity Metrics</h4>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Your ATS alignment &gt;85% is yielding a 40% interview conversion rate.
          </p>
        </div>
      </div>

    </div>
  );
}
