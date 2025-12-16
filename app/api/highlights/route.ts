import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { highlights } from "@/lib/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];

    const activeHighlights = await db
      .select()
      .from(highlights)
      .where(
        and(
          eq(highlights.active, true),
          lte(highlights.startDate, today),
          gte(highlights.endDate, today)
        )
      )
      .orderBy(desc(highlights.order));

    return NextResponse.json(activeHighlights);
  } catch (error) {
    console.error("Erro ao buscar destaques:", error);
    return NextResponse.json(
      { error: "Erro ao buscar destaques" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, videoUrl, link, startDate, endDate, active, order } = body;

    // Validação: datas são obrigatórias
    if (!startDate || !endDate) {
      return NextResponse.json(
        { 
          error: "Campos obrigatórios: startDate, endDate",
          missingFields: [
            !startDate && "startDate",
            !endDate && "endDate"
          ].filter(Boolean)
        },
        { status: 400 }
      );
    }

    // Imagem OU vídeo é obrigatório (pelo menos um)
    const hasImage = imageUrl && imageUrl.trim();
    const hasVideo = videoUrl && videoUrl.trim();
    if (!hasImage && !hasVideo) {
      return NextResponse.json(
        { 
          error: "É necessário fornecer uma imagem ou um vídeo",
          missingFields: ["imageUrl ou videoUrl"]
        },
        { status: 400 }
      );
    }

    const [newHighlight] = await db
      .insert(highlights)
      .values({
        title: title?.trim() || null, // Opcional
        description: description?.trim() || null,
        imageUrl: hasImage ? imageUrl.trim() : null, // Pode ser null se tiver vídeo
        videoUrl: hasVideo ? videoUrl.trim() : null,
        link: link?.trim() || null,
        startDate,
        endDate,
        active: active ?? true,
        order: Number(order) || 0,
      })
      .returning();

    return NextResponse.json(newHighlight, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar destaque:", error);
    return NextResponse.json(
      { error: "Erro ao criar destaque" },
      { status: 500 }
    );
  }
}
