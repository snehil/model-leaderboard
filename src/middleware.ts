import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Global Security Middleware
 *
 * Runs on every request to:
 * - Add security headers
 * - Block suspicious requests
 * - Log security events
 */

// Patterns that indicate potential attacks
const SUSPICIOUS_PATTERNS = [
  /\.\.\//g, // Path traversal
  /<script/gi, // XSS attempt
  /javascript:/gi, // XSS attempt
  /on\w+=/gi, // Event handler injection
  /union\s+select/gi, // SQL injection
  /--/g, // SQL comment
  /;\s*drop\s+/gi, // SQL injection
  /eval\s*\(/gi, // Code injection
];

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const path = url.pathname;

  // Check for suspicious patterns in URL
  const fullUrl = request.url;
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(decodeURIComponent(fullUrl))) {
      console.warn(`Blocked suspicious request: ${fullUrl}`);
      return new NextResponse("Bad Request", { status: 400 });
    }
  }

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

  // Add security headers that can't be set in next.config.ts
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
