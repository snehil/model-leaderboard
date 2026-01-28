import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { benchmarkCategories, models, benchmarks } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Test database connection
    const categoriesResult = await db.select().from(benchmarkCategories);
    const modelsResult = await db.select().from(models);
    const benchmarksResult = await db.select().from(benchmarks);

    return NextResponse.json({
      status: "ok",
      database: "connected",
      counts: {
        categories: categoriesResult.length,
        models: modelsResult.length,
        benchmarks: benchmarksResult.length,
      },
      categoryNames: categoriesResult.map((c) => c.slug),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
