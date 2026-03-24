import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Images,
  Film,
  Heart,
  MessageCircle,
  Eye,
  Bookmark,
} from "lucide-react";
import type { InstagramPostMetrics } from "@/lib/metricool/types";

const typeIcons: Record<string, typeof Camera> = {
  image: Camera,
  carousel: Images,
  reel: Film,
};

const typeColors: Record<string, string> = {
  image: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  carousel: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  reel: "bg-pink-500/15 text-pink-400 border-pink-500/20",
};

interface TopPostsProps {
  posts: InstagramPostMetrics[];
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function TopPosts({ posts }: TopPostsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Performing Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {posts.map((post, index) => {
          const Icon = typeIcons[post.type] ?? Camera;
          return (
            <div
              key={post.id}
              className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-accent/30"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug line-clamp-1">
                  {post.caption}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <Badge
                    variant="outline"
                    className={`text-[11px] ${typeColors[post.type] ?? ""}`}
                  >
                    <Icon className="mr-1 h-3 w-3" />
                    {post.type}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    {formatNumber(post.impressions)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="h-3 w-3" />
                    {formatNumber(post.likes)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="h-3 w-3" />
                    {post.comments}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Bookmark className="h-3 w-3" />
                    {post.saved}
                  </span>
                  <span className="text-xs font-medium text-emerald-400">
                    {post.engagement}% eng.
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
