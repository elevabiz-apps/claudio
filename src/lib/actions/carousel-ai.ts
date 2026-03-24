"use server";

import {
  isGroqConfigured,
  groqChatComplete,
  type GroqContentPart,
} from "@/lib/groq/client";
import type { CarouselSlide, CarouselElement } from "@/lib/actions/carousel";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ReferenceImage {
  data: string; // base64 (without data:... prefix)
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
}

interface AIResponse {
  title: string;
  slides: AISlide[];
}

// ── Prompt ─────────────────────────────────────────────────────────────────

function buildPrompt(input: AIGenerateInput): string {
  const count = input.slideCount ?? 4;
  const hasImages = (input.referenceImages?.length ?? 0) > 0;
  const hasProfiles = (input.instagramProfiles?.length ?? 0) > 0;

  let contextSection = "";

  if (hasImages) {
    contextSection += `
VISUAL REFERENCES (images provided above):
Carefully analyze the reference images provided. Extract and replicate:
- Color palette: dominant colors, accent colors, background tones
- Typography style: font weight, sizing hierarchy, text density
- Overall aesthetic: minimalist, bold, editorial, playful, luxury, etc.
- Layout patterns: how elements are arranged and spaced
- Mood and tone: the emotional feel of the visual style
The carousel MUST match this visual identity closely.
`;
  }

  if (hasProfiles) {
    contextSection += `
INSTAGRAM PROFILE REFERENCES:
${input.instagramProfiles!.map((p, i) => `${i + 1}. ${p}`).join("\n")}
These are Instagram profiles to use as context for:
- Brand voice and tone of copywriting
- Communication style (formal/casual, inspirational/educational, etc.)
- Content structure and messaging patterns
- Target audience and how they speak to them
Align the carousel text and tone with this brand identity.
`;
  }

  return `You are a professional social media designer specializing in Instagram carousel posts.
${hasImages || hasProfiles ? `\nIMPORTANT CONTEXT:\n${contextSection}` : ""}
Create a ${count}-slide Instagram carousel design for the following idea:

"${input.prompt}"

${hasImages ? "Use the colors, aesthetic, and visual style from the reference images as your primary design guide." : ""}
${hasProfiles ? "Match the tone, voice, and communication style of the referenced Instagram profiles." : ""}

Respond ONLY with a valid JSON object (no markdown, no extra explanation) in this exact format:
{
  "title": "short name for the carousel design",
  "slides": [
    {
      "title": "Main headline text (max 8 words)",
      "subtitle": "Supporting text or key point (max 15 words, optional)",
      "body": "Extra detail if needed (max 20 words, optional)",
      "ctaText": "Call to action text for last slide only (optional)",
      "backgroundColor": "#hexcolor",
      "backgroundType": "solid" or "gradient",
      "gradientFrom": "#hexcolor (only if gradient)",
      "gradientTo": "#hexcolor (only if gradient)",
      "gradientDirection": "to bottom" or "to right" or "to bottom right",
      "textColor": "#hexcolor (must contrast well with background)"
    }
  ]
}

Design guidelines:
- Use a consistent color palette across all slides${hasImages ? " — extracted from the reference images" : ""}
- First slide: hook/attention-grabbing headline
- Middle slides: value/content/key points
- Last slide: CTA (call to action)
- Text must be readable — ensure high contrast between textColor and background
- Keep text short and impactful
- Use gradients for visual interest when appropriate`;
}

// ── AI Slide → CarouselSlide transformer ──────────────────────────────────

function aiSlideToCarouselSlide(aiSlide: AISlide): CarouselSlide {
  const elements: CarouselElement[] = [];

  if (aiSlide.title) {
    elements.push({
      id: crypto.randomUUID(),
      type: "text",
      text: aiSlide.title,
      color: aiSlide.textColor,
      fontSize: 36,
      fontWeight: "bold",
      x: 50,
      y: aiSlide.subtitle ? 35 : 50,
      align: "center",
    });
  }

  if (aiSlide.subtitle) {
    elements.push({
      id: crypto.randomUUID(),
      type: "subtitle",
      text: aiSlide.subtitle,
      color: aiSlide.textColor,
      fontSize: 20,
      fontWeight: "normal",
      x: 50,
      y: aiSlide.title ? 55 : 50,
      align: "center",
    });
  }

  if (aiSlide.body) {
    elements.push({
      id: crypto.randomUUID(),
      type: "body",
      text: aiSlide.body,
      color: aiSlide.textColor,
      fontSize: 14,
      fontWeight: "normal",
      x: 50,
      y: 72,
      align: "center",
    });
  }

  if (aiSlide.ctaText) {
    elements.push({
      id: crypto.randomUUID(),
      type: "subtitle",
      text: `→ ${aiSlide.ctaText}`,
      color: aiSlide.textColor,
      fontSize: 18,
      fontWeight: "bold",
      x: 50,
      y: 82,
      align: "center",
    });
  }

  return {
    id: crypto.randomUUID(),
    backgroundType: aiSlide.backgroundType ?? "solid",
    backgroundColor: aiSlide.backgroundColor ?? "#0f0f0f",
    gradientFrom: aiSlide.gradientFrom ?? aiSlide.backgroundColor ?? "#0f0f0f",
    gradientTo: aiSlide.gradientTo ?? aiSlide.backgroundColor ?? "#0f0f0f",
    gradientDirection: aiSlide.gradientDirection ?? "to bottom",
    elements,
  };
}

// ── Build message content ──────────────────────────────────────────────────

function buildMessageContent(input: AIGenerateInput): GroqContentPart[] {
  const content: GroqContentPart[] = [];
  const hasImages = (input.referenceImages?.length ?? 0) > 0;

  if (hasImages) {
    content.push({
      type: "text",
      text: `I'm providing ${input.referenceImages!.length} reference image(s) below. Analyze their visual style, color palette, typography, and aesthetic carefully — you will replicate this style in the carousel design.`,
    });

    for (const img of input.referenceImages!) {
      content.push({
        type: "image_url",
        image_url: {
          url: `data:${img.mediaType};base64,${img.data}`,
        },
      });
    }
  }

  content.push({ type: "text", text: buildPrompt(input) });

  return content;
}

// ── Server Action ──────────────────────────────────────────────────────────

export async function generateCarouselWithAI(
  input: AIGenerateInput
): Promise<AIGenerateResult> {
  if (!isGroqConfigured()) {
    return {
      slides: [],
      title: "",
      error: "GROQ_API_KEY not configured. Add it to your environment variables.",
    };
  }

  const hasImages = (input.referenceImages?.length ?? 0) > 0;
  // Use vision model when images are present, otherwise use the faster text model
  const model = hasImages
    ? "meta-llama/llama-4-scout-17b-16e-instruct"
    : "llama-3.3-70b-versatile";

  try {
    const content = buildMessageContent(input);

    // Groq expects content as string for text-only, array for multimodal
    const messageContent =
      content.length === 1 && content[0].type === "text"
        ? content[0].text!
        : content;

    const rawText = await groqChatComplete(
      [{ role: "user", content: messageContent as string }],
      model,
      2048
    );

    // Extract JSON — model might wrap it in ```json ... ```
    const jsonMatch =
      rawText.match(/```(?:json)?\s*([\s\S]*?)```/) ??
      rawText.match(/(\{[\s\S]*\})/);

    if (!jsonMatch) {
      return { slides: [], title: "", error: "Could not parse AI response." };
    }

    const parsed: AIResponse = JSON.parse(jsonMatch[1]!);
    const slides = parsed.slides.map(aiSlideToCarouselSlide);

    return { slides, title: parsed.title ?? "AI Carousel" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { slides: [], title: "", error: `AI generation failed: ${message}` };
  }
}
