/**
 * User-facing product language — simple, professional, LinkedIn-familiar.
 * Technical concepts stay in code comments and backend only.
 */

export const product = {
  name: "CareerOS",
  tagline: "The smarter way to manage your career.",
  description:
    "Find better jobs, improve your resume, track applications, and get discovered by recruiters — all in one place.",
} as const;

export const nav = {
  dashboard: "Mission Control",
  jobs: "Find Jobs",
  tracker: "Applications",
  resume: "Resume",
  marketplace: "Get Discovered",
  profile: "Career vault",
  alerts: "Notifications",
  settings: "Settings",
  commandMenu: "Quick Search",
  workspace: "Your Career",
} as const;

export const jobs = {
  title: "Find Jobs",
  subtitle: "Browse roles matched to your profile — filter by role, location, and work style.",
  pageGuide:
    "Each role shows how well it fits your resume, how likely the company is to respond, and whether hiring is moving quickly — so you apply to the right jobs first.",
  searchPlaceholder: "Search job title, company, or keyword…",
  filters: "Filters",
  remote: "Remote",
  hybrid: "Hybrid",
  onSite: "On-site",
  categories: "Category",
  sortRecent: "Most recent",
  sortMatch: "Best match",
  strongMatch: "Strong match",
  responseLikelihood: "Likely to respond",
  recruiterActive: "Actively hiring",
  hiringPace: "Hiring pace",
  sponsorship: "Visa sponsorship",
  resumeFits: "resume fit",
  whyMatch: "Why this matches you",
  tailorResume: "Improve resume for this role",
  saveJob: "Save job",
  applyNow: "Apply",
  viewRole: "View role",
  noResults: "No jobs match your filters. Try broadening your search.",
  newToday: "new today",
  loading: "Loading jobs…",
  error: "Couldn't load jobs. Check that the backend is running.",
  stats: {
    shown: "Jobs shown",
    total: "Total available",
    avgMatch: "Average match",
    highResponse: "Likely to respond",
  },
  scoreHints: {
    match:
      "How closely your skills and experience align with this role. 85%+ usually means a tailored resume is worth the effort.",
    response:
      "Based on how often this company replies to similar applicants. Higher means less ghosting after you apply.",
    hiring:
      "Whether the team is posting often and moving candidates through interviews quickly.",
    sponsorship:
      "How realistic visa sponsorship looks for this company and role, based on past patterns.",
  },
} as const;

export const missionControl = {
  eyebrow: "Mission control",
  title: (name: string) => `Good to see you, ${name}`,
  subtitle:
    "The system tracks your career health, opportunities, and pipeline — here's what matters right now.",
  level1: "What to do next",
  level1Hint: "Prioritized by urgency and impact",
  level2: "Current state",
  level3: "Supporting intelligence",
  urgent: "Urgent",
  recommended: "Recommended",
  opportunities: "Opportunity intelligence",
  opportunitiesHint: "Match, response odds, and the resume version to use",
  recruiterSignals: "Recruiter signals",
  recruiterHint: "Who's looking for profiles like yours",
  careerVault: "Career vault",
  vaultHint: "Applications, versions, and profile assets in one place",
} as const;

export const dashboard = {
  title: "Mission Control",
  subtitle: (name: string) =>
    `Welcome back, ${name}. Here's what needs your attention and what's improving.`,
  pageGuide:
    "Your dashboard brings jobs, applications, resume health, and recruiter activity into one place — so you always know what to do next.",
  highFitRoles: "Strong job matches",
  resumeScore: "Resume score",
  applications: "Active applications",
  recruiterActivity: "Recruiter views",
  focusJobs: "Find Jobs",
  focusTracker: "Applications",
  focusResume: "Resume",
  focusMarketplace: "Get Discovered",
  liveFlow: "Your job search flow",
  continuity: "All connected",
  badges: {
    stealth: "Hide from current employer",
    resume: "How well your resume passes screening",
    momentum: "Applications on track",
  },
  modules: {
    applications: "Your applications",
    applicationsHint: "Where each application stands and when to follow up.",
    jobs: "Top matches",
    jobsHint: "Roles that fit your profile — sorted by match and response odds.",
    recruiters: "Recruiter activity",
    recruitersHint: "Who's viewed or searched for profiles like yours.",
    assistant: "Career assistant",
    assistantHint: "Practical suggestions based on your jobs, resume, and applications.",
    resume: "Resume health",
    resumeHint: "Quick fixes that could improve interview chances.",
    apply: "Ready to apply",
    applyHint: "Roles where your resume is already a strong fit.",
    alerts: "Reminders",
    alertsHint: "Follow-ups, replies, and visibility changes worth acting on.",
    checklist: "Suggested next steps",
  },
  assistantQuote:
    "Acme Corp hasn't heard from you in 12 days — a short follow-up often helps. Your Vercel resume version could use one more keyword tweak.",
  assistantCta: "Improve resume",
} as const;

export const resume = {
  title: "Resume",
  subtitle: "Improve your resume and get more interview responses.",
  pageGuide:
    "See what's working, what recruiters skim for, and which small edits raise your chances — without feeling like optimization software.",
  optimizer: "Resume suggestions",
  score: "Resume score",
  scoreReady: "Ready to send",
  scoreNeedsWork: "A few quick fixes",
  keywords: "Role keywords",
  keywordsHint: "Words hiring teams and screening tools look for in this type of role.",
  readability: "Easy to scan",
  readabilityHint: "Recruiters often spend under 10 seconds on the first pass — clear headings help.",
  impact: "Measurable results",
  impactHint: "Bullet points with numbers (%, $, time saved) tend to get more callbacks.",
  targetRole: (role: string) => `Tailored for: ${role}`,
} as const;

export const tracker = {
  title: "Pipeline intelligence",
  subtitle: "Track every application with response probability, ghost risk, and follow-up timing.",
  pageGuide:
    "Each card shows how long you've been in a stage, whether the company tends to ghost applicants, and when a nudge helps most.",
  ghostRisk: "Ghost risk",
  responseProb: "Response probability",
  followUp: "Suggested follow-up",
} as const;

export const profile = {
  title: "Career vault",
  subtitle: "Your professional story, resume versions, and skills — connected across your job search.",
  pageGuide:
    "Everything recruiters see flows from here. Keep skills verified and resume versions aligned to the roles you want.",
  completeness: "Profile strength",
  completenessHint: "Add a summary and verify 2 more skills to reach 90%+.",
  documents: "Documents",
  resumeDesc: "The version we tailor for each application.",
  coverLetterDesc: "Default letter — editable per role when you apply.",
  experience: "Experience",
  skills: "Skills",
  resumeVersions: "Resume versions",
} as const;

export const settings = {
  title: "Settings",
  subtitle: "Privacy, applications, notifications, and how your career assistant helps you.",
  pageGuide: "Changes apply across jobs, applications, and recruiter visibility.",
  sections: {
    connections: "Connected accounts",
    privacy: "Privacy & visibility",
    applications: "Application preferences",
    assistant: "Career assistant",
    notifications: "Notifications",
  },
  stealth: "Hide from current employer",
  stealthHint: "Recruiters at your company won't see your profile.",
  blocked: "Blocked companies",
  salary: "Minimum salary",
  workplace: "Work style",
  memory: "Remember my preferences",
  memoryHint: "Helps suggestions improve over time — you can clear this anytime.",
  notifyRecruiter: "Recruiter views & messages",
  notifyResume: "Resume improvement tips",
  notifyFollowUp: "Follow-up reminders",
} as const;

export const marketplace = {
  title: "Get Discovered",
  subtitle: "Control who sees your profile and stay visible to the right recruiters.",
  pageGuide:
    "You're in control: choose who can find you, block your current employer, and see when recruiters are actively looking for people like you.",
  visibility: "Profile visibility",
  recruiterActivity: "Recruiter activity",
  metrics: {
    views: "Profile views",
    stealth: "Stealth mode",
    stealthOn: "On — employer hidden",
    demand: "Interest this week",
    signals: "New recruiter searches",
  },
} as const;

export const agent = {
  title: "Career assistant",
  placeholder: "Ask about jobs, your resume, or applications…",
  suggestionTitle: "Suggestion",
  quickActions: "Quick actions",
  insights: {
    discovery:
      "Your resume matches backend roles well. We've hidden slow-response companies so you can focus on teams that are actively hiring.",
    tracker:
      "You haven't followed up with Acme Corp in 12 days. Companies like Stripe respond faster when you send a tailored resume.",
    ats: "Add measurable outcomes to 4 bullet points — that alone could raise your resume score by about 15%. Mention the tools you used in each role.",
    marketplace:
      "2 recruiters viewed your profile this week. You can turn on visibility for Series B startups in your target range if you'd like more inbound interest.",
    global:
      "3 applications need follow-up. Your resume score went up 6% after your last edit — your strong job matches updated automatically.",
  },
} as const;

export const command = {
  placeholder: "Run a career action or jump somewhere…",
  empty: "No actions matched — try “follow-up” or “high priority”.",
  navigate: "Go to",
  actions: "Career actions",
  intelligence: "Intelligence",
  assistant: "Assistant",
  footer: "CareerOS command palette",
} as const;

export const onboarding = {
  steps: [
    { label: "Signing you in", detail: "Securing your account" },
    { label: "Building your profile", detail: "Skills, experience, and goals" },
    { label: "Setting preferences", detail: "Salary, remote work, target roles" },
    { label: "Getting your hub ready", detail: "Jobs, applications, and resume in one place" },
  ],
  welcome: "Your career hub is ready",
  enter: "Go to dashboard",
} as const;

export const landing = {
  eyebrow: "Career management, simplified",
  headline: "Everything you need to manage your career — in one place.",
  subheadline:
    "Discover better jobs, improve your applications, track progress, and stay visible to recruiters — without juggling ten different tools.",
  ctaPrimary: "Get started free",
  ctaSecondary: "See how it works",
  pipeline: ["Profile", "Find Jobs", "Applications", "Resume", "Get Discovered"],
  demoTitle: "See CareerOS in action",
  demoSubtitle: "From building your profile to landing interviews — one connected workflow.",
  steps: [
    {
      id: "identity",
      title: "1. Build your profile",
      short: "Import from GitHub or LinkedIn",
      description:
        "Connect GitHub or LinkedIn. We pull your skills and experience automatically — no long forms.",
    },
    {
      id: "discovery",
      title: "2. Find jobs",
      short: "Smart job matches",
      description:
        "Browse roles with match scores, hiring activity, and sponsorship info — so you apply to the right ones.",
    },
    {
      id: "tracker",
      title: "3. Track applications",
      short: "Stay organized",
      description:
        "Every application in one board. See stages, set follow-up reminders, and never lose track of where you stand.",
    },
    {
      id: "resume",
      title: "4. Improve your resume",
      short: "Get more responses",
      description:
        "Role-specific suggestions, ATS checks, and versions for each application — built to land interviews.",
    },
    {
      id: "marketplace",
      title: "5. Get discovered",
      short: "Recruiter visibility",
      description:
        "Let the right recruiters find you. Stealth mode, employer blocks, and salary preferences — you stay in control.",
    },
  ],
  trustTitle: "Built for job seekers, not engineers",
  trustPoints: [
    "We never post on your behalf without permission",
    "You control who sees your profile",
    "Your data stays private",
    "OAuth sign-in — no passwords stored",
  ],
  demoSignals: {
    identity: "3 skills imported from GitHub — ready to verify.",
    discovery: "Match scores update as you browse roles.",
    tracker: "Acme Corp has been in Interviewing for 14 days — follow up?",
    resume: "Resume score: 84%. Two quick fixes could push it higher.",
    marketplace: "Stealth mode on. 12 employers blocked from seeing you.",
  },
  footerProduct: "Product",
  footerJobs: "Find Jobs",
  footerHelp: "Help",
  comparison: {
    eyebrow: "Why CareerOS",
    title: "Built for your job search — not another social feed.",
    subtitle:
      "LinkedIn is great for networking. Indeed is great for volume. Teal is great for tracking. CareerOS connects finding jobs, improving your resume, tracking applications, and recruiter visibility in one calm workspace.",
    rows: [
      {
        topic: "Job matches",
        others: "Keyword search and endless scrolling",
        careeros: "Match scores, response odds, and hiring pace in plain language",
      },
      {
        topic: "Applications",
        others: "Spreadsheets or separate tracker apps",
        careeros: "Every application, stage, and follow-up in one board",
      },
      {
        topic: "Resume",
        others: "Generic templates or opaque 'AI scores'",
        careeros: "Clear suggestions — what to fix, why it matters, how recruiters read it",
      },
      {
        topic: "Recruiter visibility",
        others: "Public profile or nothing",
        careeros: "Stealth mode, employer blocks, and salary floors — you stay in control",
      },
    ],
    cta: "Start free — takes about a minute",
  },
} as const;

export const marketingPages = {
  product: {
    eyebrow: "Product",
    title: "One platform for your entire job search.",
    description:
      "CareerOS brings jobs, applications, resume help, and recruiter visibility together — so you stop switching between LinkedIn, spreadsheets, and five other tools.",
    cta: "Get started free",
    expansionTitle: "Start simple, go deeper when you need to",
    expansionBody:
      "Your dashboard shows what matters daily. Open full pages for jobs, applications, or resume editing — everything stays connected.",
    deepDive: "See all features",
  },
  discovery: {
    eyebrow: "Find Jobs",
    title: "Job search that actually helps you decide.",
    description:
      "Browse real scraped roles with match scores, response likelihood, hiring pace, and sponsorship info — like LinkedIn, but clearer and smarter.",
    cta: "Browse jobs",
    sampleSignal:
      "Vercel · Staff Engineer · 94% match · 88% likely to respond · Hiring fast · Sponsorship likely",
  },
  resumeLab: {
    eyebrow: "Resume",
    title: "Improve your resume. Get more interviews.",
    description:
      "Get clear suggestions — stronger bullet points, missing keywords, and role-specific versions — in a calm editing workspace.",
    cta: "Improve my resume",
    diagnosticHint: 'Try: "Reduced API latency by 45%" instead of vague phrases like "improving velocities"',
  },
  discoverability: {
    eyebrow: "Get Discovered",
    title: "Let the right recruiters find you.",
    description:
      "Control who sees your profile, block current employers, set salary minimums, and see who's searching for people like you.",
    cta: "Set up visibility",
    stealthLabel: "Stealth mode on",
    stealthDetail: "Current employer hidden · Minimum salary $180k",
    recruiterSignal: "A recruiter searched for Rust + WebAssembly · 1 hour ago",
  },
  features: {
    eyebrow: "Features",
    title: "Everything you need — connected.",
    subtitle: "Six tools that work together, not six tabs you'll forget to check.",
    trustTitle: "Built on trust",
    trustBody:
      "Clear explanations for every suggestion. No dark patterns. Your data works for you — not advertisers.",
    trustTags: ["Clear match scores", "Slow-company warnings", "Privacy controls", "No feed tricks"],
    cta: "Get started free",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "Your job search, step by step.",
    subtitle: "From uploading your resume to getting discovered — one smooth workflow.",
    ctaPrompt: "Ready to get organized?",
    cta: "Get started free",
  },
  about: {
    eyebrow: "About",
    title: "Career tools should work for people, not algorithms.",
    subtitle:
      "We're building the career platform we wished existed — organized, intelligent, and respectful of your time.",
    footer: "© 2026 CareerOS — Built for job seekers.",
    docsLink: "Help & documentation",
  },
  publicCta: "Start managing your career in one place.",
} as const;

export const featureSystems = [
  {
    icon: "brain" as const,
    title: "Build your profile",
    subtitle: "Import from GitHub, LinkedIn, or resume",
    description:
      "Connect your accounts or upload a resume. We pull your skills and experience automatically — no 50-field onboarding forms.",
    accent: "ai" as const,
  },
  {
    icon: "briefcase" as const,
    title: "Find Jobs",
    subtitle: "Smart matches, not endless scrolling",
    description:
      "Browse roles with match scores, response likelihood, and hiring activity — so you focus on jobs worth applying to.",
    accent: "intelligence" as const,
  },
  {
    icon: "kanban" as const,
    title: "Applications",
    subtitle: "Never lose track again",
    description:
      "Every application in one board. See where you stand, get follow-up reminders, and know when it's time to nudge a recruiter.",
    accent: "default" as const,
  },
  {
    icon: "file" as const,
    title: "Resume",
    subtitle: "Suggestions that make sense",
    description:
      "Clear tips to strengthen bullet points, add keywords, and create versions for each role — built to get you more interviews.",
    accent: "warning" as const,
  },
  {
    icon: "network" as const,
    title: "Get Discovered",
    subtitle: "Visibility on your terms",
    description:
      "Let recruiters find you quietly. Stealth mode, employer blocks, and salary floors — you stay in control.",
    accent: "success" as const,
  },
  {
    icon: "sparkles" as const,
    title: "Career assistant",
    subtitle: "Help when you need it",
    description:
      "Ask about jobs, resumes, or applications. Get practical suggestions without learning another complex tool.",
    accent: "ai" as const,
  },
] as const;

export const howItWorksSteps = [
  { step: "01", title: "Upload your resume", desc: "We'll extract your skills, experience, and preferences in seconds." },
  { step: "02", title: "Build your profile", desc: "Optionally connect GitHub or LinkedIn to enrich your profile over time." },
  { step: "03", title: "Find jobs", desc: "Browse matched roles with clear scores — match, response likelihood, and hiring pace." },
  { step: "04", title: "Track applications", desc: "Keep every application organized with stages, notes, and follow-up reminders." },
  { step: "05", title: "Improve your resume", desc: "Get role-specific suggestions and versions so each application is stronger." },
  { step: "06", title: "Get discovered", desc: "Control visibility, block employers, and see recruiter activity — on your terms." },
  { step: "07", title: "Your career hub", desc: "See jobs, applications, resume health, and recruiter activity — all in one dashboard." },
] as const;
