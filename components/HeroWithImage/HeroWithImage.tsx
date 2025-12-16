"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface HeroWithImageProps {
  title: string;
  subtitle?: string;
  image?: string | null;
  imageAlt: string;
  icon?: ReactNode;
  badge?: string;
  height?: "small" | "medium" | "large" | "full";
  overlay?: "light" | "medium" | "dark";
  alignment?: "left" | "center" | "right";
}

export function HeroWithImage({
  title,
  subtitle,
  image,
  imageAlt,
  icon,
  badge,
  height = "large",
  overlay = "medium",
  alignment = "center",
}: HeroWithImageProps) {
  // Altura padronizada para todas as imagens de títulos
  const heightClasses = {
    small: "h-[40vh] lg:h-[50vh]",
    medium: "h-[50vh] lg:h-[60vh]",
    large: "h-[70vh] lg:h-[80vh]",
    full: "h-[70vh] lg:h-[80vh]"
  };

  const overlayClasses = {
    light: "bg-gradient-to-b from-black/40 via-black/30 to-black/50",
    medium: "bg-gradient-to-b from-black/60 via-black/40 to-black/70",
    dark: "bg-gradient-to-b from-black/70 via-black/60 to-black/80"
  };

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end"
  };

  // Validar se a imagem existe antes de renderizar
  const hasImage = image && image.trim() !== "";

  return (
    <section 
      className={`relative ${heightClasses[height]} -mt-20 lg:-mt-28 pt-36 lg:pt-52 flex items-center justify-center overflow-hidden`}
    >
      {/* Imagem de Fundo com Parallax */}
      {hasImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={90}
            loading="eager"
          />
          {/* Overlay gradiente */}
          <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
        </div>
      )}
      {!hasImage && (
        <div className={`absolute inset-0 z-0 bg-gradient-to-br from-primary/20 to-primary/40 ${overlayClasses[overlay]}`} />
      )}

      {/* Conteúdo */}
      <div className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-white flex flex-col ${alignmentClasses[alignment]}`}>
        {icon && (
          <div className="mb-6 drop-shadow-2xl">
            {icon}
          </div>
        )}
        
        {badge && (
          <Badge className="mb-6 text-base px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30" variant="secondary">
            {badge}
          </Badge>
        )}
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 drop-shadow-2xl max-w-5xl">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl drop-shadow-xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}


