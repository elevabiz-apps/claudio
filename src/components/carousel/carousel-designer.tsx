"use client";

import {
  useState,
  useRef,
  useCallback,
  useTransition,
  useEffect,
} from "react";
import {
  Plus,
  Trash2,
  Download,
  Save,
  ChevronLeft,
  ChevronRight,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveCarouselDesign } from "@/lib/actions/carousel";
import type { CarouselSlide, CarouselElement, CarouselDesign } from "@/lib/actions/carousel";
import { AIGeneratePanel } from "@/components/carousel/ai-generate-panel";
import { slideBackground } from "@/lib/carousel-utils";

// ── Templates ──────────────────────────────────────────────────────────────

const TEMPLATES: {
  id: string;
  label: string;
  backgroundType: CarouselSlide["backgroundType"];
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  gradientDirection: CarouselSlide["gradientDirection"];
  textColor: string;
}[] = [
  {
    id: "white",
    label: "Clean White",
    backgroundType: "solid",
    backgroundColor: "#ffffff",
    gradientFrom: "#ffffff",
    gradientTo: "#ffffff",
    gradientDirection: "to bottom",
    textColor: "#1a1a1a",
  },
  {
    id: "dark",
    label: "Dark Mode",
    backgroundType: "solid",
    backgroundColor: "#0f0f0f",
    gradientFrom: "#0f0f0f",
    gradientTo: "#0f0f0f",
    gradientDirection: "to bottom",
    textColor: "#ffffff",
  },
  {
    id: "purple",
    label: "Purple Gradient",
    backgroundType: "gradient",
    backgroundColor: "#7c3aed",
    gradientFrom: "#7c3aed",
    gradientTo: "#2563eb",
    gradientDirection: "to bottom right",
    textColor: "#ffffff",
  },
  {
    id: "sunset",
    label: "Sunset",
    backgroundType: "gradient",
    backgroundColor: "#f97316",
    gradientFrom: "#f97316",
    gradientTo: "#ec4899",
    gradientDirection: "to bottom right",
    textColor: "#ffffff",
  },
  {
    id: "ocean",
    label: "Ocean",
    backgroundType: "gradient",
    backgroundColor: "#0ea5e9",
    gradientFrom: "#0ea5e9",
    gradientTo: "#0f766e",
    gradientDirection: "to bottom right",
    textColor: "#ffffff",
  },
  {
    id: "forest",
    label: "Forest",
    backgroundType: "gradient",
    backgroundColor: "#16a34a",
    gradientFrom: "#16a34a",
    gradientTo: "#1e40af",
    gradientDirection: "to bottom",
    textColor: "#ffffff",
  },
  {
    id: "rose",
    label: "Rose",
    backgroundType: "gradient",
    backgroundColor: "#f43f5e",
    gradientFrom: "#f43f5e",
    gradientTo: "#fb923c",
    gradientDirection: "to right",
    textColor: "#ffffff",
  },
  {
    id: "slate",
    label: "Slate",
    backgroundType: "solid",
    backgroundColor: "#334155",
    gradientFrom: "#334155",
    gradientTo: "#334155",
    gradientDirection: "to bottom",
    textColor: "#f8fafc",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function makeSlide(templateId = "dark"): CarouselSlide {
  const t = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[1]!;
  return {
    id: crypto.randomUUID(),
    backgroundType: t.backgroundType,
    backgroundColor: t.backgroundColor,
    gradientFrom: t.gradientFrom,
    gradientTo: t.gradientTo,
    gradientDirection: t.gradientDirection,
    elements: [
      {
        id: crypto.randomUUID(),
        type: "text",
        text: "Your Heading Here",
        color: t.textColor,
        fontSize: 36,
        fontWeight: "bold",
        x: 50,
        y: 40,
        align: "center",
      },
      {
        id: crypto.randomUUID(),
        type: "subtitle",
        text: "Add your subtitle or key point",
        color: t.textColor,
        fontSize: 20,
        fontWeight: "normal",
        x: 50,
        y: 58,
        align: "center",
      },
    ],
  };
}

// ── Main Component ─────────────────────────────────────────────────────────

interface CarouselDesignerProps {
  initialDesign?: CarouselDesign;
}

export function CarouselDesigner({ initialDesign }: CarouselDesignerProps) {
  const [designId, setDesignId] = useState<string | undefined>(initialDesign?.id);
  const [title, setTitle] = useState(initialDesign?.title ?? "My Carousel");
  const [slides, setSlides] = useState<CarouselSlide[]>(
    initialDesign?.slides ?? [makeSlide("dark")]
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showAI, setShowAI] = useState(false);
  const [, startTransition] = useTransition();

  const slideRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    elementId: string;
    startX: number;
    startY: number;
    startElemX: number;
    startElemY: number;
  } | null>(null);

  const activeSlide = slides[activeSlideIndex]!;
  const selectedElement = activeSlide.elements.find((e) => e.id === selectedElementId) ?? null;

  // ── Slide CRUD ──────────────────────────────────────────────────────────

  function addSlide() {
    // New slide inherits background style from the active slide
    const newSlide: CarouselSlide = {
      ...makeSlide(),
      backgroundType: activeSlide.backgroundType,
      backgroundColor: activeSlide.backgroundColor,
      gradientFrom: activeSlide.gradientFrom,
      gradientTo: activeSlide.gradientTo,
      gradientDirection: activeSlide.gradientDirection,
    };
    setSlides((prev) => {
      const next = [...prev];
      next.splice(activeSlideIndex + 1, 0, newSlide);
      return next;
    });
    setActiveSlideIndex(activeSlideIndex + 1);
    setSelectedElementId(null);
  }

  function duplicateSlide() {
    const copy: CarouselSlide = {
      ...structuredClone(activeSlide),
      id: crypto.randomUUID(),
      elements: activeSlide.elements.map((e) => ({ ...e, id: crypto.randomUUID() })),
    };
    setSlides((prev) => {
      const next = [...prev];
      next.splice(activeSlideIndex + 1, 0, copy);
      return next;
    });
    setActiveSlideIndex(activeSlideIndex + 1);
    setSelectedElementId(null);
  }

  function deleteSlide() {
    if (slides.length === 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== activeSlideIndex));
    setActiveSlideIndex(Math.max(0, activeSlideIndex - 1));
    setSelectedElementId(null);
  }

  function updateSlide(updates: Partial<CarouselSlide>) {
    setSlides((prev) =>
      prev.map((s, i) => (i === activeSlideIndex ? { ...s, ...updates } : s))
    );
  }

  function applyTemplate(tplId: string) {
    const t = TEMPLATES.find((t) => t.id === tplId);
    if (!t) return;
    updateSlide({
      backgroundType: t.backgroundType,
      backgroundColor: t.backgroundColor,
      gradientFrom: t.gradientFrom,
      gradientTo: t.gradientTo,
      gradientDirection: t.gradientDirection,
    });
  }

  // ── Element CRUD ────────────────────────────────────────────────────────

  function addElement(type: CarouselElement["type"]) {
    const defaults = {
      text: { text: "New Heading", fontSize: 32, fontWeight: "bold" as const },
      subtitle: { text: "New Subtitle", fontSize: 20, fontWeight: "normal" as const },
      body: { text: "Body text goes here", fontSize: 16, fontWeight: "normal" as const },
    };
    const el: CarouselElement = {
      id: crypto.randomUUID(),
      type,
      color: "#ffffff",
      align: "center",
      x: 50,
      y: 50,
      ...defaults[type],
    };
    setSlides((prev) =>
      prev.map((s, i) =>
        i === activeSlideIndex ? { ...s, elements: [...s.elements, el] } : s
      )
    );
    setSelectedElementId(el.id);
  }

  const updateElement = useCallback((id: string, updates: Partial<CarouselElement>) => {
    setSlides((prev) =>
      prev.map((s, i) =>
        i === activeSlideIndex
          ? {
              ...s,
              elements: s.elements.map((el) =>
                el.id === id ? { ...el, ...updates } : el
              ),
            }
          : s
      )
    );
  }, [activeSlideIndex]);

  function deleteElement(id: string) {
    setSlides((prev) =>
      prev.map((s, i) =>
        i === activeSlideIndex
          ? { ...s, elements: s.elements.filter((el) => el.id !== id) }
          : s
      )
    );
    setSelectedElementId(null);
  }

  // ── Drag to reposition elements ─────────────────────────────────────────

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string, elemX: number, elemY: number) => {
      e.stopPropagation();
      setSelectedElementId(elementId);
      dragState.current = {
        elementId,
        startX: e.clientX,
        startY: e.clientY,
        startElemX: elemX,
        startElemY: elemY,
      };
    },
    []
  );

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragState.current || !slideRef.current) return;
      const rect = slideRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragState.current.startX) / rect.width) * 100;
      const dy = ((e.clientY - dragState.current.startY) / rect.height) * 100;
      const newX = Math.max(5, Math.min(95, dragState.current.startElemX + dx));
      const newY = Math.max(5, Math.min(95, dragState.current.startElemY + dy));
      updateElement(dragState.current.elementId, { x: newX, y: newY });
    }
    function onMouseUp() {
      dragState.current = null;
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [updateElement]);

  // ── Export ──────────────────────────────────────────────────────────────

  function exportSlideToCanvas(slide: CarouselSlide, size = 1080): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Background
    if (slide.backgroundType === "gradient") {
      let grad: CanvasGradient;
      const dir = slide.gradientDirection;
      if (dir === "to right") {
        grad = ctx.createLinearGradient(0, 0, size, 0);
      } else if (dir === "to bottom right") {
        grad = ctx.createLinearGradient(0, 0, size, size);
      } else {
        grad = ctx.createLinearGradient(0, 0, 0, size);
      }
      grad.addColorStop(0, slide.gradientFrom);
      grad.addColorStop(1, slide.gradientTo);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = slide.backgroundColor;
    }
    ctx.fillRect(0, 0, size, size);

    // Elements
    for (const el of slide.elements) {
      const px = (el.x / 100) * size;
      const py = (el.y / 100) * size;
      ctx.fillStyle = el.color;
      ctx.textAlign = el.align as CanvasTextAlign;
      ctx.font = `${el.fontWeight} ${el.fontSize * (size / 400)}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
      ctx.fillText(el.text, px, py);
    }

    return canvas;
  }

  function handleExport() {
    slides.forEach((slide, i) => {
      const canvas = exportSlideToCanvas(slide);
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}_slide${i + 1}.png`;
      a.click();
    });
  }

  // ── Save ─────────────────────────────────────────────────────────────────

  function handleSave() {
    setSaveStatus("saving");
    startTransition(async () => {
      const id = await saveCarouselDesign({ id: designId, title, slides });
      if (id) {
        setDesignId(id);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("idle");
      }
    });
  }

  // ── AI Generate ──────────────────────────────────────────────────────────

  function handleAIGenerate(newSlides: CarouselSlide[], newTitle: string) {
    setSlides(newSlides);
    setTitle(newTitle);
    setActiveSlideIndex(0);
    setSelectedElementId(null);
    setShowAI(false);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold bg-transparent border-none outline-none focus:ring-0 p-0 text-foreground w-64 truncate"
          />
          <Badge variant="secondary">{slides.length} slide{slides.length !== 1 ? "s" : ""}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAI((v) => !v)}
            className="gap-1.5 text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
          >
            <Sparkles className="h-4 w-4" />
            AI Generate
            <ChevronDown className={`h-3 w-3 transition-transform ${showAI ? "rotate-180" : ""}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export PNG
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saveStatus === "saving"}
          >
            <Save className="h-4 w-4" />
            {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved ✓" : "Save Draft"}
          </Button>
        </div>
      </div>

      {/* AI panel — collapsible */}
      {showAI && (
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
          <AIGeneratePanel onGenerate={handleAIGenerate} />
        </div>
      )}

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: slide thumbnails */}
        <div className="w-28 flex flex-col gap-2 overflow-y-auto">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => { setActiveSlideIndex(i); setSelectedElementId(null); }}
              className={`relative w-full aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                i === activeSlideIndex
                  ? "border-primary"
                  : "border-transparent hover:border-border"
              }`}
            >
              <div
                className="w-full h-full"
                style={{ background: slideBackground(slide) }}
              />
              <span className="absolute bottom-1 left-1 text-[9px] font-medium bg-black/50 text-white px-1 rounded">
                {i + 1}
              </span>
            </button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 text-xs"
            onClick={addSlide}
          >
            <Plus className="h-3 w-3" />
            Slide
          </Button>
        </div>

        {/* Center: canvas preview */}
        <div className="flex-1 flex flex-col items-center gap-3 min-w-0">
          {/* Slide nav */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={activeSlideIndex === 0}
              onClick={() => { setActiveSlideIndex((i) => i - 1); setSelectedElementId(null); }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {activeSlideIndex + 1} / {slides.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={activeSlideIndex === slides.length - 1}
              onClick={() => { setActiveSlideIndex((i) => i + 1); setSelectedElementId(null); }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Canvas */}
          <div
            ref={slideRef}
            className="relative w-full max-w-[480px] aspect-square rounded-xl overflow-hidden shadow-2xl select-none cursor-default"
            style={{ background: slideBackground(activeSlide) }}
            onClick={() => setSelectedElementId(null)}
          >
            {activeSlide.elements.map((el) => (
              <div
                key={el.id}
                className={`absolute cursor-move transition-all ${
                  selectedElementId === el.id
                    ? "outline outline-2 outline-primary outline-offset-2 rounded"
                    : ""
                }`}
                style={{
                  left: `${el.x}%`,
                  top: `${el.y}%`,
                  transform: "translate(-50%, -50%)",
                  color: el.color,
                  fontSize: `${el.fontSize}px`,
                  fontWeight: el.fontWeight,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
                  lineHeight: el.type === "text" ? 1.1 : 1.35,
                  letterSpacing: el.type === "text" ? "-0.02em" : "0",
                  textAlign: el.align,
                  maxWidth: "84%",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
                onMouseDown={(e) => handleMouseDown(e, el.id, el.x, el.y)}
              >
                {el.text}
              </div>
            ))}
          </div>

          {/* Slide actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={duplicateSlide}>
              <Copy className="h-3 w-3" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs text-destructive hover:text-destructive"
              onClick={deleteSlide}
              disabled={slides.length === 1}
            >
              <Trash2 className="h-3 w-3" />
              Delete Slide
            </Button>
          </div>
        </div>

        {/* Right: properties panel */}
        <Card className="w-64 shrink-0 overflow-y-auto">
          <CardContent className="p-4 flex flex-col gap-5">
            {/* Background section */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Background
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTemplate(t.id)}
                    title={t.label}
                    className="w-full aspect-square rounded-md border-2 border-transparent hover:border-primary transition-colors overflow-hidden"
                    style={{
                      background:
                        t.backgroundType === "gradient"
                          ? `linear-gradient(${t.gradientDirection}, ${t.gradientFrom}, ${t.gradientTo})`
                          : t.backgroundColor,
                    }}
                  />
                ))}
              </div>

              {/* Custom solid color */}
              <div className="mt-3 grid gap-1.5">
                <Label className="text-xs">Custom Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeSlide.backgroundColor}
                    onChange={(e) =>
                      updateSlide({
                        backgroundType: "solid",
                        backgroundColor: e.target.value,
                      })
                    }
                    className="h-8 w-8 rounded cursor-pointer border border-input"
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {activeSlide.backgroundColor}
                  </span>
                </div>
              </div>
            </div>

            {/* Add element */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Add Element
              </p>
              <div className="grid gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start gap-2 h-8 text-xs"
                  onClick={() => addElement("text")}
                >
                  <Type className="h-3.5 w-3.5" />
                  Heading
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start gap-2 h-8 text-xs"
                  onClick={() => addElement("subtitle")}
                >
                  <Type className="h-3.5 w-3.5 opacity-70" />
                  Subtitle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start gap-2 h-8 text-xs"
                  onClick={() => addElement("body")}
                >
                  <Type className="h-3.5 w-3.5 opacity-50" />
                  Body Text
                </Button>
              </div>
            </div>

            {/* Selected element properties */}
            {selectedElement && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Text Element
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={() => deleteElement(selectedElement.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid gap-3">
                  {/* Text */}
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Text</Label>
                    <textarea
                      value={selectedElement.text}
                      onChange={(e) =>
                        updateElement(selectedElement.id, { text: e.target.value })
                      }
                      className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm resize-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30 min-h-[60px]"
                    />
                  </div>

                  {/* Color */}
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedElement.color}
                        onChange={(e) =>
                          updateElement(selectedElement.id, { color: e.target.value })
                        }
                        className="h-8 w-8 rounded cursor-pointer border border-input"
                      />
                      <span className="text-xs text-muted-foreground font-mono">
                        {selectedElement.color}
                      </span>
                    </div>
                  </div>

                  {/* Font size */}
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Font Size: {selectedElement.fontSize}px</Label>
                    <input
                      type="range"
                      min="10"
                      max="80"
                      value={selectedElement.fontSize}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          fontSize: Number(e.target.value),
                        })
                      }
                      className="w-full accent-primary"
                    />
                  </div>

                  {/* Font weight */}
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Weight</Label>
                    <Select
                      value={selectedElement.fontWeight}
                      onValueChange={(v) => {
                        if (v)
                          updateElement(selectedElement.id, {
                            fontWeight: v as "normal" | "bold",
                          });
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Alignment */}
                  <div className="grid gap-1.5">
                    <Label className="text-xs">Alignment</Label>
                    <div className="flex gap-1">
                      {(["left", "center", "right"] as const).map((a) => {
                        const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
                        return (
                          <Button
                            key={a}
                            variant={selectedElement.align === a ? "default" : "outline"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateElement(selectedElement.id, { align: a })}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Position */}
                  <div className="grid gap-1.5">
                    <Label className="text-xs">
                      Position: {Math.round(selectedElement.x)}%, {Math.round(selectedElement.y)}%
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Drag the element on the canvas to reposition it.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!selectedElement && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                Click an element on the canvas to edit it.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
