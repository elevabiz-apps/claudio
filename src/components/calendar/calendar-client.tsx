"use client";

import { useState, useMemo, useTransition } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { PlatformFilter } from "@/components/calendar/platform-filter";
import { AddCalendarItemDialog, type AddCalendarItemInput } from "@/components/calendar/add-calendar-item-dialog";
import { createCalendarItem } from "@/lib/actions/calendar";
import {
  type Platform,
  type ContentStatus,
  type CalendarItem,
  PLATFORM_CONFIG,
} from "@/lib/calendar-data";

const ALL_PLATFORMS = new Set<Platform>([
  "instagram", "youtube", "tiktok", "twitter", "linkedin", "facebook",
]);

const STATUS_FILTERS: { key: ContentStatus; label: string; color: string }[] = [
  { key: "published", label: "Published", color: "text-green-400" },
  { key: "scheduled", label: "Scheduled", color: "text-blue-400" },
  { key: "draft", label: "Drafts", color: "text-yellow-400" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CalendarClientProps {
  initialItems: CalendarItem[];
}

export function CalendarClient({ initialItems }: CalendarClientProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set(ALL_PLATFORMS));
  const [selectedStatuses, setSelectedStatuses] = useState<Set<ContentStatus>>(
    new Set(["published", "scheduled", "draft"])
  );
  const [items, setItems] = useState<CalendarItem[]>(initialItems);
  const [, startTransition] = useTransition();

  // Silence unused warning — PLATFORM_CONFIG is available for future use
  void PLATFORM_CONFIG;

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  function goToToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  }

  function toggleStatus(status: ContentStatus) {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  function handleAdd(input: AddCalendarItemInput) {
    const tempItem: CalendarItem = {
      id: crypto.randomUUID(),
      title: input.title,
      platform: input.platform,
      status: input.status,
      contentType: input.contentType,
      date: input.date,
      time: input.time,
    };
    setItems((prev) => [...prev, tempItem].sort((a, b) => a.date.localeCompare(b.date)));

    startTransition(async () => {
      const created = await createCalendarItem(input);
      if (created) {
        setItems((prev) =>
          prev.map((i) => (i.id === tempItem.id ? created : i))
        );
      } else {
        setItems((prev) => prev.filter((i) => i.id !== tempItem.id));
      }
    });
  }

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          selectedPlatforms.has(item.platform) &&
          selectedStatuses.has(item.status)
      ),
    [items, selectedPlatforms, selectedStatuses]
  );

  const monthStats = useMemo(() => {
    const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    const monthItems = filteredItems.filter((item) => item.date.startsWith(monthPrefix));
    return {
      total: monthItems.length,
      published: monthItems.filter((i) => i.status === "published").length,
      scheduled: monthItems.filter((i) => i.status === "scheduled").length,
      draft: monthItems.filter((i) => i.status === "draft").length,
    };
  }, [filteredItems, year, month]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Plan and schedule content across all platforms.
          </p>
        </div>
        <AddCalendarItemDialog onAdd={handleAdd} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-lg font-semibold">
              {MONTH_NAMES[month]} {year}
            </h2>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={goToToday}>
              Today
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="gap-1">
              <CalendarDays className="h-3 w-3" />
              {monthStats.total} items
            </Badge>
            <Badge variant="outline" className="gap-1 text-green-400 border-green-500/30 bg-green-500/10">
              {monthStats.published} published
            </Badge>
            <Badge variant="outline" className="gap-1 text-blue-400 border-blue-500/30 bg-blue-500/10">
              {monthStats.scheduled} scheduled
            </Badge>
            <Badge variant="outline" className="gap-1 text-yellow-400 border-yellow-500/30 bg-yellow-500/10">
              {monthStats.draft} drafts
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <PlatformFilter selected={selectedPlatforms} onChange={setSelectedPlatforms} />
          <div className="flex items-center gap-1.5">
            {STATUS_FILTERS.map(({ key, label, color }) => {
              const active = selectedStatuses.has(key);
              return (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  className={`h-7 text-xs px-2.5 transition-colors ${active ? color : "text-muted-foreground opacity-50"}`}
                  onClick={() => toggleStatus(key)}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <CalendarGrid year={year} month={month} items={filteredItems} />
    </div>
  );
}
