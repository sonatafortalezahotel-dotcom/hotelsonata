import { Metadata } from "next";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { rooms, roomTranslations } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { generateMetadata as generateSEOMetadata, generateRoomStructuredData } from "@/lib/utils/seo";
import { StructuredData } from "@/components/SEO/StructuredData";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";
const SITE_NAME = "Hotel Sonata de Iracema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }> | { code: string };
}): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const code = decodeURIComponent(resolvedParams.code).trim();
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "pt";

  try {
    const result = await db
      .select({
        code: rooms.code,
        imageUrl: rooms.imageUrl,
        name: roomTranslations.name,
        description: roomTranslations.description,
        shortDescription: roomTranslations.shortDescription,
      })
      .from(rooms)
      .leftJoin(
        roomTranslations,
        and(
          eq(roomTranslations.roomId, rooms.id),
          eq(roomTranslations.locale, locale)
        )
      )
      .where(eq(rooms.code, code))
      .limit(1);

    let row = result[0] ?? null;
    if (!row) {
      const fallback = await db
        .select({
          code: rooms.code,
          imageUrl: rooms.imageUrl,
          name: roomTranslations.name,
          description: roomTranslations.description,
          shortDescription: roomTranslations.shortDescription,
        })
        .from(rooms)
        .leftJoin(
          roomTranslations,
          and(
            eq(roomTranslations.roomId, rooms.id),
            eq(roomTranslations.locale, "pt")
          )
        )
        .where(sql`LOWER(${rooms.code}) = LOWER(${code})`)
        .limit(1);

      if (fallback.length === 0) {
        return {
          title: `Quarto não encontrado | ${SITE_NAME}`,
          description: "O quarto solicitado não foi encontrado.",
        };
      }
      row = fallback[0];
    }

    if (!row) {
      return { title: `Quartos | ${SITE_NAME}`, description: "Conheça nossos quartos e acomodações." };
    }

    const name = "name" in row && row.name ? String(row.name) : code;
    const description =
      ("shortDescription" in row && row.shortDescription
        ? String(row.shortDescription)
        : "description" in row && row.description
          ? String(row.description)
          : `Conheça o quarto ${name} no Hotel Sonata de Iracema, frente mar na Praia de Iracema, Fortaleza.`)
        .slice(0, 160);
    const path = locale === "pt" ? `/quartos/${code}` : `/${locale}/quartos/${code}`;
    const ogImage =
      "imageUrl" in row && row.imageUrl
        ? row.imageUrl.startsWith("http")
          ? row.imageUrl
          : `${SITE_URL}${row.imageUrl}`
        : `${SITE_URL}/og-image.jpg`;

    return generateSEOMetadata(
      {
        title: `${name} | ${SITE_NAME}`,
        description,
        ogImage,
        canonicalUrl: `${SITE_URL}${path}`,
      },
      {
        locale,
        path,
        siteUrl: SITE_URL,
        additionalKeywords: [
          "Quarto Fortaleza",
          "Acomodação Praia de Iracema",
          "Hotel frente mar",
        ],
      }
    );
  } catch (error) {
    console.error("Erro ao gerar metadata do quarto:", error);
    return {
      title: `Quartos | ${SITE_NAME}`,
      description: "Conheça nossos quartos e acomodações com vista para o mar.",
    };
  }
}

export default async function RoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ code: string }> | { code: string };
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const code = decodeURIComponent(resolvedParams.code).trim();
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "pt";

  let roomData: { name: string; description: string; imageUrl: string | null; maxGuests: number } | null = null;
  try {
    const result = await db
      .select({
        imageUrl: rooms.imageUrl,
        maxGuests: rooms.maxGuests,
        name: roomTranslations.name,
        description: roomTranslations.description,
      })
      .from(rooms)
      .leftJoin(
        roomTranslations,
        and(
          eq(roomTranslations.roomId, rooms.id),
          eq(roomTranslations.locale, locale)
        )
      )
      .where(eq(rooms.code, code))
      .limit(1);

    if (result.length > 0) {
      const row = result[0];
      const name = row.name ? String(row.name) : code;
      const description =
        (row.description && String(row.description).trim()) ||
        `Quarto ${name} no Hotel Sonata de Iracema, frente mar na Praia de Iracema, Fortaleza.`;
      roomData = {
        name,
        description,
        imageUrl: row.imageUrl,
        maxGuests: row.maxGuests ?? 2,
      };
    }
    if (!roomData) {
      const fallback = await db
        .select({
          imageUrl: rooms.imageUrl,
          maxGuests: rooms.maxGuests,
          name: roomTranslations.name,
          description: roomTranslations.description,
        })
        .from(rooms)
        .leftJoin(
          roomTranslations,
          and(eq(roomTranslations.roomId, rooms.id), eq(roomTranslations.locale, "pt"))
        )
        .where(sql`LOWER(${rooms.code}) = LOWER(${code})`)
        .limit(1);
      if (fallback.length > 0) {
        const row = fallback[0];
        roomData = {
          name: row.name ? String(row.name) : code,
          description:
            (row.description && String(row.description).trim()) ||
            `Quarto no Hotel Sonata de Iracema, Fortaleza.`,
          imageUrl: row.imageUrl,
          maxGuests: row.maxGuests ?? 2,
        };
      }
    }
  } catch {
    // ignore
  }

  const path = locale === "pt" ? `/quartos/${code}` : `/${locale}/quartos/${code}`;
  const roomStructuredData =
    roomData &&
    generateRoomStructuredData({
      name: roomData.name,
      description: roomData.description,
      image: roomData.imageUrl ?? undefined,
      url: `${SITE_URL}${path}`,
      siteUrl: SITE_URL,
      hotelUrl: SITE_URL,
      hotelName: SITE_NAME,
      occupancy: roomData.maxGuests,
    });

  return (
    <>
      {roomStructuredData && <StructuredData data={roomStructuredData} />}
      {children}
    </>
  );
}
