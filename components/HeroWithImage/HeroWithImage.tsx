"use client";

import Image from "@/lib/app-image";
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
  // Altura do bloco: quando o zoom aumenta, a viewport em CSS pixels diminui; em viewports menores usamos mais altura (min-height e vh maiores) para o conteúdo não ficar apertado
  const heightClasses = {
    small: "min-h-[400px] h-[65vh] sm:min-h-[420px] sm:h-[60vh] lg:min-h-[380px] lg:h-[60vh]",
    medium: "min-h-[480px] h-[75vh] sm:min-h-[500px] sm:h-[72vh] lg:min-h-[420px] lg:h-[70vh]",
    large: "min-h-[520px] h-[80vh] sm:min-h-[540px] sm:h-[76vh] lg:min-h-[480px] lg:h-[75vh] xl:h-[80vh]",
    full: "min-h-[520px] h-[80vh] sm:min-h-[540px] sm:h-[76vh] lg:min-h-[480px] lg:h-[75vh] xl:h-[80vh]"
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
  // overflow-hidden na section; conteúdo com padding-bottom para não cortar texto em viewports/zoom variados
  return (
    <section 
      className={`relative hero-zoom-height ${heightClasses[height]} -mt-48 lg:-mt-56 pt-72 lg:pt-80 flex items-center justify-center overflow-x-clip`}
    >
      {/* Imagem de Fundo com Parallax */}
      {hasImageNode ? (
        <div className="absolute inset-0 z-0 w-full h-full min-w-full min-h-full hero-bg-image">
          {/* Camada da imagem: z-0 para ficar abaixo do overlay; escala com zoom */}
          <div className="absolute inset-0 z-0 w-full h-full min-w-full min-h-full [&_img]:!w-full [&_img]:!h-full [&_img]:!min-w-full [&_img]:!min-h-full [&_img]:object-cover [&_img]:object-center [&>div]:absolute [&>div]:inset-0 [&>div]:z-0">
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
        <div className="absolute inset-0 z-0 w-full h-full min-w-full min-h-full hero-bg-image">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover hero-bg-image"
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

      {/* Conteúdo: overflow-visible para ícone/título nunca serem cortados; ícone menor em viewports críticos */}
      <div className={`hero-title-content relative z-10 container mx-auto min-w-0 max-w-full px-4 sm:px-6 lg:px-8 text-white flex flex-col -mt-16 lg:-mt-24 pb-12 sm:pb-14 md:pb-16 lg:pb-16 overflow-visible ${alignmentClasses[alignment]}`}>
        {icon && (
          <div className="hero-title-icon mb-4 lg:mb-6 drop-shadow-2xl flex-shrink-0 [&_svg]:w-12 [&_svg]:h-12 sm:[&_svg]:w-14 sm:[&_svg]:h-14 lg:[&_svg]:w-12 lg:[&_svg]:h-12 xl:[&_svg]:w-16 xl:[&_svg]:h-16">
            {icon}
          </div>
        )}
        
        {badge && (
          <Badge className="mb-4 lg:mb-6 text-sm lg:text-base px-3 py-1.5 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm border-white/30 flex-shrink-0 w-fit" variant="secondary">
            {badge}
          </Badge>
        )}
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 drop-shadow-2xl max-w-5xl min-w-0 break-words w-full">
          {title}
        </h1>
        
        {subtitle != null && subtitle !== "" && (
          <p className="text-lg sm:text-xl lg:text-2xl max-w-3xl min-w-0 break-words w-full drop-shadow-xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}


