/**
 * Database Seed Script
 *
 * Populates the database with initial data:
 * - Benchmark categories
 * - Organizations
 * - Benchmarks (with descriptions)
 * - Sample models
 *
 * Run via API: POST /api/seed (requires SYNC_SECRET)
 */

import { db } from "@/lib/db";
import {
  benchmarkCategories,
  organizations,
  benchmarks,
  models,
} from "@/lib/db/schema";
import { categories } from "./categories";
import { organizations as orgData } from "./organizations";
import { benchmarks as benchmarkData } from "./benchmarks";
import { models as modelData } from "./models";
import { eq } from "drizzle-orm";

export async function seedCategories() {
  console.log("Seeding benchmark categories...");
  const results = [];

  for (const category of categories) {
    // Upsert - insert or update if exists
    const existing = await db
      .select()
      .from(benchmarkCategories)
      .where(eq(benchmarkCategories.slug, category.slug))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(benchmarkCategories)
        .set(category)
        .where(eq(benchmarkCategories.slug, category.slug));
      results.push({ ...category, action: "updated" });
    } else {
      await db.insert(benchmarkCategories).values(category);
      results.push({ ...category, action: "created" });
    }
  }

  return results;
}

export async function seedOrganizations() {
  console.log("Seeding organizations...");
  const results = [];

  for (const org of orgData) {
    const existing = await db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, org.slug))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(organizations)
        .set(org)
        .where(eq(organizations.slug, org.slug));
      results.push({ ...org, action: "updated" });
    } else {
      await db.insert(organizations).values(org);
      results.push({ ...org, action: "created" });
    }
  }

  return results;
}

export async function seedBenchmarks() {
  console.log("Seeding benchmarks...");
  const results = [];

  // Get category IDs
  const categoryRows = await db.select().from(benchmarkCategories);
  const categoryMap = new Map(categoryRows.map((c) => [c.slug, c.id]));

  for (const [categorySlug, benchmarkList] of Object.entries(benchmarkData)) {
    const categoryId = categoryMap.get(categorySlug);
    if (!categoryId) {
      console.warn(`Category not found: ${categorySlug}`);
      continue;
    }

    for (const benchmark of benchmarkList) {
      const existing = await db
        .select()
        .from(benchmarks)
        .where(eq(benchmarks.slug, benchmark.slug))
        .limit(1);

      const data = { ...benchmark, categoryId };

      if (existing.length > 0) {
        await db
          .update(benchmarks)
          .set(data)
          .where(eq(benchmarks.slug, benchmark.slug));
        results.push({ name: benchmark.name, action: "updated" });
      } else {
        await db.insert(benchmarks).values(data);
        results.push({ name: benchmark.name, action: "created" });
      }
    }
  }

  return results;
}

export async function seedModels() {
  console.log("Seeding models...");
  const results = [];

  // Get organization IDs
  const orgRows = await db.select().from(organizations);
  const orgMap = new Map(orgRows.map((o) => [o.slug, o.id]));

  for (const [orgSlug, modelList] of Object.entries(modelData)) {
    const organizationId = orgMap.get(orgSlug);
    if (!organizationId) {
      console.warn(`Organization not found: ${orgSlug}`);
      continue;
    }

    for (const model of modelList) {
      const existing = await db
        .select()
        .from(models)
        .where(eq(models.slug, model.slug))
        .limit(1);

      const data = { ...model, organizationId };

      if (existing.length > 0) {
        await db
          .update(models)
          .set(data)
          .where(eq(models.slug, model.slug));
        results.push({ name: model.name, action: "updated" });
      } else {
        await db.insert(models).values(data);
        results.push({ name: model.name, action: "created" });
      }
    }
  }

  return results;
}

export async function runFullSeed() {
  console.log("Starting full database seed...");

  const categoriesResult = await seedCategories();
  const orgsResult = await seedOrganizations();
  const benchmarksResult = await seedBenchmarks();
  const modelsResult = await seedModels();

  return {
    categories: categoriesResult.length,
    organizations: orgsResult.length,
    benchmarks: benchmarksResult.length,
    models: modelsResult.length,
  };
}
