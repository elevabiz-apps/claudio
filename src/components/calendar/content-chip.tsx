"use client";

import { cn } from "@/lib/utils";
import {
  type CalendarItem,
  PLATFORM_CONFIG,
} from "@/lib/calendar-data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, CalendarClock, FileEdit } from "lucide-react";

const statusConfig = {
  published: { icon: CheckCircle2, label: "Published", class: "text-green-400" },
  scheduled: { icon: CalendarClock, label: "Scheduled", class: "text-blue-400" },
  draft: { icon: FileEdit, label: "Draft", class: "text-yellow-400" },
};

interface ContentChipProps {
  item: CalendarItem;
}

export function ContentChip({ item }: ContentChipProps) {
  const platform = PLATFORM_CONFIG[item.platform];
  const status = statusConfig[item.status];
  const StatusIcon = status.icon;

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "flex w-full items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-tight truncate cursor-pointer transition-colors hover:brightness-125",
          platform.bgColor,
          platform.borderColor,
          platform.color,
          item.status === "draft" && "opacity-60"
        )}
      >
        <span className="truncate">{item.title}</span>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" side="right" sideOffset={8}>
        <div className="space-y-2.5">
          <p className="text-sm font-medium leading-snug">{item.title}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-[11px]", platform.bgColor, platform.color, platform.borderColor)}
            >
              {platform.label}
            </Badge>
            <Badge variant="outline" className="text-[11px] capitalize">
              {item.contentType}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className={cn("flex items-center gap-1", status.class)}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
            {item.time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.time}
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground">{item.date}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
