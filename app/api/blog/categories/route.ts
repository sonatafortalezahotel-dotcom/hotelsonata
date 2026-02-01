import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  blogCategories,
  blogCategoryTranslations,
  blogPostCategories,
  blogPosts,
} from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";

/**
 * GET categories with optional locale (for names) and post count per locale
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";
    const withCount = searchParams.get("count") !== "false"; // count published posts per locale
    const includeInactive = searchParams.get("all") === "true";

    const baseQuery = db
      .select({
        id: blogCategories.id,
        slug: blogCategories.slug,
        order: blogCategories.order,
        active: blogCategories.active,
      })
      .from(blogCategories);

    const categories = await (includeInactive
      ? baseQuery
      : baseQuery.where(eq(blogCategories.active, true))
    ).orderBy(asc(blogCategories.order));

    const result = await Promise.all(
      categories.map(async (cat) => {
        const [tr] = await db
          .select({ name: blogCategoryTranslations.name, description: blogCategoryTranslations.description })
          .from(blogCategoryTranslations)
          .where(
            and(
              eq(blogCategoryTranslations.categoryId, cat.id),
              eq(blogCategoryTranslations.locale, locale)
            )
          )
          .limit(1);

        let count = 0;
        if (withCount) {
          const rows = await db
            .select({ postId: blogPostCategories.postId })
            .from(blogPostCategories)
            .innerJoin(blogPosts, eq(blogPosts.id, blogPostCategories.postId))
            .where(
              and(
                eq(blogPostCategories.categoryId, cat.id),
                eq(blogPosts.status, "published"),
                eq(blogPosts.locale, locale)
              )
            );
          count = rows.length;
        }

        return {
          id: cat.id,
          slug: cat.slug,
          order: cat.order,
          active: cat.active,
          name: tr?.name ?? "",
          description: tr?.description ?? null,
          postCount: count,
        };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar categorias do blog:", error);
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, order = 0, active = true, translations = {} } = body; // translations: { pt: { name, description }, en: {...}, es: {...} }

    if (!slug) {
      return NextResponse.json(
        { error: "Campo obrigatório: slug" },
        { status: 400 }
      );
    }

    const slugNorm = String(slug).toLowerCase().trim().replace(/\s+/g, "-");
    const [existing] = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.slug, slugNorm))
      .limit(1);
    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma categoria com este slug" },
        { status: 400 }
      );
    }

    const [newCat] = await db
      .insert(blogCategories)
      .values({
        slug: slugNorm,
        order: Number(order),
        active: Boolean(active),
      })
      .returning();

    if (!newCat) {
      return NextResponse.json(
        { error: "Erro ao criar categoria" },
        { status: 500 }
      );
    }

    for (const [loc, data] of Object.entries(translations as Record<string, { name?: string; description?: string }>)) {
      if (data?.name) {
        await db.insert(blogCategoryTranslations).values({
          categoryId: newCat.id,
          locale: loc,
          name: data.name,
          description: data.description ?? null,
        });
      }
    }

    return NextResponse.json(newCat, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar categoria do blog:", error);
    return NextResponse.json(
      { error: "Erro ao criar categoria" },
      { status: 500 }
    );
  }
}
