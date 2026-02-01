import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  blogCategories,
  blogCategoryTranslations,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const {
      slug,
      order,
      active,
      locale = "pt",
      translations = {},
      name,
      description,
    } = body;

    const slugNorm =
      slug != null ? String(slug).toLowerCase().trim().replace(/\s+/g, "-") : undefined;

    if (slugNorm) {
      const [existing] = await db
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.slug, slugNorm))
        .limit(1);
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { error: "Já existe uma categoria com este slug" },
          { status: 400 }
        );
      }
    }

    const updates: Record<string, unknown> = {};
    if (slugNorm !== undefined) updates.slug = slugNorm;
    if (order !== undefined) updates.order = Number(order);
    if (active !== undefined) updates.active = Boolean(active);

    if (Object.keys(updates).length > 0) {
      const [updated] = await db
        .update(blogCategories)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(blogCategories.id, id))
        .returning();
      if (!updated) {
        return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
      }
    } else {
      const [existing] = await db
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.id, id))
        .limit(1);
      if (!existing) {
        return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
      }
    }

    const translationsInput: Record<string, { name?: string; description?: string }> = {
      ...(translations as Record<string, { name?: string; description?: string }>),
    };
    if (name || description) {
      translationsInput[locale] = {
        name: name ?? translationsInput[locale]?.name,
        description: description ?? translationsInput[locale]?.description,
      };
    }

    for (const [loc, data] of Object.entries(translationsInput)) {
      if (!data?.name && data?.description == null) continue;
      const [existingTr] = await db
        .select({ id: blogCategoryTranslations.id })
        .from(blogCategoryTranslations)
        .where(
          and(
            eq(blogCategoryTranslations.categoryId, id),
            eq(blogCategoryTranslations.locale, loc)
          )
        )
        .limit(1);
      if (existingTr) {
        await db
          .update(blogCategoryTranslations)
          .set({
            ...(data.name !== undefined && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
            updatedAt: new Date(),
          })
          .where(eq(blogCategoryTranslations.id, existingTr.id));
      } else if (data.name) {
        await db.insert(blogCategoryTranslations).values({
          categoryId: id,
          locale: loc,
          name: data.name,
          description: data.description ?? null,
        });
      }
    }

    const [cat] = await db
      .select({
        id: blogCategories.id,
        slug: blogCategories.slug,
        order: blogCategories.order,
        active: blogCategories.active,
      })
      .from(blogCategories)
      .where(eq(blogCategories.id, id))
      .limit(1);

    const [tr] = await db
      .select({ name: blogCategoryTranslations.name, description: blogCategoryTranslations.description })
      .from(blogCategoryTranslations)
      .where(
        and(
          eq(blogCategoryTranslations.categoryId, id),
          eq(blogCategoryTranslations.locale, locale)
        )
      )
      .limit(1);

    return NextResponse.json({
      ...cat,
      name: tr?.name ?? "",
      description: tr?.description ?? null,
    });
  } catch (error) {
    console.error("Erro ao atualizar categoria do blog:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
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
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const [deleted] = await db
      .delete(blogCategories)
      .where(eq(blogCategories.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Categoria excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir categoria do blog:", error);
    return NextResponse.json(
      { error: "Erro ao excluir categoria" },
      { status: 500 }
    );
  }
}
