import { NextRequest, NextResponse } from "next/server";
import { getAuthServerSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile-store";
import { getRecruiterJobs, createRecruiterJob } from "@/lib/jobs-store";
import { getStoreApplications } from "@/lib/applications-store";

export async function GET() {
  const session = await getAuthServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userProfile = await getUserProfile(session.user.id);
  if (userProfile?.role !== "recruiter") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const jobs = await getRecruiterJobs();
    const apps = await getStoreApplications();

    // Map applicants to each job
    const jobsWithApplicants = jobs.map((job) => {
      const jobApplicants = apps.filter((app) => app.jobId === job.id);
      return {
        ...job,
        applicants: jobApplicants,
      };
    });

    return NextResponse.json({ jobs: jobsWithApplicants });
  } catch (error) {
    console.error("[api/recruiter/jobs/GET]", error);
    return NextResponse.json({ error: "Failed to fetch recruiter jobs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getAuthServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userProfile = await getUserProfile(session.user.id);
  if (userProfile?.role !== "recruiter") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { role, company, location, compensation, remote, category, description, url } = body;

    if (!role || !company || !location || !compensation || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newJob = await createRecruiterJob({
      role,
      company,
      location,
      compensation,
      remote: !!remote,
      category,
      description,
      url,
    });

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    console.error("[api/recruiter/jobs/POST]", error);
    return NextResponse.json({ error: "Failed to create job posting" }, { status: 500 });
  }
}
