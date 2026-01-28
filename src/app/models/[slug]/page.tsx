import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ExternalLink,
  Github,
  FileText,
  Globe,
  BookOpen,
  Calendar,
  Cpu,
  Hash,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BenchmarkInfoModal } from "@/components/benchmark";
import { getModelBySlug, getModelScores } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

interface ModelPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ModelPageProps) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);

  if (!model) {
    return { title: "Model Not Found" };
  }

  return {
    title: model.name,
    description:
      model.description ||
      `View benchmark scores and details for ${model.name}`,
  };
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "Unknown";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatContextLength(length: number | null | undefined): string {
  if (!length) return "Unknown";
  if (length >= 1000000) {
    return `${(length / 1000000).toFixed(1)}M`;
  }
  if (length >= 1000) {
    return `${(length / 1000).toFixed(0)}K`;
  }
  return length.toString();
}

async function ModelDetailContent({ slug }: { slug: string }) {
  const [model, scores] = await Promise.all([
    getModelBySlug(slug),
    getModelScores(slug),
  ]);

  if (!model) {
    notFound();
  }

  const hasLinks =
    model.huggingfaceUrl ||
    model.githubUrl ||
    model.paperUrl ||
    model.apiUrl ||
    model.documentationUrl;

  // Group scores by category
  const scoresByCategory = scores.reduce(
    (acc, score) => {
      const categoryName = score.benchmark.category?.name || "Uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(score);
      return acc;
    },
    {} as Record<string, typeof scores>
  );

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link href="/models">
        <Button variant="ghost" size="sm" className="-ml-2">
          <ChevronLeft className="h-4 w-4 mr-1" />
          All Models
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl font-bold">
              {model.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{model.name}</h1>
            {model.organization && (
              <Link
                href={`/organizations/${model.organization.slug}`}
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                {model.organization.name}
              </Link>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="capitalize">
                {model.modelType.replace("_", " ")}
              </Badge>
              <Badge
                variant={
                  model.licenseType === "open_source" ||
                  model.licenseType === "open_weights"
                    ? "default"
                    : "outline"
                }
              >
                {model.licenseType.replace("_", " ")}
              </Badge>
              {!model.isActive && <Badge variant="destructive">Inactive</Badge>}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        {hasLinks && (
          <div className="flex flex-wrap gap-2">
            {model.apiUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={model.apiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  API
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
            {model.huggingfaceUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={model.huggingfaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  HuggingFace
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
            {model.githubUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={model.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
            {model.paperUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={model.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Paper
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
            {model.documentationUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={model.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Docs
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {model.description && (
        <p className="text-muted-foreground max-w-3xl">{model.description}</p>
      )}

      {/* Model Specs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-md">
                <Hash className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parameters</p>
                <p className="font-medium">{model.parameters || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-md">
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Context Length</p>
                <p className="font-medium">
                  {formatContextLength(model.contextLength)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-md">
                <Scale className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Architecture</p>
                <p className="font-medium">{model.architecture || "Unknown"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Release Date</p>
                <p className="font-medium">{formatDate(model.releaseDate)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Results */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Benchmark Results</h2>

        {scores.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No benchmark results available yet.</p>
              <p className="text-sm mt-1">
                Results will appear here once the model is evaluated.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(scoresByCategory).map(
              ([categoryName, categoryScores]) => (
                <Card key={categoryName}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{categoryName}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Benchmark</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                            <TableHead className="text-right w-32">
                              Metric
                            </TableHead>
                            <TableHead className="w-24">Source</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryScores.map((score) => (
                            <TableRow key={score.id}>
                              <TableCell>
                                <BenchmarkInfoModal
                                  benchmark={{
                                    ...score.benchmark,
                                    category: score.benchmark.category || null,
                                  }}
                                >
                                  <button className="font-medium hover:text-primary transition-colors text-left">
                                    {score.benchmark.name}
                                  </button>
                                </BenchmarkInfoModal>
                              </TableCell>
                              <TableCell className="text-right font-mono font-semibold">
                                {Number(score.score).toFixed(1)}
                                {score.benchmark.metricUnit || ""}
                              </TableCell>
                              <TableCell className="text-right text-sm text-muted-foreground">
                                {score.benchmark.metricName}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {score.sourceType}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        )}
      </div>

      {/* Compare CTA */}
      <Separator />
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-semibold">Compare with other models</h3>
          <p className="text-sm text-muted-foreground">
            See how {model.name} stacks up against the competition
          </p>
        </div>
        <Button asChild>
          <Link href={`/compare?models=${model.slug}`}>Compare Models</Link>
        </Button>
      </div>
    </div>
  );
}

function ModelDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-32" />

      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-32 mt-1" />
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>

      <Skeleton className="h-16 w-full max-w-3xl" />

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10" />
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-16 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <Skeleton className="h-7 w-48 mb-4" />
        <Card>
          <CardContent className="py-6">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function ModelDetailPage({ params }: ModelPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ModelDetailSkeleton />}>
      <ModelDetailContent slug={slug} />
    </Suspense>
  );
}
