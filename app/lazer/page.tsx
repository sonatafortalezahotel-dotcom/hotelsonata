"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Waves, Bike, Dumbbell, Trophy, MapPin, Heart, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { ContentSection } from "@/components/ui/ContentSection";
import { FullWidthGallery } from "@/components/ui/FullWidthGallery";
import { AmenityCard } from "@/components/AmenityCard";
import { HeroWithImage } from "@/components/HeroWithImage";
import { ImageGalleryGrid } from "@/components/ImageGalleryGrid";
import { PhotoStory } from "@/components/PhotoStory";
import { getLeisure } from "@/lib/hooks/useLeisure";
import { getGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageTitle } from "@/lib/utils";

export default function LazerPage() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "leisure");
  const tServices = getPageTranslation(locale, "leisureServices");
  const [leisure, setLeisure] = useState<any[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar todas as imagens usando useMemo
  const lazerImages = useMemo(() => {
    if (!galleryPhotos || galleryPhotos.length === 0) {
      return {
        hero: null,
        piscina: { cards: [], galeria: [] },
        academia: { cards: [], galeria: [] },
        atividadesCards: [],
        spa: { cards: [], galeria: [] },
        photoStory: { academia: null, beachTennis: null, bikes: null, spa: null },
        localizacao: null,
      };
    }

    const normalize = (value: any) =>
      (value || "").toString().toLowerCase().trim();

    const getPhotosBySection = (section: string, limit?: number) => {
      const filtered = galleryPhotos
        .filter((img: any) => {
          if (!img?.active) return false;
          if (!img.imageUrl || typeof img.imageUrl !== "string") return false;
          if (!img.imageUrl.trim()) return false;

          const page = normalize(img.page);
          const sec = normalize(img.section);

          return page === "lazer" && sec === section.toLowerCase().trim();
        })
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      if (typeof limit === "number") {
        return filtered.slice(0, limit);
      }
      return filtered;
    };

    const heroPhoto = getPhotosBySection("hero-lazer", 1)[0] || null;
    const piscinaGaleria = getPhotosBySection("galeria-piscina", 6);
    const academiaGaleria = getPhotosBySection("galeria-academia", 4);
    const spaGaleria = getPhotosBySection("galeria-spa", 4);
    const photoStoryPhotos = getPhotosBySection("photo-story-lazer", 4);
    const atividadesCards = getPhotosBySection("cards-atividades");
    const localizacaoPhoto = getPhotosBySection("localizacao-lazer", 1)[0] || null;

    return {
      hero: heroPhoto?.imageUrl || null,
      piscina: {
        cards: [], // preenchido na distribuição
        galeria: piscinaGaleria,
      },
      academia: {
        cards: [],
        galeria: academiaGaleria,
      },
      atividadesCards,
      spa: {
        cards: [],
        galeria: spaGaleria,
      },
      photoStory: {
        academia: photoStoryPhotos[0]?.imageUrl || null,
        beachTennis: photoStoryPhotos[1]?.imageUrl || null,
        bikes: photoStoryPhotos[2]?.imageUrl || null,
        spa: photoStoryPhotos[3]?.imageUrl || null,
      },
      localizacao: localizacaoPhoto?.imageUrl || null,
    };
  }, [galleryPhotos]);

  // Distribuir imagens de cards-atividades entre todos os cards (5 cards, ~3 imagens cada)
  const lazerImagesWithDistributed = useMemo(() => {
    const atividadesCards = lazerImages.atividadesCards || [];

    // 15 imagens recomendadas: 3 por card (piscina, academia, bikes, beach tennis, spa)
    const piscinaCards = atividadesCards.slice(0, 3);
    const academiaCards = atividadesCards.slice(3, 6);
    const bikesCards = atividadesCards.slice(6, 9);
    const beachTennisCards = atividadesCards.slice(9, 12);
    const spaCards = atividadesCards.slice(12, 15);

    return {
      ...lazerImages,
      piscina: {
        ...lazerImages.piscina,
        cards: piscinaCards,
      },
      academia: {
        ...lazerImages.academia,
        cards: academiaCards,
      },
      bikes: {
        cards: bikesCards,
      },
      beachTennis: {
        cards: beachTennisCards,
      },
      spa: {
        ...lazerImages.spa,
        cards: spaCards,
      },
    };
  }, [lazerImages]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [leisureData, galleryData] = await Promise.all([
        getLeisure(true, locale),
        getGallery()
      ]);
      setLeisure(leisureData);
      setGalleryPhotos(galleryData);
      setLoading(false);
    }
    fetchData();
  }, [locale]);

  // Mapear dados do banco para o formato esperado
  const leisureActivities = useMemo(() => {
    const activities = [
    {
      icon: Waves,
      title: tServices.pool.title,
      description: tServices.pool.description,
      images: (() => {
        const pool = leisure.find(l => l.type === "piscina");
        if (pool?.gallery && Array.isArray(pool.gallery)) {
          // Se gallery é array de objetos, extrair imageUrl; se é array de strings, usar diretamente
          const galleryImages = pool.gallery.map((item: any) => 
            typeof item === 'string' ? item : (item?.imageUrl || item?.url || item)
          ).filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
          return galleryImages;
        }
        const cards = lazerImagesWithDistributed.piscina.cards || [];
        return cards
          .map((p: any) => p?.imageUrl)
          .filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
      })(),
      schedule: leisure.find(l => l.type === "piscina")?.schedule || tServices.pool.schedule,
      badge: tServices.pool.badge,
      tags: tServices.pool.tags
    },
    {
      icon: Dumbbell,
      title: tServices.fitness.title,
      description: tServices.fitness.description,
      images: (() => {
        const fitness = leisure.find(l => l.type === "academia" || l.type === "fitness");
        if (fitness?.gallery && Array.isArray(fitness.gallery)) {
          const galleryImages = fitness.gallery.map((item: any) => 
            typeof item === 'string' ? item : (item?.imageUrl || item?.url || item)
          ).filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
          return galleryImages;
        }
        const cards = lazerImagesWithDistributed.academia.cards || [];
        return cards
          .map((p: any) => p?.imageUrl)
          .filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
      })(),
      schedule: leisure.find(l => l.type === "academia")?.schedule || tServices.fitness.schedule,
      badge: tServices.fitness.badge,
      tags: tServices.fitness.tags
    },
    {
      icon: Bike,
      title: tServices.bikes.title,
      description: tServices.bikes.description,
      images: (() => {
        const bikes = leisure.find(l => l.type === "bikes" || l.type === "bicicleta");
        if (bikes?.gallery && Array.isArray(bikes.gallery)) {
          const galleryImages = bikes.gallery.map((item: any) => 
            typeof item === 'string' ? item : (item?.imageUrl || item?.url || item)
          ).filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
          return galleryImages;
        }
        const cards = lazerImagesWithDistributed.bikes.cards || [];
        return cards
          .map((p: any) => p?.imageUrl)
          .filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
      })(),
      badge: tServices.bikes.badge,
      tags: tServices.bikes.tags
    },
    {
      icon: Trophy,
      title: tServices.beachTennis.title,
      description: tServices.beachTennis.description,
      images: (() => {
        const beachTennis = leisure.find(l => l.type === "beach-tennis" || l.type === "esporte");
        if (beachTennis?.gallery && Array.isArray(beachTennis.gallery)) {
          const galleryImages = beachTennis.gallery.map((item: any) => 
            typeof item === 'string' ? item : (item?.imageUrl || item?.url || item)
          ).filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
          return galleryImages;
        }
        const cards = lazerImagesWithDistributed.beachTennis.cards || [];
        return cards
          .map((p: any) => p?.imageUrl)
          .filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
      })(),
      badge: tServices.beachTennis.badge,
      tags: tServices.beachTennis.tags
    },
    {
      icon: Sparkles,
      title: tServices.massage.title,
      description: tServices.massage.description,
      images: (() => {
        const spa = leisure.find(l => l.type === "spa" || l.type === "massagem");
        if (spa?.gallery && Array.isArray(spa.gallery)) {
          const galleryImages = spa.gallery.map((item: any) => 
            typeof item === 'string' ? item : (item?.imageUrl || item?.url || item)
          ).filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
          return galleryImages;
        }
        const cards = lazerImagesWithDistributed.spa.cards || [];
        return cards
          .map((p: any) => p?.imageUrl)
          .filter((url: any) => url && typeof url === 'string' && url.trim() !== '');
      })(),
      badge: tServices.massage.badge,
      tags: tServices.massage.tags
    },
    ];
    
    return activities;
  }, [leisure, lazerImagesWithDistributed, tServices]);

  return (
    <>
      {/* 1. Hero Section com Imagem - 1/1 */}
      <HeroWithImage
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={leisure.find(l => l.type === "piscina")?.imageUrl || lazerImagesWithDistributed.hero || null}
        imageAlt="Piscina Vista Mar - Hotel Sonata de Iracema"
        icon={<Heart className="h-16 w-16" />}
        badge="Lazer & Bem-Estar"
        height="large"
        overlay="medium"
      />

      {/* 2. Galeria - Piscina Vista Mar - Full Width */}
      <ContentSection variant="nordeste" width="full" className="px-0 py-0 pb-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none text-base px-4 py-2">
              <Waves className="h-4 w-4 mr-2 inline" />
              {t.gallery.pool.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t.gallery.pool.title}
            </h2>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              {t.gallery.pool.subtitle}
            </p>
          </div>
        </div>
        
        <FullWidthGallery
          images={lazerImagesWithDistributed.piscina.galeria
            .map((photo, index) => {
              const title = getGalleryImageTitle(photo, index + 1);
              return {
                src: photo.imageUrl,
                alt: title,
                title: title
              };
            })
            .filter(img => img.src)}
          height="h-[400px] md:h-[600px]"
        />
      </ContentSection>

      {/* 3. PhotoStory - Atividades do Dia - 4/4 */}
      <PhotoStory
        title={t.photoStory.title}
        subtitle={t.photoStory.subtitle}
        backgroundColor="white"
        items={[
          {
            image: leisure.find(l => l.type === "academia")?.imageUrl || lazerImagesWithDistributed.photoStory.academia || null,
            title: t.photoStory.items.gym.title,
            description: t.photoStory.items.gym.description,
            time: t.photoStory.items.gym.time
          },
          {
            image: leisure.find(l => l.type === "beach-tennis")?.imageUrl || lazerImagesWithDistributed.photoStory.beachTennis || null,
            title: t.photoStory.items.tennis.title,
            description: t.photoStory.items.tennis.description,
            time: t.photoStory.items.tennis.time
          },
          {
            image: leisure.find(l => l.type === "bikes")?.imageUrl || lazerImagesWithDistributed.photoStory.bikes || null,
            title: t.photoStory.items.bike.title,
            description: t.photoStory.items.bike.description,
            time: t.photoStory.items.bike.time
          },
          {
            image: leisure.find(l => l.type === "spa")?.imageUrl || lazerImagesWithDistributed.photoStory.spa || null,
            title: t.photoStory.items.spa.title,
            description: t.photoStory.items.spa.description,
            time: t.photoStory.items.spa.time
          },
        ]}
      />

      {/* 4. Galeria - Academia & Fitness - 4/4 */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-orange-600 hover:bg-orange-700 text-base px-4 py-2">
              <Dumbbell className="h-4 w-4 mr-2 inline" />
              {t.gallery.fitness.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.gallery.fitness.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.gallery.fitness.subtitle}
            </p>
          </div>
          
          <ImageGalleryGrid
            images={lazerImagesWithDistributed.academia.galeria
              .map((photo, index) => {
                const title = getGalleryImageTitle(photo, index + 1);
                return {
                  src: photo.imageUrl,
                  alt: title,
                  title: title
                };
              })
              .filter(img => img.src)}
            columns={2}
            aspectRatio="landscape"
          />
        </div>
      </section>

      {/* 5. Galeria - Spa & Relaxamento - 4/4 */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-purple-600 hover:bg-purple-700 text-base px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2 inline" />
              {t.gallery.spa.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.gallery.spa.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.gallery.spa.subtitle}
            </p>
          </div>
          
          <ImageGalleryGrid
            images={lazerImagesWithDistributed.spa.galeria
              .map((photo, index) => {
                const title = getGalleryImageTitle(photo, index + 1);
                return {
                  src: photo.imageUrl,
                  alt: title,
                  title: title
                };
              })
              .filter(img => img.src)}
            columns={2}
            aspectRatio="landscape"
          />
        </div>
      </section>

      {/* 6. Atividades - Resumo com Cards - 15/15 (5 cards com carrosséis) */}
      <ContentSection variant="dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t.section.title}
            </h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              {t.section.subtitle}
            </p>
          </div>

          {leisureActivities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leisureActivities.map((activity, index) => {
                return (
                  <AmenityCard
                    key={`${activity.title}-${index}`}
                    title={activity.title}
                    description={activity.description}
                    images={activity.images || []}
                    icon={activity.icon}
                    schedule={activity.schedule}
                    badge={activity.badge}
                    tags={activity.tags}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">
                Carregando atividades...
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-slate-300 mb-4">
              {tServices.footer.text}
            </p>
            <a 
              href="/contato"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-slate-700 bg-transparent text-white hover:bg-white hover:text-slate-900 h-11 px-8"
            >
              {tServices.footer.contactButton}
            </a>
          </div>
        </div>
      </ContentSection>

      {/* 7. Localização Privilegiada - 1/1 */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">{t.location.badge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t.location.title}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {t.location.description}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.locationPrivileged.near}</p>
                    <p className="text-sm text-muted-foreground">{t.locationPrivileged.nearDescription}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Waves className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.locationPrivileged.seaFront}</p>
                    <p className="text-sm text-muted-foreground">{t.locationPrivileged.seaFrontDescription}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <AspectRatio ratio={4 / 5}>
                {(() => {
                  const imageUrl = lazerImagesWithDistributed.localizacao;
                  return imageUrl && imageUrl.trim() !== "" ? (
                    <Image
                      src={imageUrl}
                      alt="Localização privilegiada"
                      fill
                      className="object-cover rounded-lg shadow-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg" />
                  );
                })()}
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-600/90 to-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            {t.cta.subtitle}
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white text-blue-700 hover:bg-white/90 h-11 px-8"
          >
            {t.cta.bookNow}
          </a>
        </div>
      </section>
    </>
  );
}