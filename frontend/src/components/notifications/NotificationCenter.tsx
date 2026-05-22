"use client";

import React from "react";
import { ShieldAlert, Sparkles, Briefcase, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NotificationCenterProps {
  onClose?: () => void;
}

const notifications = [
  {
    id: 1,
    type: "ATS",
    title: "Resume Score Drop",
    message: "ATS score for Senior Frontend Roles dropped below 80%.",
    time: "2m ago",
    icon: ShieldAlert,
    iconColor: "text-warning",
    unread: true,
  },
  {
    id: 2,
    type: "AI",
    title: "Ghost Job Detected",
    message: "3 roles hidden from Discovery with >80% ghost probability.",
    time: "1h ago",
    icon: Sparkles,
    iconColor: "text-ai",
    unread: true,
  },
  {
    id: 3,
    type: "Marketplace",
    title: "Recruiter Visibility",
    message: "Stripe recruiter viewed profile matching React Architecture.",
    time: "3h ago",
    icon: Eye,
    iconColor: "text-intelligence",
    unread: false,
  },
  {
    id: 4,
    type: "Tracker",
    title: "Pipeline Stalled",
    message: "No response from Acme Corp in 7 days. Follow-up recommended.",
    time: "5h ago",
    icon: Briefcase,
    iconColor: "text-warning",
    unread: true,
  },
  {
    id: 5,
    type: "Discovery",
    title: "High-Velocity Match",
    message: "New Stripe role: 94% fit, low ghost risk, fast hiring velocity.",
    time: "6h ago",
    icon: TrendingUp,
    iconColor: "text-success",
    unread: false,
  },
];

export function NotificationCenter({ onClose }: NotificationCenterProps) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="w-[380px] bg-surface-1 border border-hairline rounded-xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.5)] overflow-hidden surface-elevated">
      <div className="px-4 py-3 border-b border-hairline flex items-center justify-between bg-surface-2/50">
        <div>
          <span className="font-semibold text-sm tracking-tight">Operational Intelligence</span>
          {unreadCount > 0 && (
            <span className="ml-2 text-[10px] font-bold text-ai bg-ai/10 px-1.5 py-0.5 rounded">
              {unreadCount} new
            </span>
          )}
        </div>
        <button className="text-[11px] text-ai font-semibold hover:text-ai-hover transition-colors">
          Mark all read
        </button>
      </div>
      <div className="max-h-[320px] overflow-y-auto p-2 flex flex-col gap-0.5">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <button
              key={n.id}
              onClick={onClose}
              className="p-3 rounded-lg hover:bg-surface-2 cursor-pointer transition-colors flex gap-3 group text-left w-full"
            >
              <div className={cn("mt-0.5 w-8 h-8 rounded-md bg-surface-3 border border-hairline flex items-center justify-center flex-shrink-0", n.iconColor)}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5 gap-2">
                  <span className="text-[13px] font-medium text-text-primary truncate">{n.title}</span>
                  <span className="text-[10px] text-text-tertiary flex-shrink-0">{n.time}</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed line-clamp-2">{n.message}</p>
              </div>
              {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-ai flex-shrink-0 mt-2" />}
            </button>
          );
        })}
      </div>
      <div className="px-4 py-2.5 border-t border-hairline bg-surface-2/30">
        <Link
          href="/notifications"
          onClick={onClose}
          className="text-[11px] font-semibold text-ai hover:text-ai-hover transition-colors"
        >
          View all operational alerts →
        </Link>
      </div>
    </div>
  );
}
