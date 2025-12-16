import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { certifications, certificationTranslations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const certs = await db
      .select()
      .from(certifications)
      .where(eq(certifications.active, true))
      .orderBy(desc(certifications.order));

    return NextResponse.json(certs);
  } catch (error) {
    console.error("Erro ao buscar certificações:", error);
    return NextResponse.json(
      { error: "Erro ao buscar certificações" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, imageUrl, active, order, locale = "pt" } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Campo obrigatório: name" },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
      return NextResponse.json(
        { error: "imageUrl é obrigatório e deve ser uma URL válida" },
        { status: 400 }
      );
    }

    const [newCert] = await db
      .insert(certifications)
      .values({
        name,
        description: description || null,
        imageUrl,
        active: active ?? true,
        order: order || 0,
      })
      .returning();

    if (newCert) {
      await db.insert(certificationTranslations).values({
        certificationId: newCert.id,
        locale,
        name,
        description: description || null,
      });
    }

    return NextResponse.json(newCert, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar certificação:", error);
    return NextResponse.json(
      { error: "Erro ao criar certificação" },
      { status: 500 }
    );
  }
}

