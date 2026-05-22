"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { UserProfile } from "./profile-types";

interface UserEcosystemContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
  activeIntelligence: string | null;
  setActiveIntelligence: (insight: string | null) => void;
  refreshProfile: () => Promise<void>;
  completeOnboarding: () => Promise<boolean>;
}

const UserEcosystemContext = createContext<UserEcosystemContextType | undefined>(undefined);

export function UserEcosystemProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIntelligence, setActiveIntelligence] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        if (data.profile?.aiState?.lastContext) {
          setActiveIntelligence(data.profile.aiState.lastContext);
        }
        setIsHydrated(true);
      } else if (res.status === 404) {
        await fetch("/api/user/initialize", { method: "POST" });
        const retry = await fetch("/api/user/profile");
        if (retry.ok) {
          const data = await retry.json();
          setProfile(data.profile);
          setIsHydrated(true);
        }
      }
    } catch (err) {
      setError("Failed to load profile");
      console.error("[UserEcosystem]", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setIsLoading(false);
      setProfile(null);
      return;
    }
    if (status === "authenticated") {
      setIsLoading(true);
      refreshProfile();
    }
  }, [status, session?.user?.id, refreshProfile]);

  const completeOnboarding = useCallback(async () => {
    try {
      const res = await fetch("/api/user/onboarding/complete", { method: "POST" });
      if (!res.ok) return false;
      const data = await res.json();
      setProfile(data.profile);
      await update({ onboardingComplete: true });
      setActiveIntelligence(
        "Welcome to CareerOS. Your identity graph, preferences, and AI continuity layer are active."
      );
      return true;
    } catch {
      return false;
    }
  }, [update]);

  return (
    <UserEcosystemContext.Provider
      value={{
        profile,
        isLoading,
        isHydrated,
        error,
        activeIntelligence,
        setActiveIntelligence,
        refreshProfile,
        completeOnboarding,
      }}
    >
      {children}
    </UserEcosystemContext.Provider>
  );
}

export function useUserEcosystem() {
  const context = useContext(UserEcosystemContext);
  if (!context) {
    throw new Error("useUserEcosystem must be used within UserEcosystemProvider");
  }
  return context;
}

/** @deprecated Use useUserEcosystem — kept for gradual migration */
export function useEcosystem() {
  const ctx = useUserEcosystem();
  return {
    activeIntelligence: ctx.activeIntelligence,
    setActiveIntelligence: ctx.setActiveIntelligence,
  };
}

export function UserEcosystemProviderLegacy({ children }: { children: ReactNode }) {
  return <UserEcosystemProvider>{children}</UserEcosystemProvider>;
}
