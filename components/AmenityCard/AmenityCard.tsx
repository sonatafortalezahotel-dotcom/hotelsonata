'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface AmenityCardProps {
  title: string;
  description: string;
  images: string[];
  icon?: LucideIcon;
  schedule?: string;
  badge?: string;
  tags?: string[];
}

export function AmenityCard({ 
  title, 
  description, 
  images, 
  icon: Icon,
  schedule,
  badge,
  tags = []
}: AmenityCardProps) {
  // Filtrar imagens vazias e validar array
  const validImages = Array.isArray(images) ? images.filter(img => img && img.trim() !== "") : [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (validImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
    }
  };

  const prevImage = () => {
    if (validImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    }
  };

  const currentImage = validImages.length > 0 ? validImages[currentImageIndex] : null;

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      {/* Galeria de Imagens */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={`${title} - Imagem ${currentImageIndex + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            {Icon && <Icon className="h-16 w-16 text-muted-foreground/50" />}
          </div>
        )}
        
        {/* Badge de Destaque */}
        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-primary text-primary-foreground shadow-lg">
              {badge}
            </Badge>
          </div>
        )}

        {/* Navegação de Imagens - Apenas se houver mais de uma */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Imagem anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Próxima imagem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>

            {/* Indicadores */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {validImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'bg-white w-6' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Conteúdo */}
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          {Icon && (
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
            {schedule && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {schedule}
              </p>
            )}
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

