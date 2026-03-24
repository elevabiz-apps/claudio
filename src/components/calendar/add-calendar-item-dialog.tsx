"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Platform, ContentStatus, ContentType } from "@/lib/calendar-data";
import { PLATFORM_CONFIG } from "@/lib/calendar-data";

export interface AddCalendarItemInput {
  title: string;
  platform: Platform;
  status: ContentStatus;
  contentType: ContentType;
  date: string;
  time?: string;
}

interface AddCalendarItemDialogProps {
  defaultDate?: string;
  onAdd: (input: AddCalendarItemInput) => void;
}

const PLATFORMS: Platform[] = [
  "instagram", "youtube", "tiktok", "twitter", "linkedin", "facebook",
];
const CONTENT_TYPES: ContentType[] = [
  "image", "carousel", "reel", "video", "story", "short", "post",
];
const STATUSES: ContentStatus[] = ["draft", "scheduled", "published"];

export function AddCalendarItemDialog({
  defaultDate,
  onAdd,
}: AddCalendarItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [status, setStatus] = useState<ContentStatus>("scheduled");
  const [contentType, setContentType] = useState<ContentType>("image");
  const [date, setDate] = useState(defaultDate ?? new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");

  function reset() {
    setTitle("");
    setPlatform("instagram");
    setStatus("scheduled");
    setContentType("image");
    setDate(defaultDate ?? new Date().toISOString().split("T")[0]);
    setTime("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onAdd({
      title: title.trim(),
      platform,
      status,
      contentType,
      date,
      ...(time ? { time } : {}),
    });

    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Calendar Item</DialogTitle>
            <DialogDescription>
              Schedule a new piece of content on the calendar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="cal-title">Title</Label>
              <input
                id="cal-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spring collection launch"
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30"
              />
            </div>

            {/* Platform + Content Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Platform</Label>
                <Select
                  value={platform}
                  onValueChange={(v) => { if (v) setPlatform(v as Platform); }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {PLATFORM_CONFIG[p].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Content Type</Label>
                <Select
                  value={contentType}
                  onValueChange={(v) => { if (v) setContentType(v as ContentType); }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((ct) => (
                      <SelectItem key={ct} value={ct}>
                        {ct.charAt(0).toUpperCase() + ct.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => { if (v) setStatus(v as ContentStatus); }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cal-date">Date</Label>
                <input
                  id="cal-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cal-time">Time (optional)</Label>
                <input
                  id="cal-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!title.trim() || !date}>
              Add to Calendar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
