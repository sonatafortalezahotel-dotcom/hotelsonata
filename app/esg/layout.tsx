import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/utils/pageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    page: "esg",
    defaultTitle: "ESG e Sustentabilidade - Hotel Sonata de Iracema",
    defaultDescription:
      "Conheça nossas práticas de sustentabilidade, responsabilidade social e governança. Hotel Sonata de Iracema comprometido com o futuro sustentável.",
    defaultKeywords: [
      "Sustentabilidade Fortaleza",
      "Hotel sustentável Fortaleza",
      "ESG Fortaleza",
      "Responsabilidade social Fortaleza",
      "Hotel ecológico Fortaleza",
    ],
    path: "/esg",
  });
}

export default function ESGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

