import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { nearbyAttractions, nearbyAttractionTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      console.error("ID inválido recebido:", idParam);
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { code, name, distance, imageUrl, active, order, locale = "pt" } = body;
    
    console.log("Atualizando ponto turístico:", { id, code, name, distance });

    // Validação
    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { error: "Campo 'code' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Campo 'name' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    if (!distance || typeof distance !== "string" || !distance.trim()) {
      return NextResponse.json(
        { error: "Campo 'distance' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      return NextResponse.json(
        { error: "Campo 'imageUrl' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(nearbyAttractions)
      .set({
        code,
        imageUrl,
        active: active ?? true,
        order: order || 0,
        updatedAt: new Date(),
      })
      .where(eq(nearbyAttractions.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Ponto turístico não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar ou criar tradução
    const [existingTranslation] = await db
      .select()
      .from(nearbyAttractionTranslations)
      .where(
        and(
          eq(nearbyAttractionTranslations.nearbyAttractionId, id),
          eq(nearbyAttractionTranslations.locale, locale)
        )
      )
      .limit(1);

    if (existingTranslation) {
      await db
        .update(nearbyAttractionTranslations)
        .set({
          name,
          distance,
          updatedAt: new Date(),
        })
        .where(eq(nearbyAttractionTranslations.id, existingTranslation.id));
    } else {
      await db.insert(nearbyAttractionTranslations).values({
        nearbyAttractionId: id,
        locale,
        name,
        distance,
      });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Erro ao atualizar ponto turístico:", error);
    
    // Verificar se é erro de código duplicado
    if (error?.code === "23505" || error?.message?.includes("unique")) {
      return NextResponse.json(
        { error: "Já existe um ponto turístico com este código" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar ponto turístico" },
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
      console.error("ID inválido recebido:", idParam);
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const [deleted] = await db
      .delete(nearbyAttractions)
      .where(eq(nearbyAttractions.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Ponto turístico não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Ponto turístico excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir ponto turístico:", error);
    return NextResponse.json(
      { error: "Erro ao excluir ponto turístico" },
      { status: 500 }
    );
  }
}

