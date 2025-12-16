import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seoLandingPages } from "@/lib/db/schema";
import { eq, and, like, or } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const locale = searchParams.get("locale");
    const active = searchParams.get("active");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    // Construir query base
    let baseQuery = db.select().from(seoLandingPages);
    const conditions = [];

    // Filtros
    if (slug) {
      conditions.push(eq(seoLandingPages.slug, slug));
    } else if (locale && locale !== "all") {
      // Se locale for especificado e não for "all", filtrar
      conditions.push(eq(seoLandingPages.locale, locale));
    }
    // Se locale não for especificado ou for "all", não filtrar (retorna todas)

    if (active === "true") {
      conditions.push(eq(seoLandingPages.active, true));
    } else if (active === "false") {
      conditions.push(eq(seoLandingPages.active, false));
    }

    // Aplicar condições se houver
    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions)) as typeof baseQuery;
    }

    // Buscar TODAS as páginas (sem limite/offset na query do banco)
    const allResults = await baseQuery;

    // Aplicar limite e offset apenas se especificados
    let finalResults = allResults;
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        const offsetNum = offset ? parseInt(offset) : 0;
        finalResults = allResults.slice(offsetNum, offsetNum + limitNum);
      }
    } else if (offset) {
      const offsetNum = parseInt(offset);
      if (!isNaN(offsetNum) && offsetNum >= 0) {
        finalResults = allResults.slice(offsetNum);
      }
    }

    // Retornar com estrutura de paginação (mas se não houver limite, retorna todas)
    return NextResponse.json({
      data: finalResults,
      total: allResults.length,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
    });
  } catch (error) {
    console.error("Erro ao buscar landing pages:", error);
    return NextResponse.json(
      { error: "Erro ao buscar landing pages" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slug,
      locale = "pt",
      title,
      description,
      keywords,
      h1,
      content,
      ogImage,
      canonicalUrl,
      contentType,
      relatedRoomIds,
      relatedPackageIds,
      priority = "0.8",
      changeFrequency = "weekly",
      active = true,
    } = body;

    if (!slug || !title || !description || !keywords) {
      return NextResponse.json(
        { error: "Slug, title, description e keywords são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se slug já existe
    const existing = await db
      .select()
      .from(seoLandingPages)
      .where(eq(seoLandingPages.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Slug já existe" },
        { status: 400 }
      );
    }

    const created = await db
      .insert(seoLandingPages)
      .values({
        slug,
        locale,
        title,
        description,
        keywords,
        h1: h1 || title,
        content: content || null,
        ogImage: ogImage || null,
        canonicalUrl: canonicalUrl || null,
        contentType: contentType || "general",
        relatedRoomIds: relatedRoomIds ? JSON.stringify(relatedRoomIds) : null,
        relatedPackageIds: relatedPackageIds
          ? JSON.stringify(relatedPackageIds)
          : null,
        priority: priority.toString(),
        changeFrequency,
        active,
      })
      .returning();

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar landing page:", error);
    return NextResponse.json(
      { error: "Erro ao criar landing page" },
      { status: 500 }
    );
  }
}

