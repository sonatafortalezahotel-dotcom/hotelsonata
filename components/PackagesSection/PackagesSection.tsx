"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import NordestinoPattern from "@/components/NordestinoPattern";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface Package {
  id: number;
  name: string;
  description?: string;
  imageUrl: string;
  price?: number;
  startDate: string;
  endDate: string;
  category?: string;
}

interface PackagesSectionProps {
  packages?: Package[];
}

export default function PackagesSection({
  packages = [],
}: PackagesSectionProps) {
  const { locale } = useLanguage();
  const { formatPrice: formatPriceCurrency } = useCurrency();
  const items = packages;

  const formatPrice = (price?: number) => {
    return formatPriceCurrency(price, locale);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Padrão decorativo nordestino sutil */}
      <NordestinoPattern variant="tile" opacity={0.02} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nossos Pacotes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha a experiência perfeita para sua estadia
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-8">
          {items.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={pkg.imageUrl}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </AspectRatio>
                {pkg.category && (
                  <Badge className="absolute top-4 right-4" variant="secondary">
                    {pkg.category}
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl lg:text-2xl">{pkg.name}</CardTitle>
                {pkg.description && (
                  <CardDescription className="text-base">
                    {pkg.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {pkg.price && (
                  <div className="text-3xl font-bold text-primary mb-4">
                    {formatPrice(pkg.price)}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" size="lg">
                  <Link href={`/pacotes/${pkg.id}`}>
                    Ver Detalhes
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
