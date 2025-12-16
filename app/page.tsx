"use client";

import { useEffect, useState, useMemo } from "react";
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

// Função para buscar pacotes do banco de dados
async function getPackages() {
  try {
    // Usar URL relativa para evitar problemas de CORS em desenvolvimento
    const res = await fetch('/api/packages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar pacotes:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    return [];
  }
}

// Função para buscar galeria de fotos do banco de dados
// Busca apenas imagens da home para melhor performance
async function getGalleryPhotos() {
  try {
    // Buscar apenas imagens da página home
    const res = await fetch('/api/gallery?page=home&active=true', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar galeria:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    console.log('Imagens carregadas da galeria (home):', data.length);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar galeria:', error);
    return [];
  }
}

// Função para buscar posts das redes sociais do banco de dados
async function getSocialMediaPosts() {
  try {
    // Usar URL relativa para evitar problemas de CORS em desenvolvimento
    const res = await fetch('/api/social-media', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar posts das redes sociais:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar posts das redes sociais:', error);
    return [];
  }
}

// Função para buscar dados de sustentabilidade
async function getSustainability() {
  try {
    // Usar URL relativa para evitar problemas de CORS em desenvolvimento
    const res = await fetch('/api/sustainability', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar sustentabilidade:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar sustentabilidade:', error);
    return [];
  }
}

// Função para buscar certificações
async function getCertifications() {
  try {
    // Usar URL relativa para evitar problemas de CORS em desenvolvimento
    const res = await fetch('/api/certifications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar certificações:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar certificações:', error);
    return [];
  }
}

// Função para buscar highlights do carrossel principal
async function getHighlights() {
  try {
    // Usar URL relativa para evitar problemas de CORS em desenvolvimento
    const res = await fetch('/api/highlights', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar highlights:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar highlights:', error);
    return [];
  }
}


export default function Home() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "home");
  const [packages, setPackages] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [sustainability, setSustainability] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar imagens para cada seção usando useMemo para evitar múltiplas chamadas
  const homeImages = useMemo(() => {
    if (!galleryPhotos || galleryPhotos.length === 0) {
      return {
        experienceImages: {
          piscina: [],
          gastronomia: [],
          quartos: [],
          spa: [],
          beachTennis: [],
          sustentabilidade: [],
        },
        photoStoryPhotos: [],
        galeriaMomentosPhotos: [],
      };
    }

    const normalize = (value: any) =>
      (value || "").toString().toLowerCase().trim();

    const getPhotosBySection = (section: string, limit?: number) => {
      const filtered = galleryPhotos
        .filter((img: any) => {
          if (!img?.active) return false;
          if (!img.imageUrl || typeof img.imageUrl !== "string") return false;
          if (!img.imageUrl.trim()) return false;

          const page = normalize(img.page);
          const sec = normalize(img.section);

          return page === "home" && sec === section.toLowerCase().trim();
        })
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

      if (typeof limit === "number") {
        return filtered.slice(0, limit);
      }
      return filtered;
    };

    // Experience Cards - imagens vêm diretamente das seções da home
    const experienceImages = {
      piscina: getPhotosBySection("experiencias-piscina", 4).map(
        (p: any) => p.imageUrl,
      ),
      gastronomia: getPhotosBySection("experiencias-gastronomia", 4).map(
        (p: any) => p.imageUrl,
      ),
      quartos: getPhotosBySection("experiencias-quartos", 3).map(
        (p: any) => p.imageUrl,
      ),
      spa: getPhotosBySection("experiencias-spa", 3).map(
        (p: any) => p.imageUrl,
      ),
      beachTennis: getPhotosBySection("experiencias-beach-tennis", 2).map(
        (p: any) => p.imageUrl,
      ),
      sustentabilidade: getPhotosBySection(
        "experiencias-sustentabilidade",
        2,
      ).map((p: any) => p.imageUrl),
    };

    // PhotoStory - 8 imagens de "photo-story"
    const photoStoryPhotos = getPhotosBySection("photo-story", 8);

    // Galeria de Momentos - 9 imagens
    const galeriaMomentosPhotos = getPhotosBySection("galeria-momentos", 9);

    return {
      experienceImages,
      photoStoryPhotos,
      galeriaMomentosPhotos,
    };
  }, [galleryPhotos]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [packagesData, socialData, sustainabilityData, certificationsData, galleryData, highlightsData] = await Promise.all([
          getPackages(),
          getSocialMediaPosts(),
          getSustainability(),
          getCertifications(),
          getGalleryPhotos(), // Buscar todas as fotos da galeria
          getHighlights() // Buscar highlights do carrossel
        ]);
        
        setPackages(Array.isArray(packagesData) ? packagesData : []);
        setSocialPosts(Array.isArray(socialData) ? socialData : []);
        setSustainability(Array.isArray(sustainabilityData) ? sustainabilityData : []);
        setCertifications(Array.isArray(certificationsData) ? certificationsData : []);
        setGalleryPhotos(Array.isArray(galleryData) ? galleryData : []);
        setHighlights(Array.isArray(highlightsData) ? highlightsData : []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
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
      <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-50 dark:to-slate-100 relative overflow-hidden">
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
              images={homeImages.experienceImages.piscina}
              icon={Waves}
              badge={t.experiences.cards.pool.badge}
              ctaText={t.experiences.cards.pool.cta}
              ctaLink="/lazer"
            />

            {/* Gastronomia Regional */}
            <ExperienceCard
              title={t.experiences.cards.gastronomy.title}
              description={t.experiences.cards.gastronomy.description}
              images={homeImages.experienceImages.gastronomia}
              icon={UtensilsCrossed}
              badge={t.experiences.cards.gastronomy.badge}
              ctaText={t.experiences.cards.gastronomy.cta}
              ctaLink="/gastronomia"
            />

            {/* Quartos Confortáveis */}
            <ExperienceCard
              title={t.experiences.cards.rooms.title}
              description={t.experiences.cards.rooms.description}
              images={homeImages.experienceImages.quartos}
              icon={Bed}
              badge={t.experiences.cards.rooms.badge}
              ctaText={t.experiences.cards.rooms.cta}
              ctaLink="/quartos"
            />

            {/* Spa & Bem-Estar */}
            <ExperienceCard
              title={t.experiences.cards.spa.title}
              description={t.experiences.cards.spa.description}
              images={homeImages.experienceImages.spa}
              icon={Sparkles}
              badge={t.experiences.cards.spa.badge}
              ctaText={t.experiences.cards.spa.cta}
              ctaLink="/lazer"
            />

            {/* Beach Tennis */}
            <ExperienceCard
              title={t.experiences.cards.beachTennis.title}
              description={t.experiences.cards.beachTennis.description}
              images={homeImages.experienceImages.beachTennis}
              icon={Trophy}
              badge={t.experiences.cards.beachTennis.badge}
              ctaText={t.experiences.cards.beachTennis.cta}
              ctaLink="/lazer"
            />

            {/* Sustentabilidade */}
            <ExperienceCard
              title={t.experiences.cards.sustainability.title}
              description={t.experiences.cards.sustainability.description}
              images={homeImages.experienceImages.sustentabilidade}
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
        items={homeImages.photoStoryPhotos
          .map((photo, index) => {
            const items = [
              { title: t.photoStory.items.sunrise.title, description: t.photoStory.items.sunrise.description, time: t.photoStory.items.sunrise.time },
              { title: t.photoStory.items.breakfast.title, description: t.photoStory.items.breakfast.description, time: t.photoStory.items.breakfast.time },
              { title: t.photoStory.items.bike.title, description: t.photoStory.items.bike.description, time: t.photoStory.items.bike.time },
              { title: t.photoStory.items.beachTennis.title, description: t.photoStory.items.beachTennis.description, time: t.photoStory.items.beachTennis.time },
              { title: t.photoStory.items.lunch.title, description: t.photoStory.items.lunch.description, time: t.photoStory.items.lunch.time },
              { title: t.photoStory.items.spa.title, description: t.photoStory.items.spa.description, time: t.photoStory.items.spa.time },
              { title: t.photoStory.items.poolAfternoon.title, description: t.photoStory.items.poolAfternoon.description, time: t.photoStory.items.poolAfternoon.time },
              { title: t.photoStory.items.sunset.title, description: t.photoStory.items.sunset.description, time: t.photoStory.items.sunset.time }
            ];
            const item = items[index] || items[0];
            return {
              image: photo.imageUrl || null,
              title: item.title,
              description: item.description,
              time: item.time
            };
          })
          .filter(item => item.image)}
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
            images={homeImages.galeriaMomentosPhotos
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
