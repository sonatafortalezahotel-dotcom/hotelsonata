"use client";

import Link from "next/link";
import Image from "@/lib/app-image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface BlogPostCardPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  publishedAt?: string | Date | null;
  categories?: Array<{ id: number; slug: string; name: string }>;
  tags?: Array<{ id: number; slug: string; name: string }>;
}

interface BlogPostCardProps {
  post: BlogPostCardPost;
  basePath?: string; // e.g. "/noticias" or "/en/noticias"
  readMoreLabel?: string;
  publishedLabel?: string; // "Publicado em" / "Published on"
}

export function BlogPostCard({
  post,
  basePath = "/noticias",
  readMoreLabel = "Ler mais",
  publishedLabel = "Publicado em",
}: BlogPostCardProps) {
  const href = `${basePath}/${encodeURIComponent(post.slug)}`;
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {post.featuredImageUrl && (
        <Link href={href} className="block aspect-[16/10] relative bg-muted overflow-hidden">
          <Image
            src={post.featuredImageUrl}
            alt=""
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {post.categories?.map((c) => (
            <Badge key={c.id} variant="secondary" asChild>
              <Link href={`${basePath}?category=${encodeURIComponent(c.slug)}`}>
                {c.name || c.slug}
              </Link>
            </Badge>
          ))}
          {post.tags?.slice(0, 3).map((t) => (
            <Badge key={t.id} variant="outline" asChild>
              <Link href={`${basePath}?tag=${encodeURIComponent(t.slug)}`}>
                {t.name || t.slug}
              </Link>
            </Badge>
          ))}
        </div>
        <Link href={href}>
          <h2 className="text-lg font-semibold leading-tight line-clamp-2 hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>
        {date && (
          <p className="text-xs text-muted-foreground" aria-label={publishedLabel}>
            {publishedLabel} {date}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="link" className="p-0 h-auto font-medium" asChild>
          <Link href={href}>{readMoreLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
