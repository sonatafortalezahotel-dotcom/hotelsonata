"use client";

import { useEffect, useState, useMemo } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContent, getPageContentIcon } from "@/lib/utils/pageContent";
import { getIcon } from "@/lib/icon-registry";
import { PageText, PageImage, EditableIcon } from "@/components/PageEditor";
import RoomsPageContent from "./RoomsPageContent";
import Image from "next/image";
import { HeroWithImage } from "@/components/HeroWithImage";
import { EditorialCarousel } from "@/components/HorizontalScroll";
import { Bed, Eye, Sparkles, Waves, Wind } from "lucide-react";
import { useGallery } from "@/lib/hooks/useGallery";
import { useRooms } from "@/lib/hooks/useRooms";
import { getGalleryImageTitle } from "@/lib/utils";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";

function RoomsPageContentWrapper() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "rooms");
  const editor = useEditor();
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
    // A primeira imagem desta seção é usada no Hero (mesma da home)
    const quartosPhotos = galleryPhotos
      .filter((img: any) => {
        if (!img?.active) return false;
        if (!img.imageUrl || typeof img.imageUrl !== "string") return false;
        if (!img.imageUrl.trim()) return false;

        const page = normalize(img.page);
        const section = normalize(img.section);
        return page === "home" && section === "experiencias-quartos";
      })
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

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
      hero: quartosPhotos[0]?.imageUrl || null, // Mesma imagem do banner da home
      gallery: quartosPhotos.slice(1, 7), // Imagens 1-6 para a galeria
      photoStory: {
        beds: quartosPhotos[7]?.imageUrl || null,
        view: quartoPhotos[0]?.imageUrl || null,
        modern: quartoPhotos[1]?.imageUrl || null,
        shared: quartoPhotos[2]?.imageUrl || null,
      },
    };
  }, [galleryPhotos]);

  // Usar a mesma foto do banner de quartos da home (priorizar path do editor para persistir após edição)
  const heroImage = useMemo(() => {
    const byPath = galleryPhotos?.length ? getGalleryImageByPath(galleryPhotos, "gallery:home:experiencias-quartos:0") : null;
    if (byPath) return byPath;
    if (quartosImages.hero) return quartosImages.hero;
    const seaViewRoom = rooms.find(room => room.hasSeaView);
    if (seaViewRoom?.imageUrl) return seaViewRoom.imageUrl;
    return rooms[0]?.imageUrl || null;
  }, [galleryPhotos, quartosImages.hero, rooms]);

  const overrides = editor?.overrides ?? {};
  const heroTitle = editor?.editMode ? <PageText page="quartos" section="hero" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("quartos", "hero", "title", locale, overrides) || t.hero.title);
  const heroSubtitle = editor?.editMode ? <PageText page="quartos" section="hero" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("quartos", "hero", "subtitle", locale, overrides) || t.hero.subtitle);
  const heroIconName = getPageContentIcon("hero", "icon", overrides, "Bed");
  const QuartosHeroIconComponent = getIcon(heroIconName) ?? Bed;
  const heroIcon = editor?.editMode
    ? <EditableIcon page="quartos" section="hero" fieldKey="icon" locale={locale} defaultIconName="Bed" defaultIcon={Bed} iconClassName="h-16 w-16" />
    : <QuartosHeroIconComponent className="h-16 w-16" />;

  return (
    <>
      {/* Hero Section - Compensar header fixo */}
      <HeroWithImage
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImage}
        imageNode={editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:home:experiencias-quartos:0") || heroImage || ""} alt="Hero" path="gallery:home:experiencias-quartos:0" className="absolute inset-0 w-full h-full" /> : undefined}
        imageAlt="Quartos Vista ao Mar - Hotel Sonata de Iracema"
        icon={heroIcon}
        badge={
          editor?.editMode ? (
            <PageText page="quartos" section="hero" fieldKey="badge" locale={locale} as="span" />
          ) : (
            getPageContent("quartos", "hero", "badge", locale, overrides) || "Conforto & Aconchego"
          )
        }
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
    </>
  );
}

export default function RoomsPage() {
  return <RoomsPageContentWrapper />;
}