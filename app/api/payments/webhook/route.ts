import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reservations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/payments/webhook
 * Webhook para receber confirmações de pagamento do Stripe
 * 
 * Configure no Stripe Dashboard:
 * - Endpoint: https://seu-dominio.com/api/payments/webhook
 * - Eventos: payment_intent.succeeded, payment_intent.payment_failed
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar assinatura do Stripe (importante para segurança)
    const signature = request.headers.get("stripe-signature");
    
    if (!signature && process.env.STRIPE_SECRET_KEY) {
      // Em produção, sempre validar assinatura
      return NextResponse.json(
        { error: "Assinatura do Stripe não encontrada" },
        { status: 400 }
      );
    }

    const body = await request.text();
    let event;

    // Se Stripe estiver configurado, validar evento
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        const Stripe = require("stripe");
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        event = stripe.webhooks.constructEvent(
          body,
          signature!,
          process.env.STRIPE_WEBHOOK_SECRET,
        );
      } catch (err: any) {
        console.error("Erro ao validar webhook do Stripe:", err);
        return NextResponse.json(
          { error: "Webhook inválido" },
          { status: 400 },
        );
      }
    } else {
      // Sem Stripe configurado não faz sentido aceitar webhooks
      return NextResponse.json(
        {
          error: "Webhook de pagamento não está configurado",
          message:
            "Defina STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET para receber notificações de pagamento.",
        },
        { status: 500 },
      );
    }

    // Processar eventos do Stripe
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const reservationId = parseInt(paymentIntent.metadata?.reservationId || "0");

      if (reservationId > 0) {
        await db
          .update(reservations)
          .set({
            paymentStatus: "paid",
            paymentDate: new Date(),
            status: "confirmed",
            updatedAt: new Date()
          })
          .where(eq(reservations.id, reservationId));

        console.log(`✅ Pagamento confirmado para reserva ${reservationId}`);
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      const reservationId = parseInt(paymentIntent.metadata?.reservationId || "0");

      if (reservationId > 0) {
        await db
          .update(reservations)
          .set({
            paymentStatus: "failed",
            updatedAt: new Date()
          })
          .where(eq(reservations.id, reservationId));

        console.log(`❌ Pagamento falhou para reserva ${reservationId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook", details: error.message },
      { status: 500 }
    );
  }
}

