"use client";

import Image from "@/lib/app-image";
import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeatureImageSectionProps {
  title: string | ReactNode;
  description: string | ReactNode;
  image: string | null;
  imageAlt: string;
  /** Quando informado (ex.: modo edição), renderiza no lugar da imagem estática */
  imageNode?: ReactNode;
  badge?: string | ReactNode;
  imagePosition?: "left" | "right";
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: "white" | "muted" | "primary";
  /** Qualidade da imagem Next/Image (1-100). Default 100 para resolução máxima. */
  imageQuality?: number;
}

export function FeatureImageSection({
  title,
  description,
  image,
  imageAlt,
  imageNode,
  badge,
  imagePosition = "right",
  features,
  ctaText,
  ctaLink,
  backgroundColor = "white",
  imageQuality = 80,
}: FeatureImageSectionProps) {
  const bgClasses = {
    white: "bg-background",
    muted: "bg-muted/30",
    primary: "bg-gradient-to-br from-primary/5 to-primary/10"
  };

  return (
    <section className={`py-10 lg:py-24 overflow-visible ${bgClasses[backgroundColor]}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${imagePosition === "left" ? "lg:flex-row-reverse" : ""}`}>
          {/* Conteúdo de Texto - overflow-visible para ícone/badge/título nunca serem cortados */}
          <div className={`feature-section-text min-w-0 overflow-visible ${imagePosition === "left" ? "lg:order-2" : "order-1"}`}>
            <div className="flex flex-wrap items-center gap-2 gap-y-3 mb-4 min-w-0">
              {badge && (
                <Badge className="text-sm lg:text-base px-3 py-1.5 lg:px-4 lg:py-2 flex-shrink-0 w-fit" variant="secondary">
                  {badge}
                </Badge>
              )}
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 min-w-0 break-words">
              {title}
            </h2>
            
            <div className="text-lg text-muted-foreground leading-relaxed mb-6 min-w-0 break-words">
              {description}
            </div>

            {features && features.length > 0 && (
              <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1 flex-shrink-0">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {ctaText && ctaLink && (
              <Button size="lg" asChild>
                <a href={ctaLink}>{ctaText}</a>
              </Button>
            )}
          </div>

          {/* Imagem - elemento decorativo contido para não cortar conteúdo da seção abaixo */}
          <div className={`relative overflow-visible ${imagePosition === "left" ? "lg:order-1" : "order-2"}`}>
            <div className="relative aspect-[4/5] lg:aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl min-w-0">
              {imageNode != null ? (
                <div className="absolute inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover">
                  {imageNode}
                </div>
              ) : image && image.trim() !== "" ? (
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  quality={imageQuality}
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Carregando imagem...</p>
                </div>
              )}
            </div>
            
            {/* Elemento decorativo - contido para não sobrepor/cortar título da seção */}
            <div className="absolute -z-10 -bottom-4 -right-4 left-4 top-4 bg-primary/10 rounded-2xl pointer-events-none" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}




