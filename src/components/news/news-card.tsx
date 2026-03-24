import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock } from "lucide-react";
import { type NewsItem, TOPIC_CONFIG } from "@/lib/news-data";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  item: NewsItem;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NewsCard({ item }: NewsCardProps) {
  const topic = TOPIC_CONFIG[item.topic];

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <Card className="transition-all hover:bg-accent/20 hover:border-accent/40 group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {/* Topic + source row */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={cn("text-[10px] px-1.5 py-0", topic.bgColor, topic.color, topic.borderColor)}
                >
                  {topic.label}
                </Badge>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {item.source}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-2.5 w-2.5" />
                  {timeAgo(item.publishedAt)}
                </span>
              </div>

              {/* Headline */}
              <h3 className="text-sm font-semibold leading-snug mb-1.5 group-hover:text-primary transition-colors">
                {item.title}
              </h3>

              {/* Summary */}
              {item.summary && (
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              )}

              {/* Full date */}
              <p className="text-[11px] text-muted-foreground/60 mt-2">
                {formatDate(item.publishedAt)}
              </p>
            </div>

            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors mt-1" />
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
