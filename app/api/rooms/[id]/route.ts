import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms, roomTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Suporta tanto Promise quanto objeto direto (compatibilidade Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id) || !resolvedParams.id) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log("Body recebido no PUT:", body);
    
    const { code, name, description, shortDescription, imageUrl, size, maxGuests, hasSeaView, hasBalcony, amenities, basePrice, gallery, active, order, locale = "pt" } = body;

    // Validar campos obrigatórios
    if (!code || typeof code !== "string" || !code.trim()) {
      console.error("Validação falhou: code", { code, type: typeof code });
      return NextResponse.json(
        { error: "Campo 'code' é obrigatório e deve ser uma string não vazia" },
        { status: 400 }
      );
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      console.error("Validação falhou: name", { name, type: typeof name });
      return NextResponse.json(
        { error: "Campo 'name' é obrigatório e deve ser uma string não vazia" },
        { status: 400 }
      );
    }

    if (maxGuests === undefined || maxGuests === null) {
      console.error("Validação falhou: maxGuests está undefined ou null", { maxGuests });
      return NextResponse.json(
        { error: "Campo 'maxGuests' é obrigatório" },
        { status: 400 }
      );
    }

    if (typeof maxGuests !== "number" && typeof maxGuests !== "string") {
      console.error("Validação falhou: maxGuests tipo inválido", { maxGuests, type: typeof maxGuests });
      return NextResponse.json(
        { error: "Campo 'maxGuests' deve ser um número ou string numérica" },
        { status: 400 }
      );
    }

    const maxGuestsNumber = typeof maxGuests === "string" ? parseInt(maxGuests, 10) : maxGuests;
    if (isNaN(maxGuestsNumber) || maxGuestsNumber <= 0) {
      console.error("Validação falhou: maxGuests número inválido", { maxGuests, maxGuestsNumber });
      return NextResponse.json(
        { error: "Campo 'maxGuests' deve ser um número maior que zero" },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      console.error("Validação falhou: imageUrl", { imageUrl, type: typeof imageUrl });
      return NextResponse.json(
        { error: "imageUrl é obrigatório e deve ser uma URL válida" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(rooms)
      .set({
        code,
        size: size ? (typeof size === "string" ? parseInt(size, 10) : size) : null,
        maxGuests: maxGuestsNumber,
        hasSeaView: hasSeaView ?? true,
        hasBalcony: hasBalcony ?? false,
        amenities: amenities || null,
        basePrice: basePrice ? (typeof basePrice === "string" ? parseFloat(basePrice) : basePrice) : null,
        imageUrl,
        gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : null,
        active: active ?? true,
        order: order ? (typeof order === "string" ? parseInt(order, 10) : order) : 0,
        updatedAt: new Date(),
      })
      .where(eq(rooms.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Quarto não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar ou criar tradução
    const [existingTranslation] = await db
      .select()
      .from(roomTranslations)
      .where(
        and(
          eq(roomTranslations.roomId, id),
          eq(roomTranslations.locale, locale)
        )
      )
      .limit(1);

    if (existingTranslation) {
      await db
        .update(roomTranslations)
        .set({
          name,
          description: description || "",
          shortDescription: shortDescription || null,
          amenities: amenities || null,
          updatedAt: new Date(),
        })
        .where(eq(roomTranslations.id, existingTranslation.id));
    } else {
      await db.insert(roomTranslations).values({
        roomId: id,
        locale,
        name,
        description: description || "",
        shortDescription: shortDescription || null,
        amenities: amenities || null,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar quarto:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar quarto" },
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
    const id = parseInt(resolvedParams.id);
    
    if (isNaN(id) || !resolvedParams.id) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const [deleted] = await db
      .delete(rooms)
      .where(eq(rooms.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Quarto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Quarto excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir quarto:", error);
    return NextResponse.json(
      { error: "Erro ao excluir quarto" },
      { status: 500 }
    );
  }
}

