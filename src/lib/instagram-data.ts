export type PostStatus = "scheduled" | "draft" | "published" | "backlog";

export type PostType = "image" | "carousel" | "reel" | "story";

export interface InstagramPost {
  id: string;
  caption: string;
  postType: PostType;
  status: PostStatus;
  scheduledDate?: string;
  publishedDate?: string;
  createdAt: string;
  tags?: string[];
}

export const POST_TYPE_LABELS: Record<PostType, string> = {
  image: "Image",
  carousel: "Carousel",
  reel: "Reel",
  story: "Story",
};

export const STATUS_LABELS: Record<PostStatus, string> = {
  scheduled: "Scheduled",
  draft: "Draft",
  published: "Published",
  backlog: "Backlog",
};

export const SAMPLE_POSTS: InstagramPost[] = [
  {
    id: "1",
    caption: "New product launch teaser — swipe to see all colorways 🎨",
    postType: "carousel",
    status: "scheduled",
    scheduledDate: "2026-03-25",
    createdAt: "2026-03-20",
    tags: ["product-launch", "teaser"],
  },
  {
    id: "2",
    caption: "Behind the scenes of our latest shoot",
    postType: "reel",
    status: "scheduled",
    scheduledDate: "2026-03-26",
    createdAt: "2026-03-19",
    tags: ["bts", "video"],
  },
  {
    id: "3",
    caption: "Monday motivation — what drives your week?",
    postType: "image",
    status: "scheduled",
    scheduledDate: "2026-03-30",
    createdAt: "2026-03-21",
    tags: ["engagement"],
  },
  {
    id: "4",
    caption: "Working on something exciting... stay tuned 👀",
    postType: "story",
    status: "draft",
    createdAt: "2026-03-18",
    tags: ["teaser"],
  },
  {
    id: "5",
    caption: "Quick poll: which design do you prefer? A or B",
    postType: "story",
    status: "draft",
    createdAt: "2026-03-17",
    tags: ["engagement", "poll"],
  },
  {
    id: "6",
    caption: "Customer spotlight — hear what @user has to say about us",
    postType: "image",
    status: "draft",
    createdAt: "2026-03-16",
    tags: ["ugc", "testimonial"],
  },
  {
    id: "7",
    caption: "Spring collection is live! Link in bio 🌸",
    postType: "carousel",
    status: "published",
    publishedDate: "2026-03-15",
    createdAt: "2026-03-10",
    tags: ["product-launch", "spring"],
  },
  {
    id: "8",
    caption: "How we pack your orders with care 📦",
    postType: "reel",
    status: "published",
    publishedDate: "2026-03-12",
    createdAt: "2026-03-08",
    tags: ["bts", "packaging"],
  },
  {
    id: "9",
    caption: "Throwback to our first ever pop-up event",
    postType: "image",
    status: "published",
    publishedDate: "2026-03-10",
    createdAt: "2026-03-05",
    tags: ["throwback"],
  },
  {
    id: "10",
    caption: "Collaboration idea: partner with local café for crossover post",
    postType: "image",
    status: "backlog",
    createdAt: "2026-03-01",
    tags: ["collab", "idea"],
  },
  {
    id: "11",
    caption: "Tutorial: 3 ways to style our bestselling item",
    postType: "reel",
    status: "backlog",
    createdAt: "2026-02-28",
    tags: ["tutorial", "styling"],
  },
  {
    id: "12",
    caption: "Team introduction series — meet the people behind the brand",
    postType: "carousel",
    status: "backlog",
    createdAt: "2026-02-25",
    tags: ["team", "series"],
  },
  {
    id: "13",
    caption: "Giveaway concept: follow + tag a friend to win",
    postType: "image",
    status: "backlog",
    createdAt: "2026-02-20",
    tags: ["giveaway", "engagement"],
  },
];
