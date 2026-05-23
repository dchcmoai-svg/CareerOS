import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { UserEcosystemProvider } from "@/lib/UserEcosystemContext";
import { AuthGate } from "@/components/auth/AuthGate";
import { OnboardingGate } from "@/components/auth/OnboardingGate";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <UserEcosystemProvider>
        <OnboardingGate>
          <AppShell>{children}</AppShell>
        </OnboardingGate>
      </UserEcosystemProvider>
    </AuthGate>
  );
}
