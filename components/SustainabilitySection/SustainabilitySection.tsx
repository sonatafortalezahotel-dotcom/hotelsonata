"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import NordestinoPattern from "@/components/NordestinoPattern";
import { useLanguage } from "@/lib/context/LanguageContext";

interface SustainabilityItem {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
}

interface SustainabilitySectionProps {
  items?: SustainabilityItem[];
}

export default function SustainabilitySection({
  items = [],
}: SustainabilitySectionProps) {
  const { locale } = useLanguage();
  const displayItems = items;

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section 
      className="py-16 lg:py-24 bg-background relative overflow-hidden"
      style={{
        background: 'hsl(var(--background))',
        backgroundImage: 'none',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Padrão decorativo nordestino sutil */}
      <NordestinoPattern variant="lace" opacity={0.025} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Sustentabilidade e Inclusão
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprometidos com um futuro melhor para todos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {displayItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {item.imageUrl && (
                <div className="relative w-full">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </AspectRatio>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl lg:text-2xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
