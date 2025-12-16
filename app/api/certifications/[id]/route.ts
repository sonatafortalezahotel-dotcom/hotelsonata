import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { certifications, certificationTranslations } from "@/lib/db/schema";
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
    const { name, description, imageUrl, active, order, locale = "pt" } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Campo obrigatório: name" },
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
      .update(certifications)
      .set({
        name,
        description: description || null,
        imageUrl,
        active: active ?? true,
        order: order || 0,
        updatedAt: new Date(),
      })
      .where(eq(certifications.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Certificação não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar ou criar tradução
    const [existingTranslation] = await db
      .select()
      .from(certificationTranslations)
      .where(
        and(
          eq(certificationTranslations.certificationId, id),
          eq(certificationTranslations.locale, locale)
        )
      )
      .limit(1);

    if (existingTranslation) {
      await db
        .update(certificationTranslations)
        .set({
          name,
          description: description || null,
          updatedAt: new Date(),
        })
        .where(eq(certificationTranslations.id, existingTranslation.id));
    } else {
      await db.insert(certificationTranslations).values({
        certificationId: id,
        locale,
        name,
        description: description || null,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar certificação:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar certificação" },
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
      .delete(certifications)
      .where(eq(certifications.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Certificação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Certificação excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir certificação:", error);
    return NextResponse.json(
      { error: "Erro ao excluir certificação" },
      { status: 500 }
    );
  }
}

