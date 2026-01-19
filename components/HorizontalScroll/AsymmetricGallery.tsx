"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HorizontalScroll } from "@/components/HorizontalScroll";

interface AsymmetricGalleryProps {
  images: string[];
  interval?: number;
  className?: string;
}

/**
 * Galeria Assimétrica - 1 coluna grande + 4 fotos menores
 * Todas as fotos trocam de posição animadamente
 */
export function AsymmetricGallery({
  images,
  interval = 4000,
  className,
}: AsymmetricGalleryProps) {
  const [positions, setPositions] = useState<number[]>([0, 1, 2, 3, 4]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (images.length < 5) return;

    const timer = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setPositions((prev) => {
          // Rotacionar posições
          const newPositions = [...prev];
          const first = newPositions.shift()!;
          newPositions.push(first);
          return newPositions;
        });
        setIsAnimating(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  // Preparar imagens para o carrossel mobile
  const mobileImages = images.length >= 5 
    ? positions.map((imageIndex) => images[imageIndex % images.length])
    : images;

  if (images.length < 5) {
    return (
      <section className={cn("relative w-full", className)}>
        {/* Mobile: Carrossel */}
        <div className="lg:hidden">
          <HorizontalScroll 
            itemWidth="85" 
            showArrows={false} 
            showDots={true}
            gap={4}
          >
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                <Image src={img} alt={`Imagem ${i + 1}`} fill className="object-cover rounded-lg" sizes="85vw" />
              </div>
            ))}
          </HorizontalScroll>
        </div>
        {/* Desktop: Grid 2x2 */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-0">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square">
              <Image src={img} alt={`Imagem ${i + 1}`} fill className="object-cover" sizes="50vw" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("relative w-full", className)}>
      {/* Mobile: Carrossel Horizontal */}
      <div className="lg:hidden">
        <HorizontalScroll 
          itemWidth="85" 
          showArrows={false} 
          showDots={true}
          gap={4}
        >
          {mobileImages.map((imageSrc, index) => (
            <div
              key={index}
              className={cn(
                "relative overflow-hidden group cursor-pointer rounded-lg",
                "h-[40vh]",
                "transition-all duration-500",
                isAnimating && "opacity-80 scale-95"
              )}
            >
              <Image
                src={imageSrc}
                alt={`Imagem ${index + 1}`}
                fill
                className={cn(
                  "object-cover rounded-lg",
                  "transition-transform duration-700",
                  "group-hover:scale-110"
                )}
                sizes="85vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </div>
          ))}
        </HorizontalScroll>
      </div>

      {/* Desktop: Layout Assimétrico FULLWIDTH */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-0 h-[80vh] min-h-[700px]">
        {/* Coluna Esquerda - Foto Grande */}
        <div
          className={cn(
            "relative overflow-hidden group cursor-pointer",
            "transition-all duration-500",
            isAnimating && "opacity-90"
          )}
        >
          <Image
            src={images[positions[0] % images.length]}
            alt="Destaque Principal"
            fill
            className={cn(
              "object-cover",
              "transition-transform duration-700",
              "group-hover:scale-105"
            )}
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Coluna Direita - 4 Fotos Menores (2x2) */}
        <div className="grid grid-cols-2 grid-rows-2 gap-0">
          {positions.slice(1, 5).map((imageIndex, positionIndex) => {
            const imageSrc = images[imageIndex % images.length];
            return (
              <div
                key={`${positionIndex}-${imageIndex}`}
                className={cn(
                  "relative overflow-hidden group cursor-pointer",
                  "transition-all duration-500",
                  isAnimating && "opacity-80 scale-95"
                )}
              >
                <Image
                  src={imageSrc}
                  alt={`Imagem ${imageIndex + 1}`}
                  fill
                  className={cn(
                    "object-cover",
                    "transition-transform duration-700",
                    "group-hover:scale-110"
                  )}
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
