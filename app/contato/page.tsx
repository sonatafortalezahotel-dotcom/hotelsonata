"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, CheckCircle2 } from "lucide-react";
import { HeroWithImage } from "@/components/HeroWithImage";
import { FullWidthGallery, AsymmetricGallery } from "@/components/HorizontalScroll";
import Image from "next/image";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContent } from "@/lib/utils/pageContent";
import { PageText, PageImage } from "@/components/PageEditor";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useGallery } from "@/lib/hooks/useGallery";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";

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
        phone: settingsMap.phone || '(85) 4006-1600',
        whatsapp: settingsMap.whatsapp || '(85) 4006-1616',
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

function ContatoPageContent() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "contact");
  const editor = useEditor();
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const { photos: galleryPhotos } = useGallery();

  // Buscar todas as imagens usando useMemo
  const contatoImages = useMemo(() => {
    if (!galleryPhotos || galleryPhotos.length === 0) {
      return {
        hero: null,
        galeriaEquipe: [],
        galeriaLocalizacao: [],
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
          return page === "contato" && sec === section.toLowerCase().trim();
        })
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      if (typeof limit === "number") {
        return filtered.slice(0, limit);
      }
      return filtered;
    };

    const heroPhoto = getPhotosBySection("hero-contato", 1)[0] || null;
    const galeriaEquipePhotos = getPhotosBySection("galeria-equipe", 3);
    const galeriaLocalizacao = getPhotosBySection("galeria-localizacao", 4);

    return {
      hero: heroPhoto?.imageUrl || null,
      galeriaEquipe: galeriaEquipePhotos.map((p: any) => p.imageUrl),
      galeriaLocalizacao,
    };
  }, [galleryPhotos]);

  useEffect(() => {
    async function fetchContactData() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          // Converter array de settings em objeto
          if (Array.isArray(data)) {
            const settingsMap = data.reduce((acc: any, item: any) => {
              acc[item.key] = item.value;
              return acc;
            }, {});
            
            setContactInfo({
              address: settingsMap.address || '',
              phone: settingsMap.phone || '',
              whatsapp: settingsMap.whatsapp || '',
              email: settingsMap.email || '',
              instagram: settingsMap.instagram || '',
              facebook: settingsMap.facebook || '',
            });
          }
        }
      } catch (error) {
        console.error('Erro ao buscar informações de contato:', error);
      }
    }
    fetchContactData();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          subject: formData.subject || undefined,
          message: formData.message || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data?.error || "Erro ao enviar mensagem. Tente novamente.");
        return;
      }
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em até 24 horas.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setFormSuccess(true);
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section com Imagem */}
      <HeroWithImage
        title={editor?.editMode ? <PageText page="contato" section="hero" fieldKey="title" locale={locale} as="span" className="block" /> : (getPageContent("contato", "hero", "title", locale, editor?.overrides ?? {}) || t.hero.title)}
        subtitle={editor?.editMode ? <PageText page="contato" section="hero" fieldKey="subtitle" locale={locale} as="span" className="block" /> : (getPageContent("contato", "hero", "subtitle", locale, editor?.overrides ?? {}) || t.hero.subtitle)}
        image={getGalleryImageByPath(galleryPhotos, "gallery:contato:hero-contato:0") || contatoImages.hero || galleryPhotos[0]?.imageUrl || null}
        imageNode={editor?.editMode ? <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:contato:hero-contato:0") || contatoImages.hero || galleryPhotos[0]?.imageUrl || ""} alt="Hero" path="gallery:contato:hero-contato:0" className="absolute inset-0 w-full h-full" /> : undefined}
        imageAlt="Recepção Hotel Sonata de Iracema"
        badge={
          editor?.editMode ? (
            <PageText page="contato" section="hero" fieldKey="badge" locale={locale} as="span" />
          ) : (
            getPageContent("contato", "hero", "badge", locale, editor?.overrides ?? {}) || t.hero.badge
          )
        }
        height="medium"
        overlay="medium"
      />

      {/* Nossa Equipe - GALERIA HORIZONTAL 1x3 FULLWIDTH */}
      <section className="relative w-full bg-gradient-to-br from-primary/5 to-primary/10">
        {/* Título antes da galeria */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24 pb-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? (
                <PageText page="contato" section="team" fieldKey="title" locale={locale} as="span" />
              ) : (
                getPageContent("contato", "team", "title", locale, editor?.overrides ?? {}) || t.team.title
              )}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? (
                <PageText page="contato" section="team" fieldKey="subtitle" locale={locale} as="span" />
              ) : (
                getPageContent("contato", "team", "subtitle", locale, editor?.overrides ?? {}) || t.team.subtitle
              )}
            </p>
          </div>
        </div>

        {/* Galeria Horizontal 1x3 Fullwidth com texto sobreposto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 h-[400px] md:h-[500px] lg:h-[600px]">
          {/* Recepção */}
          <div className="relative overflow-hidden group">
            {editor?.editMode ? (
              <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:contato:galeria-equipe:0") || contatoImages.galeriaEquipe[0] || galleryPhotos[0]?.imageUrl || ""} path="gallery:contato:galeria-equipe:0" className="w-full h-full object-cover" />
            ) : (() => {
              const imageUrl = getGalleryImageByPath(galleryPhotos, "gallery:contato:galeria-equipe:0") || contatoImages.galeriaEquipe[0] || galleryPhotos[0]?.imageUrl;
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
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent ${editor?.editMode ? "pointer-events-none" : ""}`} />
            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-2xl">
                {editor?.editMode ? <PageText page="contato" section="team" fieldKey="reception.title" locale={locale} as="span" /> : (getPageContent("contato", "team", "reception.title", locale, editor?.overrides ?? {}) || t.team.reception.title)}
              </h3>
              <p className="text-white/90 text-sm md:text-base drop-shadow-lg">
                {editor?.editMode ? <PageText page="contato" section="team" fieldKey="reception.description" locale={locale} as="span" /> : (getPageContent("contato", "team", "reception.description", locale, editor?.overrides ?? {}) || t.team.reception.description)}
              </p>
            </div>
          </div>

          {/* Gastronomia */}
          <div className="relative overflow-hidden group">
            {editor?.editMode ? (
              <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:contato:galeria-equipe:1") || contatoImages.galeriaEquipe[1] || galleryPhotos[1]?.imageUrl || ""} path="gallery:contato:galeria-equipe:1" className="w-full h-full object-cover" />
            ) : (() => {
              const imageUrl = getGalleryImageByPath(galleryPhotos, "gallery:contato:galeria-equipe:1") || contatoImages.galeriaEquipe[1] || galleryPhotos[1]?.imageUrl;
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
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent ${editor?.editMode ? "pointer-events-none" : ""}`} />
            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-2xl">
                {editor?.editMode ? <PageText page="contato" section="team" fieldKey="gastronomy.title" locale={locale} as="span" /> : (getPageContent("contato", "team", "gastronomy.title", locale, editor?.overrides ?? {}) || t.team.gastronomy.title)}
              </h3>
              <p className="text-white/90 text-sm md:text-base drop-shadow-lg">
                {editor?.editMode ? <PageText page="contato" section="team" fieldKey="gastronomy.description" locale={locale} as="span" /> : (getPageContent("contato", "team", "gastronomy.description", locale, editor?.overrides ?? {}) || t.team.gastronomy.description)}
              </p>
            </div>
          </div>

          {/* Lazer */}
          <div className="relative overflow-hidden group">
            {editor?.editMode ? (
              <PageImage src={getGalleryImageByPath(galleryPhotos, "gallery:contato:galeria-equipe:2") || contatoImages.galeriaEquipe[2] || galleryPhotos[2]?.imageUrl || ""} path="gallery:contato:galeria-equipe:2" className="w-full h-full object-cover" />
            ) : (() => {
              const imageUrl = getGalleryImageByPath(galleryPhotos, "gallery:contato:galeria-equipe:2") || contatoImages.galeriaEquipe[2] || galleryPhotos[2]?.imageUrl;
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
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent ${editor?.editMode ? "pointer-events-none" : ""}`} />
            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-2xl">
                {editor?.editMode ? <PageText page="contato" section="team" fieldKey="leisure.title" locale={locale} as="span" /> : (getPageContent("contato", "team", "leisure.title", locale, editor?.overrides ?? {}) || t.team.leisure.title)}
              </h3>
              <p className="text-white/90 text-sm md:text-base drop-shadow-lg">
                {editor?.editMode ? <PageText page="contato" section="team" fieldKey="leisure.description" locale={locale} as="span" /> : (getPageContent("contato", "team", "leisure.description", locale, editor?.overrides ?? {}) || t.team.leisure.description)}
              </p>
            </div>
          </div>
        </div>

        {/* Mensagem final */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pb-24">
          <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground mb-4">
              {editor?.editMode ? <PageText page="contato" section="team" fieldKey="message" locale={locale} as="span" /> : (getPageContent("contato", "team", "message", locale, editor?.overrides ?? {}) || t.team.message)}
            </p>
            <p className="text-foreground font-semibold">
              {editor?.editMode ? <PageText page="contato" section="team" fieldKey="local" locale={locale} as="span" /> : (getPageContent("contato", "team", "local", locale, editor?.overrides ?? {}) || t.team.local)}
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
                {editor?.editMode ? <PageText page="contato" section="form" fieldKey="title" locale={locale} as="span" /> : (getPageContent("contato", "form", "title", locale, editor?.overrides ?? {}) || t.form.title)}
              </h2>
              <Card className="shadow-xl">
                <CardContent className="pt-6">
                  {formSuccess ? (
                    <div className="text-center py-8 px-4">
                      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Mensagem enviada com sucesso!
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Entraremos em contato em até 24 horas.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormSuccess(false)}
                      >
                        Enviar outra mensagem
                      </Button>
                    </div>
                  ) : (
                  <form className="space-y-6" onSubmit={handleContactSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nome">{t.form.fields.name}</Label>
                        <Input
                          id="nome"
                          required
                          placeholder={t.form.placeholders.name}
                          value={formData.name}
                          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.form.fields.email}</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder={t.form.placeholders.email}
                          value={formData.email}
                          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">{t.form.fields.phone}</Label>
                      <Input
                        id="telefone"
                        required
                        placeholder={t.form.placeholders.phone}
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assunto">{t.form.fields.subject}</Label>
                      <Input
                        id="assunto"
                        required
                        placeholder={t.form.placeholders.subject}
                        value={formData.subject}
                        onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensagem">{t.form.fields.message}</Label>
                      <Textarea
                        id="mensagem"
                        required
                        placeholder={t.form.placeholders.message}
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={formLoading}>
                      {formLoading ? "Enviando..." : t.form.button}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      {t.form.response}
                    </p>
                  </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  {editor?.editMode ? <PageText page="contato" section="info" fieldKey="title" locale={locale} as="span" /> : (getPageContent("contato", "info", "title", locale, editor?.overrides ?? {}) || t.info.title)}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {editor?.editMode ? <PageText page="contato" section="info" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent("contato", "info", "subtitle", locale, editor?.overrides ?? {}) || t.info.subtitle)}
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
                      href={`tel:${contactInfo?.phone?.replace(/\D/g, '') || '8540061600'}`}
                      className="text-primary hover:underline font-semibold"
                    >
                      {contactInfo?.phone || '(85) 4006-1600'}
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
                      href={`https://wa.me/${contactInfo?.whatsapp?.replace(/\D/g, '') || '558540061616'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline font-semibold"
                    >
                      {contactInfo?.whatsapp || '(85) 4006-1616'}
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

      {/* Como Chegar - Localização Privilegiada (título, subtítulo, imagens e cards editáveis) */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {editor?.editMode ? (
                <PageText page="contato" section="location" fieldKey="title" locale={locale} as="span" />
              ) : (
                getPageContent("contato", "location", "title", locale, editor?.overrides ?? {}) || t.location.title
              )}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? (
                <PageText page="contato" section="location" fieldKey="subtitle" locale={locale} as="span" />
              ) : (
                getPageContent("contato", "location", "subtitle", locale, editor?.overrides ?? {}) || t.location.subtitle
              )}
            </p>
          </div>
        </div>

        {/* Galeria Assimétrica se tiver 5+ fotos, senão 1x4 */}
        {editor?.editMode ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 container mx-auto px-4 sm:px-6 lg:px-8">
            {Array.from({ length: 4 }, (_, i) => contatoImages.galeriaLocalizacao[i]).map((photo, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                <PageImage src={(getGalleryImageByPath(galleryPhotos, `gallery:contato:galeria-localizacao:${i}`) || photo?.imageUrl) ?? ""} path={`gallery:contato:galeria-localizacao:${i}`} aspectRatio="auto" className="w-full h-full" />
              </div>
            ))}
          </div>
        ) : contatoImages.galeriaLocalizacao.length >= 5 ? (
          <AsymmetricGallery
            images={contatoImages.galeriaLocalizacao.map((photo: any) => photo.imageUrl).filter((img: string) => img)}
            interval={4500}
          />
        ) : contatoImages.galeriaLocalizacao.length >= 4 ? (
          <FullWidthGallery
            images={contatoImages.galeriaLocalizacao.map((photo: any) => photo.imageUrl).filter((img: string) => img)}
            interval={4000}
            height="h-[350px] md:h-[450px] lg:h-[550px]"
          />
        ) : null}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">
                  {editor?.editMode ? (
                    <PageText page="contato" section="location" fieldKey="ponte" locale={locale} as="span" />
                  ) : (
                    getPageContent("contato", "location", "ponte", locale, editor?.overrides ?? {}) || t.location.ponte
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {editor?.editMode ? (
                    <PageText page="contato" section="location" fieldKey="ponteDistance" locale={locale} as="span" />
                  ) : (
                    getPageContent("contato", "location", "ponteDistance", locale, editor?.overrides ?? {}) || t.location.ponteDistance
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">
                  {editor?.editMode ? (
                    <PageText page="contato" section="location" fieldKey="dragao" locale={locale} as="span" />
                  ) : (
                    getPageContent("contato", "location", "dragao", locale, editor?.overrides ?? {}) || t.location.dragao
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {editor?.editMode ? (
                    <PageText page="contato" section="location" fieldKey="dragaoDistance" locale={locale} as="span" />
                  ) : (
                    getPageContent("contato", "location", "dragaoDistance", locale, editor?.overrides ?? {}) || t.location.dragaoDistance
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-bold mb-2">
                  {editor?.editMode ? (
                    <PageText page="contato" section="location" fieldKey="airport" locale={locale} as="span" />
                  ) : (
                    getPageContent("contato", "location", "airport", locale, editor?.overrides ?? {}) || t.location.airport
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {editor?.editMode ? (
                    <PageText page="contato" section="location" fieldKey="airportDistance" locale={locale} as="span" />
                  ) : (
                    getPageContent("contato", "location", "airportDistance", locale, editor?.overrides ?? {}) || t.location.airportDistance
                  )}
                </p>
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

export default function ContatoPage() {
  return <ContatoPageContent />;
}