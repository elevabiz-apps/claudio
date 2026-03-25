"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  AlertCircle,
  ImagePlus,
  X,
  Link,
  Plus,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateCarouselWithAI } from "@/lib/actions/carousel-ai";
import type { CarouselSlide } from "@/lib/actions/carousel";
import type { AIGenerateInput, ReferenceImage } from "@/lib/actions/carousel-ai";

interface AIGeneratePanelProps {
  onGenerate: (slides: CarouselSlide[], title: string) => void;
}

const SLIDE_COUNT_OPTIONS = [3, 4, 5, 6];

const PROMPT_EXAMPLES = [
  "carousel para vender ropa de verano femenina",
  "5 beneficios de la meditación diaria",
  "guía de alimentación saludable para deportistas",
  "tips para mejorar tu productividad",
  "cómo empezar un negocio online desde cero",
];

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGES = 4;

// ── Helpers ────────────────────────────────────────────────────────────────

function fileToReferenceImage(file: File): Promise<ReferenceImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Strip "data:image/jpeg;base64," prefix
      const base64 = dataUrl.split(",")[1] ?? "";
      resolve({
        data: base64,
        mediaType: file.type as ReferenceImage["mediaType"],
        name: file.name,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Component ──────────────────────────────────────────────────────────────

export function AIGeneratePanel({ onGenerate }: AIGeneratePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [slideCount, setSlideCount] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // References state
  const [referenceImages, setReferenceImages] = useState<
    Array<ReferenceImage & { previewUrl: string }>
  >([]);
  const referenceImagesRef = useRef<Array<ReferenceImage & { previewUrl: string }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [instagramProfiles, setInstagramProfiles] = useState<string[]>([""]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep ref in sync with state so the unmount cleanup can access current images
  referenceImagesRef.current = referenceImages;

  // Revoke all object URLs when the component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      referenceImagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, []);

  // ── Image handling ───────────────────────────────────────────────────────

  async function addFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((f) =>
      ACCEPTED_IMAGE_TYPES.includes(f.type)
    );
    const remaining = MAX_IMAGES - referenceImages.length;
    const toAdd = imageFiles.slice(0, remaining);

    const converted = await Promise.all(
      toAdd.map(async (file) => {
        const ref = await fileToReferenceImage(file);
        return { ...ref, previewUrl: URL.createObjectURL(file) };
      })
    );

    setReferenceImages((prev) => [...prev, ...converted]);
  }

  function removeImage(index: number) {
    setReferenceImages((prev) => {
      URL.revokeObjectURL(prev[index]!.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  // ── Instagram profiles handling ──────────────────────────────────────────

  function updateProfile(index: number, value: string) {
    setInstagramProfiles((prev) =>
      prev.map((p, i) => (i === index ? value : p))
    );
  }

  function addProfileField() {
    if (instagramProfiles.length < 3) {
      setInstagramProfiles((prev) => [...prev, ""]);
    }
  }

  function removeProfileField(index: number) {
    if (instagramProfiles.length === 1) {
      setInstagramProfiles([""]);
    } else {
      setInstagramProfiles((prev) => prev.filter((_, i) => i !== index));
    }
  }

  // ── Generate ─────────────────────────────────────────────────────────────

  function handleGenerate() {
    if (!prompt.trim()) return;
    setError(null);

    const validProfiles = instagramProfiles
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const input: AIGenerateInput = {
      prompt: prompt.trim(),
      slideCount,
      referenceImages: referenceImages.length > 0
        ? referenceImages.map(({ data, mediaType, name }) => ({ data, mediaType, name }))
        : undefined,
      instagramProfiles: validProfiles.length > 0 ? validProfiles : undefined,
    };

    startTransition(async () => {
      const result = await generateCarouselWithAI(input);
      if (result.error) {
        setError(result.error);
      } else {
        onGenerate(result.slides, result.title);
      }
    });
  }

  const hasReferences =
    referenceImages.length > 0 ||
    instagramProfiles.some((p) => p.trim().length > 0);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {/* ── Left column: prompt + slide count + generate ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Describe tu carrusel
          </p>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: carousel educativo sobre nutrición deportiva para atletas..."
          className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm resize-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30 min-h-[90px]"
          disabled={isPending}
        />

        {/* Example prompts */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Ejemplos
          </p>
          {PROMPT_EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setPrompt(ex)}
              disabled={isPending}
              className="text-left text-[11px] text-muted-foreground hover:text-foreground truncate px-2 py-1 rounded hover:bg-muted transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Slide count */}
        <div className="grid gap-1.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Cantidad de slides
          </p>
          <div className="flex gap-1">
            {SLIDE_COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setSlideCount(n)}
                disabled={isPending}
                className={`flex-1 rounded-md border text-xs py-1 transition-colors ${
                  slideCount === n
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-input text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive leading-relaxed">{error}</p>
          </div>
        )}

        <Button
          size="sm"
          className="w-full gap-2"
          onClick={handleGenerate}
          disabled={isPending || !prompt.trim()}
        >
          {isPending ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Generando{hasReferences ? " con referencias" : ""}…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generar Carrusel{hasReferences ? " con Referencias" : ""}
            </>
          )}
        </Button>

        <p className="text-[10px] text-muted-foreground text-center">
          Requiere <code className="font-mono">GROQ_API_KEY</code> en variables de entorno
        </p>
      </div>

      {/* ── Right column: references ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5 text-blue-400" />
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Referencias de estilo
          </p>
        </div>

        {/* Image upload zone */}
        <div className="grid gap-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <ImagePlus className="h-3 w-3" />
            Imágenes de referencia
            <span className="normal-case text-muted-foreground/60">
              ({referenceImages.length}/{MAX_IMAGES})
            </span>
          </p>

          {/* Drop zone */}
          {referenceImages.length < MAX_IMAGES && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-5 cursor-pointer transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-input hover:border-muted-foreground"
              } ${isPending ? "pointer-events-none opacity-50" : ""}`}
            >
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground text-center">
                <span className="font-medium text-foreground">Click</span> o arrastra imágenes
              </p>
              <p className="text-[10px] text-muted-foreground">
                JPG, PNG, WEBP · máx {MAX_IMAGES} imágenes
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                multiple
                className="hidden"
                onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
              />
            </div>
          )}

          {/* Image previews */}
          {referenceImages.length > 0 && (
            <div className="grid grid-cols-4 gap-1.5">
              {referenceImages.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-md overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.previewUrl}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    disabled={isPending}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
              {/* Add more */}
              {referenceImages.length < MAX_IMAGES && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="aspect-square rounded-md border-2 border-dashed border-input hover:border-muted-foreground flex items-center justify-center transition-colors"
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          )}

          {referenceImages.length > 0 && (
            <p className="text-[10px] text-blue-400/80 flex items-start gap-1">
              <Info className="h-3 w-3 mt-0.5 shrink-0" />
              Claude analizará la paleta de colores, tipografía y estética visual de estas imágenes.
            </p>
          )}
        </div>

        {/* Instagram profiles */}
        <div className="grid gap-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Link className="h-3 w-3" />
            Perfiles de Instagram
          </p>

          <div className="flex flex-col gap-1.5">
            {instagramProfiles.map((profile, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    @
                  </span>
                  <input
                    type="text"
                    value={profile}
                    onChange={(e) => updateProfile(i, e.target.value)}
                    placeholder="usuario o instagram.com/usuario"
                    disabled={isPending}
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent pl-7 pr-3 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-input/30"
                  />
                </div>
                {instagramProfiles.length > 1 && (
                  <button
                    onClick={() => removeProfileField(i)}
                    disabled={isPending}
                    className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {instagramProfiles.length < 3 && (
            <button
              onClick={addProfileField}
              disabled={isPending}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-1"
            >
              <Plus className="h-3 w-3" />
              Agregar otro perfil
            </button>
          )}

          {instagramProfiles.some((p) => p.trim().length > 0) && (
            <p className="text-[10px] text-blue-400/80 flex items-start gap-1">
              <Info className="h-3 w-3 mt-0.5 shrink-0" />
              Claude usará estos perfiles para adaptar el tono, voz y estilo comunicacional del carrusel.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
