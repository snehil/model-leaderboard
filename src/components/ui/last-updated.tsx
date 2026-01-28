"use client";

import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface LastUpdatedProps {
  timestamp?: Date | string | null;
  className?: string;
}

export function LastUpdated({ timestamp, className }: LastUpdatedProps) {
  const date = timestamp ? new Date(timestamp) : new Date();

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs text-muted-foreground",
        className
      )}
    >
      <RefreshCw className="h-3 w-3" />
      <span>
        Last updated: {formattedDate} at {formattedTime}
      </span>
    </div>
  );
}
