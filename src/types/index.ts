import type {
  Model,
  Organization,
  Benchmark,
  BenchmarkCategory,
  BenchmarkResult,
  ModelType,
  LicenseType,
  SourceType,
} from "@/lib/db/schema";

// Re-export database types
export type {
  Model,
  Organization,
  Benchmark,
  BenchmarkCategory,
  BenchmarkResult,
  ModelType,
  LicenseType,
  SourceType,
};

// Extended types with relations
export interface ModelWithOrganization extends Model {
  organization: Organization | null;
}

export interface ModelWithResults extends ModelWithOrganization {
  benchmarkResults: BenchmarkResultWithBenchmark[];
}

export interface BenchmarkResultWithBenchmark extends BenchmarkResult {
  benchmark: Benchmark;
}

export interface BenchmarkResultWithModel extends BenchmarkResult {
  model: ModelWithOrganization;
}

export interface BenchmarkWithCategory extends Benchmark {
  category: BenchmarkCategory | null;
}

export interface BenchmarkWithResults extends BenchmarkWithCategory {
  results: BenchmarkResultWithModel[];
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  previousRank?: number;
  model: ModelWithOrganization;
  score: number;
  scoreNormalized: number;
  evaluationDate: Date | null;
  sourceType: SourceType;
}

export interface CategoryLeaderboard {
  category: BenchmarkCategory;
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

// Filter types
export interface LeaderboardFilters {
  modelTypes: ModelType[];
  organizations: string[];
  licenseTypes: LicenseType[];
  showInactive: boolean;
}

// Comparison types
export interface ModelComparison {
  models: ModelWithResults[];
  benchmarks: Benchmark[];
}

// Search types
export interface SearchResult {
  type: "model" | "benchmark" | "organization";
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  score: number;
  model?: string;
}

export interface RadarChartData {
  benchmark: string;
  fullMark: number;
  [modelSlug: string]: string | number;
}
