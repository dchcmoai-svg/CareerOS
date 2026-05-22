import { NextResponse } from "next/server";
import { getAuthServerSession } from "@/lib/auth";
import { initializeUserProfile, getUserProfile } from "@/lib/profile-store";

export async function POST() {
  const session = await getAuthServerSession();

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await initializeUserProfile({
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      provider: session.user.provider || "unknown",
    });

    return NextResponse.json({
      profile,
      initialized: true,
      message: "Identity graph, preferences, visibility, and AI continuity initialized.",
    });
  } catch (error) {
    console.error("[api/user/initialize]", error);
    return NextResponse.json({ error: "Initialization failed" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getAuthServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getUserProfile(session.user.id);
  return NextResponse.json({
    exists: !!profile,
    onboardingComplete: profile?.onboardingComplete ?? false,
    profileInitialized: !!profile,
  });
}
