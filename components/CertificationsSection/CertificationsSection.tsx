"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useLanguage } from "@/lib/context/LanguageContext";

interface Certification {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
}

interface CertificationsSectionProps {
  certifications?: Certification[];
}

export default function CertificationsSection({
  certifications = [],
}: CertificationsSectionProps) {
  const { locale } = useLanguage();
  const items = certifications;

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Certificações e Selos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reconhecimentos que comprovam nossa qualidade e compromisso
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {items.map((cert) => (
            <Card key={cert.id} className="flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="relative w-24 h-24 lg:w-32 lg:h-32 mx-auto">
                  <AspectRatio ratio={1}>
                    <Image
                      src={cert.imageUrl}
                      alt={cert.name}
                      fill
                      className="object-contain"
                    />
                  </AspectRatio>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardTitle className="text-base lg:text-lg mb-2">
                  {cert.name}
                </CardTitle>
                {cert.description && (
                  <CardDescription className="text-sm">
                    {cert.description}
                  </CardDescription>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
