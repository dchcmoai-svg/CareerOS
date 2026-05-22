"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Skeleton } from "@/components/ecosystem/Skeleton";
import { Sparkles } from "lucide-react";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full bg-canvas items-center justify-center">
        <div className="flex flex-col items-center gap-md max-w-sm w-full px-lg">
          <div className="w-12 h-12 bg-ai/10 border border-ai/20 rounded-xl flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-ai" />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-semibold text-text-primary mb-1">Initializing session</p>
            <p className="text-[11px] text-text-tertiary">Verifying ecosystem credentials...</p>
          </div>
          <div className="w-full space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.replace(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    return null;
  }

  return <>{children}</>;
}
