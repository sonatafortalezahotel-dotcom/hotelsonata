import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  blogPosts,
  blogCategories,
  blogTags,
  blogCategoryTranslations,
  blogTagTranslations,
  blogPostCategories,
  blogPostTags,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * GET post by slug + locale (public: only published)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const locale = new URL(request.url).searchParams.get("locale") || "pt";

    const [post] = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.slug, decodeURIComponent(slug)),
          eq(blogPosts.locale, locale),
          eq(blogPosts.status, "published")
        )
      )
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    const categoryIds = await db
      .select({ categoryId: blogPostCategories.categoryId })
      .from(blogPostCategories)
      .where(eq(blogPostCategories.postId, post.id));
    const categories = await Promise.all(
      categoryIds.map(async ({ categoryId }) => {
        const [cat] = await db
          .select({ slug: blogCategories.slug })
          .from(blogCategories)
          .where(eq(blogCategories.id, categoryId))
          .limit(1);
        const [tr] = await db
          .select({ name: blogCategoryTranslations.name })
          .from(blogCategoryTranslations)
          .where(
            and(
              eq(blogCategoryTranslations.categoryId, categoryId),
              eq(blogCategoryTranslations.locale, locale)
            )
          )
          .limit(1);
        return { id: categoryId, slug: cat?.slug, name: tr?.name ?? "" };
      })
    );

    const tagIds = await db
      .select({ tagId: blogPostTags.tagId })
      .from(blogPostTags)
      .where(eq(blogPostTags.postId, post.id));
    const tags = await Promise.all(
      tagIds.map(async ({ tagId }) => {
        const [t] = await db
          .select({ slug: blogTags.slug })
          .from(blogTags)
          .where(eq(blogTags.id, tagId))
          .limit(1);
        const [tr] = await db
          .select({ name: blogTagTranslations.name })
          .from(blogTagTranslations)
          .where(
            and(
              eq(blogTagTranslations.tagId, tagId),
              eq(blogTagTranslations.locale, locale)
            )
          )
          .limit(1);
        return { id: tagId, slug: t?.slug, name: tr?.name ?? "" };
      })
    );

    return NextResponse.json({ ...post, categories, tags });
  } catch (error) {
    console.error("Erro ao buscar post por slug:", error);
    return NextResponse.json(
      { error: "Erro ao buscar post" },
      { status: 500 }
    );
  }
}
