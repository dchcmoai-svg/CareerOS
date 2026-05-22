"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

export interface Capability {
  title: string;
  description: string;
  metric?: string;
  icon: LucideIcon;
}

export function SystemCapabilityGrid({ capabilities }: { capabilities: Capability[] }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="grid md:grid-cols-2 gap-md mb-xxl"
    >
      {capabilities.map((cap) => {
        const Icon = cap.icon;
        return (
          <motion.div
            key={cap.title}
            variants={staggerItem}
            className="bg-surface-1 border border-hairline rounded-lg p-lg surface-elevated hover:border-border-strong transition-colors"
          >
            <div className="flex items-start justify-between mb-md">
              <div className="w-10 h-10 rounded-lg bg-surface-2 border border-hairline flex items-center justify-center">
                <Icon className="w-5 h-5 text-ai" />
              </div>
              {cap.metric && (
                <span className="text-[11px] font-bold text-ai font-mono tabular-nums">{cap.metric}</span>
              )}
            </div>
            <h3 className="text-[15px] font-semibold text-text-primary mb-xs tracking-tight">{cap.title}</h3>
            <p className="text-[13px] text-text-secondary leading-relaxed">{cap.description}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
