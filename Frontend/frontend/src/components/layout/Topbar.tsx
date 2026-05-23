"use client";

import React, { useState } from "react";
import { Search, Bell, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NotificationCenter } from "../notifications/NotificationCenter";
import { Sparkles } from "lucide-react";
import { useShellUI } from "@/lib/ShellUIContext";

export function Topbar() {
  const { data: session } = useSession();
  const { profile, isHydrated } = useUserEcosystem();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isAgentOpen, toggleAgent } = useShellUI();

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "ME";

  return (
    <header className="h-14 bg-canvas border-b border-hairline flex items-center justify-between px-lg flex-shrink-0 relative z-30">
      <div className="flex-1 flex items-center gap-md">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("careeros:open-command"))}
          className="flex items-center gap-xs text-text-tertiary hover:text-text-secondary transition-all duration-150 active:scale-[0.98] text-[13px] px-sm py-1.5 rounded-md bg-surface-1 border border-hairline hover:bg-surface-2 hover:border-border-strong w-full max-w-[320px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] group"
        >
          <Search className="w-3.5 h-3.5 group-hover:text-text-secondary transition-colors" />
          <span className="text-text-tertiary group-hover:text-text-secondary transition-colors">Search opportunities or commands...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="text-[10px] bg-surface-3 px-1.5 py-0.5 rounded text-text-tertiary border border-hairline">⌘</kbd>
            <kbd className="text-[10px] bg-surface-3 px-1.5 py-0.5 rounded text-text-tertiary border border-hairline">K</kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-sm">
        <button
          type="button"
          onClick={toggleAgent}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-md border transition-all active:scale-[0.95]",
            isAgentOpen
              ? "bg-ai/10 border-ai/30 text-ai"
              : "border-hairline text-text-tertiary hover:bg-surface-2 hover:text-text-primary"
          )}
          aria-label="Toggle intelligence panel"
        >
          <Sparkles className="w-4 h-4" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "text-text-tertiary hover:text-text-primary transition-all duration-150 active:scale-[0.95] relative w-8 h-8 flex items-center justify-center rounded-md",
              showNotifications ? "bg-surface-2 text-text-primary" : "hover:bg-surface-2"
            )}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ai rounded-full border-[1.5px] border-canvas animate-pulse" />
          </button>
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute right-0 top-full mt-2 z-50"
                >
                  <NotificationCenter onClose={() => setShowNotifications(false)} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-surface-2 transition-all duration-150 active:scale-[0.98]"
          >
            <div className="w-7 h-7 rounded-full bg-surface-3 border border-hairline overflow-hidden flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              {session?.user?.image ? (
                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-semibold text-text-secondary">{userInitials}</span>
              )}
            </div>
            <ChevronDown className={cn("w-3 h-3 text-text-tertiary transition-transform", showUserMenu && "rotate-180")} />
          </button>
          <AnimatePresence>
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-surface-2 border border-hairline rounded-lg shadow-xl z-50 overflow-hidden surface-elevated"
                >
                  {(session?.user || profile) && (
                    <div className="px-md py-sm border-b border-hairline">
                      <p className="text-[13px] font-semibold text-text-primary truncate">
                        {profile?.name || session?.user?.name || "Operator"}
                      </p>
                      <p className="text-[11px] text-text-tertiary truncate">
                        {session?.user?.email}
                        {isHydrated && profile?.identity.githubConnected && " · GitHub linked"}
                      </p>
                    </div>
                  )}
                  <div className="p-1">
                    <Link href="/profile" onClick={() => setShowUserMenu(false)} className="flex items-center gap-sm px-sm py-2 rounded-md text-[13px] text-text-secondary hover:bg-surface-3 hover:text-text-primary transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link href="/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-sm px-sm py-2 rounded-md text-[13px] text-text-secondary hover:bg-surface-3 hover:text-text-primary transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-sm px-sm py-2 rounded-md text-[13px] text-danger/80 hover:bg-danger/10 hover:text-danger transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
