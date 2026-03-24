"use client";

import {
  Camera,
  Images,
  Film,
  Clock,
  CalendarDays,
  MoreHorizontal,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  InstagramPost,
  PostType,
  PostStatus,
} from "@/lib/instagram-data";
import { POST_TYPE_LABELS, STATUS_LABELS } from "@/lib/instagram-data";

const typeIcons: Record<PostType, typeof Camera> = {
  image: Camera,
  carousel: Images,
  reel: Film,
  story: Clock,
};

const statusColors: Record<PostStatus, string> = {
  scheduled: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  draft: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  published: "bg-green-500/15 text-green-400 border-green-500/20",
  backlog: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

interface PostCardProps {
  post: InstagramPost;
  onDelete: (id: string) => void;
  onMove: (id: string, status: PostStatus) => void;
}

const moveTargets: Record<PostStatus, PostStatus[]> = {
  backlog: ["draft", "scheduled"],
  draft: ["scheduled", "backlog"],
  scheduled: ["draft", "backlog"],
  published: ["backlog"],
};

export function PostCard({ post, onDelete, onMove }: PostCardProps) {
  const Icon = typeIcons[post.postType];
  const dateLabel =
    post.status === "published"
      ? post.publishedDate
      : post.status === "scheduled"
        ? post.scheduledDate
        : post.createdAt;

  return (
    <Card className="group transition-colors hover:bg-accent/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug line-clamp-2">
                {post.caption}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={statusColors[post.status]}
                >
                  {STATUS_LABELS[post.status]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {POST_TYPE_LABELS[post.postType]}
                </span>
                {dateLabel && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {dateLabel}
                  </span>
                )}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              }
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moveTargets[post.status].map((target) => (
                <DropdownMenuItem
                  key={target}
                  onClick={() => onMove(post.id, target)}
                >
                  <ArrowRight className="h-4 w-4" />
                  Move to {STATUS_LABELS[target]}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(post.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
