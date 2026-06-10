"use client";

import React, { ReactNode, useState } from "react";
import { Topbar } from "./Topbar";
import { RightPanelAgent } from "../ai/RightPanelAgent";
import { Briefcase, Activity, CheckCircle, Shield, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ShellUIProvider, useShellUI } from "@/lib/ShellUIContext";

function RecruiterAppShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAgentOpen, setAgentOpen } = useShellUI();

  const navItems = [
    { name: "Command Center", href: "/command-center", icon: Activity },
    { name: "Talent Explorer", href: "/command-center/scout", icon: Search },
    { name: "Pipeline", href: "/command-center/pipeline", icon: Briefcase },
    { name: "Trust & Quality", href: "#", icon: Shield },
  ];

  return (
    <div className="flex h-screen bg-canvas overflow-hidden text-text-primary antialiased selection:bg-ai/30">
      
      {/* Recruiter Sidebar */}
      <aside className="w-[240px] border-r border-hairline bg-surface-1 flex flex-col z-20 shadow-[1px_0_10px_rgba(0,0,0,0.2)]">
        <div className="h-14 flex items-center px-4 border-b border-hairline shrink-0">
          <div className="w-5 h-5 bg-text-primary rounded-sm flex items-center justify-center mr-2">
            <span className="text-canvas text-[10px] font-bold">R</span>
          </div>
          <span className="font-bold tracking-tight text-sm">CareerOS <span className="text-ai">Recruiter</span></span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <span
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-all active:scale-[0.98]",
                    isActive
                      ? "bg-surface-2 text-text-primary shadow-sm border border-hairline"
                      : "text-text-secondary hover:bg-surface-2 hover:text-text-primary hover:border hover:border-hairline/50 border border-transparent"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-ai" : "text-text-tertiary")} />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Orchestration Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar />
        
        <main className="flex-1 overflow-hidden relative isolate">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="absolute inset-0 overflow-y-auto px-lg"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Persistent Recruiter Right Panel Agent */}
      <RightPanelAgent 
        isOpen={isAgentOpen} 
        onClose={() => setAgentOpen(false)} 
        context="global" 
      />
    </div>
  );
}

export function RecruiterAppShell({ children }: { children: ReactNode }) {
  return (
    <ShellUIProvider>
      <RecruiterAppShellInner>{children}</RecruiterAppShellInner>
    </ShellUIProvider>
  );
}
