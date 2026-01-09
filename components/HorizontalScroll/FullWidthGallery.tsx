"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FullWidthGalleryProps {
  images: string[];
  interval?: number;
  height?: string;
  className?: string;
}

/**
 * Galeria Fullwidth Horizontal - 4 fotos lado a lado trocando
 * Desktop: 1 linha com 4 fotos
 * Mobile: 2x2 grid
 */
export function FullWidthGallery({
  images,
  interval = 5000,
  height = "h-[400px] md:h-[500px] lg:h-[600px]",
  className,
}: FullWidthGalleryProps) {
  const [positions, setPositions] = useState<number[]>([0, 1, 2, 3]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (images.length < 4) return;

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

  if (images.length === 0) {
    return null;
  }

  if (images.length < 4) {
    return (
      <div className="grid grid-cols-2 gap-0">
        {images.map((img, i) => (
          <div key={i} className={cn("relative", height)}>
            <Image src={img} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className={cn("relative w-full", className)}>
      {/* Mobile: Grid 2x2 */}
      <div className="grid grid-cols-2 gap-0 lg:hidden">
        {positions.map((imageIndex, positionIndex) => {
          const imageSrc = images[imageIndex % images.length];
          return (
            <div
              key={`${positionIndex}-${imageIndex}`}
              className={cn(
                "relative overflow-hidden group cursor-pointer",
                "h-[40vh]",
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
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>

      {/* Desktop: Horizontal 1x4 */}
      <div className={cn("hidden lg:grid lg:grid-cols-4 gap-0", height)}>
        {positions.map((imageIndex, positionIndex) => {
          const imageSrc = images[imageIndex % images.length];
          return (
            <div
              key={`${positionIndex}-${imageIndex}`}
              className={cn(
                "relative overflow-hidden group cursor-pointer",
                "transition-all duration-500",
                isAnimating && "opacity-90 scale-[0.98]"
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
                priority={positionIndex === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
