export interface UserExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
  bullets: string[];
  tags: string[];
}

export interface UserEducation {
  id: string;
  school: string;
  degree: string;
  duration: string;
}

export interface UserProject {
  id: string;
  title: string;
  tags: string[];
  bullets: string[];
}

export interface ApplicationDefaultsData {
  visaType: string;
  authorizedToWork: boolean;
  needsSponsorship: boolean;
  inPersonOk: boolean;
  canRelocate: boolean;
  startImmediately: boolean;
  hasTransport: boolean;
  needsAccommodations: boolean;
  priorEmployee: boolean;
  govClearance: boolean;
  govTies: boolean;
  gender: string;
  ethnicity: string;
  veteran: boolean;
  disability: boolean;
  
  // Indian Job Pool additions
  noticePeriod?: string;
  currentCtc?: string;
  expectedCtc?: string;
  preferredLocations?: string[];
  panCardName?: string;
}

export interface AppSettings {
  resumeMode: "off" | "honest" | "aggressive";
  coverLetterMode: "off" | "honest" | "aggressive";
  autoApprove: boolean;
  workdayUsername?: string;
  workdayPassword?: string;
  notifyDailyJobs: boolean;
  notifyAppStatus: boolean;
  notifyWeeklySummary: boolean;
}

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
  role: "candidate" | "recruiter";
  referralCode: string;
  referredBy: string | null;
  referralEarnings: number;
  referredUsersCount: number;
  identity: ProfessionalIdentity;
  preferences: UserPreferences;
  visibility: VisibilityControls;
  aiState: AiContinuityState;
  settings?: AppSettings;
  experienceList?: UserExperience[];
  educationList?: UserEducation[];
  projectsList?: UserProject[];
  appDefaults?: ApplicationDefaultsData;
  resumeFileName?: string;
  resumeUploadedAt?: string;
  coverLetterText?: string;
}

export function createDefaultProfile(params: {
  userId: string;
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
  role?: "candidate" | "recruiter";
  referredBy?: string | null;
}): UserProfile {
  const now = new Date().toISOString();
  const provider = params.provider;
  const safeName = (params.name || params.email.split("@")[0] || "user").toLowerCase().replace(/[^a-z0-9]/g, "");
  const referralCode = `${safeName}_${params.userId.slice(-4)}`;

  return {
    userId: params.userId,
    email: params.email,
    name: params.name ?? "Kumar Kushang",
    image: params.image ?? null,
    provider,
    createdAt: now,
    updatedAt: now,
    onboardingComplete: false,
    role: params.role ?? "candidate",
    referralCode,
    referredBy: params.referredBy ?? null,
    referralEarnings: 0,
    referredUsersCount: 0,
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
    settings: {
      resumeMode: "honest",
      coverLetterMode: "honest",
      autoApprove: true,
      workdayUsername: "",
      workdayPassword: "",
      notifyDailyJobs: true,
      notifyAppStatus: true,
      notifyWeeklySummary: false,
    },
    resumeFileName: "Kushang_Resume.pdf",
    resumeUploadedAt: now,
    coverLetterText: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the Frontend Developer position at your company. With my background as a Web Development Lead at Cyber Peace Corps and Web Developer at USC KIIT, along with my ongoing Bachelor of Technology studies in Computer Science and Engineering, I am confident in my ability to build robust, scalable, and responsive user interfaces.\n\nI have designed and deployed multiple full-stack and front-end applications, including WaterBorne, WeatherUI, and an AI Cold Email Generator. I look forward to discussing how my skills and projects align with your engineering goals.\n\nSincerely,\nKumar Kushang`,
    experienceList: [
      {
        id: "1",
        role: "Web Development Lead",
        company: "Cyber Peace Corps, KIIT Chapter",
        duration: "Apr 2026 — Present (3 mos)",
        bullets: [
          "Developed and maintained web interfaces for cyber awareness initiatives, contributing to digital safety outreach campaigns.",
          "Collaborated with a cross-functional team to design responsive, accessible front-end components using React.js and modern CSS.",
          "Participated in code reviews and sprint planning, applying agile workflows to deliver features on schedule."
        ],
        tags: ["React.js", "Agile", "Team Lead"]
      },
      {
        id: "2",
        role: "Web Developer",
        company: "USC KIIT (University Student Community)",
        duration: "Oct 2025 — Present (9 mos)",
        bullets: [
          "Built and maintained the club's member management system, streamlining registration and data retrieval for 100+ members.",
          "Engineered structured data storage and administrative lookup features, improving operational efficiency for the student organization.",
          "Implemented scalable architecture for member profiles, roles, and activity tracking using JavaScript and backend data handling."
        ],
        tags: ["JavaScript", "Node.js", "Database"]
      }
    ],
    educationList: [
      {
        id: "edu-1",
        school: "KIIT University",
        degree: "Bachelor of Technology · Computer Science and Engineering",
        duration: "Aug 2024 — Present"
      }
    ],
    projectsList: [
      {
        id: "waterborne",
        title: "WaterBorne",
        tags: ["React.js", "Vercel", "REST APIs"],
        bullets: [
          "Designed and deployed a full-stack awareness web application focused on water-borne health issues, accessible via public URL on Vercel.",
          "Implemented a responsive, mobile-first UI using React.js with dynamic content rendering and clean component architecture.",
          "Configured end-to-end deployment pipeline with CI/CD via Vercel, reducing deployment time and ensuring zero-downtime updates."
        ]
      },
      {
        id: "weatherui",
        title: "WeatherUI",
        tags: ["JavaScript", "OpenWeather API", "HTML", "CSS"],
        bullets: [
          "Developed a real-time weather interface application that fetches live meteorological data via external APIs and renders it through a responsive UI.",
          "Implemented location-based search with dynamic data handling, displaying temperature, humidity, and forecast information with smooth UI state transitions.",
          "Optimized API call efficiency with client-side caching logic, reducing redundant requests and improving application performance."
        ]
      },
      {
        id: "usc-kiit",
        title: "USC KIIT Members Management System",
        tags: ["JavaScript", "Node.js", "JSON", "Database"],
        bullets: [
          "Architected a membership management system for a university student community, supporting structured storage and retrieval of member profiles, roles, and activity data.",
          "Designed admin-level access control and data organization modules, enabling efficient member onboarding and record management.",
          "Applied modular code design principles to ensure system scalability and ease of future feature integration."
        ]
      },
      {
        id: "ai-email",
        title: "AI Cold Email Generator",
        tags: ["Next.js", "OpenAI API", "Tailwind CSS"],
        bullets: [
          "Built an AI-powered cold email generator using Next.js API routes, enabling users to craft personalized outreach emails with dynamic tone and context adaptation.",
          "Integrated LLM-based generation with role, company, and intent inputs, producing structured emails with a one-click copy-to-clipboard workflow.",
          "Implemented a 'Why I Fit' feature that tailors email content to startup-specific culture, increasing relevance and response rates."
        ]
      },
      {
        id: "knowledge-vault",
        title: "Personal Knowledge Vault",
        tags: ["Next.js", "Local DB", "Search/Filter API"],
        bullets: [
          "Developed a personal knowledge management system to capture, tag, and retrieve notes, links, and ideas through a clean, searchable interface.",
          "Built full-text search and multi-tag filter functionality, enabling instant retrieval across hundreds of saved entries without external dependencies.",
          "Designed with a local-first architecture for speed and privacy, demonstrating practical product thinking beyond standard CRUD applications."
        ]
      },
      {
        id: "link-in-bio",
        title: "Link-in-Bio Builder (Mini SaaS)",
        tags: ["Next.js", "Vercel", "Dynamic Routing"],
        bullets: [
          "Developed a customizable link-in-bio platform enabling users to create and publish personalized landing pages with dynamic routing via Next.js.",
          "Implemented real-time layout customization, profile metadata editing, and shareable public URLs – demonstrating end-to-end SaaS product thinking.",
          "Deployed on Vercel with optimized page performance, achieving fast load times through static generation and edge caching."
        ]
      }
    ],
    appDefaults: {
      visaType: "F-1",
      authorizedToWork: true,
      needsSponsorship: true,
      inPersonOk: true,
      canRelocate: false,
      startImmediately: true,
      hasTransport: false,
      needsAccommodations: false,
      priorEmployee: false,
      govClearance: false,
      govTies: false,
      gender: "Male",
      ethnicity: "Asian",
      veteran: false,
      disability: false,
      noticePeriod: "Immediate",
      currentCtc: "₹8 LPA",
      expectedCtc: "₹12 LPA",
      preferredLocations: ["Bengaluru", "Noida", "Gurgaon"],
      panCardName: "KUMAR KUSHANG"
    }
  };
}
