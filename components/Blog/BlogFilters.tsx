"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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

interface BlogFiltersProps {
  categories: BlogCategory[];
  tags: BlogTag[];
  currentCategory?: string | null;
  currentTag?: string | null;
  currentSort?: string;
  basePath?: string;
  translations?: {
    category?: string;
    tag?: string;
    sort?: string;
    sortRecent?: string;
    sortOldest?: string;
    clearFilters?: string;
  };
}

export function BlogFilters({
  categories,
  tags,
  currentCategory,
  currentTag,
  currentSort = "recent",
  basePath = "/noticias",
  translations = {},
}: BlogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = {
    category: translations.category ?? "Categoria",
    tag: translations.tag ?? "Tag",
    sort: translations.sort ?? "Ordenar",
    sortRecent: translations.sortRecent ?? "Mais recentes",
    sortOldest: translations.sortOldest ?? "Mais antigos",
    clearFilters: translations.clearFilters ?? "Limpar filtros",
  };

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams?.toString() || "");
      for (const [key, value] of Object.entries(updates)) {
        if (value == null || value === "") next.delete(key);
        else next.set(key, value);
      }
      next.delete("page");
      const qs = next.toString();
      router.push(qs ? `${basePath}?${qs}` : basePath);
    },
    [basePath, router, searchParams]
  );

  const hasFilters = currentCategory || currentTag || (currentSort && currentSort !== "recent");

  return (
    <div className="flex flex-wrap items-center gap-3">
      {categories.length > 0 && (
        <Select
          value={currentCategory || "all"}
          onValueChange={(v) => updateParams({ category: v === "all" ? null : v })}
        >
          <SelectTrigger className="w-[180px]" aria-label={t.category}>
            <SelectValue placeholder={t.category} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.category}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name || c.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {tags.length > 0 && (
        <Select
          value={currentTag || "all"}
          onValueChange={(v) => updateParams({ tag: v === "all" ? null : v })}
        >
          <SelectTrigger className="w-[160px]" aria-label={t.tag}>
            <SelectValue placeholder={t.tag} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.tag}</SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.slug}>
                {tag.name || tag.slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Select
        value={currentSort}
        onValueChange={(v) => updateParams({ sort: v })}
      >
        <SelectTrigger className="w-[160px]" aria-label={t.sort}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">{t.sortRecent}</SelectItem>
          <SelectItem value="oldest">{t.sortOldest}</SelectItem>
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(basePath)}
        >
          {t.clearFilters}
        </Button>
      )}
    </div>
  );
}
