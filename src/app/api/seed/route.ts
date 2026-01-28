import { runFullSeed } from "@/lib/db/seed";
import { withSecurity, verifyAuth, errorResponse, successResponse } from "@/lib/security";

export const runtime = "edge";
export const maxDuration = 60;

async function handlePost(request: Request): Promise<Response> {
  // Verify authentication - seeding is sensitive
  const authResult = verifyAuth(request);
  if (!authResult.success) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const result = await runFullSeed();
    return successResponse({
      success: true,
      seeded: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Seed error:", error);
    return errorResponse("Seed failed", 500);
  }
}

export const POST = withSecurity(handlePost, { rateLimit: true });
