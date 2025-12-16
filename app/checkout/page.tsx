"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { CreditCard, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface Reservation {
  id: number;
  confirmationNumber: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  totalPrice: number;
  room: {
    code: string;
    name: string;
  };
}

export default function CheckoutPage() {
  const { locale } = useLanguage();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");
  
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const labels = {
    pt: {
      title: "Finalizar Pagamento",
      subtitle: "Complete seu pagamento para confirmar sua reserva",
      reservationSummary: "Resumo da Reserva",
      paymentMethod: "Método de Pagamento",
      total: "Total",
      payNow: "PAGAR AGORA",
      processing: "Processando pagamento...",
      success: "Pagamento confirmado com sucesso!",
      error: "Erro ao processar pagamento",
      secure: "Pagamento 100% seguro",
      guaranteed: "Melhor tarifa garantida",
      freeCancellation: "Cancelamento gratuito até 24h antes",
    },
    es: {
      title: "Finalizar Pago",
      subtitle: "Complete su pago para confirmar su reserva",
      reservationSummary: "Resumen de la Reserva",
      paymentMethod: "Método de Pago",
      total: "Total",
      payNow: "PAGAR AHORA",
      processing: "Procesando pago...",
      success: "¡Pago confirmado con éxito!",
      error: "Error al procesar el pago",
      secure: "Pago 100% seguro",
      guaranteed: "Mejor tarifa garantizada",
      freeCancellation: "Cancelación gratuita hasta 24h antes",
    },
    en: {
      title: "Complete Payment",
      subtitle: "Complete your payment to confirm your reservation",
      reservationSummary: "Reservation Summary",
      paymentMethod: "Payment Method",
      total: "Total",
      payNow: "PAY NOW",
      processing: "Processing payment...",
      success: "Payment confirmed successfully!",
      error: "Error processing payment",
      secure: "100% secure payment",
      guaranteed: "Best rate guaranteed",
      freeCancellation: "Free cancellation up to 24h before",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;
  const dateLocale = locale === "pt" ? ptBR : undefined;

  useEffect(() => {
    if (!reservationId) {
      toast.error(
        locale === "en"
          ? "Reservation ID is required"
          : locale === "es"
          ? "Se requiere ID de reserva"
          : "ID da reserva é obrigatório"
      );
      router.push("/reservas");
      return;
    }

    // Buscar dados da reserva
    async function fetchReservation() {
      try {
        const response = await fetch(`/api/reservations?list=true`);
        if (response.ok) {
          const data = await response.json();

          const reservationIdNumber = Number.parseInt(reservationId!, 10);
          if (Number.isNaN(reservationIdNumber)) {
            toast.error(
              locale === "en"
                ? "Invalid reservation ID"
                : locale === "es"
                ? "ID de reserva inválido"
                : "ID da reserva inválido",
            );
            router.push("/reservas");
            return;
          }

          const reserva = data.find(
            (r: any) => r.id === reservationIdNumber,
          );
          if (reserva) {
            setReservation({
              id: reserva.id,
              confirmationNumber: reserva.confirmationNumber,
              checkIn: reserva.checkIn,
              checkOut: reserva.checkOut,
              totalNights: reserva.totalNights,
              totalPrice: reserva.totalPrice,
              room: {
                code: reserva.roomCode,
                name: reserva.roomCode,
              },
            });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar reserva:", error);
        toast.error(t.error);
      } finally {
        setLoading(false);
      }
    }

    fetchReservation();
  }, [reservationId, locale, t.error, router]);

  const formatPrice = (price: number) => {
    return formatPriceCurrency(price, locale);
  };

  const handlePayment = async () => {
    if (!reservation) return;

    setProcessing(true);

    try {
      // Criar intent de pagamento
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: reservation.id,
          amount: reservation.totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.error);
      }

      // TODO: Integrar com Stripe Checkout ou Mercado Pago
      // Por enquanto, simular pagamento bem-sucedido
      toast.success(t.processing);

      // Simular confirmação (remover quando integrar gateway real)
      setTimeout(async () => {
        const confirmResponse = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationId: reservation.id,
            paymentIntentId: data.paymentIntent.id,
            status: "succeeded",
          }),
        });

        if (confirmResponse.ok) {
          toast.success(t.success);
          router.push(
            `/reservas/confirmacao?confirmation=${reservation.confirmationNumber}`
          );
        } else {
          throw new Error(t.error);
        }
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error);
      toast.error(error.message || t.error);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">
                {locale === "en"
                  ? "Reservation not found"
                  : locale === "es"
                  ? "Reserva no encontrada"
                  : "Reserva não encontrada"}
              </p>
              <Button onClick={() => router.push("/reservas")} variant="outline">
                {locale === "en"
                  ? "Back to Reservations"
                  : locale === "es"
                  ? "Volver a Reservas"
                  : "Voltar para Reservas"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resumo da Reserva */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.reservationSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Número de Confirmação</span>
                  <span className="font-mono font-semibold">{reservation.confirmationNumber}</span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Check-in</span>
                    <span className="font-medium">
                      {format(new Date(reservation.checkIn), "dd/MM/yyyy", {
                        locale: dateLocale,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Check-out</span>
                    <span className="font-medium">
                      {format(new Date(reservation.checkOut), "dd/MM/yyyy", {
                        locale: dateLocale,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Noites</span>
                    <span className="font-medium">{reservation.totalNights}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold">{t.total}</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(reservation.totalPrice)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Segurança */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span>{t.secure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>{t.guaranteed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>{t.freeCancellation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pagamento */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t.paymentMethod}
                </CardTitle>
                <CardDescription>
                  {locale === "en"
                    ? "Select your payment method"
                    : locale === "es"
                    ? "Seleccione su método de pago"
                    : "Selecione seu método de pagamento"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="p-4 border rounded-lg bg-background">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {locale === "en"
                          ? "Credit/Debit Card"
                          : locale === "es"
                          ? "Tarjeta de Crédito/Débito"
                          : "Cartão de Crédito/Débito"}
                      </span>
                      <Badge variant="secondary">
                        {locale === "en" ? "Recommended" : locale === "es" ? "Recomendado" : "Recomendado"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.total}</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(reservation.totalPrice)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  size="lg"
                  className="w-full"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t.processing}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      {t.payNow}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {locale === "en"
                    ? "Your payment information is encrypted and secure"
                    : locale === "es"
                    ? "Su información de pago está encriptada y segura"
                    : "Suas informações de pagamento estão criptografadas e seguras"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

