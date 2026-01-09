"use client";

import { useEffect, useState, useMemo } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import RoomsPageContent from "./RoomsPageContent";
import Image from "next/image";
import { HeroWithImage } from "@/components/HeroWithImage";
import { EditorialCarousel } from "@/components/HorizontalScroll";
import { Bed, Eye, Sparkles, Waves, Wind } from "lucide-react";
import { useGallery } from "@/lib/hooks/useGallery";
import { useRooms } from "@/lib/hooks/useRooms";
import { getGalleryImageTitle } from "@/lib/utils";

export default function RoomsPage() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "rooms");
  const { photos: galleryPhotos, loading: galleryLoading } = useGallery();
  const { rooms, loading: roomsLoading } = useRooms(true, locale);
  const loading = galleryLoading || roomsLoading;

  // Buscar todas as imagens usando useMemo para evitar múltiplas chamadas
  const quartosImages = useMemo(() => {
    if (!galleryPhotos || galleryPhotos.length === 0) {
      return {
        hero: null,
        gallery: [],
        photoStory: {
          beds: null,
          view: null,
          modern: null,
          shared: null,
        },
      };
    }

    const normalize = (value: any) =>
      (value || "").toString().toLowerCase().trim();

    // Imagens de experiências de quartos (sistema novo: page=home, section=experiencias-quartos)
    const quartosPhotos = galleryPhotos
      .filter((img: any) => {
        if (!img?.active) return false;
        if (!img.imageUrl || typeof img.imageUrl !== "string") return false;
        if (!img.imageUrl.trim()) return false;

        const page = normalize(img.page);
        const section = normalize(img.section);
        return page === "home" && section === "experiencias-quartos";
      })
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .slice(0, 8);

    // Imagens antigas por categoria "quarto" (sistema antigo)
    const quartoPhotos = galleryPhotos
      .filter((img: any) => {
        if (!img?.active) return false;
        if (!img.imageUrl || typeof img.imageUrl !== "string") return false;
        if (!img.imageUrl.trim()) return false;
        const category = normalize(img.category);
        return category === "quarto";
      })
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .slice(0, 3);

    return {
      hero: quartosPhotos[0]?.imageUrl || null,
      gallery: quartosPhotos.slice(1, 7), // Imagens 1-6 para a galeria
      photoStory: {
        beds: quartosPhotos[7]?.imageUrl || null, // Última imagem de experiencias-quartos
        view: quartoPhotos[0]?.imageUrl || null,
        modern: quartoPhotos[1]?.imageUrl || null,
        shared: quartoPhotos[2]?.imageUrl || null,
      },
    };
  }, [galleryPhotos]);

  // Buscar quarto com vista ao mar para o Hero
  const heroImage = useMemo(() => {
    // Priorizar quarto com vista ao mar
    const seaViewRoom = rooms.find(room => room.hasSeaView);
    if (seaViewRoom?.imageUrl) return seaViewRoom.imageUrl;
    
    // Se não houver, usar primeira imagem de gallery ou rooms
    if (rooms[0]?.imageUrl) return rooms[0].imageUrl;
    
    return quartosImages.hero || null;
  }, [rooms, quartosImages.hero]);

  return (
    <>
      {/* Hero Section - Compensar header fixo */}
      <HeroWithImage
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={heroImage}
        imageAlt="Quartos Vista ao Mar - Hotel Sonata de Iracema"
        icon={<Bed className="h-16 w-16" />}
        badge="Conforto & Aconchego"
        height="large"
        overlay="medium"
      />

      {/* Destaques dos Quartos */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.highlights.comfort.title}</h3>
              <p className="text-muted-foreground">{t.highlights.comfort.description}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.highlights.view.title}</h3>
              <p className="text-muted-foreground">{t.highlights.view.description}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Wind className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.highlights.ac.title}</h3>
              <p className="text-muted-foreground">{t.highlights.ac.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detalhes que Fazem Diferença - CARROSSEL FULLWIDTH */}
      <EditorialCarousel
        autoplay={true}
        autoplayInterval={6000}
        showNavigation={true}
        showProgress={true}
      >
        {[
          {
            image: quartosImages.photoStory.beds || rooms[0]?.imageUrl || null,
            title: t.photoStory.items.beds.title,
            description: t.photoStory.items.beds.description,
          },
          {
            image: quartosImages.photoStory.view || rooms[1]?.imageUrl || null,
            title: t.photoStory.items.view.title,
            description: t.photoStory.items.view.description,
          },
          {
            image: quartosImages.photoStory.modern || rooms[2]?.imageUrl || null,
            title: t.photoStory.items.modern.title,
            description: t.photoStory.items.modern.description,
          },
          {
            image: quartosImages.photoStory.shared || rooms[0]?.gallery?.[0] || null,
            title: t.photoStory.items.shared.title,
            description: t.photoStory.items.shared.description,
          },
        ]
          .filter((item): item is typeof item & { image: string } => !!item.image)
          .map((item, index) => (
            <div key={index} className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-8 md:bottom-16 left-8 md:left-16 right-8 md:right-16 text-white">
                <h3 className="text-2xl md:text-4xl font-bold mb-4 drop-shadow-2xl">
                  {item.title}
                </h3>
                <p className="text-lg md:text-xl drop-shadow-lg max-w-3xl">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
      </EditorialCarousel>

      {/* Rooms Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 lg:mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.section.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.section.subtitle}
            </p>
          </div>

          <RoomsPageContent />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#booking-bar" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              {t.cta.bookNow}
            </a>
            <a 
              href="/contato" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
            >
              {t.cta.contact}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}