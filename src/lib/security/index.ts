/**
 * Security Utilities
 *
 * Implements OWASP Top 10 protections:
 *
 * 1. Injection - Parameterized queries via Drizzle ORM + Zod validation
 * 2. Broken Authentication - Secure token comparison, no credential exposure
 * 3. Sensitive Data Exposure - HTTPS only, security headers, no stack traces
 * 4. XML External Entities - N/A (JSON only)
 * 5. Broken Access Control - Auth middleware, rate limiting
 * 6. Security Misconfiguration - Strict CSP, security headers
 * 7. XSS - React escaping + CSP + input sanitization
 * 8. Insecure Deserialization - Zod validation on all inputs
 * 9. Using Components with Vulnerabilities - Regular npm audit
 * 10. Insufficient Logging - Console logging (enhance with proper logging service)
 */

export * from "./rate-limit";
export * from "./validation";
export * from "./api";
