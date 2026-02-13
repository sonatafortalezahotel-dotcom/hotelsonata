"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorialCarouselProps {
  children: ReactNode;
  className?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  showNavigation?: boolean;
  /** Quando true, setas ficam sempre visíveis (útil em editMode para rolar sem esperar) */
  navigationAlwaysVisible?: boolean;
  showProgress?: boolean;
}

/**
 * Carrossel Editorial Fullwidth
 * - Imagens coladas sem espaço
 * - Texto sobreposto nas imagens
 * - Transições suaves
 * - Estilo revista/Vogue
 */
export function EditorialCarousel({
  children,
  className,
  autoplay = false,
  autoplayInterval = 5000,
  showNavigation = true,
  navigationAlwaysVisible = false,
  showProgress = true,
}: EditorialCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalItems = Array.isArray(children) ? children.length : children ? 1 : 0;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= totalItems && totalItems > 0) setCurrentIndex(0);
  }, [totalItems, currentIndex]);

  // Autoplay (sempre rodando, sem pausar no hover)
  useEffect(() => {
    if (!autoplay || totalItems === 0) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, currentIndex, totalItems]);

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % totalItems;
    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollToIndex(prevIndex);
  };

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * index;
    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // Detectar scroll manual
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const index = Math.round(container.scrollLeft / container.clientWidth);
    setCurrentIndex(index);
  };

  const progressPercentage = totalItems > 0 
    ? ((currentIndex + 1) / totalItems) * 100 
    : 0;

  return (
    <div 
      className={cn("relative w-full overflow-hidden group", className)}
    >
      {/* Container Fullwidth - Imagens Coladas */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full snap-start snap-always"
            >
              {child}
            </div>
          ))
        ) : (
          <div className="flex-shrink-0 w-full snap-start snap-always">
            {children}
          </div>
        )}
      </div>

      {/* Navegação - Setas < > (sempre visíveis em editMode, senão no hover) */}
      {showNavigation && totalItems > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              "absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20",
              "w-12 h-12 md:w-14 md:h-14",
              "rounded-full backdrop-blur-md",
              "bg-white/10 hover:bg-white/20",
              "border border-white/20",
              "flex items-center justify-center",
              "transition-all duration-300",
              navigationAlwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              "hover:scale-110 active:scale-95"
            )}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6 md:h-7 md:h-7 text-white drop-shadow-lg" />
          </button>

          <button
            onClick={goToNext}
            className={cn(
              "absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20",
              "w-12 h-12 md:w-14 md:h-14",
              "rounded-full backdrop-blur-md",
              "bg-white/10 hover:bg-white/20",
              "border border-white/20",
              "flex items-center justify-center",
              "transition-all duration-300",
              navigationAlwaysVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              "hover:scale-110 active:scale-95"
            )}
            aria-label="Próximo"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:h-7 text-white drop-shadow-lg" />
          </button>
        </>
      )}

      {/* Indicador de Progresso - Barra Fina no Topo */}
      {showProgress && totalItems > 1 && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <div
            className="h-full bg-white transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {/* Contador - Canto Inferior Direito */}
      {totalItems > 1 && (
        <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 z-20">
          <div className="px-4 py-2 rounded-full backdrop-blur-md bg-black/30 border border-white/20">
            <span className="text-white text-sm md:text-base font-medium tabular-nums">
              {currentIndex + 1} / {totalItems}
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
