export type Platform =
  | "instagram"
  | "youtube"
  | "tiktok"
  | "twitter"
  | "linkedin"
  | "facebook";

export type ContentStatus = "scheduled" | "published" | "draft";

export type ContentType = "image" | "carousel" | "reel" | "video" | "story" | "short" | "post";

export interface CalendarItem {
  id: string;
  title: string;
  platform: Platform;
  status: ContentStatus;
  contentType: ContentType;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
}

export const PLATFORM_CONFIG: Record<
  Platform,
  { label: string; color: string; bgColor: string; borderColor: string }
> = {
  instagram: {
    label: "Instagram",
    color: "text-pink-400",
    bgColor: "bg-pink-500/15",
    borderColor: "border-pink-500/30",
  },
  youtube: {
    label: "YouTube",
    color: "text-red-400",
    bgColor: "bg-red-500/15",
    borderColor: "border-red-500/30",
  },
  tiktok: {
    label: "TikTok",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/15",
    borderColor: "border-cyan-500/30",
  },
  twitter: {
    label: "X / Twitter",
    color: "text-sky-400",
    bgColor: "bg-sky-500/15",
    borderColor: "border-sky-500/30",
  },
  linkedin: {
    label: "LinkedIn",
    color: "text-blue-400",
    bgColor: "bg-blue-500/15",
    borderColor: "border-blue-500/30",
  },
  facebook: {
    label: "Facebook",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/15",
    borderColor: "border-indigo-500/30",
  },
};

export const SAMPLE_CALENDAR_ITEMS: CalendarItem[] = [
  // March 2026 — published
  { id: "c1", title: "Spring collection launch", platform: "instagram", status: "published", contentType: "carousel", date: "2026-03-02", time: "10:00" },
  { id: "c2", title: "Spring lookbook video", platform: "youtube", status: "published", contentType: "video", date: "2026-03-02", time: "14:00" },
  { id: "c3", title: "Quick tip: styling spring pieces", platform: "tiktok", status: "published", contentType: "short", date: "2026-03-03", time: "12:00" },
  { id: "c4", title: "Industry news roundup", platform: "twitter", status: "published", contentType: "post", date: "2026-03-04", time: "09:00" },
  { id: "c5", title: "Team spotlight: March", platform: "linkedin", status: "published", contentType: "post", date: "2026-03-05", time: "11:00" },
  { id: "c6", title: "BTS photoshoot reel", platform: "instagram", status: "published", contentType: "reel", date: "2026-03-07", time: "18:00" },
  { id: "c7", title: "Customer review highlight", platform: "facebook", status: "published", contentType: "post", date: "2026-03-08", time: "10:00" },
  { id: "c8", title: "Weekend vibes story", platform: "instagram", status: "published", contentType: "story", date: "2026-03-08", time: "11:00" },
  { id: "c9", title: "How-to: spring outfits 2026", platform: "youtube", status: "published", contentType: "video", date: "2026-03-10", time: "15:00" },
  { id: "c10", title: "Midweek motivation", platform: "twitter", status: "published", contentType: "post", date: "2026-03-11", time: "08:00" },
  { id: "c11", title: "Product close-up series #1", platform: "instagram", status: "published", contentType: "image", date: "2026-03-12", time: "10:00" },
  { id: "c12", title: "LinkedIn article: brand building", platform: "linkedin", status: "published", contentType: "post", date: "2026-03-13", time: "09:00" },
  { id: "c13", title: "Flash sale announcement", platform: "instagram", status: "published", contentType: "story", date: "2026-03-14", time: "16:00" },
  { id: "c14", title: "Flash sale — FB ad", platform: "facebook", status: "published", contentType: "post", date: "2026-03-14", time: "16:30" },
  { id: "c15", title: "Packing orders ASMR", platform: "tiktok", status: "published", contentType: "short", date: "2026-03-17", time: "13:00" },
  { id: "c16", title: "Product close-up series #2", platform: "instagram", status: "published", contentType: "image", date: "2026-03-19", time: "10:00" },
  { id: "c17", title: "Q&A with founder", platform: "youtube", status: "published", contentType: "video", date: "2026-03-20", time: "14:00" },
  { id: "c18", title: "Community poll", platform: "twitter", status: "published", contentType: "post", date: "2026-03-21", time: "11:00" },

  // March 2026 — scheduled (upcoming)
  { id: "c19", title: "New arrivals teaser", platform: "instagram", status: "scheduled", contentType: "carousel", date: "2026-03-24", time: "10:00" },
  { id: "c20", title: "Arrivals unboxing", platform: "tiktok", status: "scheduled", contentType: "short", date: "2026-03-24", time: "15:00" },
  { id: "c21", title: "Weekly thread: trends", platform: "twitter", status: "scheduled", contentType: "post", date: "2026-03-25", time: "09:00" },
  { id: "c22", title: "Behind the design process", platform: "youtube", status: "scheduled", contentType: "video", date: "2026-03-26", time: "14:00" },
  { id: "c23", title: "Founder's note on LinkedIn", platform: "linkedin", status: "scheduled", contentType: "post", date: "2026-03-26", time: "10:00" },
  { id: "c24", title: "Weekend story takeover", platform: "instagram", status: "scheduled", contentType: "story", date: "2026-03-28", time: "09:00" },
  { id: "c25", title: "FB community event promo", platform: "facebook", status: "scheduled", contentType: "post", date: "2026-03-28", time: "12:00" },
  { id: "c26", title: "Monthly recap reel", platform: "instagram", status: "scheduled", contentType: "reel", date: "2026-03-30", time: "18:00" },
  { id: "c27", title: "March wrap-up thread", platform: "twitter", status: "scheduled", contentType: "post", date: "2026-03-31", time: "10:00" },
  { id: "c28", title: "Sneak peek: April collection", platform: "tiktok", status: "scheduled", contentType: "short", date: "2026-03-31", time: "17:00" },

  // Drafts (no time, shown dimmer)
  { id: "c29", title: "Earth day campaign idea", platform: "instagram", status: "draft", contentType: "carousel", date: "2026-03-27" },
  { id: "c30", title: "Podcast snippet for YT shorts", platform: "youtube", status: "draft", contentType: "short", date: "2026-03-29" },

  // April overflow to show month nav works
  { id: "c31", title: "April Fools prank reel", platform: "instagram", status: "scheduled", contentType: "reel", date: "2026-04-01", time: "08:00" },
  { id: "c32", title: "April campaign kickoff", platform: "facebook", status: "scheduled", contentType: "post", date: "2026-04-01", time: "10:00" },
  { id: "c33", title: "Spring cleaning tips thread", platform: "twitter", status: "scheduled", contentType: "post", date: "2026-04-02", time: "09:00" },
];
