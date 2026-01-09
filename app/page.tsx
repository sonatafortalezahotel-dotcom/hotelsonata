"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
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
import { HorizontalScroll, EditorialCarousel, EditorialSlide, MasonrySwap } from "@/components/HorizontalScroll";
import NordestinoPattern from "@/components/NordestinoPattern";
import { Waves, UtensilsCrossed, Bed, Sparkles, PawPrint, Trophy } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { getGalleryImageTitle } from "@/lib/utils";

// Função para buscar quartos do banco de dados
async function getRooms(locale: string = 'pt') {
  try {
    const res = await fetch(`/api/rooms?active=true&locale=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error('Erro ao buscar quartos:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar quartos:', error);
    return [];
  }
}

// Função para buscar pacote Day Use
async function getDayUsePackage() {
  try {
    // Primeiro tentar buscar todos os pacotes ativos (sem filtro de data)
    const allRes = await fetch('/api/packages/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (allRes.ok) {
      const allData = await allRes.json();
      const dayUse = Array.isArray(allData) ? allData.find((pkg: any) => 
        pkg.category === "day-use" || 
        pkg.name?.toLowerCase().includes("day use") ||
        pkg.name?.toLowerCase().includes("dayuse")
      ) : null;
      
      if (dayUse) {
        return dayUse;
      }
    }
    
    // Fallback: buscar na rota normal (com filtro de data)
    const res = await fetch('/api/packages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (res.ok) {
      const data = await res.json();
      const dayUse = Array.isArray(data) ? data.find((pkg: any) => 
        pkg.category === "day-use" || 
        pkg.name?.toLowerCase().includes("day use") ||
        pkg.name?.toLowerCase().includes("dayuse")
      ) : null;
      return dayUse;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar Day Use:', error);
    return null;
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
  const [rooms, setRooms] = useState<any[]>([]);
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
        const [roomsData, dayUseData, socialData, sustainabilityData, certificationsData, galleryData, highlightsData] = await Promise.all([
          getRooms(locale),
          getDayUsePackage(),
          getSocialMediaPosts(),
          getSustainability(),
          getCertifications(),
          getGalleryPhotos(), // Buscar todas as fotos da galeria
          getHighlights() // Buscar highlights do carrossel
        ]);
        
        // Combinar quartos com Day Use (se existir)
        let combinedRooms = Array.isArray(roomsData) ? roomsData : [];
        
        // Se Day Use existe, adicionar como um "quarto" especial
        if (dayUseData) {
          console.log('Day Use encontrado:', dayUseData);
          combinedRooms.push({
            id: dayUseData.id,
            code: "day-use",
            name: dayUseData.name || "Day Use",
            description: dayUseData.description,
            shortDescription: dayUseData.description,
            imageUrl: dayUseData.imageUrl,
          });
        } else {
          console.log('Day Use não encontrado no banco de dados');
        }
        
        setRooms(combinedRooms);
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
          <Hero videoId="xptckGz4eH8" height="100vh" />
        )}
      </div>
      
      {/* Formulário de reserva posicionado no meio da divisão */}
      <div className="relative z-10 -mt-32 lg:-mt-40">
        <ReservationForm />
      </div>

      {/* Seção de Quartos - integrada com banco de dados */}
      {/* Padding top adicional para compensar a sobreposição do formulário */}
      <div className="pt-12 lg:pt-16">
        <PackagesSection rooms={rooms} />
      </div>

      {/* Experiências Visuais - CARROSSEL EDITORIAL FULLWIDTH */}
      <section className="relative overflow-hidden group">
        <EditorialCarousel
          autoplay={true}
          autoplayInterval={6000}
          showNavigation={true}
          showProgress={true}
        >
          
            {/* Piscina Vista Mar */}
          {homeImages.experienceImages.piscina[0] && (
            <EditorialSlide
              image={homeImages.experienceImages.piscina[0]}
              title={t.experiences.cards.pool.title}
              subtitle={t.experiences.cards.pool.badge}
              description={t.experiences.cards.pool.description}
              textPosition="bottom-left"
              overlay="dark"
            />
          )}

            {/* Gastronomia Regional */}
          {homeImages.experienceImages.gastronomia[0] && (
            <EditorialSlide
              image={homeImages.experienceImages.gastronomia[0]}
              title={t.experiences.cards.gastronomy.title}
              subtitle={t.experiences.cards.gastronomy.badge}
              description={t.experiences.cards.gastronomy.description}
              textPosition="bottom-right"
              overlay="dark"
            />
          )}

            {/* Quartos Confortáveis */}
          {homeImages.experienceImages.quartos[0] && (
            <EditorialSlide
              image={homeImages.experienceImages.quartos[0]}
              title={t.experiences.cards.rooms.title}
              subtitle={t.experiences.cards.rooms.badge}
              description={t.experiences.cards.rooms.description}
              textPosition="bottom-left"
              overlay="dark"
            />
          )}

            {/* Spa & Bem-Estar */}
          {homeImages.experienceImages.spa[0] && (
            <EditorialSlide
              image={homeImages.experienceImages.spa[0]}
              title={t.experiences.cards.spa.title}
              subtitle={t.experiences.cards.spa.badge}
              description={t.experiences.cards.spa.description}
              textPosition="bottom-right"
              overlay="dark"
            />
          )}

            {/* Beach Tennis */}
          {homeImages.experienceImages.beachTennis[0] && (
            <EditorialSlide
              image={homeImages.experienceImages.beachTennis[0]}
              title={t.experiences.cards.beachTennis.title}
              subtitle={t.experiences.cards.beachTennis.badge}
              description={t.experiences.cards.beachTennis.description}
              textPosition="bottom-left"
              overlay="dark"
            />
          )}

            {/* Pet Friendly */}
          {homeImages.experienceImages.sustentabilidade[0] && (
            <EditorialSlide
              image={homeImages.experienceImages.sustentabilidade[0]}
              title={t.experiences.cards.sustainability.title}
              subtitle={t.experiences.cards.sustainability.badge}
              description={t.experiences.cards.sustainability.description}
              textPosition="bottom-right"
              overlay="dark"
            />
          )}
        </EditorialCarousel>
      </section>

      {/* PhotoStory - Um Dia no Hotel - GRID 1x4 FULLWIDTH */}
      <section className="relative overflow-hidden">
        {/* Mobile: Stack vertical */}
        <div className="grid grid-cols-1 gap-0 lg:hidden">
          {homeImages.photoStoryPhotos
            .slice(0, 4)
          .map((photo, index) => {
            const items = [
              { title: t.photoStory.items.sunrise.title, description: t.photoStory.items.sunrise.description, time: t.photoStory.items.sunrise.time },
              { title: t.photoStory.items.breakfast.title, description: t.photoStory.items.breakfast.description, time: t.photoStory.items.breakfast.time },
              { title: t.photoStory.items.bike.title, description: t.photoStory.items.bike.description, time: t.photoStory.items.bike.time },
                { title: t.photoStory.items.beachTennis.title, description: t.photoStory.items.beachTennis.description, time: t.photoStory.items.beachTennis.time }
            ];
            const item = items[index] || items[0];
              
              if (!photo.imageUrl || photo.imageUrl.trim() === '') return null;
              
              return (
                <div key={index} className="group relative overflow-hidden">
                  <div className="relative w-full h-[400px]">
                    <Image
                      src={photo.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="100vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Texto */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <span className="text-white/80 text-sm font-light uppercase tracking-wider mb-2">
                        {item.time}
                      </span>
                      <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                        {item.title}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
            .filter(item => item !== null)}
        </div>

        {/* Desktop: 4 colunas lado a lado sem espaço */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-0">
          {homeImages.photoStoryPhotos
            .slice(0, 4)
            .map((photo, index) => {
              const items = [
                { title: t.photoStory.items.sunrise.title, description: t.photoStory.items.sunrise.description, time: t.photoStory.items.sunrise.time },
                { title: t.photoStory.items.breakfast.title, description: t.photoStory.items.breakfast.description, time: t.photoStory.items.breakfast.time },
                { title: t.photoStory.items.bike.title, description: t.photoStory.items.bike.description, time: t.photoStory.items.bike.time },
                { title: t.photoStory.items.beachTennis.title, description: t.photoStory.items.beachTennis.description, time: t.photoStory.items.beachTennis.time }
              ];
              const item = items[index] || items[0];
              
              if (!photo.imageUrl || photo.imageUrl.trim() === '') return null;
              
              return (
                <div key={index} className="group relative overflow-hidden">
                  <div className="relative w-full h-[500px]">
                    <Image
                      src={photo.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="25vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    {/* Texto */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <span className="text-white/80 text-xs font-light uppercase tracking-wider mb-2">
                        {item.time}
                      </span>
                      <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">
                        {item.title}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
            .filter(item => item !== null)}
        </div>
      </section>

      {/* Galeria - Momentos Inesquecíveis - MASONRY ANIMADO */}
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
          
          {/* Grid Masonry com imagens trocando de posição */}
          {homeImages.galeriaMomentosPhotos.length >= 4 ? (
            <MasonrySwap
              images={homeImages.galeriaMomentosPhotos
                .map(photo => photo.imageUrl)
                .filter(url => url && url.trim() !== '')}
              interval={5000}
            />
          ) : (
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
          )}
        </div>
      </section>



      {/* Feed de Redes Sociais - integrado com banco de dados */}
      <SocialMediaFeed posts={socialPosts} />
    </>
  );
}
