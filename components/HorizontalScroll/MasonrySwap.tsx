"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MasonrySwapProps {
  images: string[];
  interval?: number; // Intervalo de troca em ms
  className?: string;
}

/**
 * Grid Masonry onde imagens trocam de posição
 * - Layout estilizado sem espaços
 * - Imagens animam e trocam de lugar
 * - 4 posições fixas com rotação
 */
export function MasonrySwap({
  images,
  interval = 4000,
  className,
}: MasonrySwapProps) {
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

  if (images.length < 4) {
    return (
      <div className="grid grid-cols-2 gap-0">
        {images.map((img, i) => (
          <div key={i} className="relative aspect-square">
            <Image src={img} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  // Layout Masonry estilizado
  // [0: grande] [1: médio]
  // [2: médio] [3: médio]
  const layouts = [
    { gridArea: "1 / 1 / 3 / 2", aspectRatio: "aspect-[2/3]" }, // 0: Alto esquerda
    { gridArea: "1 / 2 / 2 / 3", aspectRatio: "aspect-video" },  // 1: Largo topo direita
    { gridArea: "2 / 2 / 3 / 3", aspectRatio: "aspect-square" }, // 2: Quadrado meio direita
    { gridArea: "3 / 1 / 4 / 3", aspectRatio: "aspect-[3/1]" },  // 3: Panorâmico baixo
  ];

  return (
    <div 
      className={cn(
        "grid grid-cols-2 grid-rows-3 gap-0 w-full h-[600px] md:h-[700px] lg:h-[800px]",
        className
      )}
    >
      {positions.map((imageIndex, positionIndex) => {
        const layout = layouts[positionIndex];
        const imageSrc = images[imageIndex % images.length];

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
              className={cn(
                "object-cover",
                "transition-transform duration-700",
                "group-hover:scale-110"
              )}
              sizes="(max-width: 768px) 50vw, 33vw"
            />

            {/* Overlay sutil no hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        );
      })}
    </div>
  );
}
