import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seoMetadata } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const locale = searchParams.get("locale") || "pt";

    if (!page) {
      return NextResponse.json(
        { error: "Parâmetro 'page' é obrigatório" },
        { status: 400 }
      );
    }

    const metadata = await db
      .select()
      .from(seoMetadata)
      .where(and(eq(seoMetadata.page, page), eq(seoMetadata.locale, locale)))
      .limit(1);

    if (metadata.length === 0) {
      return NextResponse.json(null);
    }

    return NextResponse.json(metadata[0]);
  } catch (error) {
    console.error("Erro ao buscar metadados SEO:", error);
    return NextResponse.json(
      { error: "Erro ao buscar metadados SEO" },
      { status: 500 }
    );
  }
}

