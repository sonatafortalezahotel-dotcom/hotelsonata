import { Metadata } from "next";
import { headers } from "next/headers";
import { generatePageMetadata } from "@/lib/utils/pageMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "pt";

  const path = locale === "pt" ? "/reservas" : `/${locale}/reservas`;
  return generatePageMetadata({
    page: "reservas",
    locale,
    defaultTitle: "Reservas | Hotel Sonata de Iracema",
    defaultDescription:
      "Reserve sua estadia no Hotel Sonata de Iracema, frente mar na Praia de Iracema, Fortaleza. Melhor tarifa garantida e reserva segura.",
    defaultKeywords: [
      "Reserva hotel Fortaleza",
      "Reservar Hotel Sonata",
      "Hospedagem Praia de Iracema",
      "Reserva online Fortaleza",
    ],
    path,
  });
}

export default function ReservasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
