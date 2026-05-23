"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  Briefcase,
  KanbanSquare,
  FileText,
  Settings,
  Globe,
  User,
  BookOpen,
  LayoutDashboard,
  Bell,
  GitBranch,
  Zap,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShellUI } from "@/lib/ShellUIContext";
import { nav, command as cmdCopy } from "@/lib/copy";

const AI_WORKFLOWS = [
  { label: "What should I focus on today?", command: "priorities", icon: Zap },
  { label: "Summarize my job search", command: "summary", icon: Sparkles },
  { label: "Draft follow-up for stalled applications", command: "followup", icon: KanbanSquare },
  { label: "Improve resume for top match", command: "resume-top", icon: FileText },
  { label: "Review profile visibility", command: "visibility", icon: Eye },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setAgentOpen } = useShellUI();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("careeros:open-command", onOpen);
    return () => window.removeEventListener("careeros:open-command", onOpen);
  }, []);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-canvas/85 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="relative z-50 w-full max-w-2xl overflow-hidden rounded-xl border border-hairline glass-panel surface-elevated shadow-[0_0_100px_-24px_rgba(118,132,240,0.35)]"
          >
            <Command className="flex w-full flex-col text-text-primary" onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
              <div className="flex items-center border-b border-hairline px-4" cmdk-input-wrapper="">
                <Search className="mr-3 h-4 w-4 text-ai" />
                <Command.Input
                  autoFocus
                  placeholder={cmdCopy.placeholder}
                  className="flex h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-text-tertiary"
                />
              </div>
              <Command.List className="max-h-[420px] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-text-secondary">
                  {cmdCopy.empty}
                </Command.Empty>

                <Command.Group heading={cmdCopy.navigate} className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
                  {[
                    { label: nav.dashboard, href: "/dashboard", icon: LayoutDashboard },
                    { label: nav.jobs, href: "/jobs", icon: Briefcase },
                    { label: nav.tracker, href: "/tracker", icon: KanbanSquare },
                    { label: nav.resume, href: "/resume", icon: FileText },
                    { label: nav.marketplace, href: "/marketplace", icon: Globe },
                    { label: nav.profile, href: "/profile", icon: User },
                    { label: nav.alerts, href: "/notifications", icon: Bell },
                    { label: nav.settings, href: "/settings", icon: Settings },
                  ].map((item) => (
                    <Command.Item
                      key={item.href}
                      onSelect={() => runCommand(() => router.push(item.href))}
                      className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-sm aria-selected:bg-surface-3"
                    >
                      <item.icon className="mr-3 h-4 w-4 text-ai" />
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading={cmdCopy.assistant} className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-tertiary mt-2">
                  {AI_WORKFLOWS.map((w) => (
                    <Command.Item
                      key={w.command}
                      onSelect={() => runCommand(() => setAgentOpen(true))}
                      className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm aria-selected:bg-surface-3"
                    >
                      <div className="flex items-center">
                        <w.icon className="mr-3 h-4 w-4 text-intelligence" />
                        {w.label}
                      </div>
                      <code className="text-[10px] text-text-tertiary font-mono">{w.command}</code>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-tertiary mt-2">
                  <Command.Item
                    onSelect={() => runCommand(() => setAgentOpen(true))}
                    className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-sm aria-selected:bg-surface-3"
                  >
                    <Sparkles className="mr-3 h-4 w-4 text-ai" />
                    Open career assistant
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/resume"))}
                    className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-sm aria-selected:bg-surface-3"
                  >
                    <GitBranch className="mr-3 h-4 w-4 text-warning" />
                    Choose resume version
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand(() => router.push("/docs"))}
                    className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-sm aria-selected:bg-surface-3"
                  >
                    <BookOpen className="mr-3 h-4 w-4 text-text-secondary" />
                    Help & documentation
                  </Command.Item>
                </Command.Group>
              </Command.List>
              <div className="px-4 py-2 border-t border-hairline flex items-center justify-between text-[10px] text-text-tertiary">
                <span className="flex items-center gap-2">
                  <Search className="w-3 h-3" /> Quick search across CareerOS
                </span>
                <span>
                  <kbd className="px-1 bg-surface-3 border border-hairline rounded">esc</kbd> close
                </span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
