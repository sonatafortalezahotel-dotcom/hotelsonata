import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/utils/pageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    page: "hotel",
    defaultTitle: "Sobre o Hotel - Hotel Sonata de Iracema",
    defaultDescription:
      "Conheça a história do Hotel Sonata de Iracema. 20 anos de tradição em hospitalidade na Praia de Iracema, Fortaleza. A tradição de acolher, o prazer de se renovar.",
    defaultKeywords: [
      "Hotel Sonata história",
      "Sobre Hotel Fortaleza",
      "Hotel Praia de Iracema",
      "Hotel 20 anos Fortaleza",
      "Tradição hospitalidade Fortaleza",
    ],
    path: "/hotel",
  });
}

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

