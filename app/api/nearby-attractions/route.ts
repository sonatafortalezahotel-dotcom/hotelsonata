import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { nearbyAttractions, nearbyAttractionTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";
    const active = searchParams.get("active");

    let query = db
      .select({
        id: nearbyAttractions.id,
        code: nearbyAttractions.code,
        imageUrl: nearbyAttractions.imageUrl,
        active: nearbyAttractions.active,
        order: nearbyAttractions.order,
        name: nearbyAttractionTranslations.name,
        distance: nearbyAttractionTranslations.distance,
      })
      .from(nearbyAttractions)
      .leftJoin(
        nearbyAttractionTranslations,
        and(
          eq(nearbyAttractionTranslations.nearbyAttractionId, nearbyAttractions.id),
          eq(nearbyAttractionTranslations.locale, locale)
        )
      );

    if (active === "true") {
      query = query.where(eq(nearbyAttractions.active, true)) as typeof query;
    }

    const result = await query.orderBy(nearbyAttractions.order);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar pontos turísticos próximos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pontos turísticos próximos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name, distance, imageUrl, active, order, locale = "pt" } = body;

    console.log("Dados recebidos:", { code, name, distance, imageUrl, active, order, locale });

    // Validação
    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { error: "Campo 'code' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Campo 'name' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    if (!distance || typeof distance !== "string" || !distance.trim()) {
      return NextResponse.json(
        { error: "Campo 'distance' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      return NextResponse.json(
        { error: "Campo 'imageUrl' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    // Normalizar valores
    const normalizedOrder = typeof order === "number" ? order : parseInt(String(order || 0), 10) || 0;
    const normalizedActive = active !== undefined ? Boolean(active) : true;
    const trimmedCode = code.trim();
    const trimmedImageUrl = imageUrl.trim();

    // Validação adicional
    if (trimmedCode.length > 50) {
      return NextResponse.json(
        { error: "O código não pode ter mais de 50 caracteres" },
        { status: 400 }
      );
    }

    console.log("Valores normalizados:", {
      code: trimmedCode,
      imageUrl: trimmedImageUrl.substring(0, 100) + "...",
      active: normalizedActive,
      order: normalizedOrder,
    });

    const [newAttraction] = await db
      .insert(nearbyAttractions)
      .values({
        code: trimmedCode,
        imageUrl: trimmedImageUrl,
        active: normalizedActive,
        order: normalizedOrder,
      })
      .returning();

    if (!newAttraction) {
      return NextResponse.json(
        { error: "Erro ao criar ponto turístico no banco de dados" },
        { status: 500 }
      );
    }

    // Inserir tradução - se falhar, deletar o ponto criado
    try {
      await db.insert(nearbyAttractionTranslations).values({
        nearbyAttractionId: newAttraction.id,
        locale: locale || "pt",
        name: name.trim(),
        distance: distance.trim(),
      });
    } catch (translationError: any) {
      console.error("Erro ao criar tradução:", translationError);
      // Deletar o ponto criado se a tradução falhar
      await db.delete(nearbyAttractions).where(eq(nearbyAttractions.id, newAttraction.id));
      return NextResponse.json(
        { 
          error: "Erro ao criar tradução do ponto turístico",
          details: translationError?.message || "Erro desconhecido"
        },
        { status: 500 }
      );
    }

    return NextResponse.json(newAttraction, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar ponto turístico próximo:", error);
    console.error("Detalhes completos do erro:", {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      cause: error?.cause,
      stack: error?.stack?.substring(0, 500),
    });
    
    const errorMessage = error?.message || String(error);
    
    // Verificar se é erro de tabela não encontrada
    if (
      errorMessage.includes("does not exist") || 
      errorMessage.includes("relation") || 
      errorMessage.includes("nearby_attractions") ||
      error?.code === "42P01"
    ) {
      return NextResponse.json(
        { 
          error: "Tabelas não encontradas no banco de dados",
          details: "Execute as migrações primeiro: npm run db:push",
          solution: "As tabelas nearby_attractions e nearby_attraction_translations precisam ser criadas no banco de dados."
        },
        { status: 500 }
      );
    }

    // Verificar se é erro de código duplicado
    if (error?.code === "23505" || errorMessage.includes("unique") || errorMessage.includes("duplicate")) {
      return NextResponse.json(
        { error: "Já existe um ponto turístico com este código" },
        { status: 409 }
      );
    }

    // Verificar se é erro de sintaxe SQL
    if (errorMessage.includes("syntax") || errorMessage.includes("Failed query")) {
      return NextResponse.json(
        { 
          error: "Erro na query SQL",
          details: errorMessage.substring(0, 200),
          hint: "Verifique se as tabelas existem e se os campos estão corretos"
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: "Erro ao criar ponto turístico próximo",
        details: errorMessage.substring(0, 300),
        code: error?.code
      },
      { status: 500 }
    );
  }
}

