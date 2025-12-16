import { Metadata } from "next";
import { db } from "@/lib/db";
import { packages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const packageId = parseInt(params.id);
  
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

export default function PackageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

