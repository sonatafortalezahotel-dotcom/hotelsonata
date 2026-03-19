"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function PhotoCarouselSkeleton() {
  return (
    <section className="py-10 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-8 lg:mb-16">
          <Skeleton className="h-10 w-72 mx-auto mb-4" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Imagem Principal */}
          <div className="relative w-full rounded-lg overflow-hidden shadow-2xl">
            <AspectRatio ratio={16 / 9}>
              <Skeleton className="w-full h-full" />
            </AspectRatio>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-4 mt-6 lg:mt-8">
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                className="w-20 h-20 md:w-24 md:h-24 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

