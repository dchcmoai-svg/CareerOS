"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { premiumCardHover, springs } from "@/lib/motion";

interface LivingSurfaceProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  glow?: boolean;
  layoutId?: string;
}

export function LivingSurface({
  children,
  className,
  interactive = true,
  glow = false,
  layoutId,
}: LivingSurfaceProps) {
  const Component = layoutId ? motion.div : motion.div;

  return (
    <Component
      layoutId={layoutId}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springs.panel}
      {...(interactive ? premiumCardHover : {})}
      className={cn(
        "rounded-xl border border-hairline bg-surface-1 transition-colors duration-200",
        glow && "glow-border-subtle",
        interactive && "hover:bg-surface-1/90",
        className
      )}
    >
      {children}
    </Component>
  );
}
