"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, Heart, Recycle, Droplets, Sun } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContent, getPageContentIcon } from "@/lib/utils/pageContent";
import { getIcon } from "@/lib/icon-registry";
import { PageText, PageImage, EditableIcon } from "@/components/PageEditor";
import { HeroWithImage } from "@/components/HeroWithImage";
import { MasonrySwap } from "@/components/HorizontalScroll";
import { PhotoStory } from "@/components/PhotoStory";
import { useSustainability } from "@/lib/hooks/useSustainability";
import { useGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";

function ESGPageContent() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "esg");
  const editor = useEditor();
  const { sustainability, loading: sustainabilityLoading } = useSustainability(true);
  const { photos: galleryPhotos, loading: galleryLoading } = useGallery();
  const loading = sustainabilityLoading || galleryLoading;

  // Buscar todas as imagens usando useMemo
  const esgImages = useMemo(() => {
    if (!galleryPhotos || galleryPhotos.length === 0) {
      return {
        hero: null,
        galeria: [],
        photoStory: {
          obrasLocais: null,
          sustentabilidade: null,
          sustentabilidade2: null,
          acoesSociais: null,
        },
        acoesSociais: null,
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
          return page === "esg" && sec === section.toLowerCase().trim();
        })
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      if (typeof limit === "number") {
        return filtered.slice(0, limit);
      }
      return filtered;
    };

    const heroPhoto = getPhotosBySection("hero-esg", 1)[0] || null;
    const galeriaPraticas = getPhotosBySection("galeria-praticas", 6);
    const photoStoryPhotos = getPhotosBySection("photo-story-impacto", 4);
    const acoesSociaisPhoto = getPhotosBySection("acoes-sociais", 1)[0] || null;

    return {
      hero: heroPhoto?.imageUrl || null,
      galeria: galeriaPraticas,
      photoStory: {
        obrasLocais: photoStoryPhotos[0]?.imageUrl || null,
        sustentabilidade: photoStoryPhotos[1]?.imageUrl || null,
        sustentabilidade2: photoStoryPhotos[2]?.imageUrl || null,
        acoesSociais: photoStoryPhotos[3]?.imageUrl || null,
      },
      acoesSociais: acoesSociaisPhoto?.imageUrl || null,
    };
  }, [galleryPhotos]);

  const sustainabilityPillarDefaults: Record<string, string> = { waste: "Recycle", water: "Droplets", energy: "Sun", local: "Leaf" };
  const sustainabilityActions = [
    { icon: Recycle, key: "waste", title: t.actions.waste.title, description: t.actions.waste.description, actions: t.actions.waste.items },
    { icon: Droplets, key: "water", title: t.actions.water.title, description: t.actions.water.description, actions: t.actions.water.items },
    { icon: Sun, key: "energy", title: t.actions.energy.title, description: t.actions.energy.description, actions: t.actions.energy.items },
    { icon: Leaf, key: "local", title: t.actions.local.title, description: t.actions.local.description, actions: t.actions.local.items }
  ];

  const inclusionPillarDefaults: Record<string, string> = { accessibility: "Users", diversity: "Heart" };
  const inclusionActions = [
    { icon: Users, key: "accessibility", title: t.inclusionActions.accessibility.title, description: t.inclusionActions.accessibility.description, actions: t.inclusionActions.accessibility.items },
    { icon: Heart, key: "diversity", title: t.inclusionActions.diversity.title, description: t.inclusionActions.diversity.description, actions: t.inclusionActions.diversity.items }
  ];

  return (
    <>
      {/* Hero Section com Imagem */}
      <HeroWithImage
        title={editor?.editMode ? <PageText page="esg" section="hero" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("esg", "hero", "title", locale, editor?.overrides ?? {}) || t.hero.title)}
        subtitle={editor?.editMode ? <PageText page="esg" section="hero" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("esg", "hero", "subtitle", locale, editor?.overrides ?? {}) || t.hero.subtitle)}
        image={getGalleryImageByPath(galleryPhotos, "gallery:esg:hero-esg:0") || sustainability[0]?.imageUrl || esgImages.hero || undefined}
        imageNode={editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:esg:hero-esg:0") || sustainability[0]?.imageUrl || esgImages.hero || ""} alt="Hero" path="gallery:esg:hero-esg:0" className="absolute inset-0 w-full h-full" /> : undefined}
        imageAlt={t.hero.imageAlt}
        icon={(() => {
          const overrides = editor?.overrides ?? {};
          const heroIconName = getPageContentIcon("hero", "icon", overrides, "Leaf");
          const HeroIconComponent = getIcon(heroIconName) ?? Leaf;
          return editor?.editMode
            ? <EditableIcon page="esg" section="hero" fieldKey="icon" locale={locale} defaultIconName="Leaf" defaultIcon={Leaf} iconClassName="h-16 w-16" />
            : <HeroIconComponent className="h-16 w-16" />;
        })()}
        badge={
          editor?.editMode ? (
            <PageText page="esg" section="hero" fieldKey="badge" locale={locale} as="span" />
          ) : (
            getPageContent("esg", "hero", "badge", locale, editor?.overrides ?? {}) || t.hero.badge
          )
        }
        height="medium"
        overlay="medium"
      />

      {/* Galeria - Práticas Sustentáveis - MASONRY ANIMADO */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="esg" section="practices" fieldKey="title" locale={locale} as="span" /> : (getPageContent("esg", "practices", "title", locale, editor?.overrides ?? {}) || t.practices.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? <PageText page="esg" section="practices" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("esg", "practices", "subtitle", locale, editor?.overrides ?? {}) || t.practices.subtitle)}
            </p>
          </div>
          
          {editor?.editMode ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => esgImages.galeria[i]).map((photo, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <PageImage src={(getGalleryImageByPath(galleryPhotos, `gallery:esg:galeria-praticas:${i}`) || photo?.imageUrl) ?? ""} path={`gallery:esg:galeria-praticas:${i}`} aspectRatio="auto" className="w-full h-full" />
                </div>
              ))}
            </div>
          ) : (
            <MasonrySwap
              images={esgImages.galeria
                .map(photo => photo.imageUrl)
                .filter(img => img && img.trim() !== '')}
              interval={5000}
            />
          )}
        </div>
      </section>

      {/* Sustentabilidade Ambiental */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="esg" section="sustainability" fieldKey="title" locale={locale} as="span" /> : (getPageContent("esg", "sustainability", "title", locale, editor?.overrides ?? {}) || t.sustainability.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {editor?.editMode ? <PageText page="esg" section="sustainability" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("esg", "sustainability", "subtitle", locale, editor?.overrides ?? {}) || t.sustainability.subtitle)}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sustainabilityActions.map((item, index) => {
              const overrides = editor?.overrides ?? {};
              const iconName = getPageContentIcon("pillars", `${item.key}.icon`, overrides, sustainabilityPillarDefaults[item.key] ?? "Recycle");
              const ResolvedIcon = getIcon(iconName) ?? item.icon;
              const pillarIcon = editor?.editMode
                ? <EditableIcon page="esg" section="pillars" fieldKey={`${item.key}.icon`} locale={locale} defaultIconName={sustainabilityPillarDefaults[item.key] ?? "Recycle"} defaultIcon={item.icon} iconClassName="h-8 w-8 text-green-600" />
                : <ResolvedIcon className="h-8 w-8 text-green-600" />;
              const titleContent = editor?.editMode ? <PageText page="esg" section="actions" fieldKey={`${item.key}.title`} locale={locale} as="span" /> : (getPageContent("esg", "actions", `${item.key}.title`, locale, editor?.overrides ?? {}) || item.title);
              const descContent = editor?.editMode ? <PageText page="esg" section="actions" fieldKey={`${item.key}.description`} locale={locale} as="span" /> : (getPageContent("esg", "actions", `${item.key}.description`, locale, editor?.overrides ?? {}) || item.description);
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="p-3 bg-green-600/10 rounded-lg w-fit mb-4">
                      {pillarIcon}
                    </div>
                    <CardTitle className="text-2xl">{titleContent}</CardTitle>
                    <CardDescription className="text-base">
                      {descContent}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-600 flex-shrink-0 mt-1.5" />
                          {editor?.editMode ? <PageText page="esg" section="actions" fieldKey={`${item.key}.items.${idx}`} locale={locale} as="span" /> : (getPageContent("esg", "actions", `${item.key}.items.${idx}`, locale, editor?.overrides ?? {}) || action)}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inclusão e Diversidade */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="esg" section="inclusion" fieldKey="title" locale={locale} as="span" /> : (getPageContent("esg", "inclusion", "title", locale, editor?.overrides ?? {}) || t.inclusion.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {editor?.editMode ? <PageText page="esg" section="inclusion" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("esg", "inclusion", "subtitle", locale, editor?.overrides ?? {}) || t.inclusion.subtitle)}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {inclusionActions.map((item, index) => {
              const overrides = editor?.overrides ?? {};
              const iconName = getPageContentIcon("pillars", `${item.key}.icon`, overrides, inclusionPillarDefaults[item.key] ?? "Users");
              const ResolvedIcon = getIcon(iconName) ?? item.icon;
              const pillarIcon = editor?.editMode
                ? <EditableIcon page="esg" section="pillars" fieldKey={`${item.key}.icon`} locale={locale} defaultIconName={inclusionPillarDefaults[item.key] ?? "Users"} defaultIcon={item.icon} iconClassName="h-8 w-8 text-blue-600" />
                : <ResolvedIcon className="h-8 w-8 text-blue-600" />;
              const titleContent = editor?.editMode ? <PageText page="esg" section="inclusionActions" fieldKey={`${item.key}.title`} locale={locale} as="span" /> : (getPageContent("esg", "inclusionActions", `${item.key}.title`, locale, editor?.overrides ?? {}) || item.title);
              const descContent = editor?.editMode ? <PageText page="esg" section="inclusionActions" fieldKey={`${item.key}.description`} locale={locale} as="span" /> : (getPageContent("esg", "inclusionActions", `${item.key}.description`, locale, editor?.overrides ?? {}) || item.description);
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="p-3 bg-blue-600/10 rounded-lg w-fit mb-4">
                      {pillarIcon}
                    </div>
                    <CardTitle className="text-2xl">{titleContent}</CardTitle>
                    <CardDescription className="text-base">
                      {descContent}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {item.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                          {editor?.editMode ? <PageText page="esg" section="inclusionActions" fieldKey={`${item.key}.items.${idx}`} locale={locale} as="span" /> : (getPageContent("esg", "inclusionActions", `${item.key}.items.${idx}`, locale, editor?.overrides ?? {}) || action)}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* PhotoStory - Impacto Social e Ambiental */}
      <PhotoStory
        title={editor?.editMode ? <PageText page="esg" section="commitment" fieldKey="title" locale={locale} as="span" /> : (getPageContent("esg", "commitment", "title", locale, editor?.overrides ?? {}) || t.commitment.title)}
        subtitle={editor?.editMode ? <PageText page="esg" section="commitment" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("esg", "commitment", "subtitle", locale, editor?.overrides ?? {}) || t.commitment.subtitle)}
        backgroundColor="white"
        items={[
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:esg:photo-story-impacto:0") || sustainability.find(s => s.category === "obras-locais")?.imageUrl || esgImages.photoStory.obrasLocais || ""} path="gallery:esg:photo-story-impacto:0" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:esg:photo-story-impacto:0") || sustainability.find(s => s.category === "obras-locais")?.imageUrl || esgImages.photoStory.obrasLocais || null),
            title: editor?.editMode ? <PageText page="esg" section="impactPhotoStory" fieldKey="localProd.title" locale={locale} as="span" /> : (getPageContent("esg", "impactPhotoStory", "localProd.title", locale, editor?.overrides ?? {}) || t.impactPhotoStory.localProd.title),
            description: editor?.editMode ? <PageText page="esg" section="impactPhotoStory" fieldKey="localProd.description" locale={locale} as="span" /> : (getPageContent("esg", "impactPhotoStory", "localProd.description", locale, editor?.overrides ?? {}) || t.impactPhotoStory.localProd.description),
          },
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:esg:photo-story-impacto:1") || sustainability.find(s => s.category === "sustentabilidade")?.imageUrl || esgImages.photoStory.sustentabilidade || ""} path="gallery:esg:photo-story-impacto:1" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:esg:photo-story-impacto:1") || sustainability.find(s => s.category === "sustentabilidade")?.imageUrl || esgImages.photoStory.sustentabilidade || null),
            title: editor?.editMode ? <PageText page="esg" section="impactPhotoStory" fieldKey="mobility.title" locale={locale} as="span" /> : (getPageContent("esg", "impactPhotoStory", "mobility.title", locale, editor?.overrides ?? {}) || t.impactPhotoStory.mobility.title),
            description: editor?.editMode ? <PageText page="esg" section="impactPhotoStory" fieldKey="mobility.description" locale={locale} as="span" /> : (getPageContent("esg", "impactPhotoStory", "mobility.description", locale, editor?.overrides ?? {}) || t.impactPhotoStory.mobility.description),
          },
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:esg:photo-story-impacto:2") || sustainability.filter(s => s.category === "sustentabilidade")[1]?.imageUrl || esgImages.photoStory.sustentabilidade2 || ""} path="gallery:esg:photo-story-impacto:2" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:esg:photo-story-impacto:2") || sustainability.filter(s => s.category === "sustentabilidade")[1]?.imageUrl || esgImages.photoStory.sustentabilidade2 || null),
            title: editor?.editMode ? <PageText page="esg" section="impactPhotoStory" fieldKey="resources.title" locale={locale} as="span" /> : (getPageContent("esg", "impactPhotoStory", "resources.title", locale, editor?.overrides ?? {}) || t.impactPhotoStory.resources.title),
            description: editor?.editMode ? <PageText page="esg" section="impactPhotoStory" fieldKey="resources.description" locale={locale} as="span" /> : (getPageContent("esg", "impactPhotoStory", "resources.description", locale, editor?.overrides ?? {}) || t.impactPhotoStory.resources.description),
          },
          {
            image: editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:esg:photo-story-impacto:3") || sustainability.find(s => s.category === "acoes-sociais")?.imageUrl || esgImages.photoStory.acoesSociais || ""} path="gallery:esg:photo-story-impacto:3" aspectRatio="auto" className="absolute inset-0 w-full h-full" /> : (getGalleryImageByPath(galleryPhotos, "gallery:esg:photo-story-impacto:3") || sustainability.find(s => s.category === "acoes-sociais")?.imageUrl || esgImages.photoStory.acoesSociais || null),
            title: editor?.editMode ? <PageText page="esg" section="impactPhotoStory" fieldKey="team.title" locale={locale} as="span" /> : (getPageContent("esg", "impactPhotoStory", "team.title", locale, editor?.overrides ?? {}) || t.impactPhotoStory.team.title),
            description: editor?.editMode ? <PageText page="esg" section="impactPhotoStory" fieldKey="team.description" locale={locale} as="span" /> : (getPageContent("esg", "impactPhotoStory", "team.description", locale, editor?.overrides ?? {}) || t.impactPhotoStory.team.description),
          },
        ].filter(item => item.image || editor?.editMode)}
      />

      {/* Ações Sociais */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              {editor?.editMode ? (
                <PageImage
                  src={getGalleryImageByPath(galleryPhotos, "gallery:esg:acoes-sociais:0") || sustainability.find(s => s.category === "acoes-sociais")?.imageUrl || esgImages.acoesSociais || ""}
                  path="gallery:esg:acoes-sociais:0"
                  aspectRatio="auto"
                  className="w-full h-full"
                />
              ) : (() => {
                const imageUrl = getGalleryImageByPath(galleryPhotos, "gallery:esg:acoes-sociais:0") || sustainability.find(s => s.category === "acoes-sociais")?.imageUrl || esgImages.acoesSociais;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image
                    src={imageUrl}
                    alt="Compromisso Social"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-600/20 to-emerald-600/20" />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-3xl font-bold mb-2">
                  {editor?.editMode ? <PageText page="esg" section="social" fieldKey="together" locale={locale} as="span" className="text-white" /> : (getPageContent("esg", "social", "together", locale, editor?.overrides ?? {}) || t.social.together)}
                </h3>
                <p className="text-white/90">
                  {editor?.editMode ? <PageText page="esg" section="social" fieldKey="togetherSubtitle" locale={locale} as="span" className="text-white/90" /> : (getPageContent("esg", "social", "togetherSubtitle", locale, editor?.overrides ?? {}) || t.social.togetherSubtitle)}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {editor?.editMode ? <PageText page="esg" section="social" fieldKey="title" locale={locale} as="span" /> : (getPageContent("esg", "social", "title", locale, editor?.overrides ?? {}) || t.social.title)}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {editor?.editMode ? <PageText page="esg" section="social" fieldKey="description" locale={locale} as="span" /> : (getPageContent("esg", "social", "description", locale, editor?.overrides ?? {}) || t.social.description)}
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                    {editor?.editMode ? <EditableIcon page="esg" section="social" fieldKey="support.icon" locale={locale} defaultIconName="Heart" defaultIcon={Heart} iconClassName="h-5 w-5 text-orange-600" /> : <Heart className="h-5 w-5 text-orange-600" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{editor?.editMode ? <PageText page="esg" section="social" fieldKey="support.title" locale={locale} as="span" /> : (getPageContent("esg", "social", "support.title", locale, editor?.overrides ?? {}) || t.social.support.title)}</p>
                    <p className="text-sm text-muted-foreground">
                      {editor?.editMode ? <PageText page="esg" section="social" fieldKey="support.description" locale={locale} as="span" /> : (getPageContent("esg", "social", "support.description", locale, editor?.overrides ?? {}) || t.social.support.description)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                    {editor?.editMode ? <EditableIcon page="esg" section="social" fieldKey="jobs.icon" locale={locale} defaultIconName="Users" defaultIcon={Users} iconClassName="h-5 w-5 text-orange-600" /> : <Users className="h-5 w-5 text-orange-600" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{editor?.editMode ? <PageText page="esg" section="social" fieldKey="jobs.title" locale={locale} as="span" /> : (getPageContent("esg", "social", "jobs.title", locale, editor?.overrides ?? {}) || t.social.jobs.title)}</p>
                    <p className="text-sm text-muted-foreground">
                      {editor?.editMode ? <PageText page="esg" section="social" fieldKey="jobs.description" locale={locale} as="span" /> : (getPageContent("esg", "social", "jobs.description", locale, editor?.overrides ?? {}) || t.social.jobs.description)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-600/10 flex items-center justify-center flex-shrink-0">
                    {editor?.editMode ? <EditableIcon page="esg" section="social" fieldKey="suppliers.icon" locale={locale} defaultIconName="Leaf" defaultIcon={Leaf} iconClassName="h-5 w-5 text-orange-600" /> : <Leaf className="h-5 w-5 text-orange-600" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{editor?.editMode ? <PageText page="esg" section="social" fieldKey="suppliers.title" locale={locale} as="span" /> : (getPageContent("esg", "social", "suppliers.title", locale, editor?.overrides ?? {}) || t.social.suppliers.title)}</p>
                    <p className="text-sm text-muted-foreground">
                      {editor?.editMode ? <PageText page="esg" section="social" fieldKey="suppliers.description" locale={locale} as="span" /> : (getPageContent("esg", "social", "suppliers.description", locale, editor?.overrides ?? {}) || t.social.suppliers.description)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-green-600/90 to-green-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {editor?.editMode ? <PageText page="esg" section="cta" fieldKey="title" locale={locale} as="span" /> : (getPageContent("esg", "cta", "title", locale, editor?.overrides ?? {}) || t.cta.title)}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            {editor?.editMode ? <PageText page="esg" section="cta" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("esg", "cta", "subtitle", locale, editor?.overrides ?? {}) || t.cta.subtitle)}
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white text-green-700 hover:bg-white/90 h-11 px-8"
          >
            {editor?.editMode ? <PageText page="esg" section="cta" fieldKey="button" locale={locale} as="span" /> : (getPageContent("esg", "cta", "button", locale, editor?.overrides ?? {}) || t.cta.button)}
          </a>
        </div>
      </section>
    </>
  );
}

export default function ESGPage() {
  return <ESGPageContent />;
}