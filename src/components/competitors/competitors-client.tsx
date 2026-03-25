"use client";

import { useState, useMemo, useTransition } from "react";
import { Users, TrendingUp, Activity, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AddCompetitorDialog } from "@/components/competitors/add-competitor-dialog";
import { CompetitorTable } from "@/components/competitors/competitor-table";
import { CompetitorDetail } from "@/components/competitors/competitor-detail";
import {
  aggregateCompetitor,
  type Competitor,
} from "@/lib/competitor-data";
import {
  createCompetitor,
  deleteCompetitor,
} from "@/lib/actions/competitors";
import { formatNumber } from "@/lib/utils";

interface CompetitorsClientProps {
  initialCompetitors: Competitor[];
}

export function CompetitorsClient({ initialCompetitors }: CompetitorsClientProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>(initialCompetitors);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const rows = useMemo(() => competitors.map(aggregateCompetitor), [competitors]);

  const selectedCompetitor = useMemo(
    () => competitors.find((c) => c.id === selectedId) ?? null,
    [competitors, selectedId]
  );

  const overviewStats = useMemo(() => {
    const allAccounts = competitors.flatMap((c) => c.accounts);
    const totalFollowers = allAccounts.reduce((s, a) => s + a.followers, 0);
    const avgEngagement = allAccounts.length
      ? parseFloat(
          (allAccounts.reduce((s, a) => s + a.engagementRate, 0) / allAccounts.length).toFixed(1)
        )
      : 0;
    const avgGrowth = allAccounts.length
      ? parseFloat(
          (allAccounts.reduce((s, a) => s + a.followersGrowth, 0) / allAccounts.length).toFixed(1)
        )
      : 0;
    const totalPostsPerWeek = parseFloat(
      allAccounts.reduce((s, a) => s + a.postsPerWeek, 0).toFixed(1)
    );
    return { totalFollowers, avgEngagement, avgGrowth, totalPostsPerWeek };
  }, [competitors]);

  function handleAdd(competitor: Competitor) {
    const tempId = crypto.randomUUID();
    const optimistic: Competitor = { ...competitor, id: tempId };
    setCompetitors((prev) => [...prev, optimistic]);

    startTransition(async () => {
      const created = await createCompetitor({
        name: competitor.name,
        notes: competitor.notes,
        accounts: competitor.accounts.map((a) => ({
          platform: a.platform,
          handle: a.handle,
        })),
      });

      if (created) {
        setCompetitors((prev) =>
          prev.map((c) => (c.id === tempId ? created : c))
        );
      } else {
        setCompetitors((prev) => prev.filter((c) => c.id !== tempId));
      }
    });
  }

  function handleDelete(id: string) {
    setCompetitors((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) setSelectedId(null);
    startTransition(async () => {
      await deleteCompetitor(id);
    });
  }

  function handleSelect(id: string) {
    setSelectedId(selectedId === id ? null : id);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitor Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Monitor competitor activity, content strategy, and performance across platforms.
          </p>
        </div>
        <AddCompetitorDialog onAdd={handleAdd} />
      </div>

      {/* Overview stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Users className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{competitors.length}</p>
              <p className="text-xs text-muted-foreground">Competitors tracked</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatNumber(overviewStats.totalFollowers)}</p>
              <p className="text-xs text-muted-foreground">Combined followers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Activity className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overviewStats.avgEngagement}%</p>
              <p className="text-xs text-muted-foreground">Avg engagement rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Zap className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overviewStats.totalPostsPerWeek}</p>
              <p className="text-xs text-muted-foreground">Total posts / week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table + detail layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className={selectedCompetitor ? "lg:col-span-3" : "lg:col-span-5"}>
          <CompetitorTable
            rows={rows}
            onSelect={handleSelect}
            selectedId={selectedId}
          />
        </div>
        {selectedCompetitor && (
          <div className="lg:col-span-2">
            <CompetitorDetail
              competitor={selectedCompetitor}
              onClose={() => setSelectedId(null)}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
}
