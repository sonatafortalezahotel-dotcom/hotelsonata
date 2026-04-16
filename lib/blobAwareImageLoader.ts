import type { ImageLoaderProps } from "next/image";

function isVercelBlobHost(hostname: string): boolean {
  return (
    hostname === "blob.vercel-storage.com" ||
    hostname.endsWith(".blob.vercel-storage.com")
  );
}

/**
 * Imagens já hospedadas no Vercel Blob são servidas direto do CDN (sem /_next/image).
 * Reduz data transfer e invocações de Image Optimization na Vercel.
 * Demais URLs continuam usando o pipeline padrão do Next.
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
      return src;
    }
  } catch {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
  }

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
