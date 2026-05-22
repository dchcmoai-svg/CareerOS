"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "intelligence";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

export function TactileButton({
  variant = "secondary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading,
  children,
  className,
  disabled,
  ...props
}: TactileButtonProps) {
  const variants = {
    primary:
      "bg-text-primary text-canvas hover:bg-text-secondary border-transparent shadow-[0_1px_0_rgba(255,255,255,0.1)_inset] hover:shadow-[0_8px_28px_-8px_rgba(118,132,240,0.35)]",
    secondary: "bg-surface-2 text-text-primary hover:bg-surface-3 border-hairline",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2 border-transparent",
    intelligence: "bg-ai/10 text-ai hover:bg-ai/20 border-ai/20",
  };

  const sizes = {
    sm: "h-8 px-sm text-[11px] gap-1.5",
    md: "h-9 px-md text-[12px] gap-2",
    lg: "h-11 px-lg text-[13px] gap-2",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-md border transition-colors duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ai/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...(props as object)}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-3.5 h-3.5 opacity-80" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="w-3.5 h-3.5 opacity-80" />}
        </>
      )}
    </motion.button>
  );
}
