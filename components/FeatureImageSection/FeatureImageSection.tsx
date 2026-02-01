"use client";

import Image from "next/image";
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
  backgroundColor = "white"
}: FeatureImageSectionProps) {
  const bgClasses = {
    white: "bg-background",
    muted: "bg-muted/30",
    primary: "bg-gradient-to-br from-primary/5 to-primary/10"
  };

  return (
    <section className={`py-16 lg:py-24 ${bgClasses[backgroundColor]}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${imagePosition === "left" ? "lg:flex-row-reverse" : ""}`}>
          {/* Conteúdo de Texto */}
          <div className={`${imagePosition === "left" ? "lg:order-2" : "order-1"}`}>
            {badge && (
              <Badge className="mb-4 text-base px-4 py-2" variant="secondary">
                {badge}
              </Badge>
            )}
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {title}
            </h2>
            
            <div className="text-lg text-muted-foreground leading-relaxed mb-6">
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

          {/* Imagem */}
          <div className={`relative ${imagePosition === "left" ? "lg:order-1" : "order-2"}`}>
            <div className="relative aspect-[4/5] lg:aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              {imageNode != null ? (
                <div className="absolute inset-0 [&>img]:w-full [&>img]:h-full [&>img]:object-cover">
                  {imageNode}
                </div>
              ) : image && image.trim() !== "" ? (
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Carregando imagem...</p>
                </div>
              )}
            </div>
            
            {/* Elemento Decorativo */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-primary/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}




