import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/utils/pageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    page: "quartos",
    defaultTitle: "Quartos e Acomodações - Hotel Sonata de Iracema",
    defaultDescription:
      "Conheça nossos quartos e acomodações com vista para o mar na Praia de Iracema, Fortaleza. Conforto, modernidade e hospitalidade em cada detalhe.",
    defaultKeywords: [
      "Quartos em Fortaleza",
      "Acomodações Fortaleza",
      "Hotel frente mar Fortaleza",
      "Quartos com vista para o mar",
      "Hospedagem Praia de Iracema",
    ],
    path: "/quartos",
  });
}

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

