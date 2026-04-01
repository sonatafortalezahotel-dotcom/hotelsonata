"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays, parse } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { 
  Bed, 
  Users, 
  Maximize2, 
  Waves, 
  Eye, 
  Wifi, 
  Wind, 
  Tv, 
  Coffee,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Calendar as CalendarIcon,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HeroWithImage } from "@/components/HeroWithImage";
import { AsymmetricGallery, FullWidthGallery } from "@/components/HorizontalScroll";
import { ReservationWidget } from "@/components/ReservationWidget";
import { Lightbox } from "@/components/Lightbox";
import { RoomHighlights } from "@/components/RoomHighlights";
import { RoomAmenities } from "@/components/RoomAmenities";
import { RoomRules } from "@/components/RoomRules";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { getPageTranslation } from "@/lib/translations/pages";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Room {
  id: number;
  code: string;
  name: string | null;
  description: string | null;
  shortDescription: string | null;
  size: number | null;
  maxGuests: number;
  hasSeaView: boolean;
  hasBalcony: boolean;
  amenities: string[] | null;
  translatedAmenities: string[] | null;
  basePrice: number;
  imageUrl: string | null;
  gallery: string[] | null;
}

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLanguage();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  const t = getPageTranslation(locale, "rooms");
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const code = params?.code as string;

  // Ler parâmetros da URL para pré-preencher o widget
  const checkInParam = searchParams.get("checkin");
  const checkOutParam = searchParams.get("checkout");
  const adultsParam = searchParams.get("adults");
  const childrenParam = searchParams.get("children");

  const initialCheckIn = checkInParam ? parse(checkInParam, "yyyy-MM-dd", new Date()) : null;
  const initialCheckOut = checkOutParam ? parse(checkOutParam, "yyyy-MM-dd", new Date()) : null;
  
  const validCheckIn = initialCheckIn && !isNaN(initialCheckIn.getTime()) ? initialCheckIn : null;
  const validCheckOut = initialCheckOut && !isNaN(initialCheckOut.getTime()) ? initialCheckOut : null;

  useEffect(() => {
    async function fetchRoom() {
      if (!code) {
        setError("Código do quarto não fornecido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setErrorDetails(null);
        
        // Decodificar o código da URL
        const decodedCode = decodeURIComponent(code);
        console.log("Buscando quarto com código:", decodedCode);
        
        // No cliente, usar URL relativa
        const isServer = typeof window === "undefined";
        const baseUrl = isServer 
          ? (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
          : "";
        const response = await fetch(
          `${baseUrl}/api/rooms/code/${encodeURIComponent(decodedCode)}?locale=${locale}`,
          { cache: "no-store" }
        );

        const responseData = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            setError("Quarto não encontrado");
            setErrorDetails(responseData);
            console.error("Quarto não encontrado. Detalhes:", responseData);
          } else {
            setError("Erro ao carregar quarto");
            setErrorDetails(responseData);
            console.error("Erro na API:", responseData);
          }
          return;
        }

        console.log("Quarto encontrado:", responseData);
        setRoom(responseData);
      } catch (err) {
        console.error("Erro ao buscar quarto:", err);
        setError("Erro ao carregar informações do quarto");
        setErrorDetails(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [code, locale]);

  const labels = {
    pt: {
      back: "Voltar para Quartos",
      notFound: "Quarto não encontrado",
      error: "Erro ao carregar quarto",
      amenities: "Amenidades",
      details: "Detalhes",
      size: "Tamanho",
      capacity: "Capacidade",
      m2: "m²",
      guests: "hóspedes",
      seaView: "Vista para o Mar",
      balcony: "Varanda",
      reserve: "Reservar Agora",
      seeMore: "Ver Mais Quartos",
      priceFrom: "A partir de",
      perNight: "por noite",
      breakfastIncluded: "Café da manhã incluído",
      bestRate: "Melhor tarifa garantida",
      gallery: "Galeria",
      description: "Descrição",
    },
    es: {
      back: "Volver a Habitaciones",
      notFound: "Habitación no encontrada",
      error: "Error al cargar habitación",
      amenities: "Amenidades",
      details: "Detalles",
      size: "Tamaño",
      capacity: "Capacidad",
      m2: "m²",
      guests: "huéspedes",
      seaView: "Vista al Mar",
      balcony: "Balcón",
      reserve: "Reservar Ahora",
      seeMore: "Ver Más Habitaciones",
      priceFrom: "Desde",
      perNight: "por noche",
      breakfastIncluded: "Desayuno incluido",
      bestRate: "Mejor tarifa garantizada",
      gallery: "Galería",
      description: "Descripción",
    },
    en: {
      back: "Back to Rooms",
      notFound: "Room not found",
      error: "Error loading room",
      amenities: "Amenities",
      details: "Details",
      size: "Size",
      capacity: "Capacity",
      m2: "m²",
      guests: "guests",
      seaView: "Ocean View",
      balcony: "Balcony",
      reserve: "Book Now",
      seeMore: "See More Rooms",
      priceFrom: "From",
      perNight: "per night",
      breakfastIncluded: "Breakfast included",
      bestRate: "Best rate guaranteed",
      gallery: "Gallery",
      description: "Description",
    },
  };

  const tPage = labels[locale as keyof typeof labels] || labels.pt;

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return formatPriceCurrency(price, locale);
  };

  const handleReservationComplete = (reservationId: number, confirmationNumber: string) => {
    // Redirecionar para checkout (pagamento)
    router.push(`/checkout?reservationId=${reservationId}`);
  };

  const handleImageClick = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            {locale === "en" ? "Loading room..." : locale === "es" ? "Cargando habitación..." : "Carregando quarto..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{tPage.notFound}</h1>
          <p className="text-muted-foreground mb-4">{error || tPage.error}</p>
          
          {errorDetails && (
            <div className="bg-muted p-4 rounded-lg mb-6 text-left w-full">
              <p className="text-sm font-semibold mb-2">Detalhes do erro:</p>
              <p className="text-xs text-muted-foreground mb-2">
                Código buscado: <code className="bg-background px-2 py-1 rounded">{code}</code>
              </p>
              {errorDetails.availableCodes && (
                <div className="mt-3">
                  <p className="text-xs font-semibold mb-2">Códigos disponíveis no banco:</p>
                  <div className="flex flex-wrap gap-2">
                    {errorDetails.availableCodes.map((c: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/quartos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {tPage.back}
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const amenities = room.translatedAmenities || room.amenities || [];

  // Normalizar galeria: pode vir como string[] ou como array de objetos { url?, imageUrl? } do JSONB
  const galleryImages = (() => {
    const raw = room.gallery;
    if (!raw || !Array.isArray(raw)) return [];
    const urls = raw
      .map((item) =>
        typeof item === "string" ? item : (item && typeof item === "object" ? (item as { url?: string; imageUrl?: string }).url ?? (item as { url?: string; imageUrl?: string }).imageUrl : null)
      )
      .filter((url): url is string => typeof url === "string" && url.trim() !== "");
    return urls;
  })();

  // Incluir imagem principal na galeria se houver poucas fotos (para sempre mostrar algo)
  const galleryWithHero =
    galleryImages.length > 0
      ? galleryImages
      : room.imageUrl
        ? [room.imageUrl]
        : [];

  return (
    <>
      {/* Hero Section */}
      <HeroWithImage
        title={room.name || "Quarto"}
        subtitle={room.shortDescription || room.description || ""}
        image={room.imageUrl || null}
        imageAlt={room.name || "Quarto Hotel Sonata"}
        height="large"
        overlay="medium"
        imageQuality={100}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
          aria-label={tPage.back}
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
          {tPage.back}
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
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-3xl mb-2">{room.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {room.hasSeaView && (
                          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Waves className="h-3 w-3 mr-1" />
                            {tPage.seaView}
                          </Badge>
                        )}
                        {room.hasBalcony && (
                          <Badge variant="secondary">
                            <Eye className="h-3 w-3 mr-1" />
                            {tPage.balcony}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {room.basePrice && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{tPage.priceFrom}</p>
                        <p className="text-3xl font-bold text-primary">
                          {formatPrice(room.basePrice)}
                        </p>
                        <p className="text-sm text-muted-foreground">{tPage.perNight}</p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Descrição */}
                  {room.description && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">{tPage.description}</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {room.description}
                      </p>
                    </div>
                  )}

                  <Separator />

                  {/* Detalhes */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">{tPage.details}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {room.size && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Maximize2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{tPage.size}</p>
                            <p className="font-medium">{room.size} {tPage.m2}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{tPage.capacity}</p>
                          <p className="font-medium">
                            {room.maxGuests} {tPage.guests}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Amenidades */}
                  {amenities.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">{tPage.amenities}</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Sidebar - Widget de Reserva */}
            <div className="lg:col-span-1">
              {room && (
                <ReservationWidget
                  roomId={room.id}
                  roomCode={room.code}
                  basePrice={room.basePrice || 0}
                  maxGuests={room.maxGuests}
                  onReservationComplete={handleReservationComplete}
                  initialCheckIn={validCheckIn}
                  initialCheckOut={validCheckOut}
                  initialAdults={adultsParam || "2"}
                  initialChildren={childrenParam || "0"}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Galeria: primeiras fotos (1 a 4) – clicável para tela cheia */}
      {galleryWithHero.length >= 1 && (
        <FullWidthGallery
          images={galleryWithHero.slice(0, 4)}
          interval={4000}
          height="h-[450px] md:h-[600px] lg:h-[75vh] min-h-[500px]"
          mobileHeight="h-[55vh]"
          imageQuality={100}
          onImageClick={(index) => handleImageClick(galleryWithHero, index)}
        />
      )}

      {/* Galeria 2: Assimétrica (próximas 5 fotos) – clicável para tela cheia */}
      {galleryWithHero.length >= 9 && (
        <AsymmetricGallery
          images={galleryWithHero.slice(4, 9)}
          interval={5000}
          desktopHeight="h-[85vh] min-h-[750px]"
          mobileHeight="h-[55vh]"
          imageQuality={100}
          onImageClick={(index) => handleImageClick(galleryWithHero, 4 + index)}
        />
      )}

      {/* Se tiver entre 4 e 8 fotos, segunda linha horizontal – clicável para tela cheia */}
      {galleryWithHero.length >= 4 && galleryWithHero.length < 9 && (
        <FullWidthGallery
          images={galleryWithHero.slice(4)}
          interval={4500}
          height="h-[450px] md:h-[600px] lg:h-[75vh] min-h-[500px]"
          mobileHeight="h-[55vh]"
          imageQuality={100}
          onImageClick={(index) => handleImageClick(galleryWithHero, 4 + index)}
        />
      )}

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={room?.name || undefined}
      />
    </>
  );
}

