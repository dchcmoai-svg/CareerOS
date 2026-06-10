import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAuthEnvStatus } from "./auth-config";
import { getUserProfile, initializeUserProfile } from "./profile-store";

const env = getAuthEnvStatus();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/sign-in",
    newUser: "/onboarding",
    error: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Developer Mock Sign-In",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "developer@careeros.dev" },
        name: { label: "Name", type: "text", placeholder: "Alex Developer" },
        role: { label: "Role", type: "text", placeholder: "candidate" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return {
          id: credentials.email.replace(/[^a-zA-Z0-9]/g, "_"),
          name: credentials.name || "Mock User",
          email: credentials.email,
          image: null,
          role: credentials.role || "candidate",
        };
      }
    }),
    ...(env.google
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } },
          }),
        ]
      : []),
    ...(env.linkedin
      ? [
          LinkedInProvider({
            clientId: process.env.LINKEDIN_CLIENT_ID!,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
          }),
        ]
      : []),
    ...(env.github
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account?.provider) return false;

      try {
        await initializeUserProfile({
          userId: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: account.provider,
          role: (user as any).role || "candidate",
        });
        return true;
      } catch (error) {
        console.error("[auth] Profile initialization failed:", error);
        return false;
      }
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.provider = account?.provider;
      }

      if (trigger === "update" && session) {
        if (typeof (session as { onboardingComplete?: boolean }).onboardingComplete === "boolean") {
          token.onboardingComplete = (session as { onboardingComplete: boolean }).onboardingComplete;
        }
      }

      if (token.sub && (trigger === "signIn" || trigger === "update" || !token.profileInitialized)) {
        const profile = await getUserProfile(token.sub);
        if (profile) {
          token.onboardingComplete = profile.onboardingComplete;
          token.profileInitialized = true;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.provider = token.provider as string | undefined;
        session.onboardingComplete = !!token.onboardingComplete;
        session.profileInitialized = !!token.profileInitialized;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`[auth] User signed in: ${user.email} via ${account?.provider}`);
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export function getAuthServerSession() {
  return getServerSession(authOptions);
}
