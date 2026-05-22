import { NextResponse } from "next/server";
import { getAuthEnvStatus, getConfiguredProviders } from "@/lib/auth-config";

export async function GET() {
  const status = getAuthEnvStatus();
  const providers = getConfiguredProviders();

  return NextResponse.json({
    ready: status.ready,
    providers,
    configured: {
      google: status.google,
      linkedin: status.linkedin,
      github: status.github,
    },
    missing: status.missing,
    callbacks: {
      google: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/google`,
      linkedin: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/linkedin`,
      github: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/callback/github`,
    },
  });
}
