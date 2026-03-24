"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CompetitorRow } from "@/lib/competitor-data";

type SortKey = keyof Pick<
  CompetitorRow,
  "name" | "totalFollowers" | "avgEngagement" | "totalPostsPerWeek" | "avgGrowth" | "lastActive"
>;

type SortDir = "asc" | "desc";

interface CompetitorTableProps {
  rows: CompetitorRow[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toString();
}

const columns: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "name", label: "Competitor" },
  { key: "totalFollowers", label: "Followers", align: "right" },
  { key: "avgEngagement", label: "Avg Engagement", align: "right" },
  { key: "totalPostsPerWeek", label: "Posts / Week", align: "right" },
  { key: "avgGrowth", label: "Growth (30d)", align: "right" },
  { key: "lastActive", label: "Last Active" },
];

export function CompetitorTable({ rows, onSelect, selectedId }: CompetitorTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("totalFollowers");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDir === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });

  function SortIcon({ colKey }: { colKey: SortKey }) {
    if (sortKey !== colKey) return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />;
    return sortDir === "asc"
      ? <ArrowUp className="h-3 w-3" />
      : <ArrowDown className="h-3 w-3" />;
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={col.align === "right" ? "text-right" : ""}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 -ml-2 gap-1 text-xs font-medium hover:bg-transparent"
                  onClick={() => toggleSort(col.key)}
                >
                  {col.label}
                  <SortIcon colKey={col.key} />
                </Button>
              </TableHead>
            ))}
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => (
            <TableRow
              key={row.id}
              className={`cursor-pointer transition-colors ${selectedId === row.id ? "bg-accent/40" : ""}`}
              onClick={() => onSelect(row.id)}
            >
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{row.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.platformCount} platform{row.platformCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {formatNumber(row.totalFollowers)}
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {row.avgEngagement}%
              </TableCell>
              <TableCell className="text-right font-mono text-sm">
                {row.totalPostsPerWeek}
              </TableCell>
              <TableCell className="text-right">
                <span className={`inline-flex items-center gap-1 font-mono text-sm ${row.avgGrowth > 0 ? "text-green-400" : row.avgGrowth < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                  {row.avgGrowth > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : row.avgGrowth < 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  {row.avgGrowth > 0 ? "+" : ""}{row.avgGrowth}%
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {row.lastActive || "—"}
              </TableCell>
              <TableCell>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${selectedId === row.id ? "rotate-90" : ""}`} />
              </TableCell>
            </TableRow>
          ))}
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-sm text-muted-foreground">
                No competitors added yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
