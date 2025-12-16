import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rooms, roomTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";
    const active = searchParams.get("active");

    let query = db
      .select({
        id: rooms.id,
        code: rooms.code,
        size: rooms.size,
        maxGuests: rooms.maxGuests,
        hasSeaView: rooms.hasSeaView,
        hasBalcony: rooms.hasBalcony,
        amenities: rooms.amenities,
        basePrice: rooms.basePrice,
        imageUrl: rooms.imageUrl,
        gallery: rooms.gallery,
        active: rooms.active,
        order: rooms.order,
        name: roomTranslations.name,
        description: roomTranslations.description,
        shortDescription: roomTranslations.shortDescription,
        translatedAmenities: roomTranslations.amenities,
      })
      .from(rooms)
      .leftJoin(
        roomTranslations,
        and(
          eq(roomTranslations.roomId, rooms.id),
          eq(roomTranslations.locale, locale)
        )
      );

    if (active === "true") {
      query = query.where(eq(rooms.active, true)) as typeof query;
    }

    const result = await query.orderBy(rooms.order);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar quartos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar quartos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, name, description, shortDescription, imageUrl, size, maxGuests, hasSeaView, hasBalcony, amenities, basePrice, gallery, active, order, locale = "pt" } = body;

    // Validar campos obrigatórios
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

    if (!maxGuests || (typeof maxGuests !== "number" && typeof maxGuests !== "string")) {
      return NextResponse.json(
        { error: "Campo 'maxGuests' é obrigatório e deve ser um número" },
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
        { error: "imageUrl é obrigatório e deve ser uma URL válida" },
        { status: 400 }
      );
    }

    const [newRoom] = await db
      .insert(rooms)
      .values({
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
      })
      .returning();

    // Criar tradução
    if (newRoom) {
      await db.insert(roomTranslations).values({
        roomId: newRoom.id,
        locale,
        name,
        description: description || "",
        shortDescription: shortDescription || null,
        amenities: amenities || null,
      });
    }

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar quarto:", error);
    return NextResponse.json(
      { error: "Erro ao criar quarto" },
      { status: 500 }
    );
  }
}

