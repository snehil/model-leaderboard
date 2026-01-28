import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Global Security Proxy
 *
 * Runs on every request to:
 * - Add security headers
 * - Block access to sensitive paths
 */

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;

  // Block access to sensitive files
  const blockedPaths = [
    "/.env",
    "/.git",
    "/wp-admin",
    "/wp-login",
    "/xmlrpc.php",
    "/phpmyadmin",
    "/.htaccess",
    "/config.php",
  ];

  if (blockedPaths.some((blocked) => path.toLowerCase().startsWith(blocked))) {
    console.warn(`Blocked access to sensitive path: ${path}`);
    return new NextResponse("Not Found", { status: 404 });
  }

  // Add request ID for tracing
  const requestId = crypto.randomUUID();
  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-Request-ID", requestId);
  response.headers.set("X-DNS-Prefetch-Control", "off");

  // For API routes, add additional headers
  if (path.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
