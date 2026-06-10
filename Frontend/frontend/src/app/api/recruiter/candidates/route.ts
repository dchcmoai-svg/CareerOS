import { NextResponse } from "next/server";
import { getAuthServerSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile-store";
import fs from "fs/promises";
import path from "path";
import { UserProfile } from "@/lib/profile-types";

const DATA_DIR = path.join(process.cwd(), ".data", "users");

export async function GET() {
  const session = await getAuthServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userProfile = await getUserProfile(session.user.id);
  if (userProfile?.role !== "recruiter") {
    return NextResponse.json({ error: "Forbidden — Recruiter access required" }, { status: 403 });
  }

  try {
    const files = await fs.readdir(DATA_DIR);
    const candidates: UserProfile[] = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        try {
          const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
          const profile = JSON.parse(raw) as UserProfile;
          if (profile.role === "candidate") {
            candidates.push(profile);
          }
        } catch (err) {
          console.error(`Error reading user profile file ${file}:`, err);
        }
      }
    }

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error("[api/recruiter/candidates]", error);
    // If directory doesn't exist yet, return empty
    return NextResponse.json({ candidates: [] });
  }
}
