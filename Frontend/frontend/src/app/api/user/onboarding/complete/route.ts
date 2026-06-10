import { NextRequest, NextResponse } from "next/server";
import { getAuthServerSession } from "@/lib/auth";
import { completeOnboardingWithRole } from "@/lib/profile-store";

export async function POST(request: NextRequest) {
  const session = await getAuthServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { role, referralCode } = body;

    const selectedRole = role === "recruiter" ? "recruiter" : "candidate";

    const profile = await completeOnboardingWithRole(
      session.user.id,
      selectedRole,
      referralCode
    );

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
