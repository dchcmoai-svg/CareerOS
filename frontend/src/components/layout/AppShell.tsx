"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandMenu } from "../command/CommandMenu";
import { RightPanelAgent } from "../ai/RightPanelAgent";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShellUIProvider, useShellUI } from "@/lib/ShellUIContext";
import { springs } from "@/lib/motion";

interface AppShellProps {
  children: React.ReactNode;
}

function AppShellInner({ children }: AppShellProps) {
  const pathname = usePathname();
  const { isAgentOpen, setAgentOpen } = useShellUI();

  const getContext = () => {
    if (pathname.includes("/jobs")) return "discovery";
    if (pathname.includes("/tracker")) return "tracker";
    if (pathname.includes("/resume")) return "ats";
    if (pathname.includes("/marketplace")) return "marketplace";
    return "global";
  };

  return (
    <div className="flex h-screen w-full bg-canvas text-text-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.5)]">
        {/* Pass down toggle logic to Topbar if needed, omitted here for brevity */}
        <Topbar />
        <main className="flex-1 overflow-hidden relative flex">
          {/* Main Content Area */}
          <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={springs.panel}
                className="absolute inset-0 overflow-y-auto px-lg max-w-[1400px] 2xl:max-w-[1600px] mx-auto w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Persistent Contextual Intelligence Panel */}
          <RightPanelAgent 
            isOpen={isAgentOpen} 
            onClose={() => setAgentOpen(false)} 
            context={getContext()} 
          />
        </main>
      </div>
      
      {/* Universal Command System */}
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
