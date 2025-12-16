import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { PublicLayout } from "@/components/PublicLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Hotel Sonata de Iracema - Sua casa em Fortaleza",
  description:
    "Hotel frente mar na Praia de Iracema, Fortaleza. A tradição de acolher, o prazer de se renovar. Reserve agora e viva uma experiência única.",
  keywords: [
    "Hotel em Fortaleza",
    "Hotel beira mar em Fortaleza",
    "Hotel Sonata de Iracema",
    "Hotel Sonata",
    "Pousada em fortaleza",
    "Hotel Ceará",
    "Pousada Ceará",
    "Hospedagem Fortaleza",
    "Hotel frente mar Fortaleza",
    "Hotel na Praia de Iracema",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <PublicLayout>
            {children}
          </PublicLayout>
        </Providers>
      </body>
    </html>
  );
}
