import { getCarouselDesigns } from "@/lib/actions/carousel";
import { CarouselDesignerPage } from "@/components/carousel/carousel-designer-page";

export default async function CarouselPage() {
  const designs = await getCarouselDesigns();
  return <CarouselDesignerPage designs={designs} />;
}
