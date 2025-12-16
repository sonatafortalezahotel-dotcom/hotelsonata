import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactInfo, contactInfoTranslations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";
    const active = searchParams.get("active");

    let query = db
      .select({
        id: contactInfo.id,
        type: contactInfo.type,
        value: contactInfo.value,
        label: contactInfoTranslations.label,
        order: contactInfo.order,
        active: contactInfo.active,
      })
      .from(contactInfo)
      .leftJoin(
        contactInfoTranslations,
        and(
          eq(contactInfoTranslations.contactInfoId, contactInfo.id),
          eq(contactInfoTranslations.locale, locale)
        )
      );

    if (active === "true") {
      query = query.where(eq(contactInfo.active, true)) as typeof query;
    }

    const result = await query.orderBy(contactInfo.order);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar informações de contato:", error);
    return NextResponse.json(
      { error: "Erro ao buscar informações de contato" },
      { status: 500 }
    );
  }
}

