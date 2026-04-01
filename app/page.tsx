"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Hero from "@/components/Hero";
import VideoCarousel from "@/components/VideoCarousel";
import ReservationForm from "@/components/ReservationForm";
import PackagesSection from "@/components/PackagesSection";
import SocialMediaFeed from "@/components/SocialMediaFeed";
import { ExperienceCard } from "@/components/ExperienceCard";
import { PhotoStory } from "@/components/PhotoStory";
import { HorizontalScroll, EditorialCarousel, EditorialSlide, GalleryOneLeftTwoRight, GALLERY_ONE_LEFT_TWO_RIGHT_GRID_HEIGHT } from "@/components/HorizontalScroll";
import NordestinoPattern from "@/components/NordestinoPattern";
import { PageText, PageImage } from "@/components/PageEditor";
import { useLanguage } from "@/lib/context/LanguageContext";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { getPageContent } from "@/lib/utils/pageContent";
import { cn } from "@/lib/utils";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";

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

// Função para buscar todos os pacotes ativos
async function getPackages() {
  try {
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
// Cache-bust opcional para refetch após edição (evita resposta em cache)
async function getGalleryPhotos(cacheBust?: boolean) {
  try {
    const url = cacheBust
      ? `/api/gallery?page=home&active=true&_t=${Date.now()}`
      : '/api/gallery?page=home&active=true';
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
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

// Busca exclusiva da seção "Momentos Inesquecíveis" (page=home, section=galeria-momentos)
// Garante que a seção use apenas as fotos definidas na edição visual, não de outro local
async function getGalleryGaleriaMomentos(cacheBust?: boolean) {
  try {
    const url = cacheBust
      ? `/api/gallery?page=home&section=galeria-momentos&active=true&limit=9&_t=${Date.now()}`
      : '/api/gallery?page=home&section=galeria-momentos&active=true&limit=9';
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar galeria Momentos Inesquecíveis:', error);
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
  const editor = useEditor();
  const overrides = editor?.overrides ?? {};
  const t = getPageTranslation(locale, "home");
  const [rooms, setRooms] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [galeriaMomentosPhotos, setGaleriaMomentosPhotos] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ordem dos quartos na home: luxo → superior → standard (demais mantêm ordem)
  const ROOM_ORDER = ["luxo", "superior", "standard"];
  const roomsOrdered = useMemo(() => {
    if (!rooms.length) return [];
    return [...rooms].sort((a, b) => {
      const codeA = (a.code || "").toLowerCase().trim();
      const codeB = (b.code || "").toLowerCase().trim();
      const ia = ROOM_ORDER.indexOf(codeA);
      const ib = ROOM_ORDER.indexOf(codeB);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [rooms]);

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

    // Galeria de Momentos: usa lista dedicada (galeriaMomentosPhotos state), não derivada de galleryPhotos,
    // para garantir que a seção mostre apenas as fotos definidas na edição visual (page=home, section=galeria-momentos)
    const galeriaMomentosFromGallery = getPhotosBySection("galeria-momentos", 9);
    const galeriaMomentosPhotosResolved = galeriaMomentosPhotos.length > 0 ? galeriaMomentosPhotos : galeriaMomentosFromGallery;

    return {
      experienceImages,
      photoStoryPhotos,
      galeriaMomentosPhotos: galeriaMomentosPhotosResolved,
    };
  }, [galleryPhotos, galeriaMomentosPhotos]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [roomsData, packagesData, socialData, galleryData, galeriaMomentosData, highlightsData] = await Promise.all([
          getRooms(locale),
          getPackages(),
          getSocialMediaPosts(),
          getGalleryPhotos(), // Buscar todas as fotos da galeria (home)
          getGalleryGaleriaMomentos(), // Busca exclusiva da seção Momentos Inesquecíveis
          getHighlights() // Buscar highlights do carrossel
        ]);
        
        setRooms(Array.isArray(roomsData) ? roomsData : []);
        setPackages(Array.isArray(packagesData) ? packagesData : []);
        setSocialPosts(Array.isArray(socialData) ? socialData : []);
        setGalleryPhotos(Array.isArray(galleryData) ? galleryData : []);
        setGaleriaMomentosPhotos(Array.isArray(galeriaMomentosData) ? galeriaMomentosData : []);
        setHighlights(Array.isArray(highlightsData) ? highlightsData : []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [locale]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onGalleryUpdated = async () => {
      try {
        const [galleryData, momentosData] = await Promise.all([
          getGalleryPhotos(true),
          getGalleryGaleriaMomentos(true),
        ]);
        setGalleryPhotos(Array.isArray(galleryData) ? galleryData : []);
        setGaleriaMomentosPhotos(Array.isArray(momentosData) ? momentosData : []);
      } catch (error) {
        console.error("Erro ao atualizar galeria:", error);
      }
    };
    window.addEventListener("gallery-updated", onGalleryUpdated);
    return () => window.removeEventListener("gallery-updated", onGalleryUpdated);
  }, []);

  return (
    <>
      {/* Hero/Carrossel com formulário posicionado na base do hero */}
      <div className="relative -mt-20 pt-28 lg:-mt-28 lg:pt-0 max-lg:pb-[22rem] lg:pb-0">
        {highlights && highlights.length > 0 ? (
          <VideoCarousel highlights={highlights} locale={locale} galleryPhotos={galleryPhotos} />
        ) : (
          <div className="w-full aspect-video lg:aspect-auto lg:h-screen">
            <Hero videoId="xptckGz4eH8" height="full" />
          </div>
        )}

        {/* Mobile: formulário abaixo do vídeo (sem translate-y/2). Desktop: meio card sobre o hero. */}
        <div className="absolute inset-x-0 bottom-0 z-10 max-lg:translate-y-0 lg:translate-y-1/2">
          <ReservationForm />
        </div>
      </div>

      {/* Seção de Quartos e Pacotes */}
      <div className="max-lg:pt-6 pt-44 lg:pt-32">
        <PackagesSection
          rooms={roomsOrdered}
          packages={packages}
          title={
            editor?.editMode ? (
              <PageText page="home" section="packagesSection" fieldKey="title" locale={locale} as="span" />
            ) : (
              getPageContent("home", "packagesSection", "title", locale, overrides) || t.packagesSection?.title
            )
          }
          subtitle={
            editor?.editMode ? (
              <PageText page="home" section="packagesSection" fieldKey="subtitle" locale={locale} as="span" />
            ) : (
              getPageContent("home", "packagesSection", "subtitle", locale, overrides) || t.packagesSection?.subtitle
            )
          }
          empty={
            editor?.editMode ? (
              <PageText page="home" section="packagesSection" fieldKey="empty" locale={locale} as="span" />
            ) : (
              getPageContent("home", "packagesSection", "empty", locale, overrides) || t.packagesSection?.empty
            )
          }
        />
      </div>

      {/* Experiências Visuais - CARROSSEL EDITORIAL FULLWIDTH */}
      <section className="relative overflow-x-clip group">
        <EditorialCarousel
          autoplay={true}
          autoplayInterval={6000}
          showNavigation={true}
          showProgress={true}
        >
          
            {/* Piscina Vista Mar */}
          {homeImages.experienceImages.piscina[0] && (
            <EditorialSlide
              image={
                editor?.editMode ? (
                  <PageImage
                    src={getGalleryImageByPath(galleryPhotos, "gallery:home:experiencias-piscina:0") || homeImages.experienceImages.piscina[0]}
                    path="gallery:home:experiencias-piscina:0"
                    aspectRatio="auto"
                    className="absolute inset-0"
                  />
                ) : homeImages.experienceImages.piscina[0]
              }
              title={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.pool.title" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.pool.title", locale, overrides) || t.experiences.cards.pool.title
                )
              }
              subtitle={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.pool.badge" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.pool.badge", locale, overrides) || t.experiences.cards.pool.badge
                )
              }
              description={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.pool.description" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.pool.description", locale, overrides) || t.experiences.cards.pool.description
                )
              }
              textPosition="bottom-left"
              overlay="dark"
            />
          )}

            {/* Gastronomia Regional */}
          {homeImages.experienceImages.gastronomia[0] && (
            <EditorialSlide
              image={
                editor?.editMode ? (
                  <PageImage
                    src={getGalleryImageByPath(galleryPhotos, "gallery:home:experiencias-gastronomia:0") || homeImages.experienceImages.gastronomia[0]}
                    path="gallery:home:experiencias-gastronomia:0"
                    aspectRatio="auto"
                    className="absolute inset-0"
                  />
                ) : homeImages.experienceImages.gastronomia[0]
              }
              title={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.gastronomy.title" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.gastronomy.title", locale, overrides) || t.experiences.cards.gastronomy.title
                )
              }
              subtitle={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.gastronomy.badge" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.gastronomy.badge", locale, overrides) || t.experiences.cards.gastronomy.badge
                )
              }
              description={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.gastronomy.description" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.gastronomy.description", locale, overrides) || t.experiences.cards.gastronomy.description
                )
              }
              textPosition="bottom-right"
              overlay="dark"
            />
          )}

            {/* Quartos Confortáveis */}
          {homeImages.experienceImages.quartos[0] && (
            <EditorialSlide
              image={
                editor?.editMode ? (
                  <PageImage
                    src={getGalleryImageByPath(galleryPhotos, "gallery:home:experiencias-quartos:0") || homeImages.experienceImages.quartos[0]}
                    path="gallery:home:experiencias-quartos:0"
                    aspectRatio="auto"
                    className="absolute inset-0"
                  />
                ) : homeImages.experienceImages.quartos[0]
              }
              title={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.rooms.title" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.rooms.title", locale, overrides) || t.experiences.cards.rooms.title
                )
              }
              description={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.rooms.description" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.rooms.description", locale, overrides) || t.experiences.cards.rooms.description
                )
              }
              textPosition="bottom-left"
              overlay="dark"
            />
          )}

            {/* Spa & Bem-Estar */}
          {homeImages.experienceImages.spa[0] && (
            <EditorialSlide
              image={
                editor?.editMode ? (
                  <PageImage
                    src={getGalleryImageByPath(galleryPhotos, "gallery:home:experiencias-spa:0") || homeImages.experienceImages.spa[0]}
                    path="gallery:home:experiencias-spa:0"
                    aspectRatio="auto"
                    className="absolute inset-0"
                  />
                ) : homeImages.experienceImages.spa[0]
              }
              title={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.spa.title" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.spa.title", locale, overrides) || t.experiences.cards.spa.title
                )
              }
              subtitle={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.spa.badge" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.spa.badge", locale, overrides) || t.experiences.cards.spa.badge
                )
              }
              description={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.spa.description" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.spa.description", locale, overrides) || t.experiences.cards.spa.description
                )
              }
              textPosition="bottom-right"
              overlay="dark"
            />
          )}

            {/* Beach Tennis */}
          {homeImages.experienceImages.beachTennis[0] && (
            <EditorialSlide
              image={
                editor?.editMode ? (
                  <PageImage
                    src={getGalleryImageByPath(galleryPhotos, "gallery:home:experiencias-beach-tennis:0") || homeImages.experienceImages.beachTennis[0]}
                    path="gallery:home:experiencias-beach-tennis:0"
                    aspectRatio="auto"
                    className="absolute inset-0"
                  />
                ) : homeImages.experienceImages.beachTennis[0]
              }
              title={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.beachTennis.title" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.beachTennis.title", locale, overrides) || t.experiences.cards.beachTennis.title
                )
              }
              subtitle={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.beachTennis.badge" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.beachTennis.badge", locale, overrides) || t.experiences.cards.beachTennis.badge
                )
              }
              description={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.beachTennis.description" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.beachTennis.description", locale, overrides) || t.experiences.cards.beachTennis.description
                )
              }
              textPosition="bottom-left"
              overlay="dark"
            />
          )}

            {/* Pet Friendly */}
          {homeImages.experienceImages.sustentabilidade[0] && (
            <EditorialSlide
              image={
                editor?.editMode ? (
                  <PageImage
                    src={getGalleryImageByPath(galleryPhotos, "gallery:home:experiencias-sustentabilidade:0") || homeImages.experienceImages.sustentabilidade[0]}
                    path="gallery:home:experiencias-sustentabilidade:0"
                    aspectRatio="auto"
                    className="absolute inset-0"
                  />
                ) : homeImages.experienceImages.sustentabilidade[0]
              }
              title={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.sustainability.title" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.sustainability.title", locale, overrides) || t.experiences.cards.sustainability.title
                )
              }
              subtitle={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.sustainability.badge" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.sustainability.badge", locale, overrides) || t.experiences.cards.sustainability.badge
                )
              }
              description={
                editor?.editMode ? (
                  <PageText page="home" section="experiences" fieldKey="cards.sustainability.description" locale={locale} as="span" />
                ) : (
                  getPageContent("home", "experiences", "cards.sustainability.description", locale, overrides) || t.experiences.cards.sustainability.description
                )
              }
              textPosition="bottom-right"
              overlay="dark"
            />
          )}
        </EditorialCarousel>
      </section>

      {/* PhotoStory - Um Dia no Hotel - GRID 1x4 FULLWIDTH */}
      <section className="relative overflow-x-clip">
        {(() => {
          const photoStoryKeys = ["sunrise", "breakfast", "bike", "beachTennis"] as const;
          const getPhotoStoryItem = (index: number) => {
            const key = photoStoryKeys[index] ?? "sunrise";
            const itemT = t.photoStory?.items?.[key];
            return {
              title: editor?.editMode ? (
                <PageText page="home" section="photoStory" fieldKey={`items.${key}.title`} locale={locale} as="span" />
              ) : (
                getPageContent("home", "photoStory", `items.${key}.title`, locale, overrides) || (itemT?.title ?? "")
              ),
              description: editor?.editMode ? (
                <PageText page="home" section="photoStory" fieldKey={`items.${key}.description`} locale={locale} as="span" />
              ) : (
                getPageContent("home", "photoStory", `items.${key}.description`, locale, overrides) || (itemT?.description ?? "")
              ),
              time:
                key === "breakfast"
                  ? null
                  : editor?.editMode
                    ? (
                        <PageText page="home" section="photoStory" fieldKey={`items.${key}.time`} locale={locale} as="span" />
                      )
                    : (
                        getPageContent("home", "photoStory", `items.${key}.time`, locale, overrides) ||
                        (itemT && "time" in itemT ? itemT.time : "")
                      ),
              titleStr: getPageContent("home", "photoStory", `items.${key}.title`, locale, overrides) || (itemT?.title ?? ""),
            };
          };
          return (
            <>
              {/* Mobile: Carrossel Horizontal */}
              <div className="lg:hidden">
                <HorizontalScroll itemWidth="full" showArrows={false} showDots={true} gap={0}>
                  {homeImages.photoStoryPhotos.slice(0, 4).map((photo, index) => {
                    const item = getPhotoStoryItem(index);
                    if (!photo.imageUrl || photo.imageUrl.trim() === "") return null;
                    return (
                      <div key={index} className="group relative overflow-hidden">
                        <div className="relative w-full h-[400px]">
                          {editor?.editMode ? (
                            <PageImage
                              src={getGalleryImageByPath(galleryPhotos, `gallery:home:photo-story:${index}`) || photo.imageUrl}
                              path={`gallery:home:photo-story:${index}`}
                              aspectRatio="auto"
                              className="absolute inset-0"
                            />
                          ) : (
                            <Image
                              src={getGalleryImageByPath(galleryPhotos, `gallery:home:photo-story:${index}`) || photo.imageUrl}
                              alt={item.titleStr}
                              fill
                              quality={90}
                              priority={index < 2}
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="100vw"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                          <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none">
                            <div className="pointer-events-auto">
                              {item.time ? (
                                <span className="text-white/80 text-sm font-light uppercase tracking-wider mb-2 block">{item.time}</span>
                              ) : null}
                              <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">{item.title}</h3>
                              <p className="text-white/90 text-sm leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </HorizontalScroll>
              </div>
              {/* Desktop: 1x3 colunas */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-0">
                {homeImages.photoStoryPhotos.slice(0, 3).map((photo, index) => {
                  const item = getPhotoStoryItem(index);
                  if (!photo.imageUrl || photo.imageUrl.trim() === "") return null;
                  return (
                    <div key={index} className="group relative overflow-hidden">
                      <div className="relative w-full h-[500px]">
                        {editor?.editMode ? (
                          <PageImage
                            src={getGalleryImageByPath(galleryPhotos, `gallery:home:photo-story:${index}`) || photo.imageUrl}
                            path={`gallery:home:photo-story:${index}`}
                            aspectRatio="auto"
                            className="absolute inset-0"
                          />
                        ) : (
                          <Image
                            src={getGalleryImageByPath(galleryPhotos, `gallery:home:photo-story:${index}`) || photo.imageUrl}
                            alt={item.titleStr}
                            fill
                            quality={90}
                            priority={index < 2}
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none">
                          <div className="pointer-events-auto">
                            {item.time ? (
                              <span className="text-white/80 text-xs font-light uppercase tracking-wider mb-2 block">{item.time}</span>
                            ) : null}
                            <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">{item.title}</h3>
                            <p className="text-white/90 text-sm leading-relaxed line-clamp-3">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
      </section>

      {/* Galeria - Momentos Inesquecíveis - MASONRY ANIMADO */}
      <section className="py-10 lg:py-24 bg-background relative overflow-x-clip">
        {/* Padrão decorativo nordestino sutil */}
        <NordestinoPattern variant="sunset" opacity={0.03} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {editor?.editMode ? (
                <PageText page="home" section="gallery" fieldKey="title" locale={locale} as="span" />
              ) : (
                getPageContent("home", "gallery", "title", locale, overrides) || t.gallery.title
              )}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {editor?.editMode ? (
                <PageText page="home" section="gallery" fieldKey="subtitle" locale={locale} as="span" />
              ) : (
                getPageContent("home", "gallery", "subtitle", locale, overrides) || t.gallery.subtitle
              )}
            </p>
          </div>
          
          {/* Layout 1 esquerda + 2 direita (page=home, section=galeria-momentos). Em edição: 3 slots; fora: primeiras 3 fotos. */}
          {editor?.editMode ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:grid-rows-2 lg:h-[560px] xl:h-[680px] 2xl:h-[760px]">
              {[0, 1, 2].map((index) => {
                const path = `gallery:home:galeria-momentos:${index}`;
                const photoByOrder = homeImages.galeriaMomentosPhotos.find((p: any) => (p.order ?? 0) === index);
                const src = getGalleryImageByPath(galleryPhotos, path) || photoByOrder?.imageUrl || "";
                const isLeft = index === 0;
                return (
                  <div
                    key={index}
                    className={cn(
                      "relative rounded-lg overflow-hidden",
                      isLeft ? "lg:row-span-2 min-h-[200px] lg:min-h-0" : ""
                    )}
                  >
                    <PageImage
                      src={src}
                      path={path}
                      aspectRatio="auto"
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <GalleryOneLeftTwoRight
              images={homeImages.galeriaMomentosPhotos
                .map(photo => photo.imageUrl)
                .filter((url): url is string => !!url && typeof url === "string" && url.trim() !== "")}
              interval={5000}
            />
          )}
        </div>
      </section>

      {/* Feed de Redes Sociais - integrado com banco de dados */}
      <SocialMediaFeed posts={socialPosts} galleryPhotos={galleryPhotos} />
    </>
  );
}
