"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVideoUrlType, extractYouTubeVideoId, extractVimeoVideoId } from "@/lib/utils";

interface Highlight {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string | null; // Opcional: pode ser null se houver videoUrl
  videoUrl?: string;
  link?: string;
  startDate: string;
  endDate: string;
}

interface VideoCarouselProps {
  highlights?: Highlight[];
  locale?: string;
}

export default function VideoCarousel({
  highlights = [],
  locale = "pt",
}: VideoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const items = highlights;

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, isPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 3000);
  };

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  // Detecta o tipo de vídeo e extrai IDs se necessário
  const videoInfo = useMemo(() => {
    if (!currentItem.videoUrl) return null;

    const videoType = getVideoUrlType(currentItem.videoUrl);
    if (!videoType) return null;

    if (videoType === 'youtube') {
      const videoId = extractYouTubeVideoId(currentItem.videoUrl);
      return { type: 'youtube', videoId };
    }

    if (videoType === 'vimeo') {
      const videoId = extractVimeoVideoId(currentItem.videoUrl);
      return { type: 'vimeo', videoId };
    }

    return { type: 'direct', url: currentItem.videoUrl };
  }, [currentItem.videoUrl]);

  // Gera a URL do embed baseado no tipo
  const embedUrl = useMemo(() => {
    if (!videoInfo) return null;

    if (videoInfo.type === 'youtube' && videoInfo.videoId) {
      return `https://www.youtube.com/embed/${videoInfo.videoId}?autoplay=1&mute=1&loop=1&playlist=${videoInfo.videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&quality=hd1080&vq=hd1080`;
    }

    if (videoInfo.type === 'vimeo' && videoInfo.videoId) {
      return `https://player.vimeo.com/video/${videoInfo.videoId}?autoplay=1&muted=1&loop=1&background=1`;
    }

    return null;
  }, [videoInfo]);

  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      {/* Video/Image Background */}
      <div className="absolute inset-0 w-full overflow-hidden">
        {currentItem.videoUrl && videoInfo ? (
          // YouTube ou Vimeo - usar iframe
          embedUrl ? (
            <iframe
              src={embedUrl}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: '100vw',
                height: '56.25vw', // Altura para manter proporção 16:9 (100vw * 9/16 = 56.25vw)
                minHeight: '100%', // Garante que preenche pelo menos a altura do container (80vh)
              }}
              allow="autoplay; encrypted-media; accelerometer; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Vídeo: ${currentItem.title || 'Destaque'}`}
              loading="lazy"
              aria-label={`Vídeo do destaque: ${currentItem.title || 'Destaque'}`}
            />
          ) : videoInfo.type === 'direct' ? (
            // Vídeo direto - usar tag video HTML5
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={videoInfo.url} type="video/mp4" />
              {currentItem.imageUrl && (
                <Image
                  src={currentItem.imageUrl}
                  alt={currentItem.title || `Imagem do destaque ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </video>
          ) : (
            // Fallback para imagem se não conseguir processar
            currentItem.imageUrl ? (
              <Image
                src={currentItem.imageUrl}
                alt={currentItem.title || `Imagem do destaque ${currentIndex + 1}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
            )
          )
        ) : (
          // Sem vídeo - mostrar imagem ou fallback
          currentItem.imageUrl ? (
            <Image
              src={currentItem.imageUrl}
              alt={currentItem.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
          )
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4 sm:px-6 lg:px-8">
        {currentItem.title && (
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 drop-shadow-lg">
            {currentItem.title}
          </h1>
        )}
        {currentItem.description && (
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mb-6 sm:mb-8 drop-shadow-md">
            {currentItem.description}
          </p>
        )}
        {currentItem.link && (
          <Button
            asChild
            size="lg"
            className="mt-4 sm:mt-6 shadow-lg"
          >
            <a href={currentItem.link}>
              Saiba Mais
            </a>
          </Button>
        )}
      </div>

      {/* Navigation Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75 w-3"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              goToSlide(currentIndex === 0 ? items.length - 1 : currentIndex - 1)
            }
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white border-0"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => goToSlide((currentIndex + 1) % items.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white border-0"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </section>
  );
}
