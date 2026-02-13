import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gallery } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { deleteFile } from "@/lib/upload";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Suporta tanto Promise quanto objeto direto (compatibilidade Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    
    if (!resolvedParams || !resolvedParams.id) {
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      );
    }

    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, imageUrl, videoUrl, mediaType, category, page, section, description, active, order } = body;

    const img = typeof imageUrl === "string" ? imageUrl.trim() : "";
    const vid = typeof videoUrl === "string" ? videoUrl.trim() : "";
    if (!img && !vid) {
      return NextResponse.json(
        { error: "Informe imageUrl ou videoUrl" },
        { status: 400 }
      );
    }

    const [existingPhoto] = await db
      .select()
      .from(gallery)
      .where(eq(gallery.id, id))
      .limit(1);

    if (!existingPhoto) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 }
      );
    }

    const type = mediaType === "video" ? "video" : "image";

    const [updatedPhoto] = await db
      .update(gallery)
      .set({
        title: title !== undefined ? (title || null) : existingPhoto.title,
        imageUrl: img || null,
        videoUrl: vid || null,
        mediaType: type,
        category: category !== undefined ? (category || null) : existingPhoto.category,
        page: page !== undefined ? (page || null) : existingPhoto.page,
        section: section !== undefined ? (section || null) : existingPhoto.section,
        description: description !== undefined ? (description || null) : existingPhoto.description,
        active: active !== undefined ? active : existingPhoto.active,
        order: order !== undefined ? order : existingPhoto.order,
        updatedAt: new Date(),
      })
      .where(eq(gallery.id, id))
      .returning();

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error("Erro ao atualizar foto:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar foto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Suporta tanto Promise quanto objeto direto (compatibilidade Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    
    if (!resolvedParams || !resolvedParams.id) {
      console.error("Params não fornecido ou ID ausente:", resolvedParams);
      return NextResponse.json(
        { error: "ID não fornecido" },
        { status: 400 }
      );
    }

    const id = parseInt(resolvedParams.id, 10);
    if (isNaN(id) || id <= 0) {
      console.error("ID inválido:", resolvedParams.id);
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    // Buscar a foto antes de deletar para obter a URL da imagem
    const [photo] = await db
      .select()
      .from(gallery)
      .where(eq(gallery.id, id))
      .limit(1);

    if (!photo) {
      return NextResponse.json(
        { error: "Foto não encontrada" },
        { status: 404 }
      );
    }

    // Deletar do banco de dados
    await db
      .delete(gallery)
      .where(eq(gallery.id, id));

    const urlsToDelete = [photo.imageUrl, photo.videoUrl].filter(
      (u): u is string => !!u && typeof u === "string" && u.includes("blob.vercel-storage.com")
    );
    for (const url of urlsToDelete) {
      try {
        await deleteFile(url);
      } catch (fileError) {
        console.warn("Erro ao deletar arquivo do storage (pode já ter sido deletado):", fileError);
      }
    }

    return NextResponse.json({ message: "Foto excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir foto:", error);
    return NextResponse.json(
      { error: "Erro ao excluir foto" },
      { status: 500 }
    );
  }
}

