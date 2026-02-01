"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EditorialSlideProps {
  image: string | ReactNode;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  description?: string | ReactNode;
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

  const hasValidImageUrl =
    typeof image === "string" && image.trim().length > 0 && (image.startsWith("http") || image.startsWith("/") || image.startsWith("blob:"));

  return (
    <div className={cn("relative w-full h-[500px] md:h-[600px] lg:h-[700px]", className)}>
      {/* Imagem de Fundo - evita quebrar com URL vazia/inválida após publicar e recarregar */}
      {typeof image === "string" && hasValidImageUrl ? (
        <Image
          src={image}
          alt={typeof title === "string" ? title : "Slide"}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      ) : typeof image === "string" ? (
        <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">
          Sem imagem
        </div>
      ) : (
        <div className="absolute inset-0">{image}</div>
      )}

      {/* Overlay Gradiente - pointer-events-none para permitir clicar na imagem no modo edição */}
      <div className={cn("absolute inset-0 pointer-events-none", overlayClasses[overlay])} />

      {/* Texto Sobreposto - pointer-events-none no container para cliques na imagem; pointer-events-auto só no bloco de texto */}
      <div className={cn(
        "absolute inset-0 flex flex-col z-10 pointer-events-none",
        textPositionClasses[textPosition]
      )}>
        <div className="pointer-events-auto">
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
    </div>
  );
}
