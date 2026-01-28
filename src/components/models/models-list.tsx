"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ModelWithOrganization } from "@/types";

interface ModelsListProps {
  models: ModelWithOrganization[];
  organizationCount: number;
}

export function ModelsList({ models, organizationCount }: ModelsListProps) {
  const [search, setSearch] = useState("");
  const [licenseFilter, setLicenseFilter] = useState<string>("all");

  // Filter models based on search and license type
  const filteredModels = models.filter((model) => {
    const matchesSearch =
      search === "" ||
      model.name.toLowerCase().includes(search.toLowerCase()) ||
      model.organization?.name.toLowerCase().includes(search.toLowerCase());

    const isOpenSource =
      model.licenseType === "open_source" || model.licenseType === "open_weights";

    const matchesLicense =
      licenseFilter === "all" ||
      (licenseFilter === "open" && isOpenSource) ||
      (licenseFilter === "proprietary" && model.licenseType === "proprietary");

    return matchesSearch && matchesLicense;
  });

  // Group filtered models by organization
  const modelsByOrg = filteredModels.reduce(
    (acc, model) => {
      const orgName = model.organization?.name || "Unknown";
      if (!acc[orgName]) {
        acc[orgName] = [];
      }
      acc[orgName].push(model);
      return acc;
    },
    {} as Record<string, ModelWithOrganization[]>
  );

  // Sort organizations by model count
  const sortedOrgs = Object.entries(modelsByOrg).sort(
    (a, b) => b[1].length - a[1].length
  );

  const openSourceCount = models.filter(
    (m) => m.licenseType === "open_source" || m.licenseType === "open_weights"
  ).length;
  const proprietaryCount = models.filter(
    (m) => m.licenseType === "proprietary"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header with Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models or organizations..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={licenseFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setLicenseFilter("all")}
          >
            All ({models.length})
          </Button>
          <Button
            variant={licenseFilter === "open" ? "default" : "outline"}
            size="sm"
            onClick={() => setLicenseFilter("open")}
            className={licenseFilter === "open" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Open Source ({openSourceCount})
          </Button>
          <Button
            variant={licenseFilter === "proprietary" ? "default" : "outline"}
            size="sm"
            onClick={() => setLicenseFilter("proprietary")}
          >
            Proprietary ({proprietaryCount})
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Showing Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {filteredModels.length}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / {models.length}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Organizations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{organizationCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Open Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{openSourceCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">
              Proprietary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{proprietaryCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Models by Organization */}
      {sortedOrgs.length > 0 ? (
        <div className="space-y-6">
          {sortedOrgs.map(([orgName, orgModels]) => (
            <Card key={orgName}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{orgName}</CardTitle>
                  <Badge variant="secondary">{orgModels.length} models</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {orgModels.map((model) => (
                    <Link
                      key={model.slug}
                      href={`/models/${model.slug}`}
                      className="group"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm font-medium">
                            {model.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate group-hover:text-primary transition-colors">
                            {model.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="text-xs capitalize"
                            >
                              {model.modelType.replace("_", " ")}
                            </Badge>
                            {(model.licenseType === "open_source" ||
                              model.licenseType === "open_weights") && (
                              <Badge
                                variant="outline"
                                className="text-xs text-green-600 border-green-600"
                              >
                                Open
                              </Badge>
                            )}
                            {model.parameters && (
                              <span className="text-xs text-muted-foreground">
                                {model.parameters}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No models found matching your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
