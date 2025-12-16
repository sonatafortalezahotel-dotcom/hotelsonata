"use client";

import { MapPin, Music, UtensilsCrossed, Palette, Waves, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import NordestinoPattern from "@/components/NordestinoPattern";

interface CulturalItem {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

interface CulturalIdentitySectionProps {
  className?: string;
  locale?: "pt" | "es" | "en";
}

const culturalItems: Record<"pt" | "es" | "en", CulturalItem[]> = {
  pt: [
    {
      icon: Waves,
      title: "Praia de Iracema",
      description: "No coração da orla de Fortaleza, onde o sol brilha 300 dias por ano",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Music,
      title: "Cultura Viva",
      description: "Forró, baião e a alegria contagiante do povo cearense",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: UtensilsCrossed,
      title: "Gastronomia Autêntica",
      description: "Sabores únicos do Ceará: peixe frito, tapioca, caju e muito mais",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Palette,
      title: "Artesanato Regional",
      description: "Renda de bilro, cerâmica e o colorido único da cultura nordestina",
      color: "from-pink-500 to-purple-500",
    },
    {
      icon: Sun,
      title: "Clima Tropical",
      description: "Temperatura média de 27°C, perfeito para desfrutar o ano todo",
      color: "from-yellow-400 to-orange-400",
    },
    {
      icon: MapPin,
      title: "Centro Cultural",
      description: "Próximo ao Dragão do Mar, Mercado Central e principais pontos turísticos",
      color: "from-green-500 to-emerald-500",
    },
  ],
  es: [
    {
      icon: Waves,
      title: "Playa de Iracema",
      description: "En el corazón del paseo marítimo de Fortaleza, donde el sol brilla 300 días al año",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Music,
      title: "Cultura Viva",
      description: "Forró, baião y la alegría contagiosa del pueblo cearense",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: UtensilsCrossed,
      title: "Gastronomía Auténtica",
      description: "Sabores únicos de Ceará: pescado frito, tapioca, anacardo y mucho más",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Palette,
      title: "Artesanía Regional",
      description: "Encaje de bolillos, cerámica y el colorido único de la cultura nordestina",
      color: "from-pink-500 to-purple-500",
    },
    {
      icon: Sun,
      title: "Clima Tropical",
      description: "Temperatura promedio de 27°C, perfecto para disfrutar todo el año",
      color: "from-yellow-400 to-orange-400",
    },
    {
      icon: MapPin,
      title: "Centro Cultural",
      description: "Cerca del Dragão do Mar, Mercado Central y principales puntos turísticos",
      color: "from-green-500 to-emerald-500",
    },
  ],
  en: [
    {
      icon: Waves,
      title: "Iracema Beach",
      description: "In the heart of Fortaleza's waterfront, where the sun shines 300 days a year",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Music,
      title: "Living Culture",
      description: "Forró, baião and the contagious joy of the Ceará people",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: UtensilsCrossed,
      title: "Authentic Cuisine",
      description: "Unique flavors from Ceará: fried fish, tapioca, cashew and much more",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Palette,
      title: "Regional Crafts",
      description: "Bobbin lace, ceramics and the unique colors of Northeastern culture",
      color: "from-pink-500 to-purple-500",
    },
    {
      icon: Sun,
      title: "Tropical Climate",
      description: "Average temperature of 27°C, perfect to enjoy all year round",
      color: "from-yellow-400 to-orange-400",
    },
    {
      icon: MapPin,
      title: "Cultural Center",
      description: "Close to Dragão do Mar, Central Market and main tourist attractions",
      color: "from-green-500 to-emerald-500",
    },
  ],
};

export default function CulturalIdentitySection({
  className,
  locale = "pt",
}: CulturalIdentitySectionProps) {
  const items = culturalItems[locale];

  return (
    <section
      className={cn(
        "relative py-16 lg:py-24 overflow-hidden",
        "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50",
        "dark:from-amber-950/20 dark:via-orange-950/20 dark:to-yellow-950/20",
        className
      )}
    >
      {/* Padrão decorativo nordestino */}
      <NordestinoPattern variant="sunset" opacity={0.15} />
      <NordestinoPattern variant="lace" opacity={0.05} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sun className="h-6 w-6 text-yellow-500" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              {locale === "pt" && "Identidade Nordestina"}
              {locale === "es" && "Identidad Nordestina"}
              {locale === "en" && "Northeastern Identity"}
            </h2>
            <Sun className="h-6 w-6 text-yellow-500" />
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {locale === "pt" &&
              "Viva a autenticidade do Ceará: cultura, tradição e hospitalidade genuína"}
            {locale === "es" &&
              "Vive la autenticidad de Ceará: cultura, tradición y hospitalidad genuina"}
            {locale === "en" &&
              "Experience the authenticity of Ceará: culture, tradition and genuine hospitality"}
          </p>
        </div>

        {/* Grid de itens culturais */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-200/50 dark:border-amber-800/30"
              >
                {/* Gradiente decorativo no fundo */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br",
                    item.color
                  )}
                />

                {/* Ícone com gradiente */}
                <div className="relative mb-4">
                  <div
                    className={cn(
                      "inline-flex p-3 rounded-xl bg-gradient-to-br shadow-md",
                      item.color
                    )}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Conteúdo */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {/* Borda decorativa no hover */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                    `border-transparent bg-gradient-to-br ${item.color} bg-clip-border`
                  )}
                  style={{
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Destaque final */}
        <div className="mt-12 lg:mt-16 text-center">
          <div className="inline-block bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border border-amber-200/50 dark:border-amber-800/30">
            <p className="text-lg font-semibold text-foreground mb-2">
              {locale === "pt" && "✨ Acolhimento com sotaque cearense"}
              {locale === "es" && "✨ Hospitalidad con acento cearense"}
              {locale === "en" && "✨ Hospitality with Ceará accent"}
            </p>
            <p className="text-sm text-muted-foreground">
              {locale === "pt" &&
                "No Hotel Sonata, você sente a verdadeira essência do Nordeste brasileiro"}
              {locale === "es" &&
                "En el Hotel Sonata, sientes la verdadera esencia del Nordeste brasileño"}
              {locale === "en" &&
                "At Hotel Sonata, you feel the true essence of the Brazilian Northeast"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

