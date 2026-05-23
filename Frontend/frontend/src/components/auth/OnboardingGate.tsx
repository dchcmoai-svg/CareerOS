"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ecosystem/Skeleton";

interface OnboardingGateProps {
  children: React.ReactNode;
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "authenticated") return;

    const isOnboarding = pathname.startsWith("/onboarding");
    const complete = session?.onboardingComplete;

    if (!complete && !isOnboarding) {
      router.replace("/onboarding");
    } else if (complete && isOnboarding) {
      router.replace("/dashboard");
    }
  }, [status, session?.onboardingComplete, pathname, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  return <>{children}</>;
}
