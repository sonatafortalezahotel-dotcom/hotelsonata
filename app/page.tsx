"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import VideoCarousel from "@/components/VideoCarousel";
import ReservationForm from "@/components/ReservationForm";
import PackagesSection from "@/components/PackagesSection";
import SocialMediaFeed from "@/components/SocialMediaFeed";
import SustainabilitySection from "@/components/SustainabilitySection";
import CertificationsSection from "@/components/CertificationsSection";
import { ExperienceCard } from "@/components/ExperienceCard";
import { PhotoStory } from "@/components/PhotoStory";
import { ImageGalleryGrid } from "@/components/ImageGalleryGrid";
import NordestinoPattern from "@/components/NordestinoPattern";
import { Waves, UtensilsCrossed, Bed, Sparkles, Heart, Trophy } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { getGalleryImageTitle } from "@/lib/utils";
import { usePhotoTracker } from "@/lib/hooks/usePhotoTracker";

// Função para buscar pacotes do banco de dados
async function getPackages() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/packages`, {
      next: { revalidate: 3600 }, // Cache de 1 hora
      cache: 'force-cache'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar pacotes:', res.status);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    return [];
  }
}

// Função para buscar galeria de fotos do banco de dados
async function getGalleryPhotos() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/gallery`, {
      next: { revalidate: 3600 }, // Cache de 1 hora
      cache: 'force-cache'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar galeria:', res.status);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Erro ao buscar galeria:', error);
    return [];
  }
}

// Função para buscar posts das redes sociais do banco de dados
async function getSocialMediaPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/social-media`, {
      next: { revalidate: 1800 }, // Cache de 30 minutos
      cache: 'force-cache'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar posts das redes sociais:', res.status);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Erro ao buscar posts das redes sociais:', error);
    return [];
  }
}

// Função para buscar dados de sustentabilidade
async function getSustainability() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/sustainability`, {
      next: { revalidate: 3600 }, // Cache de 1 hora
      cache: 'force-cache'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar sustentabilidade:', res.status);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Erro ao buscar sustentabilidade:', error);
    return [];
  }
}

// Função para buscar certificações
async function getCertifications() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/certifications`, {
      next: { revalidate: 3600 }, // Cache de 1 hora
      cache: 'force-cache'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar certificações:', res.status);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Erro ao buscar certificações:', error);
    return [];
  }
}

// Função para buscar highlights do carrossel principal
async function getHighlights() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/highlights`, {
      next: { revalidate: 1800 }, // Cache de 30 minutos
      cache: 'force-cache'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar highlights:', res.status);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Erro ao buscar highlights:', error);
    return [];
  }
}


export default function Home() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "home");
  const photoTracker = usePhotoTracker(); // Sistema de rastreamento de fotos
  const [packages, setPackages] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [sustainability, setSustainability] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [packagesData, socialData, sustainabilityData, certificationsData, galleryData, highlightsData] = await Promise.all([
        getPackages(),
        getSocialMediaPosts(),
        getSustainability(),
        getCertifications(),
        getGalleryPhotos(), // Buscar todas as fotos da galeria
        getHighlights() // Buscar highlights do carrossel
      ]);
      
      setPackages(packagesData);
      setSocialPosts(socialData);
      setSustainability(sustainabilityData);
      setCertifications(certificationsData);
      setGalleryPhotos(galleryData);
      setHighlights(highlightsData);
      setLoading(false);
    }
    
    fetchData();
  }, [locale]);

  return (
    <>
      {/* Hero/Carrossel - Usa highlights do banco de dados ou fallback para vídeo fixo */}
      <div className="relative -mt-20 lg:-mt-28">
        {highlights && highlights.length > 0 ? (
          <VideoCarousel highlights={highlights} locale={locale} />
        ) : (
          <Hero videoId="xptckGz4eH8" height="80vh" />
        )}
      </div>
      
      {/* Formulário de reserva posicionado no meio da divisão */}
      <div className="relative z-10 -mt-24 lg:-mt-28">
        <ReservationForm />
      </div>

      {/* Seção de Pacotes - integrada com banco de dados */}
      {/* Padding top adicional para compensar a sobreposição do formulário */}
      <div className="pt-12 lg:pt-16">
        <PackagesSection packages={packages} />
      </div>

      {/* Experiências Visuais - Cards Interativos */}
      <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
        {/* Padrão decorativo nordestino sutil */}
        <NordestinoPattern variant="lace" opacity={0.03} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t.experiences.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.experiences.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Piscina Vista Mar */}
            <ExperienceCard
              title={t.experiences.cards.pool.title}
              description={t.experiences.cards.pool.description}
              images={photoTracker.getUnusedPhotos(galleryPhotos, "piscina", 4)
                .map(p => p.imageUrl)
                .filter(Boolean)}
              icon={Waves}
              badge={t.experiences.cards.pool.badge}
              ctaText={t.experiences.cards.pool.cta}
              ctaLink="/lazer"
            />

            {/* Gastronomia Regional */}
            <ExperienceCard
              title={t.experiences.cards.gastronomy.title}
              description={t.experiences.cards.gastronomy.description}
              images={photoTracker.getUnusedPhotos(galleryPhotos, ["gastronomia", "restaurante"], 4)
                .map(p => p.imageUrl)
                .filter(Boolean)}
              icon={UtensilsCrossed}
              badge={t.experiences.cards.gastronomy.badge}
              ctaText={t.experiences.cards.gastronomy.cta}
              ctaLink="/gastronomia"
            />

            {/* Quartos Confortáveis */}
            <ExperienceCard
              title={t.experiences.cards.rooms.title}
              description={t.experiences.cards.rooms.description}
              images={photoTracker.getUnusedPhotos(galleryPhotos, ["quarto", "recepcao"], 3)
                .map(p => p.imageUrl)
                .filter(Boolean)}
              icon={Bed}
              badge={t.experiences.cards.rooms.badge}
              ctaText={t.experiences.cards.rooms.cta}
              ctaLink="/quartos"
            />

            {/* Spa & Bem-Estar */}
            <ExperienceCard
              title={t.experiences.cards.spa.title}
              description={t.experiences.cards.spa.description}
              images={photoTracker.getUnusedPhotos(galleryPhotos, ["spa", "academia"], 3)
                .map(p => p.imageUrl)
                .filter(Boolean)}
              icon={Sparkles}
              badge={t.experiences.cards.spa.badge}
              ctaText={t.experiences.cards.spa.cta}
              ctaLink="/lazer"
            />

            {/* Beach Tennis */}
            <ExperienceCard
              title={t.experiences.cards.beachTennis.title}
              description={t.experiences.cards.beachTennis.description}
              images={photoTracker.getUnusedPhotos(galleryPhotos, ["lazer", "esporte"], 2)
                .map(p => p.imageUrl)
                .filter(Boolean)}
              icon={Trophy}
              badge={t.experiences.cards.beachTennis.badge}
              ctaText={t.experiences.cards.beachTennis.cta}
              ctaLink="/lazer"
            />

            {/* Sustentabilidade */}
            <ExperienceCard
              title={t.experiences.cards.sustainability.title}
              description={t.experiences.cards.sustainability.description}
              images={photoTracker.getUnusedPhotos(galleryPhotos, "sustentabilidade", 2, {
                allowRelatedCategories: true,
                relatedCategories: ["geral"]
              })
                .map(p => p.imageUrl)
                .filter(Boolean)}
              icon={Heart}
              badge={t.experiences.cards.sustainability.badge}
              ctaText={t.experiences.cards.sustainability.cta}
              ctaLink="/esg"
            />
          </div>
        </div>
      </section>

      {/* PhotoStory - Um Dia no Hotel */}
      <PhotoStory
        title={t.photoStory.title}
        subtitle={t.photoStory.subtitle}
        backgroundColor="muted"
        items={[
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, "piscina")?.imageUrl || "",
            title: t.photoStory.items.sunrise.title,
            description: t.photoStory.items.sunrise.description,
            time: t.photoStory.items.sunrise.time
          },
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, ["gastronomia", "cafe"])?.imageUrl || "",
            title: t.photoStory.items.breakfast.title,
            description: t.photoStory.items.breakfast.description,
            time: t.photoStory.items.breakfast.time
          },
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, "lazer")?.imageUrl || "",
            title: t.photoStory.items.bike.title,
            description: t.photoStory.items.bike.description,
            time: t.photoStory.items.bike.time
          },
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, "esporte")?.imageUrl || "",
            title: t.photoStory.items.beachTennis.title,
            description: t.photoStory.items.beachTennis.description,
            time: t.photoStory.items.beachTennis.time
          },
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, ["restaurante", "gastronomia"])?.imageUrl || "",
            title: t.photoStory.items.lunch.title,
            description: t.photoStory.items.lunch.description,
            time: t.photoStory.items.lunch.time
          },
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, "spa")?.imageUrl || "",
            title: t.photoStory.items.spa.title,
            description: t.photoStory.items.spa.description,
            time: t.photoStory.items.spa.time
          },
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, "piscina")?.imageUrl || "",
            title: t.photoStory.items.poolAfternoon.title,
            description: t.photoStory.items.poolAfternoon.description,
            time: t.photoStory.items.poolAfternoon.time
          },
          {
            image: photoTracker.getUnusedPhoto(galleryPhotos, "piscina")?.imageUrl || "",
            title: t.photoStory.items.sunset.title,
            description: t.photoStory.items.sunset.description,
            time: t.photoStory.items.sunset.time
          }
        ].filter(item => item.image)} // Remove itens sem imagem
      />

      {/* Galeria - Momentos Inesquecíveis */}
      <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
        {/* Padrão decorativo nordestino sutil */}
        <NordestinoPattern variant="sunset" opacity={0.03} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t.gallery.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.gallery.subtitle}
            </p>
          </div>
          
          <ImageGalleryGrid
            images={photoTracker.getUnusedPhotos(galleryPhotos, [
              "piscina", "gastronomia", "restaurante", "quarto", "recepcao",
              "spa", "academia", "lazer", "esporte", "sustentabilidade", "geral"
            ], 9)
              .map((photo, index) => {
                const title = getGalleryImageTitle(photo, index + 1);
                return {
                  src: photo.imageUrl,
                  alt: title,
                  title: title
                };
              })
              .filter(img => img.src)}
            columns={3}
            aspectRatio="landscape"
          />
        </div>
      </section>

      {/* Sustentabilidade e Inclusão */}
      <SustainabilitySection items={sustainability} />

      {/* Certificações e Selos */}
      <CertificationsSection certifications={certifications} />

      {/* Feed de Redes Sociais - integrado com banco de dados */}
      <SocialMediaFeed posts={socialPosts} />
    </>
  );
}
