"use server";

import { isGroqConfigured, groqChatComplete, type GroqContentPart } from "@/lib/groq/client";
import { isAnthropicConfigured, getAnthropicClient } from "@/lib/anthropic/client";
import type { CarouselSlide, CarouselElement } from "@/lib/actions/carousel";
import type Anthropic from "@anthropic-ai/sdk";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ReferenceImage {
  data: string; // base64 without the data:...;base64, prefix
  mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  name: string;
}

export interface AIGenerateInput {
  prompt: string;
  slideCount?: number;
  referenceImages?: ReferenceImage[];
  instagramProfiles?: string[];
}

export interface AIGenerateResult {
  slides: CarouselSlide[];
  title: string;
  error?: string;
}

interface AISlide {
  layoutType?: "hero" | "content" | "stat" | "quote" | "cta";
  badge?: string;
  title: string;
  subtitle?: string;
  body?: string;
  ctaText?: string;
  backgroundColor: string;
  backgroundType: "solid" | "gradient";
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: "to bottom" | "to right" | "to bottom right";
  textColor: string;
  accentColor?: string;
  titleAlign?: "left" | "center" | "right";
  titleY?: number;
  subtitleY?: number;
  bodyY?: number;
  titleFontSize?: number;
  subtitleFontSize?: number;
}

interface AIResponse {
  title: string;
  colorPalette?: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
  };
  slides: AISlide[];
}

// ── Default brand palette (@gastondroz) ────────────────────────────────────

const DEFAULT_PALETTE = {
  background: "#0C1014",
  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  accent: "#00D4B0",
};

// ── System prompt ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an elite Instagram carousel designer working for high-converting coaches, consultants and educators.

DEFAULT BRAND REFERENCE — @gastondroz (Gastón | Marketing para nutricionistas):
• Background: Very dark navy #0C1014 (gradients: #0C1014 → #0f2133 or #0C1014 → #1a2a1f)
• Accent / highlight color: Mint turquoise #00D4B0
• Primary text: White #FFFFFF
• Secondary text: Slate #94A3B8
• Typography: Bold impactful headlines, clean light subtitles, high contrast
• Tone: Direct, confident, data-driven, Argentine Spanish
• Content style: Educational frameworks, numbered lists, strong CTAs, results-focused

DESIGN PRINCIPLES:
1. One dominant idea per slide — no clutter
2. Strong typographic hierarchy: title much bigger than subtitle
3. Vary alignment: hero slides centered, content slides left-aligned (x:28%, align:left) for premium editorial feel
4. Badge labels ("01", "02", "→", "✓") add structure and professionalism — use them on content slides
5. Font sizes (calibrated for 480px canvas): hero titles 28-32px · content titles 24-28px · subtitles 13-15px · body 11-12px · badge 10px
6. Slide 1: scroll-stopping hook with curiosity gap or bold claim — MAX 4 WORDS for title
7. Middle slides: one key insight each, numbered with badge — MAX 5 WORDS title, MAX 8 WORDS subtitle
8. Last slide: clear direct CTA — what to do RIGHT NOW
9. Contrast is non-negotiable: white text on dark, dark text on light

LAYOUT POSITION GUIDE:
• Hero (centered): titleY:40, subtitleY:60, no badge
• Content left-aligned: badge at (titleY-12), title at titleY:30, subtitle at subtitleY:52
• Quote (centered): title at titleY:38, subtitle at subtitleY:58
• CTA: title at titleY:35, subtitle at subtitleY:55, ctaText at 72

Respond ONLY with valid JSON. Absolutely no markdown, no explanation text.`;

// ── Main prompt ────────────────────────────────────────────────────────────

function buildPrompt(input: AIGenerateInput): string {
  const count = input.slideCount ?? 4;
  const hasImages = (input.referenceImages?.length ?? 0) > 0;
  const hasProfiles = (input.instagramProfiles?.length ?? 0) > 0;

  let context = "";
  if (hasImages) {
    context += `\nVISUAL REFERENCES: Analyze the ${input.referenceImages!.length} reference image(s) above. Extract exact colors, typography weight, aesthetic mood. Override default brand colors with what you see.\n`;
  }
  if (hasProfiles) {
    context += `\nADDITIONAL INSTAGRAM REFERENCES (adapt copy voice and tone to match):\n${input.instagramProfiles!.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n`;
  }

  return `${context}
Create a premium ${count}-slide Instagram carousel for this topic:
"${input.prompt}"

Slide structure:
• Slide 1 — HERO: Hook that stops the scroll. Big bold claim or curiosity gap. No badge.
• Slides 2–${count - 1} — CONTENT: One insight per slide. Numbered badges (01, 02…). Left-aligned for premium feel.
• Slide ${count} — CTA: Strong direct action. What should the reader do right now?

Return this exact JSON (all fields shown, omit only truly optional ones):
{
  "title": "internal design name",
  "colorPalette": {
    "background": "#hex",
    "textPrimary": "#hex",
    "textSecondary": "#hex",
    "accent": "#hex"
  },
  "slides": [
    {
      "layoutType": "hero",
      "badge": null,
      "title": "Max 4 words here",
      "subtitle": "Max 8 words supporting line",
      "body": null,
      "ctaText": null,
      "backgroundColor": "#0C1014",
      "backgroundType": "gradient",
      "gradientFrom": "#0C1014",
      "gradientTo": "#0f2133",
      "gradientDirection": "to bottom",
      "textColor": "#FFFFFF",
      "accentColor": "#00D4B0",
      "titleAlign": "center",
      "titleY": 40,
      "subtitleY": 60,
      "titleFontSize": 30,
      "subtitleFontSize": 14
    },
    {
      "layoutType": "content",
      "badge": "01",
      "title": "Max 5 words title",
      "subtitle": "Max 8 words subtitle here",
      "body": null,
      "ctaText": null,
      "backgroundColor": "#0C1014",
      "backgroundType": "solid",
      "gradientFrom": null,
      "gradientTo": null,
      "gradientDirection": null,
      "textColor": "#FFFFFF",
      "accentColor": "#00D4B0",
      "titleAlign": "left",
      "titleY": 30,
      "subtitleY": 50,
      "titleFontSize": 26,
      "subtitleFontSize": 14
    }
  ]
}

CRITICAL RULES:
- titleFontSize: hero=28-32px, content=24-28px, cta=26-30px. NEVER above 34px.
- subtitleFontSize: always 13-15px. NEVER above 16px.
- title word count: hero MAX 4 words, content MAX 5 words
- subtitle word count: MAX 8 words
- textColor MUST contrast on backgroundColor (white on dark, dark on light)
- All hex colors must be valid 6-digit hex codes
- Vary titleAlign: hero→center, content→left, cta→center
- Badge for content slides: "01", "02", etc. Null for hero and cta
- ctaText only on the last CTA slide`;
}

// ── AI Slide → CarouselSlide ───────────────────────────────────────────────

function aiSlideToCarouselSlide(slide: AISlide, palette: AIResponse["colorPalette"]): CarouselSlide {
  const pal = palette ?? DEFAULT_PALETTE;
  const elements: CarouselElement[] = [];

  const align = slide.titleAlign ?? "center";
  const x = align === "left" ? 28 : align === "right" ? 72 : 50;
  const accent = slide.accentColor ?? pal.accent;
  const textColor = slide.textColor ?? pal.textPrimary;

  // Badge (slide number / icon label)
  if (slide.badge) {
    elements.push({
      id: crypto.randomUUID(),
      type: "body",
      text: slide.badge,
      color: accent,
      fontSize: 10,
      fontWeight: "bold",
      x,
      y: (slide.titleY ?? 30) - 11,
      align,
    });
  }

  // Title
  if (slide.title) {
    elements.push({
      id: crypto.randomUUID(),
      type: "text",
      text: slide.title,
      color: textColor,
      fontSize: slide.titleFontSize ?? (slide.layoutType === "hero" ? 30 : 26),
      fontWeight: "bold",
      x,
      y: slide.titleY ?? (slide.subtitle ? 35 : 46),
      align,
    });
  }

  // Subtitle
  if (slide.subtitle) {
    elements.push({
      id: crypto.randomUUID(),
      type: "subtitle",
      text: slide.subtitle,
      color: slide.layoutType === "content" ? pal.textSecondary : textColor,
      fontSize: slide.subtitleFontSize ?? 14,
      fontWeight: "normal",
      x,
      y: slide.subtitleY ?? 57,
      align,
    });
  }

  // Body
  if (slide.body) {
    elements.push({
      id: crypto.randomUUID(),
      type: "body",
      text: slide.body,
      color: pal.textSecondary,
      fontSize: 14,
      fontWeight: "normal",
      x,
      y: (slide.subtitleY ?? 57) + 16,
      align,
    });
  }

  // CTA text
  if (slide.ctaText) {
    elements.push({
      id: crypto.randomUUID(),
      type: "subtitle",
      text: `→ ${slide.ctaText}`,
      color: accent,
      fontSize: 18,
      fontWeight: "bold",
      x: 50,
      y: (slide.subtitleY ?? 57) + 18,
      align: "center",
    });
  }

  return {
    id: crypto.randomUUID(),
    backgroundType: slide.backgroundType ?? "solid",
    backgroundColor: slide.backgroundColor ?? pal.background,
    gradientFrom: slide.gradientFrom ?? slide.backgroundColor ?? pal.background,
    gradientTo: slide.gradientTo ?? slide.backgroundColor ?? pal.background,
    gradientDirection: slide.gradientDirection ?? "to bottom",
    elements,
  };
}

// ── JSON parser ────────────────────────────────────────────────────────────

function parseAIJson(raw: string): AIResponse | null {
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]!);
  } catch {
    return null;
  }
}

// ── Groq generation ────────────────────────────────────────────────────────

async function generateWithGroq(input: AIGenerateInput): Promise<AIGenerateResult> {
  const hasImages = (input.referenceImages?.length ?? 0) > 0;
  const model = hasImages
    ? "meta-llama/llama-4-scout-17b-16e-instruct"
    : "llama-3.3-70b-versatile";

  const userContent: GroqContentPart[] = [];

  if (hasImages) {
    userContent.push({ type: "text", text: `Analyze these ${input.referenceImages!.length} visual reference(s) for style and colors:` });
    for (const img of input.referenceImages!) {
      userContent.push({ type: "image_url", image_url: { url: `data:${img.mediaType};base64,${img.data}` } });
    }
  }

  userContent.push({ type: "text", text: buildPrompt(input) });

  const raw = await groqChatComplete(
    [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: hasImages ? userContent : buildPrompt(input) },
    ],
    model,
    2048
  );

  const parsed = parseAIJson(raw);
  if (!parsed) return { slides: [], title: "", error: "Could not parse AI response." };

  return {
    slides: parsed.slides.map((s) => aiSlideToCarouselSlide(s, parsed.colorPalette)),
    title: parsed.title ?? "AI Carousel",
  };
}

// ── Anthropic fallback ─────────────────────────────────────────────────────

async function generateWithAnthropic(input: AIGenerateInput): Promise<AIGenerateResult> {
  const client = getAnthropicClient()!;
  const hasImages = (input.referenceImages?.length ?? 0) > 0;
  const content: Anthropic.ContentBlockParam[] = [];

  if (hasImages) {
    content.push({ type: "text", text: `Analyze these ${input.referenceImages!.length} reference image(s):` });
    for (const img of input.referenceImages!) {
      content.push({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.data } });
    }
  }
  content.push({ type: "text", text: buildPrompt(input) });

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
  });

  const raw = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const parsed = parseAIJson(raw);
  if (!parsed) return { slides: [], title: "", error: "Could not parse AI response." };

  return {
    slides: parsed.slides.map((s) => aiSlideToCarouselSlide(s, parsed.colorPalette)),
    title: parsed.title ?? "AI Carousel",
  };
}

// ── Server Action ──────────────────────────────────────────────────────────

export async function generateCarouselWithAI(input: AIGenerateInput): Promise<AIGenerateResult> {
  try {
    if (isGroqConfigured()) return await generateWithGroq(input);
    if (isAnthropicConfigured()) return await generateWithAnthropic(input);
    return { slides: [], title: "", error: "No AI key configured. Add GROQ_API_KEY or ANTHROPIC_API_KEY to .env.local." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { slides: [], title: "", error: `AI generation failed: ${msg}` };
  }
}
