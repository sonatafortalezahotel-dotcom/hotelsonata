import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogTags, blogTagTranslations } from "@/lib/db/schema";
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
    const { slug, locale = "pt", translations = {}, name } = body;

    const slugNorm =
      slug != null ? String(slug).toLowerCase().trim().replace(/\s+/g, "-") : undefined;

    if (slugNorm) {
      const [existing] = await db
        .select()
        .from(blogTags)
        .where(eq(blogTags.slug, slugNorm))
        .limit(1);
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { error: "Já existe uma tag com este slug" },
          { status: 400 }
        );
      }
    }

    if (slugNorm !== undefined) {
      const [updated] = await db
        .update(blogTags)
        .set({ slug: slugNorm, updatedAt: new Date() })
        .where(eq(blogTags.id, id))
        .returning();
      if (!updated) {
        return NextResponse.json({ error: "Tag não encontrada" }, { status: 404 });
      }
    } else {
      const [existing] = await db
        .select()
        .from(blogTags)
        .where(eq(blogTags.id, id))
        .limit(1);
      if (!existing) {
        return NextResponse.json({ error: "Tag não encontrada" }, { status: 404 });
      }
    }

    const translationsInput: Record<string, { name?: string }> = {
      ...(translations as Record<string, { name?: string }>),
    };
    if (name) {
      translationsInput[locale] = { name };
    }

    for (const [loc, data] of Object.entries(translationsInput)) {
      if (!data?.name) continue;
      const [existingTr] = await db
        .select({ id: blogTagTranslations.id })
        .from(blogTagTranslations)
        .where(
          and(
            eq(blogTagTranslations.tagId, id),
            eq(blogTagTranslations.locale, loc)
          )
        )
        .limit(1);
      if (existingTr) {
        await db
          .update(blogTagTranslations)
          .set({ name: data.name, updatedAt: new Date() })
          .where(eq(blogTagTranslations.id, existingTr.id));
      } else {
        await db.insert(blogTagTranslations).values({
          tagId: id,
          locale: loc,
          name: data.name,
        });
      }
    }

    const [tag] = await db
      .select({ id: blogTags.id, slug: blogTags.slug })
      .from(blogTags)
      .where(eq(blogTags.id, id))
      .limit(1);

    const [tr] = await db
      .select({ name: blogTagTranslations.name })
      .from(blogTagTranslations)
      .where(
        and(
          eq(blogTagTranslations.tagId, id),
          eq(blogTagTranslations.locale, locale)
        )
      )
      .limit(1);

    return NextResponse.json({
      ...tag,
      name: tr?.name ?? "",
    });
  } catch (error) {
    console.error("Erro ao atualizar tag do blog:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar tag" },
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
      .delete(blogTags)
      .where(eq(blogTags.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Tag não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Tag excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir tag do blog:", error);
    return NextResponse.json(
      { error: "Erro ao excluir tag" },
      { status: 500 }
    );
  }
}
