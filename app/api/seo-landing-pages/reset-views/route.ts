import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { seoLandingPages } from "@/lib/db/schema";
import { gt } from "drizzle-orm";

/**
 * POST /api/seo-landing-pages/reset-views
 * Zera o contador de visualizações de todas as landing pages.
 * Útil antes do lançamento do site ou para recomeçar a métrica.
 */
export async function POST() {
  try {
    const updated = await db
      .update(seoLandingPages)
      .set({
        viewCount: 0,
        lastViewedAt: null,
      })
      .where(gt(seoLandingPages.id, 0))
      .returning({ id: seoLandingPages.id });

    return NextResponse.json({
      message: "Contador de visualizações zerado",
      pagesUpdated: updated.length,
    });
  } catch (error) {
    console.error("Erro ao zerar visualizações:", error);
    return NextResponse.json(
      { error: "Erro ao zerar visualizações" },
      { status: 500 }
    );
  }
}
