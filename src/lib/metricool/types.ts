// Metricool API date format: YYYYMMDD
export type MetricoolDate = string;

export interface MetricoolConfig {
  userToken: string;
  userId: string;
  blogId: string;
}

// Timeline data point: [dateOrTimestamp, value]
export interface TimelinePoint {
  date: string;
  value: number;
}

// Aggregated metrics from /stats/aggregations/instagram
export interface InstagramAggregations {
  impressions: number;
  reach: number;
  engagement: number;
  followers: number;
  profileViews: number;
  websiteClicks: number;
}

// Post data from /stats/instagram/posts
export interface InstagramPostMetrics {
  id: string;
  caption: string;
  type: string;
  published: string;
  likes: number;
  comments: number;
  impressions: number;
  reach: number;
  engagement: number;
  saved: number;
  videoviews: number;
  interactions: number;
  imageUrl?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

// Chart-ready data shapes
export interface DailyMetric {
  date: string;       // formatted display date e.g. "Mar 1"
  rawDate: string;    // YYYY-MM-DD
  impressions: number;
  reach: number;
  engagement: number;
  followers: number;
}

export interface AnalyticsSummary {
  totalImpressions: number;
  impressionsDelta: number;      // % change vs previous period
  avgEngagementRate: number;
  engagementDelta: number;
  totalFollowers: number;
  followersDelta: number;
  totalReach: number;
  reachDelta: number;
}
