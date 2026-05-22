import { NextResponse } from "next/server";
import { getAuthServerSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile-store";

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
