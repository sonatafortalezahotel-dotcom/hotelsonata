"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BlogCategory {
  id: number;
  slug: string;
  name: string;
  postCount?: number;
}

export interface BlogTag {
  id: number;
  slug: string;
  name: string;
  postCount?: number;
}

export interface RecentPost {
  id: number;
  slug: string;
  title: string;
  featuredImageUrl?: string | null;
}

interface BlogSidebarProps {
  locale: string;
  categories: BlogCategory[];
  tags: BlogTag[];
  recentPosts: RecentPost[];
  activeCategorySlug?: string | null;
  activeTagSlug?: string | null;
  searchQuery?: string;
  basePath?: string; // e.g. "/blog" or "/en/blog"
  translations?: {
    categories?: string;
    tags?: string;
    recentPosts?: string;
    search?: string;
    searchPlaceholder?: string;
  };
}

function localePrefix(locale: string): string {
  return locale === "pt" ? "" : `/${locale}`;
}

export function BlogSidebar({
  locale,
  categories,
  tags,
  recentPosts,
  activeCategorySlug,
  activeTagSlug,
  searchQuery,
  basePath = "/blog",
  translations = {},
}: BlogSidebarProps) {
  const prefix = basePath.startsWith("/") && !basePath.startsWith(`/${locale}`)
    ? localePrefix(locale) + basePath
    : basePath;

  const t = {
    categories: translations.categories ?? "Categorias",
    tags: translations.tags ?? "Tags",
    recentPosts: translations.recentPosts ?? "Posts recentes",
    search: translations.search ?? "Buscar",
    searchPlaceholder: translations.searchPlaceholder ?? "Buscar no blog...",
  };

  return (
    <aside
      className="w-full lg:w-72 shrink-0 space-y-8"
      aria-label="Sidebar do blog"
    >
      {/* Busca */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">{t.search}</h3>
        <form
          action={prefix}
          method="get"
          className="flex gap-2"
          role="search"
        >
          <input
            type="search"
            name="q"
            defaultValue={searchQuery}
            placeholder={t.searchPlaceholder}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label={t.searchPlaceholder}
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-9 px-4 hover:bg-primary/90"
          >
            {t.search}
          </button>
        </form>
      </section>

      {/* Categorias */}
      {categories.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-3">{t.categories}</h3>
          <ul className="space-y-1">
            {categories.map((cat) => {
              const href = cat.slug ? `${prefix}?category=${encodeURIComponent(cat.slug)}` : prefix;
              const isActive = activeCategorySlug === cat.slug;
              return (
                <li key={cat.id}>
                  <Link
                    href={href}
                    className={cn(
                      "block py-1.5 text-sm rounded-md px-2 -mx-2 transition-colors",
                      isActive
                        ? "font-medium text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="flex justify-between gap-2">
                      <span>{cat.name || cat.slug}</span>
                      {typeof cat.postCount === "number" && (
                        <span className="text-muted-foreground tabular-nums">{cat.postCount}</span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-3">{t.tags}</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const href = tag.slug ? `${prefix}?tag=${encodeURIComponent(tag.slug)}` : prefix;
              const isActive = activeTagSlug === tag.slug;
              return (
                <Link
                  key={tag.id}
                  href={href}
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input bg-background hover:bg-muted"
                  )}
                >
                  {tag.name || tag.slug}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Posts recentes */}
      {recentPosts.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-3">{t.recentPosts}</h3>
          <ul className="space-y-3">
            {recentPosts.map((post) => {
              const href = `${prefix}/${encodeURIComponent(post.slug)}`;
              return (
                <li key={post.id}>
                  <Link href={href} className="flex gap-3 group">
                    {post.featuredImageUrl && (
                      <div className="relative w-14 h-14 shrink-0 rounded overflow-hidden bg-muted">
                        <Image
                          src={post.featuredImageUrl}
                          alt=""
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="56px"
                        />
                      </div>
                    )}
                    <span className="text-sm text-foreground group-hover:text-primary line-clamp-2">
                      {post.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </aside>
  );
}
