"use client";

import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Award, Coffee, UtensilsCrossed, ChefHat } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContent, getPageContentIcon, getPageContentTags } from "@/lib/utils/pageContent";
import { getIcon } from "@/lib/icon-registry";
import { PageText, PageImage, EditableIcon, EditableTagList } from "@/components/PageEditor";
import { AmenityCard } from "@/components/AmenityCard";
import { HeroWithImage } from "@/components/HeroWithImage";
import { GalleryOneLeftTwoRight, GALLERY_ONE_LEFT_TWO_RIGHT_GRID_HEIGHT } from "@/components/HorizontalScroll";
import { PhotoStory } from "@/components/PhotoStory";
import { useGastronomy } from "@/lib/hooks/useGastronomy";
import { useGallery } from "@/lib/hooks/useGallery";
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
            {(() => {
              const overrides = editor?.overrides ?? {};
              const breakfastIconName = getPageContentIcon("cards", "breakfast.icon", overrides, "Coffee");
              const restaurantIconName = getPageContentIcon("cards", "restaurant.icon", overrides, "UtensilsCrossed");
              const BreakfastIcon = getIcon(breakfastIconName) ?? Coffee;
              const RestaurantIcon = getIcon(restaurantIconName) ?? UtensilsCrossed;
              const cafe = gastronomy.find(g => g.type === "cafe" || g.type === "cafe-da-manha" || g.type === "cafe-manha");
              const restaurante = gastronomy.find(g => g.type === "restaurante");
              const cafeImages = (cafe?.gallery && Array.isArray(cafe.gallery))
                ? cafe.gallery.filter((url: any) => url && typeof url === "string" && url.trim() !== "")
                : gastronomiaImages.cardCafeManha.map((p) => p.imageUrl).filter((url: any) => url && typeof url === "string" && url.trim() !== "");
              const restauranteImages = (restaurante?.gallery && Array.isArray(restaurante.gallery))
                ? restaurante.gallery.filter((url: any) => url && typeof url === "string" && url.trim() !== "")
                : gastronomiaImages.cardRestaurante.map((p) => p.imageUrl).filter((url: any) => url && typeof url === "string" && url.trim() !== "");
              const defaultCafeSchedule = `${t.breakfast.scheduleWeekday} / ${t.breakfast.scheduleWeekend}`;
              const defaultRestauranteSchedule = `${t.restaurant.lunch} / ${t.restaurant.dinner}`;
              const cafeScheduleApi = cafe?.schedule != null && String(cafe.schedule).trim() !== "" ? String(cafe.schedule) : null;
              const restauranteScheduleApi = restaurante?.schedule != null && String(restaurante.schedule).trim() !== "" ? String(restaurante.schedule) : null;
              const cafeTagsFromEditor = getPageContentTags("gastronomia", "cards", "breakfast.tags", locale, overrides);
              const restauranteTagsFromEditor = getPageContentTags("gastronomia", "cards", "restaurant.tags", locale, overrides);
              const defaultCafeTags = [t.gallery.items.tapioca, t.gallery.items.fruits, t.gallery.items.breads, t.gallery.items.coffee, t.gallery.items.table];
              const defaultRestauranteTags = [t.gallery.items.flavor, t.gallery.items.ocean, "Internacional"];
              return (
                <>
                  {/* Café da Manhã */}
                  <AmenityCard
                    title={
                      editor?.editMode ? (
                        <PageText page="gastronomia" section="breakfast" fieldKey="title" locale={locale} as="span" placeholder={cafe?.title || t.breakfast.title} />
                      ) : (
                        getPageContent("gastronomia", "breakfast", "title", locale, overrides) || cafe?.title || t.breakfast.title
                      )
                    }
                    description={
                      editor?.editMode ? (
                        <PageText page="gastronomia" section="breakfast" fieldKey="description" locale={locale} as="span" placeholder={cafe?.description || t.breakfast.description} />
                      ) : (
                        getPageContent("gastronomia", "breakfast", "description", locale, overrides) || cafe?.description || t.breakfast.description
                      )
                    }
                    images={
                      editor?.editMode
                        ? Array.from({ length: 4 }, (_, i) => (
                            <PageImage
                              key={i}
                              src={getGalleryImageByPath(galleryPhotos, `gallery:gastronomia:card-cafe-manha:${i}`) || cafeImages[i] || ""}
                              path={`gallery:gastronomia:card-cafe-manha:${i}`}
                              aspectRatio="square"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ))
                        : cafeImages
                    }
                    icon={editor?.editMode ? <EditableIcon page="gastronomia" section="cards" fieldKey="breakfast.icon" locale={locale} defaultIconName="Coffee" defaultIcon={Coffee} iconClassName="h-6 w-6 text-primary" /> : BreakfastIcon}
                    schedule={
                      editor?.editMode ? (
                        <PageText page="gastronomia" section="breakfast" fieldKey="schedule" locale={locale} as="span" placeholder={cafeScheduleApi || defaultCafeSchedule} />
                      ) : (
                        getPageContent("gastronomia", "breakfast", "schedule", locale, overrides) || cafeScheduleApi || defaultCafeSchedule
                      )
                    }
                    badge={
                      editor?.editMode ? (
                        <PageText page="gastronomia" section="breakfast" fieldKey="badge" locale={locale} as="span" placeholder={t.breakfast.badge} />
                      ) : (
                        getPageContent("gastronomia", "breakfast", "badge", locale, overrides) || t.breakfast.badge
                      )
                    }
                    tagsSlot={editor?.editMode ? <EditableTagList page="gastronomia" section="cards" fieldKey="breakfast.tags" locale={locale} defaultTags={cafeTagsFromEditor.length > 0 ? cafeTagsFromEditor : Array.isArray(cafe?.tags) && cafe.tags.length > 0 ? cafe.tags : defaultCafeTags} /> : undefined}
                    tags={
                      editor?.editMode
                        ? []
                      : (cafeTagsFromEditor.length > 0 ? cafeTagsFromEditor : Array.isArray(cafe?.tags) && cafe.tags.length > 0 ? cafe.tags : defaultCafeTags)
                    }
                  />

                  {/* Restaurante */}
                  <AmenityCard
                    title={
                      editor?.editMode ? (
                        <PageText page="gastronomia" section="restaurant" fieldKey="title" locale={locale} as="span" placeholder={restaurante?.title || t.restaurant.title} />
                      ) : (
                        getPageContent("gastronomia", "restaurant", "title", locale, overrides) || restaurante?.title || t.restaurant.title
                      )
                    }
                    description={
                      editor?.editMode ? (
                        <PageText page="gastronomia" section="restaurant" fieldKey="description" locale={locale} as="span" placeholder={restaurante?.description || t.restaurant.description} />
                      ) : (
                        getPageContent("gastronomia", "restaurant", "description", locale, overrides) || restaurante?.description || t.restaurant.description
                      )
                    }
                    images={
                      editor?.editMode
                        ? Array.from({ length: 5 }, (_, i) => (
                            <PageImage
                              key={i}
                              src={getGalleryImageByPath(galleryPhotos, `gallery:gastronomia:card-restaurante:${i}`) || restauranteImages[i] || ""}
                              path={`gallery:gastronomia:card-restaurante:${i}`}
                              aspectRatio="square"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ))
                        : restauranteImages
                    }
                    icon={editor?.editMode ? <EditableIcon page="gastronomia" section="cards" fieldKey="restaurant.icon" locale={locale} defaultIconName="UtensilsCrossed" defaultIcon={UtensilsCrossed} iconClassName="h-6 w-6 text-primary" /> : RestaurantIcon}
                    schedule={
                      editor?.editMode ? (
                        <PageText page="gastronomia" section="restaurant" fieldKey="schedule" locale={locale} as="span" placeholder={restauranteScheduleApi || defaultRestauranteSchedule} />
                      ) : (
                        getPageContent("gastronomia", "restaurant", "schedule", locale, overrides) || restauranteScheduleApi || defaultRestauranteSchedule
                      )
                    }
                    badge={
                      editor?.editMode ? (
                        <PageText page="gastronomia" section="cards" fieldKey="restaurant.badge" locale={locale} as="span" placeholder={t.gallery.items.ocean} />
                      ) : (
                        getPageContent("gastronomia", "cards", "restaurant.badge", locale, overrides) || t.gallery.items.ocean
                      )
                    }
                    tagsSlot={editor?.editMode ? <EditableTagList page="gastronomia" section="cards" fieldKey="restaurant.tags" locale={locale} defaultTags={restauranteTagsFromEditor.length > 0 ? restauranteTagsFromEditor : Array.isArray(restaurante?.tags) && restaurante.tags.length > 0 ? restaurante.tags : defaultRestauranteTags} /> : undefined}
                    tags={
                      editor?.editMode
                        ? []
                      : (restauranteTagsFromEditor.length > 0 ? restauranteTagsFromEditor : Array.isArray(restaurante?.tags) && restaurante.tags.length > 0 ? restaurante.tags : defaultRestauranteTags)
                    }
                  />
                </>
              );
            })()}
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {editor?.editMode ? (
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 lg:grid-rows-2 ${GALLERY_ONE_LEFT_TWO_RIGHT_GRID_HEIGHT}`}>
              {[0, 1, 2].map((i) => {
                const photo = gastronomiaImages.galeriaCafe[i];
                const path = `gallery:gastronomia:galeria-cafe:${i}`;
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
              images={gastronomiaImages.galeriaCafe
                .map((p) => p.imageUrl)
                .filter((url): url is string => !!url && typeof url === "string" && url.trim() !== "")}
              interval={5000}
            />
          )}
        </div>
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
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:photo-story-gastronomia:3") || gastronomy.find(g => g.type === "cafe" || g.type === "cafe-manha" || g.type === "cafe-da-manha")?.imageUrl || gastronomiaImages.photoStory.cafe3 || ""} path="gallery:gastronomia:photo-story-gastronomia:3" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:gastronomia:photo-story-gastronomia:3") || gastronomy.find(g => g.type === "cafe" || g.type === "cafe-manha" || g.type === "cafe-da-manha")?.imageUrl || gastronomiaImages.photoStory.cafe3 || null),
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
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 lg:grid-rows-2 ${GALLERY_ONE_LEFT_TWO_RIGHT_GRID_HEIGHT}`}>
              {[0, 1, 2].map((i) => {
                const photo = gastronomiaImages.galeriaRestaurante[i];
                const path = `gallery:gastronomia:galeria-restaurante:${i}`;
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
              images={gastronomiaImages.galeriaRestaurante
                .map((p) => p.imageUrl)
                .filter((url): url is string => !!url && typeof url === "string" && url.trim() !== "")}
              interval={5000}
            />
          )}
        </div>
      </section>

      {/* Room Service */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            {editor?.editMode ? (
              <PageText page="gastronomia" section="roomService" fieldKey="title" locale={locale} as="span" placeholder={t.roomService.title} />
            ) : (
              getPageContent("gastronomia", "roomService", "title", locale, editor?.overrides ?? {}) || t.roomService.title
            )}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {editor?.editMode ? (
              <PageText page="gastronomia" section="roomService" fieldKey="description" locale={locale} as="span" placeholder={t.roomService.description} />
            ) : (
              getPageContent("gastronomia", "roomService", "description", locale, editor?.overrides ?? {}) || t.roomService.description
            )}
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">
              {editor?.editMode ? (
                <PageText page="gastronomia" section="roomService" fieldKey="available" locale={locale} as="span" placeholder={t.roomService.available} />
              ) : (
                getPageContent("gastronomia", "roomService", "available", locale, editor?.overrides ?? {}) || t.roomService.available
              )}
            </span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-amber-600/90 to-amber-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {editor?.editMode ? (
              <PageText page="gastronomia" section="cta" fieldKey="title" locale={locale} as="span" placeholder={t.cta.title} className="text-white" />
            ) : (
              getPageContent("gastronomia", "cta", "title", locale, editor?.overrides ?? {}) || t.cta.title
            )}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            {editor?.editMode ? (
              <PageText page="gastronomia" section="cta" fieldKey="subtitle" locale={locale} as="span" placeholder={t.cta.subtitle} className="text-white/90" />
            ) : (
              getPageContent("gastronomia", "cta", "subtitle", locale, editor?.overrides ?? {}) || t.cta.subtitle
            )}
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white text-amber-700 hover:bg-white/90 h-11 px-8"
          >
            {editor?.editMode ? (
              <PageText page="gastronomia" section="cta" fieldKey="bookNow" locale={locale} as="span" placeholder={t.cta.bookNow} />
            ) : (
              getPageContent("gastronomia", "cta", "bookNow", locale, editor?.overrides ?? {}) || t.cta.bookNow
            )}
          </a>
        </div>
      </section>
    </>
  );
}

export default function GastronomiaPage() {
  return <GastronomiaPageContent />;
}