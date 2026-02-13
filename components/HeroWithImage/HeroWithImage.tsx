"use client";

import Image from "next/image";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface HeroWithImageProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  image?: string | null;
  imageAlt: string;
  /** Quando informado (ex.: modo edição), renderiza no lugar da imagem estática */
  imageNode?: ReactNode;
  icon?: ReactNode;
  badge?: string | ReactNode;
  height?: "small" | "medium" | "large" | "full";
  overlay?: "light" | "medium" | "dark";
  alignment?: "left" | "center" | "right";
  /** Qualidade da imagem (1-100). Default 90. Use 100 para qualidade máxima. */
  imageQuality?: number;
}

export function HeroWithImage({
  title,
  subtitle,
  image,
  imageAlt,
  imageNode,
  icon,
  badge,
  height = "medium",
  overlay = "medium",
  alignment = "center",
  imageQuality = 90,
}: HeroWithImageProps) {
  // Altura do bloco da foto (maior para a imagem ir até o topo); resto (margin, padding, conteúdo) inalterado
  const heightClasses = {
    small: "h-[50vh] lg:h-[60vh]",
    medium: "h-[60vh] lg:h-[70vh]",
    large: "h-[70vh] lg:h-[80vh]",
    full: "h-[70vh] lg:h-[80vh]"
  };

  // Gradiente preto para o texto ler bem; topo mais escuro evita faixa branca
  const overlayClasses = {
    light: "bg-gradient-to-b from-black/75 via-black/40 to-black/60",
    medium: "bg-gradient-to-b from-black/80 via-black/50 to-black/75",
    dark: "bg-gradient-to-b from-black/90 via-black/65 to-black/85"
  };

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end"
  };

  // Validar se a imagem existe antes de renderizar
  const hasImage = image && image.trim() !== "";
  const hasImageNode = imageNode != null;

  // Margem negativa bem alta: foto sobe até o topo e cobre qualquer branco (layout/edit); padding-top mantém título abaixo do header
  return (
    <section 
      className={`relative ${heightClasses[height]} -mt-48 lg:-mt-56 pt-72 lg:pt-80 flex items-center justify-center overflow-hidden`}
    >
      {/* Imagem de Fundo com Parallax */}
      {hasImageNode ? (
        <div className="absolute inset-0 z-0">
          {/* Camada da imagem: z-0 para ficar abaixo do overlay e receber cliques */}
          <div className="absolute inset-0 z-0 [&_img]:object-cover [&_img]:w-full [&_img]:h-full [&>div]:absolute [&>div]:inset-0 [&>div]:z-0">
            {imageNode}
          </div>
          {/* Overlay gradiente: z-10 por cima visualmente, pointer-events-none para não bloquear cliques na imagem */}
          <div
            className={`absolute inset-0 z-10 pointer-events-none ${overlayClasses[overlay]}`}
            style={{ pointerEvents: "none" }}
            aria-hidden
          />
        </div>
      ) : hasImage ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={imageQuality}
            loading="eager"
          />
          {/* Overlay gradiente */}
          <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
        </div>
      ) : (
        <div className={`absolute inset-0 z-0 bg-gradient-to-br from-primary/20 to-primary/40 ${overlayClasses[overlay]}`} />
      )}

      {/* Conteúdo: -mt sobe o bloco (ícone, título, subtítulo) */}
      <div className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-white flex flex-col -mt-16 lg:-mt-24 ${alignmentClasses[alignment]}`}>
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
        
        {subtitle != null && subtitle !== "" && (
          <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl drop-shadow-xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}


