import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/utils/pageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    page: "eventos",
    defaultTitle: "Eventos e Reuniões - Hotel Sonata de Iracema",
    defaultDescription:
      "Organize seu evento corporativo ou social no Hotel Sonata de Iracema. Salas de eventos modernas com vista para o mar na Praia de Iracema, Fortaleza.",
    defaultKeywords: [
      "Eventos Fortaleza",
      "Salas de eventos Fortaleza",
      "Reuniões corporativas Fortaleza",
      "Casamentos Fortaleza",
      "Eventos Praia de Iracema",
    ],
    path: "/eventos",
  });
}

export default function EventosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

