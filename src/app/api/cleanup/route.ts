import { NextResponse } from "next/server";
import { runFullCleanup, getStorageEstimate } from "@/lib/sync/cleanup";
import { withSecurity, verifyAuth, errorResponse, successResponse } from "@/lib/security";

export const runtime = "edge";
export const maxDuration = 60;

async function handlePost(request: Request): Promise<Response> {
  // Verify authentication
  const authResult = verifyAuth(request);
  if (!authResult.success) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const result = await runFullCleanup();
    return successResponse({
      success: true,
      cleanup: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return errorResponse("Cleanup failed", 500);
  }
}

async function handleGet(request: Request): Promise<Response> {
  // Verify authentication
  const authResult = verifyAuth(request);
  if (!authResult.success) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const storage = await getStorageEstimate();
    return successResponse({
      success: true,
      storage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Storage check error:", error);
    return errorResponse("Storage check failed", 500);
  }
}

// Export with security middleware (rate limiting enabled)
export const POST = withSecurity(handlePost, { rateLimit: true });
export const GET = withSecurity(handleGet, { rateLimit: true });
