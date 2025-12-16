import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, eventTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
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
    const { type, title, description, imageUrl, gallery, capacity, facilities, active, order, translatedFacilities, locale = "pt" } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: "Campos obrigatórios: type, title" },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      return NextResponse.json(
        { error: "imageUrl é obrigatório e deve ser uma URL válida" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(events)
      .set({
        type,
        imageUrl,
        gallery: gallery || null,
        capacity: capacity || null,
        facilities: facilities || null,
        active: active ?? true,
        order: order || 0,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar ou criar tradução
    const [existingTranslation] = await db
      .select()
      .from(eventTranslations)
      .where(
        and(
          eq(eventTranslations.eventId, id),
          eq(eventTranslations.locale, locale)
        )
      )
      .limit(1);

    if (existingTranslation) {
      await db
        .update(eventTranslations)
        .set({
          title,
          description: description || "",
          facilities: translatedFacilities || null,
          updatedAt: new Date(),
        })
        .where(eq(eventTranslations.id, existingTranslation.id));
    } else {
      await db.insert(eventTranslations).values({
        eventId: id,
        locale,
        title,
        description: description || "",
        facilities: translatedFacilities || null,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar evento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const [deleted] = await db
      .delete(events)
      .where(eq(events.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Evento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    return NextResponse.json(
      { error: "Erro ao excluir evento" },
      { status: 500 }
    );
  }
}

