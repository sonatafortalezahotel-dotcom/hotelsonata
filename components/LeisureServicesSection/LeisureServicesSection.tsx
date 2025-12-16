'use client';

import { AmenityCard } from "@/components/AmenityCard";
import { Waves, Dumbbell, Bike, Trophy, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";

export function LeisureServicesSection() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "leisureServices");
  const services = [
    {
      title: t.pool.title,
      description: t.pool.description,
      images: [
        "/Sobre Hotel/Piscina/1-1_500n80cc400.jpg",
        "/Sobre Hotel/Piscina/2-1_500n80cc400.jpg",
        "/Sobre Hotel/Piscina/3-2_500n80cc400.jpg",
        "/Sobre Hotel/Piscina/5-1_500n80cc400.jpg",
        "/Sobre Hotel/Piscina/6s_500n80cc400.jpg",
      ],
      icon: Waves,
      schedule: t.pool.schedule,
      badge: t.pool.badge,
      tags: t.pool.tags
    },
    {
      title: t.fitness.title,
      description: t.fitness.description,
      images: [
        "/Sobre Hotel/Academia/1-2_500n80cc400.jpg",
        "/Sobre Hotel/Academia/3-3_274n85cc219.jpg",
        "/Sobre Hotel/Academia/4-3_274n85cc219.jpg",
        "/Sobre Hotel/Academia/5-2_274n85cc219.jpg",
      ],
      icon: Dumbbell,
      schedule: t.fitness.schedule,
      badge: t.fitness.badge,
      tags: t.fitness.tags
    },
    {
      title: t.bikes.title,
      description: t.bikes.description,
      images: [
        "/Sobre Hotel/Bikes/159213578_500n80cc400.jpg",
        "/Sobre Hotel/Bikes/4_500n80cc400.jpg",
      ],
      icon: Bike,
      badge: t.bikes.badge,
      tags: t.bikes.tags
    },
    {
      title: t.beachTennis.title,
      description: t.beachTennis.description,
      images: [
        "/Sobre Hotel/Aula Beach Tenis/beach-tenis2_274n85cc219.jpg",
        "/Sobre Hotel/Aula Beach Tenis/beach-tenis4_274n85cc219.jpg",
      ],
      icon: Trophy,
      badge: t.beachTennis.badge,
      tags: t.beachTennis.tags
    },
    {
      title: t.massage.title,
      description: t.massage.description,
      images: [
        "/Sobre Hotel/Spa/DSC-9823_274n85cc219.jpg",
        "/Sobre Hotel/Spa/DSC-9824_274n85cc219.jpg",
        "/Sobre Hotel/Spa/MAX-7163_274n85cc219.jpg",
        "/Sobre Hotel/Spa/MAX-7198_274n85cc219.jpg",
      ],
      icon: Sparkles,
      badge: t.massage.badge,
      tags: t.massage.tags
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AmenityCard
              key={index}
              title={service.title}
              description={service.description}
              images={service.images}
              icon={service.icon}
              schedule={service.schedule}
              badge={service.badge}
              tags={service.tags}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            {t.footer.text}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/lazer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              {t.footer.exploreButton}
            </a>
            <a 
              href="/contato"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
            >
              {t.footer.contactButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

