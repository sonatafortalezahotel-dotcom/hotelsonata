"use client";

import Image from "next/image";
import { HorizontalScroll } from "@/components/HorizontalScroll";

interface GalleryImage {
  id: number;
  imageUrl: string;
  title?: string;
  description?: string;
}

interface GallerySectionProps {
  images: GalleryImage[];
  title: string;
  altPrefix: string;
  columns?: 2 | 3 | 4;
}

export function GallerySection({
  images,
  title,
  altPrefix,
  columns = 4,
}: GallerySectionProps) {
  if (images.length === 0) {
    return null;
  }

  const columnsClass = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };

  return (
    <section className="mt-12 mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      {/* Mobile: Carrossel Horizontal */}
      <div className="lg:hidden">
        <HorizontalScroll 
          itemWidth="85" 
          showArrows={false} 
          showDots={true}
          gap={4}
        >
          {images.map((img, index) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src={img.imageUrl}
                alt={img.title || img.description || `${altPrefix} ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="85vw"
              />
            </div>
          ))}
        </HorizontalScroll>
      </div>

      {/* Desktop: Grid */}
      <div className={`hidden lg:grid ${columnsClass[columns]} gap-4`}>
        {images.map((img, index) => (
          <div
            key={img.id}
            className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
          >
            <Image
              src={img.imageUrl}
              alt={img.title || img.description || `${altPrefix} ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes={columns === 4 ? "25vw" : columns === 3 ? "33vw" : "50vw"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
