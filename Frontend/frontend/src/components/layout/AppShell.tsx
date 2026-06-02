"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandMenu } from "../command/CommandMenu";
import { IntelligencePanel } from "@/components/intelligence/IntelligencePanel";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShellUIProvider, useShellUI } from "@/lib/ShellUIContext";
import { springs } from "@/lib/motion";
import { GlobalIntelligenceLayer } from "@/components/intelligence/GlobalIntelligenceLayer";
import { usePageIntelligence } from "@/hooks/usePageIntelligence";

interface AppShellProps {
  children: React.ReactNode;
}

function AppShellInner({ children }: AppShellProps) {
  const pathname = usePathname();
  const { isAgentOpen, setAgentOpen } = useShellUI();
  usePageIntelligence();

  return (
    <div className="flex h-screen w-full bg-canvas text-text-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)]">
        <Topbar />
        <GlobalIntelligenceLayer />
        <main className="flex-1 overflow-hidden relative flex min-h-0">
          <div className="flex-1 relative overflow-y-auto overflow-x-hidden min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
                transition={springs.panel}
                className="absolute inset-0 overflow-y-auto px-lg max-w-[1400px] 2xl:max-w-[1600px] mx-auto w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden lg:block h-full">
            <IntelligencePanel isOpen={isAgentOpen} onClose={() => setAgentOpen(false)} variant="docked" />
          </div>
          <div className="lg:hidden">
            <IntelligencePanel
              isOpen={isAgentOpen}
              onClose={() => setAgentOpen(false)}
              variant="overlay"
            />
          </div>
        </main>
      </div>

      <CommandMenu />
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ShellUIProvider>
      <AppShellInner>{children}</AppShellInner>
    </ShellUIProvider>
  );
}
