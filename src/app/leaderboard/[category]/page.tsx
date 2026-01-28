import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, ChevronLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardTable } from "@/components/leaderboard";
import { BenchmarkInfoModal } from "@/components/benchmark";
import {
  getCategories,
  getBenchmarksByCategory,
  getOverallLeaderboard,
  getLeaderboardForBenchmark,
} from "@/lib/api/queries";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} Leaderboard`,
    description: category.description,
  };
}

async function CategoryLeaderboardContent({
  categorySlug,
}: {
  categorySlug: string;
}) {
  const [categories, benchmarks] = await Promise.all([
    getCategories(),
    getBenchmarksByCategory(categorySlug),
  ]);

  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  // Get overall leaderboard for this category
  const overallLeaderboard = await getOverallLeaderboard(categorySlug, 30);

  // Map to LeaderboardEntry format
  const overallEntries = overallLeaderboard.map((item) => ({
    rank: item.rank,
    model: item.model,
    score: Number(item.avgScore) * 100,
    scoreNormalized: Number(item.avgScore),
    evaluationDate: null,
    sourceType: "official" as const,
  }));

  // Get leaderboards for individual benchmarks (first 3 for display)
  const benchmarkLeaderboards = await Promise.all(
    benchmarks.slice(0, 5).map(async (benchmark) => ({
      benchmark,
      entries: await getLeaderboardForBenchmark(benchmark.slug, 10),
    }))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/leaderboard">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            All Categories
          </Button>
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Trophy className="h-8 w-8 text-primary" />
              {category.name}
            </h1>
            <p className="text-muted-foreground mt-1 max-w-2xl">
              {category.description}
            </p>
          </div>
          <Badge variant="secondary" className="text-sm self-start">
            {benchmarks.length} benchmarks
          </Badge>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2">
        <Link href="/leaderboard">
          <Badge
            variant="outline"
            className="cursor-pointer hover:bg-secondary transition-colors"
          >
            All
          </Badge>
        </Link>
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/leaderboard/${cat.slug}`}>
            <Badge
              variant={cat.slug === categorySlug ? "default" : "outline"}
              className="cursor-pointer hover:bg-secondary transition-colors"
            >
              {cat.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Benchmarks in this category */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            Benchmarks in this Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {benchmarks.map((benchmark) => (
              <BenchmarkInfoModal key={benchmark.slug} benchmark={benchmark}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 transition-colors"
                >
                  {benchmark.name}
                  {benchmark.isSaturated && (
                    <span className="ml-1 text-amber-600">*</span>
                  )}
                </Badge>
              </BenchmarkInfoModal>
            ))}
          </div>
          {benchmarks.some((b) => b.isSaturated) && (
            <p className="text-xs text-muted-foreground mt-3">
              * Saturated benchmarks may not effectively differentiate between
              top models
            </p>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="overall" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          {benchmarks.slice(0, 5).map((benchmark) => (
            <TabsTrigger key={benchmark.slug} value={benchmark.slug}>
              {benchmark.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overall">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {category.name} Overall Rankings
                </CardTitle>
                <span className="text-sm text-muted-foreground">
                  Average across {benchmarks.length} benchmarks
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <LeaderboardTable entries={overallEntries} />
            </CardContent>
          </Card>
        </TabsContent>

        {benchmarkLeaderboards.map(({ benchmark, entries }) => (
          <TabsContent key={benchmark.slug} value={benchmark.slug}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{benchmark.name}</CardTitle>
                    <BenchmarkInfoModal benchmark={benchmark}>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Info className="h-4 w-4" />
                      </Button>
                    </BenchmarkInfoModal>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline">
                      {benchmark.metricName}
                      {benchmark.metricUnit && ` (${benchmark.metricUnit})`}
                    </Badge>
                    {!benchmark.higherIsBetter && (
                      <span className="text-xs">Lower is better</span>
                    )}
                  </div>
                </div>
                {benchmark.description && (
                  <p className="text-sm text-muted-foreground">
                    {benchmark.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <LeaderboardTable entries={entries} benchmark={benchmark} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function CategoryLeaderboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-full max-w-xl mt-2" />
      </div>
      <div className="flex gap-2">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-24" />
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
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
    </div>
  );
}

export default async function CategoryLeaderboardPage({
  params,
}: CategoryPageProps) {
  const { category } = await params;

  return (
    <Suspense fallback={<CategoryLeaderboardSkeleton />}>
      <CategoryLeaderboardContent categorySlug={category} />
    </Suspense>
  );
}
