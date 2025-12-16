import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sustainability, sustainabilityTranslations } from "@/lib/db/schema";
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
    const { title, description, imageUrl, category, active, order, locale = "pt" } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Campos obrigatórios: title, description" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(sustainability)
      .set({
        title,
        description,
        imageUrl: imageUrl || null,
        category: category || null,
        active: active ?? true,
        order: order || 0,
        updatedAt: new Date(),
      })
      .where(eq(sustainability.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Sustentabilidade não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar ou criar tradução
    const [existingTranslation] = await db
      .select()
      .from(sustainabilityTranslations)
      .where(
        and(
          eq(sustainabilityTranslations.sustainabilityId, id),
          eq(sustainabilityTranslations.locale, locale)
        )
      )
      .limit(1);

    if (existingTranslation) {
      await db
        .update(sustainabilityTranslations)
        .set({
          title,
          description,
          updatedAt: new Date(),
        })
        .where(eq(sustainabilityTranslations.id, existingTranslation.id));
    } else {
      await db.insert(sustainabilityTranslations).values({
        sustainabilityId: id,
        locale,
        title,
        description,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar sustentabilidade:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar sustentabilidade" },
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
      .delete(sustainability)
      .where(eq(sustainability.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Sustentabilidade não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Sustentabilidade excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir sustentabilidade:", error);
    return NextResponse.json(
      { error: "Erro ao excluir sustentabilidade" },
      { status: 500 }
    );
  }
}

