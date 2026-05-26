import { NextResponse } from "next/server";
import { PUBLIC_CACHE_60 } from "@/lib/api-cache";
import { db } from "@/lib/db";
import { socialMediaPosts } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const posts = await db
      .select()
      .from(socialMediaPosts)
      .where(eq(socialMediaPosts.active, true))
      .orderBy(desc(socialMediaPosts.order))
      .limit(6);

    return NextResponse.json(posts, { headers: PUBLIC_CACHE_60 });
  } catch (error) {
    console.error("Erro ao buscar posts das redes sociais:", error);
    return NextResponse.json(
      { error: "Erro ao buscar posts das redes sociais" },
      { status: 500 }
    );
  }
}

