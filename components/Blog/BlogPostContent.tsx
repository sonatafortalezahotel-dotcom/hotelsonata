"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

// Sanitize HTML: remove apenas script/iframe/object/embed e atributos on* (preserva img e src)
function sanitizeHtml(html: string): string {
  if (typeof document === "undefined") {
    // Remove tags perigosas (script, iframe, etc.) e atributos on* (onclick, onerror, etc.)
    // Não remove <img> nem altera src/alt — imagens do editor devem aparecer no post
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
      .replace(/<embed\b[^<]*\/?>/gi, "")
      .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\s+on\w+\s*=\s*[^\s>]*/gi, "");
  }
  return html;
}

interface BlogPostContentProps {
  content: string;
  className?: string;
}

export function BlogPostContent({ content, className }: BlogPostContentProps) {
  const sanitized = useMemo(() => sanitizeHtml(content), [content]);

  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        "prose-img:rounded-lg prose-headings:font-semibold",
        "prose-img:max-w-full prose-img:h-auto prose-img:mx-auto prose-img:block prose-img:min-h-[48px]",
        "blog-post-content",
        "[&_img]:block [&_img]:object-contain",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
