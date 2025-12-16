"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
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
import { ImageGalleryGrid } from "@/components/ImageGalleryGrid";
import { PhotoStory } from "@/components/PhotoStory";
import { useLanguage } from "@/lib/context/LanguageContext";
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
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "rooms");
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<any>(null);
  
  // Estados do formulário de reserva
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [promoCode, setPromoCode] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  
  // Dados do hóspede
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestDocument, setGuestDocument] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);

  const code = params?.code as string;

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
        
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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
      freeCancellation: "Cancelamento gratuito até 24h antes",
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
      freeCancellation: "Cancelación gratuita hasta 24h antes",
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
      freeCancellation: "Free cancellation up to 24h before",
      bestRate: "Best rate guaranteed",
      gallery: "Gallery",
      description: "Description",
    },
  };

  const tPage = labels[locale as keyof typeof labels] || labels.pt;

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return new Intl.NumberFormat(
      locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US",
      {
        style: "currency",
        currency: locale === "pt" ? "BRL" : locale === "es" ? "EUR" : "USD",
      }
    ).format(price / 100);
  };

  // Verificar disponibilidade
  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut || !room) return;

    // Validar datas
    if (checkOut <= checkIn) {
      toast.error(
        locale === "en"
          ? "Check-out must be after check-in"
          : locale === "es"
          ? "La salida debe ser después de la entrada"
          : "O check-out deve ser após o check-in"
      );
      return;
    }

    // Validar capacidade
    const totalGuests = parseInt(adults) + parseInt(children);
    if (totalGuests > room.maxGuests) {
      toast.error(
        locale === "en"
          ? `This room accommodates up to ${room.maxGuests} guests`
          : locale === "es"
          ? `Esta habitación acomoda hasta ${room.maxGuests} huéspedes`
          : `Este quarto acomoda até ${room.maxGuests} hóspedes`
      );
      return;
    }

    setCheckingAvailability(true);
    setIsAvailable(null);

    try {
      const checkInStr = format(checkIn, "yyyy-MM-dd");
      const checkOutStr = format(checkOut, "yyyy-MM-dd");

      const response = await fetch(
        `/api/reservations?checkin=${checkInStr}&checkout=${checkOutStr}&roomId=${room.id}&adults=${adults}`
      );

      // Verificar se a resposta é válida
      if (!response.ok) {
        let errorMessage = "Erro ao verificar disponibilidade";
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // Se não conseguir parsear JSON, usar mensagem padrão baseada no status
          if (response.status === 400) {
            errorMessage = locale === "en"
              ? "Invalid dates. Please check your selection"
              : locale === "es"
              ? "Fechas inválidas. Por favor verifique su selección"
              : "Datas inválidas. Por favor, verifique sua seleção";
          } else if (response.status === 500) {
            errorMessage = locale === "en"
              ? "Server error. Please try again later"
              : locale === "es"
              ? "Error del servidor. Por favor intente más tarde"
              : "Erro no servidor. Por favor, tente novamente mais tarde";
          }
        }
        
        throw new Error(errorMessage);
      }

      // Parsear resposta JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Erro ao parsear resposta:", parseError);
        throw new Error(
          locale === "en"
            ? "Invalid response from server"
            : locale === "es"
            ? "Respuesta inválida del servidor"
            : "Resposta inválida do servidor"
        );
      }

      // Verificar se a resposta tem a estrutura esperada
      if (!data || !Array.isArray(data.rooms)) {
        console.error("Resposta inválida da API:", data);
        throw new Error(
          locale === "en"
            ? "Invalid response format"
            : locale === "es"
            ? "Formato de respuesta inválido"
            : "Formato de resposta inválido"
        );
      }

      // Encontrar o quarto na resposta
      const roomData = data.rooms.find((r: any) => r.id === room.id);
      
      if (!roomData) {
        console.error("Quarto não encontrado na resposta:", data.rooms);
        throw new Error(
          locale === "en"
            ? "Room not found in availability check"
            : locale === "es"
            ? "Habitación no encontrada en la verificación"
            : "Quarto não encontrado na verificação"
        );
      }

      const available = roomData.available ?? false;
      setIsAvailable(available);

      if (available) {
        // Calcular preço
        const calculatedNights = differenceInDays(checkOut, checkIn);
        const calculatedTotal = (room.basePrice || 0) * calculatedNights;
        setNights(calculatedNights);
        setTotalPrice(calculatedTotal);

        toast.success(
          locale === "en"
            ? "Room is available!"
            : locale === "es"
            ? "¡Habitación disponible!"
            : "Quarto disponível!"
        );
      } else {
        toast.error(
          locale === "en"
            ? "Room is not available for the selected dates"
            : locale === "es"
            ? "La habitación no está disponible para las fechas seleccionadas"
            : "Quarto não está disponível para as datas selecionadas"
        );
      }
    } catch (error: any) {
      console.error("Erro ao verificar disponibilidade:", error);
      
      // Mensagem de erro mais amigável
      const errorMessage = error?.message || 
        (locale === "en"
          ? "Error checking availability. Please try again"
          : locale === "es"
          ? "Error al verificar disponibilidad. Por favor intente nuevamente"
          : "Erro ao verificar disponibilidade. Por favor, tente novamente");
      
      toast.error(errorMessage);
      setIsAvailable(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Submeter reserva
  const handleSubmitReservation = async () => {
    if (!checkIn || !checkOut || !room) return;

    // Validações
    if (!guestName.trim()) {
      toast.error(
        locale === "en"
          ? "Please enter your full name"
          : locale === "es"
          ? "Por favor ingrese su nombre completo"
          : "Por favor, informe seu nome completo"
      );
      return;
    }

    if (!guestEmail.trim()) {
      toast.error(
        locale === "en"
          ? "Please enter your email"
          : locale === "es"
          ? "Por favor ingrese su correo"
          : "Por favor, informe seu e-mail"
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      toast.error(
        locale === "en"
          ? "Invalid email address"
          : locale === "es"
          ? "Correo electrónico inválido"
          : "E-mail inválido"
      );
      return;
    }

    if (!guestPhone.trim()) {
      toast.error(
        locale === "en"
          ? "Please enter your phone number"
          : locale === "es"
          ? "Por favor ingrese su teléfono"
          : "Por favor, informe seu telefone"
      );
      return;
    }

    setSubmitting(true);

    try {
      const checkInStr = format(checkIn, "yyyy-MM-dd");
      const checkOutStr = format(checkOut, "yyyy-MM-dd");

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: room.id,
          checkIn: checkInStr,
          checkOut: checkOutStr,
          adults: parseInt(adults),
          children: parseInt(children),
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          guestPhone: guestPhone.trim(),
          guestDocument: guestDocument.trim() || undefined,
          promoCode: promoCode.trim() || undefined,
          specialRequests: specialRequests.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar reserva");
      }

      toast.success(
        locale === "en"
          ? "Reservation confirmed successfully!"
          : locale === "es"
          ? "¡Reserva confirmada con éxito!"
          : "Reserva confirmada com sucesso!"
      );

      // Redirecionar para página de confirmação
      const confirmationParams = new URLSearchParams({
        confirmation: data.reservation.confirmationNumber,
        checkin: checkInStr,
        checkout: checkOutStr,
        nights: data.reservation.nights.toString(),
        total: data.reservation.totalPrice.toString(),
        room: data.reservation.room.code,
      });

      router.push(`/reservas/confirmacao?${confirmationParams.toString()}`);
    } catch (error: any) {
      console.error("Erro ao processar reserva:", error);
      toast.error(error.message || "Erro ao processar reserva");
    } finally {
      setSubmitting(false);
    }
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
  const galleryImages = room.gallery || [];

  return (
    <>
      {/* Hero Section */}
      <HeroWithImage
        title={room.name || "Quarto"}
        subtitle={room.shortDescription || room.description || ""}
        image={room.imageUrl || ""}
        imageAlt={room.name || "Quarto Hotel Sonata"}
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

              {/* Galeria */}
              {galleryImages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{tPage.gallery}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageGalleryGrid
                      images={galleryImages.map((img, index) => ({
                        src: img,
                        alt: `${room.name} - Foto ${index + 1}`,
                        title: `${room.name} - Foto ${index + 1}`,
                      }))}
                      columns={2}
                      aspectRatio="landscape"
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Sistema Completo de Reserva */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{tPage.reserve}</CardTitle>
                  {room.basePrice && (
                    <CardDescription>
                      {tPage.priceFrom} {formatPrice(room.basePrice)} {tPage.perNight}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Seleção de Datas */}
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>{locale === "en" ? "Check-in" : locale === "es" ? "Entrada" : "Check-in"}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkIn && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkIn ? (
                              format(checkIn, "dd/MM/yyyy", { locale: locale === "pt" ? ptBR : undefined })
                            ) : (
                              <span>{locale === "en" ? "Select date" : locale === "es" ? "Seleccione fecha" : "Selecione a data"}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkIn || undefined}
                            onSelect={(date) => {
                              setCheckIn(date || null);
                              if (date && checkOut && date >= checkOut) {
                                setCheckOut(null);
                              }
                              setIsAvailable(null);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>{locale === "en" ? "Check-out" : locale === "es" ? "Salida" : "Check-out"}</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkOut && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOut ? (
                              format(checkOut, "dd/MM/yyyy", { locale: locale === "pt" ? ptBR : undefined })
                            ) : (
                              <span>{locale === "en" ? "Select date" : locale === "es" ? "Seleccione fecha" : "Selecione a data"}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOut || undefined}
                            onSelect={(date) => {
                              setCheckOut(date || null);
                              setIsAvailable(null);
                            }}
                            disabled={(date) => {
                              if (!checkIn) return date < new Date();
                              return date <= checkIn;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Hóspedes */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>{locale === "en" ? "Adults" : locale === "es" ? "Adultos" : "Adultos"}</Label>
                      <Select value={adults} onValueChange={(value) => {
                        setAdults(value);
                        setIsAvailable(null);
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === "en" ? "Children" : locale === "es" ? "Niños" : "Crianças"}</Label>
                      <Select value={children} onValueChange={(value) => {
                        setChildren(value);
                        setIsAvailable(null);
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Verificar Disponibilidade */}
                  {checkIn && checkOut && (
                    <Button
                      onClick={handleCheckAvailability}
                      disabled={checkingAvailability}
                      className="w-full"
                      size="lg"
                    >
                      {checkingAvailability ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {locale === "en" ? "Checking..." : locale === "es" ? "Verificando..." : "Verificando..."}
                        </>
                      ) : (
                        locale === "en" ? "Check Availability" : locale === "es" ? "Verificar Disponibilidad" : "Verificar Disponibilidade"
                      )}
                    </Button>
                  )}

                  {/* Status de Disponibilidade */}
                  {isAvailable !== null && (
                    <div className={cn(
                      "p-3 rounded-lg border",
                      isAvailable ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    )}>
                      <div className="flex items-center gap-2">
                        {isAvailable ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <p className={cn(
                          "text-sm font-medium",
                          isAvailable ? "text-green-800" : "text-red-800"
                        )}>
                          {isAvailable
                            ? (locale === "en" ? "Available" : locale === "es" ? "Disponible" : "Disponível")
                            : (locale === "en" ? "Not Available" : locale === "es" ? "No Disponible" : "Indisponível")}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Cálculo de Preço */}
                  {isAvailable && checkIn && checkOut && nights > 0 && totalPrice > 0 && (
                    <div className="space-y-3 pt-3 border-t">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatPrice(room.basePrice)} × {nights} {locale === "en" ? "nights" : locale === "es" ? "noches" : "noites"}
                        </span>
                        <span className="font-medium">{formatPrice(totalPrice)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{locale === "en" ? "Total" : locale === "es" ? "Total" : "Total"}</span>
                        <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                      </div>
                    </div>
                  )}

                  {/* Formulário do Hóspede (aparece após verificar disponibilidade) */}
                  {showGuestForm && isAvailable && checkIn && checkOut && (
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold">{locale === "en" ? "Guest Information" : locale === "es" ? "Información del Huésped" : "Dados do Hóspede"}</h3>
                      
                      <div className="space-y-2">
                        <Label>
                          {locale === "en" ? "Full Name" : locale === "es" ? "Nombre Completo" : "Nome Completo"} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder={locale === "en" ? "Your full name" : locale === "es" ? "Su nombre completo" : "Seu nome completo"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {locale === "en" ? "Email" : locale === "es" ? "Correo" : "E-mail"} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder={locale === "en" ? "your@email.com" : locale === "es" ? "su@email.com" : "seu@email.com"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {locale === "en" ? "Phone" : locale === "es" ? "Teléfono" : "Telefone"} <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder={locale === "en" ? "+1 (555) 000-0000" : locale === "es" ? "+34 600 000 000" : "(85) 99999-9999"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {locale === "en" ? "ID/Passport" : locale === "es" ? "DNI/Pasaporte" : "CPF/Passaporte"}
                        </Label>
                        <Input
                          value={guestDocument}
                          onChange={(e) => setGuestDocument(e.target.value)}
                          placeholder={locale === "en" ? "000-00-0000" : locale === "es" ? "00000000X" : "000.000.000-00"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {locale === "en" ? "Promotional Code" : locale === "es" ? "Código Promocional" : "Código Promocional"}
                        </Label>
                        <Input
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder={locale === "en" ? "Enter code" : locale === "es" ? "Ingrese código" : "Digite o código"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          {locale === "en" ? "Special Requests" : locale === "es" ? "Solicitudes Especiales" : "Solicitações Especiais"}
                        </Label>
                        <Textarea
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          placeholder={locale === "en" ? "Any special requests? (optional)" : locale === "es" ? "¿Alguna solicitud especial? (opcional)" : "Alguma solicitação especial? (opcional)"}
                          rows={3}
                        />
                      </div>

                      <Button
                        onClick={handleSubmitReservation}
                        disabled={submitting || !guestName.trim() || !guestEmail.trim() || !guestPhone.trim()}
                        size="lg"
                        className="w-full"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {locale === "en" ? "Processing..." : locale === "es" ? "Procesando..." : "Processando..."}
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            {locale === "en" ? "Confirm Reservation" : locale === "es" ? "Confirmar Reserva" : "Confirmar Reserva"}
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Botão para mostrar formulário se disponível */}
                  {isAvailable && checkIn && checkOut && !showGuestForm && (
                    <Button
                      onClick={() => setShowGuestForm(true)}
                      size="lg"
                      className="w-full"
                    >
                      {locale === "en" ? "Continue to Reservation" : locale === "es" ? "Continuar con Reserva" : "Continuar com Reserva"}
                    </Button>
                  )}

                  {/* Informações Adicionais */}
                  <div className="space-y-3 pt-4 border-t text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{tPage.breakfastIncluded}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{tPage.freeCancellation}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{tPage.bestRate}</p>
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

