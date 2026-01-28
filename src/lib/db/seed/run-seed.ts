/**
 * CLI script to seed the database
 *
 * Usage:
 *   source .env.local && npx tsx src/lib/db/seed/run-seed.ts
 * Or:
 *   DATABASE_URL="your-url" npx tsx src/lib/db/seed/run-seed.ts
 */

import { runFullSeed } from "./index";

async function main() {
  console.log("Starting database seed...\n");

  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL environment variable is not set");
    console.error("Please set it in your .env.local file");
    process.exit(1);
  }

  try {
    const result = await runFullSeed();
    console.log("\nSeed completed successfully!");
    console.log(`  Categories: ${result.categories}`);
    console.log(`  Organizations: ${result.organizations}`);
    console.log(`  Benchmarks: ${result.benchmarks}`);
    console.log(`  Models: ${result.models}`);
  } catch (error) {
    console.error("\nSeed failed:", error);
    process.exit(1);
  }
}

main();
