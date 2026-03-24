export type SocialPlatform = "instagram" | "youtube" | "tiktok" | "twitter" | "linkedin" | "facebook";

export interface SocialAccount {
  platform: SocialPlatform;
  handle: string;
  followers: number;
  followersGrowth: number; // % over last 30d
  engagementRate: number;
  postsPerWeek: number;
  lastPostDate: string; // YYYY-MM-DD
}

export interface RecentPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
}

export interface Competitor {
  id: string;
  name: string;
  avatarUrl?: string;
  notes: string;
  accounts: SocialAccount[];
  recentPosts: RecentPost[];
  addedAt: string;
}

// Aggregated row for the table
export interface CompetitorRow {
  id: string;
  name: string;
  totalFollowers: number;
  avgEngagement: number;
  totalPostsPerWeek: number;
  avgGrowth: number;
  platformCount: number;
  lastActive: string;
  notes: string;
}

export const PLATFORM_META: Record<SocialPlatform, { label: string; color: string; bgColor: string; borderColor: string }> = {
  instagram: { label: "Instagram", color: "text-pink-400", bgColor: "bg-pink-500/15", borderColor: "border-pink-500/30" },
  youtube: { label: "YouTube", color: "text-red-400", bgColor: "bg-red-500/15", borderColor: "border-red-500/30" },
  tiktok: { label: "TikTok", color: "text-cyan-400", bgColor: "bg-cyan-500/15", borderColor: "border-cyan-500/30" },
  twitter: { label: "X / Twitter", color: "text-sky-400", bgColor: "bg-sky-500/15", borderColor: "border-sky-500/30" },
  linkedin: { label: "LinkedIn", color: "text-blue-400", bgColor: "bg-blue-500/15", borderColor: "border-blue-500/30" },
  facebook: { label: "Facebook", color: "text-indigo-400", bgColor: "bg-indigo-500/15", borderColor: "border-indigo-500/30" },
};

export function aggregateCompetitor(c: Competitor): CompetitorRow {
  const accs = c.accounts;
  const totalFollowers = accs.reduce((s, a) => s + a.followers, 0);
  const avgEngagement = accs.length ? parseFloat((accs.reduce((s, a) => s + a.engagementRate, 0) / accs.length).toFixed(1)) : 0;
  const totalPostsPerWeek = parseFloat(accs.reduce((s, a) => s + a.postsPerWeek, 0).toFixed(1));
  const avgGrowth = accs.length ? parseFloat((accs.reduce((s, a) => s + a.followersGrowth, 0) / accs.length).toFixed(1)) : 0;
  const lastActive = accs.reduce((latest, a) => (a.lastPostDate > latest ? a.lastPostDate : latest), "");
  return {
    id: c.id,
    name: c.name,
    totalFollowers,
    avgEngagement,
    totalPostsPerWeek,
    avgGrowth,
    platformCount: accs.length,
    lastActive,
    notes: c.notes,
  };
}

export const SAMPLE_COMPETITORS: Competitor[] = [
  {
    id: "comp-1",
    name: "Rival Brand Co.",
    notes: "Main competitor in lifestyle space",
    addedAt: "2026-02-15",
    accounts: [
      { platform: "instagram", handle: "@rivalbrandco", followers: 124500, followersGrowth: 3.2, engagementRate: 4.8, postsPerWeek: 5, lastPostDate: "2026-03-22" },
      { platform: "tiktok", handle: "@rivalbrandco", followers: 89200, followersGrowth: 8.1, engagementRate: 6.2, postsPerWeek: 7, lastPostDate: "2026-03-23" },
      { platform: "youtube", handle: "@RivalBrandCo", followers: 45800, followersGrowth: 1.5, engagementRate: 3.1, postsPerWeek: 2, lastPostDate: "2026-03-20" },
      { platform: "twitter", handle: "@rivalbrand", followers: 32100, followersGrowth: 0.8, engagementRate: 1.9, postsPerWeek: 12, lastPostDate: "2026-03-23" },
    ],
    recentPosts: [
      { id: "rp1", platform: "instagram", content: "New spring drop just landed 🌸 Link in bio!", date: "2026-03-22", likes: 3420, comments: 187, shares: 45, impressions: 28400 },
      { id: "rp2", platform: "tiktok", content: "POV: unboxing our best seller #fyp", date: "2026-03-23", likes: 12800, comments: 432, shares: 890, impressions: 156000 },
      { id: "rp3", platform: "youtube", content: "Behind the scenes: Spring Campaign 2026", date: "2026-03-20", likes: 2100, comments: 156, shares: 89, impressions: 34500 },
      { id: "rp4", platform: "twitter", content: "Hot take: minimalism is back in a big way this season", date: "2026-03-23", likes: 890, comments: 234, shares: 156, impressions: 45200 },
      { id: "rp5", platform: "instagram", content: "Monday motivation ✨ What's your goal this week?", date: "2026-03-21", likes: 2890, comments: 156, shares: 23, impressions: 21000 },
    ],
  },
  {
    id: "comp-2",
    name: "StyleHouse",
    notes: "Premium segment, strong YouTube presence",
    addedAt: "2026-01-20",
    accounts: [
      { platform: "instagram", handle: "@stylehouse", followers: 298000, followersGrowth: 2.1, engagementRate: 3.5, postsPerWeek: 4, lastPostDate: "2026-03-21" },
      { platform: "youtube", handle: "@StyleHouseOfficial", followers: 520000, followersGrowth: 4.3, engagementRate: 5.8, postsPerWeek: 3, lastPostDate: "2026-03-22" },
      { platform: "linkedin", handle: "StyleHouse Inc.", followers: 18500, followersGrowth: 1.2, engagementRate: 2.4, postsPerWeek: 2, lastPostDate: "2026-03-19" },
    ],
    recentPosts: [
      { id: "rp6", platform: "youtube", content: "The Ultimate Spring Wardrobe Guide | StyleHouse", date: "2026-03-22", likes: 8900, comments: 567, shares: 234, impressions: 142000 },
      { id: "rp7", platform: "instagram", content: "Curated capsule collection — 12 pieces, endless outfits", date: "2026-03-21", likes: 6700, comments: 312, shares: 89, impressions: 67000 },
      { id: "rp8", platform: "linkedin", content: "How we built a sustainable supply chain in 2025", date: "2026-03-19", likes: 450, comments: 67, shares: 123, impressions: 12400 },
    ],
  },
  {
    id: "comp-3",
    name: "UrbanEdge",
    notes: "Fast-growing D2C, heavy on TikTok",
    addedAt: "2026-03-01",
    accounts: [
      { platform: "instagram", handle: "@urbanedge", followers: 67400, followersGrowth: 5.7, engagementRate: 5.9, postsPerWeek: 6, lastPostDate: "2026-03-23" },
      { platform: "tiktok", handle: "@urbanedge", followers: 342000, followersGrowth: 12.4, engagementRate: 8.7, postsPerWeek: 14, lastPostDate: "2026-03-23" },
      { platform: "twitter", handle: "@urbanedge_", followers: 15200, followersGrowth: 2.3, engagementRate: 2.1, postsPerWeek: 8, lastPostDate: "2026-03-22" },
      { platform: "facebook", handle: "UrbanEdge", followers: 23400, followersGrowth: 0.4, engagementRate: 1.3, postsPerWeek: 3, lastPostDate: "2026-03-20" },
    ],
    recentPosts: [
      { id: "rp9", platform: "tiktok", content: "This outfit change took 3 hours to film 😅 #ootd", date: "2026-03-23", likes: 45600, comments: 1230, shares: 3400, impressions: 890000 },
      { id: "rp10", platform: "instagram", content: "New drop alert 🚨 First 100 orders get free shipping", date: "2026-03-23", likes: 4500, comments: 289, shares: 67, impressions: 42000 },
      { id: "rp11", platform: "tiktok", content: "Rating every item in our new collection honestly", date: "2026-03-22", likes: 23400, comments: 890, shares: 1200, impressions: 456000 },
      { id: "rp12", platform: "twitter", content: "We're hiring! Looking for a social media manager 👀", date: "2026-03-22", likes: 567, comments: 89, shares: 234, impressions: 18900 },
    ],
  },
  {
    id: "comp-4",
    name: "Maison Moderne",
    notes: "Luxury competitor, low frequency, high quality",
    addedAt: "2026-02-10",
    accounts: [
      { platform: "instagram", handle: "@maisonmoderne", followers: 412000, followersGrowth: 1.1, engagementRate: 2.8, postsPerWeek: 2, lastPostDate: "2026-03-20" },
      { platform: "youtube", handle: "@MaisonModerne", followers: 189000, followersGrowth: 2.4, engagementRate: 4.2, postsPerWeek: 1, lastPostDate: "2026-03-18" },
      { platform: "facebook", handle: "Maison Moderne", followers: 156000, followersGrowth: 0.3, engagementRate: 1.1, postsPerWeek: 2, lastPostDate: "2026-03-19" },
    ],
    recentPosts: [
      { id: "rp13", platform: "instagram", content: "Artisanal craftsmanship meets modern design", date: "2026-03-20", likes: 8900, comments: 234, shares: 156, impressions: 89000 },
      { id: "rp14", platform: "youtube", content: "A Day in Our Atelier | Maison Moderne", date: "2026-03-18", likes: 5600, comments: 345, shares: 178, impressions: 78000 },
      { id: "rp15", platform: "facebook", content: "Join us for our exclusive spring preview event", date: "2026-03-19", likes: 1200, comments: 89, shares: 234, impressions: 34000 },
    ],
  },
  {
    id: "comp-5",
    name: "FreshThreads",
    notes: "Gen-Z focused, meme-driven marketing",
    addedAt: "2026-03-10",
    accounts: [
      { platform: "instagram", handle: "@freshthreads", followers: 156000, followersGrowth: 6.8, engagementRate: 7.2, postsPerWeek: 8, lastPostDate: "2026-03-23" },
      { platform: "tiktok", handle: "@freshthreads", followers: 890000, followersGrowth: 15.2, engagementRate: 9.4, postsPerWeek: 21, lastPostDate: "2026-03-23" },
      { platform: "twitter", handle: "@freshthreads", followers: 78900, followersGrowth: 4.5, engagementRate: 3.8, postsPerWeek: 15, lastPostDate: "2026-03-23" },
    ],
    recentPosts: [
      { id: "rp16", platform: "tiktok", content: "When the fit check goes wrong 💀 #fail #fashion", date: "2026-03-23", likes: 234000, comments: 8900, shares: 45000, impressions: 4200000 },
      { id: "rp17", platform: "instagram", content: "Y2K is not dead, you're just not doing it right", date: "2026-03-23", likes: 12300, comments: 890, shares: 234, impressions: 124000 },
      { id: "rp18", platform: "twitter", content: "normalize wearing whatever you want challenge", date: "2026-03-23", likes: 4500, comments: 567, shares: 1200, impressions: 89000 },
    ],
  },
];
