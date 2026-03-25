"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type { InstagramPost, PostStatus } from "@/lib/instagram-data";

// ── helpers ────────────────────────────────────────────────────────────────

type InstagramPostRow = Database["public"]["Tables"]["instagram_posts"]["Row"];

function rowToPost(row: InstagramPostRow): InstagramPost {
  return {
    id: row.id,
    caption: row.caption,
    postType: row.post_type,
    status: row.status,
    scheduledDate: row.scheduled_date ?? undefined,
    publishedDate: row.published_date ?? undefined,
    createdAt: row.created_at.split("T")[0],
    tags: row.tags ?? [],
  };
}

// ── queries ─────────────────────────────────────────────────────────────────

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("instagram_posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getInstagramPosts error:", error.message);
    return [];
  }

  return (data ?? []).map(rowToPost);
}

// ── mutations ────────────────────────────────────────────────────────────────

export async function createInstagramPost(input: {
  caption: string;
  postType: "image" | "carousel" | "reel" | "story";
  status: "scheduled" | "draft" | "published" | "backlog";
  scheduledDate?: string;
}): Promise<InstagramPost | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("instagram_posts")
    .insert({
      user_id: user.id,
      caption: input.caption,
      post_type: input.postType,
      status: input.status,
      scheduled_date: input.scheduledDate ?? null,
      published_date: null,
      tags: [],
    })
    .select()
    .single();

  if (error || !data) {
    console.error("createInstagramPost error:", error?.message);
    return null;
  }

  revalidatePath("/instagram");
  return rowToPost(data);
}

export async function updateInstagramPostStatus(
  id: string,
  status: PostStatus
): Promise<void> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const extra =
    status === "published"
      ? { published_date: new Date().toISOString().split("T")[0] }
      : {};

  const { error } = await supabase
    .from("instagram_posts")
    .update({ status, ...extra })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) console.error("updateInstagramPostStatus error:", error.message);
  revalidatePath("/instagram");
}

export async function deleteInstagramPost(id: string): Promise<void> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("instagram_posts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) console.error("deleteInstagramPost error:", error.message);
  revalidatePath("/instagram");
}
