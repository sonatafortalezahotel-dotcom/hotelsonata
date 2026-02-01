"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface BlogPostHeaderProps {
  title: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  authorName?: string | null;
  authorUrl?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  categories?: Array<{ id: number; slug: string; name: string }>;
  tags?: Array<{ id: number; slug: string; name: string }>;
  basePath?: string;
  publishedLabel?: string;
  updatedLabel?: string;
  className?: string;
}

export function BlogPostHeader({
  title,
  excerpt,
  featuredImageUrl,
  authorName,
  authorUrl,
  publishedAt,
  updatedAt,
  categories = [],
  tags = [],
  basePath = "/blog",
  publishedLabel = "Publicado em",
  updatedLabel = "Atualizado em",
  className,
}: BlogPostHeaderProps) {
  const isBlobImage = !!featuredImageUrl?.includes("blob.vercel-storage.com");
  const publishedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  const updatedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <header className={cn("space-y-4", className)}>
      {featuredImageUrl && (
        <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden bg-muted">
          <Image
            src={featuredImageUrl}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized={isBlobImage}
          />
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
      {(authorName || publishedDate || updatedDate || categories.length > 0 || tags.length > 0) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {authorName && (
            <span>
              {authorUrl ? (
                <a href={authorUrl} className="hover:text-foreground" rel="author">
                  {authorName}
                </a>
              ) : (
                <span>{authorName}</span>
              )}
            </span>
          )}
          {publishedDate && (
            <time dateTime={publishedAt!}>
              {publishedLabel} {publishedDate}
            </time>
          )}
          {updatedDate && updatedAt !== publishedAt && (
            <time dateTime={updatedAt!}>
              {updatedLabel} {updatedDate}
            </time>
          )}
        </div>
      )}
      {(categories.length > 0 || tags.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`${basePath}?category=${encodeURIComponent(c.slug)}`}
              className="inline-flex items-center rounded-full border border-input bg-background px-2.5 py-0.5 text-xs font-medium hover:bg-muted"
            >
              {c.name || c.slug}
            </a>
          ))}
          {tags.map((t) => (
            <a
              key={t.id}
              href={`${basePath}?tag=${encodeURIComponent(t.slug)}`}
              className="inline-flex items-center rounded-full border border-input bg-background px-2.5 py-0.5 text-xs font-medium hover:bg-muted"
            >
              {t.name || t.slug}
            </a>
          ))}
        </div>
      )}
      {excerpt && <p className="text-lg text-muted-foreground">{excerpt}</p>}
    </header>
  );
}
