"use client";

import { useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { CarouselGallery } from "./CarouselGallery";

// Sanitize HTML: remove tags perigosas mas preserva iframes do YouTube e estruturas de galeria
function sanitizeHtml(html: string): string {
  if (typeof document === "undefined") {
    // Remove scripts, objects e embeds perigosos
    let sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
      .replace(/<embed\b[^<]*\/?>/gi, "");

    // Remove iframes que NÃO são do YouTube
    sanitized = sanitized.replace(
      /<iframe\b[^>]*>/gi,
      (match) => {
        // Permite apenas iframes com src do YouTube
        if (
          match.includes('youtube.com/embed/') ||
          match.includes('youtube-nocookie.com/embed/')
        ) {
          return match;
        }
        return ""; // Remove outros iframes
      }
    );

    // Remove atributos on* perigosos (onclick, onerror, etc.)
    sanitized = sanitized
      .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\s+on\w+\s*=\s*[^\s>]*/gi, "");

    return sanitized;
  }
  return html;
}

interface BlogPostContentProps {
  content: string;
  className?: string;
}

export function BlogPostContent({ content, className }: BlogPostContentProps) {
  const sanitized = useMemo(() => sanitizeHtml(content), [content]);
  const contentRef = useRef<HTMLDivElement>(null);

  // Hidratar carousels após renderização
  useEffect(() => {
    if (!contentRef.current) return;

    const carousels = contentRef.current.querySelectorAll(".image-gallery-carousel[data-gallery]");
    
    carousels.forEach((carousel) => {
      const galleryData = carousel.getAttribute("data-gallery");
      if (!galleryData) return;

      try {
        const images = JSON.parse(galleryData);
        if (!Array.isArray(images) || images.length === 0) return;

        // Substituir o carousel estático por um componente React interativo
        const container = document.createElement("div");
        carousel.replaceWith(container);

        // Renderizar o CarouselGallery
        import("react-dom/client").then(({ createRoot }) => {
          const root = createRoot(container);
          root.render(<CarouselGallery images={images} />);
        });
      } catch (error) {
        console.error("Erro ao hidratar carousel:", error);
      }
    });
  }, [sanitized]);

  return (
    <>
      <div
        ref={contentRef}
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
      <style jsx global>{`
        .blog-post-content .youtube-video {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          margin: 2rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          background: hsl(var(--muted));
        }
        .blog-post-content .youtube-video iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .blog-post-content .image-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
          padding: 0;
        }
        @media (max-width: 640px) {
          .blog-post-content .image-gallery {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 0.5rem;
          }
        }
        .blog-post-content .image-gallery img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-radius: 0.5rem;
          transition: transform 0.2s;
        }
        .blog-post-content .image-gallery img:hover {
          transform: scale(1.02);
        }
        @media (max-width: 640px) {
          .blog-post-content .image-gallery img {
            height: 150px;
          }
        }
        .blog-post-content .image-gallery-carousel {
          position: relative;
          width: 100%;
          margin: 2rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          background: hsl(var(--muted));
        }
        .blog-post-content .image-gallery-carousel img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: none;
        }
        .blog-post-content .image-gallery-carousel img:first-child {
          display: block;
        }
        @media (max-width: 640px) {
          .blog-post-content .image-gallery-carousel img {
            height: 300px;
          }
        }
      `}</style>
    </>
  );
}
