"use client";

import Image from "@/lib/app-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface ExperienceCardProps {
  title: string;
  description: string;
  images: string[];
  icon?: LucideIcon;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function ExperienceCard({
  title,
  description,
  images,
  icon: Icon,
  badge,
  ctaText,
  ctaLink
}: ExperienceCardProps) {
  // Filtrar imagens válidas
  const validImages = Array.isArray(images) ? images.filter(img => img && img.trim() !== "") : [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagem Principal com Hover Slideshow */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {validImages.length > 0 ? (
          validImages.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`${title} - Foto ${index + 1}`}
              fill
              className={`object-cover transition-all duration-700 ${
                index === currentImageIndex 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-110"
              } ${isHovered ? "scale-110" : "scale-100"}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ))
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            {Icon && <Icon className="h-16 w-16 text-muted-foreground/50" />}
          </div>
        )}

        {/* Overlay Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-foreground hover:bg-white shadow-lg">
              {badge}
            </Badge>
          </div>
        )}

        {/* Ícone */}
        {Icon && (
          <div className="absolute top-4 left-4 p-3 bg-white/90 rounded-full shadow-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}

        {/* Conteúdo Sobreposto */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
            {title}
          </h3>
          <p className="text-sm text-white/90 mb-4 line-clamp-2 drop-shadow">
            {description}
          </p>

          {/* CTA e Indicadores - Aparecem juntos no hover */}
          {ctaText && ctaLink && (
            <div className={`transition-all duration-300 flex flex-col items-center gap-3 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
              {/* Indicadores de Imagem - Na mesma altura do botão */}
              {validImages.length > 1 && (
                <div className="flex justify-center gap-2">
                  {validImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentImageIndex(index);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? "bg-white w-8" 
                          : "bg-white/50 w-1.5 hover:bg-white/75"
                      }`}
                      aria-label={`Ver foto ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              
              <Button 
                asChild 
                variant="secondary" 
                size="sm"
                className="shadow-lg"
              >
                <a href={ctaLink}>{ctaText}</a>
              </Button>
            </div>
          )}
          
          {/* Indicadores quando não tem CTA */}
          {(!ctaText || !ctaLink) && validImages.length > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              {validImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? "bg-white w-8" 
                      : "bg-white/50 w-1.5 hover:bg-white/75"
                  }`}
                  aria-label={`Ver foto ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

