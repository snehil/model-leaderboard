import { Suspense } from "react";
import Link from "next/link";
import { Building2, ExternalLink, Box } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getOrganizations, getModels } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Organizations",
  description: "Browse AI organizations and their models.",
};

async function OrganizationsContent() {
  const [organizations, models] = await Promise.all([
    getOrganizations(),
    getModels(),
  ]);

  // Count models per organization
  const modelCounts = models.reduce(
    (acc, model) => {
      const orgId = model.organizationId;
      if (orgId) {
        acc[orgId] = (acc[orgId] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  // Get models per organization for display
  const modelsByOrg = models.reduce(
    (acc, model) => {
      const orgId = model.organizationId;
      if (orgId) {
        if (!acc[orgId]) {
          acc[orgId] = [];
        }
        acc[orgId].push(model);
      }
      return acc;
    },
    {} as Record<string, typeof models>
  );

  // Sort organizations by model count
  const sortedOrgs = [...organizations].sort(
    (a, b) => (modelCounts[b.id] || 0) - (modelCounts[a.id] || 0)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          Organizations
        </h1>
        <p className="text-muted-foreground mt-1">
          {organizations.length} organizations building {models.length} AI models
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{organizations.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Total Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{models.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Avg Models/Org
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(models.length / organizations.length).toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Organizations Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedOrgs.map((org) => {
          const orgModels = modelsByOrg[org.id] || [];
          return (
            <Card key={org.slug} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg font-bold">
                      {org.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {org.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {org.description}
                  </p>
                )}

                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Box className="h-4 w-4" />
                      Models
                    </span>
                    <Badge variant="secondary">{orgModels.length}</Badge>
                  </div>

                  {orgModels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {orgModels.slice(0, 3).map((model) => (
                        <Link key={model.slug} href={`/models/${model.slug}`}>
                          <Badge
                            variant="outline"
                            className="text-xs hover:bg-secondary cursor-pointer"
                          >
                            {model.name}
                          </Badge>
                        </Link>
                      ))}
                      {orgModels.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{orgModels.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function OrganizationsSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72 mt-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-20 mt-1" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function OrganizationsPage() {
  return (
    <Suspense fallback={<OrganizationsSkeleton />}>
      <OrganizationsContent />
    </Suspense>
  );
}
