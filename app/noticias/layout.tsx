import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/utils/pageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    page: "noticias",
    defaultTitle: "Notícias - Hotel Sonata de Iracema",
    defaultDescription:
      "Dicas, novidades e histórias do Hotel Sonata de Iracema. Conheça Fortaleza, a Praia de Iracema e as melhores experiências de hospedagem.",
    defaultKeywords: [
      "Notícias hotel Fortaleza",
      "Praia de Iracema",
      "Dicas Fortaleza",
      "Hotel Sonata",
      "Notícias viagem Fortaleza",
    ],
    path: "/noticias",
  });
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
