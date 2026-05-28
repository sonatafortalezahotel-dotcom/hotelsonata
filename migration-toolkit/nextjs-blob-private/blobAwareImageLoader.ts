import type { ImageLoaderProps } from "next/image";
import { toClientBlobUrl } from "./blobUrl";

function isVercelBlobHost(hostname: string): boolean {
  return (
    hostname === "blob.vercel-storage.com" ||
    hostname.endsWith(".blob.vercel-storage.com")
  );
}

/**
 * Imagens já alojadas no Vercel Blob: usa CDN / proxy (sem /_next/image para Blob).
 * Demais URLs: pipeline normal do Next Image.
 */
export default function blobAwareImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (src.startsWith("data:")) {
    return src;
  }

  const q = quality ?? 75;

  if (src.startsWith("/")) {
    return src;
  }

  try {
    const { hostname } = new URL(src);
    if (isVercelBlobHost(hostname)) {
      return toClientBlobUrl(src);
    }
  } catch {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
  }

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
