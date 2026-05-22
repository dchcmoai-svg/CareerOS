import { NextResponse } from "next/server";
import { getAuthServerSession } from "@/lib/auth";
import { completeOnboarding } from "@/lib/profile-store";

export async function POST() {
  const session = await getAuthServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await completeOnboarding(session.user.id);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      profile,
      onboardingComplete: true,
    });
  } catch (error) {
    console.error("[api/user/onboarding/complete]", error);
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
