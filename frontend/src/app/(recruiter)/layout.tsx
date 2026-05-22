import React from "react";
import { RecruiterAppShell } from "@/components/layout/RecruiterAppShell";
import { EcosystemProvider } from "@/lib/EcosystemContext";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EcosystemProvider>
      <RecruiterAppShell>{children}</RecruiterAppShell>
    </EcosystemProvider>
  );
}
