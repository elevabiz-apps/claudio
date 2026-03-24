"use client";

import { Button } from "@/components/ui/button";
import { type Platform, PLATFORM_CONFIG } from "@/lib/calendar-data";
import { cn } from "@/lib/utils";

const ALL_PLATFORMS: Platform[] = [
  "instagram",
  "youtube",
  "tiktok",
  "twitter",
  "linkedin",
  "facebook",
];

interface PlatformFilterProps {
  selected: Set<Platform>;
  onChange: (selected: Set<Platform>) => void;
}

export function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  const allSelected = selected.size === ALL_PLATFORMS.length;

  function toggle(platform: Platform) {
    const next = new Set(selected);
    if (next.has(platform)) {
      next.delete(platform);
    } else {
      next.add(platform);
    }
    onChange(next);
  }

  function toggleAll() {
    if (allSelected) {
      onChange(new Set());
    } else {
      onChange(new Set(ALL_PLATFORMS));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button
        variant={allSelected ? "secondary" : "outline"}
        size="sm"
        className="h-7 text-xs px-2.5"
        onClick={toggleAll}
      >
        All
      </Button>
      {ALL_PLATFORMS.map((platform) => {
        const config = PLATFORM_CONFIG[platform];
        const active = selected.has(platform);
        return (
          <Button
            key={platform}
            variant="outline"
            size="sm"
            className={cn(
              "h-7 text-xs px-2.5 transition-colors",
              active && `${config.bgColor} ${config.color} ${config.borderColor}`
            )}
            onClick={() => toggle(platform)}
          >
            {config.label}
          </Button>
        );
      })}
    </div>
  );
}
