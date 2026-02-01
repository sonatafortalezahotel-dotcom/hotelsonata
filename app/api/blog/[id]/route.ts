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

async function postWithCategoriesAndTags(postId: number, locale: string) {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId)).limit(1);
  if (!post) return null;

  const categoryIds = await db
    .select({ categoryId: blogPostCategories.categoryId })
    .from(blogPostCategories)
    .where(eq(blogPostCategories.postId, postId));
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
    .where(eq(blogPostTags.postId, postId));
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
          and(eq(blogTagTranslations.tagId, tagId), eq(blogTagTranslations.locale, locale))
        )
        .limit(1);
      return { id: tagId, slug: t?.slug, name: tr?.name ?? "" };
    })
  );

  return { ...post, categories, tags };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const locale = new URL(request.url).searchParams.get("locale") || "pt";

    const post = await postWithCategoriesAndTags(id, locale);
    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return NextResponse.json(
      { error: "Erro ao buscar post" },
      { status: 500 }
    );
  }
}

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
      locale = "pt",
      title,
      excerpt,
      content,
      featuredImageUrl,
      authorName,
      authorUrl,
      publishedAt,
      status,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
      canonicalUrl,
      categoryIds = [],
      tagIds = [],
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Campo obrigatório: title" },
        { status: 400 }
      );
    }

    const slugNorm = slug != null ? String(slug).toLowerCase().trim().replace(/\s+/g, "-") : undefined;

    if (slugNorm) {
      const [existing] = await db
        .select()
        .from(blogPosts)
        .where(
          and(eq(blogPosts.slug, slugNorm), eq(blogPosts.locale, locale))
        )
        .limit(1);
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { error: "Já existe um post com este slug neste idioma" },
          { status: 400 }
        );
      }
    }

    const [updated] = await db
      .update(blogPosts)
      .set({
        ...(slugNorm !== undefined && { slug: slugNorm }),
        title,
        excerpt: excerpt ?? null,
        content: content ?? null,
        featuredImageUrl: featuredImageUrl ?? null,
        authorName: authorName ?? null,
        authorUrl: authorUrl ?? null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        ...(status !== undefined && { status: status === "published" ? "published" as const : "draft" as const }),
        metaTitle: metaTitle ?? null,
        metaDescription: metaDescription ?? null,
        metaKeywords: metaKeywords ?? null,
        ogImage: ogImage ?? null,
        canonicalUrl: canonicalUrl ?? null,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    // Replace categories and tags
    await db.delete(blogPostCategories).where(eq(blogPostCategories.postId, id));
    await db.delete(blogPostTags).where(eq(blogPostTags.postId, id));
    for (const categoryId of categoryIds) {
      await db
        .insert(blogPostCategories)
        .values({ postId: id, categoryId: Number(categoryId) })
        .catch(() => {});
    }
    for (const tagId of tagIds) {
      await db
        .insert(blogPostTags)
        .values({ postId: id, tagId: Number(tagId) })
        .catch(() => {});
    }

    const post = await postWithCategoriesAndTags(id, locale);
    return NextResponse.json(post ?? updated);
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar post" },
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
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Post excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir post:", error);
    return NextResponse.json(
      { error: "Erro ao excluir post" },
      { status: 500 }
    );
  }
}
