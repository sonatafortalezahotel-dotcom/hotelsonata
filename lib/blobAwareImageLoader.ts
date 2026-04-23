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
 * Rotear Blob e proxy privado por `/_next/image` para respeitar `w`/`quality` e
 * reduzir banda (antes: URL direta = ficheiro completo no cliente).
 * Caminhos estáticos em `/public` continuam sem passar pelo otimizador.
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

  if (src.startsWith("/api/blob-proxy/")) {
    return optimizationUrl(src, width, q);
  }

  if (src.startsWith("/")) {
    return src;
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
