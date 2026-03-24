import type {
  DailyMetric,
  AnalyticsSummary,
  InstagramPostMetrics,
} from "./types";

function generateDailyMetrics(from: Date, to: Date): DailyMetric[] {
  const data: DailyMetric[] = [];
  const current = new Date(from);
  let followers = 14820;

  while (current <= to) {
    const dayOfWeek = current.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Simulate realistic patterns: weekdays perform better
    const baseImpressions = isWeekend ? 1800 : 3200;
    const baseReach = isWeekend ? 1200 : 2100;
    const baseEngagement = isWeekend ? 2.8 : 4.2;

    const jitter = (base: number, variance: number) =>
      Math.round(base + (Math.random() - 0.5) * 2 * variance);

    const followerChange = Math.round(Math.random() * 18 - 3);
    followers += followerChange;

    const month = current.toLocaleString("en-US", { month: "short" });
    const day = current.getDate();

    data.push({
      date: `${month} ${day}`,
      rawDate: current.toISOString().split("T")[0],
      impressions: jitter(baseImpressions, 800),
      reach: jitter(baseReach, 500),
      engagement: parseFloat(
        (baseEngagement + (Math.random() - 0.5) * 1.5).toFixed(1)
      ),
      followers,
    });

    current.setDate(current.getDate() + 1);
  }

  return data;
}

function computeSummary(
  data: DailyMetric[],
  previousData: DailyMetric[]
): AnalyticsSummary {
  const sum = (arr: DailyMetric[], key: keyof DailyMetric) =>
    arr.reduce((acc, d) => acc + (d[key] as number), 0);
  const avg = (arr: DailyMetric[], key: keyof DailyMetric) =>
    arr.length ? sum(arr, key) / arr.length : 0;

  const totalImpressions = sum(data, "impressions");
  const prevImpressions = sum(previousData, "impressions");
  const totalReach = sum(data, "reach");
  const prevReach = sum(previousData, "reach");
  const avgEngagement = avg(data, "engagement");
  const prevEngagement = avg(previousData, "engagement");
  const totalFollowers = data.length ? data[data.length - 1].followers : 0;
  const prevFollowers = previousData.length
    ? previousData[previousData.length - 1].followers
    : 0;

  const delta = (current: number, prev: number) =>
    prev === 0 ? 0 : parseFloat((((current - prev) / prev) * 100).toFixed(1));

  return {
    totalImpressions,
    impressionsDelta: delta(totalImpressions, prevImpressions),
    avgEngagementRate: parseFloat(avgEngagement.toFixed(1)),
    engagementDelta: delta(avgEngagement, prevEngagement),
    totalFollowers,
    followersDelta: delta(totalFollowers, prevFollowers),
    totalReach,
    reachDelta: delta(totalReach, prevReach),
  };
}

const MOCK_TOP_POSTS: InstagramPostMetrics[] = [
  {
    id: "p1",
    caption: "Spring collection is live! Link in bio 🌸",
    type: "carousel",
    published: "2026-03-15",
    likes: 842,
    comments: 63,
    impressions: 12480,
    reach: 8920,
    engagement: 7.2,
    saved: 156,
    videoviews: 0,
    interactions: 905,
  },
  {
    id: "p2",
    caption: "How we pack your orders with care 📦",
    type: "reel",
    published: "2026-03-12",
    likes: 1247,
    comments: 89,
    impressions: 18650,
    reach: 14200,
    engagement: 8.1,
    saved: 234,
    videoviews: 15800,
    interactions: 1336,
  },
  {
    id: "p3",
    caption: "Throwback to our first ever pop-up event",
    type: "image",
    published: "2026-03-10",
    likes: 523,
    comments: 31,
    impressions: 7840,
    reach: 5670,
    engagement: 5.4,
    saved: 67,
    videoviews: 0,
    interactions: 554,
  },
  {
    id: "p4",
    caption: "Meet the team behind the brand — episode 1",
    type: "reel",
    published: "2026-03-08",
    likes: 956,
    comments: 72,
    impressions: 14200,
    reach: 10800,
    engagement: 6.8,
    saved: 189,
    videoviews: 12400,
    interactions: 1028,
  },
  {
    id: "p5",
    caption: "Your Monday dose of motivation ✨",
    type: "image",
    published: "2026-03-03",
    likes: 678,
    comments: 45,
    impressions: 9120,
    reach: 6840,
    engagement: 5.9,
    saved: 98,
    videoviews: 0,
    interactions: 723,
  },
];

export function getMockAnalytics(from: Date, to: Date) {
  // Generate data for the selected range
  const dailyMetrics = generateDailyMetrics(from, to);

  // Generate previous period for comparison
  const rangeDays = Math.round(
    (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
  );
  const prevFrom = new Date(from);
  prevFrom.setDate(prevFrom.getDate() - rangeDays);
  const prevTo = new Date(from);
  prevTo.setDate(prevTo.getDate() - 1);
  const previousMetrics = generateDailyMetrics(prevFrom, prevTo);

  const summary = computeSummary(dailyMetrics, previousMetrics);

  return {
    dailyMetrics,
    summary,
    topPosts: MOCK_TOP_POSTS,
  };
}
