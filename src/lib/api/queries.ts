/**
 * Database Query Functions
 *
 * Server-side data fetching for the app.
 * These are used in Server Components and API routes.
 */

import { db } from "@/lib/db";
import {
  models,
  organizations,
  benchmarks,
  benchmarkCategories,
  benchmarkResults,
} from "@/lib/db/schema";
import { eq, desc, asc, sql, and, inArray } from "drizzle-orm";
import type {
  ModelWithOrganization,
  BenchmarkWithCategory,
  LeaderboardEntry,
} from "@/types";

// Get all benchmark categories
export async function getCategories() {
  return db
    .select()
    .from(benchmarkCategories)
    .orderBy(asc(benchmarkCategories.displayOrder));
}

// Get all organizations
export async function getOrganizations() {
  return db
    .select()
    .from(organizations)
    .orderBy(asc(organizations.name));
}

// Get all benchmarks with their categories
export async function getBenchmarks(): Promise<BenchmarkWithCategory[]> {
  const results = await db
    .select({
      benchmark: benchmarks,
      category: benchmarkCategories,
    })
    .from(benchmarks)
    .leftJoin(
      benchmarkCategories,
      eq(benchmarks.categoryId, benchmarkCategories.id)
    )
    .where(eq(benchmarks.isActive, true))
    .orderBy(asc(benchmarks.name));

  return results.map((r) => ({
    ...r.benchmark,
    category: r.category,
  }));
}

// Get benchmarks by category slug
export async function getBenchmarksByCategory(
  categorySlug: string
): Promise<BenchmarkWithCategory[]> {
  const category = await db
    .select()
    .from(benchmarkCategories)
    .where(eq(benchmarkCategories.slug, categorySlug))
    .limit(1);

  if (category.length === 0) {
    return [];
  }

  const results = await db
    .select({
      benchmark: benchmarks,
      category: benchmarkCategories,
    })
    .from(benchmarks)
    .leftJoin(
      benchmarkCategories,
      eq(benchmarks.categoryId, benchmarkCategories.id)
    )
    .where(
      and(
        eq(benchmarks.categoryId, category[0].id),
        eq(benchmarks.isActive, true)
      )
    )
    .orderBy(asc(benchmarks.name));

  return results.map((r) => ({
    ...r.benchmark,
    category: r.category,
  }));
}

// Get a single benchmark by slug
export async function getBenchmarkBySlug(
  slug: string
): Promise<BenchmarkWithCategory | null> {
  const results = await db
    .select({
      benchmark: benchmarks,
      category: benchmarkCategories,
    })
    .from(benchmarks)
    .leftJoin(
      benchmarkCategories,
      eq(benchmarks.categoryId, benchmarkCategories.id)
    )
    .where(eq(benchmarks.slug, slug))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  return {
    ...results[0].benchmark,
    category: results[0].category,
  };
}

// Get all models with their organizations
export async function getModels(): Promise<ModelWithOrganization[]> {
  const results = await db
    .select({
      model: models,
      organization: organizations,
    })
    .from(models)
    .leftJoin(organizations, eq(models.organizationId, organizations.id))
    .where(eq(models.isActive, true))
    .orderBy(asc(models.name));

  return results.map((r) => ({
    ...r.model,
    organization: r.organization,
  }));
}

// Get a single model by slug
export async function getModelBySlug(
  slug: string
): Promise<ModelWithOrganization | null> {
  const results = await db
    .select({
      model: models,
      organization: organizations,
    })
    .from(models)
    .leftJoin(organizations, eq(models.organizationId, organizations.id))
    .where(eq(models.slug, slug))
    .limit(1);

  if (results.length === 0) {
    return null;
  }

  return {
    ...results[0].model,
    organization: results[0].organization,
  };
}

// Get leaderboard for a specific benchmark
export async function getLeaderboardForBenchmark(
  benchmarkSlug: string,
  limit = 50
): Promise<LeaderboardEntry[]> {
  const benchmark = await getBenchmarkBySlug(benchmarkSlug);
  if (!benchmark) {
    return [];
  }

  const sortOrder = benchmark.higherIsBetter ? desc : asc;

  const results = await db
    .select({
      result: benchmarkResults,
      model: models,
      organization: organizations,
    })
    .from(benchmarkResults)
    .innerJoin(models, eq(benchmarkResults.modelId, models.id))
    .leftJoin(organizations, eq(models.organizationId, organizations.id))
    .where(eq(benchmarkResults.benchmarkId, benchmark.id))
    .orderBy(sortOrder(benchmarkResults.score))
    .limit(limit);

  return results.map((r, index) => ({
    rank: index + 1,
    model: {
      ...r.model,
      organization: r.organization,
    },
    score: Number(r.result.score),
    scoreNormalized: r.result.scoreNormalized
      ? Number(r.result.scoreNormalized)
      : 0,
    evaluationDate: r.result.evaluationDate,
    sourceType: r.result.sourceType,
  }));
}

// Get model scores across all benchmarks
export async function getModelScores(modelSlug: string) {
  const model = await getModelBySlug(modelSlug);
  if (!model) {
    return [];
  }

  const results = await db
    .select({
      result: benchmarkResults,
      benchmark: benchmarks,
      category: benchmarkCategories,
    })
    .from(benchmarkResults)
    .innerJoin(benchmarks, eq(benchmarkResults.benchmarkId, benchmarks.id))
    .leftJoin(
      benchmarkCategories,
      eq(benchmarks.categoryId, benchmarkCategories.id)
    )
    .where(eq(benchmarkResults.modelId, model.id))
    .orderBy(asc(benchmarks.name));

  return results.map((r) => ({
    ...r.result,
    benchmark: {
      ...r.benchmark,
      category: r.category,
    },
  }));
}

// Get overall leaderboard (average across benchmarks)
export async function getOverallLeaderboard(
  categorySlug?: string,
  limit = 50
) {
  // This is a simplified version - in production you'd want weighted averages
  // and only include models that have results for key benchmarks

  let query = db
    .select({
      model: models,
      organization: organizations,
      avgScore: sql<number>`AVG(${benchmarkResults.scoreNormalized})`.as(
        "avg_score"
      ),
      benchmarkCount: sql<number>`COUNT(DISTINCT ${benchmarkResults.benchmarkId})`.as(
        "benchmark_count"
      ),
    })
    .from(models)
    .leftJoin(organizations, eq(models.organizationId, organizations.id))
    .innerJoin(benchmarkResults, eq(models.id, benchmarkResults.modelId))
    .innerJoin(benchmarks, eq(benchmarkResults.benchmarkId, benchmarks.id))
    .where(eq(models.isActive, true))
    .groupBy(models.id, organizations.id)
    .orderBy(desc(sql`avg_score`))
    .limit(limit);

  // Filter by category if provided
  if (categorySlug) {
    const category = await db
      .select()
      .from(benchmarkCategories)
      .where(eq(benchmarkCategories.slug, categorySlug))
      .limit(1);

    if (category.length > 0) {
      query = db
        .select({
          model: models,
          organization: organizations,
          avgScore: sql<number>`AVG(${benchmarkResults.scoreNormalized})`.as(
            "avg_score"
          ),
          benchmarkCount:
            sql<number>`COUNT(DISTINCT ${benchmarkResults.benchmarkId})`.as(
              "benchmark_count"
            ),
        })
        .from(models)
        .leftJoin(organizations, eq(models.organizationId, organizations.id))
        .innerJoin(benchmarkResults, eq(models.id, benchmarkResults.modelId))
        .innerJoin(benchmarks, eq(benchmarkResults.benchmarkId, benchmarks.id))
        .where(
          and(
            eq(models.isActive, true),
            eq(benchmarks.categoryId, category[0].id)
          )
        )
        .groupBy(models.id, organizations.id)
        .orderBy(desc(sql`avg_score`))
        .limit(limit);
    }
  }

  const results = await query;

  return results.map((r, index) => ({
    rank: index + 1,
    model: {
      ...r.model,
      organization: r.organization,
    },
    avgScore: r.avgScore,
    benchmarkCount: r.benchmarkCount,
  }));
}
