import { Suspense } from "react";
import Link from "next/link";
import { GitCompare, Plus, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { getModels, getBenchmarks } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Compare Models",
  description: "Compare AI models side-by-side across all benchmarks.",
};

async function CompareContent() {
  const [models, benchmarks] = await Promise.all([
    getModels(),
    getBenchmarks(),
  ]);

  // Group models by type for easier selection
  const modelsByType = models.reduce(
    (acc, model) => {
      const type = model.modelType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(model);
      return acc;
    },
    {} as Record<string, typeof models>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <GitCompare className="h-8 w-8 text-primary" />
          Compare Models
        </h1>
        <p className="text-muted-foreground mt-1">
          Select 2-5 models to compare side-by-side across benchmarks
        </p>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            How to Compare
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Select Models</p>
                <p className="text-sm text-muted-foreground">
                  Choose 2-5 models from the list below
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                2
              </div>
              <div>
                <p className="font-medium">View Comparison</p>
                <p className="text-sm text-muted-foreground">
                  See benchmark scores side-by-side
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Analyze</p>
                <p className="text-sm text-muted-foreground">
                  Identify strengths and trade-offs
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Click on any model below to add it to your comparison.
              The comparison table will appear once you select at least 2 models.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Model Selection */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Select Models to Compare</h2>

        {Object.entries(modelsByType).map(([type, typeModels]) => (
          <Card key={type}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base capitalize">
                  {type.replace("_", " ")} Models
                </CardTitle>
                <Badge variant="secondary">{typeModels.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {typeModels.map((model) => (
                  <Link
                    key={model.slug}
                    href={`/models/${model.slug}`}
                    className="group"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {model.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {model.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {model.organization?.name || "Unknown"}
                        </p>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benchmarks Reference */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Available Benchmarks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {benchmarks.map((benchmark) => (
              <Badge key={benchmark.slug} variant="outline">
                {benchmark.name}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {benchmarks.length} benchmarks available for comparison
          </p>
        </CardContent>
      </Card>

      {/* Coming Soon Notice */}
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <GitCompare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            Interactive Comparison Coming Soon
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're building an interactive comparison tool with radar charts,
            benchmark filters, and exportable reports. For now, visit individual
            model pages to see their benchmark scores.
          </p>
          <Button asChild className="mt-4">
            <Link href="/models">Browse Models</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CompareSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, j) => (
                  <Skeleton key={j} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareSkeleton />}>
      <CompareContent />
    </Suspense>
  );
}
