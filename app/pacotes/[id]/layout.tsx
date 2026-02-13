import { Metadata } from "next";
import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateMetadata as generateSEOMetadata, generateProductOfferStructuredData } from "@/lib/utils/seo";
import { StructuredData } from "@/components/SEO/StructuredData";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}): Promise<Metadata> {
  // Next.js 15+ pode retornar params como Promise
  const resolvedParams = params instanceof Promise ? await params : params;
  const packageId = parseInt(resolvedParams.id);
  
  if (isNaN(packageId)) {
    return {
      title: "Pacote não encontrado - Hotel Sonata de Iracema",
      description: "Pacote promocional não encontrado.",
    };
  }

  try {
    const pkg = await db
      .select()
      .from(packages)
      .where(eq(packages.id, packageId))
      .limit(1);

    if (pkg.length === 0) {
      return {
        title: "Pacote não encontrado - Hotel Sonata de Iracema",
        description: "Pacote promocional não encontrado.",
      };
    }

    const packageData = pkg[0];
    const title = packageData.name || "Pacote Promocional";
    const description =
      packageData.description ||
      `Conheça nosso pacote promocional ${title} no Hotel Sonata de Iracema.`;

    return generateSEOMetadata(
      {
        title: `${title} - Hotel Sonata de Iracema`,
        description,
        ogImage: packageData.imageUrl || undefined,
      },
      {
        locale: "pt",
        path: `/pacotes/${packageId}`,
        siteUrl: SITE_URL,
        type: "article",
        additionalKeywords: [
          "Pacote promocional Fortaleza",
          "Ofertas Hotel Fortaleza",
          "Promoção Hotel Sonata",
        ],
      }
    );
  } catch (error) {
    console.error("Erro ao gerar metadata do pacote:", error);
    return {
      title: "Pacote - Hotel Sonata de Iracema",
      description: "Conheça nossos pacotes promocionais.",
    };
  }
}

export default async function PackageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;
  const packageId = parseInt(id, 10);
  let productData: { name: string; description: string; imageUrl: string; price: number | null } | null = null;

  if (!isNaN(packageId)) {
    try {
      const rows = await db
        .select({
          name: packages.name,
          description: packages.description,
          imageUrl: packages.imageUrl,
          price: packages.price,
        })
        .from(packages)
        .where(eq(packages.id, packageId))
        .limit(1);
      if (rows.length > 0) {
        const row = rows[0];
        productData = {
          name: row.name,
          description: row.description ?? `Pacote ${row.name} - Hotel Sonata de Iracema`,
          imageUrl: row.imageUrl,
          price: row.price,
        };
      }
    } catch {
      // ignore
    }
  }

  const url = `${SITE_URL}/pacotes/${id}`;
  const productStructuredData =
    productData &&
    generateProductOfferStructuredData({
      name: productData.name,
      description: productData.description,
      image: productData.imageUrl,
      url,
      siteUrl: SITE_URL,
      price: productData.price ?? undefined,
      priceCurrency: "BRL",
    });

  return (
    <>
      {productStructuredData && <StructuredData data={productStructuredData} />}
      {children}
    </>
  );
}

