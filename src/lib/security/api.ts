/**
 * API Security Utilities
 *
 * OWASP protections for API routes:
 * - Authentication verification
 * - Rate limiting
 * - Input validation
 * - Error handling (no stack trace leaks)
 */

import { NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitConfig,
  rateLimitResponse,
} from "./rate-limit";

export interface SecureApiConfig {
  requireAuth?: boolean;
  rateLimit?: boolean;
}

const DEFAULT_CONFIG: SecureApiConfig = {
  requireAuth: false,
  rateLimit: true,
};

/**
 * Wraps an API handler with security middleware
 */
export function withSecurity<T>(
  handler: (request: Request) => Promise<Response>,
  config: SecureApiConfig = DEFAULT_CONFIG
) {
  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);

    // Rate limiting
    if (config.rateLimit) {
      const clientId = getClientIdentifier(request);
      const rateLimitConfig = getRateLimitConfig(url.pathname);
      const rateLimitResult = checkRateLimit(
        `${clientId}:${url.pathname}`,
        rateLimitConfig
      );

      if (!rateLimitResult.success) {
        return rateLimitResponse(rateLimitResult);
      }
    }

    // Authentication for protected routes
    if (config.requireAuth) {
      const authResult = verifyAuth(request);
      if (!authResult.success) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // Execute handler with error boundary
    try {
      return await handler(request);
    } catch (error) {
      // Log error internally but don't expose details
      console.error("API Error:", error);

      // Return generic error (OWASP: don't leak stack traces)
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

/**
 * Verify API authentication
 */
export function verifyAuth(request: Request): { success: boolean } {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.SYNC_SECRET;

  if (!secret) {
    console.error("SYNC_SECRET not configured");
    return { success: false };
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { success: false };
  }

  const token = authHeader.slice(7);

  // Constant-time comparison to prevent timing attacks
  if (!constantTimeCompare(token, secret)) {
    return { success: false };
  }

  return { success: true };
}

/**
 * Constant-time string comparison to prevent timing attacks
 * OWASP: Protects against timing-based authentication bypass
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do comparison to maintain constant time
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i % b.length);
    }
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  message: string,
  status: number = 400
): Response {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T, status: number = 200): Response {
  return NextResponse.json(data, { status });
}

/**
 * Validate that required environment variables are set
 */
export function validateEnv(requiredVars: string[]): void {
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}
