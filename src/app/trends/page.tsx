import { Suspense } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Trophy,
  Target,
  Zap,
  Award,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCategories,
  getBenchmarks,
  getModels,
  getOverallLeaderboard,
} from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trends",
  description: "Track AI model performance trends and insights.",
};

async function TrendsContent() {
  const [categories, benchmarks, models, topModels] = await Promise.all([
    getCategories(),
    getBenchmarks(),
    getModels(),
    getOverallLeaderboard(undefined, 10),
  ]);

  // Calculate stats
  const openSourceModels = models.filter(
    (m) => m.licenseType === "open_source" || m.licenseType === "open_weights"
  );
  const proprietaryModels = models.filter(
    (m) => m.licenseType === "proprietary"
  );
  const saturatedBenchmarks = benchmarks.filter((b) => b.isSaturated);
  const activeBenchmarks = benchmarks.filter((b) => b.isActive);

  // Group models by type
  const modelsByType = models.reduce(
    (acc, model) => {
      acc[model.modelType] = (acc[model.modelType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Sort model types by count
  const sortedModelTypes = Object.entries(modelsByType).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          Trends & Insights
        </h1>
        <p className="text-muted-foreground mt-1">
          AI model performance trends and ecosystem analysis
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Total Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{models.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tracked across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeBenchmarks.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {saturatedBenchmarks.length} saturated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Open Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{openSourceModels.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {((openSourceModels.length / models.length) * 100).toFixed(0)}% of
              all models
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{categories.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              LLM, Vision, Code & more
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Models */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Performing Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Avg Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topModels.map((entry) => (
                  <TableRow key={entry.model.id}>
                    <TableCell>
                      <Badge
                        variant={entry.rank <= 3 ? "default" : "outline"}
                        className={
                          entry.rank === 1
                            ? "bg-yellow-500"
                            : entry.rank === 2
                              ? "bg-gray-400"
                              : entry.rank === 3
                                ? "bg-amber-700"
                                : ""
                        }
                      >
                        {entry.rank}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/models/${entry.model.slug}`}
                        className="flex items-center gap-2 hover:text-primary"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {entry.model.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{entry.model.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.model.organization?.name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize text-xs">
                        {entry.model.modelType.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {(Number(entry.avgScore) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Model Distribution by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Models by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedModelTypes.map(([type, count]) => {
                const percentage = (count / models.length) * 100;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium capitalize">
                        {type.replace("_", " ")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Benchmark Saturation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Benchmark Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">Active Benchmarks</p>
                  <p className="text-sm text-muted-foreground">
                    Still differentiating models
                  </p>
                </div>
                <Badge variant="default" className="text-lg px-3 py-1">
                  {activeBenchmarks.length - saturatedBenchmarks.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-amber-500/10">
                <div>
                  <p className="font-medium">Saturated Benchmarks</p>
                  <p className="text-sm text-muted-foreground">
                    Near human-level performance
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-lg px-3 py-1 text-amber-600"
                >
                  {saturatedBenchmarks.length}
                </Badge>
              </div>

              {saturatedBenchmarks.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">
                    Saturated benchmarks:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {saturatedBenchmarks.map((b) => (
                      <Badge key={b.slug} variant="outline" className="text-xs">
                        {b.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Open vs Proprietary */}
      <Card>
        <CardHeader>
          <CardTitle>Open Source vs Proprietary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Open Source / Weights</h3>
                <Badge className="bg-green-500">{openSourceModels.length}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Models with publicly available weights or source code
              </p>
              <div className="flex flex-wrap gap-2">
                {openSourceModels.slice(0, 5).map((m) => (
                  <Link key={m.slug} href={`/models/${m.slug}`}>
                    <Badge
                      variant="outline"
                      className="hover:bg-secondary cursor-pointer"
                    >
                      {m.name}
                    </Badge>
                  </Link>
                ))}
                {openSourceModels.length > 5 && (
                  <Badge variant="outline">
                    +{openSourceModels.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
            <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Proprietary</h3>
                <Badge className="bg-blue-500">{proprietaryModels.length}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                API-only access, closed source models
              </p>
              <div className="flex flex-wrap gap-2">
                {proprietaryModels.slice(0, 5).map((m) => (
                  <Link key={m.slug} href={`/models/${m.slug}`}>
                    <Badge
                      variant="outline"
                      className="hover:bg-secondary cursor-pointer"
                    >
                      {m.name}
                    </Badge>
                  </Link>
                ))}
                {proprietaryModels.length > 5 && (
                  <Badge variant="outline">
                    +{proprietaryModels.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const categoryBenchmarks = benchmarks.filter(
                (b) => b.category?.slug === category.slug
              );
              return (
                <Link
                  key={category.slug}
                  href={`/leaderboard/${category.slug}`}
                  className="group"
                >
                  <div className="p-4 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {categoryBenchmarks.length} benchmarks
                      </Badge>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TrendsSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TrendsPage() {
  return (
    <Suspense fallback={<TrendsSkeleton />}>
      <TrendsContent />
    </Suspense>
  );
}
