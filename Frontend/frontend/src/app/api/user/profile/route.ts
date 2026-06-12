import { NextResponse } from "next/server";
import { getAuthServerSession } from "@/lib/auth";
import { getUserProfile, saveUserProfile } from "@/lib/profile-store";

export async function GET() {
  const session = await getAuthServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getUserProfile(session.user.id);

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

export async function POST(req: Request) {
  const session = await getAuthServerSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      settings,
      name,
      email,
      experienceList,
      educationList,
      projectsList,
      appDefaults,
      resumeFileName,
      resumeUploadedAt,
      coverLetterText
    } = await req.json();
    const profile = await getUserProfile(session.user.id);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (settings) {
      profile.settings = {
        ...profile.settings,
        ...settings,
      };
    }
    if (name !== undefined) profile.name = name;
    if (email !== undefined) profile.email = email;
    if (experienceList !== undefined) profile.experienceList = experienceList;
    if (educationList !== undefined) profile.educationList = educationList;
    if (projectsList !== undefined) profile.projectsList = projectsList;
    if (appDefaults !== undefined) profile.appDefaults = appDefaults;
    if (resumeFileName !== undefined) profile.resumeFileName = resumeFileName;
    if (resumeUploadedAt !== undefined) profile.resumeUploadedAt = resumeUploadedAt;
    if (coverLetterText !== undefined) profile.coverLetterText = coverLetterText;

    const updated = await saveUserProfile(profile);
    return NextResponse.json({ success: true, profile: updated });
  } catch (err) {
    console.error("[profile POST]", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
