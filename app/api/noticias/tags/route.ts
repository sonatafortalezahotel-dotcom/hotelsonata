import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  blogTags,
  blogTagTranslations,
  blogPostTags,
  blogPosts,
} from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";

/**
 * GET tags with optional locale (for names) and post count per locale
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";
    const withCount = searchParams.get("count") !== "false";

    const tags = await db
      .select({ id: blogTags.id, slug: blogTags.slug })
      .from(blogTags)
      .orderBy(asc(blogTags.slug));

    const result = await Promise.all(
      tags.map(async (tag) => {
        const [tr] = await db
          .select({ name: blogTagTranslations.name })
          .from(blogTagTranslations)
          .where(
            and(
              eq(blogTagTranslations.tagId, tag.id),
              eq(blogTagTranslations.locale, locale)
            )
          )
          .limit(1);

        let count = 0;
        if (withCount) {
          const rows = await db
            .select({ postId: blogPostTags.postId })
            .from(blogPostTags)
            .innerJoin(blogPosts, eq(blogPosts.id, blogPostTags.postId))
            .where(
              and(
                eq(blogPostTags.tagId, tag.id),
                eq(blogPosts.status, "published"),
                eq(blogPosts.locale, locale)
              )
            );
          count = rows.length;
        }

        return {
          id: tag.id,
          slug: tag.slug,
          name: tr?.name ?? "",
          postCount: count,
        };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar tags do blog:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, translations = {} } = body; // translations: { pt: { name }, en: {...}, es: {...} }

    if (!slug) {
      return NextResponse.json(
        { error: "Campo obrigatório: slug" },
        { status: 400 }
      );
    }

    const slugNorm = String(slug).toLowerCase().trim().replace(/\s+/g, "-");
    const [existing] = await db
      .select()
      .from(blogTags)
      .where(eq(blogTags.slug, slugNorm))
      .limit(1);
    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma tag com este slug" },
        { status: 400 }
      );
    }

    const [newTag] = await db
      .insert(blogTags)
      .values({ slug: slugNorm })
      .returning();

    if (!newTag) {
      return NextResponse.json(
        { error: "Erro ao criar tag" },
        { status: 500 }
      );
    }

    for (const [loc, data] of Object.entries(translations as Record<string, { name?: string }>)) {
      if (data?.name) {
        await db.insert(blogTagTranslations).values({
          tagId: newTag.id,
          locale: loc,
          name: data.name,
        });
      }
    }

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar tag do blog:", error);
    return NextResponse.json(
      { error: "Erro ao criar tag" },
      { status: 500 }
    );
  }
}
