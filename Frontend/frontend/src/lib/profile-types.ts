export interface UserSkill {
  name: string;
  inferredFrom: "github" | "linkedin" | "resume" | "manual";
  isVerified: boolean;
}

export interface UserPreferences {
  targetSalaryMin: number | null;
  remotePreferred: boolean;
  sponsorshipRequired: boolean;
  targetRoleTypes: string[];
}

export interface VisibilityControls {
  isStealthMode: boolean;
  blockedCompanies: string[];
  visibleToStages: string[];
}

export interface AiContinuityState {
  lastContext: string | null;
  memoryKeys: string[];
  agentPersona: "operational" | "discovery" | "compiler";
}

export interface ProfessionalIdentity {
  seniority: string | null;
  primaryIndustry: string | null;
  githubConnected: boolean;
  linkedinConnected: boolean;
  resumeParsed: boolean;
  skills: UserSkill[];
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string | null;
  image: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
  onboardingComplete: boolean;
  identity: ProfessionalIdentity;
  preferences: UserPreferences;
  visibility: VisibilityControls;
  aiState: AiContinuityState;
}

export function createDefaultProfile(params: {
  userId: string;
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
}): UserProfile {
  const now = new Date().toISOString();
  const provider = params.provider;

  return {
    userId: params.userId,
    email: params.email,
    name: params.name ?? null,
    image: params.image ?? null,
    provider,
    createdAt: now,
    updatedAt: now,
    onboardingComplete: false,
    identity: {
      seniority: null,
      primaryIndustry: null,
      githubConnected: provider === "github",
      linkedinConnected: provider === "linkedin",
      resumeParsed: false,
      skills: provider === "github"
        ? [
            { name: "TypeScript", inferredFrom: "github", isVerified: false },
            { name: "React", inferredFrom: "github", isVerified: false },
          ]
        : provider === "linkedin"
        ? [
            { name: "Professional Network", inferredFrom: "linkedin", isVerified: false },
          ]
        : [],
    },
    preferences: {
      targetSalaryMin: null,
      remotePreferred: true,
      sponsorshipRequired: false,
      targetRoleTypes: ["Full-time", "Remote"],
    },
    visibility: {
      isStealthMode: false,
      blockedCompanies: [],
      visibleToStages: ["Series B", "Enterprise"],
    },
    aiState: {
      lastContext: "global",
      memoryKeys: ["identity", "preferences", "visibility"],
      agentPersona: "operational",
    },
  };
}
