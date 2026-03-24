"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "@/lib/metricool/types";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const presets = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  function applyPreset(days: number) {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    onChange({ from, to });
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="h-9 gap-2 px-3 text-sm font-normal" />
        }
      >
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        <span>
          {formatDisplayDate(value.from)} — {formatDisplayDate(value.to)}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          <div className="flex flex-col gap-1 border-r border-border p-3">
            <p className="px-2 pb-1 text-xs font-medium text-muted-foreground">
              Quick select
            </p>
            {presets.map((preset) => (
              <Button
                key={preset.days}
                variant="ghost"
                size="sm"
                className="justify-start text-xs"
                onClick={() => applyPreset(preset.days)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <div className="p-3">
            <Calendar
              mode="range"
              selected={{ from: value.from, to: value.to }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onChange({ from: range.from, to: range.to });
                  setOpen(false);
                } else if (range?.from) {
                  onChange({ from: range.from, to: range.from });
                }
              }}
              numberOfMonths={2}
              disabled={{ after: new Date() }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
