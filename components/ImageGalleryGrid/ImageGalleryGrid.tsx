"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryGridProps {
  images: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  columns?: 2 | 3 | 4;
  aspectRatio?: "square" | "landscape" | "portrait";
}

export function ImageGalleryGrid({ 
  images, 
  columns = 3,
  aspectRatio = "landscape" 
}: ImageGalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  const goToPrevious = () => {
    setSelectedImage((prev) => (prev !== null && prev > 0 ? prev - 1 : validImages.length - 1));
  };

  const goToNext = () => {
    setSelectedImage((prev) => (prev !== null && prev < validImages.length - 1 ? prev + 1 : 0));
  };

  const aspectRatioClass = {
    square: "aspect-square",
    landscape: "aspect-[4/3]",
    portrait: "aspect-[3/4]"
  };

  const columnsClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  };

  // Filtrar imagens válidas
  const validImages = images.filter(img => img.src && img.src.trim() !== "");

  return (
    <>
      <div className={`grid ${columnsClass[columns]} gap-4`}>
        {validImages.map((image, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
            onClick={() => openLightbox(index)}
          >
            <div className={`relative ${aspectRatioClass[aspectRatio]} w-full`}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay com efeito hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  {image.title && (
                    <p className="text-white font-semibold text-sm lg:text-base drop-shadow-lg">
                      {image.title}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {/* Imagem */}
            {selectedImage !== null && validImages[selectedImage] && (
              <div className="relative w-full h-full p-12">
                <Image
                  src={validImages[selectedImage].src}
                  alt={validImages[selectedImage].alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
                {/* Título e Contador */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  {validImages[selectedImage].title && (
                    <p className="text-white text-xl font-semibold mb-2 drop-shadow-lg">
                      {validImages[selectedImage].title}
                    </p>
                  )}
                  <p className="text-white/80 text-sm">
                    {selectedImage + 1} / {validImages.length}
                  </p>
                </div>
              </div>
            )}

            {/* Botão Próximo */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


