"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface FullWidthGalleryImage {
  src: string;
  alt: string;
  title?: string;
}

interface FullWidthGalleryProps {
  images: FullWidthGalleryImage[];
  /**
   * Classes de altura (Tailwind) para controlar o tamanho vertical da galeria.
   * Ex: "h-[400px] md:h-[600px]".
   */
  height?: string;
  className?: string;
  /** Se false, não exibe overlay com título e contador (ex: "Foto 1", "1 / 4"). Default true */
  showCaption?: boolean;
  /** Autoplay: troca de slide sozinho. Roda sempre, mesmo com mouse em cima. Default true quando há múltiplas imagens */
  autoplay?: boolean;
  /** Intervalo do autoplay em ms. Default 5000 */
  autoplayInterval?: number;
}

export function FullWidthGallery({
  images,
  height = "h-[320px] md:h-[480px]",
  className,
  showCaption = true,
  autoplay = true,
  autoplayInterval = 5000,
}: FullWidthGalleryProps) {
  const validImages = (images || []).filter(
    (image) =>
      typeof image?.src === "string" && image.src.trim().length > 0,
  );
  const [api, setApi] = useState<CarouselApi | null>(null);
  const hasMultiple = validImages.length > 1;

  // Autoplay: roda sempre (mesmo com mouse em cima). Hooks devem vir antes de qualquer return.
  useEffect(() => {
    if (!hasMultiple || !autoplay || !api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [hasMultiple, autoplay, autoplayInterval, api]);

  if (validImages.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Carousel
        className="w-full"
        opts={{
          loop: hasMultiple,
          align: "start",
        }}
        setApi={setApi}
      >
        <CarouselContent>
          {validImages.map((image, index) => (
            <CarouselItem key={index} className="basis-full">
              <div
                className={cn(
                  "relative w-full overflow-hidden",
                  height,
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                  quality={90}
                />

                {/* Overlay com título opcional e contador */}
                {showCaption && (image.title || hasMultiple) && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                      {image.title && (
                        <p className="text-sm sm:text-base lg:text-lg font-semibold text-white drop-shadow-lg">
                          {image.title}
                        </p>
                      )}
                      {hasMultiple && (
                        <span className="text-xs text-white/80">
                          {index + 1} / {validImages.length}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {hasMultiple && (
          <>
            <CarouselPrevious className="bg-black/40 text-white border-none hover:bg-black/60" />
            <CarouselNext className="bg-black/40 text-white border-none hover:bg-black/60" />
          </>
        )}
      </Carousel>
    </div>
  );
}


