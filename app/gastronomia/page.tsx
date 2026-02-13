"use client";

import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Award, Coffee, UtensilsCrossed, ChefHat } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContent, getPageContentIcon } from "@/lib/utils/pageContent";
import { getIcon } from "@/lib/icon-registry";
import { PageText, PageImage, EditableIcon } from "@/components/PageEditor";
import Image from "next/image";
import { AmenityCard } from "@/components/AmenityCard";
import { HeroWithImage } from "@/components/HeroWithImage";
import { MasonrySwap, HorizontalScroll } from "@/components/HorizontalScroll";
import { PhotoStory } from "@/components/PhotoStory";
import { useGastronomy } from "@/lib/hooks/useGastronomy";
import { useGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageTitle } from "@/lib/utils";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";

function GastronomiaPageContent() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "gastronomy");
  const editor = useEditor();
  const { gastronomy, loading: gastronomyLoading } = useGastronomy(true, locale);
  const { photos: galleryPhotos, loading: galleryLoading } = useGallery();
  const loading = gastronomyLoading || galleryLoading;

  // Buscar todas as imagens usando useMemo
  const gastronomiaImages = useMemo(() => {
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

          return page === "gastronomia" && sec === section.toLowerCase().trim();
        })
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      if (typeof limit === "number") {
        return filtered.slice(0, limit);
      }
      return filtered;
    };

    const heroPhoto = getPhotosBySection("hero-gastronomia", 1)[0] || null;
    const cardCafeManha = getPhotosBySection("card-cafe-manha", 4);
    const cardRestaurante = getPhotosBySection("card-restaurante", 5);
    const galeriaCafe = getPhotosBySection("galeria-cafe", 6);
    const galeriaRestaurante = getPhotosBySection("galeria-restaurante", 6);
    const photoStoryPhotos = getPhotosBySection("photo-story-gastronomia", 4);

    return {
      hero: heroPhoto?.imageUrl || null,
      cardCafeManha,
      cardRestaurante,
      galeriaCafe,
      galeriaRestaurante,
      photoStory: {
        restaurante: photoStoryPhotos[0]?.imageUrl || null,
        cafe1: photoStoryPhotos[1]?.imageUrl || null,
        cafe2: photoStoryPhotos[2]?.imageUrl || null,
        cafe3: photoStoryPhotos[3]?.imageUrl || null,
      },
    };
  }, [galleryPhotos]);

  return (
    <>
      {/* Hero Section com Imagem */}
      <HeroWithImage
        title={editor?.editMode ? <PageText page="gastronomia" section="hero" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("gastronomia", "hero", "title", locale, editor?.overrides ?? {}) || t.hero.title)}
        subtitle={editor?.editMode ? <PageText page="gastronomia" section="hero" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("gastronomia", "hero", "subtitle", locale, editor?.overrides ?? {}) || t.hero.subtitle)}
        image={getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:hero-gastronomia:0") || gastronomy.find(g => g.type === "restaurante")?.imageUrl || gastronomiaImages.hero || undefined}
        imageNode={editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:hero-gastronomia:0") || gastronomy.find(g => g.type === "restaurante")?.imageUrl || gastronomiaImages.hero || ""} alt="Hero" path="gallery:gastronomia:hero-gastronomia:0" className="absolute inset-0 w-full h-full" /> : undefined}
        imageAlt="Restaurante Hotel Sonata de Iracema"
        icon={(() => {
          const overrides = editor?.overrides ?? {};
          const heroIconName = getPageContentIcon("hero", "icon", overrides, "UtensilsCrossed");
          const HeroIconComponent = getIcon(heroIconName) ?? UtensilsCrossed;
          return editor?.editMode
            ? <EditableIcon page="gastronomia" section="hero" fieldKey="icon" locale={locale} defaultIconName="UtensilsCrossed" defaultIcon={UtensilsCrossed} iconClassName="h-16 w-16" />
            : <HeroIconComponent className="h-16 w-16" />;
        })()}
        badge={
          editor?.editMode ? (
            <PageText page="gastronomia" section="hero" fieldKey="badge" locale={locale} as="span" />
          ) : (
            getPageContent("gastronomia", "hero", "badge", locale, editor?.overrides ?? {}) || "Sabores Regionais"
          )
        }
        height="medium"
        overlay="medium"
      />

      {/* Gastronomia - Cards com Galerias */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {editor?.editMode ? (
              <>
                <div>
                  <h3 className="text-xl font-bold mb-4">{t.breakfast.title}</h3>
                  <div className="mb-4">
                    <EditableIcon page="gastronomia" section="cards" fieldKey="breakfast.icon" locale={locale} defaultIconName="Coffee" defaultIcon={Coffee} iconClassName="h-16 w-16" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 4 }, (_, i) => gastronomiaImages.cardCafeManha[i]).map((photo, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                        <PageImage src={(getGalleryImageByPath(galleryPhotos, `gallery:gastronomia:card-cafe-manha:${i}`) || photo?.imageUrl) ?? ""} path={`gallery:gastronomia:card-cafe-manha:${i}`} aspectRatio="square" className="w-full h-full" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">{t.restaurant.title}</h3>
                  <div className="mb-4">
                    <EditableIcon page="gastronomia" section="cards" fieldKey="restaurant.icon" locale={locale} defaultIconName="UtensilsCrossed" defaultIcon={UtensilsCrossed} iconClassName="h-16 w-16" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: 5 }, (_, i) => gastronomiaImages.cardRestaurante[i]).map((photo, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                        <PageImage src={(getGalleryImageByPath(galleryPhotos, `gallery:gastronomia:card-restaurante:${i}`) || photo?.imageUrl) ?? ""} path={`gallery:gastronomia:card-restaurante:${i}`} aspectRatio="square" className="w-full h-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              (() => {
                const overrides = editor?.overrides ?? {};
                const breakfastIconName = getPageContentIcon("cards", "breakfast.icon", overrides, "Coffee");
                const restaurantIconName = getPageContentIcon("cards", "restaurant.icon", overrides, "UtensilsCrossed");
                const BreakfastIcon = getIcon(breakfastIconName) ?? Coffee;
                const RestaurantIcon = getIcon(restaurantIconName) ?? UtensilsCrossed;
                return (
              <>
                {/* Café da Manhã */}
                <AmenityCard
                  title={t.breakfast.title}
                  description={t.breakfast.description}
                  images={(() => {
                    const cafe = gastronomy.find(g => g.type === "cafe" || g.type === "cafe-da-manha");
                    if (cafe?.gallery && Array.isArray(cafe.gallery)) {
                      return cafe.gallery.filter((url: any) => url && typeof url === "string" && url.trim() !== "");
                    }
                    return gastronomiaImages.cardCafeManha
                      .map((p) => p.imageUrl)
                      .filter((url: any) => url && typeof url === "string" && url.trim() !== "");
                  })()}
                  icon={BreakfastIcon}
                  schedule={gastronomy.find(g => g.type === "cafe")?.schedule || `${t.breakfast.scheduleWeekday} / ${t.breakfast.scheduleWeekend}`}
                  badge={t.breakfast.badge}
                  tags={[
                    t.gallery.items.tapioca,
                    t.gallery.items.fruits,
                    t.gallery.items.breads,
                    t.gallery.items.coffee,
                    t.gallery.items.table
                  ]}
                />

                {/* Restaurante */}
                <AmenityCard
                  title={t.restaurant.title}
                  description={t.restaurant.description}
                  images={(() => {
                    const restaurante = gastronomy.find(g => g.type === "restaurante");
                    if (restaurante?.gallery && Array.isArray(restaurante.gallery)) {
                      return restaurante.gallery.filter((url: any) => url && typeof url === "string" && url.trim() !== "");
                    }
                    return gastronomiaImages.cardRestaurante
                      .map((p) => p.imageUrl)
                      .filter((url: any) => url && typeof url === "string" && url.trim() !== "");
                  })()}
                  icon={RestaurantIcon}
                  schedule={gastronomy.find(g => g.type === "restaurante")?.schedule || `${t.restaurant.lunch} / ${t.restaurant.dinner}`}
                  badge={t.gallery.items.ocean}
                  tags={[
                    t.gallery.items.flavor,
                    t.gallery.items.ocean,
                    "Internacional"
                  ]}
                />
              </>
                );
              })()
            )}
          </div>

          {/* Destaques do Café da Manhã */}
          <div className="mt-16 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 rounded-2xl p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                {editor?.editMode ? (
                  <PageText page="gastronomia" section="breakfast" fieldKey="highlightsTitle" locale={locale} as="span" />
                ) : (
                  getPageContent("gastronomia", "breakfast", "highlightsTitle", locale, editor?.overrides ?? {}) || t.breakfast.highlightsTitle
                )}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">
                  {editor?.editMode ? <PageText page="gastronomia" section="highlightsList" fieldKey="tapioca" locale={locale} as="span" /> : (getPageContent("gastronomia", "highlightsList", "tapioca", locale, editor?.overrides ?? {}) || t.highlightsList.tapioca)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">
                  {editor?.editMode ? <PageText page="gastronomia" section="highlightsList" fieldKey="fruits" locale={locale} as="span" /> : (getPageContent("gastronomia", "highlightsList", "fruits", locale, editor?.overrides ?? {}) || t.highlightsList.fruits)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">
                  {editor?.editMode ? <PageText page="gastronomia" section="highlightsList" fieldKey="breads" locale={locale} as="span" /> : (getPageContent("gastronomia", "highlightsList", "breads", locale, editor?.overrides ?? {}) || t.highlightsList.breads)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">
                  {editor?.editMode ? <PageText page="gastronomia" section="highlightsList" fieldKey="coffee" locale={locale} as="span" /> : (getPageContent("gastronomia", "highlightsList", "coffee", locale, editor?.overrides ?? {}) || t.highlightsList.coffee)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">
                  {editor?.editMode ? <PageText page="gastronomia" section="highlightsList" fieldKey="vegan" locale={locale} as="span" /> : (getPageContent("gastronomia", "highlightsList", "vegan", locale, editor?.overrides ?? {}) || t.highlightsList.vegan)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">✓</span>
                <span className="text-muted-foreground">
                  {editor?.editMode ? <PageText page="gastronomia" section="highlightsList" fieldKey="view" locale={locale} as="span" /> : (getPageContent("gastronomia", "highlightsList", "view", locale, editor?.overrides ?? {}) || t.highlightsList.view)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Pratos - Café da Manhã - GRID 1x4 */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-amber-600 hover:bg-amber-700 text-base px-4 py-2">
              <Coffee className="h-4 w-4 mr-2 inline" />
              {editor?.editMode ? <PageText page="gastronomia" section="gallery" fieldKey="breakfast.badge" locale={locale} as="span" /> : (getPageContent("gastronomia", "gallery", "breakfast.badge", locale, editor?.overrides ?? {}) || t.gallery.breakfast.badge)}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="gastronomia" section="gallery" fieldKey="breakfast.title" locale={locale} as="span" /> : (getPageContent("gastronomia", "gallery", "breakfast.title", locale, editor?.overrides ?? {}) || t.gallery.breakfast.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? <PageText page="gastronomia" section="gallery" fieldKey="breakfast.subtitle" locale={locale} as="span" /> : (getPageContent("gastronomia", "gallery", "breakfast.subtitle", locale, editor?.overrides ?? {}) || t.gallery.breakfast.subtitle)}
            </p>
          </div>
        </div>

        {editor?.editMode ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 container mx-auto px-4 sm:px-6 lg:px-8">
            {Array.from({ length: 6 }, (_, i) => gastronomiaImages.galeriaCafe[i]).map((photo, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <PageImage src={(getGalleryImageByPath(galleryPhotos, `gallery:gastronomia:galeria-cafe:${i}`) || photo?.imageUrl) ?? ""} path={`gallery:gastronomia:galeria-cafe:${i}`} aspectRatio="auto" className="w-full h-full" />
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
                {gastronomiaImages.galeriaCafe
                  .slice(0, 4)
                  .map((photo, index) => (
                    <div key={index} className="group relative overflow-hidden">
                      <div className="relative w-full h-[400px]">
                        <Image
                          src={photo.imageUrl}
                          alt={`Café da manhã ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    </div>
                  ))}
              </HorizontalScroll>
            </div>

            {/* Desktop: 4 colunas */}
            <div className="hidden lg:grid lg:grid-cols-4 gap-0">
              {gastronomiaImages.galeriaCafe
                .slice(0, 4)
                .map((photo, index) => (
                  <div key={index} className="group relative overflow-hidden">
                    <div className="relative w-full h-[500px]">
                      <Image
                        src={photo.imageUrl}
                        alt={`Café da manhã ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </section>

      {/* PhotoStory - Experiência Gastronômica */}
      <PhotoStory
        title={editor?.editMode ? <PageText page="gastronomia" section="photoStory" fieldKey="title" locale={locale} as="span" /> : (getPageContent("gastronomia", "photoStory", "title", locale, editor?.overrides ?? {}) || t.photoStory.title)}
        subtitle={editor?.editMode ? <PageText page="gastronomia" section="photoStory" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("gastronomia", "photoStory", "subtitle", locale, editor?.overrides ?? {}) || t.photoStory.subtitle)}
        backgroundColor="white"
        items={[
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:photo-story-gastronomia:0") || gastronomy.find(g => g.type === "restaurante")?.imageUrl || gastronomiaImages.photoStory.restaurante || ""} path="gallery:gastronomia:photo-story-gastronomia:0" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:photo-story-gastronomia:0") || gastronomy.find(g => g.type === "restaurante")?.imageUrl || gastronomiaImages.photoStory.restaurante || null),
            title: editor?.editMode ? <PageText page="gastronomia" section="photoStory" fieldKey="items.restaurant.title" locale={locale} as="span" /> : (getPageContent("gastronomia", "photoStory", "items.restaurant.title", locale, editor?.overrides ?? {}) || t.photoStory.items.restaurant.title),
            description: editor?.editMode ? <PageText page="gastronomia" section="photoStory" fieldKey="items.restaurant.description" locale={locale} as="span" /> : (getPageContent("gastronomia", "photoStory", "items.restaurant.description", locale, editor?.overrides ?? {}) || t.photoStory.items.restaurant.description),
          },
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:photo-story-gastronomia:1") || gastronomiaImages.photoStory.cafe1 || ""} path="gallery:gastronomia:photo-story-gastronomia:1" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:photo-story-gastronomia:1") || gastronomiaImages.photoStory.cafe1 || null),
            title: editor?.editMode ? <PageText page="gastronomia" section="photoStory" fieldKey="items.seafood.title" locale={locale} as="span" /> : (getPageContent("gastronomia", "photoStory", "items.seafood.title", locale, editor?.overrides ?? {}) || t.photoStory.items.seafood.title),
            description: editor?.editMode ? <PageText page="gastronomia" section="photoStory" fieldKey="items.seafood.description" locale={locale} as="span" /> : (getPageContent("gastronomia", "photoStory", "items.seafood.description", locale, editor?.overrides ?? {}) || t.photoStory.items.seafood.description),
          },
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:photo-story-gastronomia:2") || gastronomiaImages.photoStory.cafe2 || ""} path="gallery:gastronomia:photo-story-gastronomia:2" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:photo-story-gastronomia:2") || gastronomiaImages.photoStory.cafe2 || null),
            title: editor?.editMode ? <PageText page="gastronomia" section="photoStory" fieldKey="items.chef.title" locale={locale} as="span" /> : (getPageContent("gastronomia", "photoStory", "items.chef.title", locale, editor?.overrides ?? {}) || t.photoStory.items.chef.title),
            description: editor?.editMode ? <PageText page="gastronomia" section="photoStory" fieldKey="items.chef.description" locale={locale} as="span" /> : (getPageContent("gastronomia", "photoStory", "items.chef.description", locale, editor?.overrides ?? {}) || t.photoStory.items.chef.description),
          },
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:photo-story-gastronomia:3") || gastronomy.find(g => g.type === "cafe")?.imageUrl || gastronomiaImages.photoStory.cafe3 || ""} path="gallery:gastronomia:photo-story-gastronomia:3" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:photo-story-gastronomia:3") || gastronomy.find(g => g.type === "cafe")?.imageUrl || gastronomiaImages.photoStory.cafe3 || null),
            title: editor?.editMode ? <PageText page="gastronomia" section="photoStory" fieldKey="items.breakfast.title" locale={locale} as="span" /> : (getPageContent("gastronomia", "photoStory", "items.breakfast.title", locale, editor?.overrides ?? {}) || t.photoStory.items.breakfast.title),
            description: editor?.editMode ? <PageText page="gastronomia" section="photoStory" fieldKey="items.breakfast.description" locale={locale} as="span" /> : (getPageContent("gastronomia", "photoStory", "items.breakfast.description", locale, editor?.overrides ?? {}) || t.photoStory.items.breakfast.description),
          },
        ]}
      />

      {/* Galeria do Restaurante e Pratos - MASONRY ANIMADO */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-orange-600 hover:bg-orange-700 text-base px-4 py-2">
              <ChefHat className="h-4 w-4 mr-2 inline" />
              {editor?.editMode ? <PageText page="gastronomia" section="gallery" fieldKey="restaurant.badge" locale={locale} as="span" /> : (getPageContent("gastronomia", "gallery", "restaurant.badge", locale, editor?.overrides ?? {}) || t.gallery.restaurant.badge)}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="gastronomia" section="gallery" fieldKey="restaurant.title" locale={locale} as="span" /> : (getPageContent("gastronomia", "gallery", "restaurant.title", locale, editor?.overrides ?? {}) || t.gallery.restaurant.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? <PageText page="gastronomia" section="gallery" fieldKey="restaurant.subtitle" locale={locale} as="span" /> : (getPageContent("gastronomia", "gallery", "restaurant.subtitle", locale, editor?.overrides ?? {}) || t.gallery.restaurant.subtitle)}
            </p>
          </div>
          
          {editor?.editMode ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => gastronomiaImages.galeriaRestaurante[i]).map((photo, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <PageImage src={(getGalleryImageByPath(galleryPhotos, `gallery:gastronomia:galeria-restaurante:${i}`) || photo?.imageUrl) ?? ""} path={`gallery:gastronomia:galeria-restaurante:${i}`} aspectRatio="auto" className="w-full h-full" />
                </div>
              ))}
            </div>
          ) : (
            <MasonrySwap
              images={gastronomiaImages.galeriaRestaurante
                .map(photo => photo.imageUrl)
                .filter(img => img && typeof img === "string" && img.trim() !== "")}
              interval={4500}
            />
          )}
        </div>
      </section>

      {/* Room Service */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {t.roomService.title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.roomService.description}
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">{t.roomService.available}</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-600/90 to-amber-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            {t.cta.subtitle}
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white text-amber-700 hover:bg-white/90 h-11 px-8"
          >
            {t.cta.bookNow}
          </a>
        </div>
      </section>
    </>
  );
}

export default function GastronomiaPage() {
  return <GastronomiaPageContent />;
}