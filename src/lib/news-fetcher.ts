"use server";

import Parser from "rss-parser";
import { RSS_SOURCES, SAMPLE_NEWS, type NewsItem, type RSSSource } from "./news-data";

const parser = new Parser({
  timeout: 8000,
  headers: {
    "User-Agent": "CLAUDIO/1.0 (Content Dashboard RSS Reader)",
  },
});

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "...";
}

async function fetchSingleFeed(source: RSSSource): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(source.feedUrl);
    return (feed.items ?? []).slice(0, 10).map((item, i) => {
      const rawSummary = item.contentSnippet || item.content || item.summary || "";
      const cleanSummary = truncate(stripHtml(rawSummary), 280);

      return {
        id: `${source.id}-${i}-${item.guid || item.link || i}`,
        title: item.title ?? "Untitled",
        summary: cleanSummary,
        url: item.link ?? "#",
        source: source.name,
        sourceId: source.id,
        topic: source.topic,
        publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        imageUrl: item.enclosure?.url,
      };
    });
  } catch (err) {
    console.error(`Failed to fetch feed: ${source.name} (${source.feedUrl})`, err);
    return [];
  }
}

export async function fetchAllFeeds(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    RSS_SOURCES.map((source) => fetchSingleFeed(source))
  );

  const items: NewsItem[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value);
    }
  }

  // If no feeds returned any items, fall back to sample data
  if (items.length === 0) {
    return SAMPLE_NEWS;
  }

  // Sort by date descending
  items.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return items;
}
