"use client";

import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { es } from "date-fns/locale/es";
import { enUS } from "date-fns/locale/en-US";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { cn } from "@/lib/utils";
import { buildOmnibeesUrl } from "@/lib/utils/omnibees";
import { toast } from "sonner";

interface ReservationWidgetProps {
  roomId: number;
  roomCode: string;
  basePrice: number;
  maxGuests: number;
  className?: string;
  onReservationComplete?: (reservationId: number, confirmationNumber: string) => void;
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
  initialAdults?: string;
  initialChildren?: string;
}

export default function ReservationWidget({
  roomId,
  roomCode,
  basePrice,
  maxGuests,
  className,
  onReservationComplete,
  initialCheckIn,
  initialCheckOut,
  initialAdults = "2",
  initialChildren = "0",
}: ReservationWidgetProps) {
  const { locale } = useLanguage();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn || null);
  const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut || null);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [promoCode, setPromoCode] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state to prevent hydration mismatch with Radix UI IDs
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const labels = {
    pt: {
      title: "Reservar Agora",
      checkIn: "Check-in",
      checkOut: "Check-out",
      adults: "Adultos",
      children: "Crianças",
      checkAvailability: "Verificar Disponibilidade",
      checking: "Verificando...",
      available: "Disponível",
      unavailable: "Indisponível",
      continue: "Fazer reserva",
      guestInfo: "Dados do Hóspede",
      name: "Nome Completo",
      namePlaceholder: "Seu nome completo",
      email: "E-mail",
      emailPlaceholder: "seu@email.com",
      phone: "Telefone",
      phonePlaceholder: "(85) 99999-9999",
      document: "CPF/Passaporte",
      documentPlaceholder: "000.000.000-00",
      promoCode: "Código Promocional",
      promoCodePlaceholder: "Digite o código",
      specialRequests: "Solicitações Especiais",
      specialRequestsPlaceholder: "Alguma solicitação especial? (opcional)",
      confirm: "CONFIRMAR RESERVA",
      processing: "Processando...",
      perNight: "por noite",
      nights: "noites",
      total: "Total",
      breakfastIncluded: "Café da manhã incluído",
      bestRate: "Melhor tarifa garantida",
      selectDate: "Selecione a data",
    },
    es: {
      title: "Reservar Ahora",
      checkIn: "Entrada",
      checkOut: "Salida",
      adults: "Adultos",
      children: "Niños",
      checkAvailability: "Verificar Disponibilidad",
      checking: "Verificando...",
      available: "Disponible",
      unavailable: "No Disponible",
      continue: "Hacer reserva",
      guestInfo: "Datos del Huésped",
      name: "Nombre Completo",
      namePlaceholder: "Su nombre completo",
      email: "Correo Electrónico",
      emailPlaceholder: "su@email.com",
      phone: "Teléfono",
      phonePlaceholder: "+34 600 000 000",
      document: "DNI/Pasaporte",
      documentPlaceholder: "00000000X",
      promoCode: "Código Promocional",
      promoCodePlaceholder: "Ingrese el código",
      specialRequests: "Solicitudes Especiales",
      specialRequestsPlaceholder: "¿Alguna solicitud especial? (opcional)",
      confirm: "CONFIRMAR RESERVA",
      processing: "Procesando...",
      perNight: "por noche",
      nights: "noches",
      total: "Total",
      breakfastIncluded: "Desayuno incluido",
      bestRate: "Mejor tarifa garantizada",
      selectDate: "Seleccione la fecha",
    },
    en: {
      title: "Book Now",
      checkIn: "Check-in",
      checkOut: "Check-out",
      adults: "Adults",
      children: "Children",
      checkAvailability: "Check Availability",
      checking: "Checking...",
      available: "Available",
      unavailable: "Unavailable",
      continue: "Make reservation",
      guestInfo: "Guest Information",
      name: "Full Name",
      namePlaceholder: "Your full name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      phone: "Phone",
      phonePlaceholder: "+1 (555) 000-0000",
      document: "ID/Passport",
      documentPlaceholder: "000-00-0000",
      promoCode: "Promotional Code",
      promoCodePlaceholder: "Enter code",
      specialRequests: "Special Requests",
      specialRequestsPlaceholder: "Any special requests? (optional)",
      confirm: "CONFIRM RESERVATION",
      processing: "Processing...",
      perNight: "per night",
      nights: "nights",
      total: "Total",
      breakfastIncluded: "Breakfast included",
      bestRate: "Best rate guaranteed",
      selectDate: "Select date",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;
  const dateLocale = locale === "pt" ? ptBR : locale === "es" ? es : enUS;

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = nights > 0 && basePrice > 0 ? nights * basePrice : 0;

  const formatPrice = (price: number) => {
    return formatPriceCurrency(price, locale);
  };

  /** Redireciona para o site de reservas Omnibees (book.omnibees.com) – gestão é feita lá */
  const handleGoToOmnibees = () => {
    if (!checkIn || !checkOut) {
      toast.error(t.selectDate);
      return;
    }
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
    const totalGuests = parseInt(adults) + parseInt(children);
    if (totalGuests > maxGuests) {
      toast.error(
        locale === "en"
          ? `This room accommodates up to ${maxGuests} guests`
          : locale === "es"
          ? `Esta habitación acomoda hasta ${maxGuests} huéspedes`
          : `Este quarto acomoda até ${maxGuests} hóspedes`
      );
      return;
    }

    try {
      const omnibeesUrl = buildOmnibeesUrl({
        checkIn,
        checkOut,
        adults,
        children,
        promoCode: promoCode.trim() || undefined,
        locale: locale as "pt" | "es" | "en",
      });
      toast.success(
        locale === "en"
          ? "Redirecting to booking system..."
          : locale === "es"
          ? "Redirigiendo al sistema de reservas..."
          : "Redirecionando para o sistema de reservas..."
      );
      setTimeout(() => {
        window.location.href = omnibeesUrl;
      }, 500);
    } catch (error: any) {
      console.error("Erro ao redirecionar:", error);
      toast.error(
        locale === "en"
          ? "An error occurred. Please try again."
          : locale === "es"
          ? "Ocurrió un error. Por favor intente nuevamente."
          : "Ocorreu um erro. Por favor, tente novamente."
      );
    }
  };

  return (
    <Card className={cn("sticky top-24", className)}>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>
          {formatPrice(basePrice)} {t.perNight}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seleção de Datas */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>{t.checkIn}</Label>
            {isMounted ? (
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
                      format(checkIn, "dd/MM/yyyy", { locale: dateLocale })
                    ) : (
                      <span>{t.selectDate}</span>
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
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={dateLocale}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkIn && "text-muted-foreground"
                )}
                disabled
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? (
                  format(checkIn, "dd/MM/yyyy", { locale: dateLocale })
                ) : (
                  <span>{t.selectDate}</span>
                )}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t.checkOut}</Label>
            {isMounted ? (
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
                      format(checkOut, "dd/MM/yyyy", { locale: dateLocale })
                    ) : (
                      <span>{t.selectDate}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut || undefined}
                    onSelect={(date) => setCheckOut(date || null)}
                    disabled={(date) => {
                      if (!checkIn) return date < new Date();
                      return date <= checkIn;
                    }}
                    initialFocus
                    locale={dateLocale}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkOut && "text-muted-foreground"
                )}
                disabled
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? (
                  format(checkOut, "dd/MM/yyyy", { locale: dateLocale })
                ) : (
                  <span>{t.selectDate}</span>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Hóspedes */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>{t.adults}</Label>
            <Select
              value={adults}
              onValueChange={setAdults}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: Math.min(maxGuests, 8) }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t.children}</Label>
            <Select
              value={children}
              onValueChange={setChildren}
            >
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

        {/* Estimativa de preço (quando tem datas) */}
        {checkIn && checkOut && nights > 0 && totalPrice > 0 && (
          <div className="space-y-3 pt-3 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formatPrice(basePrice)} × {nights}{" "}
                {locale === "en" ? "nights" : locale === "es" ? "noches" : "noites"}
              </span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-semibold">{t.total}</span>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        )}

        {/* Botão para ir ao site de reservas (book.omnibees.com) */}
        {checkIn && checkOut && (
          <Button
            onClick={handleGoToOmnibees}
            size="lg"
            className="w-full"
          >
            {t.continue}
          </Button>
        )}

        {/* Informações Adicionais */}
        <div className="space-y-3 pt-4 border-t text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">{t.breakfastIncluded}</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">{t.bestRate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

