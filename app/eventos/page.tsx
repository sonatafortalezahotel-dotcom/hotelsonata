"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Users, Heart, PartyPopper, Check, Building2, Lightbulb, Wind, ParkingCircle, Coffee, ChefHat } from "lucide-react";
import { RoomCapacityTable } from "@/components/RoomCapacityTable";
import { HeroWithImage } from "@/components/HeroWithImage";
import { MasonrySwap } from "@/components/HorizontalScroll";
import Image from "next/image";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { getEvents } from "@/lib/hooks/useEvents";
import { getGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageTitle } from "@/lib/utils";

export default function EventosPage() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "events");
  const [events, setEvents] = useState<any[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

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

    // Hero preferencialmente vem da galeria corporativa, depois de outras seções
    const heroFromGallery =
      corporativoGallery[0]?.imageUrl ||
      casamentoGallery[0]?.imageUrl ||
      nupciasGallery[0]?.imageUrl ||
      null;

    // Galeria principal: combinar imagens da galeria + imagens dos eventos
    const galleryImages: Array<{ imageUrl: string; title?: string | null; category?: string | null }> = [];

    const pushImage = (url: any) => {
      if (!url || typeof url !== "string" || !url.trim()) return;
      if (galleryImages.some((p) => p.imageUrl === url)) return;
      galleryImages.push({ imageUrl: url });
    };

    [...corporativoGallery, ...casamentoGallery, ...nupciasGallery].forEach(
      (p: any) => pushImage(p.imageUrl),
    );

    events.forEach((ev: any) => pushImage(ev.imageUrl));

    return {
      hero: heroFromGallery,
      corporativo: corporativoGallery[0]?.imageUrl || null,
      gallery: galleryImages,
    };
  }, [events, galleryPhotos]);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      setLoading(true);
      const [eventsData, galleryData] = await Promise.all([
        getEvents(true, locale),
        getGallery()
      ]);
      setEvents(eventsData);
      setGalleryPhotos(galleryData);
      setLoading(false);
    }
    fetchData();
  }, [locale]);

  const facilities = [
    {
      icon: Lightbulb,
      title: t.facilities.items.naturalLight.title,
      description: t.facilities.items.naturalLight.description
    },
    {
      icon: Wind,
      title: t.facilities.items.ac.title,
      description: t.facilities.items.ac.description
    },
    {
      icon: Building2,
      title: t.facilities.items.exclusive.title,
      description: t.facilities.items.exclusive.description
    },
    {
      icon: ParkingCircle,
      title: t.facilities.items.parking.title,
      description: t.facilities.items.parking.description
    },
    {
      icon: Coffee,
      title: t.facilities.items.foyer.title,
      description: t.facilities.items.foyer.description
    },
    {
      icon: ChefHat,
      title: t.facilities.items.gastronomy.title,
      description: t.facilities.items.gastronomy.description
    }
  ];

  const eventTypes = [
    {
      icon: Briefcase,
      title: t.types.items.corporate.title,
      description: t.types.items.corporate.description,
      capacity: t.types.items.corporate.capacity,
      features: t.types.items.corporate.features
    },
    {
      icon: Heart,
      title: t.types.items.wedding.title,
      description: t.types.items.wedding.description,
      capacity: t.types.items.wedding.capacity,
      features: t.types.items.wedding.features
    },
    {
      icon: Users,
      title: t.types.items.anniversary.title,
      description: t.types.items.anniversary.description,
      capacity: t.types.items.anniversary.capacity,
      features: t.types.items.anniversary.features
    },
    {
      icon: PartyPopper,
      title: t.types.items.social.title,
      description: t.types.items.social.description,
      capacity: t.types.items.social.capacity,
      features: t.types.items.social.features
    }
  ];

  return (
    <>
      {/* Hero Section com Imagem */}
      <HeroWithImage
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={mounted ? (events[0]?.imageUrl || eventosImages.hero || "/Sobre Hotel/Eventos/eventos-1.jpg") : undefined}
        imageAlt="Espaço para Eventos - Hotel Sonata"
        icon={<Briefcase className="h-16 w-16" />}
        badge={t.hero.badge}
        height="large"
        overlay="dark"
      />

      {/* Galeria Visual de Espaços - MASONRY ANIMADO */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="mb-4 bg-purple-600 hover:bg-purple-700 text-base px-4 py-2">
              <Building2 className="h-4 w-4 mr-2 inline" />
              {t.gallery.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.gallery.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.gallery.subtitle}
            </p>
          </div>
          
          <MasonrySwap
            images={eventosImages.gallery
              .map(photo => photo.imageUrl)
              .filter(img => img && typeof img === 'string' && img.trim() !== '')}
            interval={5000}
          />
        </div>
      </section>

      {/* Facilidades */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.facilities.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.facilities.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className="mx-auto w-16 h-16 bg-purple-600/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{facility.title}</h3>
                    <p className="text-muted-foreground text-sm">{facility.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">{t.access.title}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {t.access.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">{t.included.title}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {t.included.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
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
            <Badge className="mb-4 bg-purple-600 hover:bg-purple-700 text-base px-4 py-2">
              {t.capacity.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.capacity.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.capacity.subtitle}
            </p>
          </div>

          <RoomCapacityTable />

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-6">
              {t.capacity.note}
            </p>
          </div>
        </div>
      </section>

      {/* Galeria - Tipos de Configuração */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.configurations.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.configurations.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Auditório */}
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl group">
              {(() => {
                const eventPhoto = events.find(e => e.type === "corporativo");
                const imageUrl = eventPhoto?.imageUrl || eventosImages.corporativo;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image
                    src={imageUrl}
                    alt="Setup Auditório"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20" />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{t.configurations.items.auditorium.title}</h3>
                <p className="text-white/90">{t.configurations.items.auditorium.description}</p>
              </div>
            </div>

            {/* Escolar */}
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl group">
              {(() => {
                const eventPhoto = events.find(e => e.type === "corporativo" || e.type === "social");
                const imageUrl = eventPhoto?.imageUrl || eventosImages.corporativo;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image
                    src={imageUrl}
                    alt="Setup Escolar"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20" />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{t.configurations.items.school.title}</h3>
                <p className="text-white/90">{t.configurations.items.school.description}</p>
              </div>
            </div>

            {/* Banquete */}
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl group">
              {(() => {
                const eventPhoto = events.find(e => e.type === "social" || e.type === "casamento");
                const imageUrl = eventPhoto?.imageUrl || eventosImages.corporativo;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image
                    src={imageUrl}
                    alt="Setup Banquete"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20" />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{t.configurations.items.banquet.title}</h3>
                <p className="text-white/90">{t.configurations.items.banquet.description}</p>
              </div>
            </div>

            {/* Coquetel */}
            <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl group">
              {(() => {
                const eventPhoto = events.find(e => e.type === "social" || e.type === "corporativo");
                const imageUrl = eventPhoto?.imageUrl || eventosImages.corporativo;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image
                    src={imageUrl}
                    alt="Setup Coquetel"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20" />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{t.configurations.items.cocktail.title}</h3>
                <p className="text-white/90">{t.configurations.items.cocktail.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planta do Espaço */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/10 dark:to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-600 hover:bg-purple-700 text-base px-4 py-2">
              {t.layout.badge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.layout.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.layout.subtitle}
            </p>
          </div>

          <Card className="overflow-hidden border-2 border-purple-200 dark:border-purple-900 shadow-2xl">
            <CardContent className="p-0">
              <div className="relative aspect-[16/10] bg-white dark:bg-gray-900">
                <Image
                  src="/Sobre Hotel/Eventos/planta.png"
                  alt="Planta do Espaço de Eventos - Hotel Sonata"
                  fill
                  className="object-contain p-4 md:p-8"
                  priority
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-6">
              {t.layout.note}
            </p>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              {t.layout.button}
            </Button>
          </div>
        </div>
      </section>

      {/* Tipos de Eventos */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.types.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.types.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {eventTypes.map((event, index) => {
              const Icon = event.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-purple-600/10 rounded-lg">
                        <Icon className="h-8 w-8 text-purple-600" />
                      </div>
                      <Badge className="bg-purple-600 hover:bg-purple-700">
                        {event.capacity}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{event.title}</CardTitle>
                    <CardDescription className="text-base">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {event.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
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
                {t.form.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t.form.subtitle}
              </p>
            </div>

            <Card className="shadow-xl">
              <CardContent className="pt-6">
                {mounted ? (
                  <form className="space-y-6" suppressHydrationWarning>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nome">{t.form.fields.name}</Label>
                        <Input 
                          id="nome" 
                          required 
                          placeholder={t.form.fields.name}
                          suppressHydrationWarning
                          autoComplete="name"
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
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="empresa">{t.form.fields.company}</Label>
                        <Input 
                          id="empresa" 
                          placeholder={t.form.fields.company}
                          suppressHydrationWarning
                          autoComplete="organization"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="tipo-evento">{t.form.fields.eventType}</Label>
                        <Select required>
                          <SelectTrigger id="tipo-evento" suppressHydrationWarning>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corporativo">{t.form.eventTypes.corporate}</SelectItem>
                            <SelectItem value="casamento">{t.form.eventTypes.wedding}</SelectItem>
                            <SelectItem value="boda">{t.form.eventTypes.anniversary}</SelectItem>
                            <SelectItem value="social">{t.form.eventTypes.social}</SelectItem>
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
                        min="1"
                        suppressHydrationWarning
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensagem">{t.form.fields.message}</Label>
                      <Textarea 
                        id="mensagem" 
                        placeholder={t.form.fields.message}
                        rows={5}
                        suppressHydrationWarning
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      {t.form.button}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      {t.form.privacy}
                    </p>
                  </form>
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
      <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-600/90 to-purple-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+5585999999999"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white text-purple-700 hover:bg-white/90 h-11 px-8"
            >
              {t.cta.call}
            </a>
            <a 
              href="https://wa.me/5585999999999"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-2 border-white text-white hover:bg-white/10 h-11 px-8"
            >
              {t.cta.whatsapp}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}