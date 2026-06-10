import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Verify the request is coming from the backend
  const authToken = request.headers.get("X-Revalidate-Token");
  const expectedToken = process.env.REVALIDATE_TOKEN;

  if (!expectedToken || authToken !== expectedToken) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Revalidate the jobs endpoint for all query variations
    revalidatePath("/api/jobs", "layout");
    
    return NextResponse.json(
      { 
        revalidated: true, 
        timestamp: new Date().toISOString(),
        message: "Jobs cache revalidated successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Revalidation failed",
        revalidated: false 
      },
      { status: 500 }
    );
  }
}
