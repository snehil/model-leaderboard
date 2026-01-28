/**
 * Input Validation Utilities
 *
 * Uses Zod for type-safe validation.
 * OWASP: Protects against injection attacks and malformed input.
 */

import { z } from "zod";

// Sanitize string to prevent XSS (additional layer on top of React's escaping)
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim()
    .slice(0, 10000); // Limit length
}

// Slug validation (URL-safe strings)
export const slugSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

// UUID validation
export const uuidSchema = z.string().uuid();

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Search query validation
export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1)
    .max(200)
    .transform((s) => sanitizeString(s)),
  type: z.enum(["model", "benchmark", "organization", "all"]).default("all"),
});

// Filter validation for leaderboard
export const leaderboardFilterSchema = z.object({
  category: slugSchema.optional(),
  modelType: z
    .enum([
      "llm",
      "vision",
      "multimodal",
      "code",
      "audio_stt",
      "audio_tts",
      "embedding",
      "reasoning",
      "image_generation",
      "video",
      "spatial",
    ])
    .optional(),
  licenseType: z
    .enum(["proprietary", "open_source", "open_weights", "research_only"])
    .optional(),
  organization: slugSchema.optional(),
  sortBy: z.string().max(50).default("score"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Model creation/update validation (for admin/sync)
export const modelSchema = z.object({
  name: z.string().min(1).max(255),
  slug: slugSchema,
  organizationId: uuidSchema.optional(),
  modelType: z.enum([
    "llm",
    "vision",
    "multimodal",
    "code",
    "audio_stt",
    "audio_tts",
    "embedding",
    "reasoning",
    "image_generation",
    "video",
    "spatial",
  ]),
  licenseType: z.enum([
    "proprietary",
    "open_source",
    "open_weights",
    "research_only",
  ]),
  parameters: z.string().max(50).optional(),
  contextLength: z.number().int().positive().max(10000000).optional(),
  huggingfaceUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  paperUrl: z.string().url().optional().nullable(),
  description: z.string().max(5000).optional(),
});

// Benchmark result validation
export const benchmarkResultSchema = z.object({
  modelId: uuidSchema,
  benchmarkId: uuidSchema,
  score: z.number().min(-1000000).max(1000000),
  sourceType: z.enum([
    "huggingface",
    "papers_with_code",
    "arxiv",
    "official",
    "github",
    "manual",
    "community",
  ]),
  sourceUrl: z.string().url().optional(),
});

// Comparison request validation
export const comparisonSchema = z.object({
  models: z
    .array(slugSchema)
    .min(2, "Select at least 2 models")
    .max(5, "Maximum 5 models for comparison"),
});

// Generic validation helper
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    error: result.error.issues.map((e) => e.message).join(", "),
  };
}

// Parse and validate URL search params
export function parseSearchParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): { success: true; data: T } | { success: false; error: string } {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return validateInput(schema, params);
}
