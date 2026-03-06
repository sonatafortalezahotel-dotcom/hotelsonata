import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gastronomy, gastronomyTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";
    const active = searchParams.get("active");

    let query = db
      .select({
        id: gastronomy.id,
        type: gastronomy.type,
        imageUrl: gastronomy.imageUrl,
        gallery: gastronomy.gallery,
        schedule: gastronomy.schedule,
        active: gastronomy.active,
        order: gastronomy.order,
        title: gastronomyTranslations.title,
        description: gastronomyTranslations.description,
        menu: gastronomyTranslations.menu,
        tags: gastronomyTranslations.tags,
      })
      .from(gastronomy)
      .leftJoin(
        gastronomyTranslations,
        and(
          eq(gastronomyTranslations.gastronomyId, gastronomy.id),
          eq(gastronomyTranslations.locale, locale)
        )
      );

    if (active === "true") {
      query = query.where(eq(gastronomy.active, true)) as typeof query;
    }

    const result = await query.orderBy(gastronomy.order);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar gastronomia:", error);
    return NextResponse.json(
      { error: "Erro ao buscar gastronomia" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, title, description, imageUrl, gallery, schedule, active, order, menu, tags, locale = "pt" } = body;

    // Validação mais detalhada
    if (!type || typeof type !== "string" || !type.trim()) {
      return NextResponse.json(
        { error: "Campo 'type' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Campo 'title' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      return NextResponse.json(
        { error: "Campo 'imageUrl' é obrigatório e deve ser uma string válida" },
        { status: 400 }
      );
    }

    const [newGastronomy] = await db
      .insert(gastronomy)
      .values({
        type,
        imageUrl,
        gallery: gallery || null,
        schedule: schedule || null,
        active: active ?? true,
        order: order || 0,
      })
      .returning();

    if (newGastronomy) {
      await db.insert(gastronomyTranslations).values({
        gastronomyId: newGastronomy.id,
        locale,
        title,
        description: description || "",
        menu: menu || null,
        tags: Array.isArray(tags) ? tags : (typeof tags === "string" ? tags.split(",").map((s: string) => s.trim()).filter(Boolean) : null),
      });
    }

    return NextResponse.json(newGastronomy, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar gastronomia:", error);
    return NextResponse.json(
      { error: "Erro ao criar gastronomia" },
      { status: 500 }
    );
  }
}
