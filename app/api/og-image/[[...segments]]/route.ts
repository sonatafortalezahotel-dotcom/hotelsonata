import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

const SAFE_PATH = /^[a-zA-Z0-9][a-zA-Z0-9/._-]+$/;
const MAX_WIDTH = 1200;
const JPEG_QUALITY = 82;

/**
 * Imagem pública para Open Graph / WhatsApp / Facebook.
 * - Lê Blob private via token
 * - Converte para JPEG (WhatsApp rejeita WebP com frequência)
 * - Responde com Content-Length (crawlers falham em chunked/stream)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ segments?: string[] }> }
) {
  const { segments } = await params;
  const pathname = (segments ?? []).map((s) => decodeURIComponent(s)).join("/");
  if (!pathname) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }
  if (pathname.includes("..") || !SAFE_PATH.test(pathname)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB not configured" }, { status: 500 });
  }

  const res = await get(pathname, {
    access: "private",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  if (!res) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (res.statusCode === 304) {
    return new NextResponse(null, {
      status: 304,
      headers: { ETag: res.blob.etag },
    });
  }
  if (res.statusCode !== 200 || !res.stream) {
    return new NextResponse("Upstream error", { status: 502 });
  }

  try {
    const chunks: Uint8Array[] = [];
    const reader = res.stream.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    const input = Buffer.concat(chunks.map((c) => Buffer.from(c)));

    const jpeg = await sharp(input)
      .rotate()
      .resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();

    const body = new Uint8Array(jpeg);
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": String(body.byteLength),
        "Cache-Control":
          "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("og-image conversion failed:", pathname, error);
    return new NextResponse("Image processing error", { status: 502 });
  }
}
