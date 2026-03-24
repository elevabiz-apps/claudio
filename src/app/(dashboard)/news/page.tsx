import { fetchAllFeeds } from "@/lib/news-fetcher";
import { NewsFeed } from "@/components/news/news-feed";

export const dynamic = "force-dynamic"; // Always fetch fresh RSS data

export default async function NewsPage() {
  const items = await fetchAllFeeds();

  return <NewsFeed items={items} />;
}
