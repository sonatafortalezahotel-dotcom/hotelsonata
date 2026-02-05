import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms, roomTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const LOCALES = ["pt", "es", "en"] as const;

/** GET: retorna quarto com dados base + todas as traduções (pt, es, en) para edição com abas */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id) || !resolvedParams.id) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const [room] = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1);
    if (!room) {
      return NextResponse.json({ error: "Quarto não encontrado" }, { status: 404 });
    }

    const allTranslations = await db
      .select()
      .from(roomTranslations)
      .where(eq(roomTranslations.roomId, id));

    const translations: Record<string, { name: string; description: string; shortDescription: string | null; amenities: string[] | null }> = {};
    for (const loc of LOCALES) {
      const row = allTranslations.find((r) => r.locale === loc);
      translations[loc] = row
        ? {
            name: row.name ?? "",
            description: row.description ?? "",
            shortDescription: row.shortDescription ?? null,
            amenities: Array.isArray(row.amenities) ? (row.amenities as string[]) : null,
          }
        : { name: "", description: "", shortDescription: null, amenities: null };
    }

    return NextResponse.json({
      id: room.id,
      code: room.code,
      imageUrl: room.imageUrl,
      gallery: room.gallery,
      size: room.size,
      maxGuests: room.maxGuests,
      hasSeaView: room.hasSeaView,
      hasBalcony: room.hasBalcony,
      basePrice: room.basePrice,
      active: room.active,
      order: room.order,
      translations,
    });
  } catch (error) {
    console.error("Erro ao buscar quarto:", error);
    return NextResponse.json(
      { error: "Erro ao buscar quarto" },
      { status: 500 }
    );
  }
}

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
    const { code, name, description, shortDescription, imageUrl, size, maxGuests, hasSeaView, hasBalcony, amenities, basePrice, gallery, active, order, locale = "pt" } = body;

    const isTranslationOnly = locale === "es" || locale === "en";

    // Para ES/EN: só validar e atualizar tradução (nome e descrição)
    if (isTranslationOnly) {
      if (!name || typeof name !== "string" || !name.trim()) {
        return NextResponse.json(
          { error: "Campo 'name' é obrigatório para esta tradução" },
          { status: 400 }
        );
      }
      const [existingRoom] = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1);
      if (!existingRoom) {
        return NextResponse.json({ error: "Quarto não encontrado" }, { status: 404 });
      }
      const [existingTranslation] = await db
        .select()
        .from(roomTranslations)
        .where(and(eq(roomTranslations.roomId, id), eq(roomTranslations.locale, locale)))
        .limit(1);
      const amenitiesArray = Array.isArray(amenities) ? amenities : null;
      if (existingTranslation) {
        await db
          .update(roomTranslations)
          .set({
            name: name.trim(),
            description: typeof description === "string" ? description : "",
            shortDescription: typeof shortDescription === "string" && shortDescription.trim() ? shortDescription.trim() : null,
            amenities: amenitiesArray,
            updatedAt: new Date(),
          })
          .where(eq(roomTranslations.id, existingTranslation.id));
      } else {
        await db.insert(roomTranslations).values({
          roomId: id,
          locale,
          name: name.trim(),
          description: typeof description === "string" ? description : "",
          shortDescription: typeof shortDescription === "string" && shortDescription.trim() ? shortDescription.trim() : null,
          amenities: amenitiesArray,
        });
      }
      return NextResponse.json(existingRoom);
    }

    // PT: atualizar quarto base + tradução
    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { error: "Campo 'code' é obrigatório" },
        { status: 400 }
      );
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Campo 'name' é obrigatório" },
        { status: 400 }
      );
    }
    if (maxGuests === undefined || maxGuests === null) {
      return NextResponse.json(
        { error: "Campo 'maxGuests' é obrigatório" },
        { status: 400 }
      );
    }
    const maxGuestsNumber = typeof maxGuests === "string" ? parseInt(maxGuests, 10) : maxGuests;
    if (isNaN(maxGuestsNumber) || maxGuestsNumber <= 0) {
      return NextResponse.json(
        { error: "Campo 'maxGuests' deve ser um número maior que zero" },
        { status: 400 }
      );
    }
    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      return NextResponse.json(
        { error: "imageUrl é obrigatório" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(rooms)
      .set({
        code: code.trim(),
        size: size != null ? (typeof size === "string" ? parseInt(size, 10) : size) : null,
        maxGuests: maxGuestsNumber,
        hasSeaView: hasSeaView ?? true,
        hasBalcony: hasBalcony ?? false,
        amenities: Array.isArray(amenities) && amenities.length > 0 ? amenities : null,
        basePrice: basePrice != null ? (typeof basePrice === "string" ? parseFloat(basePrice) : basePrice) : null,
        imageUrl: imageUrl.trim(),
        gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : null,
        active: active ?? true,
        order: order != null ? (typeof order === "string" ? parseInt(order, 10) : order) : 0,
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

    const [existingTranslation] = await db
      .select()
      .from(roomTranslations)
      .where(and(eq(roomTranslations.roomId, id), eq(roomTranslations.locale, "pt")))
      .limit(1);

    if (existingTranslation) {
      await db
        .update(roomTranslations)
        .set({
          name: name.trim(),
          description: typeof description === "string" ? description : "",
          shortDescription: typeof shortDescription === "string" && shortDescription.trim() ? shortDescription.trim() : null,
          amenities: Array.isArray(amenities) && amenities.length > 0 ? amenities : null,
          updatedAt: new Date(),
        })
        .where(eq(roomTranslations.id, existingTranslation.id));
    } else {
      await db.insert(roomTranslations).values({
        roomId: id,
        locale: "pt",
        name: name.trim(),
        description: typeof description === "string" ? description : "",
        shortDescription: typeof shortDescription === "string" && shortDescription.trim() ? shortDescription.trim() : null,
        amenities: Array.isArray(amenities) && amenities.length > 0 ? amenities : null,
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

