"use client";

import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Users,
  CheckCircle2,
  Loader2,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ReservationWidgetProps {
  roomId: number;
  roomCode: string;
  basePrice: number;
  maxGuests: number;
  className?: string;
  onReservationComplete?: (reservationId: number, confirmationNumber: string) => void;
}

export default function ReservationWidget({
  roomId,
  roomCode,
  basePrice,
  maxGuests,
  className,
  onReservationComplete,
}: ReservationWidgetProps) {
  const { locale } = useLanguage();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [promoCode, setPromoCode] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Dados do hóspede
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestDocument, setGuestDocument] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

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
      continue: "Continuar com Reserva",
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
      freeCancellation: "Cancelamento gratuito até 24h antes",
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
      continue: "Continuar con Reserva",
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
      freeCancellation: "Cancelación gratuita hasta 24h antes",
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
      continue: "Continue to Reservation",
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
      freeCancellation: "Free cancellation up to 24h before",
      bestRate: "Best rate guaranteed",
      selectDate: "Select date",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;
  const dateLocale = locale === "pt" ? ptBR : undefined;

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = nights > 0 && basePrice > 0 ? nights * basePrice : 0;

  const formatPrice = (price: number) => {
    return formatPriceCurrency(price, locale);
  };

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error(
        locale === "en"
          ? "Please select check-in and check-out dates"
          : locale === "es"
          ? "Por favor seleccione las fechas de entrada y salida"
          : "Por favor, selecione as datas de check-in e check-out"
      );
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

    setCheckingAvailability(true);
    setIsAvailable(null);

    try {
      const checkInStr = format(checkIn, "yyyy-MM-dd");
      const checkOutStr = format(checkOut, "yyyy-MM-dd");

      const response = await fetch(
        `/api/reservations?checkin=${checkInStr}&checkout=${checkOutStr}&roomId=${roomId}&adults=${adults}`
      );

      if (!response.ok) {
        throw new Error("Erro ao verificar disponibilidade");
      }

      const data = await response.json();
      const roomData = data.rooms?.find((r: any) => r.id === roomId);

      if (!roomData) {
        throw new Error("Quarto não encontrado");
      }

      const available = roomData.available ?? false;
      setIsAvailable(available);

      if (available) {
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
      toast.error(
        locale === "en"
          ? "Error checking availability. Please try again"
          : locale === "es"
          ? "Error al verificar disponibilidad. Por favor intente nuevamente"
          : "Erro ao verificar disponibilidade. Por favor, tente novamente"
      );
      setIsAvailable(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async () => {
    if (!checkIn || !checkOut) {
      toast.error(t.selectDate);
      return;
    }

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
          roomId,
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

      if (onReservationComplete) {
        onReservationComplete(data.reservation.id, data.reservation.confirmationNumber);
      }
    } catch (error: any) {
      console.error("Erro ao processar reserva:", error);
      toast.error(error.message || "Erro ao processar reserva");
    } finally {
      setSubmitting(false);
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
                    setIsAvailable(null);
                    setShowGuestForm(false);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>{t.checkOut}</Label>
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
                  onSelect={(date) => {
                    setCheckOut(date || null);
                    setIsAvailable(null);
                    setShowGuestForm(false);
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
            <Label>{t.adults}</Label>
            <Select
              value={adults}
              onValueChange={(value) => {
                setAdults(value);
                setIsAvailable(null);
                setShowGuestForm(false);
              }}
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
              onValueChange={(value) => {
                setChildren(value);
                setIsAvailable(null);
                setShowGuestForm(false);
              }}
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
                {t.checking}
              </>
            ) : (
              t.checkAvailability
            )}
          </Button>
        )}

        {/* Status de Disponibilidade */}
        {isAvailable !== null && (
          <div
            className={cn(
              "p-3 rounded-lg border",
              isAvailable
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            )}
          >
            <div className="flex items-center gap-2">
              {isAvailable ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <p
                className={cn(
                  "text-sm font-medium",
                  isAvailable ? "text-green-800" : "text-red-800"
                )}
              >
                {isAvailable ? t.available : t.unavailable}
              </p>
            </div>
          </div>
        )}

        {/* Cálculo de Preço */}
        {isAvailable && checkIn && checkOut && nights > 0 && totalPrice > 0 && (
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

        {/* Formulário do Hóspede (aparece após verificar disponibilidade) */}
        {showGuestForm && isAvailable && checkIn && checkOut && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">{t.guestInfo}</h3>

            <div className="space-y-2">
              <Label>
                {t.name} <span className="text-destructive">*</span>
              </Label>
              <Input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={t.namePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label>
                {t.email} <span className="text-destructive">*</span>
              </Label>
              <Input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label>
                {t.phone} <span className="text-destructive">*</span>
              </Label>
              <Input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.document}</Label>
              <Input
                value={guestDocument}
                onChange={(e) => setGuestDocument(e.target.value)}
                placeholder={t.documentPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.promoCode}</Label>
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder={t.promoCodePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.specialRequests}</Label>
              <Textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder={t.specialRequestsPlaceholder}
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={
                submitting ||
                !guestName.trim() ||
                !guestEmail.trim() ||
                !guestPhone.trim()
              }
              size="lg"
              className="w-full"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.processing}
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {t.confirm}
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
            <p className="text-muted-foreground">{t.freeCancellation}</p>
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

