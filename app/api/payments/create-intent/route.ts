import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reservations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/payments/create-intent
 * Cria um intent de pagamento para uma reserva
 * 
 * Body:
 * {
 *   reservationId: number,
 *   amount: number (em centavos)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservationId, amount } = body;

    if (!reservationId || !amount) {
      return NextResponse.json(
        { error: "reservationId e amount são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar reserva
    const reservation = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, reservationId))
      .limit(1);

    if (reservation.length === 0) {
      return NextResponse.json(
        { error: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    const reserva = reservation[0];

    // Verificar se já foi paga
    if (reserva.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Reserva já foi paga" },
        { status: 400 }
      );
    }

    // Integração real com Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          error: "Pagamento não está configurado",
          message:
            "Defina STRIPE_SECRET_KEY no .env.local para habilitar a cobrança online.",
        },
        { status: 500 },
      );
    }

    try {
      const Stripe = require("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-11-20.acacia",
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "brl",
        metadata: {
          reservationId: reservationId.toString(),
          confirmationNumber: reserva.confirmationNumber,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Atualizar reserva com payment intent ID
      await db
        .update(reservations)
        .set({
          paymentIntentId: paymentIntent.id,
          paymentStatus: "pending",
          updatedAt: new Date(),
        })
        .where(eq(reservations.id, reservationId));

      return NextResponse.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
        },
      });
    } catch (stripeError: any) {
      console.error("Erro ao criar payment intent no Stripe:", stripeError);
      return NextResponse.json(
        {
          error: "Erro ao processar pagamento no Stripe",
          details: stripeError.message,
        },
        { status: 500 },
      );
    }

  } catch (error: any) {
    console.error("Erro ao criar intent de pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento", details: error.message },
      { status: 500 },
    );
  }
}

