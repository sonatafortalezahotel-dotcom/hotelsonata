import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

const SAFE_PATH = /^[a-zA-Z0-9][a-zA-Z0-9/._-]+$/;

/**
 * Serve ficheiros do Vercel Blob **private** com autenticação no servidor.
 * O browser chama /api/blob-proxy/... em vez de aceder a *.private.blob… (403 em direto).
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
    return new NextResponse(null, { status: 304, headers: { ETag: res.blob.etag } });
  }
  if (res.statusCode !== 200 || !res.stream) {
    return new NextResponse("Upstream error", { status: 502 });
  }

  return new NextResponse(res.stream, {
    status: 200,
    headers: {
      "Content-Type": res.blob.contentType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
