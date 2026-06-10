import { NextRequest, NextResponse } from "next/server";
import { getAuthServerSession } from "@/lib/auth";
import { getUserProfile, saveUserProfile } from "@/lib/profile-store";
import fs from "fs/promises";
import path from "path";
import { UserProfile } from "@/lib/profile-types";

export async function POST(request: NextRequest) {
  const session = await getAuthServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { referralCode } = body;

    if (!referralCode) {
      return NextResponse.json({ error: "Missing referral code" }, { status: 400 });
    }

    const currentProfile = await getUserProfile(session.user.id);
    if (!currentProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (currentProfile.role !== "candidate") {
      return NextResponse.json({ error: "Only candidates can claim referrals" }, { status: 403 });
    }

    if (currentProfile.referredBy) {
      return NextResponse.json({ error: "You have already claimed a referral" }, { status: 400 });
    }

    if (currentProfile.referralCode === referralCode) {
      return NextResponse.json({ error: "You cannot refer yourself" }, { status: 400 });
    }

    // Find the referrer by code
    const DATA_DIR = path.join(process.cwd(), ".data", "users");
    const files = await fs.readdir(DATA_DIR);
    let referrerProfile: UserProfile | null = null;

    for (const file of files) {
      if (file.endsWith(".json")) {
        try {
          const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
          const p = JSON.parse(raw) as UserProfile;
          if (p.referralCode === referralCode) {
            referrerProfile = p;
            break;
          }
        } catch {}
      }
    }

    if (!referrerProfile) {
      return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
    }

    // Award bonus to referrer
    referrerProfile.referredUsersCount = (referrerProfile.referredUsersCount || 0) + 1;
    referrerProfile.referralEarnings = (referrerProfile.referralEarnings || 0) + 50;
    await saveUserProfile(referrerProfile);

    // Update candidate
    currentProfile.referredBy = referrerProfile.userId;
    const updatedProfile = await saveUserProfile(currentProfile);

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("[api/user/referral]", error);
    return NextResponse.json({ error: "Failed to process referral" }, { status: 500 });
  }
}
