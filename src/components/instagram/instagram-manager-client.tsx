"use client";

import { useState, useMemo, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PostCard } from "@/components/instagram/post-card";
import { AddPostDialog } from "@/components/instagram/add-post-dialog";
import {
  STATUS_LABELS,
  type InstagramPost,
  type PostStatus,
} from "@/lib/instagram-data";
import {
  createInstagramPost,
  deleteInstagramPost,
  updateInstagramPostStatus,
} from "@/lib/actions/instagram";
import { CalendarClock, FileEdit, CheckCircle2, Inbox } from "lucide-react";

const statCards = [
  { key: "scheduled" as const, label: "Scheduled", icon: CalendarClock, color: "text-blue-400" },
  { key: "draft" as const, label: "Drafts", icon: FileEdit, color: "text-yellow-400" },
  { key: "published" as const, label: "Published", icon: CheckCircle2, color: "text-green-400" },
  { key: "backlog" as const, label: "Backlog", icon: Inbox, color: "text-zinc-400" },
];

interface InstagramManagerClientProps {
  initialPosts: InstagramPost[];
}

export function InstagramManagerClient({ initialPosts }: InstagramManagerClientProps) {
  const [posts, setPosts] = useState<InstagramPost[]>(initialPosts);
  const [, startTransition] = useTransition();

  const grouped = useMemo(() => {
    const groups: Record<PostStatus, InstagramPost[]> = {
      scheduled: [],
      draft: [],
      published: [],
      backlog: [],
    };
    for (const post of posts) {
      groups[post.status].push(post);
    }
    groups.scheduled.sort(
      (a, b) => (a.scheduledDate ?? "").localeCompare(b.scheduledDate ?? "")
    );
    groups.published.sort(
      (a, b) => (b.publishedDate ?? "").localeCompare(a.publishedDate ?? "")
    );
    return groups;
  }, [posts]);

  function handleAdd(postData: {
    caption: string;
    postType: "image" | "carousel" | "reel" | "story";
    status: PostStatus;
    scheduledDate?: string;
  }) {
    // Optimistic update
    const tempPost: InstagramPost = {
      id: crypto.randomUUID(),
      caption: postData.caption,
      postType: postData.postType,
      status: postData.status,
      scheduledDate: postData.scheduledDate,
      createdAt: new Date().toISOString().split("T")[0],
      tags: [],
    };
    setPosts((prev) => [tempPost, ...prev]);

    startTransition(async () => {
      const created = await createInstagramPost(postData);
      if (created) {
        // Replace temp entry with real DB record (has correct id)
        setPosts((prev) =>
          prev.map((p) => (p.id === tempPost.id ? created : p))
        );
      } else {
        // Rollback on failure
        setPosts((prev) => prev.filter((p) => p.id !== tempPost.id));
      }
    });
  }

  function handleDelete(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    startTransition(async () => {
      await deleteInstagramPost(id);
    });
  }

  function handleMove(id: string, newStatus: PostStatus) {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    startTransition(async () => {
      await updateInstagramPostStatus(id, newStatus);
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instagram Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage your content pipeline from idea to publish.
          </p>
        </div>
        <AddPostDialog onAdd={handleAdd} />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <Card key={key}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{grouped[key].length}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabbed content board */}
      <Tabs defaultValue="scheduled">
        <TabsList>
          <TabsTrigger value="scheduled">
            Scheduled
            <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[11px]">
              {grouped.scheduled.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts
            <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[11px]">
              {grouped.draft.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="published">
            Published
            <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[11px]">
              {grouped.published.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="backlog">
            Backlog
            <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[11px]">
              {grouped.backlog.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {(["scheduled", "draft", "published", "backlog"] as const).map(
          (status) => (
            <TabsContent key={status} value={status}>
              {grouped[status].length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-sm text-muted-foreground">
                      No {STATUS_LABELS[status].toLowerCase()} posts yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {grouped[status].map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onDelete={handleDelete}
                      onMove={handleMove}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
}
