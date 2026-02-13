import { Metadata } from "next";
import { headers } from "next/headers";
import { generatePageMetadata } from "@/lib/utils/pageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "pt";

  const path = locale === "pt" ? "/trabalhe-conosco" : `/${locale}/trabalhe-conosco`;
  return generatePageMetadata({
    page: "trabalhe-conosco",
    locale,
    defaultTitle: "Trabalhe Conosco | Hotel Sonata de Iracema",
    defaultDescription:
      "Faça parte do time do Hotel Sonata de Iracema. Confira nossas vagas abertas e envie seu currículo. Fortaleza, Praia de Iracema.",
    defaultKeywords: [
      "Vagas hotel Fortaleza",
      "Trabalhar no Hotel Sonata",
      "Emprego hotelaria Fortaleza",
      "Carreiras Hotel Sonata",
    ],
    path,
  });
}

export default function TrabalheConoscoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
