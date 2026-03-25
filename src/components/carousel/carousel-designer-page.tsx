"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Edit3, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CarouselDesigner } from "@/components/carousel/carousel-designer";
import { deleteCarouselDesign } from "@/lib/actions/carousel";
import type { CarouselDesign } from "@/lib/actions/carousel";
import { slideBackground } from "@/lib/carousel-utils";

interface CarouselDesignerPageProps {
  designs: CarouselDesign[];
}

export function CarouselDesignerPage({ designs: initialDesigns }: CarouselDesignerPageProps) {
  const [designs, setDesigns] = useState<CarouselDesign[]>(initialDesigns);
  const [mode, setMode] = useState<"gallery" | "editor">("gallery");
  const [editingDesign, setEditingDesign] = useState<CarouselDesign | undefined>(undefined);
  const [, startTransition] = useTransition();

  function openNew() {
    setEditingDesign(undefined);
    setMode("editor");
  }

  function openEdit(design: CarouselDesign) {
    setEditingDesign(design);
    setMode("editor");
  }

  function handleDelete(id: string) {
    setDesigns((prev) => prev.filter((d) => d.id !== id));
    startTransition(async () => {
      await deleteCarouselDesign(id);
    });
  }

  if (mode === "editor") {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => setMode("gallery")}
          >
            <LayoutDashboard className="h-4 w-4" />
            Back to Gallery
          </Button>
        </div>
        <CarouselDesigner initialDesign={editingDesign} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carousel Designer</h1>
          <p className="text-muted-foreground mt-1">
            Design multi-slide Instagram carousels and export as PNG.
          </p>
        </div>
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" />
          New Carousel
        </Button>
      </div>

      {/* Gallery */}
      {designs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium">No designs yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first carousel to get started.
              </p>
            </div>
            <Button size="sm" onClick={openNew}>
              <Plus className="h-4 w-4" />
              New Carousel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {designs.map((design) => (
            <Card key={design.id} className="group overflow-hidden">
              {/* Slide preview strip */}
              <div className="flex h-36 overflow-hidden">
                {design.slides.slice(0, 3).map((slide, i) => (
                  <div
                    key={slide.id}
                    className="flex-1 relative"
                    style={{ background: slideBackground(slide) }}
                  >
                    {slide.elements.slice(0, 2).map((el) => (
                      <div
                        key={el.id}
                        className="absolute text-center leading-tight"
                        style={{
                          left: `${el.x}%`,
                          top: `${el.y}%`,
                          transform: "translate(-50%, -50%)",
                          color: el.color,
                          fontSize: `${el.fontSize * 0.18}px`,
                          fontWeight: el.fontWeight,
                          textAlign: el.align,
                          width: "80%",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {el.text}
                      </div>
                    ))}
                    {i === 2 && design.slides.length > 3 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          +{design.slides.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{design.title}</p>
                    <Badge variant="secondary" className="text-[10px] mt-1">
                      {design.slides.length} slide{design.slides.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEdit(design)}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(design.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add new card */}
          <Card
            className="group cursor-pointer border-dashed hover:border-primary transition-colors"
            onClick={openNew}
          >
            <CardContent className="flex flex-col items-center justify-center h-full py-12 gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/40 group-hover:border-primary transition-colors">
                <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">New Carousel</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
