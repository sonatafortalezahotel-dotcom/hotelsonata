import { NextResponse } from "next/server";

/**
 * Receives Core Web Vitals (LCP, INP, CLS, FCP) from the client.
 * You can forward these to Google Analytics 4, Search Console, or your own analytics.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, value, id, delta, navigationType, rating } = body as {
      name: string;
      value: number;
      id: string;
      delta: number;
      navigationType: string;
      rating?: string;
    };

    if (!name || typeof value !== "number") {
      return NextResponse.json(
        { error: "Invalid payload: name and value required" },
        { status: 400 }
      );
    }

    // Log for debugging / monitoring (replace with your storage or analytics)
    if (process.env.NODE_ENV === "development") {
      console.log("[Web Vitals]", name, { value, id, delta, navigationType, rating });
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
