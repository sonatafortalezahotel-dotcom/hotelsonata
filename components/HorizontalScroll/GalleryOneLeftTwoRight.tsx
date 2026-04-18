"use client";

import { useState, useEffect } from "react";
import Image from "@/lib/app-image";
import { cn } from "@/lib/utils";
import { HorizontalScroll } from "@/components/HorizontalScroll";

/** Altura do grid (1 esq + 2 dir) usada pelo componente e pelo modo edição em todas as páginas. */
export const GALLERY_ONE_LEFT_TWO_RIGHT_GRID_HEIGHT =
  "lg:h-[560px] xl:h-[680px] 2xl:h-[760px]";

export interface GalleryOneLeftTwoRightProps {
  /** Lista de URLs de imagens. Mostra 3 por vez (1 esq + 2 dir). Se interval for passado e houver mais de 3, rotaciona. */
  images: string[];
  /** Intervalo em ms para trocar o trio de imagens (rotatividade). Se não passado ou lista <= 3, não rotaciona. */
  interval?: number;
  className?: string;
}

/**
 * Galeria com layout fixo: 1 imagem à esquerda, 2 à direita (empilhadas).
 * Se interval for definido e houver mais de 3 imagens, rotaciona o trio a cada interval ms.
 */
export function GalleryOneLeftTwoRight({ images, interval, className }: GalleryOneLeftTwoRightProps) {
  const valid = images.filter((url) => url && typeof url === "string" && url.trim() !== "");
  const n = valid.length;

  const [startIndex, setStartIndex] = useState(0);

  // Rotatividade: a cada interval ms avança o índice (janela de 3)
  useEffect(() => {
    if (interval == null || interval <= 0 || n <= 3) return;
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % n);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, n]);

  // Trio atual: sempre 3 posições (cíclico)
  const left = valid[startIndex % n] ?? "";
  const rightTop = valid[(startIndex + 1) % n] ?? "";
  const rightBottom = valid[(startIndex + 2) % n] ?? "";

  const hasAny = left || rightTop || rightBottom;

  if (!hasAny) {
    return null;
  }

  // Mobile: carrossel horizontal com todas as imagens (ou o trio atual se n <= 3)
  const mobileImages = n > 3 ? valid : [left, rightTop, rightBottom].filter(Boolean);
  if (mobileImages.length === 0) return null;

  return (
    <>
      <div className="lg:hidden">
        <HorizontalScroll itemWidth="85" showArrows={false} showDots={true} gap={4}>
          {mobileImages.map((src, i) => (
            <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={src}
                alt={`Imagem ${i + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="85vw"
                quality={90}
              />
            </div>
          ))}
        </HorizontalScroll>
      </div>

      {/* Desktop: 1 esquerda, 2 direita */}
      <div
        className={cn(
          "hidden lg:grid lg:grid-cols-2 lg:gap-4 w-full",
          `lg:grid-rows-2 ${GALLERY_ONE_LEFT_TWO_RIGHT_GRID_HEIGHT}`,
          className
        )}
      >
        {/* Coluna esquerda: 1 imagem ocupando as 2 linhas */}
        <div className="relative row-span-2 rounded-lg overflow-hidden">
          {left ? (
            <Image
              src={left}
              alt="Imagem 1"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={90}
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </div>
        {/* Coluna direita: 2 imagens empilhadas */}
        <div className="relative rounded-lg overflow-hidden">
          {rightTop ? (
            <Image
              src={rightTop}
              alt="Imagem 2"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={90}
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </div>
        <div className="relative rounded-lg overflow-hidden">
          {rightBottom ? (
            <Image
              src={rightBottom}
              alt="Imagem 3"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={90}
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </div>
      </div>
    </>
  );
}
