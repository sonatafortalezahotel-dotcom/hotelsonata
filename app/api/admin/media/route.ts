import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { db } from "@/lib/db";
import {
  gallery,
  highlights,
  rooms,
  gastronomy,
  leisure,
  packages,
  sustainability,
  certifications,
  socialMediaPosts,
  seoLandingPages,
  events,
  nearbyAttractions,
} from "@/lib/db/schema";

export type MediaItemType = "image" | "video";

export interface AdminMediaItem {
  url: string;
  type: MediaItemType;
  source: string;
  sourceId?: number | string;
  editPath?: string;
  title?: string;
}

const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".ogg", ".m4v"]);
const VIDEO_HOSTS = ["youtube.com", "youtu.be", "vimeo.com"];

function isVideoUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  try {
    const u = new URL(lower);
    if (VIDEO_HOSTS.some((h) => u.hostname.includes(h))) return true;
    const path = u.pathname;
    return VIDEO_EXTENSIONS.has(path.slice(path.lastIndexOf(".")));
  } catch {
    return lower.includes("youtube") || lower.includes("vimeo") || VIDEO_EXTENSIONS.has(lower.slice(-5));
  }
}

function isVideoPathnameOrType(pathname: string, contentType?: string | null): boolean {
  const lower = pathname.toLowerCase();
  const ext = lower.slice(lower.lastIndexOf("."));
  if (VIDEO_EXTENSIONS.has(ext)) return true;
  if (contentType && contentType.startsWith("video/")) return true;
  return false;
}

function addItem(
  list: AdminMediaItem[],
  url: string | null | undefined,
  source: string,
  sourceId?: number | string,
  editPath?: string,
  title?: string
) {
  if (!url || typeof url !== "string" || !url.trim()) return;
  const type: MediaItemType = isVideoUrl(url) ? "video" : "image";
  list.push({ url: url.trim(), type, source, sourceId, editPath, title });
}

function addGalleryUrls(list: AdminMediaItem[], galleryUrls: unknown, source: string, sourceId: number | string, editPath: string) {
  const arr = Array.isArray(galleryUrls) ? galleryUrls : [];
  arr.forEach((url) => {
    if (typeof url === "string" && url.trim()) {
      const type: MediaItemType = isVideoUrl(url) ? "video" : "image";
      list.push({ url: url.trim(), type, source, sourceId, editPath });
    }
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get("type"); // "image" | "video"
    const sourceFilter = searchParams.get("source"); // e.g. "Galeria", "Destaques"
    const search = searchParams.get("search")?.toLowerCase().trim();

    const items: AdminMediaItem[] = [];

    // Gallery (imageUrl e/ou videoUrl)
    const galleryRows = await db.select().from(gallery);
    for (const row of galleryRows) {
      if (row.imageUrl) {
        addItem(items, row.imageUrl, "Galeria", row.id, "/admin/gallery", row.title ?? undefined);
      }
      if (row.videoUrl) {
        addItem(items, row.videoUrl, "Galeria", row.id, "/admin/gallery", row.title ?? undefined);
      }
    }

    // Highlights (image + video)
    const highlightRows = await db.select().from(highlights);
    for (const row of highlightRows) {
      addItem(items, row.imageUrl, "Destaques", row.id, "/admin/highlights", row.title ?? undefined);
      addItem(items, row.videoUrl, "Destaques", row.id, "/admin/highlights", row.title ?? undefined);
    }

    // Rooms
    const roomRows = await db.select().from(rooms);
    for (const row of roomRows) {
      addItem(items, row.imageUrl, "Quartos", row.id, "/admin/rooms", row.code);
      addGalleryUrls(items, row.gallery, "Quartos", row.id, "/admin/rooms");
    }

    // Gastronomy
    const gastronomyRows = await db.select().from(gastronomy);
    for (const row of gastronomyRows) {
      addItem(items, row.imageUrl, "Gastronomia", row.id, "/admin/gastronomy", row.type);
      addGalleryUrls(items, row.gallery, "Gastronomia", row.id, "/admin/gastronomy");
    }

    // Leisure
    const leisureRows = await db.select().from(leisure);
    for (const row of leisureRows) {
      addItem(items, row.imageUrl, "Lazer", row.id, "/admin/leisure", row.type);
      addGalleryUrls(items, row.gallery, "Lazer", row.id, "/admin/leisure");
    }

    // Events
    const eventRows = await db.select().from(events);
    for (const row of eventRows) {
      addItem(items, row.imageUrl, "Eventos", row.id, "/admin/events", row.type);
      addGalleryUrls(items, row.gallery, "Eventos", row.id, "/admin/events");
    }

    // Packages
    const packageRows = await db.select().from(packages);
    for (const row of packageRows) {
      addItem(items, row.imageUrl, "Pacotes", row.id, "/admin/packages", row.name);
    }

    // Sustainability
    const sustainabilityRows = await db.select().from(sustainability);
    for (const row of sustainabilityRows) {
      addItem(items, row.imageUrl, "Sustentabilidade", row.id, "/admin/sustainability", row.title);
    }

    // Certifications
    const certificationRows = await db.select().from(certifications);
    for (const row of certificationRows) {
      addItem(items, row.imageUrl, "Certificações", row.id, "/admin/certifications", row.name);
    }

    // Social media
    const socialRows = await db.select().from(socialMediaPosts);
    for (const row of socialRows) {
      addItem(items, row.imageUrl, "Redes sociais", row.id, "/admin/social-media");
    }

    // SEO Landing pages
    const seoRows = await db.select().from(seoLandingPages);
    for (const row of seoRows) {
      addItem(items, row.ogImage, "Landing pages SEO", row.id, "/admin/images/seo-landing-pages", row.slug);
    }

    // Nearby attractions
    const nearbyRows = await db.select().from(nearbyAttractions);
    for (const row of nearbyRows) {
      addItem(items, row.imageUrl, "Pontos turísticos", row.id, "/admin/nearby-attractions", row.code);
    }

    // Blob Storage: listar tudo que está no Vercel Blob (inclui uploads órfãos ou de outros fluxos)
    const seenUrls = new Set(items.map((i) => i.url));
    try {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        let cursor: string | undefined;
        do {
          const { blobs, hasMore, cursor: nextCursor } = await list({
            limit: 1000,
            cursor,
            token: process.env.BLOB_READ_WRITE_TOKEN,
          });
          for (const blob of blobs) {
            if (!blob.url || seenUrls.has(blob.url)) continue;
            seenUrls.add(blob.url);
            const pathname = blob.pathname ?? "";
            const type: MediaItemType = isVideoPathnameOrType(pathname)
              ? "video"
              : "image";
            const name = (pathname.split("/").pop() ?? pathname) || "arquivo";
            items.push({
              url: blob.url,
              type,
              source: "Blob Storage",
              title: name,
            });
          }
          cursor = hasMore ? nextCursor : undefined;
        } while (cursor);
      }
    } catch (blobErr) {
      console.warn("Erro ao listar Blob Storage (pode não estar configurado):", blobErr);
    }

    let result = items;

    if (typeFilter === "image" || typeFilter === "video") {
      result = result.filter((i) => i.type === typeFilter);
    }
    if (sourceFilter) {
      result = result.filter((i) => i.source === sourceFilter);
    }
    if (search) {
      result = result.filter(
        (i) =>
          i.url.toLowerCase().includes(search) ||
          (i.title && i.title.toLowerCase().includes(search)) ||
          (i.source && i.source.toLowerCase().includes(search))
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Erro ao buscar mídia:", error);
    const message = error instanceof Error ? error.message : String(error);
    const isSchemaError =
      typeof message === "string" &&
      (message.includes("video_url") || message.includes("media_type") || message.includes("column") || message.includes("does not exist"));
    if (isSchemaError) {
      return NextResponse.json(
        {
          error: "Schema desatualizado. Execute no banco: scripts/migrate-gallery-video.sql ou npm run db:push",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao buscar mídia" },
      { status: 500 }
    );
  }
}
