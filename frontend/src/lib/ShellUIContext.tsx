"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ShellUIContextType {
  isAgentOpen: boolean;
  setAgentOpen: (open: boolean) => void;
  toggleAgent: () => void;
}

const ShellUIContext = createContext<ShellUIContextType | undefined>(undefined);

export function ShellUIProvider({ children }: { children: ReactNode }) {
  const [isAgentOpen, setAgentOpen] = useState(true);

  return (
    <ShellUIContext.Provider
      value={{
        isAgentOpen,
        setAgentOpen,
        toggleAgent: () => setAgentOpen((o) => !o),
      }}
    >
      {children}
    </ShellUIContext.Provider>
  );
}

export function useShellUI() {
  const ctx = useContext(ShellUIContext);
  if (!ctx) throw new Error("useShellUI must be used within ShellUIProvider");
  return ctx;
}
