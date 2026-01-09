"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface EditorialSlideProps {
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
  textPosition?: "left" | "center" | "right" | "bottom-left" | "bottom-right";
  overlay?: "none" | "light" | "medium" | "dark";
  className?: string;
}

/**
 * Slide Editorial - Imagem Fullwidth com Texto Sobreposto
 * Estilo revista/Vogue
 */
export function EditorialSlide({
  image,
  title,
  subtitle,
  description,
  textPosition = "bottom-left",
  overlay = "medium",
  className,
}: EditorialSlideProps) {
  const overlayClasses = {
    none: "",
    light: "bg-gradient-to-t from-black/30 via-transparent to-transparent",
    medium: "bg-gradient-to-t from-black/60 via-black/20 to-transparent",
    dark: "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
  };

  const textPositionClasses = {
    left: "items-start justify-center text-left pl-8 md:pl-16 lg:pl-24",
    center: "items-center justify-center text-center px-8",
    right: "items-end justify-center text-right pr-8 md:pr-16 lg:pr-24",
    "bottom-left": "items-start justify-end text-left pb-12 md:pb-16 lg:pb-20 pl-8 md:pl-16 lg:pl-24",
    "bottom-right": "items-end justify-end text-right pb-12 md:pb-16 lg:pb-20 pr-8 md:pr-16 lg:pr-24",
  };

  return (
    <div className={cn("relative w-full h-[500px] md:h-[600px] lg:h-[700px]", className)}>
      {/* Imagem de Fundo */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Overlay Gradiente */}
      <div className={cn("absolute inset-0", overlayClasses[overlay])} />

      {/* Texto Sobreposto */}
      <div className={cn(
        "absolute inset-0 flex flex-col z-10",
        textPositionClasses[textPosition]
      )}>
        {subtitle && (
          <p className="text-white/90 text-sm md:text-base lg:text-lg font-light uppercase tracking-widest mb-2 md:mb-3">
            {subtitle}
          </p>
        )}

        <h2 className="text-white text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6 drop-shadow-2xl">
          {title}
        </h2>

        {description && (
          <p className="text-white/90 text-base md:text-lg lg:text-xl font-light max-w-xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
