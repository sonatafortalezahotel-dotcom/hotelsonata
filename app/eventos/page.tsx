"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Heart, Check, Building2, Lightbulb, Wind, ParkingCircle, Coffee, ChefHat, CheckCircle2 } from "lucide-react";
import { RoomCapacityTable } from "@/components/RoomCapacityTable";
import { HeroWithImage } from "@/components/HeroWithImage";
import { GalleryOneLeftTwoRight, GALLERY_ONE_LEFT_TWO_RIGHT_GRID_HEIGHT } from "@/components/HorizontalScroll";
import Image from "@/lib/app-image";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContent, getPageContentIcon } from "@/lib/utils/pageContent";
import { getIcon } from "@/lib/icon-registry";
import { PageText, PageImage, EditableIcon } from "@/components/PageEditor";
import { useEvents } from "@/lib/hooks/useEvents";
import { useGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageTitle } from "@/lib/utils";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";
import { toast } from "sonner";

const initialLeadFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  eventType: "" as string,
  eventDate: "",
  guests: "",
  message: "",
};

function EventosPageContent() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "events");
  const editor = useEditor();
  const { events, loading: eventsLoading } = useEvents(true, locale);
  const { photos: galleryPhotos, loading: galleryLoading, refetch: refetchGallery } = useGallery();
  const loading = eventsLoading || galleryLoading;
  const [mounted, setMounted] = useState(false);
  const [leadForm, setLeadForm] = useState(initialLeadFormState);
  const [leadFormLoading, setLeadFormLoading] = useState(false);
  const [leadFormSuccess, setLeadFormSuccess] = useState(false);

  // Overrides do editor (salvos no BD): em edit mode permitem editar; em ambos os modos exibem o valor salvo (ex.: subtítulo do hero).
  const contentOverrides = editor?.overrides ?? {};

  // Refetch da galeria quando fotos forem adicionadas/alteradas (edit mode ou admin), para aparecer na página
  useEffect(() => {
    const onGalleryUpdated = () => refetchGallery(true);
    window.addEventListener("gallery-updated", onGalleryUpdated);
    return () => window.removeEventListener("gallery-updated", onGalleryUpdated);
  }, [refetchGallery]);

  // Em modo edição, recarregar galeria ao montar para que imagens já salvas (ex.: config auditório/escolar/coquetel) apareçam
  useEffect(() => {
    if (editor?.editMode) refetchGallery(true);
  }, [editor?.editMode, refetchGallery]);

  // Buscar todas as imagens usando useMemo para evitar múltiplas chamadas
  const eventosImages = useMemo(() => {
    const normalize = (value: any) =>
      (value || "").toString().toLowerCase().trim();

    const filterBySection = (section: string) =>
      galleryPhotos
        .filter((img: any) => {
          if (!img?.active) return false;
          if (!img.imageUrl || typeof img.imageUrl !== "string") return false;
          if (!img.imageUrl.trim()) return false;

          const page = normalize(img.page);
          const sec = normalize(img.section);
          return page === "eventos" && sec === section.toLowerCase().trim();
        })
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    const corporativoGallery = filterBySection("evento-corporativo");
    const casamentoGallery = filterBySection("evento-casamento");
    const nupciasGallery = filterBySection("evento-nupcias");
    const galeriaSection = filterBySection("galeria");

    // Hero preferencialmente vem da galeria corporativa, depois de outras seções
    const heroFromGallery =
      corporativoGallery[0]?.imageUrl ||
      casamentoGallery[0]?.imageUrl ||
      nupciasGallery[0]?.imageUrl ||
      null;

    // Galeria principal: corporativo + casamento + núpcias + galeria (fotos adicionadas no edit mode)
    const galleryImages: Array<{ imageUrl: string; title?: string | null; category?: string | null }> = [];

    const pushImage = (url: any) => {
      if (!url || typeof url !== "string" || !url.trim()) return;
      if (galleryImages.some((p) => p.imageUrl === url)) return;
      galleryImages.push({ imageUrl: url });
    };

    [...corporativoGallery, ...casamentoGallery, ...nupciasGallery, ...galeriaSection].forEach(
      (p: any) => pushImage(p.imageUrl),
    );

    return {
      hero: heroFromGallery,
      corporativo: corporativoGallery[0]?.imageUrl || null,
      gallery: galleryImages,
    };
  }, [events, galleryPhotos]);

  // Na página pública a galeria usa só fotos da galeria (page=eventos); em edit mode incluímos também imagens da API de eventos
  const publicGalleryImages = useMemo(() => {
    const isEditMode = editor?.editMode === true;
    if (isEditMode) return eventosImages.gallery;
    return eventosImages.gallery.filter(
      (p) =>
        p?.imageUrl &&
        galleryPhotos.some(
          (img: any) =>
            img?.active &&
            (img.page ?? "").toString().toLowerCase().trim() === "eventos" &&
            img.imageUrl === p.imageUrl
        )
    );
  }, [editor?.editMode, eventosImages.gallery, galleryPhotos]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const facilityDefaultIcons: Record<string, string> = { naturalLight: "Lightbulb", ac: "Wind", exclusive: "Building2", parking: "ParkingCircle", foyer: "Coffee", gastronomy: "ChefHat" };
  const facilities = [
    { key: "naturalLight", icon: Lightbulb, title: t.facilities.items.naturalLight.title, description: t.facilities.items.naturalLight.description },
    { key: "ac", icon: Wind, title: t.facilities.items.ac.title, description: t.facilities.items.ac.description },
    { key: "exclusive", icon: Building2, title: t.facilities.items.exclusive.title, description: t.facilities.items.exclusive.description },
    { key: "parking", icon: ParkingCircle, title: t.facilities.items.parking.title, description: t.facilities.items.parking.description },
    { key: "foyer", icon: Coffee, title: t.facilities.items.foyer.title, description: t.facilities.items.foyer.description },
    { key: "gastronomy", icon: ChefHat, title: t.facilities.items.gastronomy.title, description: t.facilities.items.gastronomy.description }
  ];

  const eventTypeDefaultIcons: Record<string, string> = { corporate: "Briefcase", wedding: "Heart" };
  const eventTypes = [
    { key: "corporate", icon: Briefcase, title: t.types.items.corporate.title, description: t.types.items.corporate.description, capacity: t.types.items.corporate.capacity, features: t.types.items.corporate.features },
    { key: "wedding", icon: Heart, title: t.types.items.wedding.title, description: t.types.items.wedding.description, capacity: t.types.items.wedding.capacity, features: t.types.items.wedding.features }
  ];

  return (
    <>
      {/* Hero Section com Imagem */}
      <HeroWithImage
        title={editor?.editMode ? <PageText page="eventos" section="hero" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "hero", "title", locale, contentOverrides) || t.hero.title)}
        subtitle={editor?.editMode ? <PageText page="eventos" section="hero" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "hero", "subtitle", locale, contentOverrides) || t.hero.subtitle)}
        image={mounted ? (getGalleryImageByPath(galleryPhotos, "gallery:eventos:evento-corporativo:0") || events[0]?.imageUrl || eventosImages.hero || "/Sobre Hotel/Eventos/eventos-1.jpg") : undefined}
        imageNode={editor?.editMode && mounted ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:eventos:evento-corporativo:0") || events[0]?.imageUrl || eventosImages.hero || ""} alt="Hero" path="gallery:eventos:evento-corporativo:0" className="absolute inset-0 w-full h-full" /> : undefined}
        imageAlt="Espaço para Eventos - Hotel Sonata"
        icon={(() => {
          const overrides = contentOverrides;
          const heroIconName = getPageContentIcon("hero", "icon", overrides, "Briefcase");
          const HeroIconComponent = getIcon(heroIconName) ?? Briefcase;
          return editor?.editMode
            ? <EditableIcon page="eventos" section="hero" fieldKey="icon" locale={locale} defaultIconName="Briefcase" defaultIcon={Briefcase} iconClassName="h-16 w-16" />
            : <HeroIconComponent className="h-16 w-16" />;
        })()}
        badge={
          editor?.editMode ? (
            <PageText page="eventos" section="hero" fieldKey="badge" locale={locale} as="span" />
          ) : (
            getPageContent("eventos", "hero", "badge", locale, contentOverrides) || t.hero.badge
          )
        }
        height="large"
        overlay="dark"
      />

      {/* Galeria Visual de Espaços - MASONRY ANIMADO */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-primary hover:bg-primary/90 text-primary-foreground text-base px-4 py-2">
              <Building2 className="h-4 w-4 mr-2 inline" />
              {editor?.editMode ? <PageText page="eventos" section="gallery" fieldKey="badge" locale={locale} as="span" /> : (getPageContent("eventos", "gallery", "badge", locale, contentOverrides) || t.gallery.badge)}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="eventos" section="gallery" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "gallery", "title", locale, contentOverrides) || t.gallery.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? <PageText page="eventos" section="gallery" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "gallery", "subtitle", locale, contentOverrides) || t.gallery.subtitle)}
            </p>
          </div>
          
          {editor?.editMode ? (
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 lg:grid-rows-2 ${GALLERY_ONE_LEFT_TWO_RIGHT_GRID_HEIGHT}`}>
              {[0, 1, 2].map((i) => {
                const photo = eventosImages.gallery[i];
                const path = `gallery:eventos:galeria:${i}`;
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
              images={publicGalleryImages
                .map(photo => photo.imageUrl)
                .filter((img): img is string => !!img && typeof img === "string" && img.trim() !== "")}
              interval={5000}
            />
          )}
        </div>
      </section>

      {/* Facilidades */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="eventos" section="facilities" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "facilities", "title", locale, contentOverrides) || t.facilities.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? <PageText page="eventos" section="facilities" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "facilities", "subtitle", locale, contentOverrides) || t.facilities.subtitle)}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => {
              const overrides = contentOverrides;
              const iconName = getPageContentIcon("facilities", `${facility.key}.icon`, overrides, facilityDefaultIcons[facility.key] ?? "Lightbulb");
              const ResolvedIcon = getIcon(iconName) ?? facility.icon;
              const facilityIcon = editor?.editMode
                ? <EditableIcon page="eventos" section="facilities" fieldKey={`${facility.key}.icon`} locale={locale} defaultIconName={facilityDefaultIcons[facility.key] ?? "Lightbulb"} defaultIcon={facility.icon} iconClassName="h-8 w-8 text-primary" />
                : <ResolvedIcon className="h-8 w-8 text-primary" />;
              const titleContent = editor?.editMode ? <PageText page="eventos" section="facilities" fieldKey={`items.${facility.key}.title`} locale={locale} as="span" /> : (getPageContent("eventos", "facilities", `items.${facility.key}.title`, locale, contentOverrides) || facility.title);
              const descContent = editor?.editMode ? <PageText page="eventos" section="facilities" fieldKey={`items.${facility.key}.description`} locale={locale} as="span" /> : (getPageContent("eventos", "facilities", `items.${facility.key}.description`, locale, contentOverrides) || facility.description);
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      {facilityIcon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{titleContent}</h3>
                    <p className="text-muted-foreground text-sm">{descContent}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">{editor?.editMode ? <PageText page="eventos" section="access" fieldKey="title" locale={locale} as="span" /> : (getPageContent("eventos", "access", "title", locale, contentOverrides) || t.access.title)}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {t.access.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{editor?.editMode ? <PageText page="eventos" section="access" fieldKey={`items.${index}`} locale={locale} as="span" /> : (getPageContent("eventos", "access", `items.${index}`, locale, contentOverrides) || item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">{editor?.editMode ? <PageText page="eventos" section="included" fieldKey="title" locale={locale} as="span" /> : (getPageContent("eventos", "included", "title", locale, contentOverrides) || t.included.title)}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {t.included.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{editor?.editMode ? <PageText page="eventos" section="included" fieldKey={`items.${index}`} locale={locale} as="span" /> : (getPageContent("eventos", "included", `items.${index}`, locale, contentOverrides) || item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabela Comparativa de Capacidades */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-primary hover:bg-primary/90 text-primary-foreground text-base px-4 py-2">
              {editor?.editMode ? <PageText page="eventos" section="capacity" fieldKey="badge" locale={locale} as="span" /> : (getPageContent("eventos", "capacity", "badge", locale, contentOverrides) || t.capacity.badge)}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="eventos" section="capacity" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "capacity", "title", locale, contentOverrides) || t.capacity.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? <PageText page="eventos" section="capacity" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "capacity", "subtitle", locale, contentOverrides) || t.capacity.subtitle)}
            </p>
          </div>

          <RoomCapacityTable />

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-6">
              {editor?.editMode ? <PageText page="eventos" section="capacity" fieldKey="note" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "capacity", "note", locale, contentOverrides) || t.capacity.note)}
            </p>
          </div>
        </div>
      </section>

      {/* Galeria - Tipos de Configuração */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="eventos" section="configurations" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "configurations", "title", locale, contentOverrides) || t.configurations.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? <PageText page="eventos" section="configurations" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "configurations", "subtitle", locale, contentOverrides) || t.configurations.subtitle)}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Auditório */}
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl group">
              {editor?.editMode ? (
                <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:eventos:config-auditorium:0") || events.find(e => e.type === "corporativo")?.imageUrl || eventosImages.corporativo || ""} path="gallery:eventos:config-auditorium:0" aspectRatio="auto" className="absolute inset-0 w-full h-full object-cover" />
              ) : (() => {
                const imageUrl = getGalleryImageByPath(galleryPhotos, "gallery:eventos:config-auditorium:0") || events.find(e => e.type === "corporativo")?.imageUrl || eventosImages.corporativo;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image src={imageUrl} alt="Setup Auditório" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/30" />
                );
              })()}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent ${editor?.editMode ? "pointer-events-none" : ""}`} aria-hidden />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{editor?.editMode ? <PageText page="eventos" section="configurations" fieldKey="items.auditorium.title" locale={locale} as="span" className="text-white" /> : (getPageContent("eventos", "configurations", "items.auditorium.title", locale, contentOverrides) || t.configurations.items.auditorium.title)}</h3>
                <p className="text-white/90">{editor?.editMode ? <PageText page="eventos" section="configurations" fieldKey="items.auditorium.description" locale={locale} as="span" className="text-white/90" /> : (getPageContent("eventos", "configurations", "items.auditorium.description", locale, contentOverrides) || t.configurations.items.auditorium.description)}</p>
              </div>
            </div>

            {/* Escolar */}
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl group">
              {editor?.editMode ? (
                <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:eventos:config-school:0") || events.find(e => e.type === "corporativo" || e.type === "social")?.imageUrl || eventosImages.corporativo || ""} path="gallery:eventos:config-school:0" aspectRatio="auto" className="absolute inset-0 w-full h-full object-cover" />
              ) : (() => {
                const imageUrl = getGalleryImageByPath(galleryPhotos, "gallery:eventos:config-school:0") || events.find(e => e.type === "corporativo" || e.type === "social")?.imageUrl || eventosImages.corporativo;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image src={imageUrl} alt="Setup Escolar" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/30" />
                );
              })()}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent ${editor?.editMode ? "pointer-events-none" : ""}`} aria-hidden />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{editor?.editMode ? <PageText page="eventos" section="configurations" fieldKey="items.school.title" locale={locale} as="span" className="text-white" /> : (getPageContent("eventos", "configurations", "items.school.title", locale, contentOverrides) || t.configurations.items.school.title)}</h3>
                <p className="text-white/90">{editor?.editMode ? <PageText page="eventos" section="configurations" fieldKey="items.school.description" locale={locale} as="span" className="text-white/90" /> : (getPageContent("eventos", "configurations", "items.school.description", locale, contentOverrides) || t.configurations.items.school.description)}</p>
              </div>
            </div>

            {/* Banquete */}
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl group">
              {editor?.editMode ? (
                <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:eventos:config-banquet:0") || events.find(e => e.type === "social" || e.type === "casamento")?.imageUrl || eventosImages.corporativo || ""} path="gallery:eventos:config-banquet:0" aspectRatio="auto" className="absolute inset-0 w-full h-full object-cover" />
              ) : (() => {
                const imageUrl = getGalleryImageByPath(galleryPhotos, "gallery:eventos:config-banquet:0") || events.find(e => e.type === "social" || e.type === "casamento")?.imageUrl || eventosImages.corporativo;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image src={imageUrl} alt="Setup Banquete" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/30" />
                );
              })()}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent ${editor?.editMode ? "pointer-events-none" : ""}`} aria-hidden />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{editor?.editMode ? <PageText page="eventos" section="configurations" fieldKey="items.banquet.title" locale={locale} as="span" className="text-white" /> : (getPageContent("eventos", "configurations", "items.banquet.title", locale, contentOverrides) || t.configurations.items.banquet.title)}</h3>
                <p className="text-white/90">{editor?.editMode ? <PageText page="eventos" section="configurations" fieldKey="items.banquet.description" locale={locale} as="span" className="text-white/90" /> : (getPageContent("eventos", "configurations", "items.banquet.description", locale, contentOverrides) || t.configurations.items.banquet.description)}</p>
              </div>
            </div>

            {/* Coquetel */}
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl group">
              {editor?.editMode ? (
                <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:eventos:config-cocktail:0") || events.find(e => e.type === "social" || e.type === "corporativo")?.imageUrl || eventosImages.corporativo || ""} path="gallery:eventos:config-cocktail:0" aspectRatio="auto" className="absolute inset-0 w-full h-full object-cover" />
              ) : (() => {
                const imageUrl = getGalleryImageByPath(galleryPhotos, "gallery:eventos:config-cocktail:0") || events.find(e => e.type === "social" || e.type === "corporativo")?.imageUrl || eventosImages.corporativo;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image src={imageUrl} alt="Setup Coquetel" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/30" />
                );
              })()}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent ${editor?.editMode ? "pointer-events-none" : ""}`} aria-hidden />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{editor?.editMode ? <PageText page="eventos" section="configurations" fieldKey="items.cocktail.title" locale={locale} as="span" className="text-white" /> : (getPageContent("eventos", "configurations", "items.cocktail.title", locale, contentOverrides) || t.configurations.items.cocktail.title)}</h3>
                <p className="text-white/90">{editor?.editMode ? <PageText page="eventos" section="configurations" fieldKey="items.cocktail.description" locale={locale} as="span" className="text-white/90" /> : (getPageContent("eventos", "configurations", "items.cocktail.description", locale, contentOverrides) || t.configurations.items.cocktail.description)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planta do Espaço */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-background dark:from-primary/10 dark:to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary hover:bg-primary/90 text-primary-foreground text-base px-4 py-2">
              {editor?.editMode ? <PageText page="eventos" section="layout" fieldKey="badge" locale={locale} as="span" /> : (getPageContent("eventos", "layout", "badge", locale, contentOverrides) || t.layout.badge)}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="eventos" section="layout" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "layout", "title", locale, contentOverrides) || t.layout.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {editor?.editMode ? <PageText page="eventos" section="layout" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "layout", "subtitle", locale, contentOverrides) || t.layout.subtitle)}
            </p>
          </div>

          <Card className="overflow-hidden border-2 border-primary/20 dark:border-primary/30 shadow-2xl">
            <CardContent className="p-0">
              <div className="relative aspect-[16/10] bg-white dark:bg-gray-900">
                {editor?.editMode ? (
                  <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:eventos:planta:0") || "/Sobre Hotel/Eventos/planta.png"} path="gallery:eventos:planta:0" aspectRatio="auto" className="object-contain p-4 md:p-8 w-full h-full" />
                ) : (
                  <Image
                    src={getGalleryImageByPath(galleryPhotos, "gallery:eventos:planta:0") || "/Sobre Hotel/Eventos/planta.png"}
                    alt="Planta do Espaço de Eventos - Hotel Sonata"
                    fill
                    className="object-contain p-4 md:p-8"
                    priority
                    quality={100}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1536px"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-6">
              {editor?.editMode ? <PageText page="eventos" section="layout" fieldKey="note" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "layout", "note", locale, contentOverrides) || t.layout.note)}
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {editor?.editMode ? <PageText page="eventos" section="layout" fieldKey="button" locale={locale} as="span" /> : (getPageContent("eventos", "layout", "button", locale, contentOverrides) || t.layout.button)}
            </Button>
          </div>
        </div>
      </section>

      {/* Tipos de Eventos */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? <PageText page="eventos" section="types" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "types", "title", locale, contentOverrides) || t.types.title)}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {editor?.editMode ? <PageText page="eventos" section="types" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "types", "subtitle", locale, contentOverrides) || t.types.subtitle)}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {eventTypes.map((event, index) => {
              const overrides = contentOverrides;
              const iconName = getPageContentIcon("eventTypes", `${event.key}.icon`, overrides, eventTypeDefaultIcons[event.key] ?? "Briefcase");
              const ResolvedIcon = getIcon(iconName) ?? event.icon;
              const eventIcon = editor?.editMode
                ? <EditableIcon page="eventos" section="eventTypes" fieldKey={`${event.key}.icon`} locale={locale} defaultIconName={eventTypeDefaultIcons[event.key] ?? "Briefcase"} defaultIcon={event.icon} iconClassName="h-8 w-8 text-primary" />
                : <ResolvedIcon className="h-8 w-8 text-primary" />;
              const titleContent = editor?.editMode ? <PageText page="eventos" section="types" fieldKey={`items.${event.key}.title`} locale={locale} as="span" /> : (getPageContent("eventos", "types", `items.${event.key}.title`, locale, contentOverrides) || event.title);
              const descContent = editor?.editMode ? <PageText page="eventos" section="types" fieldKey={`items.${event.key}.description`} locale={locale} as="span" /> : (getPageContent("eventos", "types", `items.${event.key}.description`, locale, contentOverrides) || event.description);
              const capacityContent = editor?.editMode ? <PageText page="eventos" section="types" fieldKey={`items.${event.key}.capacity`} locale={locale} as="span" /> : (getPageContent("eventos", "types", `items.${event.key}.capacity`, locale, contentOverrides) || event.capacity);
              return (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        {eventIcon}
                      </div>
                      <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {capacityContent}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{titleContent}</CardTitle>
                    <CardDescription className="text-base">
                      {descContent}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {event.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{editor?.editMode ? <PageText page="eventos" section="types" fieldKey={`items.${event.key}.features.${idx}`} locale={locale} as="span" /> : (getPageContent("eventos", "types", `items.${event.key}.features.${idx}`, locale, contentOverrides) || feature)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Formulário de Contato B2B */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {editor?.editMode ? <PageText page="eventos" section="form" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "form", "title", locale, contentOverrides) || t.form.title)}
              </h2>
              <p className="text-lg text-muted-foreground">
                {editor?.editMode ? <PageText page="eventos" section="form" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "form", "subtitle", locale, contentOverrides) || t.form.subtitle)}
              </p>
            </div>

            <Card className="shadow-xl">
              <CardContent className="pt-6">
                {mounted ? (
                  leadFormSuccess ? (
                    <div className="text-center py-8 px-4">
                      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Solicitação enviada com sucesso!
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Entraremos em contato em breve.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLeadFormSuccess(false)}
                      >
                        Enviar outra solicitação
                      </Button>
                    </div>
                  ) : (
                  <form
                    className="space-y-6"
                    suppressHydrationWarning
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (leadFormLoading) return;
                      if (!leadForm.name?.trim() || !leadForm.email?.trim()) {
                        toast.error("Preencha nome e email.");
                        return;
                      }
                      if (!leadForm.eventType) {
                        toast.error("Selecione o tipo de evento.");
                        return;
                      }
                      setLeadFormLoading(true);
                      try {
                        const payload = {
                          name: leadForm.name.trim(),
                          email: leadForm.email.trim(),
                          phone: leadForm.phone?.trim() || undefined,
                          company: leadForm.company?.trim() || undefined,
                          eventType: leadForm.eventType,
                          eventDate: leadForm.eventDate || null,
                          guests: leadForm.guests ? parseInt(leadForm.guests, 10) : undefined,
                          message: leadForm.message?.trim() || undefined,
                        };
                        const res = await fetch("/api/event-leads", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        });
                        if (!res.ok) {
                          const err = await res.json().catch(() => ({}));
                          toast.error(err?.error || "Erro ao enviar. Tente novamente.");
                          return;
                        }
                        toast.success("Solicitação enviada com sucesso! Entraremos em contato.");
                        setLeadForm(initialLeadFormState);
                        setLeadFormSuccess(true);
                      } catch {
                        toast.error("Erro ao enviar. Tente novamente.");
                      } finally {
                        setLeadFormLoading(false);
                      }
                    }}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nome">{t.form.fields.name}</Label>
                        <Input
                          id="nome"
                          required
                          placeholder={t.form.fields.name}
                          suppressHydrationWarning
                          autoComplete="name"
                          value={leadForm.name}
                          onChange={(e) => setLeadForm((p) => ({ ...p, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.form.fields.email}</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder={t.form.fields.email}
                          suppressHydrationWarning
                          autoComplete="email"
                          value={leadForm.email}
                          onChange={(e) => setLeadForm((p) => ({ ...p, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">{t.form.fields.phone}</Label>
                        <Input
                          id="telefone"
                          required
                          placeholder={t.form.fields.phone}
                          suppressHydrationWarning
                          autoComplete="tel"
                          value={leadForm.phone}
                          onChange={(e) => setLeadForm((p) => ({ ...p, phone: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="empresa">{t.form.fields.company}</Label>
                        <Input
                          id="empresa"
                          placeholder={t.form.fields.company}
                          suppressHydrationWarning
                          autoComplete="organization"
                          value={leadForm.company}
                          onChange={(e) => setLeadForm((p) => ({ ...p, company: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="tipo-evento">{t.form.fields.eventType}</Label>
                        <Select
                          required
                          value={leadForm.eventType || undefined}
                          onValueChange={(v) => setLeadForm((p) => ({ ...p, eventType: v }))}
                        >
                          <SelectTrigger id="tipo-evento" suppressHydrationWarning>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corporativo">{t.form.eventTypes.corporate}</SelectItem>
                            <SelectItem value="casamento">{t.form.eventTypes.wedding}</SelectItem>
                            <SelectItem value="outro">{t.form.eventTypes.other}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="data">{t.form.fields.date}</Label>
                        <Input
                          id="data"
                          type="date"
                          required
                          suppressHydrationWarning
                          value={leadForm.eventDate}
                          onChange={(e) => setLeadForm((p) => ({ ...p, eventDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="convidados">{t.form.fields.guests}</Label>
                      <Input
                        id="convidados"
                        type="number"
                        required
                        placeholder="Ex: 50"
                        min={1}
                        suppressHydrationWarning
                        value={leadForm.guests}
                        onChange={(e) => setLeadForm((p) => ({ ...p, guests: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensagem">{t.form.fields.message}</Label>
                      <Textarea
                        id="mensagem"
                        placeholder={t.form.fields.message}
                        rows={5}
                        suppressHydrationWarning
                        value={leadForm.message}
                        onChange={(e) => setLeadForm((p) => ({ ...p, message: e.target.value }))}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={leadFormLoading}>
                      {leadFormLoading ? "Enviando..." : t.form.button}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      {t.form.privacy}
                    </p>
                  </form>
                  )
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-10 w-full bg-muted rounded" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-10 w-full bg-muted rounded" />
                      </div>
                    </div>
                    <div className="h-10 w-full bg-muted rounded" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8">
            {editor?.editMode ? <PageText page="eventos" section="cta" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("eventos", "cta", "title", locale, contentOverrides) || t.cta.title)}
          </h2>
          <a
            href="https://wa.me/558540061616"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8"
          >
            {editor?.editMode ? <PageText page="eventos" section="cta" fieldKey="button" locale={locale} as="span" /> : (getPageContent("eventos", "cta", "button", locale, contentOverrides) || t.cta.button)}
          </a>
        </div>
      </section>
    </>
  );
}

export default function EventosPage() {
  return <EventosPageContent />;
}