"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { CheckCircle2, Calendar, Users, Mail, Phone, FileText, ArrowLeft, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/context/LanguageContext";
import { HeroWithImage } from "@/components/HeroWithImage";
import { Loader2 } from "lucide-react";

interface ReservationData {
  id: number;
  confirmationNumber: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  room: {
    id: number;
    code: string;
  };
}

export default function ConfirmacaoPage() {
  const { locale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const confirmationNumber = searchParams.get("confirmation");
  
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const labels = {
    pt: {
      title: "Reserva Confirmada!",
      subtitle: "Sua reserva foi confirmada com sucesso",
      confirmationNumber: "Número de Confirmação",
      reservationDetails: "Detalhes da Reserva",
      checkIn: "Check-in",
      checkOut: "Check-out",
      nights: "noites",
      total: "Total",
      room: "Quarto",
      nextSteps: "Próximos Passos",
      emailSent: "Um email de confirmação foi enviado para",
      print: "Imprimir Confirmação",
      backHome: "Voltar ao Início",
      error: "Reserva não encontrada",
      errorDescription: "Não foi possível encontrar a reserva com o número de confirmação fornecido.",
    },
    es: {
      title: "¡Reserva Confirmada!",
      subtitle: "Su reserva ha sido confirmada con éxito",
      confirmationNumber: "Número de Confirmación",
      reservationDetails: "Detalles de la Reserva",
      checkIn: "Entrada",
      checkOut: "Salida",
      nights: "noches",
      total: "Total",
      room: "Habitación",
      nextSteps: "Próximos Pasos",
      emailSent: "Se ha enviado un correo de confirmación a",
      print: "Imprimir Confirmación",
      backHome: "Volver al Inicio",
      error: "Reserva no encontrada",
      errorDescription: "No se pudo encontrar la reserva con el número de confirmación proporcionado.",
    },
    en: {
      title: "Reservation Confirmed!",
      subtitle: "Your reservation has been confirmed successfully",
      confirmationNumber: "Confirmation Number",
      reservationDetails: "Reservation Details",
      checkIn: "Check-in",
      checkOut: "Check-out",
      nights: "nights",
      total: "Total",
      room: "Room",
      nextSteps: "Next Steps",
      emailSent: "A confirmation email has been sent to",
      print: "Print Confirmation",
      backHome: "Back to Home",
      error: "Reservation not found",
      errorDescription: "Could not find the reservation with the provided confirmation number.",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;
  const dateLocale = locale === "pt" ? ptBR : undefined;

  useEffect(() => {
    if (confirmationNumber) {
      // Por enquanto, vamos usar os dados da URL
      // Em produção, você pode buscar os dados completos da reserva via API
      const checkIn = searchParams.get("checkin");
      const checkOut = searchParams.get("checkout");
      const nights = searchParams.get("nights");
      const totalPrice = searchParams.get("total");
      const roomCode = searchParams.get("room");

      if (checkIn && checkOut && nights && totalPrice) {
        setReservation({
          id: 0,
          confirmationNumber,
          checkIn,
          checkOut,
          nights: parseInt(nights),
          totalPrice: parseInt(totalPrice),
          room: {
            id: 0,
            code: roomCode || "",
          },
        });
        setLoading(false);
      } else {
        setError(t.error);
        setLoading(false);
      }
    } else {
      setError(t.error);
      setLoading(false);
    }
  }, [confirmationNumber, searchParams, t.error]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(
      locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US",
      {
        style: "currency",
        currency: locale === "pt" ? "BRL" : locale === "es" ? "EUR" : "USD",
      }
    ).format(price / 100);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <>
        <HeroWithImage
          title={t.error}
          subtitle={t.errorDescription}
          image=""
          imageAlt="Erro"
          height="medium"
          overlay="medium"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Button onClick={() => router.push("/")} className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backHome}
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroWithImage
        title={t.title}
        subtitle={t.subtitle}
        image=""
        imageAlt="Confirmação de Reserva"
        height="medium"
        overlay="medium"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Número de Confirmação - Destaque */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t.confirmationNumber}
                    </p>
                    <p className="text-2xl font-bold text-primary font-mono">
                      {reservation.confirmationNumber}
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="text-lg px-4 py-2">
                  {locale === "en" ? "Confirmed" : locale === "es" ? "Confirmada" : "Confirmada"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Detalhes da Reserva */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.reservationDetails}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Datas */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{t.checkIn}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(reservation.checkIn), "dd/MM/yyyy", {
                            locale: dateLocale,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{t.checkOut}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(reservation.checkOut), "dd/MM/yyyy", {
                            locale: dateLocale,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Quarto e Noites */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t.room}</p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.room.code}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {reservation.nights} {t.nights}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-semibold">{t.total}</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(reservation.totalPrice)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Próximos Passos */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.nextSteps}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        {locale === "en"
                          ? "A confirmation email has been sent to your email address"
                          : locale === "es"
                          ? "Se ha enviado un correo de confirmación a su dirección de correo electrónico"
                          : "Um email de confirmação foi enviado para seu endereço de email"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        {locale === "en"
                          ? "Please arrive at the hotel on the check-in date"
                          : locale === "es"
                          ? "Por favor, llegue al hotel en la fecha de entrada"
                          : "Por favor, chegue ao hotel na data de check-in"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>
                        {locale === "en"
                          ? "Bring a valid ID and the confirmation number"
                          : locale === "es"
                          ? "Traiga una identificación válida y el número de confirmación"
                          : "Traga um documento de identidade válido e o número de confirmação"}
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Ações */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {locale === "en" ? "Need Help?" : locale === "es" ? "¿Necesita Ayuda?" : "Precisa de Ajuda?"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handlePrint}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t.print}
                  </Button>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => router.push("/")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.backHome}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

