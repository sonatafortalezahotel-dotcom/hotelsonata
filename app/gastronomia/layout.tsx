import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/utils/pageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    page: "gastronomia",
    defaultTitle: "Gastronomia - Hotel Sonata de Iracema",
    defaultDescription:
      "Descubra nossa gastronomia regional e internacional com vista para o mar. Café da manhã completo e restaurante com pratos especiais na Praia de Iracema, Fortaleza.",
    defaultKeywords: [
      "Restaurante Fortaleza",
      "Gastronomia Fortaleza",
      "Café da manhã Fortaleza",
      "Restaurante Praia de Iracema",
      "Comida regional Fortaleza",
    ],
    path: "/gastronomia",
  });
}

export default function GastronomiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

