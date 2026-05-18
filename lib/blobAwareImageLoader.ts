import type { ImageLoaderProps } from "next/image";

function isVercelBlobHost(hostname: string): boolean {
  return (
    hostname === "blob.vercel-storage.com" ||
    hostname.endsWith(".blob.vercel-storage.com")
  );
}

function optimizationUrl(src: string, width: number, q: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}

/**
 * Rotear Blob, proxy privado e `/public` por `/_next/image` para respeitar
 * `w`/`quality`, reduzir banda e gerar `srcset` válido (URLs com espaços
 * quebram o atributo se forem devolvidas sem encode).
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
    return optimizationUrl(src, width, q);
  }

  try {
    const { hostname } = new URL(src);
    if (isVercelBlobHost(hostname)) {
      return optimizationUrl(src, width, q);
    }
  } catch {
    return optimizationUrl(src, width, q);
  }

  return optimizationUrl(src, width, q);
}
