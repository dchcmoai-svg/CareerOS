"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Briefcase,
  KanbanSquare,
  FileText,
  Settings,
  Globe,
  User,
  BookOpen,
  LayoutDashboard,
  Bell,
  Zap,
  Target,
  MessageSquare,
  TrendingUp,
  GitBranch,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShellUI } from "@/lib/ShellUIContext";
import { nav, command as cmdCopy } from "@/lib/copy";
import { useCareerGraph } from "@/lib/career-graph";
import { buildCareerCommands } from "@/lib/career-graph/commands";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setAgentOpen } = useShellUI();
  const selectOpportunity = useCareerGraph((s) => s.selectOpportunity);
  const setActiveResumeVariant = useCareerGraph((s) => s.setActiveResumeVariant);
  const pushActivity = useCareerGraph((s) => s.pushActivity);

  const careerCommands = useMemo(() => buildCareerCommands(), []);

  const commandCtx = useMemo(
    () => ({
      router,
      setAgentOpen,
      selectOpportunity,
      setActiveResumeVariant,
      pushActivity,
    }),
    [router, setAgentOpen, selectOpportunity, setActiveResumeVariant, pushActivity]
  );

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

  const actionItems = careerCommands.filter((c) => c.group === "actions");
  const intelItems = careerCommands.filter((c) => c.group === "intelligence");

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-canvas/90 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="relative z-50 w-full max-w-xl overflow-hidden rounded-xl border border-hairline glass-panel surface-elevated shadow-[0_24px_80px_-32px_rgba(0,0,0,0.65)]"
          >
            <Command
              className="flex w-full flex-col text-text-primary"
              onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            >
              <div className="flex items-center border-b border-hairline px-4" cmdk-input-wrapper="">
                <Target className="mr-3 h-4 w-4 text-ai" />
                <Command.Input
                  autoFocus
                  placeholder={cmdCopy.placeholder}
                  className="flex h-12 w-full bg-transparent text-[14px] outline-none placeholder:text-text-tertiary"
                />
              </div>
              <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-text-secondary">
                  {cmdCopy.empty}
                </Command.Empty>

                <Command.Group
                  heading={cmdCopy.actions}
                  className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-tertiary"
                >
                  {actionItems.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.label} ${item.keywords.join(" ")}`}
                      onSelect={() => runCommand(() => item.run(commandCtx))}
                      className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm aria-selected:bg-surface-3"
                    >
                      <div className="flex items-center gap-3">
                        <Zap className="h-4 w-4 text-primary" />
                        {item.label}
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading={cmdCopy.intelligence}
                  className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-tertiary mt-2"
                >
                  {intelItems.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.label} ${item.keywords.join(" ")}`}
                      onSelect={() => runCommand(() => item.run(commandCtx))}
                      className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-sm aria-selected:bg-surface-3"
                    >
                      <Sparkles className="mr-3 h-4 w-4 text-intelligence" />
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading={cmdCopy.navigate}
                  className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-tertiary mt-2"
                >
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
                      value={item.label}
                      onSelect={() => runCommand(() => router.push(item.href))}
                      className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-sm aria-selected:bg-surface-3"
                    >
                      <item.icon className="mr-3 h-4 w-4 text-text-secondary" />
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group
                  heading="Shortcuts"
                  className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-tertiary mt-2"
                >
                  <Command.Item
                    onSelect={() => runCommand(() => setAgentOpen(true))}
                    className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-sm aria-selected:bg-surface-3"
                  >
                    <MessageSquare className="mr-3 h-4 w-4 text-ai" />
                    Open intelligence panel
                  </Command.Item>
                  <Command.Item
                    onSelect={() =>
                      runCommand(() => {
                        setActiveResumeVariant("rv-staff");
                        router.push("/resume");
                      })
                    }
                    className="flex cursor-pointer items-center rounded-md px-3 py-2.5 text-sm aria-selected:bg-surface-3"
                  >
                    <GitBranch className="mr-3 h-4 w-4 text-resume" />
                    Switch resume variant
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
                  <TrendingUp className="w-3 h-3" />
                  {cmdCopy.footer}
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 bg-surface-3 border border-hairline rounded font-mono">
                    ⌘K
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-surface-3 border border-hairline rounded font-mono">
                    esc
                  </kbd>
                </span>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
