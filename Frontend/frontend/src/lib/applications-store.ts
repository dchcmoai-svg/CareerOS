import fs from "fs/promises";
import path from "path";
import { TrackerItemData } from "@/components/tracker/TrackerItemCard";

export interface ApplicationStoreRecord extends TrackerItemData {
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  matchScore: number;
  expectedResponseDate: string;
  appliedAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const APPLICATIONS_FILE = path.join(DATA_DIR, "applications.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function getStoreApplications(): Promise<ApplicationStoreRecord[]> {
  try {
    const raw = await fs.readFile(APPLICATIONS_FILE, "utf-8");
    return JSON.parse(raw) as ApplicationStoreRecord[];
  } catch {
    return [];
  }
}

export async function saveStoreApplication(app: ApplicationStoreRecord): Promise<ApplicationStoreRecord> {
  await ensureDataDir();
  const apps = await getStoreApplications();
  const index = apps.findIndex((a) => a.id === app.id);
  if (index >= 0) {
    apps[index] = app;
  } else {
    apps.push(app);
  }
  await fs.writeFile(APPLICATIONS_FILE, JSON.stringify(apps, null, 2), "utf-8");
  return app;
}

export async function createStoreApplication(params: {
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  role: string;
  company: string;
  resumeBranch?: string;
  stage?: "Applied" | "Interviewing" | "Offer" | "Rejected" | "Ghosted" | "Stalled";
}): Promise<ApplicationStoreRecord> {
  const id = `app_${Math.random().toString(36).substring(2, 11)}`;
  const now = new Date().toISOString();
  
  const newApp: ApplicationStoreRecord = {
    id,
    jobId: params.jobId,
    candidateId: params.candidateId,
    candidateName: params.candidateName,
    candidateEmail: params.candidateEmail,
    company: params.company,
    role: params.role,
    stage: params.stage || "Applied",
    stageDays: 0,
    lastInteraction: "Application submitted",
    historicalVelocity: "Fast",
    responseProbability: 75,
    ghostRisk: "Low",
    resumeBranch: params.resumeBranch || "main",
    followUpIn: "Wait 3 days",
    nextAction: "Review pre-requisites",
    matchScore: 85,
    expectedResponseDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    appliedAt: now,
  };

  return saveStoreApplication(newApp);
}

export async function updateStoreApplicationStage(
  appId: string, 
  stage: "Applied" | "Interviewing" | "Offer" | "Rejected" | "Ghosted" | "Stalled"
): Promise<ApplicationStoreRecord | null> {
  const apps = await getStoreApplications();
  const app = apps.find((a) => a.id === appId);
  if (!app) return null;
  
  app.stage = stage;
  app.stageDays = 0; // reset days in stage
  app.lastInteraction = `Stage updated to ${stage}`;
  
  if (stage === "Offer") {
    app.nextAction = "Review and sign offer letter";
    app.followUpIn = "Respond within 48h";
  } else if (stage === "Interviewing") {
    app.nextAction = "Schedule technical round";
    app.followUpIn = "Check calendar availability";
  } else if (stage === "Rejected") {
    app.nextAction = "Archived — focus on other opportunities";
    app.followUpIn = "Archived";
  } else {
    app.nextAction = "No action required";
    app.followUpIn = "Wait for response";
  }

  await saveStoreApplication(app);
  return app;
}
