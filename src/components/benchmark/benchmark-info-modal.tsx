"use client";

import { ExternalLink, FileText, Globe, Database } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BenchmarkInfoTooltip } from "./benchmark-info-tooltip";
import type { BenchmarkWithCategory } from "@/types";

interface BenchmarkInfoModalProps {
  benchmark: BenchmarkWithCategory;
  children?: React.ReactNode;
}

export function BenchmarkInfoModal({
  benchmark,
  children,
}: BenchmarkInfoModalProps) {
  const hasLinks =
    benchmark.paperUrl || benchmark.websiteUrl || benchmark.datasetUrl;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ?? (
          <BenchmarkInfoTooltip benchmark={benchmark}>
            <button className="inline-flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
              {benchmark.name}
            </button>
          </BenchmarkInfoTooltip>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl">{benchmark.name}</DialogTitle>
              {benchmark.category && (
                <Badge variant="secondary" className="mt-2">
                  {benchmark.category.name}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">
                {benchmark.metricName}
                {benchmark.metricUnit && ` (${benchmark.metricUnit})`}
              </Badge>
              {benchmark.isSaturated && (
                <Badge variant="outline" className="text-amber-600">
                  Saturated
                </Badge>
              )}
            </div>
          </div>
          {benchmark.description && (
            <DialogDescription className="text-base mt-2">
              {benchmark.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* What It Evaluates */}
          {benchmark.whatItEvaluates && (
            <section>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                What It Evaluates
              </h3>
              <p className="text-sm leading-relaxed">
                {benchmark.whatItEvaluates}
              </p>
            </section>
          )}

          {/* Methodology */}
          {benchmark.methodology && (
            <section>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                Methodology
              </h3>
              <p className="text-sm leading-relaxed">{benchmark.methodology}</p>
            </section>
          )}

          {/* Scoring */}
          <section>
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
              Scoring
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Metric:</span>{" "}
                <span className="font-medium">
                  {benchmark.metricName}
                  {benchmark.metricUnit && ` (${benchmark.metricUnit})`}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Direction:</span>{" "}
                <span className="font-medium">
                  {benchmark.higherIsBetter ? "Higher is better" : "Lower is better"}
                </span>
              </div>
              {benchmark.maxScore && (
                <div>
                  <span className="text-muted-foreground">Max Score:</span>{" "}
                  <span className="font-medium">{benchmark.maxScore}</span>
                </div>
              )}
            </div>
          </section>

          {/* Links */}
          {hasLinks && (
            <>
              <Separator />
              <section>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  Resources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {benchmark.paperUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={benchmark.paperUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Paper
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {benchmark.websiteUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={benchmark.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {benchmark.datasetUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={benchmark.datasetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Database className="h-4 w-4 mr-2" />
                        Dataset
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
