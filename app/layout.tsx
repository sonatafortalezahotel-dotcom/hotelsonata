import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { PublicLayout } from "@/components/PublicLayout";
import { StructuredData } from "@/components/SEO/StructuredData";
import { generateHotelStructuredData } from "@/lib/utils/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";
const SITE_NAME = "Hotel Sonata de Iracema";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Sua casa em Fortaleza`,
    template: `%s | ${SITE_NAME}`,
  },
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
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Sua casa em Fortaleza`,
    description:
      "Hotel frente mar na Praia de Iracema, Fortaleza. A tradição de acolher, o prazer de se renovar. Reserve agora e viva uma experiência única.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Sua casa em Fortaleza`,
    description:
      "Hotel frente mar na Praia de Iracema, Fortaleza. A tradição de acolher, o prazer de se renovar.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "pt-BR": SITE_URL,
      "en-US": `${SITE_URL}/en`,
      "es-ES": `${SITE_URL}/es`,
    },
  },
};

// Viewport deve ser exportado separadamente no Next.js 15+
export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

// Structured Data global do hotel
const hotelStructuredData = generateHotelStructuredData({
  name: SITE_NAME,
  description:
    "Hotel frente mar na Praia de Iracema, Fortaleza. A tradição de acolher, o prazer de se renovar.",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  address: {
    streetAddress: "Av. Beira Mar, Praia de Iracema",
    addressLocality: "Fortaleza",
    addressRegion: "CE",
    postalCode: "60060-000",
    addressCountry: "BR",
  },
  priceRange: "$$",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <StructuredData data={hotelStructuredData} />
        <Providers>
          <PublicLayout>
            {children}
          </PublicLayout>
        </Providers>
      </body>
    </html>
  );
}
