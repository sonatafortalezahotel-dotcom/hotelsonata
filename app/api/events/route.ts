import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { events, eventTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    // Sempre buscar textos em português (textos são iguais em todos os idiomas)
    let query = db
      .select({
        id: events.id,
        type: events.type,
        capacity: events.capacity,
        imageUrl: events.imageUrl,
        gallery: events.gallery,
        facilities: events.facilities,
        active: events.active,
        order: events.order,
        title: eventTranslations.title,
        description: eventTranslations.description,
        translatedFacilities: eventTranslations.facilities,
      })
      .from(events)
      .leftJoin(
        eventTranslations,
        and(
          eq(eventTranslations.eventId, events.id),
          eq(eventTranslations.locale, "pt") // Sempre português para textos
        )
      );

    if (active === "true") {
      query = query.where(eq(events.active, true)) as typeof query;
    }

    const result = await query.orderBy(events.order);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar eventos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, title, description, imageUrl, gallery, capacity, facilities, active, order, translatedFacilities, locale = "pt" } = body;

    if (!type || !title) {
      return NextResponse.json(
        { error: "Campos obrigatórios: type, title" },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      return NextResponse.json(
        { error: "imageUrl é obrigatório e deve ser uma URL válida" },
        { status: 400 }
      );
    }

    const [newEvent] = await db
      .insert(events)
      .values({
        type,
        imageUrl,
        gallery: gallery || null,
        capacity: capacity || null,
        facilities: facilities || null,
        active: active ?? true,
        order: order || 0,
      })
      .returning();

    if (newEvent) {
      await db.insert(eventTranslations).values({
        eventId: newEvent.id,
        locale,
        title,
        description: description || "",
        facilities: translatedFacilities || null,
      });
    }

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json(
      { error: "Erro ao criar evento" },
      { status: 500 }
    );
  }
}

