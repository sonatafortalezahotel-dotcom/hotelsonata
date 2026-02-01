import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import {
  generateArticleMetadata,
  generateBlogPostingStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/utils/seo";
import { StructuredData } from "@/components/SEO/StructuredData";
import { BlogPostHeader, BlogPostContent } from "@/components/Blog";
import { BlogSidebar } from "@/components/Blog";
import {
  blogPosts,
  blogCategories,
  blogTags,
  blogCategoryTranslations,
  blogTagTranslations,
  blogPostCategories,
  blogPostTags,
} from "@/lib/db/schema";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";

async function getPostBySlug(slug: string, locale: string) {
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

  if (!post) return null;

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
}

async function getSidebarData(locale: string) {
  const [categoriesRows, tagsRows, recentRows] = await Promise.all([
    db
      .select({
        id: blogCategories.id,
        slug: blogCategories.slug,
        order: blogCategories.order,
      })
      .from(blogCategories)
      .where(eq(blogCategories.active, true))
      .orderBy(blogCategories.order),
    db.select({ id: blogTags.id, slug: blogTags.slug }).from(blogTags).orderBy(blogTags.slug),
    db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        featuredImageUrl: blogPosts.featuredImageUrl,
      })
      .from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), eq(blogPosts.locale, locale)))
      .orderBy(desc(blogPosts.publishedAt ?? blogPosts.updatedAt))
      .limit(5),
  ]);

  const categories = await Promise.all(
    categoriesRows.map(async (c) => {
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

  const tags = await Promise.all(
    tagsRows.map(async (t) => {
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

  return {
    categories,
    tags,
    recentPosts: recentRows.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      featuredImageUrl: p.featuredImageUrl,
    })),
  };
}

export async function generateStaticParams() {
  const posts = await db
    .select({ slug: blogPosts.slug })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"));
  const slugs = [...new Set(posts.map((p) => p.slug))];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "pt";

  const post = await getPostBySlug(slug, locale);
  if (!post) {
    return {
      title: "Post não encontrado",
      description: "O post solicitado não foi encontrado.",
    };
  }

  const basePath = locale === "pt" ? "/blog" : `/${locale}/blog`;
  const path = `${basePath}/${post.slug}`;
  const canonical = post.canonicalUrl || `${SITE_URL}${path}`;
  const ogImage = post.ogImage || post.featuredImageUrl;
  const ogImageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${SITE_URL}${ogImage}`
    : `${SITE_URL}/og-image.jpg`;

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || post.title;

  const publishedTime = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : undefined;
  const modifiedTime = post.updatedAt
    ? new Date(post.updatedAt).toISOString()
    : publishedTime;

  return generateArticleMetadata(
    {
      title,
      description,
      keywords: post.metaKeywords ?? undefined,
      ogImage: ogImageUrl,
      canonicalUrl: canonical,
    },
    {
      locale,
      path,
      siteUrl: SITE_URL,
      article: {
        publishedTime,
        modifiedTime,
        authors: post.authorName ? [post.authorName] : undefined,
      },
    }
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "pt";

  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const sidebarData = await getSidebarData(locale);
  const basePath = locale === "pt" ? "/blog" : `/${locale}/blog`;
  const path = `${basePath}/${post.slug}`;
  const canonical = post.canonicalUrl || `${SITE_URL}${path}`;

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}${basePath}` },
    { name: post.title, url: canonical },
  ];
  const breadcrumbData = generateBreadcrumbStructuredData(breadcrumbItems);

  const publishedTime = post.publishedAt
    ? new Date(post.publishedAt).toISOString()
    : new Date(post.createdAt).toISOString();
  const modifiedTime = post.updatedAt
    ? new Date(post.updatedAt).toISOString()
    : publishedTime;
  const blogPostingData = generateBlogPostingStructuredData({
    headline: post.title,
    description: post.excerpt || post.metaDescription || undefined,
    image: post.ogImage || post.featuredImageUrl || undefined,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    url: canonical,
    author: post.authorName
      ? { name: post.authorName, url: post.authorUrl ?? undefined }
      : undefined,
    siteUrl: SITE_URL,
  });

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <StructuredData data={[breadcrumbData, blogPostingData]} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-foreground">Home</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={basePath} className="hover:text-foreground">Blog</Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground truncate max-w-[200px]" aria-current="page">
            {post.title}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <article className="flex-1 min-w-0">
          <BlogPostHeader
            title={post.title}
            excerpt={post.excerpt}
            featuredImageUrl={post.featuredImageUrl}
            authorName={post.authorName}
            authorUrl={post.authorUrl}
            publishedAt={post.publishedAt ? new Date(post.publishedAt).toISOString() : null}
            updatedAt={post.updatedAt ? new Date(post.updatedAt).toISOString() : null}
            categories={post.categories}
            tags={post.tags}
            basePath={basePath}
          />
          {post.content && (
            <div className="mt-8">
              <BlogPostContent content={post.content} />
            </div>
          )}
        </article>

        <aside className="lg:w-72 shrink-0 order-first lg:order-last">
          <BlogSidebar
            locale={locale}
            basePath={basePath}
            categories={sidebarData.categories}
            tags={sidebarData.tags}
            recentPosts={sidebarData.recentPosts}
          />
        </aside>
      </div>
    </div>
  );
}
