import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gallery } from "@/lib/db/schema";
import { eq, asc, desc, and, or, isNull } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category"); // Sistema antigo (compatibilidade)
    const page = searchParams.get("page"); // Sistema novo
    const section = searchParams.get("section"); // Sistema novo
    const limitParam = searchParams.get("limit");
    const active = searchParams.get("active");

    let query = db.select().from(gallery);
    const conditions: any[] = [];

    // PRIORIDADE: Sistema novo (page/section) tem prioridade sobre sistema antigo (category)
    // Se page ou section forem fornecidos, usa apenas o sistema novo
    // Caso contrário, usa o sistema antigo (category) para compatibilidade

    if (page || section) {
      // SISTEMA NOVO: Prioridade total
      // Se buscar por page/section, ignora category completamente
      
      if (page) {
        conditions.push(eq(gallery.page, page));
      }
      
      if (section) {
        conditions.push(eq(gallery.section, section));
      }
      
      // Filtro por ativo
      if (active === "true" || active === null) {
        conditions.push(eq(gallery.active, true));
      }
      
      // Aplica condições do sistema novo
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }
    } else if (category) {
      // SISTEMA ANTIGO: Apenas se não houver page/section
      // Busca por category (compatibilidade)
      // IMPORTANTE: Retorna apenas imagens que NÃO têm page/section preenchidos
      // (ou seja, apenas imagens do sistema antigo)
      
      conditions.push(eq(gallery.category, category));
      // Garante que só retorna imagens sem page E sem section (sistema antigo puro)
      // Ou seja: page IS NULL AND section IS NULL
      conditions.push(isNull(gallery.page));
      conditions.push(isNull(gallery.section));
      
      // Filtro por ativo
      if (active === "true" || active === null) {
        conditions.push(eq(gallery.active, true));
      }
      
      // Aplica condições do sistema antigo
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
      }
    } else {
      // Sem filtros específicos: busca todas as imagens
      // Se active não for especificado ou for "true", retorna apenas ativas (comportamento padrão)
      // Se active for "false", retorna apenas inativas
      // Se active for "all", retorna todas (útil para admin)
      if (active === "false") {
        query = query.where(eq(gallery.active, false)) as typeof query;
      } else if (active === "all") {
        // Retorna todas sem filtro de active
      } else {
        // Padrão: retorna apenas ativas
        query = query.where(eq(gallery.active, true)) as typeof query;
      }
    }

    // Ordenação (sempre por order asc - menor primeiro, conforme definido no seed)
    query = query.orderBy(asc(gallery.order)) as typeof query;

    // Limite
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        query = query.limit(limit) as typeof query;
      }
    }

    const photos = await query;

    return NextResponse.json(photos);
  } catch (error: unknown) {
    console.error("Erro ao buscar galeria:", error);
    const message = error instanceof Error ? error.message : "";
    const isSchemaError =
      typeof message === "string" &&
      (message.includes("video_url") || message.includes("media_type") || message.includes("column") || message.includes("does not exist"));
    if (isSchemaError) {
      return NextResponse.json(
        {
          error: "Schema desatualizado. Execute no banco: scripts/migrate-gallery-video.sql ou npm run db:push",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao buscar galeria" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, imageUrl, videoUrl, mediaType, category, page, section, description, active, order } = body;

    const img = typeof imageUrl === "string" ? imageUrl.trim() : "";
    const vid = typeof videoUrl === "string" ? videoUrl.trim() : "";
    const type = mediaType === "video" ? "video" : "image";

    if (!img && !vid) {
      return NextResponse.json(
        { error: "Informe imageUrl ou videoUrl" },
        { status: 400 }
      );
    }

    const [newPhoto] = await db
      .insert(gallery)
      .values({
        title: title || null,
        imageUrl: img || null,
        videoUrl: vid || null,
        mediaType: type,
        category: category || null,
        page: page || null,
        section: section || null,
        description: description || null,
        active: active ?? true,
        order: order ?? 0,
      })
      .returning();

    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar item na galeria:", error);
    return NextResponse.json(
      { error: "Erro ao criar item na galeria" },
      { status: 500 }
    );
  }
}

