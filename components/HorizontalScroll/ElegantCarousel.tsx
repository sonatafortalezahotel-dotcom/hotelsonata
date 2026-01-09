"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ElegantCarouselProps {
  children: ReactNode;
  className?: string;
  itemWidth?: "full" | "auto" | "small" | "medium" | "large";
  showNavigation?: boolean;
  showProgress?: boolean;
  progressType?: "dots" | "line" | "minimal"; // Tipo de indicador
  autoplay?: boolean;
  autoplayInterval?: number;
  centerMode?: boolean; // Centraliza o item ativo
  gap?: number;
}

export function ElegantCarousel({
  children,
  className,
  itemWidth = "auto",
  showNavigation = true,
  showProgress = true,
  progressType = "minimal",
  autoplay = false,
  autoplayInterval = 5000,
  centerMode = false,
  gap = 6,
}: ElegantCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Calcular largura do item
  const getItemWidthClass = () => {
    switch (itemWidth) {
      case "full":
        return "w-full";
      case "small":
        return "w-[200px] md:w-[240px]";
      case "medium":
        return "w-[280px] md:w-[320px]";
      case "large":
        return "w-[320px] md:w-[400px]";
      case "auto":
      default:
        return "w-auto";
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

    // Calcular índice atual
    const scrollPercentage = container.scrollLeft / (container.scrollWidth - container.clientWidth);
    const index = Math.round(scrollPercentage * (totalItems - 1));
    setCurrentIndex(index);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    setTotalItems(container.children.length);
    checkScroll();
    
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [children, totalItems]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || isHovered) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      if (canScrollRight) {
        scroll("right");
      } else {
        // Voltar ao início
        container.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, isHovered, canScrollRight]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.7;
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

    const itemWidth = container.scrollWidth / totalItems;
    container.scrollTo({
      left: index * itemWidth,
      behavior: "smooth",
    });
  };

  // Progress Line
  const progressPercentage = totalItems > 1 
    ? (currentIndex / (totalItems - 1)) * 100 
    : 0;

  return (
    <div 
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container com scroll */}
      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide scroll-smooth",
          `gap-${gap}`,
          centerMode && "snap-x snap-mandatory"
        )}
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
              className={cn(
                "flex-shrink-0",
                getItemWidthClass(),
                centerMode && "snap-center"
              )}
            >
              {child}
            </div>
          ))
        ) : (
          <div className={cn("flex-shrink-0", getItemWidthClass())}>
            {children}
          </div>
        )}
      </div>

      {/* Navegação Minimalista */}
      {showNavigation && (
        <>
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 rounded-full",
                "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm",
                "shadow-lg hover:shadow-xl",
                "flex items-center justify-center",
                "transition-all duration-300",
                "opacity-0 group-hover:opacity-100",
                "hover:scale-110 active:scale-95",
                "-ml-5"
              )}
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10",
                "w-10 h-10 rounded-full",
                "bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm",
                "shadow-lg hover:shadow-xl",
                "flex items-center justify-center",
                "transition-all duration-300",
                "opacity-0 group-hover:opacity-100",
                "hover:scale-110 active:scale-95",
                "-mr-5"
              )}
              aria-label="Próximo"
            >
              <ChevronRight className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            </button>
          )}
        </>
      )}

      {/* Indicadores de Progresso */}
      {showProgress && totalItems > 1 && (
        <div className="mt-8">
          {progressType === "dots" && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalItems }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-primary/20 w-2 hover:bg-primary/40"
                  )}
                  aria-label={`Ir para item ${index + 1}`}
                />
              ))}
            </div>
          )}

          {progressType === "line" && (
            <div className="flex justify-center">
              <div className="w-64 h-1 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {progressType === "minimal" && (
            <div className="flex justify-center items-center gap-3">
              {/* Linha de progresso minimalista */}
              <div className="w-32 h-0.5 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              {/* Contador */}
              <span className="text-xs text-muted-foreground font-medium tabular-nums">
                {currentIndex + 1} / {totalItems}
              </span>
            </div>
          )}
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
