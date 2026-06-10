"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { layoutSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  KanbanSquare,
  FileText,
  Sparkles,
  Settings,
  Command,
  Network,
  User,
  Bell,
  Gift,
} from "lucide-react";
import { nav as navCopy } from "@/lib/copy";

const NAV_ITEMS = [
  { name: navCopy.dashboard, href: "/dashboard", icon: LayoutDashboard },
  { name: navCopy.jobs, href: "/jobs", icon: Briefcase },
  { name: navCopy.tracker, href: "/tracker", icon: KanbanSquare },
  { name: navCopy.resume, href: "/resume", icon: FileText },
  { name: navCopy.marketplace, href: "/marketplace", icon: Network },
  { name: "Referrals", href: "/referrals", icon: Gift },
];

const SECONDARY_ITEMS = [
  { name: navCopy.profile, href: "/profile", icon: User },
  { name: navCopy.alerts, href: "/notifications", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-[240px] h-full bg-surface-1 border-r border-hairline flex-shrink-0">
      <div className="h-14 flex items-center px-lg border-b border-hairline">
        <div className="flex items-center gap-xs text-text-primary font-semibold text-sm">
          <div className="w-5 h-5 bg-ai rounded flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-canvas" />
          </div>
          CareerOS
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-md px-sm flex flex-col gap-xxs">
        <span className="px-xs text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-1">{navCopy.workspace}</span>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex items-center gap-sm px-xs py-2 rounded-md text-[13px] font-medium transition-colors duration-150 active:scale-[0.98]",
                isActive ? "text-text-primary" : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-md bg-surface-3 border border-hairline/50 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]"
                  transition={layoutSpring}
                />
              )}
              <item.icon className={cn("relative z-10 w-4 h-4", isActive ? "opacity-100 text-ai" : "opacity-70")} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
        <div className="h-px bg-hairline my-sm mx-xs" />
        <span className="px-xs text-[10px] font-bold uppercase tracking-widest text-text-tertiary mb-1">Account</span>
        {SECONDARY_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex items-center gap-sm px-xs py-2 rounded-md text-[13px] font-medium transition-colors duration-150 active:scale-[0.98]",
                isActive ? "text-text-primary" : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active-secondary"
                  className="absolute inset-0 rounded-md bg-surface-3 border border-hairline/50"
                  transition={layoutSpring}
                />
              )}
              <item.icon className="relative z-10 w-4 h-4 opacity-70" />
              <span className="relative z-10">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-sm border-t border-hairline flex flex-col gap-xxs">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("careeros:open-command"))}
          className="flex items-center justify-between w-full px-xs py-2 rounded-md text-[13px] font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-all duration-75 active:scale-[0.98]"
        >
          <div className="flex items-center gap-sm">
            <Command className="w-4 h-4 opacity-70" />
            {navCopy.commandMenu}
          </div>
          <kbd className="text-[10px] bg-surface-3 px-1.5 py-0.5 rounded text-text-tertiary border border-hairline shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]">⌘K</kbd>
        </button>
        <Link
          href="/settings"
          className="flex items-center gap-sm px-xs py-2 rounded-md text-[13px] font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-all duration-75 active:scale-[0.98]"
        >
          <Settings className="w-4 h-4 opacity-70" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
