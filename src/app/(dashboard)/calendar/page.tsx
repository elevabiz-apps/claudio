import { getCalendarItems } from "@/lib/actions/calendar";
import { CalendarClient } from "@/components/calendar/calendar-client";

export default async function CalendarPage() {
  const items = await getCalendarItems();

  return <CalendarClient initialItems={items} />;
}
