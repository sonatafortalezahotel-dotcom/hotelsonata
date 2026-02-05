"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HorizontalScroll } from "@/components/HorizontalScroll";

interface MasonrySwapProps {
  images: string[];
  interval?: number; // Intervalo de troca em ms
  className?: string;
}

const SLOT_COUNT = 4;

/**
 * Grid Masonry onde imagens trocam de posição
 * - Layout estilizado sem espaços (4 posições fixas)
 * - Rotaciona entre TODAS as fotos cadastradas (janela deslizante)
 */
export function MasonrySwap({
  images,
  interval = 4000,
  className,
}: MasonrySwapProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const n = images.length;

  // Índices atuais: janela de 4 posições que avança por toda a lista (0,1,2,3 → 1,2,3,4 → … → volta ao 0)
  const positions = n >= SLOT_COUNT
    ? Array.from({ length: SLOT_COUNT }, (_, i) => (startIndex + i) % n)
    : Array.from({ length: Math.min(n, SLOT_COUNT) }, (_, i) => i % n);

  useEffect(() => {
    if (n < SLOT_COUNT) return;

    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setStartIndex((prev) => (prev + 1) % n);
        setIsAnimating(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [n, interval]);

  if (images.length < 4) {
    return (
      <div>
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
                <Image src={img} alt={`Imagem ${i + 1}`} fill className="object-cover rounded-lg" sizes="85vw" quality={90} />
              </div>
            ))}
          </HorizontalScroll>
        </div>
        {/* Desktop: Grid 2x2 */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-0">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square">
              <Image src={img} alt={`Imagem ${i + 1}`} fill className="object-cover" sizes="50vw" quality={90} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Layout Masonry estilizado
  // [0: grande] [1: médio] [2: médio] [3: panorâmico]
  // sizes: maior valor = Next.js serve imagem mais resolução = melhor qualidade (evita pixelado)
  const layouts = [
    { gridArea: "1 / 1 / 3 / 2", sizes: "(min-width: 1024px) 50vw, 100vw" }, // 0: coluna esquerda
    { gridArea: "1 / 2 / 2 / 3", sizes: "(min-width: 1024px) 50vw, 100vw" }, // 1: topo direita
    { gridArea: "2 / 2 / 3 / 3", sizes: "(min-width: 1024px) 50vw, 100vw" }, // 2: meio direita
    { gridArea: "3 / 1 / 4 / 3", sizes: "100vw" },                             // 3: faixa larga baixo
  ];

  return (
    <>
      {/* Mobile: Carrossel Horizontal */}
      <div className="lg:hidden">
        <HorizontalScroll 
          itemWidth="85" 
          showArrows={false} 
          showDots={true}
          gap={4}
        >
          {images.map((imageSrc, index) => (
            <div
              key={index}
              className={cn(
                "relative overflow-hidden group cursor-pointer rounded-lg",
                "aspect-[4/3]",
                "transition-all duration-500",
                isAnimating && "opacity-80 scale-95"
              )}
            >
              <Image
                src={imageSrc}
                alt={`Imagem ${index + 1}`}
                fill
                quality={90}
                className={cn(
                  "object-cover rounded-lg",
                  "transition-transform duration-700",
                  "group-hover:scale-110"
                )}
                sizes="85vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </div>
          ))}
        </HorizontalScroll>
      </div>

      {/* Desktop: Grid Masonry */}
      <div 
        className={cn(
          "hidden lg:grid lg:grid-cols-2 lg:grid-rows-3 gap-0 w-full h-[700px] lg:h-[800px]",
          className
        )}
      >
      {positions.map((imageIndex, positionIndex) => {
        const layout = layouts[positionIndex];
        const imageSrc = images[imageIndex];
        const sizes = typeof layout === "object" && "sizes" in layout ? layout.sizes : "(min-width: 1024px) 50vw, 100vw";

        return (
          <div
            key={`${positionIndex}-${imageIndex}`}
            style={{ gridArea: layout.gridArea }}
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
              quality={90}
              className={cn(
                "object-cover",
                "transition-transform duration-700",
                "group-hover:scale-110"
              )}
              sizes={sizes}
            />

            {/* Overlay sutil no hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        );
      })}
      </div>
    </>
  );
}
