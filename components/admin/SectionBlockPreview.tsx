"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Video, Grid3x3, FileText } from "lucide-react";
import type { PageSection } from "@/lib/constants/page-sections";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: number;
  title?: string;
  imageUrl: string;
  page?: string;
  section?: string;
  description?: string;
  category?: string;
  active: boolean;
  order: number;
}

interface SectionBlockPreviewProps {
  section: PageSection;
  items: GalleryItem[];
  sectionType: "video" | "gallery" | "card" | "single";
}

export function SectionBlockPreview({
  section,
  items,
  sectionType,
}: SectionBlockPreviewProps) {
  const activeItems = items
    .filter(item => item.active && item.imageUrl)
    .sort((a, b) => a.order - b.order);

  if (activeItems.length === 0) {
    return (
      <div className="border-2 border-dashed rounded-lg p-12 text-center bg-muted/30">
        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Nenhuma imagem ativa para exibir
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Adicione imagens e marque como ativas para ver o preview
        </p>
      </div>
    );
  }

  // Preview baseado no tipo de seção
  if (sectionType === "video") {
    return (
      <div className="space-y-4">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border-2">
          {activeItems[0]?.imageUrl ? (
            <img
              src={activeItems[0].imageUrl}
              alt={activeItems[0].title || "Hero"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Video className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <div>
              <h3 className="text-white font-bold text-xl mb-2">
                {activeItems[0]?.title || "Título da Seção"}
              </h3>
              <p className="text-white/90 text-sm">
                {activeItems[0]?.description || "Descrição da seção"}
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Preview do Hero/Carrossel - Primeira imagem ativa
        </p>
      </div>
    );
  }

  if (sectionType === "gallery") {
    const displayItems = activeItems.slice(0, section.recommendedImages || 9);
    const gridCols = displayItems.length <= 4 ? 2 : displayItems.length <= 9 ? 3 : 4;

    return (
      <div className="space-y-4">
        <div className={cn(
          "grid gap-2",
          gridCols === 2 && "grid-cols-2",
          gridCols === 3 && "grid-cols-3",
          gridCols === 4 && "grid-cols-4"
        )}>
          {displayItems.map((item, index) => (
            <div
              key={item.id || `preview-${index}`}
              className="relative aspect-square rounded-lg overflow-hidden bg-muted border"
            >
              <img
                src={item.imageUrl}
                alt={item.title || `Imagem ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {item.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-2">
                  <p className="text-white text-xs truncate w-full">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Preview da Galeria - {displayItems.length} de {section.recommendedImages} imagens recomendadas
        </p>
      </div>
    );
  }

  if (sectionType === "card") {
    const displayItems = activeItems.slice(0, section.recommendedImages || 6);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayItems.map((item, index) => (
            <Card key={item.id || `card-${index}`} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.title || `Card ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-base">{item.title || "Título do Card"}</CardTitle>
                {item.description && (
                  <CardDescription className="text-sm">
                    {item.description}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Preview dos Cards - {displayItems.length} de {section.recommendedImages} imagens recomendadas
        </p>
      </div>
    );
  }

  // Tipo "single" - imagem única
  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border-2">
        {activeItems[0]?.imageUrl ? (
          <img
            src={activeItems[0].imageUrl}
            alt={activeItems[0].title || "Imagem"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      {activeItems[0]?.title && (
        <div className="text-center">
          <p className="font-medium">{activeItems[0].title}</p>
          {activeItems[0].description && (
            <p className="text-sm text-muted-foreground mt-1">
              {activeItems[0].description}
            </p>
          )}
        </div>
      )}
      <p className="text-xs text-muted-foreground text-center">
        Preview de Imagem Única
      </p>
    </div>
  );
}

