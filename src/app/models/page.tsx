import { Suspense } from "react";
import { Box } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ModelsList } from "@/components/models";
import { getModels, getOrganizations } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Models",
  description: "Browse all AI models tracked in the leaderboard.",
};

async function ModelsContent() {
  try {
    const [models, organizations] = await Promise.all([
      getModels(),
      getOrganizations(),
    ]);

    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Box className="h-8 w-8 text-primary" />
            Models
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse {models.length} AI models from {organizations.length}{" "}
            organizations
          </p>
        </div>

        {/* Models List with Filters */}
        <ModelsList models={models} organizationCount={organizations.length} />
      </div>
    );
  } catch (error) {
    console.error("Failed to load models:", error);
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Box className="h-8 w-8 text-primary" />
            Models
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse AI models from various organizations
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Unable to load models data. Please check database connection.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

function ModelsSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-72" />
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
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-20 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ModelsPage() {
  return (
    <Suspense fallback={<ModelsSkeleton />}>
      <ModelsContent />
    </Suspense>
  );
}
