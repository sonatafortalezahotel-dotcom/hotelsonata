"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "@/lib/app-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Waves, Bike, Dumbbell, Trophy, MapPin, Heart, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContent, getPageContentIcon } from "@/lib/utils/pageContent";
import { getIcon } from "@/lib/icon-registry";
import { PageText, PageImage, EditableIcon } from "@/components/PageEditor";
import { ContentSection } from "@/components/ui/ContentSection";
import { AmenityCard } from "@/components/AmenityCard";
import { HeroWithImage } from "@/components/HeroWithImage";
import { EditorialCarousel, EditorialSlide, HorizontalScroll, GalleryOneLeftTwoRight, GALLERY_ONE_LEFT_TWO_RIGHT_GRID_HEIGHT } from "@/components/HorizontalScroll";
import { PhotoStory } from "@/components/PhotoStory";
import { useLeisure } from "@/lib/hooks/useLeisure";
import { useGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";

function LazerPageContent() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "leisure");
  const tServices = getPageTranslation(locale, "leisureServices");
  const editor = useEditor();
  const { leisure, loading: leisureLoading } = useLeisure(true, locale);
  const { photos: galleryPhotos, loading: galleryLoading } = useGallery();
  const loading = leisureLoading || galleryLoading;

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

  const overrides = editor?.overrides ?? {};
  const heroIconName = getPageContentIcon("hero", "icon", overrides, "Heart");
  const LazerHeroIconComponent = getIcon(heroIconName) ?? Heart;
  const heroIcon = editor?.editMode
    ? <EditableIcon page="lazer" section="hero" fieldKey="icon" locale={locale} defaultIconName="Heart" defaultIcon={Heart} iconClassName="h-16 w-16" />
    : <LazerHeroIconComponent className="h-16 w-16" />;

  return (
    <>
      <HeroWithImage
        title={editor?.editMode ? <PageText page="lazer" section="hero" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("lazer", "hero", "title", locale, overrides) || t.hero.title)}
        subtitle={editor?.editMode ? <PageText page="lazer" section="hero" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("lazer", "hero", "subtitle", locale, overrides) || t.hero.subtitle)}
        image={getGalleryImageByPath(galleryPhotos, "gallery:lazer:hero-lazer:0") || leisure.find(l => l.type === "piscina")?.imageUrl || lazerImagesWithDistributed.hero || null}
        imageNode={editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:lazer:hero-lazer:0") || leisure.find(l => l.type === "piscina")?.imageUrl || lazerImagesWithDistributed.hero || ""} alt="Hero" path="gallery:lazer:hero-lazer:0" className="absolute inset-0 w-full h-full" /> : undefined}
        imageAlt="Piscina Vista Mar - Hotel Sonata de Iracema"
        icon={heroIcon}
        badge={
          editor?.editMode ? (
            <PageText page="lazer" section="hero" fieldKey="badge" locale={locale} as="span" />
          ) : (
            getPageContent("lazer", "hero", "badge", locale, overrides) || "Lazer & Bem-Estar"
          )
        }
        height="medium"
        overlay="medium"
      />

      {/* 2. Galeria - Piscina Vista Mar - Full Width */}
      <ContentSection width="full" className="px-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 text-base px-4 py-2">
              <Waves className="h-4 w-4 mr-2 inline" />
              {editor?.editMode ? <PageText page="lazer" section="gallery" fieldKey="pool.badge" locale={locale} as="span" /> : (getPageContent("lazer", "gallery", "pool.badge", locale, editor?.overrides ?? {}) || t.gallery.pool.badge)}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="lazer" section="gallery" fieldKey="pool.title" locale={locale} as="span" /> : (getPageContent("lazer", "gallery", "pool.title", locale, editor?.overrides ?? {}) || t.gallery.pool.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? <PageText page="lazer" section="gallery" fieldKey="pool.subtitle" locale={locale} as="span" /> : (getPageContent("lazer", "gallery", "pool.subtitle", locale, editor?.overrides ?? {}) || t.gallery.pool.subtitle)}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {editor?.editMode ? (
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 lg:grid-rows-2 ${GALLERY_ONE_LEFT_TWO_RIGHT_GRID_HEIGHT}`}>
              {[0, 1, 2].map((i) => {
                const photo = lazerImagesWithDistributed.piscina.galeria[i];
                const path = `gallery:lazer:galeria-piscina:${i}`;
                const src = (getGalleryImageByPath(galleryPhotos, path) || photo?.imageUrl) ?? "";
                const isLeft = i === 0;
                return (
                  <div
                    key={i}
                    className={isLeft ? "relative rounded-lg overflow-hidden lg:row-span-2 min-h-[200px] lg:min-h-0" : "relative rounded-lg overflow-hidden"}
                  >
                    <PageImage src={src} path={path} aspectRatio="auto" className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          ) : (
            <GalleryOneLeftTwoRight
              images={lazerImagesWithDistributed.piscina.galeria
                .map((p) => p.imageUrl)
                .filter((url): url is string => !!url && typeof url === "string" && url.trim() !== "")}
              interval={5000}
            />
          )}
        </div>
      </ContentSection>

      {/* 3. PhotoStory - Atividades do Dia - 4/4 */}
      <PhotoStory
        title={editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="title" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "title", locale, editor?.overrides ?? {}) || t.photoStory.title)}
        subtitle={editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "subtitle", locale, editor?.overrides ?? {}) || t.photoStory.subtitle)}
        backgroundColor="white"
        items={[
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:lazer:photo-story-lazer:0") || leisure.find(l => l.type === "academia")?.imageUrl || lazerImagesWithDistributed.photoStory.academia || ""} path="gallery:lazer:photo-story-lazer:0" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:lazer:photo-story-lazer:0") || leisure.find(l => l.type === "academia")?.imageUrl || lazerImagesWithDistributed.photoStory.academia || null),
            title: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.gym.title" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.gym.title", locale, editor?.overrides ?? {}) || t.photoStory.items.gym.title),
            description: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.gym.description" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.gym.description", locale, editor?.overrides ?? {}) || t.photoStory.items.gym.description),
            time: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.gym.time" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.gym.time", locale, editor?.overrides ?? {}) || t.photoStory.items.gym.time),
          },
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:lazer:photo-story-lazer:1") || leisure.find(l => l.type === "beach-tennis")?.imageUrl || lazerImagesWithDistributed.photoStory.beachTennis || ""} path="gallery:lazer:photo-story-lazer:1" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:lazer:photo-story-lazer:1") || leisure.find(l => l.type === "beach-tennis")?.imageUrl || lazerImagesWithDistributed.photoStory.beachTennis || null),
            title: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.tennis.title" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.tennis.title", locale, editor?.overrides ?? {}) || t.photoStory.items.tennis.title),
            description: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.tennis.description" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.tennis.description", locale, editor?.overrides ?? {}) || t.photoStory.items.tennis.description),
            time: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.tennis.time" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.tennis.time", locale, editor?.overrides ?? {}) || t.photoStory.items.tennis.time),
          },
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:lazer:photo-story-lazer:2") || leisure.find(l => l.type === "bikes")?.imageUrl || lazerImagesWithDistributed.photoStory.bikes || ""} path="gallery:lazer:photo-story-lazer:2" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:lazer:photo-story-lazer:2") || leisure.find(l => l.type === "bikes")?.imageUrl || lazerImagesWithDistributed.photoStory.bikes || null),
            title: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.bike.title" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.bike.title", locale, editor?.overrides ?? {}) || t.photoStory.items.bike.title),
            description: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.bike.description" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.bike.description", locale, editor?.overrides ?? {}) || t.photoStory.items.bike.description),
            time: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.bike.time" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.bike.time", locale, editor?.overrides ?? {}) || t.photoStory.items.bike.time),
          },
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:lazer:photo-story-lazer:3") || leisure.find(l => l.type === "spa")?.imageUrl || lazerImagesWithDistributed.photoStory.spa || ""} path="gallery:lazer:photo-story-lazer:3" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:lazer:photo-story-lazer:3") || leisure.find(l => l.type === "spa")?.imageUrl || lazerImagesWithDistributed.photoStory.spa || null),
            title: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.spa.title" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.spa.title", locale, editor?.overrides ?? {}) || t.photoStory.items.spa.title),
            description: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.spa.description" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.spa.description", locale, editor?.overrides ?? {}) || t.photoStory.items.spa.description),
            time: editor?.editMode ? <PageText page="lazer" section="photoStory" fieldKey="items.spa.time" locale={locale} as="span" /> : (getPageContent("lazer", "photoStory", "items.spa.time", locale, editor?.overrides ?? {}) || t.photoStory.items.spa.time),
          },
        ]}
      />

      {/* 4. Galeria - Academia & Fitness - CARROSSEL FULLWIDTH - texto por slide (cada slide editável independente) */}
      <EditorialCarousel
        autoplay={!editor?.editMode}
        autoplayInterval={5000}
        pauseAutoplayOnHover={true}
        showNavigation={true}
        navigationAlwaysVisible={!!editor?.editMode}
        showProgress={true}
        showCounter={false}
      >
        {lazerImagesWithDistributed.academia.galeria.map((photo, index) => {
          const path = `gallery:lazer:galeria-academia:${index}`;
          const imageUrl = getGalleryImageByPath(galleryPhotos, path) || photo?.imageUrl || "";
          const titleKey = `carouselAcademia.${index}.title`;
          const badgeKey = `carouselAcademia.${index}.badge`;
          const subtitleKey = `carouselAcademia.${index}.subtitle`;
          const fallbackTitle = getPageContent("lazer", "gallery", titleKey, locale, editor?.overrides ?? {}) || t.gallery.fitness.title;
          const fallbackBadge = getPageContent("lazer", "gallery", badgeKey, locale, editor?.overrides ?? {}) || t.gallery.fitness.badge;
          const fallbackSubtitle = getPageContent("lazer", "gallery", subtitleKey, locale, editor?.overrides ?? {}) || t.gallery.fitness.subtitle;
          return (
            <EditorialSlide
              key={path}
              image={editor?.editMode ? <PageImage src={imageUrl} path={path} aspectRatio="auto" className="absolute inset-0" /> : imageUrl}
              title={editor?.editMode ? <PageText page="lazer" section="gallery" fieldKey={titleKey} locale={locale} as="span" /> : fallbackTitle}
              subtitle={editor?.editMode ? <PageText page="lazer" section="gallery" fieldKey={badgeKey} locale={locale} as="span" /> : fallbackBadge}
              description={editor?.editMode ? <PageText page="lazer" section="gallery" fieldKey={subtitleKey} locale={locale} as="span" /> : fallbackSubtitle}
              textPosition="bottom-left"
              overlay="dark"
            />
          );
        })}
      </EditorialCarousel>

      {/* 5. Galeria - Spa & Relaxamento - GRID 1x4 */}
      <section className="relative overflow-hidden">
        {editor?.editMode ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 container mx-auto px-4">
            {Array.from({ length: 4 }, (_, i) => lazerImagesWithDistributed.spa.galeria[i]).map((photo, index) => (
              <div key={index} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <PageImage src={(getGalleryImageByPath(galleryPhotos, `gallery:lazer:galeria-spa:${index}`) || photo?.imageUrl) ?? ""} path={`gallery:lazer:galeria-spa:${index}`} aspectRatio="auto" className="w-full h-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Mobile: Carrossel Horizontal */}
            <div className="lg:hidden">
              <HorizontalScroll 
                itemWidth="full" 
                showArrows={false} 
                showDots={true}
                gap={0}
              >
                {lazerImagesWithDistributed.spa.galeria
                  .slice(0, 4)
                  .map((photo, index) => (
                    <div key={index} className="group relative overflow-hidden">
                      <div className="relative w-full h-[400px]">
                        <Image
                          src={photo.imageUrl}
                          alt={t.gallery.spa.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      </div>
                    </div>
                  ))}
              </HorizontalScroll>
            </div>

            {/* Desktop: 4 colunas */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-0">
              {lazerImagesWithDistributed.spa.galeria
                .slice(0, 4)
                .map((photo, index) => (
                  <div key={index} className="group relative overflow-hidden">
                    <div className="relative w-full h-[500px]">
                      <Image
                        src={photo.imageUrl}
                        alt={t.gallery.spa.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </section>

      {/* 6. Atividades - Resumo com Cards - 15/15 (5 cards com carrosséis) */}
      <ContentSection>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="lazer" section="section" fieldKey="title" locale={locale} as="span" /> : (getPageContent("lazer", "section", "title", locale, editor?.overrides ?? {}) || t.section.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? <PageText page="lazer" section="section" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("lazer", "section", "subtitle", locale, editor?.overrides ?? {}) || t.section.subtitle)}
            </p>
          </div>

          {leisureActivities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(["pool", "fitness", "bikes", "beachTennis", "massage"] as const).map((key, index) => {
                const activity = leisureActivities[index];
                if (!activity) return null;
                const activityDefaultIconNames: Record<string, string> = { pool: "Waves", fitness: "Dumbbell", bikes: "Bike", beachTennis: "Trophy", massage: "Sparkles" };
                const iconName = getPageContentIcon("activities", `${key}.icon`, overrides, activityDefaultIconNames[key] ?? "Waves");
                const ResolvedActivityIcon = getIcon(iconName) ?? activity.icon;
                const activityIconProp = editor?.editMode
                  ? <EditableIcon page="lazer" section="activities" fieldKey={`${key}.icon`} locale={locale} defaultIconName={activityDefaultIconNames[key] ?? "Waves"} defaultIcon={activity.icon} iconClassName="h-6 w-6 text-primary" />
                  : ResolvedActivityIcon;
                // Em modo edição: imagens editáveis por path gallery:lazer:cards-atividades (0-2 piscina, 3-5 academia, 6-8 bikes, 9-11 beachTennis, 12-14 massage)
                const activityImageOffsets: Record<string, number> = { pool: 0, fitness: 3, bikes: 6, beachTennis: 9, massage: 12 };
                const offset = activityImageOffsets[key] ?? 0;
                const imageCount = Math.max(3, (activity.images || []).length);
                const imagesForCard = editor?.editMode
                  ? Array.from({ length: imageCount }, (_, i) => {
                      const path = `gallery:lazer:cards-atividades:${offset + i}`;
                      const src = getGalleryImageByPath(galleryPhotos, path) || (activity.images as string[])?.[i] || "";
                      return (
                        <PageImage
                          key={i}
                          src={src}
                          path={path}
                          aspectRatio="auto"
                          className="absolute inset-0 w-full h-full"
                        />
                      );
                    })
                  : (activity.images || []);
                return (
                  <AmenityCard
                    key={`${key}-${index}`}
                    title={editor?.editMode ? <PageText page="lazer" section="activities" fieldKey={`${key}.title`} locale={locale} as="span" /> : (getPageContent("lazer", "activities", `${key}.title`, locale, overrides) || activity.title)}
                    description={editor?.editMode ? <PageText page="lazer" section="activities" fieldKey={`${key}.description`} locale={locale} as="span" /> : (getPageContent("lazer", "activities", `${key}.description`, locale, overrides) || activity.description)}
                    images={imagesForCard}
                    icon={activityIconProp}
                    schedule={activity.schedule ? (editor?.editMode ? <PageText page="lazer" section="activities" fieldKey={`${key}.schedule`} locale={locale} as="span" /> : (getPageContent("lazer", "activities", `${key}.schedule`, locale, overrides) || activity.schedule)) : undefined}
                    badge={editor?.editMode ? <PageText page="lazer" section="activities" fieldKey={`${key}.badge`} locale={locale} as="span" /> : (getPageContent("lazer", "activities", `${key}.badge`, locale, overrides) || activity.badge)}
                    tags={activity.tags}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Carregando atividades...
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              {editor?.editMode ? <PageText page="lazer" section="contactReception" fieldKey="text" locale={locale} as="span" /> : (getPageContent("lazer", "contactReception", "text", locale, editor?.overrides ?? {}) || tServices.footer.text)}
            </p>
            <a
              href="https://api.whatsapp.com/send?phone=558540061616&text=Ol%c3%a1,%20vi%20o%20site%20de%20voc%c3%aas%20e%20gostaria%20de%20mais%20informa%c3%a7%c3%b5es%20por%20favor."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
            >
              {editor?.editMode ? <PageText page="lazer" section="contactReception" fieldKey="button" locale={locale} as="span" /> : (getPageContent("lazer", "contactReception", "button", locale, editor?.overrides ?? {}) || t.contactReception.button)}
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
                <span className="font-semibold text-primary">
                  {editor?.editMode ? <PageText page="lazer" section="location" fieldKey="badge" locale={locale} as="span" /> : (getPageContent("lazer", "location", "badge", locale, editor?.overrides ?? {}) || t.location.badge)}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {editor?.editMode ? <PageText page="lazer" section="location" fieldKey="title" locale={locale} as="span" /> : (getPageContent("lazer", "location", "title", locale, editor?.overrides ?? {}) || t.location.title)}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {editor?.editMode ? <PageText page="lazer" section="location" fieldKey="description" locale={locale} as="span" /> : (getPageContent("lazer", "location", "description", locale, editor?.overrides ?? {}) || t.location.description)}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{editor?.editMode ? <PageText page="lazer" section="locationPrivileged" fieldKey="near" locale={locale} as="span" /> : (getPageContent("lazer", "locationPrivileged", "near", locale, editor?.overrides ?? {}) || t.locationPrivileged.near)}</p>
                    <p className="text-sm text-muted-foreground">{editor?.editMode ? <PageText page="lazer" section="locationPrivileged" fieldKey="nearDescription" locale={locale} as="span" /> : (getPageContent("lazer", "locationPrivileged", "nearDescription", locale, editor?.overrides ?? {}) || t.locationPrivileged.nearDescription)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Waves className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{editor?.editMode ? <PageText page="lazer" section="locationPrivileged" fieldKey="seaFront" locale={locale} as="span" /> : (getPageContent("lazer", "locationPrivileged", "seaFront", locale, editor?.overrides ?? {}) || t.locationPrivileged.seaFront)}</p>
                    <p className="text-sm text-muted-foreground">{editor?.editMode ? <PageText page="lazer" section="locationPrivileged" fieldKey="seaFrontDescription" locale={locale} as="span" /> : (getPageContent("lazer", "locationPrivileged", "seaFrontDescription", locale, editor?.overrides ?? {}) || t.locationPrivileged.seaFrontDescription)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <AspectRatio ratio={4 / 5}>
                {editor?.editMode ? (
                  <div className="absolute inset-0 rounded-lg overflow-hidden [&>div]:absolute [&>div]:inset-0 [&_img]:object-cover [&_img]:w-full [&_img]:h-full">
                    <PageImage
                      src={getGalleryImageByPath(galleryPhotos, "gallery:lazer:localizacao-lazer:0") || lazerImagesWithDistributed.localizacao || ""}
                      path="gallery:lazer:localizacao-lazer:0"
                      aspectRatio="auto"
                      className="absolute inset-0 w-full h-full rounded-lg"
                    />
                  </div>
                ) : lazerImagesWithDistributed.localizacao && lazerImagesWithDistributed.localizacao.trim() !== "" ? (
                  <Image
                    src={lazerImagesWithDistributed.localizacao}
                    alt="Localização privilegiada"
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg" />
                )}
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {editor?.editMode ? <PageText page="lazer" section="cta" fieldKey="title" locale={locale} as="span" /> : (getPageContent("lazer", "cta", "title", locale, editor?.overrides ?? {}) || t.cta.title)}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
            {editor?.editMode ? <PageText page="lazer" section="cta" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("lazer", "cta", "subtitle", locale, editor?.overrides ?? {}) || t.cta.subtitle)}
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            {editor?.editMode ? <PageText page="lazer" section="cta" fieldKey="bookNow" locale={locale} as="span" /> : (getPageContent("lazer", "cta", "bookNow", locale, editor?.overrides ?? {}) || t.cta.bookNow)}
          </a>
        </div>
      </section>
    </>
  );
}

export default function LazerPage() {
  return <LazerPageContent />;
}