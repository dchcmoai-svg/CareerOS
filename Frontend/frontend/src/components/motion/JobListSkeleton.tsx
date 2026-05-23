"use client";

import React from "react";
import { motion } from "framer-motion";

export function JobListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-xl border border-hairline bg-surface-1 p-4 overflow-hidden relative"
        >
          <div className="absolute inset-0 shimmer-sweep opacity-30" />
          <div className="h-4 w-2/3 bg-surface-3 rounded mb-3" />
          <div className="h-3 w-1/2 bg-surface-3/80 rounded mb-4" />
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-surface-3 rounded-full" />
            <div className="h-6 w-24 bg-surface-3 rounded-full" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
