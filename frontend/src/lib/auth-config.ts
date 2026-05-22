export type OAuthProvider = "google" | "linkedin" | "github";

export interface AuthEnvStatus {
  nextAuthSecret: boolean;
  nextAuthUrl: boolean;
  google: boolean;
  linkedin: boolean;
  github: boolean;
  ready: boolean;
  missing: string[];
}

export function getAuthEnvStatus(): AuthEnvStatus {
  const checks = {
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET !== "dummy",
    nextAuthUrl: !!process.env.NEXTAUTH_URL,
    google:
      !!process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_ID !== "dummy" &&
      !!process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_SECRET !== "dummy",
    linkedin:
      !!process.env.LINKEDIN_CLIENT_ID &&
      process.env.LINKEDIN_CLIENT_ID !== "dummy" &&
      !!process.env.LINKEDIN_CLIENT_SECRET &&
      process.env.LINKEDIN_CLIENT_SECRET !== "dummy",
    github:
      !!process.env.GITHUB_CLIENT_ID &&
      process.env.GITHUB_CLIENT_ID !== "dummy" &&
      !!process.env.GITHUB_CLIENT_SECRET &&
      process.env.GITHUB_CLIENT_SECRET !== "dummy",
  };

  const missing: string[] = [];
  if (!checks.nextAuthSecret) missing.push("NEXTAUTH_SECRET");
  if (!checks.nextAuthUrl) missing.push("NEXTAUTH_URL");
  if (!checks.google) missing.push("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET");
  if (!checks.linkedin) missing.push("LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET");
  if (!checks.github) missing.push("GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET");

  return {
    ...checks,
    ready: checks.nextAuthSecret && checks.nextAuthUrl && (checks.google || checks.linkedin || checks.github),
    missing,
  };
}

export function getConfiguredProviders(): OAuthProvider[] {
  const providers: OAuthProvider[] = [];
  const status = getAuthEnvStatus();
  if (status.google) providers.push("google");
  if (status.linkedin) providers.push("linkedin");
  if (status.github) providers.push("github");
  return providers;
}
