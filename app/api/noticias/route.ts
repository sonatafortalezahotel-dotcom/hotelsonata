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
import { eq, and, desc, sql, like, or, inArray, type SQL, type SQLWrapper } from "drizzle-orm";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const localeParam = searchParams.get("locale");
    const locale = localeParam === "all" || !localeParam ? "all" : localeParam; // "pt" | "en" | "es" | "all" (admin)
    const statusParam = searchParams.get("status");
    const status = statusParam === "all" || statusParam === "draft" ? statusParam : "published"; // public default: published; admin can pass all | draft
    const categorySlug = searchParams.get("category");
    const tagSlug = searchParams.get("tag");
    const q = searchParams.get("q"); // search in title/excerpt
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10)));
    const sort = searchParams.get("sort") || "recent"; // recent | oldest

    // Build filter: post IDs by category and/or tag
    let postIdsByCategory: number[] | null = null;
    if (categorySlug) {
      const [cat] = await db
        .select({ id: blogCategories.id })
        .from(blogCategories)
        .where(and(eq(blogCategories.slug, categorySlug), eq(blogCategories.active, true)))
        .limit(1);
      if (cat) {
        const rows = await db
          .select({ postId: blogPostCategories.postId })
          .from(blogPostCategories)
          .where(eq(blogPostCategories.categoryId, cat.id));
        postIdsByCategory = rows.map((r) => r.postId);
      } else {
        postIdsByCategory = []; // category slug not found -> no posts
      }
    }

    let postIdsByTag: number[] | null = null;
    if (tagSlug) {
      const [tag] = await db
        .select({ id: blogTags.id })
        .from(blogTags)
        .where(eq(blogTags.slug, tagSlug))
        .limit(1);
      if (tag) {
        const rows = await db
          .select({ postId: blogPostTags.postId })
          .from(blogPostTags)
          .where(eq(blogPostTags.tagId, tag.id));
        postIdsByTag = rows.map((r) => r.postId);
      } else {
        postIdsByTag = []; // tag slug not found -> no posts
      }
    }

    const conditions: (SQLWrapper | SQL | undefined)[] = [
      locale === "all" ? undefined : eq(blogPosts.locale, locale),
      status === "all" ? undefined : eq(blogPosts.status, status),
      postIdsByCategory !== null
        ? postIdsByCategory.length > 0
          ? inArray(blogPosts.id, postIdsByCategory)
          : sql`1 = 0`
        : undefined,
      postIdsByTag !== null
        ? postIdsByTag.length > 0
          ? inArray(blogPosts.id, postIdsByTag)
          : sql`1 = 0`
        : undefined,
      q && q.trim() ? or(like(blogPosts.title, `%${q.trim()}%`), like(blogPosts.excerpt, `%${q.trim()}%`)) : undefined,
    ];
    const filteredConditions = conditions.filter(Boolean) as (SQLWrapper | SQL)[];

    const posts = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        locale: blogPosts.locale,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        featuredImageUrl: blogPosts.featuredImageUrl,
        authorName: blogPosts.authorName,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        status: blogPosts.status,
      })
      .from(blogPosts)
      .where(and(...filteredConditions))
      .orderBy(sort === "oldest" ? blogPosts.publishedAt : desc(blogPosts.publishedAt ?? blogPosts.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    // For each post, attach categories and tags (names for locale)
    const postsWithMeta = await Promise.all(
      posts.map(async (post) => {
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

        return { ...post, categories, tags };
      })
    );

    // Total count for pagination (same conditions)
    const [{ count: total }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(blogPosts)
      .where(and(...filteredConditions));

    return NextResponse.json({
      posts: postsWithMeta,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Erro ao buscar posts de notícias:", error);
    return NextResponse.json(
      { error: "Erro ao buscar posts de notícias" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
      status = "draft",
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
      canonicalUrl,
      categoryIds = [],
      tagIds = [],
    } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: "Campos obrigatórios: slug, title" },
        { status: 400 }
      );
    }

    const slugNorm = String(slug).toLowerCase().trim().replace(/\s+/g, "-");
    const [existing] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slugNorm), eq(blogPosts.locale, locale)))
      .limit(1);
    if (existing) {
      return NextResponse.json(
        { error: "Já existe um post com este slug neste idioma" },
        { status: 400 }
      );
    }

    const [newPost] = await db
      .insert(blogPosts)
      .values({
        slug: slugNorm,
        locale,
        title,
        excerpt: excerpt ?? null,
        content: content ?? null,
        featuredImageUrl: featuredImageUrl ?? null,
        authorName: authorName ?? null,
        authorUrl: authorUrl ?? null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        status: status === "published" ? "published" : "draft",
        metaTitle: metaTitle ?? null,
        metaDescription: metaDescription ?? null,
        metaKeywords: metaKeywords ?? null,
        ogImage: ogImage ?? null,
        canonicalUrl: canonicalUrl ?? null,
      })
      .returning();

    if (!newPost) {
      return NextResponse.json(
        { error: "Erro ao criar post" },
        { status: 500 }
      );
    }

    for (const categoryId of categoryIds) {
      await db.insert(blogPostCategories).values({
        postId: newPost.id,
        categoryId: Number(categoryId),
      }).catch(() => {});
    }
    for (const tagId of tagIds) {
      await db.insert(blogPostTags).values({
        postId: newPost.id,
        tagId: Number(tagId),
      }).catch(() => {});
    }

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar post de notícias:", error);
    return NextResponse.json(
      { error: "Erro ao criar post de notícias" },
      { status: 500 }
    );
  }
}
