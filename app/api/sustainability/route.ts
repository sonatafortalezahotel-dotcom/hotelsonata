import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sustainability, sustainabilityTranslations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(sustainability)
      .where(eq(sustainability.active, true))
      .orderBy(desc(sustainability.order));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Erro ao buscar sustentabilidade:", error);
    return NextResponse.json(
      { error: "Erro ao buscar sustentabilidade" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, category, active, order, locale = "pt" } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Campos obrigatórios: title, description" },
        { status: 400 }
      );
    }

    const [newItem] = await db
      .insert(sustainability)
      .values({
        title,
        description,
        imageUrl: imageUrl || null,
        category: category || null,
        active: active ?? true,
        order: order || 0,
      })
      .returning();

    if (newItem) {
      await db.insert(sustainabilityTranslations).values({
        sustainabilityId: newItem.id,
        locale,
        title,
        description,
      });
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar sustentabilidade:", error);
    return NextResponse.json(
      { error: "Erro ao criar sustentabilidade" },
      { status: 500 }
    );
  }
}

