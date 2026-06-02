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

/** Reescreve `src` de `<img>` e URLs em `data-gallery` para o proxy (exibição no browser). */
export function rewriteBlobUrlsInHtml(html: string): string {
  if (!html) {
    return html;
  }

  let result = html.replace(
    /(<img\b[^>]*\bsrc\s*=\s*)(["'])([^"']+)\2/gi,
    (_match, prefix: string, quote: string, url: string) =>
      `${prefix}${quote}${toClientBlobUrl(url)}${quote}`
  );

  result = result.replace(
    /data-gallery=(["'])(.*?)\1/gi,
    (_match, quote: string, jsonStr: string) => {
      try {
        const decoded = jsonStr.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        const arr = JSON.parse(decoded) as unknown;
        if (!Array.isArray(arr)) {
          return _match;
        }
        const mapped = arr.map((item) =>
          typeof item === "string" ? toClientBlobUrl(item) : item
        );
        return `data-gallery=${quote}${JSON.stringify(mapped)}${quote}`;
      } catch {
        return _match;
      }
    }
  );

  return result;
}
