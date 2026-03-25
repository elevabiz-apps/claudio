import type { CarouselSlide } from "@/lib/actions/carousel";

export function slideBackground(slide: CarouselSlide): string {
  if (slide.backgroundType === "gradient") {
    return `linear-gradient(${slide.gradientDirection}, ${slide.gradientFrom}, ${slide.gradientTo})`;
  }
  return slide.backgroundColor;
}
