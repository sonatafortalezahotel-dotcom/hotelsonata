"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { HorizontalScroll } from "@/components/HorizontalScroll";

interface Photo {
  id: number;
  title?: string;
  imageUrl: string;
  category?: string;
}

interface MasonryGalleryProps {
  photos?: Photo[];
  title?: string;
  subtitle?: string;
}

export default function MasonryGallery({
  photos = [],
  title,
  subtitle,
}: MasonryGalleryProps) {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "home");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const displayTitle = title || t?.gallery?.title || "Conheça Nossas Instalações";
  const displaySubtitle = subtitle || t?.gallery?.subtitle || "";

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  const goToPrevious = () => {
    setSelectedImage((prev) =>
      prev !== null && prev > 0 ? prev - 1 : validPhotos.length - 1
    );
  };

  const goToNext = () => {
    setSelectedImage((prev) =>
      prev !== null && prev < validPhotos.length - 1 ? prev + 1 : 0
    );
  };

  // Filtrar fotos com imageUrl válido
  const validPhotos = photos.filter(photo => photo.imageUrl && photo.imageUrl.trim() !== "");

  if (validPhotos.length === 0) {
    return null;
  }

  // Organizar fotos em 3 colunas com distribuição inteligente para efeito masonry
  // Algumas imagens terão alturas variadas para criar visual mais dinâmico
  const columns: Photo[][] = [[], [], []];
  validPhotos.forEach((photo, index) => {
    const columnIndex = index % 3;
    columns[columnIndex].push(photo);
  });

  // Determinar se uma imagem deve ter altura maior (efeito masonry)
  const getImageHeight = (index: number) => {
    // Padrão: a cada 4 imagens, uma terá altura maior
    const patterns = [1, 1, 1.3, 1, 1.2, 1, 1, 1.4, 1, 1, 1.3, 1];
    return patterns[index % patterns.length];
  };

  return (
    <>
      <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {displayTitle}
            </h2>
            {displaySubtitle && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {displaySubtitle}
              </p>
            )}
          </div>

          {/* Mobile: Carrossel Horizontal */}
          <div className="lg:hidden">
            <HorizontalScroll 
              itemWidth="85" 
              showArrows={false} 
              showDots={true}
              gap={4}
            >
              {validPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.title || `Foto ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="85vw"
                      loading="lazy"
                    />
                    {/* Overlay com efeito hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        {photo.title && (
                          <p className="text-white font-semibold text-base drop-shadow-lg mb-2">
                            {photo.title}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                          <ZoomIn className="h-4 w-4" />
                          <span>
                            {locale === "pt" 
                              ? "Clique para ampliar" 
                              : locale === "es" 
                              ? "Haz clic para ampliar" 
                              : "Click to enlarge"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </HorizontalScroll>
          </div>

          {/* Desktop: Masonry Grid - Layout moderno com colunas */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6 auto-rows-fr">
            {columns.map((columnPhotos, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-6">
                {columnPhotos.map((photo, photoIndex) => {
                  const globalIndex = columnIndex + photoIndex * 3;
                  const heightMultiplier = getImageHeight(globalIndex);
                  return (
                    <div
                      key={photo.id}
                      className="group relative overflow-hidden rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 masonry-image"
                      onClick={() => openLightbox(globalIndex)}
                      style={{
                        aspectRatio: `${1 / heightMultiplier}`,
                      }}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.title || `Foto ${globalIndex + 1}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="33vw"
                          loading="lazy"
                        />
                        {/* Overlay com efeito hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            {photo.title && (
                              <p className="text-white font-semibold text-lg drop-shadow-lg mb-2">
                                {photo.title}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-white/90 text-sm">
                              <ZoomIn className="h-4 w-4" />
                              <span>
                                {locale === "pt" 
                                  ? "Clique para ampliar" 
                                  : locale === "es" 
                                  ? "Haz clic para ampliar" 
                                  : "Click to enlarge"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Botão Fechar */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Botão Anterior */}
            {validPhotos.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Imagem */}
            {selectedImage !== null && validPhotos[selectedImage] && (
              <div className="relative w-full h-full p-12">
                <Image
                  src={validPhotos[selectedImage].imageUrl}
                  alt={validPhotos[selectedImage].title || `Foto ${selectedImage + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
                {/* Título e Contador */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  {validPhotos[selectedImage].title && (
                    <p className="text-white text-xl font-semibold mb-2 drop-shadow-lg">
                      {validPhotos[selectedImage].title}
                    </p>
                  )}
                  <p className="text-white/80 text-sm">
                    {selectedImage + 1} / {validPhotos.length}
                  </p>
                </div>
              </div>
            )}

            {/* Botão Próximo */}
            {validPhotos.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

