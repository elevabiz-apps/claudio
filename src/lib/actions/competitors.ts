"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Competitor, SocialAccount } from "@/lib/competitor-data";

// ── helpers ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowsToCompetitor(competitorRow: any, accountRows: any[]): Competitor {
  return {
    id: competitorRow.id,
    name: competitorRow.name,
    notes: competitorRow.notes ?? "",
    addedAt: (competitorRow.created_at as string).split("T")[0],
    accounts: accountRows.map((a) => ({
      platform: a.platform,
      handle: a.handle,
      followers: a.followers ?? 0,
      followersGrowth: a.followers_growth ?? 0,
      engagementRate: a.engagement_rate ?? 0,
      postsPerWeek: a.posts_per_week ?? 0,
      lastPostDate: a.last_post_date ?? "",
    })),
    recentPosts: [], // not stored in DB
  };
}

// ── queries ──────────────────────────────────────────────────────────────────

export async function getCompetitors(): Promise<Competitor[]> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: competitorRows, error: cErr } = await supabase
    .from("competitors")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (cErr || !competitorRows?.length) return [];

  const competitorIds = competitorRows.map((c) => c.id);

  const { data: accountRows, error: aErr } = await supabase
    .from("competitor_accounts")
    .select("*")
    .in("competitor_id", competitorIds);

  if (aErr) console.error("getCompetitors accounts error:", aErr.message);

  const accountsByCompetitor: Record<string, typeof accountRows> = {};
  for (const acc of accountRows ?? []) {
    if (!accountsByCompetitor[acc.competitor_id]) {
      accountsByCompetitor[acc.competitor_id] = [];
    }
    accountsByCompetitor[acc.competitor_id]!.push(acc);
  }

  return competitorRows.map((row) =>
    rowsToCompetitor(row, accountsByCompetitor[row.id] ?? [])
  );
}

// ── mutations ────────────────────────────────────────────────────────────────

export async function createCompetitor(input: {
  name: string;
  notes: string;
  accounts: { platform: SocialAccount["platform"]; handle: string }[];
}): Promise<Competitor | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Insert competitor
  const { data: comp, error: cErr } = await supabase
    .from("competitors")
    .insert({ user_id: user.id, name: input.name, notes: input.notes })
    .select()
    .single();

  if (cErr || !comp) {
    console.error("createCompetitor error:", cErr?.message);
    return null;
  }

  // Insert accounts
  const accountInserts = input.accounts
    .filter((a) => a.handle.trim())
    .map((a) => ({
      competitor_id: comp.id,
      platform: a.platform,
      handle: a.handle.trim(),
      followers: 0,
      followers_growth: 0,
      engagement_rate: 0,
      posts_per_week: 0,
      last_post_date: null,
    }));

  let insertedAccounts: SocialAccount[] = [];
  if (accountInserts.length > 0) {
    const { data: accs, error: aErr } = await supabase
      .from("competitor_accounts")
      .insert(accountInserts)
      .select();

    if (aErr) console.error("createCompetitor accounts error:", aErr.message);
    insertedAccounts = (accs ?? []).map((a) => ({
      platform: a.platform,
      handle: a.handle,
      followers: a.followers ?? 0,
      followersGrowth: a.followers_growth ?? 0,
      engagementRate: a.engagement_rate ?? 0,
      postsPerWeek: a.posts_per_week ?? 0,
      lastPostDate: a.last_post_date ?? "",
    }));
  }

  revalidatePath("/competitors");

  return {
    id: comp.id,
    name: comp.name,
    notes: comp.notes ?? "",
    addedAt: comp.created_at.split("T")[0],
    accounts: insertedAccounts,
    recentPosts: [],
  };
}

export async function updateCompetitorNotes(
  id: string,
  notes: string
): Promise<void> {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("competitors")
    .update({ notes })
    .eq("id", id);

  if (error) console.error("updateCompetitorNotes error:", error.message);
  revalidatePath("/competitors");
}

export async function updateCompetitorAccount(
  accountId: string,
  updates: Partial<{
    followers: number;
    followers_growth: number;
    engagement_rate: number;
    posts_per_week: number;
    last_post_date: string;
  }>
): Promise<void> {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("competitor_accounts")
    .update(updates)
    .eq("id", accountId);

  if (error) console.error("updateCompetitorAccount error:", error.message);
  revalidatePath("/competitors");
}

export async function deleteCompetitor(id: string): Promise<void> {
  const supabase = await createServerSupabase();
  // RLS + cascade will handle accounts deletion
  const { error } = await supabase
    .from("competitors")
    .delete()
    .eq("id", id);

  if (error) console.error("deleteCompetitor error:", error.message);
  revalidatePath("/competitors");
}
