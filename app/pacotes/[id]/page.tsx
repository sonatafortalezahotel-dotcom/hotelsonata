"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
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
import { useLanguage } from "@/lib/context/LanguageContext";

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
  
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const response = await fetch(
          `${baseUrl}/api/packages/${packageId}?locale=${locale}`,
          { cache: "no-store" }
        );

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
    return new Intl.NumberFormat(
      locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US",
      {
        style: "currency",
        currency: locale === "pt" ? "BRL" : locale === "es" ? "EUR" : "USD",
      }
    ).format(price / 100);
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
        image={pkg.imageUrl}
        imageAlt={pkg.name}
        height="large"
        overlay="medium"
      />

      {/* Botão Voltar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
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
                    {pkg.price && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{t.price}</p>
                        <p className="text-3xl font-bold text-primary">
                          {formatPrice(pkg.price)}
                        </p>
                      </div>
                    )}
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

                  <Separator />

                  {/* Período de Validade */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">{t.validPeriod}</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.from}</p>
                        <p className="font-medium">{formatDate(pkg.startDate)}</p>
                      </div>
                      <div className="mx-4 text-muted-foreground">→</div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t.to}</p>
                        <p className="font-medium">{formatDate(pkg.endDate)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Reserva */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{t.reserve}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pkg.price ? (
                    <div className="text-center py-4 border-b">
                      <p className="text-sm text-muted-foreground mb-1">{t.price}</p>
                      <p className="text-3xl font-bold text-primary">
                        {formatPrice(pkg.price)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4 border-b">
                      <p className="text-3xl font-bold text-primary">
                        {t.consult}
                      </p>
                    </div>
                  )}

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

