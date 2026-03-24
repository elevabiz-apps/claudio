"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";
import type {
  PostType,
  PostStatus,
} from "@/lib/instagram-data";

interface AddPostInput {
  caption: string;
  postType: PostType;
  status: PostStatus;
  scheduledDate?: string;
}

interface AddPostDialogProps {
  onAdd: (input: AddPostInput) => void;
}

export function AddPostDialog({ onAdd }: AddPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [postType, setPostType] = useState<PostType>("image");
  const [status, setStatus] = useState<PostStatus>("backlog");
  const [scheduledDate, setScheduledDate] = useState("");

  function resetForm() {
    setCaption("");
    setPostType("image");
    setStatus("backlog");
    setScheduledDate("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!caption.trim()) return;

    onAdd({
      caption: caption.trim(),
      postType,
      status,
      ...(status === "scheduled" && scheduledDate ? { scheduledDate } : {}),
    });
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Post
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New Post Idea</DialogTitle>
            <DialogDescription>
              Add a new content idea to your Instagram pipeline.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                placeholder="Write your caption or post idea..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Post Type</Label>
                <Select
                  value={postType}
                  onValueChange={(val) => { if (val) setPostType(val as PostType); }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                    <SelectItem value="reel">Reel</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(val) => { if (val) setStatus(val as PostStatus); }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {status === "scheduled" && (
              <div className="grid gap-2">
                <Label htmlFor="scheduled-date">Scheduled Date</Label>
                <input
                  id="scheduled-date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" type="button" />}
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!caption.trim()}>
              Add Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
