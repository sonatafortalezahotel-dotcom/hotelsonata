"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Heart, Eye, MapPin, Users, Clock, Bike, Leaf } from "lucide-react";
import { AccommodationsSection } from "@/components/AccommodationsSection";
import { LeisureServicesSection } from "@/components/LeisureServicesSection";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { HeroWithImage } from "@/components/HeroWithImage";
import { FeatureImageSection } from "@/components/FeatureImageSection";
import { AsymmetricGallery } from "@/components/HorizontalScroll";
import { ImageGalleryGrid } from "@/components/ImageGalleryGrid";
import { useGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageTitle } from "@/lib/utils";
import { usePhotoTracker } from "@/lib/hooks/usePhotoTracker";

export default function HotelPage() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "hotel");
  const photoTracker = usePhotoTracker();
  const { photos: galleryPhotos, loading } = useGallery();
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);

  // Buscar todas as imagens usando useMemo
  const hotelImages = useMemo(() => {
    photoTracker.reset();
    
    return {
      hero: photoTracker.getUnusedPhoto(galleryPhotos, "recepcao")?.imageUrl || null,
      historia: photoTracker.getUnusedPhoto(galleryPhotos, "piscina", {
        allowRelatedCategories: true,
        relatedCategories: ["geral"]
      })?.imageUrl || null,
      familia: photoTracker.getUnusedPhoto(galleryPhotos, "piscina")?.imageUrl || null,
      galeria: photoTracker.getUnusedPhotos(galleryPhotos, [
        "piscina", "gastronomia", "restaurante", "quarto", "recepcao",
        "spa", "academia", "lazer", "esporte", "sustentabilidade", "geral"
      ], 9),
      localizacao: (() => {
        // Buscar 3 imagens de localização de uma vez (para os 3 cards)
        const locationPhotos = photoTracker.getUnusedPhotos(galleryPhotos, "localizacao", 3, {
          allowRelatedCategories: true,
          relatedCategories: ["geral"]
        });
        return locationPhotos.map(p => p.imageUrl).filter(Boolean);
      })(),
    };
  }, [galleryPhotos, photoTracker]);

  const diferenciais = [
    {
      icon: Eye,
      title: t.differentials.seaView.title,
      description: t.differentials.seaView.description
    },
    {
      icon: MapPin,
      title: t.differentials.location.title,
      description: t.differentials.location.description
    },
    {
      icon: Users,
      title: t.differentials.family.title,
      description: t.differentials.family.description
    },
    {
      icon: Award,
      title: t.differentials.breakfast.title,
      description: t.differentials.breakfast.description
    },
    {
      icon: Leaf,
      title: t.differentials.sustainability.title,
      description: t.differentials.sustainability.description
    }
  ];

  const timeline = [
    { year: "2005", title: t.timeline.start.title, description: t.timeline.start.description },
    { year: "2010", title: t.timeline.expansion.title, description: t.timeline.expansion.description },
    { year: "2015", title: t.timeline.renovation.title, description: t.timeline.renovation.description },
    { year: "2020", title: t.timeline.sustainability.title, description: t.timeline.sustainability.description },
    { year: "2025", title: t.timeline.anniversary.title, description: t.timeline.anniversary.description }
  ];

  // Função para scroll suave para um item específico da timeline
  const scrollToTimelineItem = (index: number) => {
    const container = timelineScrollRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const itemWidth = containerWidth * 0.8; // 80vw por item
    const scrollPosition = (itemWidth * index) - (containerWidth * 0.1); // Centralizar

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    setCurrentTimelineIndex(index);
  };

  // Mouse drag para scroll horizontal
  useEffect(() => {
    // Aguardar o componente estar totalmente montado
    const timer = setTimeout(() => {
      const container = timelineScrollRef.current;
      if (!container) return;

      let isDown = false;
      let startX: number;
      let scrollLeft: number;

      const handleMouseDown = (e: MouseEvent) => {
        isDown = true;
        container.classList.add('cursor-grabbing');
        container.classList.remove('cursor-grab');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      };

      const handleMouseLeave = () => {
        isDown = false;
        container.classList.remove('cursor-grabbing');
        container.classList.add('cursor-grab');
      };

      const handleMouseUp = () => {
        isDown = false;
        container.classList.remove('cursor-grabbing');
        container.classList.add('cursor-grab');
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2.5;
        container.scrollLeft = scrollLeft - walk;
      };

      container.classList.add('cursor-grab');
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('mousemove', handleMouseMove);

      return () => {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mousemove', handleMouseMove);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [loading]);

  const hotelGalleryImages = useMemo(() => {
    return hotelImages.galeria
      .map((photo, index) => {
        const title = getGalleryImageTitle(photo, index + 1);
        return {
          src: photo.imageUrl,
          alt: title,
          title: title
        };
      })
      .filter(img => img.src);
  }, [hotelImages.galeria]);

  return (
    <>
      {/* Hero Section com Imagem de Fundo */}
      <HeroWithImage
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={hotelImages.hero || galleryPhotos[0]?.imageUrl || null}
        imageAlt="Hotel Sonata de Iracema - Vista da Piscina"
        icon={<Heart className="h-16 w-16" />}
        badge={t.hero.badge}
        height="large"
        overlay="medium"
      />

      {/* Nossa História */}
      <FeatureImageSection
        title={t.history.title}
        description={
          <div className="space-y-4">
            <p>{t.history.paragraph1}</p>
            <p>{t.history.paragraph2}</p>
            <p>{t.history.paragraph3}</p>
            <p>{t.history.paragraph4}</p>
          </div>
        }
        image={hotelImages.historia || galleryPhotos[1]?.imageUrl || null}
        imageAlt="História do Hotel Sonata"
        badge="Desde 2005"
        imagePosition="right"
        backgroundColor="white"
      />

      {/* Galeria de Fotos do Hotel - LAYOUT ASSIMÉTRICO FULLWIDTH */}
      <AsymmetricGallery
        images={hotelGalleryImages.map(img => img.src).filter(src => src && src.trim() !== '')}
        interval={4000}
      />

      {/* Timeline - Nossa Jornada */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.journey.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.journey.subtitle}
            </p>
          </div>

          {/* Timeline Horizontal Elegante */}
          <div className="relative py-8 -mx-4 sm:-mx-6 lg:-mx-8">
            {/* Linha horizontal contínua de fundo */}
            <div className="absolute top-[200px] left-0 right-0 h-0.5 bg-primary/20 pointer-events-none" />
            
            <div 
              ref={timelineScrollRef}
              className="flex overflow-x-auto scroll-smooth gap-0 px-4 sm:px-6 lg:px-8 pb-4 select-none cursor-grab active:cursor-grabbing"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {/* Espaço inicial */}
              <div className="flex-shrink-0 w-[5vw]" />
              
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-[45vw] lg:w-[350px] relative"
                >
                  {/* Card Flutuante */}
                  <div className="relative mb-16 px-4">
                    <Card className="bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-primary/10 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <p className="text-5xl font-bold text-primary mb-2">{item.year}</p>
                          <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                    
                    {/* Conector Vertical */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 w-0.5 h-16 bg-gradient-to-b from-primary to-primary/30" />
                  </div>
                  
                  {/* Círculo na Linha */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-[200px] -translate-y-1/2 z-10">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-xl border-4 border-background hover:scale-110 transition-transform">
                      {item.year.slice(-2)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Espaço final para scroll completo */}
              <div className="flex-shrink-0 w-[5vw]" />
            </div>
            
            {/* Indicadores de Progresso - CLICÁVEIS */}
            <div className="flex justify-center gap-3 mt-12">
              {timeline.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToTimelineItem(index)}
                  className="group flex flex-col items-center gap-1 cursor-pointer"
                  aria-label={`Ir para ${item.year}`}
                >
                  <div className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    currentTimelineIndex === index 
                      ? 'bg-primary w-8' 
                      : 'bg-primary/40 group-hover:bg-primary group-hover:scale-150'
                  }`} />
                  <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.year}
                  </span>
                </button>
              ))}
            </div>
            
            {/* CSS customizado */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
              .cursor-grab {
                cursor: grab !important;
              }
              .cursor-grabbing {
                cursor: grabbing !important;
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* Nossos Diferenciais */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.differentialsSection.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.differentialsSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {diferenciais.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Acomodações */}
      <AccommodationsSection />

      {/* Serviços de Lazer e Bem-Estar */}
      <LeisureServicesSection />

      {/* Família Bezerra */}
      <FeatureImageSection
        title={t.family.title}
        description={
          <div className="space-y-4">
            <p>{t.family.paragraph1}</p>
            <p>{t.family.paragraph2}</p>
          </div>
        }
        image={hotelImages.familia || galleryPhotos[2]?.imageUrl || null}
        imageAlt={t.family.imageAlt}
        badge="Acolhimento Nordestino"
        imagePosition="left"
        backgroundColor="primary"
      />

      {/* Explore Fortaleza */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.explore.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.explore.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Praia de Iracema */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-video">
                {(() => {
                  const base =
                    (Array.isArray(hotelImages.localizacao)
                      ? hotelImages.localizacao[0]
                      : hotelImages.localizacao) || galleryPhotos[3]?.imageUrl;
                  const valid =
                    typeof base === "string" && base.trim() !== "";
                  return valid ? (
                    <img
                      src={base}
                      alt={t.explore.spots.beach.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
                  );
                })()}
              </div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">{t.explore.spots.beach.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {t.explore.spots.beach.description}
                </p>
                <Badge>{t.explore.spots.beach.badge}</Badge>
              </CardContent>
            </Card>

            {/* Centro Dragão do Mar */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-video">
                {(() => {
                  const base =
                    (Array.isArray(hotelImages.localizacao)
                      ? hotelImages.localizacao[1]
                      : undefined) || galleryPhotos[4]?.imageUrl;
                  const valid =
                    typeof base === "string" && base.trim() !== "";
                  return valid ? (
                    <img
                      src={base}
                      alt={t.explore.spots.culture.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
                  );
                })()}
              </div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">{t.explore.spots.culture.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {t.explore.spots.culture.description}
                </p>
                <Badge>{t.explore.spots.culture.badge}</Badge>
              </CardContent>
            </Card>

            {/* Mercado dos Pinhões */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-video">
                {(() => {
                  const base =
                    (Array.isArray(hotelImages.localizacao)
                      ? hotelImages.localizacao[2]
                      : undefined) || galleryPhotos[5]?.imageUrl;
                  const valid =
                    typeof base === "string" && base.trim() !== "";
                  return valid ? (
                    <img
                      src={base}
                      alt={t.explore.spots.market.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
                  );
                })()}
              </div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">{t.explore.spots.market.title}</h3>
                <p className="text-muted-foreground mb-4">
                  {t.explore.spots.market.description}
                </p>
                <Badge>{t.explore.spots.market.badge}</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-3 text-muted-foreground mb-6">
              <Bike className="h-5 w-5 text-primary" />
              <p>
                {t.bikes.message}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            {t.cta.subtitle}
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white text-primary hover:bg-white/90 h-11 px-8"
          >
            {t.cta.button}
          </a>
        </div>
      </section>
    </>
  );
}