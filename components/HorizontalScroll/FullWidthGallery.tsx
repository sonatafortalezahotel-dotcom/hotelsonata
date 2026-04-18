"use client";

import { useState, useEffect } from "react";
import Image from "@/lib/app-image";
import { cn } from "@/lib/utils";
import { HorizontalScroll } from "@/components/HorizontalScroll";

interface FullWidthGalleryProps {
  images: string[];
  interval?: number;
  /** Altura do grid desktop (Tailwind). Ex: h-[500px] lg:h-[75vh] */
  height?: string;
  /** Altura no mobile (Tailwind). Ex: h-[55vh]. Se não informado, usa h-[40vh]. */
  mobileHeight?: string;
  /** Qualidade da imagem Next/Image (1-100). Default 75. Use 100 para máxima. */
  imageQuality?: number;
  className?: string;
  /** Ao clicar numa imagem, índice dentro do array images (0-based) */
  onImageClick?: (index: number) => void;
}

/**
 * Galeria Fullwidth Horizontal - 3 fotos lado a lado trocando (1x3)
 * Desktop: 1 linha com 3 fotos
 * Mobile: carrossel horizontal
 */
export function FullWidthGallery({
  images,
  interval = 5000,
  height = "h-[400px] md:h-[500px] lg:h-[600px]",
  mobileHeight = "h-[40vh]",
  imageQuality = 75,
  className,
  onImageClick,
}: FullWidthGalleryProps) {
  const [positions, setPositions] = useState<number[]>([0, 1, 2]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (images.length < 3) return;

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

  // Preparar todas as imagens (mapear para formato usado no carrossel)
  const allImages = images.length >= 3 
    ? positions.map((imageIndex) => images[imageIndex % images.length])
    : images;

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
          {allImages.map((imageSrc, index) => {
            const imageIndex = images.length >= 4 ? positions[index] % images.length : index;
            return (
              <div
                key={index}
                role={onImageClick ? "button" : undefined}
                tabIndex={onImageClick ? 0 : undefined}
                onClick={onImageClick ? () => onImageClick(imageIndex) : undefined}
                onKeyDown={onImageClick ? (e) => e.key === "Enter" && onImageClick(imageIndex) : undefined}
                className={cn(
                  "relative overflow-hidden group rounded-lg",
                  mobileHeight,
                  "transition-all duration-500",
                  onImageClick && "cursor-pointer",
                  isAnimating && "opacity-80 scale-95"
                )}
              >
                <Image
                  src={imageSrc}
                  alt={`Imagem ${index + 1}`}
                  fill
                  quality={imageQuality}
                  className={cn(
                    "object-cover rounded-lg",
                    "transition-transform duration-700",
                    "group-hover:scale-110"
                  )}
                  sizes="85vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
            );
          })}
        </HorizontalScroll>
      </div>

      {/* Desktop: Grid Horizontal 1x3 */}
      {images.length >= 3 ? (
        <div className={cn("hidden lg:grid lg:grid-cols-3 gap-0", height)}>
        {positions.map((imageIndex, positionIndex) => {
          const imageSrc = images[imageIndex % images.length];
          const idx = imageIndex % images.length;
          return (
            <div
              key={`${positionIndex}-${imageIndex}`}
              role={onImageClick ? "button" : undefined}
              tabIndex={onImageClick ? 0 : undefined}
              onClick={onImageClick ? () => onImageClick(idx) : undefined}
              onKeyDown={onImageClick ? (e) => e.key === "Enter" && onImageClick(idx) : undefined}
              className={cn(
                "relative overflow-hidden group",
                "transition-all duration-500",
                onImageClick && "cursor-pointer",
                isAnimating && "opacity-90 scale-[0.98]"
              )}
            >
              <Image
                src={imageSrc}
                alt={`Imagem ${imageIndex + 1}`}
                fill
                quality={imageQuality}
                className={cn(
                  "object-cover",
                  "transition-transform duration-700",
                  "group-hover:scale-110"
                )}
                sizes="33vw"
                priority={positionIndex === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}
        </div>
      ) : (
        <div className={cn("hidden lg:grid lg:grid-cols-2 gap-0", height)}>
          {images.map((img, i) => (
            <div
              key={i}
              role={onImageClick ? "button" : undefined}
              tabIndex={onImageClick ? 0 : undefined}
              onClick={onImageClick ? () => onImageClick(i) : undefined}
              onKeyDown={onImageClick ? (e) => e.key === "Enter" && onImageClick(i) : undefined}
              className={cn("relative overflow-hidden group", onImageClick && "cursor-pointer")}
            >
              <Image 
                src={img} 
                alt={`Imagem ${i + 1}`} 
                fill 
                quality={imageQuality}
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
