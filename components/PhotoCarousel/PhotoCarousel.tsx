"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getGalleryImageTitle } from "@/lib/utils";

interface Photo {
  id: number;
  title?: string;
  imageUrl: string;
  category?: string;
}

interface PhotoCarouselProps {
  photos?: Photo[];
}

export default function PhotoCarousel({
  photos = [],
}: PhotoCarouselProps) {
  const { locale } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filtrar fotos com imageUrl válido
  const items = photos.filter(photo => photo.imageUrl && photo.imageUrl.trim() !== "");

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-10 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-16 min-w-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 min-w-0 break-words">
            Conheça Nossas Instalações
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Main Image */}
          <div className="relative w-full rounded-lg overflow-hidden shadow-2xl">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={items[currentIndex].imageUrl}
                alt={getGalleryImageTitle(items[currentIndex], currentIndex + 1)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                className="object-cover"
                priority
              />
            </AspectRatio>
          </div>

          {/* Thumbnails */}
          {items.length > 1 && (
            <div className="flex justify-center gap-4 mt-6 lg:mt-8">
              {items.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => goToSlide(index)}
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-primary scale-110 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100 hover:border-primary/50"
                  }`}
                  aria-label={`Ver foto ${index + 1}`}
                >
                  <Image
                    src={photo.imageUrl}
                    alt={getGalleryImageTitle(photo, index + 1)}
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          {items.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setCurrentIndex(
                    currentIndex === 0 ? items.length - 1 : currentIndex - 1
                  )
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm shadow-lg"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentIndex((currentIndex + 1) % items.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm shadow-lg"
                aria-label="Próxima foto"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
