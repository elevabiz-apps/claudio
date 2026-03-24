"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { CalendarItem, Platform, ContentStatus, ContentType } from "@/lib/calendar-data";

// ── helpers ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToItem(row: any): CalendarItem {
  return {
    id: row.id,
    title: row.title,
    platform: row.platform as Platform,
    status: row.status as ContentStatus,
    contentType: row.content_type as ContentType,
    date: row.date,
    time: row.time ?? undefined,
  };
}

// ── queries ──────────────────────────────────────────────────────────────────

export async function getCalendarItems(): Promise<CalendarItem[]> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("calendar_items")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  if (error) {
    console.error("getCalendarItems error:", error.message);
    return [];
  }

  return (data ?? []).map(rowToItem);
}

// ── mutations ────────────────────────────────────────────────────────────────

export async function createCalendarItem(input: {
  title: string;
  platform: Platform;
  status: ContentStatus;
  contentType: ContentType;
  date: string;
  time?: string;
}): Promise<CalendarItem | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("calendar_items")
    .insert({
      user_id: user.id,
      title: input.title,
      platform: input.platform,
      status: input.status,
      content_type: input.contentType,
      date: input.date,
      time: input.time ?? null,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("createCalendarItem error:", error?.message);
    return null;
  }

  revalidatePath("/calendar");
  return rowToItem(data);
}

export async function updateCalendarItem(
  id: string,
  updates: Partial<{
    title: string;
    platform: Platform;
    status: ContentStatus;
    content_type: string;
    date: string;
    time: string | null;
  }>
): Promise<void> {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("calendar_items")
    .update(updates)
    .eq("id", id);

  if (error) console.error("updateCalendarItem error:", error.message);
  revalidatePath("/calendar");
}

export async function deleteCalendarItem(id: string): Promise<void> {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("calendar_items")
    .delete()
    .eq("id", id);

  if (error) console.error("deleteCalendarItem error:", error.message);
  revalidatePath("/calendar");
}
