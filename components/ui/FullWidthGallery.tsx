"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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
}

export function FullWidthGallery({
  images,
  height = "h-[320px] md:h-[480px]",
  className,
}: FullWidthGalleryProps) {
  const validImages = (images || []).filter(
    (image) =>
      typeof image?.src === "string" && image.src.trim().length > 0,
  );

  if (validImages.length === 0) {
    return null;
  }

  const hasMultiple = validImages.length > 1;

  return (
    <div className={cn("relative w-full", className)}>
      <Carousel
        className="w-full"
        opts={{
          loop: hasMultiple,
          align: "start",
        }}
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

                {/* Overlay com título opcional */}
                {(image.title || hasMultiple) && (
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


