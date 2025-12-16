import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reservations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/payments/confirm
 * Confirma um pagamento após processamento do gateway
 * 
 * Body:
 * {
 *   reservationId: number,
 *   paymentIntentId: string,
 *   status: "succeeded" | "failed"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservationId, paymentIntentId, status } = body;

    if (!reservationId || !paymentIntentId || !status) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
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

    // Atualizar status do pagamento
    const paymentStatus = status === "succeeded" ? "paid" : "failed";
    const paymentDate = status === "succeeded" ? new Date() : null;
    const reservationStatus = status === "succeeded" ? "confirmed" : "pending";

    await db
      .update(reservations)
      .set({
        paymentStatus,
        paymentDate,
        status: reservationStatus,
        updatedAt: new Date()
      })
      .where(eq(reservations.id, reservationId));

    return NextResponse.json({
      success: true,
      reservation: {
        id: reservationId,
        paymentStatus,
        status: reservationStatus
      }
    });

  } catch (error: any) {
    console.error("Erro ao confirmar pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao confirmar pagamento", details: error.message },
      { status: 500 }
    );
  }
}

