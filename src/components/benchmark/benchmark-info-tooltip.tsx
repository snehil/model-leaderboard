"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import type { BenchmarkWithCategory } from "@/types";

interface BenchmarkInfoTooltipProps {
  benchmark: BenchmarkWithCategory;
  children?: React.ReactNode;
}

export function BenchmarkInfoTooltip({
  benchmark,
  children,
}: BenchmarkInfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children ?? (
            <button className="inline-flex items-center gap-1 hover:text-primary transition-colors">
              {benchmark.name}
              <Info className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="start"
          className="max-w-sm p-4 space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold">{benchmark.name}</h4>
            {benchmark.category && (
              <Badge variant="secondary" className="text-xs">
                {benchmark.category.name}
              </Badge>
            )}
          </div>

          {benchmark.description && (
            <p className="text-sm text-muted-foreground">
              {benchmark.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <span>
              Metric: <span className="font-medium">{benchmark.metricName}</span>
              {benchmark.metricUnit && ` (${benchmark.metricUnit})`}
            </span>
            {benchmark.isSaturated && (
              <Badge variant="outline" className="text-xs text-amber-600">
                Saturated
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground italic">
            Click for full details
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
