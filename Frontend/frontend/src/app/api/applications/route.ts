import { NextRequest, NextResponse } from "next/server";
import { getAuthServerSession } from "@/lib/auth";
import { getStoreApplications, createStoreApplication, updateStoreApplicationStage } from "@/lib/applications-store";
import { getUserProfile } from "@/lib/profile-store";
import { getRecruiterJobs } from "@/lib/jobs-store";

export async function GET() {
  const session = await getAuthServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userProfile = await getUserProfile(session.user.id);
  const userRole = userProfile?.role || "candidate";

  const allApps = await getStoreApplications();

  // If recruiter, they can see all applications or filter by their job postings
  if (userRole === "recruiter") {
    return NextResponse.json({ applications: allApps });
  }

  // If candidate, only show their own applications
  const candidateApps = allApps.filter((app) => app.candidateId === session.user.id);
  return NextResponse.json({ applications: candidateApps });
}

export async function POST(request: NextRequest) {
  const session = await getAuthServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { jobId, company, role, resumeBranch, stage, candidateId } = body;

    // Standard Candidate Applying to a job
    if (!candidateId) {
      const profile = await getUserProfile(session.user.id);
      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }

      const app = await createStoreApplication({
        jobId: jobId || `job_${Math.random().toString(36).substring(2, 9)}`,
        candidateId: session.user.id,
        candidateName: profile.name || session.user.name || "Candidate",
        candidateEmail: profile.email || session.user.email || "",
        company: company || "Unknown Company",
        role: role || "Software Engineer",
        resumeBranch: resumeBranch || "main",
        stage: stage || "Applied",
      });

      return NextResponse.json({ success: true, application: app });
    } 
    
    // Recruiter inviting a Candidate to a job (Job Request)
    else {
      const recruiterProfile = await getUserProfile(session.user.id);
      if (recruiterProfile?.role !== "recruiter") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const candidateProfile = await getUserProfile(candidateId);
      if (!candidateProfile) {
        return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
      }

      // Create an application with stage "Applied" (or "Interviewing" or "Invited" / "Stalled")
      const app = await createStoreApplication({
        jobId: jobId || `job_${Math.random().toString(36).substring(2, 9)}`,
        candidateId: candidateId,
        candidateName: candidateProfile.name || "Candidate",
        candidateEmail: candidateProfile.email,
        company: company || recruiterProfile.name || "Recruiter Company",
        role: role || "Software Engineer",
        resumeBranch: "main",
        stage: "Applied", // Represents active pipeline candidate
      });

      return NextResponse.json({ success: true, application: app });
    }
  } catch (error) {
    console.error("[api/applications/POST]", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}

// PUT to update stages (e.g. for Recruiter Pipeline)
export async function PUT(request: NextRequest) {
  const session = await getAuthServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { applicationId, stage } = body;

    if (!applicationId || !stage) {
      return NextResponse.json({ error: "Missing applicationId or stage" }, { status: 400 });
    }

    const updated = await updateStoreApplicationStage(applicationId, stage);
    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("[api/applications/PUT]", error);
    return NextResponse.json({ error: "Failed to update application stage" }, { status: 500 });
  }
}
