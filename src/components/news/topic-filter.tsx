"use client";

import { Button } from "@/components/ui/button";
import { type NewsTopic, TOPIC_CONFIG } from "@/lib/news-data";
import { cn } from "@/lib/utils";

const ALL_TOPICS: NewsTopic[] = ["research", "business", "tools"];

interface TopicFilterProps {
  selected: Set<NewsTopic>;
  onChange: (selected: Set<NewsTopic>) => void;
}

export function TopicFilter({ selected, onChange }: TopicFilterProps) {
  const allSelected = selected.size === ALL_TOPICS.length;

  function toggle(topic: NewsTopic) {
    const next = new Set(selected);
    if (next.has(topic)) {
      next.delete(topic);
    } else {
      next.add(topic);
    }
    onChange(next);
  }

  function toggleAll() {
    onChange(allSelected ? new Set() : new Set(ALL_TOPICS));
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Button
        variant={allSelected ? "secondary" : "outline"}
        size="sm"
        className="h-7 text-xs px-2.5"
        onClick={toggleAll}
      >
        All Topics
      </Button>
      {ALL_TOPICS.map((topic) => {
        const config = TOPIC_CONFIG[topic];
        const active = selected.has(topic);
        return (
          <Button
            key={topic}
            variant="outline"
            size="sm"
            className={cn(
              "h-7 text-xs px-2.5 transition-colors",
              active && `${config.bgColor} ${config.color} ${config.borderColor}`
            )}
            onClick={() => toggle(topic)}
          >
            {config.label}
          </Button>
        );
      })}
    </div>
  );
}
