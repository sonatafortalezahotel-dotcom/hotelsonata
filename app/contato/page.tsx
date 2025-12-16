"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook } from "lucide-react";
import { HeroWithImage } from "@/components/HeroWithImage";
import { ImageGalleryGrid } from "@/components/ImageGalleryGrid";
import Image from "next/image";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEffect, useState } from "react";
import { getGallery } from "@/lib/hooks/useGallery";
import { usePhotoTracker } from "@/lib/hooks/usePhotoTracker";

// Função para buscar informações de contato
async function getContactInfo() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/settings`, {
      next: { revalidate: 3600 },
      cache: 'force-cache'
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    
    // Converter array de settings em objeto
    if (Array.isArray(data)) {
      const settingsMap: Record<string, string> = {};
      data.forEach((setting: any) => {
        settingsMap[setting.key] = setting.value;
      });
      
      return {
        email: settingsMap.email || 'contato@hotelsonata.com.br',
        phone: settingsMap.phone || '(85) 3456-7890',
        whatsapp: settingsMap.whatsapp || '(85) 99999-9999',
        address: settingsMap.address || 'Av. Beira Mar, 1000 - Praia de Iracema',
        city: settingsMap.city || 'Fortaleza',
        state: settingsMap.state || 'CE',
        zipCode: settingsMap.zipCode || '60165-121',
        instagram: settingsMap.instagram || '',
        facebook: settingsMap.facebook || '',
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar informações de contato:', error);
    return null;
  }
}

export default function ContatoPage() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "contact");
  const photoTracker = usePhotoTracker();
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [info, gallery] = await Promise.all([
        getContactInfo(),
        getGallery()
      ]);
      setContactInfo(info);
      setGalleryPhotos(gallery);
    }
    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section com Imagem */}
      <HeroWithImage
        title={t.hero.title}
        subtitle={t.hero.subtitle}
        image={photoTracker.getUnusedPhoto(galleryPhotos, "recepcao")?.imageUrl || galleryPhotos[0]?.imageUrl || ""}
        imageAlt="Recepção Hotel Sonata de Iracema"
        badge={t.hero.badge}
        height="large"
        overlay="medium"
      />

      {/* Galeria - Nossa Equipe Aguarda Você */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.team.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.team.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl group">
              {(() => {
                const imageUrl = photoTracker.getUnusedPhoto(galleryPhotos, "recepcao")?.imageUrl || galleryPhotos[0]?.imageUrl;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image
                    src={imageUrl}
                    alt={t.team.images.receptionAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-xl font-bold mb-1">{t.team.reception.title}</h3>
                <p className="text-white/90 text-sm">{t.team.reception.description}</p>
              </div>
            </div>

            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl group">
              {(() => {
                const imageUrl = photoTracker.getUnusedPhoto(galleryPhotos, ["gastronomia", "restaurante"])?.imageUrl || galleryPhotos[1]?.imageUrl;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image
                    src={imageUrl}
                    alt={t.team.images.gastronomyAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-xl font-bold mb-1">{t.team.gastronomy.title}</h3>
                <p className="text-white/90 text-sm">{t.team.gastronomy.description}</p>
              </div>
            </div>

            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl group">
              {(() => {
                const imageUrl = photoTracker.getUnusedPhoto(galleryPhotos, ["lazer", "piscina"])?.imageUrl || galleryPhotos[2]?.imageUrl;
                return imageUrl && imageUrl.trim() !== "" ? (
                  <Image
                    src={imageUrl}
                    alt={t.team.images.leisureAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="text-xl font-bold mb-1">{t.team.leisure.title}</h3>
                <p className="text-white/90 text-sm">{t.team.leisure.description}</p>
              </div>
            </div>
          </div>

          <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground mb-4">
              {t.team.message}
            </p>
            <p className="text-foreground font-semibold">
              {t.team.local}
            </p>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulário */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t.form.title}
              </h2>
              <Card className="shadow-xl">
                <CardContent className="pt-6">
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nome">{t.form.fields.name}</Label>
                        <Input id="nome" required placeholder={t.form.placeholders.name} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.form.fields.email}</Label>
                        <Input id="email" type="email" required placeholder={t.form.placeholders.email} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">{t.form.fields.phone}</Label>
                      <Input id="telefone" required placeholder={t.form.placeholders.phone} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assunto">{t.form.fields.subject}</Label>
                      <Input id="assunto" required placeholder={t.form.placeholders.subject} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensagem">{t.form.fields.message}</Label>
                      <Textarea 
                        id="mensagem" 
                        required
                        placeholder={t.form.placeholders.message}
                        rows={6}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      {t.form.button}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      {t.form.response}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  {t.info.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {t.info.subtitle}
                </p>
              </div>

              <div className="space-y-6">
                {/* Endereço */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{t.info.address}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {contactInfo?.address || 'Av. Beira Mar, 1000 - Praia de Iracema'}
                    </p>
                    <p className="text-muted-foreground">
                      {contactInfo?.city || 'Fortaleza'} - {contactInfo?.state || 'CE'}
                    </p>
                    <p className="text-muted-foreground">
                      CEP: {contactInfo?.zipCode || '60165-121'}
                    </p>
                  </CardContent>
                </Card>

                {/* Telefone */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{t.info.phone}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={`tel:${contactInfo?.phone?.replace(/\D/g, '') || '8534567890'}`}
                      className="text-primary hover:underline font-semibold"
                    >
                      {contactInfo?.phone || '(85) 3456-7890'}
                    </a>
                  </CardContent>
                </Card>

                {/* WhatsApp */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-600/10 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">{t.info.whatsapp}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={`https://wa.me/${contactInfo?.whatsapp?.replace(/\D/g, '') || '85999999999'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline font-semibold"
                    >
                      {contactInfo?.whatsapp || '(85) 99999-9999'}
                    </a>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{t.info.email}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href={`mailto:${contactInfo?.email || 'contato@hotelsonata.com.br'}`}
                      className="text-primary hover:underline font-semibold break-all"
                    >
                      {contactInfo?.email || 'contato@hotelsonata.com.br'}
                    </a>
                  </CardContent>
                </Card>

                {/* Horário */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{t.info.hours}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{t.info.reception}</p>
                    <p className="text-muted-foreground">{t.info.commercial}</p>
                  </CardContent>
                </Card>

                {/* Redes Sociais */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.info.social}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <a
                        href="https://instagram.com/hotelsonata"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg hover:scale-110 transition-transform"
                      >
                        <Instagram className="h-5 w-5 text-white" />
                      </a>
                      <a
                        href="https://facebook.com/hotelsonata"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-600 rounded-lg hover:scale-110 transition-transform"
                      >
                        <Facebook className="h-5 w-5 text-white" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria - Como Chegar */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t.location.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.location.subtitle}
            </p>
          </div>
          
          <ImageGalleryGrid
            images={photoTracker.getUnusedPhotos(galleryPhotos, ["recepcao", "piscina"], 4, {
              allowRelatedCategories: true,
              relatedCategories: ["geral"]
            })
              .map((photo, index) => {
                const keys = Object.keys(t.locationGallery.items) as Array<keyof typeof t.locationGallery.items>;
                const key = keys[index % keys.length];
                const fallbackItem = key ? t.locationGallery.items[key] : null;
                return {
                  src: photo.imageUrl,
                  alt: photo.title || fallbackItem?.alt || `Foto ${index + 1}`,
                  title: photo.title || fallbackItem?.title || `Foto ${index + 1}`
                };
              })
              .filter(img => img.src)}
            columns={2}
            aspectRatio="landscape"
          />

          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">{t.location.ponte}</h3>
                <p className="text-sm text-muted-foreground">{t.location.ponteDistance}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">{t.location.dragao}</h3>
                <p className="text-sm text-muted-foreground">{t.location.dragaoDistance}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">{t.location.airport}</h3>
                <p className="text-sm text-muted-foreground">{t.location.airportDistance}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="h-96 lg:h-[500px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.3204845782!2d-38.512!3d-3.717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDMnMDEuMiJTIDM4wrAzMCc0My4yIlc!5e0!3m2!1spt-BR!2sbr!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização Hotel Sonata de Iracema"
        />
      </section>
    </>
  );
}