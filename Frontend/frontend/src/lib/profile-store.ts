import fs from "fs/promises";
import path from "path";
import { UserProfile, createDefaultProfile } from "./profile-types";

const DATA_DIR = path.join(process.cwd(), ".data", "users");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function profilePath(userId: string) {
  const safeId = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(DATA_DIR, `${safeId}.json`);
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const raw = await fs.readFile(profilePath(userId), "utf-8");
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<UserProfile> {
  await ensureDataDir();
  profile.updatedAt = new Date().toISOString();
  await fs.writeFile(profilePath(profile.userId), JSON.stringify(profile, null, 2), "utf-8");
  return profile;
}

export async function initializeUserProfile(params: {
  userId: string;
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
  role?: "candidate" | "recruiter";
  referredBy?: string | null;
}): Promise<UserProfile> {
  const existing = await getUserProfile(params.userId);
  if (existing) return existing;

  const profile = createDefaultProfile(params);
  return saveUserProfile(profile);
}

export async function completeOnboarding(userId: string): Promise<UserProfile | null> {
  const profile = await getUserProfile(userId);
  if (!profile) return null;
  profile.onboardingComplete = true;
  profile.aiState.lastContext = "Welcome to CareerOS. Your professional graph is active.";
  return saveUserProfile(profile);
}

export async function completeOnboardingWithRole(
  userId: string,
  role: "candidate" | "recruiter",
  referralCodeInput?: string | null
): Promise<UserProfile | null> {
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  profile.onboardingComplete = true;
  profile.role = role;

  if (role === "candidate" && referralCodeInput) {
    const DATA_DIR = path.join(process.cwd(), ".data", "users");
    try {
      const files = await fs.readdir(DATA_DIR);
      let referrerProfile: UserProfile | null = null;

      for (const file of files) {
        if (file.endsWith(".json")) {
          try {
            const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
            const p = JSON.parse(raw) as UserProfile;
            if (p.referralCode === referralCodeInput && p.userId !== userId) {
              referrerProfile = p;
              break;
            }
          } catch {}
        }
      }

      if (referrerProfile) {
        referrerProfile.referredUsersCount = (referrerProfile.referredUsersCount || 0) + 1;
        referrerProfile.referralEarnings = (referrerProfile.referralEarnings || 0) + 50; // $50 referral bonus!
        await saveUserProfile(referrerProfile);
        profile.referredBy = referrerProfile.userId;
      }
    } catch (err) {
      console.error("Referral attribution failed:", err);
    }
  }

  profile.aiState.lastContext = `Welcome to CareerOS. Your professional graph is active as a ${role}.`;
  return saveUserProfile(profile);
}
