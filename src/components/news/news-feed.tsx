"use client";

import { useState, useMemo } from "react";
import { Search, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TopicFilter } from "./topic-filter";
import { NewsCard } from "./news-card";
import { SourceSidebar } from "./source-sidebar";
import { type NewsItem, type NewsTopic, TOPIC_CONFIG } from "@/lib/news-data";

interface NewsFeedProps {
  items: NewsItem[];
}

export function NewsFeed({ items }: NewsFeedProps) {
  const [selectedTopics, setSelectedTopics] = useState<Set<NewsTopic>>(
    new Set(["research", "business", "tools"])
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (!selectedTopics.has(item.topic)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, selectedTopics, searchQuery]);

  // Count items per source for the sidebar
  const feedStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item.sourceId] = (counts[item.sourceId] ?? 0) + 1;
    }
    return counts;
  }, [items]);

  // Count by topic
  const topicCounts = useMemo(() => {
    const counts: Record<NewsTopic, number> = { research: 0, business: 0, tools: 0 };
    for (const item of items) {
      counts[item.topic]++;
    }
    return counts;
  }, [items]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">News Consolidator</h1>
        <p className="text-muted-foreground mt-1">
          Latest nutritionist news aggregated from RSS feeds.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant="secondary" className="gap-1">
          <Newspaper className="h-3 w-3" />
          {items.length} articles
        </Badge>
        {(Object.entries(TOPIC_CONFIG) as [NewsTopic, typeof TOPIC_CONFIG.research][]).map(
          ([topic, config]) => (
            <Badge
              key={topic}
              variant="outline"
              className={`gap-1 text-[11px] ${config.bgColor} ${config.color} ${config.borderColor}`}
            >
              {topicCounts[topic]} {config.label.toLowerCase()}
            </Badge>
          )
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <TopicFilter selected={selectedTopics} onChange={setSelectedTopics} />
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-8 w-full sm:w-64 rounded-lg border border-input bg-transparent pl-8 pr-3 text-xs transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30"
          />
        </div>
      </div>

      {/* Content: feed + sidebar */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Newspaper className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "No articles match your search."
                  : "No articles for the selected topics."}
              </p>
            </div>
          ) : (
            filtered.map((item) => <NewsCard key={item.id} item={item} />)
          )}
        </div>

        <div className="hidden lg:block">
          <SourceSidebar feedStatus={feedStatus} />
        </div>
      </div>
    </div>
  );
}
