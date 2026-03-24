"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Competitor, SocialPlatform, SocialAccount } from "@/lib/competitor-data";
import { PLATFORM_META } from "@/lib/competitor-data";

interface AddCompetitorDialogProps {
  onAdd: (competitor: Competitor) => void;
}

interface HandleEntry {
  platform: SocialPlatform;
  handle: string;
}

const ALL_PLATFORMS: SocialPlatform[] = ["instagram", "youtube", "tiktok", "twitter", "linkedin", "facebook"];

export function AddCompetitorDialog({ onAdd }: AddCompetitorDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [handles, setHandles] = useState<HandleEntry[]>([
    { platform: "instagram", handle: "" },
  ]);

  function reset() {
    setName("");
    setNotes("");
    setHandles([{ platform: "instagram", handle: "" }]);
  }

  function addHandle() {
    // Pick the first platform not already used
    const used = new Set(handles.map((h) => h.platform));
    const next = ALL_PLATFORMS.find((p) => !used.has(p));
    if (next) {
      setHandles([...handles, { platform: next, handle: "" }]);
    }
  }

  function removeHandle(index: number) {
    setHandles(handles.filter((_, i) => i !== index));
  }

  function updateHandle(index: number, field: keyof HandleEntry, value: string) {
    setHandles(
      handles.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      )
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const validHandles = handles.filter((h) => h.handle.trim());
    if (validHandles.length === 0) return;

    const accounts: SocialAccount[] = validHandles.map((h) => ({
      platform: h.platform,
      handle: h.handle.trim(),
      followers: 0,
      followersGrowth: 0,
      engagementRate: 0,
      postsPerWeek: 0,
      lastPostDate: "",
    }));

    const competitor: Competitor = {
      id: crypto.randomUUID(),
      name: name.trim(),
      notes: notes.trim(),
      accounts,
      recentPosts: [],
      addedAt: new Date().toISOString().split("T")[0],
    };

    onAdd(competitor);
    reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm"><Plus className="h-4 w-4" />Add Competitor</Button>} />
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Competitor</DialogTitle>
            <DialogDescription>
              Enter competitor details and their social media handles.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="comp-name">Competitor Name</Label>
              <input
                id="comp-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rival Brand Co."
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30"
              />
            </div>

            {/* Handles */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Social Accounts</Label>
                {handles.length < ALL_PLATFORMS.length && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={addHandle}
                  >
                    <Plus className="h-3 w-3" />
                    Add platform
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {handles.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Select
                      value={entry.platform}
                      onValueChange={(val) => { if (val) updateHandle(i, "platform", val); }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_PLATFORMS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {PLATFORM_META[p].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      type="text"
                      value={entry.handle}
                      onChange={(e) => updateHandle(i, "handle", e.target.value)}
                      placeholder="@handle or channel name"
                      className="flex h-9 flex-1 rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30"
                    />
                    {handles.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => removeHandle(i)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="comp-notes">Notes (optional)</Label>
              <Textarea
                id="comp-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything to remember about this competitor..."
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!name.trim() || !handles.some((h) => h.handle.trim())}>
              Add Competitor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
