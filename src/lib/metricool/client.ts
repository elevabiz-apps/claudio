import type {
  MetricoolConfig,
  MetricoolDate,
  TimelinePoint,
  InstagramAggregations,
  InstagramPostMetrics,
} from "./types";

const BASE_URL = "https://app.metricool.com/api";

function formatDate(date: Date): MetricoolDate {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

async function metricoolFetch<T>(
  path: string,
  config: MetricoolConfig,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("userId", config.userId);
  url.searchParams.set("blogId", config.blogId);
  for (const [key, val] of Object.entries(params)) {
    url.searchParams.set(key, val);
  }

  const res = await fetch(url.toString(), {
    headers: { "X-Mc-Auth": config.userToken },
  });

  if (!res.ok) {
    throw new Error(`Metricool API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/** Fetch timeline series for a given metric */
export async function getTimeline(
  config: MetricoolConfig,
  metric: string,
  from: Date,
  to: Date
): Promise<TimelinePoint[]> {
  const raw = await metricoolFetch<[string, string][]>(
    `/stats/timeline/${metric}`,
    config,
    { start: formatDate(from), end: formatDate(to) }
  );

  return raw.map(([date, value]) => ({
    date,
    value: parseFloat(value) || 0,
  }));
}

/** Fetch aggregated value for a single metric */
export async function getAggregation(
  config: MetricoolConfig,
  metric: string,
  from: Date,
  to: Date
): Promise<number> {
  return metricoolFetch<number>(
    `/stats/aggregation/${metric}`,
    config,
    { start: formatDate(from), end: formatDate(to) }
  );
}

/** Fetch all aggregated Instagram metrics */
export async function getInstagramAggregations(
  config: MetricoolConfig,
  from: Date,
  to: Date
): Promise<InstagramAggregations> {
  return metricoolFetch<InstagramAggregations>(
    "/stats/aggregations/instagram",
    config,
    { start: formatDate(from), end: formatDate(to) }
  );
}

/** Fetch top Instagram posts sorted by a metric */
export async function getInstagramPosts(
  config: MetricoolConfig,
  from: Date,
  to: Date,
  sortBy: string = "impressions"
): Promise<InstagramPostMetrics[]> {
  return metricoolFetch<InstagramPostMetrics[]>(
    "/stats/instagram/posts",
    config,
    { start: formatDate(from), end: formatDate(to), sortcolumn: sortBy }
  );
}
