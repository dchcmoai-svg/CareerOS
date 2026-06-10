"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserEcosystem } from "@/lib/UserEcosystemContext";
import { MissionControlDashboard } from "@/components/dashboard/MissionControlDashboard";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { profile, isHydrated } = useUserEcosystem();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && profile?.role === "recruiter") {
      router.replace("/command-center");
    }
  }, [isHydrated, profile, router]);

  const firstName =
    profile?.name?.split(" ")[0] || session?.user?.name?.split(" ")[0] || "there";

  if (!isHydrated && !session) {
    return (
      <div className="py-xl text-text-secondary text-sm">Loading mission control…</div>
    );
  }

  return <MissionControlDashboard userName={firstName} />;
}
  return <MissionControlDashboard userName={firstName} />;
}
