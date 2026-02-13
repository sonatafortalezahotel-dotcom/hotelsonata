import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eventLeads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const VALID_STATUSES = ["new", "contacted", "quoted", "closed"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (status !== undefined) {
      if (typeof status !== "string" || !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
        return NextResponse.json(
          { error: "Status inválido. Use: new, contacted, quoted, closed" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Campo status é obrigatório" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(eventLeads)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(eventLeads.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Lead não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar lead de evento:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar lead" },
      { status: 500 }
    );
  }
}
