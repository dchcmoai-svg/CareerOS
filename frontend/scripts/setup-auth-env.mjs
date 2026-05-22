#!/usr/bin/env node
import { randomBytes } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envLocal = join(root, ".env.local");
const envExample = join(root, ".env.example");

const secret = randomBytes(32).toString("base64");

let content = "";
if (existsSync(envLocal)) {
  content = readFileSync(envLocal, "utf-8");
  console.log("📄 Found existing .env.local — updating NEXTAUTH_SECRET if missing\n");
} else if (existsSync(envExample)) {
  content = readFileSync(envExample, "utf-8");
  console.log("📄 Creating .env.local from .env.example\n");
} else {
  content = `NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
`;
}

if (!content.includes("NEXTAUTH_SECRET=") || content.match(/NEXTAUTH_SECRET=(dummy|)\s*$/m)) {
  if (content.includes("NEXTAUTH_SECRET=")) {
    content = content.replace(/NEXTAUTH_SECRET=.*/m, `NEXTAUTH_SECRET=${secret}`);
  } else {
    content += `\nNEXTAUTH_SECRET=${secret}\n`;
  }
  console.log("✅ Generated NEXTAUTH_SECRET");
} else {
  console.log("ℹ️  NEXTAUTH_SECRET already set — keeping existing value");
}

if (!content.includes("NEXTAUTH_URL=")) {
  content += "NEXTAUTH_URL=http://localhost:3000\n";
}

writeFileSync(envLocal, content);
console.log(`\n✅ Wrote ${envLocal}`);

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CareerOS OAuth Setup — Track B.1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Add OAuth credentials to frontend/.env.local

   Google:   https://console.cloud.google.com/apis/credentials
   LinkedIn: https://www.linkedin.com/developers/apps
   GitHub:   https://github.com/settings/developers

2. Redirect URIs (must match exactly):

   http://localhost:3000/api/auth/callback/google
   http://localhost:3000/api/auth/callback/linkedin
   http://localhost:3000/api/auth/callback/github

3. Start dev server:

   cd frontend && npm run dev

4. Test auth status:

   curl http://localhost:3000/api/auth/status

5. Live test flow:

   → http://localhost:3000/sign-in
   → Sign in with configured provider
   → /onboarding (profile initialization)
   → /dashboard (operating system)
`);
