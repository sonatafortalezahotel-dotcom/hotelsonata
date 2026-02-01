import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";
const SITE_NAME = "Hotel Sonata de Iracema";
const RSS_MAX_ITEMS = 20;

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";

    const postsWithLocale = await db
      .select({
        slug: blogPosts.slug,
        locale: blogPosts.locale,
        title: blogPosts.title,
        excerpt: blogPosts.excerpt,
        featuredImageUrl: blogPosts.featuredImageUrl,
        publishedAt: blogPosts.publishedAt,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), eq(blogPosts.locale, locale)))
      .orderBy(desc(blogPosts.publishedAt ?? blogPosts.updatedAt))
      .limit(RSS_MAX_ITEMS);

    const items = postsWithLocale
      .map((post) => {
        const path =
          post.locale === "pt" ? `/blog/${post.slug}` : `/${post.locale}/blog/${post.slug}`;
        const link = `${SITE_URL}${path}`;
        const pubDate = post.publishedAt
          ? new Date(post.publishedAt).toUTCString()
          : new Date(post.updatedAt).toUTCString();
        const description = post.excerpt || post.title || "";
        const image =
          post.featuredImageUrl &&
          (post.featuredImageUrl.startsWith("http")
            ? post.featuredImageUrl
            : `${SITE_URL}${post.featuredImageUrl}`);
        return {
          title: escapeXml(post.title),
          link,
          description: escapeXml(description),
          pubDate,
          guid: link,
          image,
        };
      });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_NAME)} - Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Blog do Hotel Sonata de Iracema</description>
    <language>${locale === "pt" ? "pt-BR" : locale === "en" ? "en-US" : "es-ES"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      <description>${item.description}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>
      ${item.image ? `<enclosure url="${escapeXml(item.image)}" type="image/jpeg"/>` : ""}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar RSS do blog:", error);
    return NextResponse.json(
      { error: "Erro ao gerar feed" },
      { status: 500 }
    );
  }
}
