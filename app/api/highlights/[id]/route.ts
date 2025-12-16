import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { highlights } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, imageUrl, videoUrl, link, startDate, endDate, active, order } = body;

    // Validação detalhada dos campos obrigatórios
    const missingFields: string[] = [];
    if (!startDate || startDate.trim() === "") missingFields.push("startDate");
    if (!endDate || endDate.trim() === "") missingFields.push("endDate");

    // Imagem OU vídeo é obrigatório (pelo menos um)
    const hasImage = imageUrl && imageUrl.trim() !== "";
    const hasVideo = videoUrl && videoUrl.trim() !== "";
    if (!hasImage && !hasVideo) {
      missingFields.push("imageUrl ou videoUrl");
    }

    if (missingFields.length > 0) {
      console.error("Campos obrigatórios faltando:", missingFields);
      console.error("Dados recebidos:", body);
      return NextResponse.json(
        { 
          error: "Campos obrigatórios faltando", 
          missingFields,
          received: body 
        },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(highlights)
      .set({
        title: title?.trim() || null, // Opcional
        description: description?.trim() || null,
        imageUrl: hasImage ? imageUrl.trim() : null, // Pode ser null se tiver vídeo
        videoUrl: hasVideo ? videoUrl.trim() : null,
        link: link?.trim() || null,
        startDate,
        endDate,
        active: active ?? true,
        order: Number(order) || 0,
        updatedAt: new Date(),
      })
      .where(eq(highlights.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Destaque não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar destaque:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar destaque" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const [deleted] = await db
      .delete(highlights)
      .where(eq(highlights.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Destaque não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Destaque excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir destaque:", error);
    return NextResponse.json(
      { error: "Erro ao excluir destaque" },
      { status: 500 }
    );
  }
}

