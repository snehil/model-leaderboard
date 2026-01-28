import { Suspense } from "react";
import { Layers, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BenchmarkInfoModal } from "@/components/benchmark";
import { getCategories, getBenchmarks } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Benchmarks",
  description: "Explore all AI benchmarks tracked in the leaderboard.",
};

async function BenchmarksContent() {
  try {
    const [categories, benchmarks] = await Promise.all([
      getCategories(),
      getBenchmarks(),
    ]);

  // Group benchmarks by category
  const benchmarksByCategory = benchmarks.reduce(
    (acc, benchmark) => {
      const categorySlug = benchmark.category?.slug || "uncategorized";
      if (!acc[categorySlug]) {
        acc[categorySlug] = {
          category: benchmark.category,
          benchmarks: [],
        };
      }
      acc[categorySlug].benchmarks.push(benchmark);
      return acc;
    },
    {} as Record<string, { category: typeof benchmarks[0]["category"]; benchmarks: typeof benchmarks }>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Layers className="h-8 w-8 text-primary" />
          Benchmarks
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore {benchmarks.length} benchmarks across {categories.length} categories
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Total Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{benchmarks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {benchmarks.filter((b) => b.isActive).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Saturated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {benchmarks.filter((b) => b.isSaturated).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benchmarks by Category */}
      <div className="space-y-6">
        {Object.entries(benchmarksByCategory).map(([slug, { category, benchmarks: categoryBenchmarks }]) => (
          <Card key={slug}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {category?.name || "Uncategorized"}
                </CardTitle>
                <Badge variant="secondary">
                  {categoryBenchmarks.length} benchmarks
                </Badge>
              </div>
              {category?.description && (
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryBenchmarks.map((benchmark) => (
                  <BenchmarkInfoModal key={benchmark.slug} benchmark={benchmark}>
                    <div className="p-4 rounded-lg border hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium">{benchmark.name}</h3>
                        {benchmark.isSaturated && (
                          <Badge variant="outline" className="text-xs text-amber-600">
                            Saturated
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {benchmark.description}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">
                          {benchmark.metricName}
                          {benchmark.metricUnit && ` (${benchmark.metricUnit})`}
                        </Badge>
                        {benchmark.paperUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <a
                              href={benchmark.paperUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </BenchmarkInfoModal>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  } catch (error) {
    console.error("Failed to load benchmarks:", error);
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Layers className="h-8 w-8 text-primary" />
            Benchmarks
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore AI benchmarks tracked in the leaderboard
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Unable to load benchmarks data. Please check database connection.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

function BenchmarksSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72 mt-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-32 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function BenchmarksPage() {
  return (
    <Suspense fallback={<BenchmarksSkeleton />}>
      <BenchmarksContent />
    </Suspense>
  );
}
