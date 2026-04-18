const PRIVATE_BLOB = /\.private\.blob\.vercel-storage\.com$/i;

/**
 * URL que o browser / next/image pode carregar. Para Blob **private** devolve
 * caminho do proxy da app (nunca o URL Vercel direto — dá 403 no cliente).
 */
export function toClientBlobUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") {
    return "";
  }
  if (url.startsWith("/api/blob-proxy/")) {
    return url;
  }
  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }
  if (url.startsWith("data:")) {
    return url;
  }
  try {
    const u = new URL(url);
    if (PRIVATE_BLOB.test(u.hostname)) {
      return `/api/blob-proxy${u.pathname}`;
    }
  } catch {
    return url;
  }
  return url;
}
