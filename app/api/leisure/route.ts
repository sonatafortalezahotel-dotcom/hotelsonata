import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leisure, leisureTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";
    const active = searchParams.get("active");

    let query = db
      .select({
        id: leisure.id,
        type: leisure.type,
        imageUrl: leisure.imageUrl,
        gallery: leisure.gallery,
        icon: leisure.icon,
        active: leisure.active,
        order: leisure.order,
        title: leisureTranslations.title,
        description: leisureTranslations.description,
        schedule: leisureTranslations.schedule,
      })
      .from(leisure)
      .leftJoin(
        leisureTranslations,
        and(
          eq(leisureTranslations.leisureId, leisure.id),
          eq(leisureTranslations.locale, locale)
        )
      );

    if (active === "true") {
      query = query.where(eq(leisure.active, true)) as typeof query;
    }

    const result = await query.orderBy(leisure.order);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar lazer:", error);
    return NextResponse.json(
      { error: "Erro ao buscar lazer" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, title, description, imageUrl, gallery, icon, active, order, schedule, locale = "pt" } = body;

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

    const [newLeisure] = await db
      .insert(leisure)
      .values({
        type,
        imageUrl,
        gallery: gallery || null,
        icon: icon || null,
        active: active ?? true,
        order: order || 0,
      })
      .returning();

    if (newLeisure) {
      await db.insert(leisureTranslations).values({
        leisureId: newLeisure.id,
        locale,
        title,
        description: description || "",
        schedule: schedule || null,
      });
    }

    return NextResponse.json(newLeisure, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar lazer:", error);
    return NextResponse.json(
      { error: "Erro ao criar lazer" },
      { status: 500 }
    );
  }
}

