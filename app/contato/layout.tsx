import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/utils/pageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    page: "contato",
    defaultTitle: "Contato - Hotel Sonata de Iracema",
    defaultDescription:
      "Entre em contato com o Hotel Sonata de Iracema. Estamos na Praia de Iracema, Fortaleza. Reserve sua estadia ou tire suas dúvidas.",
    defaultKeywords: [
      "Contato Hotel Fortaleza",
      "Hotel Sonata contato",
      "Reservas Fortaleza",
      "Telefone Hotel Fortaleza",
      "Endereço Hotel Praia de Iracema",
    ],
    path: "/contato",
  });
}

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

