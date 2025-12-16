import { Metadata, Viewport } from "next";
import { generatePageMetadata } from "@/lib/utils/pageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    page: "lazer",
    defaultTitle: "Lazer e Atividades - Hotel Sonata de Iracema",
    defaultDescription:
      "Desfrute de piscina, academia, spa e atividades de lazer no Hotel Sonata de Iracema. Experiências únicas na Praia de Iracema, Fortaleza.",
    defaultKeywords: [
      "Lazer Fortaleza",
      "Piscina Fortaleza",
      "Spa Fortaleza",
      "Atividades Praia de Iracema",
      "Hotel com piscina Fortaleza",
    ],
    path: "/lazer",
  });
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function LazerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

