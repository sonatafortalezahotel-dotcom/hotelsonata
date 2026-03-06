import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gastronomy, gastronomyTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Suporta tanto Promise quanto objeto direto (compatibilidade Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id) || !resolvedParams.id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const { type, title, description, imageUrl, gallery, schedule, active, order, menu, tags, locale = "pt" } = body;

    // Validação mais detalhada
    if (!type || typeof type !== "string" || !type.trim()) {
      return NextResponse.json(
        { error: "Campo 'type' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Campo 'title' é obrigatório e deve ser uma string válida" },
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
      .update(gastronomy)
      .set({
        type,
        imageUrl,
        gallery: gallery || null,
        schedule: schedule || null,
        active: active ?? true,
        order: order || 0,
        updatedAt: new Date(),
      })
      .where(eq(gastronomy.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Gastronomia não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar ou criar tradução
    const [existingTranslation] = await db
      .select()
      .from(gastronomyTranslations)
      .where(
        and(
          eq(gastronomyTranslations.gastronomyId, id),
          eq(gastronomyTranslations.locale, locale)
        )
      )
      .limit(1);

    const tagsValue = Array.isArray(tags) ? tags : (typeof tags === "string" ? tags.split(",").map((s: string) => s.trim()).filter(Boolean) : null);
    if (existingTranslation) {
      await db
        .update(gastronomyTranslations)
        .set({
          title,
          description: description || "",
          menu: menu || null,
          tags: tagsValue,
          updatedAt: new Date(),
        })
        .where(eq(gastronomyTranslations.id, existingTranslation.id));
    } else {
      await db.insert(gastronomyTranslations).values({
        gastronomyId: id,
        locale,
        title,
        description: description || "",
        menu: menu || null,
        tags: tagsValue,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar gastronomia:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar gastronomia" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Suporta tanto Promise quanto objeto direto (compatibilidade Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id) || !resolvedParams.id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const [deleted] = await db
      .delete(gastronomy)
      .where(eq(gastronomy.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Gastronomia não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Gastronomia excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir gastronomia:", error);
    return NextResponse.json(
      { error: "Erro ao excluir gastronomia" },
      { status: 500 }
    );
  }
}

