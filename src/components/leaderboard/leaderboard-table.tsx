"use client";

import Link from "next/link";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  ExternalLinkIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry, BenchmarkWithCategory } from "@/types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  benchmark?: BenchmarkWithCategory | null;
  showBenchmarkColumn?: boolean;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold">
        1
      </Badge>
    );
  }
  if (rank === 2) {
    return (
      <Badge className="bg-gray-400 hover:bg-gray-500 text-white font-bold">
        2
      </Badge>
    );
  }
  if (rank === 3) {
    return (
      <Badge className="bg-amber-700 hover:bg-amber-800 text-white font-bold">
        3
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="font-medium">
      {rank}
    </Badge>
  );
}

function RankChange({
  current,
  previous,
}: {
  current: number;
  previous?: number;
}) {
  if (!previous) return null;

  const diff = previous - current;

  if (diff > 0) {
    return (
      <span className="flex items-center text-green-600 text-xs">
        <ArrowUpIcon className="h-3 w-3" />
        {diff}
      </span>
    );
  }
  if (diff < 0) {
    return (
      <span className="flex items-center text-red-600 text-xs">
        <ArrowDownIcon className="h-3 w-3" />
        {Math.abs(diff)}
      </span>
    );
  }
  return (
    <span className="text-muted-foreground text-xs">
      <MinusIcon className="h-3 w-3" />
    </span>
  );
}

function formatScore(score: number, metricUnit?: string): string {
  if (metricUnit === "%") {
    return `${score.toFixed(1)}%`;
  }
  return score.toFixed(2);
}

export function LeaderboardTable({
  entries,
  benchmark,
  showBenchmarkColumn = false,
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No results found.</p>
        <p className="text-sm mt-1">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Rank</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead className="w-24">Type</TableHead>
            <TableHead className="w-24">License</TableHead>
            <TableHead className="text-right w-32">Score</TableHead>
            {showBenchmarkColumn && <TableHead className="w-40">Benchmark</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow
              key={`${entry.model.id}-${entry.rank}`}
              className={cn(
                entry.rank <= 3 && "bg-muted/30"
              )}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <RankBadge rank={entry.rank} />
                  <RankChange
                    current={entry.rank}
                    previous={entry.previousRank}
                  />
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`/models/${entry.model.slug}`}
                  className="font-medium hover:underline flex items-center gap-2"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {entry.model.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {entry.model.name}
                </Link>
              </TableCell>
              <TableCell>
                {entry.model.organization ? (
                  <Link
                    href={`/organizations/${entry.model.organization.slug}`}
                    className="text-muted-foreground hover:text-foreground hover:underline"
                  >
                    {entry.model.organization.name}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Unknown</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize text-xs">
                  {entry.model.modelType.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    entry.model.licenseType === "open_source" ||
                    entry.model.licenseType === "open_weights"
                      ? "default"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {entry.model.licenseType.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono font-semibold">
                {formatScore(entry.score, benchmark?.metricUnit ?? "%")}
              </TableCell>
              {showBenchmarkColumn && (
                <TableCell className="text-muted-foreground text-sm">
                  {/* Placeholder for benchmark name if needed */}
                  -
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
