"use server";

import type { DailyMetric, AnalyticsSummary, InstagramPostMetrics } from "@/lib/metricool/types";
import { getMockAnalytics } from "@/lib/metricool/mock-data";
import {
  getTimeline,
  getInstagramAggregations,
  getInstagramPosts,
} from "@/lib/metricool/client";

// Check if real Metricool credentials are configured
function getMetricoolConfig() {
  const userToken = process.env.METRICOOL_USER_TOKEN;
  const userId = process.env.METRICOOL_USER_ID;
  const blogId = process.env.METRICOOL_BLOG_ID;

  if (userToken && userId && blogId) {
    return { userToken, userId, blogId };
  }
  return null;
}

export interface AnalyticsData {
  dailyMetrics: DailyMetric[];
  summary: AnalyticsSummary;
  topPosts: InstagramPostMetrics[];
  isLive: boolean;
}

export async function fetchAnalytics(from: Date, to: Date): Promise<AnalyticsData> {
  const config = getMetricoolConfig();

  // ── Real Metricool data ───────────────────────────────────────────────────
  if (config) {
    try {
      const [impressionsRaw, reachRaw, engagementRaw, followersRaw, aggregations, posts] =
        await Promise.all([
          getTimeline(config, "instagram_impressions", from, to),
          getTimeline(config, "instagram_reach", from, to),
          getTimeline(config, "instagram_engagement_rate", from, to),
          getTimeline(config, "instagram_followers", from, to),
          getInstagramAggregations(config, from, to),
          getInstagramPosts(config, from, to, "impressions"),
        ]);

      // Build a map from date → values for quick lookup
      const byDate = new Map<string, Partial<DailyMetric>>();
      const addPoint = (arr: typeof impressionsRaw, key: keyof DailyMetric) => {
        for (const p of arr) {
          const existing = byDate.get(p.date) ?? {};
          byDate.set(p.date, { ...existing, rawDate: p.date, [key]: p.value });
        }
      };
      addPoint(impressionsRaw, "impressions");
      addPoint(reachRaw, "reach");
      addPoint(engagementRaw, "engagement");
      addPoint(followersRaw, "followers");

      const dailyMetrics: DailyMetric[] = Array.from(byDate.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([rawDate, vals]) => {
          const d = new Date(rawDate);
          const month = d.toLocaleString("en-US", { month: "short" });
          return {
            date: `${month} ${d.getDate()}`,
            rawDate,
            impressions: vals.impressions ?? 0,
            reach: vals.reach ?? 0,
            engagement: vals.engagement ?? 0,
            followers: vals.followers ?? 0,
          };
        });

      // Build summary from aggregations
      const rangeMs = to.getTime() - from.getTime();
      const rangeDays = Math.round(rangeMs / (1000 * 60 * 60 * 24));
      const prevFrom = new Date(from.getTime() - rangeMs);
      const prevTo = new Date(from.getTime() - 86400000);

      let prevAgg = { impressions: 0, reach: 0, engagement: 0, followers: 0 };
      try {
        const prev = await getInstagramAggregations(config, prevFrom, prevTo);
        prevAgg = prev;
      } catch { /* ignore */ }

      const delta = (curr: number, prev: number) =>
        prev === 0 ? 0 : parseFloat((((curr - prev) / prev) * 100).toFixed(1));

      const summary: AnalyticsSummary = {
        totalImpressions: aggregations.impressions,
        impressionsDelta: delta(aggregations.impressions, prevAgg.impressions),
        avgEngagementRate: parseFloat(aggregations.engagement.toFixed(1)),
        engagementDelta: delta(aggregations.engagement, prevAgg.engagement),
        totalFollowers: aggregations.followers,
        followersDelta: delta(aggregations.followers, prevAgg.followers),
        totalReach: aggregations.reach,
        reachDelta: delta(aggregations.reach, prevAgg.reach),
      };

      void rangeDays; // suppress unused warning

      return { dailyMetrics, summary, topPosts: posts, isLive: true };
    } catch (err) {
      console.error("Metricool API error, falling back to mock data:", err);
    }
  }

  // ── Mock fallback ─────────────────────────────────────────────────────────
  const mock = getMockAnalytics(from, to);
  return { ...mock, isLive: false };
}
