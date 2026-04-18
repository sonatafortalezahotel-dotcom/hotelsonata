"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "@/lib/app-image";
import Link from "next/link";
import { 
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Tag,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HeroWithImage } from "@/components/HeroWithImage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { ImageGalleryGrid } from "@/components/ImageGalleryGrid";
import { Waves, UtensilsCrossed, Dumbbell, Sparkles } from "lucide-react";

interface Package {
  id: number;
  name: string;
  description?: string | null;
  imageUrl: string;
  price?: number | null;
  startDate: string;
  endDate: string;
  category?: string | null;
}

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useLanguage();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [heroImage, setHeroImage] = useState<string>("");

  const id = params?.id as string;

  useEffect(() => {
    async function fetchPackage() {
      if (!id) {
        setError("ID do pacote não fornecido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const packageId = parseInt(id);
        if (isNaN(packageId)) {
          setError("ID do pacote inválido");
          setLoading(false);
          return;
        }

        // No cliente, usar URL relativa; no servidor, usar baseUrl
        const isServer = typeof window === "undefined";
        const baseUrl = isServer 
          ? (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
          : "";
        
        console.log('Buscando pacote ID:', packageId, 'Locale:', locale);
        const response = await fetch(
          `${baseUrl}/api/packages/${packageId}?locale=${locale}`,
          { cache: "no-store" }
        );
        
        console.log('Resposta da API:', response.status, response.statusText);

        let responseData;
        try {
          responseData = await response.json();
        } catch (jsonError) {
          console.error("Erro ao parsear JSON da resposta:", jsonError);
          setError("Erro ao processar resposta do servidor");
          return;
        }

        if (!response.ok) {
          const errorMessage = responseData?.error || "Erro ao carregar pacote";
          if (response.status === 404) {
            setError("Pacote não encontrado");
          } else {
            setError(errorMessage);
          }
          console.error("Erro na API:", {
            status: response.status,
            statusText: response.statusText,
            error: responseData,
          });
          return;
        }

        if (!responseData || !responseData.id) {
          setError("Dados do pacote inválidos");
          console.error("Resposta inválida da API:", responseData);
          return;
        }

        setPkg(responseData);
        
        // Se for Day Use, buscar imagens do hotel para o hero e galeria
        if (responseData.category === "day-use" || responseData.name?.toLowerCase().includes("day use")) {
          // Buscar imagens do hotel (piscina, lazer, atividades)
          try {
            const galleryRes = await fetch('/api/gallery?active=true', {
              cache: 'no-store'
            });
            
            if (galleryRes.ok) {
              const galleryData = await galleryRes.json();
              const hotelImages = Array.isArray(galleryData) ? galleryData.filter((img: any) => {
                const page = (img.page || "").toLowerCase();
                const section = (img.section || "").toLowerCase();
                const category = (img.category || "").toLowerCase();
                
                // Buscar imagens de piscina, lazer, atividades, spa, academia
                return (
                  page === "lazer" || 
                  page === "hotel" ||
                  section.includes("piscina") ||
                  section.includes("lazer") ||
                  section.includes("atividades") ||
                  section.includes("spa") ||
                  section.includes("academia") ||
                  category === "piscina" ||
                  category === "lazer" ||
                  category === "atividades"
                );
              }) : [];
              
              setGalleryPhotos(hotelImages);
              
              // Usar primeira imagem de piscina ou lazer para o hero, senão usar imagem do hotel
              const heroPhoto = hotelImages.find((img: any) => 
                (img.section || "").toLowerCase().includes("piscina") ||
                (img.section || "").toLowerCase().includes("hero")
              ) || hotelImages[0];
              
              setHeroImage(heroPhoto?.imageUrl || responseData.imageUrl);
            }
          } catch (galleryError) {
            console.error("Erro ao buscar imagens da galeria:", galleryError);
            setHeroImage(responseData.imageUrl);
          }
        } else {
          setHeroImage(responseData.imageUrl);
        }
      } catch (err) {
        console.error("Erro ao buscar pacote:", err);
        setError("Erro ao carregar informações do pacote");
      } finally {
        setLoading(false);
      }
    }

    fetchPackage();
  }, [id, locale]);

  const labels = {
    pt: {
      back: "Voltar para Pacotes",
      notFound: "Pacote não encontrado",
      error: "Erro ao carregar pacote",
      details: "Detalhes",
      price: "Preço",
      validPeriod: "Período Válido",
      category: "Categoria",
      consult: "Consulte",
      reserve: "Reservar Agora",
      description: "Descrição",
      from: "De",
      to: "até",
      validUntil: "Válido até",
      inclusive: "Incluso no pacote",
      breakfastIncluded: "Café da manhã incluído",
      freeCancellation: "Cancelamento gratuito até 24h antes",
      bestRate: "Melhor tarifa garantida",
    },
    es: {
      back: "Volver a Paquetes",
      notFound: "Paquete no encontrado",
      error: "Error al cargar paquete",
      details: "Detalles",
      price: "Precio",
      validPeriod: "Período Válido",
      category: "Categoría",
      consult: "Consultar",
      reserve: "Reservar Ahora",
      description: "Descripción",
      from: "Desde",
      to: "hasta",
      validUntil: "Válido hasta",
      inclusive: "Incluido en el paquete",
      breakfastIncluded: "Desayuno incluido",
      freeCancellation: "Cancelación gratuita hasta 24h antes",
      bestRate: "Mejor tarifa garantizada",
    },
    en: {
      back: "Back to Packages",
      notFound: "Package not found",
      error: "Error loading package",
      details: "Details",
      price: "Price",
      validPeriod: "Valid Period",
      category: "Category",
      consult: "Consult",
      reserve: "Book Now",
      description: "Description",
      from: "From",
      to: "to",
      validUntil: "Valid until",
      inclusive: "Included in package",
      breakfastIncluded: "Breakfast included",
      freeCancellation: "Free cancellation up to 24h before",
      bestRate: "Best rate guaranteed",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;

  const formatPrice = (price?: number | null) => {
    if (!price) return null;
    return formatPriceCurrency(price, locale);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(
      locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            {locale === "en" ? "Loading package..." : locale === "es" ? "Cargando paquete..." : "Carregando pacote..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{t.notFound}</h1>
          <p className="text-muted-foreground mb-4">{error || t.error}</p>
          
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.back}
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              {locale === "en" ? "Try Again" : locale === "es" ? "Intentar Nuevamente" : "Tentar Novamente"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <HeroWithImage
        title={pkg.name}
        subtitle={pkg.description || ""}
        image={heroImage || pkg.imageUrl}
        imageAlt={pkg.name}
        height="medium"
        overlay="medium"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[180px] sm:max-w-none truncate">{pkg.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
          aria-label={t.back}
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
          {t.back}
        </Button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informações Principais */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-3xl mb-2">{pkg.name}</CardTitle>
                      {pkg.category && (
                        <Badge className="mt-2" variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {pkg.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Descrição */}
                  {pkg.description && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">{t.description}</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {pkg.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Galeria de Imagens do Hotel - Apenas para Day Use */}
              {(pkg.category === "day-use" || pkg.name?.toLowerCase().includes("day use")) && galleryPhotos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {locale === "en" 
                        ? "Hotel Facilities & Activities" 
                        : locale === "es" 
                        ? "Instalaciones y Actividades del Hotel"
                        : "Instalações e Atividades do Hotel"}
                    </CardTitle>
                    <CardDescription>
                      {locale === "en"
                        ? "Discover what our hotel has to offer during your day use"
                        : locale === "es"
                        ? "Descubra lo que nuestro hotel tiene para ofrecer durante su día de uso"
                        : "Descubra o que nosso hotel tem a oferecer durante seu day use"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageGalleryGrid
                      images={galleryPhotos.slice(0, 6).map((photo: any) => ({
                        src: photo.imageUrl,
                        alt: photo.title || photo.description || "Imagem do hotel",
                        title: photo.title || "Hotel Sonata"
                      }))}
                      columns={3}
                      aspectRatio="landscape"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Atividades Disponíveis - Apenas para Day Use */}
              {(pkg.category === "day-use" || pkg.name?.toLowerCase().includes("day use")) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {locale === "en"
                        ? "Available Activities"
                        : locale === "es"
                        ? "Actividades Disponibles"
                        : "Atividades Disponíveis"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <Waves className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">
                            {locale === "en" ? "Pool & Beach Access" : locale === "es" ? "Piscina y Playa" : "Piscina e Praia"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {locale === "en"
                              ? "Access to our pool with sea view and nearby beach"
                              : locale === "es"
                              ? "Acceso a nuestra piscina con vista al mar y playa cercana"
                              : "Acesso à nossa piscina com vista para o mar e praia próxima"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <UtensilsCrossed className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">
                            {locale === "en" ? "Restaurant & Bar" : locale === "es" ? "Restaurante y Bar" : "Restaurante e Bar"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {locale === "en"
                              ? "Enjoy our restaurant and bar services"
                              : locale === "es"
                              ? "Disfrute de nuestros servicios de restaurante y bar"
                              : "Aproveite nossos serviços de restaurante e bar"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <Dumbbell className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">
                            {locale === "en" ? "Fitness Center" : locale === "es" ? "Centro de Fitness" : "Academia"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {locale === "en"
                              ? "Access to our fully equipped gym"
                              : locale === "es"
                              ? "Acceso a nuestro gimnasio completamente equipado"
                              : "Acesso à nossa academia totalmente equipada"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                        <Sparkles className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">
                            {locale === "en" ? "Leisure Areas" : locale === "es" ? "Áreas de Ocio" : "Áreas de Lazer"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {locale === "en"
                              ? "Relax in our leisure and recreation areas"
                              : locale === "es"
                              ? "Relájese en nuestras áreas de ocio y recreación"
                              : "Relaxe em nossas áreas de lazer e recreação"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Reserva */}
            <div className="lg:col-span-1">
              <Card className="sticky top-28">
                <CardHeader>
                  <CardTitle>{t.reserve}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 border-b">
                    <p className="text-3xl font-bold text-primary">
                      {t.consult}
                    </p>
                  </div>

                  <Button asChild size="lg" className="w-full">
                    <Link href={`/reservas?package=${pkg.id}`}>
                      {t.reserve}
                    </Link>
                  </Button>

                  <div className="space-y-3 pt-4 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{t.breakfastIncluded}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{t.freeCancellation}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{t.bestRate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

