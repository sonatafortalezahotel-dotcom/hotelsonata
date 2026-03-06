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
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContent, getPageContentIcon } from "@/lib/utils/pageContent";
import { getIcon } from "@/lib/icon-registry";
import { PageText, PageImage, EditableIcon } from "@/components/PageEditor";
import { HeroWithImage } from "@/components/HeroWithImage";
import { FeatureImageSection } from "@/components/FeatureImageSection";
import { AsymmetricGallery } from "@/components/HorizontalScroll";
import { ImageGalleryGrid } from "@/components/ImageGalleryGrid";
import { useGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageTitle } from "@/lib/utils";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";
import { usePhotoTracker } from "@/lib/hooks/usePhotoTracker";

function getNested(obj: Record<string, unknown>, path: string): string {
  const value = path.split(".").reduce((o: unknown, k) => (o as Record<string, unknown>)?.[k], obj);
  return typeof value === "string" ? value : "";
}

function HotelPageContent() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "hotel");
  const editor = useEditor();
  const overrides = editor?.overrides ?? {};
  const photoTracker = usePhotoTracker();
  const { photos: galleryPhotos, loading } = useGallery();
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);

  // Buscar todas as imagens usando useMemo
  // Galeria do hotel: priorizar fotos com page=hotel e section=galeria (editáveis no modo edição)
  const hotelImages = useMemo(() => {
    photoTracker.reset();

    const hero = photoTracker.getUnusedPhoto(galleryPhotos, "recepcao")?.imageUrl || null;
    const historia = photoTracker.getUnusedPhoto(galleryPhotos, "piscina", {
      allowRelatedCategories: true,
      relatedCategories: ["geral"]
    })?.imageUrl || null;
    const familia = photoTracker.getUnusedPhoto(galleryPhotos, "piscina")?.imageUrl || null;
    const localizacaoPhotos = photoTracker.getUnusedPhotos(galleryPhotos, "localizacao", 3, {
      allowRelatedCategories: true,
      relatedCategories: ["geral"]
    });
    const localizacao = localizacaoPhotos.map(p => p.imageUrl).filter(Boolean);

    const galeriaBySection = photoTracker.getUnusedPhotosByPageSection(galleryPhotos, "hotel", "galeria", 9);
    const galeriaFallback = photoTracker.getUnusedPhotos(galleryPhotos, [
      "piscina", "gastronomia", "restaurante", "quarto", "recepcao",
      "spa", "academia", "lazer", "esporte", "sustentabilidade", "geral"
    ], 9);
    const galeria = galeriaBySection.length >= 4 ? galeriaBySection : galeriaFallback;

    return {
      hero,
      historia,
      familia,
      galeria,
      localizacao,
    };
  }, [galleryPhotos, photoTracker]);

  const diferenciaisKeys = [
    { icon: Eye, key: "seaView", defaultIconName: "Eye" },
    { icon: MapPin, key: "location", defaultIconName: "MapPin" },
    { icon: Users, key: "family", defaultIconName: "Users" },
    { icon: Award, key: "breakfast", defaultIconName: "Award" },
    { icon: Leaf, key: "sustainability", defaultIconName: "Leaf" }
  ] as const;

  const timelineKeys = [
    { year: "2005", titleKey: "start.title", descKey: "start.description" },
    { year: "2010", titleKey: "expansion.title", descKey: "expansion.description" },
    { year: "2015", titleKey: "renovation.title", descKey: "renovation.description" },
    { year: "2020", titleKey: "sustainability.title", descKey: "sustainability.description" },
    { year: "2025", titleKey: "anniversary.title", descKey: "anniversary.description" }
  ];
  const timeline = timelineKeys.map(({ year, titleKey, descKey }) => ({
    year,
    title: getPageContent("hotel", "timeline", titleKey, locale, overrides) || getNested(t as Record<string, unknown>, "timeline." + titleKey),
    description: getPageContent("hotel", "timeline", descKey, locale, overrides) || getNested(t as Record<string, unknown>, "timeline." + descKey)
  }));

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

  const heroTitle = editor?.editMode
    ? <PageText page="hotel" section="hero" fieldKey="title" locale={locale} as="span" className="block" />
    : getPageContent("hotel", "hero", "title", locale, overrides) || t.hero.title;
  const heroSubtitle = editor?.editMode
    ? <PageText page="hotel" section="hero" fieldKey="subtitle" locale={locale} as="span" className="block" />
    : getPageContent("hotel", "hero", "subtitle", locale, overrides) || t.hero.subtitle;
  const heroBadge = editor?.editMode
    ? <PageText page="hotel" section="hero" fieldKey="badge" locale={locale} as="span" className="inline-block" />
    : getPageContent("hotel", "hero", "badge", locale, overrides) || t.hero.badge;
  const heroImageUrl =
    getGalleryImageByPath(galleryPhotos, "gallery:hotel:hero:0") ||
    hotelImages.hero ||
    galleryPhotos[0]?.imageUrl ||
    null;
  const heroImageNode = editor?.editMode
    ? <PageImage src={heroImageUrl || ""} alt="Hero" path="gallery:hotel:hero:0" className="absolute inset-0 w-full h-full" />
    : null;

  const heroIconName = getPageContentIcon("hero", "icon", overrides, "Heart");
  const HeroIconComponent = getIcon(heroIconName) ?? Heart;
  const heroIcon = editor?.editMode
    ? <EditableIcon page="hotel" section="hero" fieldKey="icon" locale={locale} defaultIconName="Heart" defaultIcon={Heart} iconClassName="h-16 w-16" />
    : <HeroIconComponent className="h-16 w-16" />;

  return (
    <>
      {/* Hero Section com Imagem de Fundo */}
      <HeroWithImage
        title={heroTitle}
        subtitle={heroSubtitle}
        image={heroImageUrl}
        imageNode={heroImageNode ?? undefined}
        imageAlt="Hotel Sonata de Iracema - Vista da Piscina"
        icon={heroIcon}
        badge={heroBadge}
        height="medium"
        overlay="medium"
        imageQuality={100}
      />

      {/* Nossa História */}
      <FeatureImageSection
        title={editor?.editMode ? <PageText page="hotel" section="history" fieldKey="title" locale={locale} as="span" /> : (getPageContent("hotel", "history", "title", locale, overrides) || t.history.title)}
        description={
          <div className="space-y-4">
            {editor?.editMode ? (
              <>
                <p><PageText page="hotel" section="history" fieldKey="paragraph1" locale={locale} as="span" /></p>
                <p><PageText page="hotel" section="history" fieldKey="paragraph2" locale={locale} as="span" /></p>
                <p><PageText page="hotel" section="history" fieldKey="paragraph3" locale={locale} as="span" /></p>
                <p><PageText page="hotel" section="history" fieldKey="paragraph4" locale={locale} as="span" /></p>
              </>
            ) : (
              <>
                <p>{getPageContent("hotel", "history", "paragraph1", locale, overrides) || t.history.paragraph1}</p>
                <p>{getPageContent("hotel", "history", "paragraph2", locale, overrides) || t.history.paragraph2}</p>
                <p>{getPageContent("hotel", "history", "paragraph3", locale, overrides) || t.history.paragraph3}</p>
                <p>{getPageContent("hotel", "history", "paragraph4", locale, overrides) || t.history.paragraph4}</p>
              </>
            )}
          </div>
        }
        image={getGalleryImageByPath(galleryPhotos, "gallery:hotel:historia:0") || hotelImages.historia || galleryPhotos[1]?.imageUrl || null}
        imageNode={editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:hotel:historia:0") || hotelImages.historia || galleryPhotos[1]?.imageUrl || ""} alt="História" path="gallery:hotel:historia:0" className="w-full h-full object-cover" /> : undefined}
        imageAlt="História do Hotel Sonata"
        badge="Desde 2005"
        imagePosition="right"
        backgroundColor="white"
      />

      {/* Galeria de Fotos do Hotel - LAYOUT ASSIMÉTRICO FULLWIDTH */}
      {editor?.editMode ? (
        <section className="relative w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 container mx-auto">
            {Array.from({ length: 9 }, (_, i) => hotelImages.galeria[i]).map((photo, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <PageImage
                  src={photo?.imageUrl ?? ""}
                  path={`gallery:hotel:galeria:${i}`}
                  aspectRatio="auto"
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <AsymmetricGallery
          images={hotelGalleryImages.map(img => img.src).filter(src => src && src.trim() !== '')}
          interval={4000}
          imageQuality={100}
        />
      )}

      {/* Timeline - Nossa Jornada */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="hotel" section="journey" fieldKey="title" locale={locale} as="span" /> : (getPageContent("hotel", "journey", "title", locale, overrides) || t.journey.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {editor?.editMode ? <PageText page="hotel" section="journey" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("hotel", "journey", "subtitle", locale, overrides) || t.journey.subtitle)}
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
              
              {timelineKeys.map((item, index) => (
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
                          <h3 className="text-xl font-bold text-foreground">
                            {editor?.editMode ? <PageText page="hotel" section="timeline" fieldKey={item.titleKey} locale={locale} as="span" /> : timeline[index].title}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {editor?.editMode ? <PageText page="hotel" section="timeline" fieldKey={item.descKey} locale={locale} as="span" /> : timeline[index].description}
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
              {editor?.editMode ? <PageText page="hotel" section="differentialsSection" fieldKey="title" locale={locale} as="span" /> : (getPageContent("hotel", "differentialsSection", "title", locale, overrides) || t.differentialsSection.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {editor?.editMode ? <PageText page="hotel" section="differentialsSection" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("hotel", "differentialsSection", "subtitle", locale, overrides) || t.differentialsSection.subtitle)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {diferenciaisKeys.map((item, index) => {
              const iconName = getPageContentIcon("differentials", `${item.key}.icon`, overrides, item.defaultIconName);
              const ResolvedIcon = getIcon(iconName) ?? item.icon;
              const differentialIcon = editor?.editMode
                ? <EditableIcon page="hotel" section="differentials" fieldKey={`${item.key}.icon`} locale={locale} defaultIconName={item.defaultIconName} defaultIcon={item.icon} iconClassName="h-8 w-8 text-primary" />
                : <ResolvedIcon className="h-8 w-8 text-primary" />;
              const title = getPageContent("hotel", "differentials", item.key + ".title", locale, overrides) || ((t.differentials as Record<string, { title: string; description: string }>)[item.key]?.title ?? "");
              const description = getPageContent("hotel", "differentials", item.key + ".description", locale, overrides) || ((t.differentials as Record<string, { title: string; description: string }>)[item.key]?.description ?? "");
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      {differentialIcon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {editor?.editMode ? <PageText page="hotel" section="differentials" fieldKey={`${item.key}.title`} locale={locale} as="span" /> : title}
                    </h3>
                    <p className="text-muted-foreground">
                      {editor?.editMode ? <PageText page="hotel" section="differentials" fieldKey={`${item.key}.description`} locale={locale} as="span" /> : description}
                    </p>
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
        title={editor?.editMode ? <PageText page="hotel" section="family" fieldKey="title" locale={locale} as="span" /> : (getPageContent("hotel", "family", "title", locale, overrides) || t.family.title)}
        description={
          <div className="space-y-4">
            {editor?.editMode ? (
              <>
                <p><PageText page="hotel" section="family" fieldKey="paragraph1" locale={locale} as="span" /></p>
                <p><PageText page="hotel" section="family" fieldKey="paragraph2" locale={locale} as="span" /></p>
              </>
            ) : (
              <>
                <p>{getPageContent("hotel", "family", "paragraph1", locale, overrides) || t.family.paragraph1}</p>
                <p>{getPageContent("hotel", "family", "paragraph2", locale, overrides) || t.family.paragraph2}</p>
              </>
            )}
          </div>
        }
        image={getGalleryImageByPath(galleryPhotos, "gallery:hotel:familia:0") || hotelImages.familia || galleryPhotos[2]?.imageUrl || null}
        imageNode={editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:hotel:familia:0") || hotelImages.familia || galleryPhotos[2]?.imageUrl || ""} alt={getPageContent("hotel", "family", "imageAlt", locale, overrides) || t.family.imageAlt} path="gallery:hotel:familia:0" className="w-full h-full object-cover" /> : undefined}
        imageAlt={getPageContent("hotel", "family", "imageAlt", locale, overrides) || t.family.imageAlt}
        badge="Acolhimento Nordestino"
        imagePosition="left"
        backgroundColor="primary"
      />

      {/* Explore Fortaleza */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="hotel" section="explore" fieldKey="title" locale={locale} as="span" /> : (getPageContent("hotel", "explore", "title", locale, overrides) || t.explore.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? <PageText page="hotel" section="explore" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("hotel", "explore", "subtitle", locale, overrides) || t.explore.subtitle)}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Praia de Iracema */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-video">
                {editor?.editMode && (getGalleryImageByPath(galleryPhotos, "gallery:hotel:localizacao:0") || (Array.isArray(hotelImages.localizacao) ? hotelImages.localizacao[0] : hotelImages.localizacao)) ? (
                  <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:hotel:localizacao:0") || (Array.isArray(hotelImages.localizacao) ? hotelImages.localizacao[0]! : hotelImages.localizacao!)} alt={getPageContent("hotel", "explore", "spots.beach.title", locale, overrides) || t.explore.spots.beach.title} path="gallery:hotel:localizacao:0" className="w-full h-full object-cover" />
                ) : (() => {
                  const base = getGalleryImageByPath(galleryPhotos, "gallery:hotel:localizacao:0") || (Array.isArray(hotelImages.localizacao) ? hotelImages.localizacao[0] : hotelImages.localizacao) || galleryPhotos[3]?.imageUrl;
                  const valid = typeof base === "string" && base.trim() !== "";
                  return valid ? <Image src={base} alt={t.explore.spots.beach.title} fill quality={100} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />;
                })()}
              </div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">{editor?.editMode ? <PageText page="hotel" section="explore" fieldKey="spots.beach.title" locale={locale} as="span" /> : (getPageContent("hotel", "explore", "spots.beach.title", locale, overrides) || t.explore.spots.beach.title)}</h3>
                <p className="text-muted-foreground mb-4">{editor?.editMode ? <PageText page="hotel" section="explore" fieldKey="spots.beach.description" locale={locale} as="span" /> : (getPageContent("hotel", "explore", "spots.beach.description", locale, overrides) || t.explore.spots.beach.description)}</p>
                <Badge>{editor?.editMode ? <PageText page="hotel" section="explore" fieldKey="spots.beach.badge" locale={locale} as="span" /> : (getPageContent("hotel", "explore", "spots.beach.badge", locale, overrides) || t.explore.spots.beach.badge)}</Badge>
              </CardContent>
            </Card>

            {/* Centro Dragão do Mar */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-video">
                {editor?.editMode && (getGalleryImageByPath(galleryPhotos, "gallery:hotel:localizacao:1") || (Array.isArray(hotelImages.localizacao) ? hotelImages.localizacao[1] : null)) ? (
                  <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:hotel:localizacao:1") || (Array.isArray(hotelImages.localizacao) ? hotelImages.localizacao[1]! : "")} alt={t.explore.spots.culture.title} path="gallery:hotel:localizacao:1" className="w-full h-full object-cover" />
                ) : (() => {
                  const base = getGalleryImageByPath(galleryPhotos, "gallery:hotel:localizacao:1") || (Array.isArray(hotelImages.localizacao) ? hotelImages.localizacao[1] : undefined) || galleryPhotos[4]?.imageUrl;
                  const valid = typeof base === "string" && base.trim() !== "";
                  return valid ? <Image src={base} alt={t.explore.spots.culture.title} fill quality={100} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />;
                })()}
              </div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">{editor?.editMode ? <PageText page="hotel" section="explore" fieldKey="spots.culture.title" locale={locale} as="span" /> : (getPageContent("hotel", "explore", "spots.culture.title", locale, overrides) || t.explore.spots.culture.title)}</h3>
                <p className="text-muted-foreground mb-4">{editor?.editMode ? <PageText page="hotel" section="explore" fieldKey="spots.culture.description" locale={locale} as="span" /> : (getPageContent("hotel", "explore", "spots.culture.description", locale, overrides) || t.explore.spots.culture.description)}</p>
                <Badge>{editor?.editMode ? <PageText page="hotel" section="explore" fieldKey="spots.culture.badge" locale={locale} as="span" /> : (getPageContent("hotel", "explore", "spots.culture.badge", locale, overrides) || t.explore.spots.culture.badge)}</Badge>
              </CardContent>
            </Card>

            {/* Mercado dos Pinhões */}
            <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative aspect-video">
                {editor?.editMode && (getGalleryImageByPath(galleryPhotos, "gallery:hotel:localizacao:2") || (Array.isArray(hotelImages.localizacao) ? hotelImages.localizacao[2] : null)) ? (
                  <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:hotel:localizacao:2") || (Array.isArray(hotelImages.localizacao) ? hotelImages.localizacao[2]! : "")} alt={t.explore.spots.market.title} path="gallery:hotel:localizacao:2" className="w-full h-full object-cover" />
                ) : (() => {
                  const base = getGalleryImageByPath(galleryPhotos, "gallery:hotel:localizacao:2") || (Array.isArray(hotelImages.localizacao) ? hotelImages.localizacao[2] : undefined) || galleryPhotos[5]?.imageUrl;
                  const valid = typeof base === "string" && base.trim() !== "";
                  return valid ? <Image src={base} alt={t.explore.spots.market.title} fill quality={100} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />;
                })()}
              </div>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-2">{editor?.editMode ? <PageText page="hotel" section="explore" fieldKey="spots.market.title" locale={locale} as="span" /> : (getPageContent("hotel", "explore", "spots.market.title", locale, overrides) || t.explore.spots.market.title)}</h3>
                <p className="text-muted-foreground mb-4">{editor?.editMode ? <PageText page="hotel" section="explore" fieldKey="spots.market.description" locale={locale} as="span" /> : (getPageContent("hotel", "explore", "spots.market.description", locale, overrides) || t.explore.spots.market.description)}</p>
                <Badge>{editor?.editMode ? <PageText page="hotel" section="explore" fieldKey="spots.market.badge" locale={locale} as="span" /> : (getPageContent("hotel", "explore", "spots.market.badge", locale, overrides) || t.explore.spots.market.badge)}</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-3 text-muted-foreground mb-6">
              <Bike className="h-5 w-5 text-primary" />
              <p>{editor?.editMode ? <PageText page="hotel" section="bikes" fieldKey="message" locale={locale} as="span" /> : (getPageContent("hotel", "bikes", "message", locale, overrides) || t.bikes.message)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {editor?.editMode ? <PageText page="hotel" section="cta" fieldKey="title" locale={locale} as="span" /> : (getPageContent("hotel", "cta", "title", locale, overrides) || t.cta.title)}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-primary-foreground/90">
            {editor?.editMode ? <PageText page="hotel" section="cta" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("hotel", "cta", "subtitle", locale, overrides) || t.cta.subtitle)}
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white text-primary hover:bg-white/90 h-11 px-8"
          >
            {editor?.editMode ? <PageText page="hotel" section="cta" fieldKey="button" locale={locale} as="span" /> : (getPageContent("hotel", "cta", "button", locale, overrides) || t.cta.button)}
          </a>
        </div>
      </section>
    </>
  );
}

export default function HotelPage() {
  return <HotelPageContent />;
}