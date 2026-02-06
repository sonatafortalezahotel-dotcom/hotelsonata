"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function BlogPagination({
  currentPage,
  totalPages,
  basePath = "/noticias",
}: BlogPaginationProps) {
  const searchParams = useSearchParams();

  const makeHref = (page: number) => {
    const next = new URLSearchParams(searchParams?.toString() || "");
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    const qs = next.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-center gap-2 pt-8"
      aria-label="Navegação de páginas"
    >
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage <= 1}
        aria-label="Página anterior"
      >
        <Link href={makeHref(currentPage - 1)} prefetch={false}>
          ‹
        </Link>
      </Button>
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => {
            if (totalPages <= 7) return true;
            return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
          })
          .map((p, idx, arr) => {
            const showEllipsisBefore = idx > 0 && p - arr[idx - 1] > 1;
            return (
              <span key={p} className="flex items-center gap-1">
                {showEllipsisBefore && <span className="px-1 text-muted-foreground">…</span>}
                <Button
                  variant={p === currentPage ? "default" : "outline"}
                  size="icon"
                  className="min-w-9"
                  asChild={p !== currentPage}
                  aria-current={p === currentPage ? "page" : undefined}
                  aria-label={`Página ${p}`}
                >
                  {p === currentPage ? (
                    <span>{p}</span>
                  ) : (
                    <Link href={makeHref(p)} prefetch={false}>
                      {p}
                    </Link>
                  )}
                </Button>
              </span>
            );
          })}
      </div>
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage >= totalPages}
        aria-label="Próxima página"
      >
        <Link href={makeHref(currentPage + 1)} prefetch={false}>
          ›
        </Link>
      </Button>
    </nav>
  );
}
