import { Suspense } from "react";
import Link from "next/link";
import { Trophy, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LastUpdated } from "@/components/ui/last-updated";
import { LeaderboardTable } from "@/components/leaderboard";
import { BenchmarkInfoModal } from "@/components/benchmark";
import {
  getCategories,
  getBenchmarks,
  getOverallLeaderboard,
} from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leaderboard",
  description:
    "View the top AI models ranked by performance across all benchmarks.",
};

async function LeaderboardContent() {
  try {
    const [categories, benchmarks, leaderboard] = await Promise.all([
      getCategories(),
      getBenchmarks(),
      getOverallLeaderboard(undefined, 20),
    ]);

    // Map leaderboard to LeaderboardEntry format
    const entries = leaderboard.map((item) => ({
      rank: item.rank,
      model: item.model,
      score: Number(item.avgScore) * 100, // Convert normalized to percentage
      scoreNormalized: Number(item.avgScore),
      evaluationDate: null,
      sourceType: "official" as const,
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Top AI models ranked by average performance across all benchmarks
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LastUpdated />
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Category Quick Links */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="default" className="cursor-pointer">
          All Categories
        </Badge>
        {categories.map((category) => (
          <Link key={category.slug} href={`/leaderboard/${category.slug}`}>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-secondary transition-colors"
            >
              {category.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Main Leaderboard */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Overall Rankings</CardTitle>
            <span className="text-sm text-muted-foreground">
              Based on {benchmarks.length} benchmarks
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <LeaderboardTable entries={entries} />
        </CardContent>
      </Card>

      {/* Category Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const categoryBenchmarks = benchmarks.filter(
              (b) => b.category?.slug === category.slug
            );
            return (
              <Link key={category.slug} href={`/leaderboard/${category.slug}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{category.name}</CardTitle>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {categoryBenchmarks.slice(0, 3).map((benchmark) => (
                        <BenchmarkInfoModal
                          key={benchmark.slug}
                          benchmark={benchmark}
                        >
                          <Badge
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-secondary/80"
                          >
                            {benchmark.name}
                          </Badge>
                        </BenchmarkInfoModal>
                      ))}
                      {categoryBenchmarks.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{categoryBenchmarks.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Top AI models ranked by average performance across all benchmarks
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Unable to load leaderboard data. Please check database connection.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>
      <div className="flex gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-24" />
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardContent />
    </Suspense>
  );
}
