import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rss } from "lucide-react";
import { RSS_SOURCES, TOPIC_CONFIG } from "@/lib/news-data";
import { cn } from "@/lib/utils";

interface SourceSidebarProps {
  feedStatus: Record<string, number>; // sourceId -> item count
}

export function SourceSidebar({ feedStatus }: SourceSidebarProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Rss className="h-4 w-4 text-muted-foreground" />
            RSS Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {RSS_SOURCES.map((source) => {
            const topic = TOPIC_CONFIG[source.topic];
            const count = feedStatus[source.id] ?? 0;
            return (
              <div
                key={source.id}
                className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent/20 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{source.name}</p>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] mt-0.5 px-1 py-0", topic.bgColor, topic.color, topic.borderColor)}
                  >
                    {topic.label}
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums shrink-0 ml-2">
                  {count} {count === 1 ? "item" : "items"}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground leading-relaxed">
            News is aggregated from public RSS feeds and refreshed on each page
            load. Articles are categorized by topic for quick filtering.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
