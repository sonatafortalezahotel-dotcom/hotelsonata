"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format, parse, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Calendar, User, Mail, Phone, CreditCard, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useLanguage } from "@/lib/context/LanguageContext";
import { HeroWithImage } from "@/components/HeroWithImage";
import { getRooms } from "@/lib/hooks/useRooms";
import Image from "next/image";
import { Waves, Users as UsersIcon } from "lucide-react";

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
  basePrice: number;
  imageUrl: string | null;
}

export default function ReservasPage() {
  const { locale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Dados do hóspede
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestDocument, setGuestDocument] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const labels = {
    pt: {
      title: "Finalizar Reserva",
      subtitle: "Complete seus dados e confirme sua reserva",
      reservationSummary: "Resumo da Reserva",
      guestInfo: "Dados do Hóspede",
      checkIn: "Check-in",
      checkOut: "Check-out",
      nights: "noites",
      guests: "Hóspedes",
      adults: "Adultos",
      children: "Crianças",
      room: "Quarto",
      selectRoom: "Selecione um Quarto",
      promoCode: "Código Promocional",
      promoCodePlaceholder: "Digite o código",
      name: "Nome Completo",
      namePlaceholder: "Seu nome completo",
      email: "E-mail",
      emailPlaceholder: "seu@email.com",
      phone: "Telefone",
      phonePlaceholder: "(85) 99999-9999",
      document: "CPF/Passaporte",
      documentPlaceholder: "000.000.000-00",
      specialRequests: "Solicitações Especiais",
      specialRequestsPlaceholder: "Alguma solicitação especial? (opcional)",
      total: "Total Estimado",
      perNight: "por noite",
      confirmReservation: "CONFIRMAR RESERVA",
      processing: "Processando...",
      success: "Reserva confirmada com sucesso!",
      error: "Erro ao processar reserva. Tente novamente.",
      required: "Campo obrigatório",
      invalidEmail: "E-mail inválido",
      invalidDate: "Data inválida",
      selectDates: "Selecione as datas",
      noRoomsAvailable: "Nenhum quarto disponível",
      breakfastIncluded: "Café da manhã incluído",
      freeCancellation: "Cancelamento gratuito até 24h antes",
      bestRate: "Melhor tarifa garantida",
    },
    es: {
      title: "Finalizar Reserva",
      subtitle: "Complete sus datos y confirme su reserva",
      reservationSummary: "Resumen de la Reserva",
      guestInfo: "Datos del Huésped",
      checkIn: "Entrada",
      checkOut: "Salida",
      nights: "noches",
      guests: "Huéspedes",
      adults: "Adultos",
      children: "Niños",
      room: "Habitación",
      selectRoom: "Seleccione una Habitación",
      promoCode: "Código Promocional",
      promoCodePlaceholder: "Ingrese el código",
      name: "Nombre Completo",
      namePlaceholder: "Su nombre completo",
      email: "Correo Electrónico",
      emailPlaceholder: "su@email.com",
      phone: "Teléfono",
      phonePlaceholder: "+34 600 000 000",
      document: "DNI/Pasaporte",
      documentPlaceholder: "00000000X",
      specialRequests: "Solicitudes Especiales",
      specialRequestsPlaceholder: "¿Alguna solicitud especial? (opcional)",
      total: "Total Estimado",
      perNight: "por noche",
      confirmReservation: "CONFIRMAR RESERVA",
      processing: "Procesando...",
      success: "¡Reserva confirmada con éxito!",
      error: "Error al procesar la reserva. Intente nuevamente.",
      required: "Campo obligatorio",
      invalidEmail: "Correo electrónico inválido",
      invalidDate: "Fecha inválida",
      selectDates: "Seleccione las fechas",
      noRoomsAvailable: "No hay habitaciones disponibles",
      breakfastIncluded: "Desayuno incluido",
      freeCancellation: "Cancelación gratuita hasta 24h antes",
      bestRate: "Mejor tarifa garantizada",
    },
    en: {
      title: "Complete Your Reservation",
      subtitle: "Fill in your details and confirm your booking",
      reservationSummary: "Reservation Summary",
      guestInfo: "Guest Information",
      checkIn: "Check-in",
      checkOut: "Check-out",
      nights: "nights",
      guests: "Guests",
      adults: "Adults",
      children: "Children",
      room: "Room",
      selectRoom: "Select a Room",
      promoCode: "Promotional Code",
      promoCodePlaceholder: "Enter code",
      name: "Full Name",
      namePlaceholder: "Your full name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      phone: "Phone",
      phonePlaceholder: "+1 (555) 000-0000",
      document: "ID/Passport",
      documentPlaceholder: "000-00-0000",
      specialRequests: "Special Requests",
      specialRequestsPlaceholder: "Any special requests? (optional)",
      total: "Estimated Total",
      perNight: "per night",
      confirmReservation: "CONFIRM RESERVATION",
      processing: "Processing...",
      success: "Reservation confirmed successfully!",
      error: "Error processing reservation. Please try again.",
      required: "Required field",
      invalidEmail: "Invalid email",
      invalidDate: "Invalid date",
      selectDates: "Select dates",
      noRoomsAvailable: "No rooms available",
      breakfastIncluded: "Breakfast included",
      freeCancellation: "Free cancellation up to 24h before",
      bestRate: "Best rate guaranteed",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;
  const dateLocale = locale === "pt" ? ptBR : undefined;

  // Carregar parâmetros da URL
  useEffect(() => {
    const checkInParam = searchParams.get("checkin");
    const checkOutParam = searchParams.get("checkout");
    const guestsParam = searchParams.get("guests");
    const adultsParam = searchParams.get("adults");
    const childrenParam = searchParams.get("children");
    const roomParam = searchParams.get("room");
    const promoParam = searchParams.get("promo");

    if (checkInParam) {
      const date = parse(checkInParam, "yyyy-MM-dd", new Date());
      if (!isNaN(date.getTime())) setCheckIn(date);
    }
    if (checkOutParam) {
      const date = parse(checkOutParam, "yyyy-MM-dd", new Date());
      if (!isNaN(date.getTime())) setCheckOut(date);
    }
    if (guestsParam) setAdults(guestsParam);
    if (adultsParam) setAdults(adultsParam);
    if (childrenParam) setChildren(childrenParam);
    if (roomParam) setRoomCode(roomParam);
    if (promoParam) setPromoCode(promoParam);
  }, [searchParams]);

  // Buscar quartos e verificar disponibilidade
  useEffect(() => {
    async function fetchRoomsAndAvailability() {
      try {
        setLoading(true);
        
        // Buscar quartos
        const roomsData = await getRooms(true, locale);
        setRooms(roomsData);
        
        // Se houver roomCode, selecionar o quarto
        if (roomCode) {
          const room = roomsData.find((r: Room) => r.code === roomCode);
          if (room) setSelectedRoom(room);
        }

        // Se houver datas, verificar disponibilidade
        if (checkIn && checkOut) {
          const checkInStr = format(checkIn, "yyyy-MM-dd");
          const checkOutStr = format(checkOut, "yyyy-MM-dd");
          
          const response = await fetch(
            `/api/reservations?checkin=${checkInStr}&checkout=${checkOutStr}&adults=${adults}`
          );
          
          if (response.ok) {
            const data = await response.json();
            
            // Atualizar disponibilidade dos quartos
            const roomsWithAvailability = roomsData.map((room: Room) => {
              const availableRoom = data.rooms.find(
                (r: any) => r.id === room.id
              );
              return {
                ...room,
                available: availableRoom?.available ?? false,
              };
            });
            
            setRooms(roomsWithAvailability);
            
            // Se o quarto selecionado não estiver disponível, mostrar aviso
            if (selectedRoom) {
              const selectedRoomData = data.rooms.find(
                (r: any) => r.id === selectedRoom.id
              );
              if (selectedRoomData && !selectedRoomData.available) {
                toast.error(
                  locale === "en"
                    ? "Selected room is not available for the selected dates"
                    : locale === "es"
                    ? "La habitación seleccionada no está disponible para las fechas seleccionadas"
                    : "O quarto selecionado não está disponível para as datas selecionadas"
                );
                setSelectedRoom(null);
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar quartos:", error);
        toast.error(t.error);
      } finally {
        setLoading(false);
      }
    }
    fetchRoomsAndAvailability();
  }, [locale, roomCode, checkIn, checkOut, adults, selectedRoom, t.error]);

  // Calcular noites e total
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const roomPrice = selectedRoom?.basePrice || 0;
  const totalPrice = nights > 0 && roomPrice > 0 ? nights * roomPrice : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(
      locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US",
      {
        style: "currency",
        currency: locale === "pt" ? "BRL" : locale === "es" ? "EUR" : "USD",
      }
    ).format(price / 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!checkIn || !checkOut) {
      toast.error(t.selectDates);
      return;
    }

    if (!guestName.trim()) {
      toast.error(`${t.name}: ${t.required}`);
      return;
    }

    if (!guestEmail.trim()) {
      toast.error(`${t.email}: ${t.required}`);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      toast.error(t.invalidEmail);
      return;
    }

    if (!guestPhone.trim()) {
      toast.error(`${t.phone}: ${t.required}`);
      return;
    }

    if (!selectedRoom) {
      toast.error(t.selectRoom);
      return;
    }

    setSubmitting(true);

    try {
      // Formatar datas para API
      const checkInStr = format(checkIn, "yyyy-MM-dd");
      const checkOutStr = format(checkOut, "yyyy-MM-dd");

      // Criar reserva via API
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: selectedRoom.id,
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
        throw new Error(data.error || t.error);
      }

      toast.success(t.success);
      
      // Redirecionar para página de confirmação com todos os dados
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
      toast.error(error.message || t.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <HeroWithImage
        title={t.title}
        subtitle={t.subtitle}
        image={selectedRoom?.imageUrl || rooms[0]?.imageUrl || ""}
        imageAlt="Reserva Hotel Sonata de Iracema"
        height="medium"
        overlay="medium"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t.guestInfo}</CardTitle>
                <CardDescription>
                  {locale === "en" 
                    ? "Please fill in all required information"
                    : locale === "es"
                    ? "Por favor complete toda la información requerida"
                    : "Por favor, preencha todas as informações obrigatórias"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {t.name} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      required
                    />
                  </div>

                  {/* Email e Telefone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t.email} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder={t.emailPlaceholder}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {t.phone} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder={t.phonePlaceholder}
                        required
                      />
                    </div>
                  </div>

                  {/* Documento */}
                  <div className="space-y-2">
                    <Label htmlFor="document">
                      {t.document} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="document"
                      value={guestDocument}
                      onChange={(e) => setGuestDocument(e.target.value)}
                      placeholder={t.documentPlaceholder}
                      required
                    />
                  </div>

                  {/* Solicitações Especiais */}
                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">{t.specialRequests}</Label>
                    <Textarea
                      id="specialRequests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder={t.specialRequestsPlaceholder}
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={submitting || !checkIn || !checkOut || !selectedRoom}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t.processing}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        {t.confirmReservation}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo da Reserva */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t.reservationSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Datas */}
                {checkIn && checkOut && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t.checkIn}</p>
                        <p className="text-muted-foreground">
                          {format(checkIn, "dd/MM/yyyy", { locale: dateLocale })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t.checkOut}</p>
                        <p className="text-muted-foreground">
                          {format(checkOut, "dd/MM/yyyy", { locale: dateLocale })}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium">
                        {nights} {t.nights}
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Hóspedes */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{t.guests}</p>
                      <p className="text-muted-foreground">
                        {adults} {t.adults}
                        {parseInt(children) > 0 && `, ${children} ${t.children}`}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Seleção de Quarto */}
                <div className="space-y-3">
                  <Label>{t.room}</Label>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : rooms.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t.noRoomsAvailable}</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {rooms.map((room: Room & { available?: boolean }) => {
                        const isAvailable = room.available !== false; // Default true se não verificado
                        const isSelected = selectedRoom?.id === room.id;
                        
                        return (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => {
                              if (isAvailable) {
                                setSelectedRoom(room);
                              } else {
                                toast.error(
                                  locale === "en"
                                    ? "This room is not available for the selected dates"
                                    : locale === "es"
                                    ? "Esta habitación no está disponible para las fechas seleccionadas"
                                    : "Este quarto não está disponível para as datas selecionadas"
                                );
                              }
                            }}
                            disabled={!isAvailable}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : !isAvailable
                                ? "border-border opacity-50 cursor-not-allowed"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {room.imageUrl && (
                                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                  <Image
                                    src={room.imageUrl}
                                    alt={room.name || ""}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="font-medium text-sm truncate">{room.name}</p>
                                  {!isAvailable && (
                                    <Badge variant="destructive" className="text-xs">
                                      {locale === "en" ? "Unavailable" : locale === "es" ? "No disponible" : "Indisponível"}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  {room.hasSeaView && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Waves className="h-3 w-3 mr-1" />
                                      {locale === "en" ? "Sea View" : locale === "es" ? "Vista al Mar" : "Vista Mar"}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {room.maxGuests} {t.guests}
                                  </span>
                                </div>
                                {room.basePrice > 0 && (
                                  <p className="text-sm font-semibold text-primary mt-1">
                                    {formatPrice(room.basePrice)} {t.perNight}
                                  </p>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Código Promocional */}
                {promoCode && (
                  <div className="space-y-2">
                    <Label>{t.promoCode}</Label>
                    <div className="p-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">{promoCode}</p>
                    </div>
                  </div>
                )}

                {/* Total */}
                {totalPrice > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t.total}</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Informações Adicionais */}
                <div className="pt-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p>{t.breakfastIncluded}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p>{t.freeCancellation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p>{t.bestRate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

