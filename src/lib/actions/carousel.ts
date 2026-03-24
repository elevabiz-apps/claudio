"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

export interface CarouselSlide {
  id: string;
  backgroundType: "solid" | "gradient";
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: "to bottom" | "to right" | "to bottom right";
  elements: CarouselElement[];
}

export interface CarouselElement {
  id: string;
  type: "text" | "subtitle" | "body";
  text: string;
  color: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  x: number; // percentage 0–100
  y: number; // percentage 0–100
  align: "left" | "center" | "right";
}

export interface CarouselDesign {
  id: string;
  title: string;
  slides: CarouselSlide[];
  created_at: string;
  updated_at: string;
}

export async function getCarouselDesigns(): Promise<CarouselDesign[]> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("carousel_designs")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getCarouselDesigns error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    slides: row.slides as unknown as CarouselSlide[],
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export async function saveCarouselDesign(input: {
  id?: string;
  title: string;
  slides: CarouselSlide[];
}): Promise<string | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  if (input.id) {
    // Update existing
    const { error } = await supabase
      .from("carousel_designs")
      .update({ title: input.title, slides: input.slides as unknown as Json })
      .eq("id", input.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("saveCarouselDesign update error:", error.message);
      return null;
    }
    revalidatePath("/carousel");
    return input.id;
  } else {
    // Insert new
    const { data, error } = await supabase
      .from("carousel_designs")
      .insert({ user_id: user.id, title: input.title, slides: input.slides as unknown as Json })
      .select("id")
      .single();

    if (error || !data) {
      console.error("saveCarouselDesign insert error:", error?.message);
      return null;
    }
    revalidatePath("/carousel");
    return data.id;
  }
}

export async function deleteCarouselDesign(id: string): Promise<void> {
  const supabase = await createServerSupabase();
  const { error } = await supabase
    .from("carousel_designs")
    .delete()
    .eq("id", id);

  if (error) console.error("deleteCarouselDesign error:", error.message);
  revalidatePath("/carousel");
}
