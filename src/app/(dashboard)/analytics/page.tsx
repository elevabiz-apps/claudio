"use client";

import { useState, useEffect } from "react";
import { Eye, Activity, Users, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/analytics/date-range-picker";
import { StatCard } from "@/components/analytics/stat-card";
import { ImpressionsChart } from "@/components/analytics/impressions-chart";
import { EngagementChart } from "@/components/analytics/engagement-chart";
import { FollowersChart } from "@/components/analytics/followers-chart";
import { TopPosts } from "@/components/analytics/top-posts";
import { fetchAnalytics } from "@/lib/actions/analytics";
import type { DateRange, DailyMetric, AnalyticsSummary, InstagramPostMetrics } from "@/lib/metricool/types";

function getDefaultRange(): DateRange {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return { from, to };
}

const emptySummary: AnalyticsSummary = {
  totalImpressions: 0,
  impressionsDelta: 0,
  avgEngagementRate: 0,
  engagementDelta: 0,
  totalFollowers: 0,
  followersDelta: 0,
  totalReach: 0,
  reachDelta: 0,
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultRange);
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetric[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary>(emptySummary);
  const [topPosts, setTopPosts] = useState<InstagramPostMetrics[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await fetchAnalytics(dateRange.from, dateRange.to);
      if (cancelled) return;
      setDailyMetrics(data.dailyMetrics);
      setSummary(data.summary);
      setTopPosts(data.topPosts);
      setIsLive(data.isLive);
      setMounted(true);
    }

    load();
    return () => { cancelled = true; };
  }, [dateRange]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            Content performance metrics from Metricool
            {mounted && (
              isLive ? (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-green-400 border-green-500/30 bg-green-500/10">
                  Live
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-yellow-400 border-yellow-500/30 bg-yellow-500/10">
                  Demo Data
                </Badge>
              )
            )}
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Summary stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Impressions"
          value={summary.totalImpressions.toLocaleString()}
          delta={summary.impressionsDelta}
          icon={Eye}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Engagement Rate"
          value={`${summary.avgEngagementRate}%`}
          delta={summary.engagementDelta}
          icon={Activity}
          iconColor="text-emerald-400"
        />
        <StatCard
          title="Total Followers"
          value={summary.totalFollowers.toLocaleString()}
          delta={summary.followersDelta}
          icon={Users}
          iconColor="text-orange-400"
        />
        <StatCard
          title="Total Reach"
          value={summary.totalReach.toLocaleString()}
          delta={summary.reachDelta}
          icon={Radio}
          iconColor="text-purple-400"
        />
      </div>

      {/* Charts grid */}
      <div className="grid gap-4 lg:grid-cols-2 mb-8">
        <ImpressionsChart data={dailyMetrics} />
        <EngagementChart data={dailyMetrics} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FollowersChart data={dailyMetrics} />
        <TopPosts posts={topPosts} />
      </div>
    </div>
  );
}
