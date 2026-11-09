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

/**
 * URL absoluta pública para Open Graph / Twitter / RSS / JSON-LD.
 * Crawlers (WhatsApp, Facebook, etc.) não autenticam em *.private.blob… (403)
 * e rejeitam WebP / respostas sem Content-Length — por isso usamos /api/og-image
 * (JPEG + Content-Length), não o blob-proxy bruto.
 */
export function toAbsoluteShareImageUrl(
  url: string | null | undefined,
  siteUrl: string
): string {
  if (!url || typeof url !== "string") {
    return "";
  }
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("data:")) {
    return "";
  }

  const base = siteUrl.replace(/\/$/, "");
  let pathname = "";

  if (trimmed.startsWith("/api/og-image/")) {
    return `${base}${trimmed}`;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const absolute = new URL(trimmed);
      if (absolute.pathname.startsWith("/api/og-image/")) {
        return trimmed;
      }
    } catch {
      // fall through
    }
  }
  if (trimmed.startsWith("/api/blob-proxy/")) {
    pathname = trimmed.slice("/api/blob-proxy".length);
  } else {
    try {
      const u = new URL(trimmed);
      if (PRIVATE_BLOB.test(u.hostname)) {
        pathname = u.pathname;
      }
    } catch {
      // relative path below
    }
  }

  if (pathname) {
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `${base}/api/og-image${path}`;
  }

  const client = toClientBlobUrl(trimmed);
  if (!client) {
    return "";
  }
  if (client.startsWith("/api/blob-proxy/")) {
    return `${base}/api/og-image${client.slice("/api/blob-proxy".length)}`;
  }
  if (client.startsWith("http://") || client.startsWith("https://")) {
    return client;
  }
  return client.startsWith("/") ? `${base}${client}` : `${base}/${client}`;
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
