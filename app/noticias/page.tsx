import { headers } from "next/headers";
import { Suspense } from "react";
import Link from "next/link";
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
import {
  BlogSidebar,
  BlogPostCard,
  BlogFilters,
  BlogPagination,
} from "@/components/Blog";

const DEFAULT_LIMIT = 12;

async function getBlogData(
  locale: string,
  page: number,
  category?: string | null,
  tag?: string | null,
  q?: string | null,
  sort?: string | null
) {
  let postIdsByCategory: number[] | null = null;
  if (category) {
    const [cat] = await db
      .select({ id: blogCategories.id })
      .from(blogCategories)
      .where(and(eq(blogCategories.slug, category), eq(blogCategories.active, true)))
      .limit(1);
    if (cat) {
      const rows = await db
        .select({ postId: blogPostCategories.postId })
        .from(blogPostCategories)
        .where(eq(blogPostCategories.categoryId, cat.id));
      postIdsByCategory = rows.map((r) => r.postId);
    } else {
      postIdsByCategory = [];
    }
  }

  let postIdsByTag: number[] | null = null;
  if (tag) {
    const [tagRow] = await db
      .select({ id: blogTags.id })
      .from(blogTags)
      .where(eq(blogTags.slug, tag))
      .limit(1);
    if (tagRow) {
      const rows = await db
        .select({ postId: blogPostTags.postId })
        .from(blogPostTags)
        .where(eq(blogPostTags.tagId, tagRow.id));
      postIdsByTag = rows.map((r) => r.postId);
    } else {
      postIdsByTag = [];
    }
  }

  const conditions: (SQLWrapper | SQL | undefined)[] = [
    eq(blogPosts.locale, locale),
    eq(blogPosts.status, "published"),
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
    q && q.trim()
      ? or(
          like(blogPosts.title, `%${q.trim()}%`),
          like(blogPosts.excerpt, `%${q.trim()}%`)
        )
      : undefined,
  ];
  const filteredConditions = conditions.filter(Boolean) as (SQLWrapper | SQL)[];

  const limit = DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

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
    .orderBy(
      sort === "oldest"
        ? blogPosts.publishedAt
        : desc(blogPosts.publishedAt ?? blogPosts.createdAt)
    )
    .limit(limit)
    .offset(offset);

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
          return { id: categoryId, slug: cat?.slug ?? "", name: tr?.name ?? "" };
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
          return { id: tagId, slug: t?.slug ?? "", name: tr?.name ?? "" };
        })
      );

      return { ...post, categories, tags };
    })
  );

  const [{ count: total }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(blogPosts)
    .where(and(...filteredConditions));

  return {
    posts: postsWithMeta,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getCategories(locale: string) {
  const rows = await db
    .select({
      id: blogCategories.id,
      slug: blogCategories.slug,
      order: blogCategories.order,
    })
    .from(blogCategories)
    .where(eq(blogCategories.active, true))
    .orderBy(blogCategories.order);

  return Promise.all(
    rows.map(async (c) => {
      const [tr] = await db
        .select({ name: blogCategoryTranslations.name })
        .from(blogCategoryTranslations)
        .where(
          and(
            eq(blogCategoryTranslations.categoryId, c.id),
            eq(blogCategoryTranslations.locale, locale)
          )
        )
        .limit(1);
      return { id: c.id, slug: c.slug, name: tr?.name ?? "" };
    })
  );
}

async function getTags(locale: string) {
  const rows = await db
    .select({ id: blogTags.id, slug: blogTags.slug })
    .from(blogTags)
    .orderBy(blogTags.slug);

  return Promise.all(
    rows.map(async (t) => {
      const [tr] = await db
        .select({ name: blogTagTranslations.name })
        .from(blogTagTranslations)
        .where(
          and(
            eq(blogTagTranslations.tagId, t.id),
            eq(blogTagTranslations.locale, locale)
          )
        )
        .limit(1);
      return { id: t.id, slug: t.slug, name: tr?.name ?? "" };
    })
  );
}

async function getRecentPosts(locale: string, limit = 5) {
  const rows = await db
    .select({
      id: blogPosts.id,
      slug: blogPosts.slug,
      title: blogPosts.title,
      featuredImageUrl: blogPosts.featuredImageUrl,
    })
    .from(blogPosts)
    .where(and(eq(blogPosts.status, "published"), eq(blogPosts.locale, locale)))
    .orderBy(desc(blogPosts.publishedAt ?? blogPosts.updatedAt))
    .limit(limit);

  return rows;
}

type BlogPageProps = {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    q?: string;
    page?: string;
    sort?: string;
  }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolved = await searchParams;
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "pt";
  const page = Math.max(1, parseInt(resolved.page || "1", 10));
  const category = resolved.category || null;
  const tag = resolved.tag || null;
  const q = resolved.q || null;
  const sort = resolved.sort || "recent";

  const basePath = locale === "pt" ? "/noticias" : `/${locale}/noticias`;

  const [listData, categories, tags, recentPosts] = await Promise.all([
    getBlogData(locale, page, category, tag, q, sort),
    getCategories(locale),
    getTags(locale),
    getRecentPosts(locale, 5),
  ]);

  const { posts, pagination } = listData;

  return (
    <div className="container mx-auto px-4 pt-12 pb-8 lg:pt-16 lg:pb-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Notícias
            </h1>
            <p className="text-muted-foreground">
              Novidades, dicas e histórias do Hotel Sonata de Iracema.
            </p>
          </div>

          <div className="mb-6">
          <Suspense fallback={null}>
            <BlogFilters
              categories={categories}
              tags={tags}
              currentCategory={category}
              currentTag={tag}
              currentSort={sort}
              basePath={basePath}
            />
          </Suspense>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-muted-foreground mb-4">
                Nenhum post encontrado.
              </p>
              <Link
                href={basePath}
                className="text-primary font-medium hover:underline"
              >
                Limpar filtros
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                    basePath={basePath}
                  />
                ))}
              </div>
              <Suspense fallback={null}>
                <BlogPagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  basePath={basePath}
                />
              </Suspense>
            </>
          )}
        </div>

        <aside className="lg:w-72 shrink-0 order-first lg:order-last">
          <BlogSidebar
            locale={locale}
            basePath={basePath}
            categories={categories}
            tags={tags}
            recentPosts={recentPosts.map((p) => ({
              id: p.id,
              slug: p.slug,
              title: p.title,
              featuredImageUrl: p.featuredImageUrl,
            }))}
            activeCategorySlug={category}
            activeTagSlug={tag}
            searchQuery={q ?? undefined}
          />
        </aside>
      </div>
    </div>
  );
}
