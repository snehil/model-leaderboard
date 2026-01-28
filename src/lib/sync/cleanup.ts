/**
 * Data Cleanup Utilities
 *
 * Strategies to stay within Neon free tier (0.5 GB):
 * 1. Keep only last 30 days of snapshots
 * 2. Limit sync logs to last 7 days
 * 3. Remove orphaned records
 * 4. Run cleanup weekly via GitHub Actions
 */

import { db } from "@/lib/db";
import { leaderboardSnapshots, syncLogs, benchmarkResults } from "@/lib/db/schema";
import { lt, sql } from "drizzle-orm";

const SNAPSHOT_RETENTION_DAYS = 30;
const SYNC_LOG_RETENTION_DAYS = 7;

export async function cleanupOldSnapshots() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - SNAPSHOT_RETENTION_DAYS);

  const result = await db
    .delete(leaderboardSnapshots)
    .where(lt(leaderboardSnapshots.snapshotDate, cutoffDate));

  return { deletedSnapshots: result.rowCount ?? 0 };
}

export async function cleanupOldSyncLogs() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - SYNC_LOG_RETENTION_DAYS);

  const result = await db
    .delete(syncLogs)
    .where(lt(syncLogs.startedAt, cutoffDate));

  return { deletedLogs: result.rowCount ?? 0 };
}

export async function cleanupOrphanedResults() {
  // Delete benchmark results where model or benchmark no longer exists
  const result = await db.execute(sql`
    DELETE FROM benchmark_results
    WHERE model_id NOT IN (SELECT id FROM models)
       OR benchmark_id NOT IN (SELECT id FROM benchmarks)
  `);

  return { deletedOrphans: result.rowCount ?? 0 };
}

export async function getStorageEstimate() {
  // Get approximate row counts for monitoring
  const counts = await db.execute(sql`
    SELECT
      (SELECT COUNT(*) FROM organizations) as organizations,
      (SELECT COUNT(*) FROM models) as models,
      (SELECT COUNT(*) FROM benchmarks) as benchmarks,
      (SELECT COUNT(*) FROM benchmark_results) as results,
      (SELECT COUNT(*) FROM leaderboard_snapshots) as snapshots,
      (SELECT COUNT(*) FROM sync_logs) as sync_logs
  `);

  return counts.rows[0];
}

export async function runFullCleanup() {
  console.log("Starting data cleanup...");

  const snapshots = await cleanupOldSnapshots();
  console.log(`Deleted ${snapshots.deletedSnapshots} old snapshots`);

  const logs = await cleanupOldSyncLogs();
  console.log(`Deleted ${logs.deletedLogs} old sync logs`);

  const orphans = await cleanupOrphanedResults();
  console.log(`Deleted ${orphans.deletedOrphans} orphaned results`);

  const storage = await getStorageEstimate();
  console.log("Current row counts:", storage);

  return {
    ...snapshots,
    ...logs,
    ...orphans,
    storage,
  };
}

/**
 * Free Tier Limits and Recommendations:
 *
 * Neon Free Tier:
 * - 0.5 GB storage
 * - 1 project, 10 branches
 * - Compute auto-suspends after 5 min inactivity
 *
 * Estimated storage per record:
 * - Organization: ~500 bytes
 * - Model: ~2 KB
 * - Benchmark: ~1 KB
 * - Result: ~200 bytes
 * - Snapshot: ~5 KB (varies by benchmark)
 *
 * With 0.5 GB, you can store approximately:
 * - 100 organizations
 * - 500 models
 * - 100 benchmarks
 * - 50,000 results (500 models x 100 benchmarks)
 * - 3,000 snapshots (100 benchmarks x 30 days)
 *
 * This should be sufficient for tracking all major AI models.
 */
