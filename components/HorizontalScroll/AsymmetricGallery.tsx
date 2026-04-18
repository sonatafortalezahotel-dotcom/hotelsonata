"use client";

import { useState, useEffect } from "react";
import Image from "@/lib/app-image";
import { cn } from "@/lib/utils";
import { HorizontalScroll } from "@/components/HorizontalScroll";

interface AsymmetricGalleryProps {
  images: string[];
  interval?: number;
  className?: string;
  /** Altura do layout desktop (Tailwind). Ex: h-[85vh] min-h-[750px]. Default h-[80vh] min-h-[700px]. */
  desktopHeight?: string;
  /** Altura no mobile (Tailwind). Ex: h-[55vh]. Default h-[40vh]. */
  mobileHeight?: string;
  /** Qualidade da imagem Next/Image (1-100). Default 75. Use 100 para máxima. */
  imageQuality?: number;
  /** Ao clicar numa imagem, índice dentro do array images (0-based) */
  onImageClick?: (index: number) => void;
}

/**
 * Galeria Assimétrica - 1 coluna grande + 4 fotos menores
 * Todas as fotos trocam de posição animadamente
 */
export function AsymmetricGallery({
  images,
  interval = 4000,
  className,
  desktopHeight = "h-[80vh] min-h-[700px]",
  mobileHeight = "h-[40vh]",
  imageQuality = 75,
  onImageClick,
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
              <div
                key={i}
                role={onImageClick ? "button" : undefined}
                tabIndex={onImageClick ? 0 : undefined}
                onClick={onImageClick ? () => onImageClick(i) : undefined}
                onKeyDown={onImageClick ? (e) => e.key === "Enter" && onImageClick(i) : undefined}
                className={cn("relative aspect-square rounded-lg overflow-hidden", onImageClick && "cursor-pointer")}
              >
                <Image src={img} alt={`Imagem ${i + 1}`} fill quality={imageQuality} className="object-cover rounded-lg" sizes="85vw" />
              </div>
            ))}
          </HorizontalScroll>
        </div>
        {/* Desktop: Grid 2x2 */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-0">
          {images.map((img, i) => (
            <div
              key={i}
              role={onImageClick ? "button" : undefined}
              tabIndex={onImageClick ? 0 : undefined}
              onClick={onImageClick ? () => onImageClick(i) : undefined}
              onKeyDown={onImageClick ? (e) => e.key === "Enter" && onImageClick(i) : undefined}
              className={cn("relative aspect-square", onImageClick && "cursor-pointer")}
            >
              <Image src={img} alt={`Imagem ${i + 1}`} fill quality={imageQuality} className="object-cover" sizes="50vw" />
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
          {mobileImages.map((imageSrc, index) => {
            const imageIndex = positions[index] % images.length;
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              </div>
            );
          })}
        </HorizontalScroll>
      </div>

      {/* Desktop: Layout Assimétrico FULLWIDTH */}
      <div className={cn("hidden lg:grid lg:grid-cols-2 gap-0", desktopHeight)}>
        {/* Coluna Esquerda - Foto Grande */}
        <div
          role={onImageClick ? "button" : undefined}
          tabIndex={onImageClick ? 0 : undefined}
          onClick={onImageClick ? () => onImageClick(positions[0] % images.length) : undefined}
          onKeyDown={onImageClick ? (e) => e.key === "Enter" && onImageClick(positions[0] % images.length) : undefined}
          className={cn(
            "relative overflow-hidden group",
            "transition-all duration-500",
            onImageClick && "cursor-pointer",
            isAnimating && "opacity-90"
          )}
        >
          <Image
            src={images[positions[0] % images.length]}
            alt="Destaque Principal"
            fill
            quality={imageQuality}
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
                  isAnimating && "opacity-80 scale-95"
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
