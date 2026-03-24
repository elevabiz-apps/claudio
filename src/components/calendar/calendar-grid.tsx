"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ContentChip } from "./content-chip";
import type { CalendarItem } from "@/lib/calendar-data";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  items: CalendarItem[];
}

interface DayCell {
  date: number | null;
  dateStr: string | null; // YYYY-MM-DD
  isToday: boolean;
  isCurrentMonth: boolean;
}

function buildGrid(year: number, month: number): DayCell[] {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const cells: DayCell[] = [];

  // Previous month padding
  const prevMonthLast = new Date(year, month, 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthLast - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ date: d, dateStr, isToday: dateStr === todayStr, isCurrentMonth: false });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ date: d, dateStr, isToday: dateStr === todayStr, isCurrentMonth: true });
  }

  // Next month padding (fill to 6 rows = 42 cells, or 5 rows = 35)
  const totalRows = cells.length > 35 ? 42 : 35;
  let nextDay = 1;
  while (cells.length < totalRows) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`;
    cells.push({ date: nextDay, dateStr, isToday: dateStr === todayStr, isCurrentMonth: false });
    nextDay++;
  }

  return cells;
}

export function CalendarGrid({ year, month, items }: CalendarGridProps) {
  const cells = useMemo(() => buildGrid(year, month), [year, month]);

  // Index items by date for fast lookup
  const itemsByDate = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    for (const item of items) {
      const existing = map.get(item.date) ?? [];
      existing.push(item);
      map.set(item.date, existing);
    }
    // Sort each day's items by time
    for (const [, dayItems] of map) {
      dayItems.sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99"));
    }
    return map;
  }, [items]);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Header row */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="px-2 py-2.5 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const dayItems = cell.dateStr ? (itemsByDate.get(cell.dateStr) ?? []) : [];
          const maxVisible = 3;
          const overflow = dayItems.length - maxVisible;

          return (
            <div
              key={i}
              className={cn(
                "min-h-[110px] border-b border-r border-border p-1.5 transition-colors",
                !cell.isCurrentMonth && "bg-muted/10",
                cell.isToday && "bg-accent/20",
                // Remove right border on last column
                (i + 1) % 7 === 0 && "border-r-0"
              )}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                    cell.isToday
                      ? "bg-primary text-primary-foreground font-bold"
                      : cell.isCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground/50"
                  )}
                >
                  {cell.date}
                </span>
              </div>

              {/* Content chips */}
              <div className="space-y-0.5">
                {dayItems.slice(0, maxVisible).map((item) => (
                  <ContentChip key={item.id} item={item} />
                ))}
                {overflow > 0 && (
                  <p className="px-1 text-[10px] text-muted-foreground">
                    +{overflow} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
