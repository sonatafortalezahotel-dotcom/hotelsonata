import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leisure, leisureTranslations } from "@/lib/db/schema";
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
    const { type, title, description, imageUrl, gallery, icon, active, order, schedule, locale = "pt" } = body;

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
      .update(leisure)
      .set({
        type,
        imageUrl,
        gallery: gallery || null,
        icon: icon || null,
        active: active ?? true,
        order: order || 0,
        updatedAt: new Date(),
      })
      .where(eq(leisure.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Lazer não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar ou criar tradução
    const [existingTranslation] = await db
      .select()
      .from(leisureTranslations)
      .where(
        and(
          eq(leisureTranslations.leisureId, id),
          eq(leisureTranslations.locale, locale)
        )
      )
      .limit(1);

    if (existingTranslation) {
      await db
        .update(leisureTranslations)
        .set({
          title,
          description: description || "",
          schedule: schedule || null,
          updatedAt: new Date(),
        })
        .where(eq(leisureTranslations.id, existingTranslation.id));
    } else {
      await db.insert(leisureTranslations).values({
        leisureId: id,
        locale,
        title,
        description: description || "",
        schedule: schedule || null,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar lazer:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar lazer" },
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
      .delete(leisure)
      .where(eq(leisure.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Lazer não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Lazer excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir lazer:", error);
    return NextResponse.json(
      { error: "Erro ao excluir lazer" },
      { status: 500 }
    );
  }
}

