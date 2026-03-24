import { getCompetitors } from "@/lib/actions/competitors";
import { CompetitorsClient } from "@/components/competitors/competitors-client";

export default async function CompetitorsPage() {
  const competitors = await getCompetitors();

  return <CompetitorsClient initialCompetitors={competitors} />;
}
