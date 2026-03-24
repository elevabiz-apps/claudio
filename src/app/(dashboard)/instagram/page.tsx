import { getInstagramPosts } from "@/lib/actions/instagram";
import { InstagramManagerClient } from "@/components/instagram/instagram-manager-client";

export default async function InstagramPage() {
  const posts = await getInstagramPosts();

  return <InstagramManagerClient initialPosts={posts} />;
}
