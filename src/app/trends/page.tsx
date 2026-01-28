import { Suspense } from "react";
import Link from "next/link";
import { TrendingUp, LineChart, Calendar, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getCategories, getBenchmarks, getModels } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trends",
  description: "Track AI model performance trends over time.",
};

async function TrendsContent() {
  const [categories, benchmarks, models] = await Promise.all([
    getCategories(),
    getBenchmarks(),
    getModels(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          Trends
        </h1>
        <p className="text-muted-foreground mt-1">
          Track how AI models improve over time across benchmarks
        </p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="py-8 text-center">
          <LineChart className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Trend Analysis Coming Soon</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            We're building comprehensive trend analysis with historical data,
            performance charts, and predictive insights. Track how models evolve
            and compare improvements over time.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="text-sm py-1">
              <Calendar className="h-3 w-3 mr-1" />
              Historical Snapshots
            </Badge>
            <Badge variant="secondary" className="text-sm py-1">
              <LineChart className="h-3 w-3 mr-1" />
              Performance Charts
            </Badge>
            <Badge variant="secondary" className="text-sm py-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Improvement Tracking
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Current Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Current Snapshot</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">
                Models Tracked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{models.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Across {categories.length} categories
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">
                Active Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {benchmarks.filter((b) => b.isActive).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Updated regularly
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">
                Saturated Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {benchmarks.filter((b) => b.isSaturated).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Near human-level performance
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground font-medium">
                Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-muted-foreground mt-1">
                HuggingFace, Papers, arXiv, Official
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Explore Current Data</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/leaderboard">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base">View Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See current model rankings across all benchmarks
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/benchmarks">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base">Explore Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn about each benchmark and what it measures
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/models">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base">Browse Models</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View detailed information for each AI model
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category.slug} href={`/leaderboard/${category.slug}`}>
              <Badge
                variant="outline"
                className="text-sm py-1.5 px-3 hover:bg-secondary cursor-pointer"
              >
                {category.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrendsSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>
      <Card>
        <CardContent className="py-8">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-16 w-96 mx-auto" />
        </CardContent>
      </Card>
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
