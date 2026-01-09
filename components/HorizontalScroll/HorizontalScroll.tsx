"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  itemWidth?: "full" | "85" | "90" | "auto";
  gap?: number;
  enableDesktop?: boolean; // Se true, scroll horizontal também no desktop
}

export function HorizontalScroll({
  children,
  className,
  showArrows = true,
  showDots = true,
  itemWidth = "85",
  gap = 4,
  enableDesktop = false,
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Calcular largura do item baseado na prop
  const getItemWidthClass = () => {
    switch (itemWidth) {
      case "full":
        return "w-full";
      case "85":
        return "w-[85vw] md:w-[45vw]";
      case "90":
        return "w-[90vw] md:w-[48vw]";
      case "auto":
        return "w-auto min-w-[280px]";
      default:
        return "w-[85vw] md:w-[45vw]";
    }
  };

  // Verificar se pode scrollar
  const checkScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );

    // Calcular índice atual baseado na posição do scroll
    const itemWidthPx = container.clientWidth * (parseInt(itemWidth) / 100 || 0.85);
    const index = Math.round(container.scrollLeft / itemWidthPx);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Contar items
    setTotalItems(container.children.length);

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const itemWidthPx = container.clientWidth * (parseInt(itemWidth) / 100 || 0.85);
    container.scrollTo({
      left: index * itemWidthPx,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Container com scroll */}
      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth",
          `gap-${gap}`,
          enableDesktop ? "" : "lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible"
        )}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Renderizar children com classes apropriadas */}
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <div
              key={index}
              className={cn(
                "flex-shrink-0 snap-start",
                getItemWidthClass(),
                enableDesktop ? "" : "lg:w-auto"
              )}
            >
              {child}
            </div>
          ))
        ) : (
          <div
            className={cn(
              "flex-shrink-0 snap-start",
              getItemWidthClass(),
              enableDesktop ? "" : "lg:w-auto"
            )}
          >
            {children}
          </div>
        )}
      </div>

      {/* Setas de Navegação */}
      {showArrows && !enableDesktop && (
        <>
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                "bg-background/95 backdrop-blur-sm shadow-lg",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "hidden lg:flex"
              )}
              aria-label="Anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                "bg-background/95 backdrop-blur-sm shadow-lg",
                "opacity-0 group-hover:opacity-100 transition-opacity",
                "hidden lg:flex"
              )}
              aria-label="Próximo"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </>
      )}

      {/* Indicadores de Progresso (Dots) */}
      {showDots && totalItems > 1 && !enableDesktop && (
        <div className="flex justify-center gap-2 mt-6 lg:hidden">
          {Array.from({ length: totalItems }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-primary/30 w-2 hover:bg-primary/50"
              )}
              aria-label={`Ir para item ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Esconder scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
