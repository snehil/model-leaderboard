import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  jsonb,
  boolean,
  integer,
  decimal,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const modelTypeEnum = pgEnum("model_type", [
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
]);

export const licenseTypeEnum = pgEnum("license_type", [
  "proprietary",
  "open_source",
  "open_weights",
  "research_only",
]);

export const sourceTypeEnum = pgEnum("source_type", [
  "huggingface",
  "papers_with_code",
  "arxiv",
  "official",
  "github",
  "manual",
  "community",
]);

// Organizations (OpenAI, Anthropic, Meta, etc.)
export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    website: text("website"),
    logoUrl: text("logo_url"),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [uniqueIndex("organizations_slug_idx").on(table.slug)]
);

// AI Models
export const models = pgTable(
  "models",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    modelType: modelTypeEnum("model_type").notNull(),
    licenseType: licenseTypeEnum("license_type").notNull(),

    // Model metadata
    releaseDate: timestamp("release_date"),
    parameters: varchar("parameters", { length: 50 }), // "70B", "8x7B", etc.
    contextLength: integer("context_length"),

    // Links (non-obtrusive)
    huggingfaceUrl: text("huggingface_url"),
    githubUrl: text("github_url"),
    paperUrl: text("paper_url"),
    apiUrl: text("api_url"),
    documentationUrl: text("documentation_url"),

    // Additional metadata
    description: text("description"),
    architecture: varchar("architecture", { length: 255 }), // "Transformer", "MoE", etc.
    trainingDataCutoff: timestamp("training_data_cutoff"),
    isActive: boolean("is_active").default(true),

    // JSON for flexible additional data
    metadata: jsonb("metadata"), // pricing, capabilities, etc.

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [uniqueIndex("models_slug_idx").on(table.slug)]
);

// Benchmark Categories
export const benchmarkCategories = pgTable(
  "benchmark_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 50 }), // Icon name for UI
    displayOrder: integer("display_order").default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [uniqueIndex("benchmark_categories_slug_idx").on(table.slug)]
);

// Benchmarks
export const benchmarks = pgTable(
  "benchmarks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    categoryId: uuid("category_id").references(() => benchmarkCategories.id),

    // Benchmark metadata
    description: text("description"), // Short description for tooltips
    whatItEvaluates: text("what_it_evaluates"), // Skills/capabilities tested
    methodology: text("methodology"), // How the benchmark works
    paperUrl: text("paper_url"),
    websiteUrl: text("website_url"),
    datasetUrl: text("dataset_url"),

    // Scoring
    metricName: varchar("metric_name", { length: 100 }).notNull(), // "accuracy", "WER", "pass@1"
    metricUnit: varchar("metric_unit", { length: 50 }), // "%", "score", "ms"
    higherIsBetter: boolean("higher_is_better").default(true),
    maxScore: decimal("max_score", { precision: 10, scale: 4 }),

    // Status
    isActive: boolean("is_active").default(true),
    isSaturated: boolean("is_saturated").default(false), // Mark if benchmark is "solved"

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [uniqueIndex("benchmarks_slug_idx").on(table.slug)]
);

// Benchmark Results
export const benchmarkResults = pgTable("benchmark_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  modelId: uuid("model_id")
    .references(() => models.id)
    .notNull(),
  benchmarkId: uuid("benchmark_id")
    .references(() => benchmarks.id)
    .notNull(),

  // Score data
  score: decimal("score", { precision: 10, scale: 4 }).notNull(),
  scoreNormalized: decimal("score_normalized", { precision: 5, scale: 4 }), // 0-1 scale

  // Evaluation details
  evaluationDate: timestamp("evaluation_date"),
  sourceType: sourceTypeEnum("source_type").notNull(),
  sourceUrl: text("source_url"),

  // Additional context
  notes: text("notes"),
  evaluationConfig: jsonb("evaluation_config"), // shots, prompts, etc.
  isVerified: boolean("is_verified").default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Model Categories (many-to-many for models that span multiple categories)
export const modelCategories = pgTable("model_categories", {
  modelId: uuid("model_id")
    .references(() => models.id)
    .notNull(),
  categoryId: uuid("category_id")
    .references(() => benchmarkCategories.id)
    .notNull(),
});

// Historical Snapshots (for tracking improvement over time)
export const leaderboardSnapshots = pgTable("leaderboard_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  benchmarkId: uuid("benchmark_id")
    .references(() => benchmarks.id)
    .notNull(),
  snapshotDate: timestamp("snapshot_date").notNull(),
  rankings: jsonb("rankings").notNull(), // Array of {model_id, rank, score}
  createdAt: timestamp("created_at").defaultNow(),
});

// Data Sources (for tracking where data comes from)
export const dataSources = pgTable("data_sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  sourceType: sourceTypeEnum("source_type").notNull(),
  apiEndpoint: text("api_endpoint"),
  lastSynced: timestamp("last_synced"),
  syncFrequency: varchar("sync_frequency", { length: 50 }), // "daily", "hourly"
  isActive: boolean("is_active").default(true),
  config: jsonb("config"), // API keys, filters, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Sync Logs
export const syncLogs = pgTable("sync_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: uuid("source_id").references(() => dataSources.id),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  status: varchar("status", { length: 50 }).notNull(), // "running", "success", "failed"
  recordsProcessed: integer("records_processed").default(0),
  recordsCreated: integer("records_created").default(0),
  recordsUpdated: integer("records_updated").default(0),
  errorMessage: text("error_message"),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  models: many(models),
}));

export const modelsRelations = relations(models, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [models.organizationId],
    references: [organizations.id],
  }),
  benchmarkResults: many(benchmarkResults),
  modelCategories: many(modelCategories),
}));

export const benchmarkCategoriesRelations = relations(
  benchmarkCategories,
  ({ many }) => ({
    benchmarks: many(benchmarks),
    modelCategories: many(modelCategories),
  })
);

export const benchmarksRelations = relations(benchmarks, ({ one, many }) => ({
  category: one(benchmarkCategories, {
    fields: [benchmarks.categoryId],
    references: [benchmarkCategories.id],
  }),
  results: many(benchmarkResults),
  snapshots: many(leaderboardSnapshots),
}));

export const benchmarkResultsRelations = relations(
  benchmarkResults,
  ({ one }) => ({
    model: one(models, {
      fields: [benchmarkResults.modelId],
      references: [models.id],
    }),
    benchmark: one(benchmarks, {
      fields: [benchmarkResults.benchmarkId],
      references: [benchmarks.id],
    }),
  })
);

export const modelCategoriesRelations = relations(
  modelCategories,
  ({ one }) => ({
    model: one(models, {
      fields: [modelCategories.modelId],
      references: [models.id],
    }),
    category: one(benchmarkCategories, {
      fields: [modelCategories.categoryId],
      references: [benchmarkCategories.id],
    }),
  })
);

export const leaderboardSnapshotsRelations = relations(
  leaderboardSnapshots,
  ({ one }) => ({
    benchmark: one(benchmarks, {
      fields: [leaderboardSnapshots.benchmarkId],
      references: [benchmarks.id],
    }),
  })
);

export const dataSourcesRelations = relations(dataSources, ({ many }) => ({
  syncLogs: many(syncLogs),
}));

export const syncLogsRelations = relations(syncLogs, ({ one }) => ({
  source: one(dataSources, {
    fields: [syncLogs.sourceId],
    references: [dataSources.id],
  }),
}));

// Type exports
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type Model = typeof models.$inferSelect;
export type NewModel = typeof models.$inferInsert;
export type BenchmarkCategory = typeof benchmarkCategories.$inferSelect;
export type NewBenchmarkCategory = typeof benchmarkCategories.$inferInsert;
export type Benchmark = typeof benchmarks.$inferSelect;
export type NewBenchmark = typeof benchmarks.$inferInsert;
export type BenchmarkResult = typeof benchmarkResults.$inferSelect;
export type NewBenchmarkResult = typeof benchmarkResults.$inferInsert;
export type LeaderboardSnapshot = typeof leaderboardSnapshots.$inferSelect;
export type NewLeaderboardSnapshot = typeof leaderboardSnapshots.$inferInsert;
export type DataSource = typeof dataSources.$inferSelect;
export type NewDataSource = typeof dataSources.$inferInsert;
export type SyncLog = typeof syncLogs.$inferSelect;
export type NewSyncLog = typeof syncLogs.$inferInsert;

// Enum type exports
export type ModelType = (typeof modelTypeEnum.enumValues)[number];
export type LicenseType = (typeof licenseTypeEnum.enumValues)[number];
export type SourceType = (typeof sourceTypeEnum.enumValues)[number];
