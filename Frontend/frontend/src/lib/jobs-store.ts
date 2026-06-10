import fs from "fs/promises";
import path from "path";
import { JobApiRecord } from "./jobs-api";

const DATA_DIR = path.join(process.cwd(), ".data");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function getRecruiterJobs(): Promise<JobApiRecord[]> {
  try {
    const raw = await fs.readFile(JOBS_FILE, "utf-8");
    return JSON.parse(raw) as JobApiRecord[];
  } catch {
    return [];
  }
}

export async function saveRecruiterJob(job: JobApiRecord): Promise<JobApiRecord> {
  await ensureDataDir();
  const jobs = await getRecruiterJobs();
  const index = jobs.findIndex((j) => j.id === job.id);
  if (index >= 0) {
    jobs[index] = job;
  } else {
    jobs.push(job);
  }
  await fs.writeFile(JOBS_FILE, JSON.stringify(jobs, null, 2), "utf-8");
  return job;
}

export async function createRecruiterJob(params: {
  role: string;
  company: string;
  location: string;
  compensation: string;
  remote: boolean;
  category: string;
  description?: string;
  url?: string;
}): Promise<JobApiRecord> {
  const id = `rec_job_${Math.random().toString(36).substring(2, 11)}`;
  const now = new Date().toISOString();
  
  // Seed stable scores
  const fitScore = Math.floor(Math.random() * 30) + 70; // 70-99
  const ghostScore = Math.floor(Math.random() * 40) + 10; // 10-50
  const velocities: ("Fast" | "Slow" | "Stalled" | "Steady")[] = ["Fast", "Steady", "Slow"];
  const velocity = velocities[Math.floor(Math.random() * velocities.length)];
  const difficulties: ("Easy" | "Medium" | "High")[] = ["Easy", "Medium", "High"];
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

  const newJob: JobApiRecord = {
    id,
    role: params.role,
    company: params.company,
    location: params.location,
    compensation: params.compensation,
    remote: params.remote,
    hybrid: params.location.toLowerCase().includes("hybrid"),
    workMode: params.remote ? "remote" : (params.location.toLowerCase().includes("hybrid") ? "hybrid" : "onsite"),
    category: params.category,
    description: params.description || "",
    url: params.url || "",
    postedAt: now,
    fitScore,
    ghostScore,
    hiringVelocity: velocity,
    applicationDifficulty: difficulty,
    sponsorshipRealism: "High",
    aiRationale: `Direct opening from ${params.company}. Recommended match: ${fitScore}% based on skill alignment.`,
  };

  return saveRecruiterJob(newJob);
}
