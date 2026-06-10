import { execFile } from "child_process";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const execFileAsync = promisify(execFile);

const DJANGO_API = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";
const ALLOW_SQLITE_FALLBACK = process.env.ALLOW_SQLITE_FALLBACK === "true";
const PROJECT_ROOT = path.resolve(process.cwd(), "..", "..");
const PYTHON =
  process.env.PYTHON_PATH ||
  (process.env.VIRTUAL_ENV
    ? path.join(process.env.VIRTUAL_ENV, "bin", "python")
    : path.join(PROJECT_ROOT, "venv", "bin", "python"));
const SCRIPT = path.join(
  PROJECT_ROOT,
  "Deployment",
  "scripts",
  "jobs_json_sqlite.py"
);

async function fetchFromDjango(search: URLSearchParams) {
  const url = `${DJANGO_API}/api/jobs/?${search.toString()}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(20000),
    next: { revalidate: false }, // Use force-cache by default
  });
  if (!res.ok) throw new Error(`Django API ${res.status}`);
  return res.json();
}

async function fetchFromScript(search: URLSearchParams) {
  if (!fs.existsSync(SCRIPT)) {
    throw new Error(`Fallback script not found at ${SCRIPT}`);
  }

  const env = {
    ...process.env,
    JOBS_Q: search.get("q") || "",
    JOBS_REMOTE: search.get("remote") || "",
    JOBS_WORK_MODE: search.get("work_mode") || "",
    JOBS_CATEGORY: search.get("category") || "",
    JOBS_SOURCE: search.get("source") || "",
    JOBS_LIMIT: search.get("limit") || "100",
    JOBS_OFFSET: search.get("offset") || "0",
    SQLITE_PATH: path.join(PROJECT_ROOT, "db.sqlite3"),
  };
  const { stdout } = await execFileAsync(PYTHON, [SCRIPT], {
    cwd: PROJECT_ROOT,
    env,
    timeout: 15000,
    maxBuffer: 10 * 1024 * 1024,
  });
  return JSON.parse(stdout);
}

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;

  try {
    const data = await fetchFromDjango(search);
    // Cache response indefinitely until revalidated
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=31536000", // 1 year
      },
    });
  } catch (djangoError) {
    if (!ALLOW_SQLITE_FALLBACK) {
      const message = djangoError instanceof Error ? djangoError.message : "Failed to load jobs from Django";
      return NextResponse.json(
        { jobs: [], total: 0, error: message },
        { status: 503 }
      );
    }

    try {
      const data = await fetchFromScript(search);
      return NextResponse.json({ ...data, _source: "local" }, {
        headers: {
          "Cache-Control": "public, max-age=31536000", // 1 year
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load jobs";
      return NextResponse.json(
        { jobs: [], total: 0, error: message },
        { status: 503 }
      );
    }
  }
}
