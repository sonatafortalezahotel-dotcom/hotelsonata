/**
 * Script para popular o banco de dados com dados de teste profissionais
 * Hotel Sonata de Iracema - Fortaleza, CE
 * 
 * Execute: npm run seed:hotel ou tsx scripts/seed-hotel-data.ts
 */

// IMPORTANTE: Carregar dotenv ANTES de qualquer importação que use process.env
import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";

// Carrega .env.local primeiro, depois .env
const envLocalPath = resolve(process.cwd(), ".env.local");
const envPath = resolve(process.cwd(), ".env");

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
}
if (existsSync(envPath)) {
  config({ path: envPath });
}

// Verifica se DATABASE_URL foi carregada
if (!process.env.DATABASE_URL) {
  console.error("❌ Erro: DATABASE_URL não está definida nas variáveis de ambiente");
  console.error("💡 Verifique se o arquivo .env.local existe e contém DATABASE_URL");
  process.exit(1);
}

// Cria conexão direta com o banco (sem usar lib/db que carrega antes do dotenv)
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import {
  highlights,
  highlightTranslations,
  packages,
  packageTranslations,
  rooms,
  roomTranslations,
  gallery,
  certifications,
  certificationTranslations,
  nearbyAttractions,
  nearbyAttractionTranslations,
  events,
  eventTranslations,
  reservations,
} from "../lib/db/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// URLs de imagens placeholder profissionais usando Picsum Photos (Lorem Picsum)
// Serviço gratuito, confiável e não requer autenticação
// Formato: https://picsum.photos/id/{id}/{width}/{height}
// Documentação: https://picsum.photos/

// IDs válidos e testados de imagens do Picsum Photos organizados por categoria
// Todos os IDs abaixo de 1000 são válidos e funcionam corretamente
// Cada ID retorna uma imagem diferente e válida
const PICSUM_PHOTOS = {
  // Quartos e acomodações - IDs válidos testados
  rooms: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115],
  // Hotéis e praias - IDs válidos testados
  hotels: [201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215],
  // Piscinas - IDs válidos testados
  pools: [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315],
  // Gastronomia - IDs válidos testados
  food: [312, 326, 339, 342, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357],
  // Eventos - IDs válidos testados
  events: [401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415],
  // Spa e bem-estar - IDs válidos testados
  spa: [501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515],
  // Atividades esportivas - IDs válidos testados
  sports: [601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615],
  // Sustentabilidade - IDs válidos testados
  sustainability: [701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715],
  // Certificações - IDs válidos testados
  certifications: [801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815],
  // Pontos turísticos - IDs válidos testados
  attractions: [901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914, 915],
  // Bares e restaurantes - IDs válidos testados
  bars: [951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965],
};

// Função para gerar URLs válidas do Picsum Photos
function getPicsumUrl(photoId: number, width: number = 1200, height?: number): string {
  const h = height || Math.round(width * 0.75); // Aspect ratio 4:3 padrão
  return `https://picsum.photos/id/${photoId}/${width}/${h}`;
}

const HOTEL_IMAGES = {
  // Quartos - URLs válidas do Picsum Photos
  roomStandard: getPicsumUrl(PICSUM_PHOTOS.rooms[0], 1200),
  roomLuxo: getPicsumUrl(PICSUM_PHOTOS.rooms[1], 1200),
  roomSuite: getPicsumUrl(PICSUM_PHOTOS.rooms[2], 1200),
  roomVistaMar: getPicsumUrl(PICSUM_PHOTOS.rooms[3], 1200),
  
  // Galeria de quartos
  roomGallery1: getPicsumUrl(PICSUM_PHOTOS.rooms[4], 800),
  roomGallery2: getPicsumUrl(PICSUM_PHOTOS.rooms[5], 800),
  roomGallery3: getPicsumUrl(PICSUM_PHOTOS.rooms[6], 800),
  roomGallery4: getPicsumUrl(PICSUM_PHOTOS.rooms[7], 800),
  
  // Destaques/Carrossel
  highlight1: getPicsumUrl(PICSUM_PHOTOS.hotels[0], 1920),
  highlight2: getPicsumUrl(PICSUM_PHOTOS.hotels[1], 1920),
  highlight3: getPicsumUrl(PICSUM_PHOTOS.hotels[2], 1920),
  
  // Pacotes
  packageRomantico: getPicsumUrl(PICSUM_PHOTOS.events[0], 1200),
  packageFamiliar: getPicsumUrl(PICSUM_PHOTOS.events[0], 1200),
  packageDayUse: getPicsumUrl(PICSUM_PHOTOS.hotels[0], 1200),
  
  // Eventos
  eventoCasamento: getPicsumUrl(PICSUM_PHOTOS.events[0], 1200),
  eventoCorporativo: getPicsumUrl(PICSUM_PHOTOS.events[1], 1200),
  
  // Certificações
  certificacao1: getPicsumUrl(PICSUM_PHOTOS.certifications[0], 400),
  certificacao2: getPicsumUrl(PICSUM_PHOTOS.certifications[1], 400),
  
  // Pontos Turísticos
  iracema: getPicsumUrl(PICSUM_PHOTOS.attractions[0], 1200),
  ponteIngleses: getPicsumUrl(PICSUM_PHOTOS.attractions[1], 1200),
  dragaoMar: getPicsumUrl(PICSUM_PHOTOS.attractions[2], 1200),
  
  // Galeria Geral
  piscina: getPicsumUrl(PICSUM_PHOTOS.pools[0], 1200),
  restaurante: getPicsumUrl(PICSUM_PHOTOS.food[0], 1200),
  recepcao: getPicsumUrl(PICSUM_PHOTOS.hotels[3], 1200),
  bar: getPicsumUrl(PICSUM_PHOTOS.bars[0], 1200),
};

async function seedHighlights() {
  console.log("🌅 Criando destaques...");
  
  // Verifica se já existem destaques
  const existingHighlights = await db.select().from(highlights);
  if (existingHighlights.length > 0) {
    console.log(`⚠️  Já existem ${existingHighlights.length} destaques no banco. Pulando criação de destaques.`);
    return;
  }
  
  const highlightsData = [
    {
      imageUrl: HOTEL_IMAGES.highlight1,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      active: true,
      order: 1,
      translations: {
        pt: {
          title: "Bem-vindo ao Hotel Sonata de Iracema",
          description: "20 anos de tradição em hospitalidade à beira-mar",
        },
        es: {
          title: "Bienvenido al Hotel Sonata de Iracema",
          description: "20 años de tradición en hospitalidad frente al mar",
        },
        en: {
          title: "Welcome to Hotel Sonata de Iracema",
          description: "20 years of hospitality tradition by the sea",
        },
      },
    },
    {
      imageUrl: HOTEL_IMAGES.highlight2,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      active: true,
      order: 2,
      translations: {
        pt: {
          title: "Vista Privilegiada para o Mar",
          description: "Desperte com o som das ondas e uma vista deslumbrante",
        },
        es: {
          title: "Vista Privilegiada al Mar",
          description: "Despierta con el sonido de las olas y una vista deslumbrante",
        },
        en: {
          title: "Privileged Ocean View",
          description: "Wake up to the sound of waves and a stunning view",
        },
      },
    },
    {
      imageUrl: HOTEL_IMAGES.highlight3,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      active: true,
      order: 3,
      translations: {
        pt: {
          title: "Experiências Inesquecíveis",
          description: "Crie memórias únicas em um dos melhores hotéis de Fortaleza",
        },
        es: {
          title: "Experiencias Inolvidables",
          description: "Crea recuerdos únicos en uno de los mejores hoteles de Fortaleza",
        },
        en: {
          title: "Unforgettable Experiences",
          description: "Create unique memories at one of Fortaleza's best hotels",
        },
      },
    },
  ];

  for (const highlight of highlightsData) {
    const [created] = await db
      .insert(highlights)
      .values({
        imageUrl: highlight.imageUrl,
        startDate: highlight.startDate,
        endDate: highlight.endDate,
        active: highlight.active,
        order: highlight.order,
      })
      .returning();

    for (const [locale, translation] of Object.entries(highlight.translations)) {
      await db.insert(highlightTranslations).values({
        highlightId: created.id,
        locale,
        title: translation.title,
        description: translation.description,
      });
    }
  }

  console.log(`✅ ${highlightsData.length} destaques criados`);
}

async function seedRooms() {
  console.log("🛏️ Criando quartos...");

  // Verifica se já existem quartos
  const existingRooms = await db.select().from(rooms);
  if (existingRooms.length > 0) {
    console.log(`⚠️  Já existem ${existingRooms.length} quartos no banco. Pulando criação de quartos.`);
    return;
  }

  const roomsData = [
    {
      code: "standard",
      size: 25,
      maxGuests: 2,
      hasSeaView: true,
      hasBalcony: false,
      amenities: ["WiFi Grátis", "Ar Condicionado", "TV Smart", "Cofre", "Frigobar"],
      basePrice: 20000, // R$ 200,00 em centavos
      imageUrl: HOTEL_IMAGES.roomStandard,
      gallery: [
        HOTEL_IMAGES.roomGallery1,
        HOTEL_IMAGES.roomGallery2,
        HOTEL_IMAGES.roomGallery3,
      ],
      active: true,
      order: 1,
      translations: {
        pt: {
          name: "Quarto Standard",
          description: "Quarto confortável com vista para o mar, ideal para casais. Equipado com todas as comodidades necessárias para uma estadia agradável.",
          shortDescription: "Quarto confortável com vista para o mar",
          amenities: ["WiFi Grátis", "Ar Condicionado", "TV Smart", "Cofre", "Frigobar"],
        },
        es: {
          name: "Habitación Estándar",
          description: "Habitación cómoda con vista al mar, ideal para parejas. Equipada con todas las comodidades necesarias para una estancia agradable.",
          shortDescription: "Habitación cómoda con vista al mar",
          amenities: ["WiFi Gratis", "Aire Acondicionado", "TV Smart", "Caja Fuerte", "Minibar"],
        },
        en: {
          name: "Standard Room",
          description: "Comfortable room with ocean view, ideal for couples. Equipped with all necessary amenities for a pleasant stay.",
          shortDescription: "Comfortable room with ocean view",
          amenities: ["Free WiFi", "Air Conditioning", "Smart TV", "Safe", "Minibar"],
        },
      },
    },
    {
      code: "luxo",
      size: 35,
      maxGuests: 3,
      hasSeaView: true,
      hasBalcony: true,
      amenities: ["WiFi Grátis", "Ar Condicionado", "TV Smart 55\"", "Cofre", "Frigobar", "Varanda Privativa", "Cama King Size"],
      basePrice: 30000, // R$ 300,00
      imageUrl: HOTEL_IMAGES.roomLuxo,
      gallery: [
        HOTEL_IMAGES.roomGallery2,
        HOTEL_IMAGES.roomGallery3,
        HOTEL_IMAGES.roomGallery4,
      ],
      active: true,
      order: 2,
      translations: {
        pt: {
          name: "Quarto Luxo",
          description: "Quarto espaçoso com varanda privativa e vista panorâmica para o mar. Perfeito para quem busca conforto e sofisticação.",
          shortDescription: "Quarto espaçoso com varanda e vista panorâmica",
          amenities: ["WiFi Grátis", "Ar Condicionado", "TV Smart 55\"", "Cofre", "Frigobar", "Varanda Privativa", "Cama King Size"],
        },
        es: {
          name: "Habitación de Lujo",
          description: "Habitación espaciosa con balcón privado y vista panorámica al mar. Perfecta para quienes buscan comodidad y sofisticación.",
          shortDescription: "Habitación espaciosa con balcón y vista panorámica",
          amenities: ["WiFi Gratis", "Aire Acondicionado", "TV Smart 55\"", "Caja Fuerte", "Minibar", "Balcón Privado", "Cama King Size"],
        },
        en: {
          name: "Luxury Room",
          description: "Spacious room with private balcony and panoramic ocean view. Perfect for those seeking comfort and sophistication.",
          shortDescription: "Spacious room with balcony and panoramic view",
          amenities: ["Free WiFi", "Air Conditioning", "55\" Smart TV", "Safe", "Minibar", "Private Balcony", "King Size Bed"],
        },
      },
    },
    {
      code: "suite-master",
      size: 50,
      maxGuests: 4,
      hasSeaView: true,
      hasBalcony: true,
      amenities: ["WiFi Grátis", "Ar Condicionado", "TV Smart 65\"", "Cofre", "Frigobar Premium", "Varanda Privativa", "Cama King Size", "Sala de Estar", "Banheira"],
      basePrice: 45000, // R$ 450,00
      imageUrl: HOTEL_IMAGES.roomSuite,
      gallery: [
        HOTEL_IMAGES.roomGallery1,
        HOTEL_IMAGES.roomGallery3,
        HOTEL_IMAGES.roomGallery4,
        HOTEL_IMAGES.roomVistaMar,
      ],
      active: true,
      order: 3,
      translations: {
        pt: {
          name: "Suíte Master",
          description: "A mais luxuosa acomodação do hotel. Suíte espaçosa com sala de estar, varanda privativa e vista deslumbrante para o mar. Ideal para famílias ou quem busca o máximo conforto.",
          shortDescription: "A mais luxuosa acomodação com sala de estar e varanda",
          amenities: ["WiFi Grátis", "Ar Condicionado", "TV Smart 65\"", "Cofre", "Frigobar Premium", "Varanda Privativa", "Cama King Size", "Sala de Estar", "Banheira"],
        },
        es: {
          name: "Suite Master",
          description: "El alojamiento más lujoso del hotel. Suite espaciosa con sala de estar, balcón privado y vista deslumbrante al mar. Ideal para familias o quienes buscan el máximo confort.",
          shortDescription: "El alojamiento más lujoso con sala de estar y balcón",
          amenities: ["WiFi Gratis", "Aire Acondicionado", "TV Smart 65\"", "Caja Fuerte", "Minibar Premium", "Balcón Privado", "Cama King Size", "Sala de Estar", "Bañera"],
        },
        en: {
          name: "Master Suite",
          description: "The most luxurious accommodation in the hotel. Spacious suite with living room, private balcony and stunning ocean view. Ideal for families or those seeking maximum comfort.",
          shortDescription: "The most luxurious accommodation with living room and balcony",
          amenities: ["Free WiFi", "Air Conditioning", "65\" Smart TV", "Safe", "Premium Minibar", "Private Balcony", "King Size Bed", "Living Room", "Bathtub"],
        },
      },
    },
  ];

  for (const room of roomsData) {
    const [created] = await db
      .insert(rooms)
      .values({
        code: room.code,
        size: room.size,
        maxGuests: room.maxGuests,
        hasSeaView: room.hasSeaView,
        hasBalcony: room.hasBalcony,
        amenities: room.amenities,
        basePrice: room.basePrice,
        imageUrl: room.imageUrl,
        gallery: room.gallery,
        active: room.active,
        order: room.order,
      })
      .returning();

    for (const [locale, translation] of Object.entries(room.translations)) {
      await db.insert(roomTranslations).values({
        roomId: created.id,
        locale,
        name: translation.name,
        description: translation.description,
        shortDescription: translation.shortDescription,
        amenities: translation.amenities,
      });
    }
  }

  console.log(`✅ ${roomsData.length} quartos criados`);
}

async function seedPackages() {
  console.log("📦 Criando pacotes...");

  // Verifica se já existem pacotes
  const existingPackages = await db.select().from(packages);
  if (existingPackages.length > 0) {
    console.log(`⚠️  Já existem ${existingPackages.length} pacotes no banco. Pulando criação de pacotes.`);
    return;
  }

  const packagesData = [
    {
      name: "Pacote Romântico",
      description: "Uma experiência inesquecível para casais",
      imageUrl: HOTEL_IMAGES.packageRomantico,
      price: 80000, // R$ 800,00
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      category: "nupcias",
      active: true,
      order: 1,
      translations: {
        pt: {
          name: "Pacote Romântico",
          description: "2 noites de hospedagem, café da manhã incluso, jantar romântico à beira-mar e decoração especial no quarto.",
        },
        es: {
          name: "Paquete Romántico",
          description: "2 noches de alojamiento, desayuno incluido, cena romántica frente al mar y decoración especial en la habitación.",
        },
        en: {
          name: "Romantic Package",
          description: "2 nights accommodation, breakfast included, romantic dinner by the sea and special room decoration.",
        },
      },
    },
    {
      name: "Pacote Familiar",
      description: "Diversão para toda a família",
      imageUrl: HOTEL_IMAGES.packageFamiliar,
      price: 120000, // R$ 1.200,00
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      category: "cabana-kids",
      active: true,
      order: 2,
      translations: {
        pt: {
          name: "Pacote Familiar",
          description: "3 noites de hospedagem, café da manhã incluso, atividades para crianças e acesso à piscina.",
        },
        es: {
          name: "Paquete Familiar",
          description: "3 noches de alojamiento, desayuno incluido, actividades para niños y acceso a la piscina.",
        },
        en: {
          name: "Family Package",
          description: "3 nights accommodation, breakfast included, children's activities and pool access.",
        },
      },
    },
    {
      name: "Day Use",
      description: "Aproveite o hotel durante o dia",
      imageUrl: HOTEL_IMAGES.packageDayUse,
      price: 15000, // R$ 150,00
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      category: "day-use",
      active: true,
      order: 3,
      translations: {
        pt: {
          name: "Day Use",
          description: "Uso do quarto das 8h às 18h, acesso à piscina e área de lazer, café da manhã e almoço incluídos.",
        },
        es: {
          name: "Day Use",
          description: "Uso de la habitación de 8h a 18h, acceso a la piscina y área de ocio, desayuno y almuerzo incluidos.",
        },
        en: {
          name: "Day Use",
          description: "Room use from 8am to 6pm, pool and leisure area access, breakfast and lunch included.",
        },
      },
    },
  ];

  for (const pkg of packagesData) {
    const [created] = await db
      .insert(packages)
      .values({
        name: pkg.name,
        description: pkg.description,
        imageUrl: pkg.imageUrl,
        price: pkg.price,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
        category: pkg.category,
        active: pkg.active,
        order: pkg.order,
      })
      .returning();

    for (const [locale, translation] of Object.entries(pkg.translations)) {
      await db.insert(packageTranslations).values({
        packageId: created.id,
        locale,
        name: translation.name,
        description: translation.description,
      });
    }
  }

  console.log(`✅ ${packagesData.length} pacotes criados`);
}

async function seedCertifications() {
  console.log("🏆 Criando certificações...");

  // Verifica se já existem certificações
  const existingCerts = await db.select().from(certifications);
  if (existingCerts.length > 0) {
    console.log(`⚠️  Já existem ${existingCerts.length} certificações no banco. Pulando criação de certificações.`);
    return;
  }

  const certificationsData = [
    {
      name: "TripAdvisor Travelers' Choice",
      description: "Reconhecido como um dos melhores hotéis pelos viajantes",
      imageUrl: HOTEL_IMAGES.certificacao1,
      active: true,
      order: 1,
      translations: {
        pt: {
          name: "TripAdvisor Travelers' Choice",
          description: "Reconhecido como um dos melhores hotéis pelos viajantes",
        },
        es: {
          name: "TripAdvisor Travelers' Choice",
          description: "Reconocido como uno de los mejores hoteles por los viajeros",
        },
        en: {
          name: "TripAdvisor Travelers' Choice",
          description: "Recognized as one of the best hotels by travelers",
        },
      },
    },
    {
      name: "Booking.com Guest Review Award",
      description: "Excelente avaliação dos hóspedes",
      imageUrl: HOTEL_IMAGES.certificacao2,
      active: true,
      order: 2,
      translations: {
        pt: {
          name: "Booking.com Guest Review Award",
          description: "Excelente avaliação dos hóspedes",
        },
        es: {
          name: "Booking.com Guest Review Award",
          description: "Excelente evaluación de los huéspedes",
        },
        en: {
          name: "Booking.com Guest Review Award",
          description: "Excellent guest rating",
        },
      },
    },
  ];

  for (const cert of certificationsData) {
    const [created] = await db
      .insert(certifications)
      .values({
        name: cert.name,
        description: cert.description,
        imageUrl: cert.imageUrl,
        active: cert.active,
        order: cert.order,
      })
      .returning();

    for (const [locale, translation] of Object.entries(cert.translations)) {
      await db.insert(certificationTranslations).values({
        certificationId: created.id,
        locale,
        name: translation.name,
        description: translation.description,
      });
    }
  }

  console.log(`✅ ${certificationsData.length} certificações criadas`);
}

async function seedNearbyAttractions() {
  console.log("📍 Criando pontos turísticos próximos...");

  // Verifica se já existem pontos turísticos
  const existingAttractions = await db.select().from(nearbyAttractions);
  if (existingAttractions.length > 0) {
    console.log(`⚠️  Já existem ${existingAttractions.length} pontos turísticos no banco. Pulando criação.`);
    return;
  }

  const attractionsData = [
    {
      code: "praia-iracema",
      imageUrl: HOTEL_IMAGES.iracema,
      active: true,
      order: 1,
      translations: {
        pt: {
          name: "Praia de Iracema",
          distance: "Em frente ao hotel",
        },
        es: {
          name: "Playa de Iracema",
          distance: "Frente al hotel",
        },
        en: {
          name: "Iracema Beach",
          distance: "In front of the hotel",
        },
      },
    },
    {
      code: "ponte-dos-ingleses",
      imageUrl: HOTEL_IMAGES.ponteIngleses,
      active: true,
      order: 2,
      translations: {
        pt: {
          name: "Ponte dos Ingleses",
          distance: "5 minutos a pé",
        },
        es: {
          name: "Puente de los Ingleses",
          distance: "5 minutos a pie",
        },
        en: {
          name: "English Bridge",
          distance: "5 minutes walk",
        },
      },
    },
    {
      code: "centro-dragao-do-mar",
      imageUrl: HOTEL_IMAGES.dragaoMar,
      active: true,
      order: 3,
      translations: {
        pt: {
          name: "Centro Dragão do Mar",
          distance: "10 minutos de carro",
        },
        es: {
          name: "Centro Dragão do Mar",
          distance: "10 minutos en coche",
        },
        en: {
          name: "Dragão do Mar Cultural Center",
          distance: "10 minutes by car",
        },
      },
    },
  ];

  for (const attraction of attractionsData) {
    const [created] = await db
      .insert(nearbyAttractions)
      .values({
        code: attraction.code,
        imageUrl: attraction.imageUrl,
        active: attraction.active,
        order: attraction.order,
      })
      .returning();

    for (const [locale, translation] of Object.entries(attraction.translations)) {
      await db.insert(nearbyAttractionTranslations).values({
        nearbyAttractionId: created.id,
        locale,
        name: translation.name,
        distance: translation.distance,
      });
    }
  }

  console.log(`✅ ${attractionsData.length} pontos turísticos criados`);
}

async function seedEvents() {
  console.log("🎉 Criando eventos...");

  // Verifica se já existem eventos
  const existingEvents = await db.select().from(events);
  if (existingEvents.length > 0) {
    console.log(`⚠️  Já existem ${existingEvents.length} eventos no banco. Pulando criação de eventos.`);
    return;
  }

  const eventsData = [
    {
      type: "casamento",
      capacity: 150,
      imageUrl: HOTEL_IMAGES.eventoCasamento,
      gallery: [HOTEL_IMAGES.eventoCasamento, HOTEL_IMAGES.eventoCorporativo],
      facilities: ["Pista de Dança", "Sistema de Som", "Iluminação Profissional", "Decoração"],
      active: true,
      order: 1,
      translations: {
        pt: {
          title: "Casamentos",
          description: "Realize o casamento dos seus sonhos em um ambiente único à beira-mar. Espaço elegante com capacidade para até 150 convidados.",
          facilities: ["Pista de Dança", "Sistema de Som", "Iluminação Profissional", "Decoração", "Buffet Completo"],
        },
        es: {
          title: "Bodas",
          description: "Realice la boda de sus sueños en un ambiente único frente al mar. Espacio elegante con capacidad para hasta 150 invitados.",
          facilities: ["Pista de Baile", "Sistema de Sonido", "Iluminación Profesional", "Decoración", "Buffet Completo"],
        },
        en: {
          title: "Weddings",
          description: "Make your dream wedding come true in a unique setting by the sea. Elegant space with capacity for up to 150 guests.",
          facilities: ["Dance Floor", "Sound System", "Professional Lighting", "Decoration", "Full Buffet"],
        },
      },
    },
    {
      type: "corporativo",
      capacity: 200,
      imageUrl: HOTEL_IMAGES.eventoCorporativo,
      gallery: [HOTEL_IMAGES.eventoCorporativo],
      facilities: ["Projetor", "Tela", "WiFi", "Coffee Break"],
      active: true,
      order: 2,
      translations: {
        pt: {
          title: "Eventos Corporativos",
          description: "Espaço moderno e equipado para reuniões, palestras e eventos corporativos. Capacidade para até 200 pessoas.",
          facilities: ["Projetor", "Tela", "WiFi", "Coffee Break", "Equipamentos de Áudio"],
        },
        es: {
          title: "Eventos Corporativos",
          description: "Espacio moderno y equipado para reuniones, conferencias y eventos corporativos. Capacidad para hasta 200 personas.",
          facilities: ["Proyector", "Pantalla", "WiFi", "Coffee Break", "Equipos de Audio"],
        },
        en: {
          title: "Corporate Events",
          description: "Modern and equipped space for meetings, lectures and corporate events. Capacity for up to 200 people.",
          facilities: ["Projector", "Screen", "WiFi", "Coffee Break", "Audio Equipment"],
        },
      },
    },
  ];

  for (const event of eventsData) {
    const [created] = await db
      .insert(events)
      .values({
        type: event.type,
        capacity: event.capacity,
        imageUrl: event.imageUrl,
        gallery: event.gallery,
        facilities: event.facilities,
        active: event.active,
        order: event.order,
      })
      .returning();

    for (const [locale, translation] of Object.entries(event.translations)) {
      await db.insert(eventTranslations).values({
        eventId: created.id,
        locale,
        title: translation.title,
        description: translation.description,
        facilities: translation.facilities,
      });
    }
  }

  console.log(`✅ ${eventsData.length} eventos criados`);
}

async function seedGallery() {
  console.log("📸 Criando galeria completa...");

  // Limpa imagens antigas que não têm page/section (sistema antigo)
  // ou que têm page/section mas vamos recriar para garantir que estão corretas
  console.log("🧹 Limpando imagens antigas da galeria...");
  await db.delete(gallery);
  console.log("✅ Imagens antigas removidas");

  // Função auxiliar para obter ID de foto do Picsum de forma circular (reutiliza IDs quando necessário)
  function getPhotoId(category: keyof typeof PICSUM_PHOTOS, index: number): number {
    const photos = PICSUM_PHOTOS[category];
    return photos[index % photos.length];
  }

  // Função auxiliar para gerar URL do Picsum Photos
  function getPhotoUrl(category: keyof typeof PICSUM_PHOTOS, index: number, width: number = 1200): string {
    const photoId = getPhotoId(category, index);
    return getPicsumUrl(photoId, width);
  }

  const galleryData: Array<{
    title: string;
    imageUrl: string;
    page?: string;
    section?: string;
    description?: string;
    order: number;
    active: boolean;
  }> = [];

  let orderCounter = 1;

  // ========== HOME ==========
  // Experiências - Piscina (4 imagens)
  for (let i = 0; i < 4; i++) {
    galleryData.push({
      title: `Piscina Vista Mar ${i + 1}`,
      imageUrl: getPhotoUrl("pools", i, 1200),
      page: "home",
      section: "experiencias-piscina",
      description: `Imagem ${i + 1} da piscina com vista para o mar`,
      order: orderCounter++,
      active: true,
    });
  }

  // Experiências - Gastronomia (4 imagens)
  for (let i = 0; i < 4; i++) {
    galleryData.push({
      title: `Gastronomia ${i + 1}`,
      imageUrl: getPhotoUrl("food", i, 1200),
      page: "home",
      section: "experiencias-gastronomia",
      description: `Imagem ${i + 1} de pratos e restaurante`,
      order: orderCounter++,
      active: true,
    });
  }

  // Experiências - Quartos (3 imagens)
  for (let i = 0; i < 3; i++) {
    galleryData.push({
      title: `Quarto ${i + 1}`,
      imageUrl: getPhotoUrl("rooms", i, 1200),
      page: "home",
      section: "experiencias-quartos",
      description: `Imagem ${i + 1} de quartos e acomodações`,
      order: orderCounter++,
      active: true,
    });
  }

  // Experiências - Spa (3 imagens)
  for (let i = 0; i < 3; i++) {
    galleryData.push({
      title: `Spa & Bem-Estar ${i + 1}`,
      imageUrl: getPhotoUrl("spa", i, 1200),
      page: "home",
      section: "experiencias-spa",
      description: `Imagem ${i + 1} do spa e área de relaxamento`,
      order: orderCounter++,
      active: true,
    });
  }

  // Experiências - Beach Tennis (2 imagens)
  for (let i = 0; i < 2; i++) {
    galleryData.push({
      title: `Beach Tennis ${i + 1}`,
      imageUrl: getPhotoUrl("sports", i, 1200),
      page: "home",
      section: "experiencias-beach-tennis",
      description: `Imagem ${i + 1} de beach tennis e atividades esportivas`,
      order: orderCounter++,
      active: true,
    });
  }

  // Experiências - Sustentabilidade (2 imagens)
  for (let i = 0; i < 2; i++) {
    galleryData.push({
      title: `Sustentabilidade ${i + 1}`,
      imageUrl: getPhotoUrl("sustainability", i, 1200),
      page: "home",
      section: "experiencias-sustentabilidade",
      description: `Imagem ${i + 1} de ações sustentáveis`,
      order: orderCounter++,
      active: true,
    });
  }

  // Photo Story - Um Dia no Hotel (8 imagens)
  for (let i = 0; i < 8; i++) {
    galleryData.push({
      title: `Momento do Dia ${i + 1}`,
      imageUrl: getPhotoUrl("hotels", i, 1200),
      page: "home",
      section: "photo-story",
      description: `Momento ${i + 1} de um dia no hotel`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria - Momentos Inesquecíveis (9 imagens)
  for (let i = 0; i < 9; i++) {
    galleryData.push({
      title: `Momento Inesquecível ${i + 1}`,
      imageUrl: getPhotoUrl("hotels", i, 1200),
      page: "home",
      section: "galeria-momentos",
      description: `Imagem ${i + 1} de momentos inesquecíveis`,
      order: orderCounter++,
      active: true,
    });
  }

  // Localização - Pontos Turísticos (4 imagens)
  for (let i = 0; i < 4; i++) {
    galleryData.push({
      title: `Ponto Turístico ${i + 1}`,
      imageUrl: getPhotoUrl("attractions", i, 1200),
      page: "home",
      section: "localizacao-pontos",
      description: `Imagem ${i + 1} de pontos turísticos próximos`,
      order: orderCounter++,
      active: true,
    });
  }

  // ========== LAZER ==========
  // Hero Lazer (1 imagem)
  galleryData.push({
    title: "Hero - Piscina Vista Mar",
    imageUrl: getPhotoUrl("pools", 0, 1920),
    page: "lazer",
    section: "hero-lazer",
    description: "Imagem principal da página de lazer",
    order: orderCounter++,
    active: true,
  });

  // Galeria - Piscina Vista Mar (6 imagens)
  for (let i = 0; i < 6; i++) {
    galleryData.push({
      title: `Piscina ${i + 1}`,
      imageUrl: getPhotoUrl("pools", i, 1200),
      page: "lazer",
      section: "galeria-piscina",
      description: `Imagem ${i + 1} da piscina com vista para o mar`,
      order: orderCounter++,
      active: true,
    });
  }

  // Photo Story - Atividades do Dia (4 imagens)
  for (let i = 0; i < 4; i++) {
    galleryData.push({
      title: `Atividade ${i + 1}`,
      imageUrl: getPhotoUrl("sports", i, 1200),
      page: "lazer",
      section: "photo-story-lazer",
      description: `Imagem ${i + 1} de atividades de lazer`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria - Academia & Fitness (4 imagens)
  for (let i = 0; i < 4; i++) {
    galleryData.push({
      title: `Academia ${i + 1}`,
      imageUrl: getPhotoUrl("sports", i, 1200),
      page: "lazer",
      section: "galeria-academia",
      description: `Imagem ${i + 1} da academia e equipamentos`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria - Atividades ao Ar Livre (4 imagens)
  for (let i = 0; i < 4; i++) {
    galleryData.push({
      title: `Atividade ao Ar Livre ${i + 1}`,
      imageUrl: getPhotoUrl("sports", i, 1200),
      page: "lazer",
      section: "galeria-atividades",
      description: `Imagem ${i + 1} de atividades esportivas`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria - Spa & Relaxamento (4 imagens)
  for (let i = 0; i < 4; i++) {
    galleryData.push({
      title: `Spa ${i + 1}`,
      imageUrl: getPhotoUrl("spa", i, 1200),
      page: "lazer",
      section: "galeria-spa",
      description: `Imagem ${i + 1} do spa e relaxamento`,
      order: orderCounter++,
      active: true,
    });
  }

  // Cards de Atividades (15 imagens - 3 por card)
  for (let i = 0; i < 15; i++) {
    galleryData.push({
      title: `Card Atividade ${i + 1}`,
      imageUrl: getPhotoUrl("sports", i, 1200),
      page: "lazer",
      section: "cards-atividades",
      description: `Imagem ${i + 1} para cards de atividades`,
      order: orderCounter++,
      active: true,
    });
  }

  // Localização - Contexto (1 imagem)
  galleryData.push({
    title: "Localização Privilegiada",
    imageUrl: getPhotoUrl("attractions", 0, 1200),
    page: "lazer",
    section: "localizacao-lazer",
    description: "Vista da localização privilegiada do hotel",
    order: orderCounter++,
    active: true,
  });

  // ========== GASTRONOMIA ==========
  // Hero Gastronomia (1 imagem)
  galleryData.push({
    title: "Hero - Gastronomia",
    imageUrl: getPhotoUrl("food", 0, 1920),
    page: "gastronomia",
    section: "hero-gastronomia",
    description: "Imagem principal da página de gastronomia",
    order: orderCounter++,
    active: true,
  });

  // Card - Café da Manhã (4 imagens)
  for (let i = 0; i < 4; i++) {
    galleryData.push({
      title: `Café da Manhã ${i + 1}`,
      imageUrl: getPhotoUrl("food", i, 1200),
      page: "gastronomia",
      section: "card-cafe-manha",
      description: `Imagem ${i + 1} do café da manhã`,
      order: orderCounter++,
      active: true,
    });
  }

  // Card - Restaurante (5 imagens)
  for (let i = 0; i < 5; i++) {
    galleryData.push({
      title: `Restaurante ${i + 1}`,
      imageUrl: getPhotoUrl("food", i, 1200),
      page: "gastronomia",
      section: "card-restaurante",
      description: `Imagem ${i + 1} do restaurante`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria - Café da Manhã (6 imagens)
  for (let i = 0; i < 6; i++) {
    galleryData.push({
      title: `Café ${i + 1}`,
      imageUrl: getPhotoUrl("food", i, 1200),
      page: "gastronomia",
      section: "galeria-cafe",
      description: `Imagem ${i + 1} de pratos do café da manhã`,
      order: orderCounter++,
      active: true,
    });
  }

  // Photo Story - Experiência Gastronômica (4 imagens)
  for (let i = 0; i < 4; i++) {
    galleryData.push({
      title: `Experiência Gastronômica ${i + 1}`,
      imageUrl: getPhotoUrl("food", i, 1200),
      page: "gastronomia",
      section: "photo-story-gastronomia",
      description: `Momento ${i + 1} da experiência gastronômica`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria - Restaurante e Pratos (6 imagens)
  for (let i = 0; i < 6; i++) {
    galleryData.push({
      title: `Prato ${i + 1}`,
      imageUrl: getPhotoUrl("food", i, 1200),
      page: "gastronomia",
      section: "galeria-restaurante",
      description: `Imagem ${i + 1} de pratos do restaurante`,
      order: orderCounter++,
      active: true,
    });
  }

  // ========== ESG ==========
  // Hero ESG (1 imagem)
  galleryData.push({
    title: "Hero - ESG",
    imageUrl: getPhotoUrl("sustainability", 0, 1920),
    page: "esg",
    section: "hero-esg",
    description: "Imagem principal da página ESG",
    order: orderCounter++,
    active: true,
  });

  // Galeria - Práticas Sustentáveis (6 imagens)
  for (let i = 0; i < 6; i++) {
    galleryData.push({
      title: `Prática Sustentável ${i + 1}`,
      imageUrl: getPhotoUrl("sustainability", i, 1200),
      page: "esg",
      section: "galeria-praticas",
      description: `Imagem ${i + 1} de práticas sustentáveis`,
      order: orderCounter++,
      active: true,
    });
  }

  // Photo Story - Impacto Social e Ambiental (4 imagens)
  for (let i = 0; i < 4; i++) {
    galleryData.push({
      title: `Impacto ${i + 1}`,
      imageUrl: getPhotoUrl("sustainability", i, 1200),
      page: "esg",
      section: "photo-story-impacto",
      description: `Imagem ${i + 1} do impacto social e ambiental`,
      order: orderCounter++,
      active: true,
    });
  }

  // Ações Sociais - Imagem Destaque (1 imagem)
  galleryData.push({
    title: "Ações Sociais",
    imageUrl: getPhotoUrl("sustainability", 0, 1200),
    page: "esg",
    section: "acoes-sociais",
    description: "Imagem de destaque para ações sociais",
    order: orderCounter++,
    active: true,
  });

  // ========== CONTATO ==========
  // Hero Contato (1 imagem)
  galleryData.push({
    title: "Hero - Contato",
    imageUrl: getPhotoUrl("hotels", 3, 1920),
    page: "contato",
    section: "hero-contato",
    description: "Imagem principal da página de contato",
    order: orderCounter++,
    active: true,
  });

  // Galeria - Nossa Equipe (3 imagens)
  for (let i = 0; i < 3; i++) {
    galleryData.push({
      title: `Equipe ${i + 1}`,
      imageUrl: getPhotoUrl("hotels", i, 1200),
      page: "contato",
      section: "galeria-equipe",
      description: `Imagem ${i + 1} da equipe do hotel`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria - Como Chegar (4 imagens)
  for (let i = 0; i < 4; i++) {
    galleryData.push({
      title: `Localização ${i + 1}`,
      imageUrl: getPhotoUrl("attractions", i, 1200),
      page: "contato",
      section: "galeria-localizacao",
      description: `Imagem ${i + 1} da localização e arredores`,
      order: orderCounter++,
      active: true,
    });
  }

  // ========== RESERVAS ==========
  // Hero Reservas (1 imagem)
  galleryData.push({
    title: "Hero - Reservas",
    imageUrl: getPhotoUrl("rooms", 0, 1920),
    page: "reservas",
    section: "hero-reservas",
    description: "Imagem de fundo da página de reservas",
    order: orderCounter++,
    active: true,
  });

  // ========== SEO LANDING PAGES ==========
  // Hero Padrão - Português (5 imagens)
  for (let i = 0; i < 5; i++) {
    galleryData.push({
      title: `Hero PT ${i + 1}`,
      imageUrl: getPhotoUrl("hotels", i, 1920),
      page: "seo-landing-page",
      section: "seo-hero-padrao-pt",
      description: `Imagem hero padrão ${i + 1} para landing pages em português`,
      order: orderCounter++,
      active: true,
    });
  }

  // Hero Padrão - Español (5 imagens)
  for (let i = 0; i < 5; i++) {
    galleryData.push({
      title: `Hero ES ${i + 1}`,
      imageUrl: getPhotoUrl("hotels", i, 1920),
      page: "seo-landing-page",
      section: "seo-hero-padrao-es",
      description: `Imagem hero padrão ${i + 1} para landing pages em espanhol`,
      order: orderCounter++,
      active: true,
    });
  }

  // Hero Padrão - English (5 imagens)
  for (let i = 0; i < 5; i++) {
    galleryData.push({
      title: `Hero EN ${i + 1}`,
      imageUrl: getPhotoUrl("hotels", i, 1920),
      page: "seo-landing-page",
      section: "seo-hero-padrao-en",
      description: `Imagem hero padrão ${i + 1} para landing pages em inglês`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Quartos - Português (8 imagens)
  for (let i = 0; i < 8; i++) {
    galleryData.push({
      title: `Quarto PT ${i + 1}`,
      imageUrl: getPhotoUrl("rooms", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-quartos-pt",
      description: `Imagem de quarto ${i + 1} para landing pages em português`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Quartos - Español (8 imagens)
  for (let i = 0; i < 8; i++) {
    galleryData.push({
      title: `Quarto ES ${i + 1}`,
      imageUrl: getPhotoUrl("rooms", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-quartos-es",
      description: `Imagem de quarto ${i + 1} para landing pages em espanhol`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Quartos - English (8 imagens)
  for (let i = 0; i < 8; i++) {
    galleryData.push({
      title: `Quarto EN ${i + 1}`,
      imageUrl: getPhotoUrl("rooms", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-quartos-en",
      description: `Imagem de quarto ${i + 1} para landing pages em inglês`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Gastronomia - Português (8 imagens)
  for (let i = 0; i < 8; i++) {
    galleryData.push({
      title: `Gastronomia PT ${i + 1}`,
      imageUrl: getPhotoUrl("food", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-gastronomia-pt",
      description: `Imagem de gastronomia ${i + 1} para landing pages em português`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Gastronomia - Español (8 imagens)
  for (let i = 0; i < 8; i++) {
    galleryData.push({
      title: `Gastronomia ES ${i + 1}`,
      imageUrl: getPhotoUrl("food", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-gastronomia-es",
      description: `Imagem de gastronomia ${i + 1} para landing pages em espanhol`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Gastronomia - English (8 imagens)
  for (let i = 0; i < 8; i++) {
    galleryData.push({
      title: `Gastronomia EN ${i + 1}`,
      imageUrl: getPhotoUrl("food", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-gastronomia-en",
      description: `Imagem de gastronomia ${i + 1} para landing pages em inglês`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Lazer - Português (8 imagens)
  for (let i = 0; i < 8; i++) {
    galleryData.push({
      title: `Lazer PT ${i + 1}`,
      imageUrl: getPhotoUrl("pools", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-lazer-pt",
      description: `Imagem de lazer ${i + 1} para landing pages em português`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Lazer - Español (8 imagens)
  for (let i = 0; i < 8; i++) {
    galleryData.push({
      title: `Lazer ES ${i + 1}`,
      imageUrl: getPhotoUrl("pools", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-lazer-es",
      description: `Imagem de lazer ${i + 1} para landing pages em espanhol`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Lazer - English (8 imagens)
  for (let i = 0; i < 8; i++) {
    galleryData.push({
      title: `Lazer EN ${i + 1}`,
      imageUrl: getPhotoUrl("pools", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-lazer-en",
      description: `Imagem de lazer ${i + 1} para landing pages em inglês`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Geral - Português (10 imagens)
  for (let i = 0; i < 10; i++) {
    galleryData.push({
      title: `Geral PT ${i + 1}`,
      imageUrl: getPhotoUrl("hotels", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-geral-pt",
      description: `Imagem geral ${i + 1} para landing pages em português`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Geral - Español (10 imagens)
  for (let i = 0; i < 10; i++) {
    galleryData.push({
      title: `Geral ES ${i + 1}`,
      imageUrl: getPhotoUrl("hotels", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-geral-es",
      description: `Imagem geral ${i + 1} para landing pages em espanhol`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Geral - English (10 imagens)
  for (let i = 0; i < 10; i++) {
    galleryData.push({
      title: `Geral EN ${i + 1}`,
      imageUrl: getPhotoUrl("hotels", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-geral-en",
      description: `Imagem geral ${i + 1} para landing pages em inglês`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Localização - Português (6 imagens)
  for (let i = 0; i < 6; i++) {
    galleryData.push({
      title: `Localização PT ${i + 1}`,
      imageUrl: getPhotoUrl("attractions", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-localizacao-pt",
      description: `Imagem de localização ${i + 1} para landing pages em português`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Localização - Español (6 imagens)
  for (let i = 0; i < 6; i++) {
    galleryData.push({
      title: `Localização ES ${i + 1}`,
      imageUrl: getPhotoUrl("attractions", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-localizacao-es",
      description: `Imagem de localização ${i + 1} para landing pages em espanhol`,
      order: orderCounter++,
      active: true,
    });
  }

  // Galeria Localização - English (6 imagens)
  for (let i = 0; i < 6; i++) {
    galleryData.push({
      title: `Localização EN ${i + 1}`,
      imageUrl: getPhotoUrl("attractions", i, 1200),
      page: "seo-landing-page",
      section: "seo-galeria-localizacao-en",
      description: `Imagem de localização ${i + 1} para landing pages em inglês`,
      order: orderCounter++,
      active: true,
    });
  }

  // Inserir todas as imagens em batch (mais eficiente)
  if (galleryData.length > 0) {
    // Divide em lotes de 100 para evitar problemas de tamanho
    const batchSize = 100;
    for (let i = 0; i < galleryData.length; i += batchSize) {
      const batch = galleryData.slice(i, i + batchSize);
      await db.insert(gallery).values(batch);
    }
  }

  console.log(`✅ ${galleryData.length} imagens da galeria criadas`);
  console.log(`   - Home: ${galleryData.filter(i => i.page === "home").length} imagens`);
  console.log(`   - Lazer: ${galleryData.filter(i => i.page === "lazer").length} imagens`);
  console.log(`   - Gastronomia: ${galleryData.filter(i => i.page === "gastronomia").length} imagens`);
  console.log(`   - ESG: ${galleryData.filter(i => i.page === "esg").length} imagens`);
  console.log(`   - Contato: ${galleryData.filter(i => i.page === "contato").length} imagens`);
  console.log(`   - Reservas: ${galleryData.filter(i => i.page === "reservas").length} imagens`);
  console.log(`   - SEO Landing Pages: ${galleryData.filter(i => i.page === "seo-landing-page").length} imagens`);
}

async function seedReservations() {
  console.log("📋 Criando reservas de exemplo...");

  // Verifica se já existem reservas (usando apenas campos básicos para evitar erros de schema)
  try {
    const existingReservations = await db.select({ id: reservations.id }).from(reservations).limit(1);
    if (existingReservations.length > 0) {
      console.log(`⚠️  Já existem reservas no banco. Pulando criação de reservas.`);
      return;
    }
  } catch (error) {
    console.log("⚠️  Erro ao verificar reservas existentes. Tentando criar mesmo assim...");
  }

  // Buscar um quarto para criar reservas
  const [room] = await db.select().from(rooms).limit(1);

  if (!room) {
    console.log("⚠️ Nenhum quarto encontrado. Pulando criação de reservas.");
    return;
  }

  const reservationsData = [
    {
      confirmationNumber: "SON-20250115-0001",
      roomId: room.id,
      checkIn: "2025-02-01",
      checkOut: "2025-02-05",
      adults: 2,
      children: 0,
      guestName: "João Silva",
      guestEmail: "joao.silva@email.com",
      guestPhone: "(85) 99999-9999",
      guestDocument: "123.456.789-00",
      basePrice: room.basePrice || 20000,
      totalNights: 4,
      totalPrice: (room.basePrice || 20000) * 4,
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: "credit_card",
    },
    {
      confirmationNumber: "SON-20250116-0002",
      roomId: room.id,
      checkIn: "2025-02-10",
      checkOut: "2025-02-12",
      adults: 2,
      children: 1,
      guestName: "Maria Santos",
      guestEmail: "maria.santos@email.com",
      guestPhone: "(85) 98888-8888",
      guestDocument: "987.654.321-00",
      basePrice: room.basePrice || 20000,
      totalNights: 2,
      totalPrice: (room.basePrice || 20000) * 2,
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: "pix",
    },
  ];

  for (const reservation of reservationsData) {
    await db.insert(reservations).values(reservation);
  }

  console.log(`✅ ${reservationsData.length} reservas de exemplo criadas`);
}

async function main() {
  console.log("🚀 Iniciando seed do banco de dados...\n");

  try {
    await seedHighlights();
    await seedRooms();
    await seedPackages();
    await seedCertifications();
    await seedNearbyAttractions();
    await seedEvents();
    await seedGallery();
    await seedReservations();

    console.log("\n✅ Seed concluído com sucesso!");
    console.log("\n📊 Resumo:");
    console.log("  - Destaques: 3");
    console.log("  - Quartos: 3");
    console.log("  - Pacotes: 3");
    console.log("  - Certificações: 2");
    console.log("  - Pontos Turísticos: 3");
    console.log("  - Eventos: 2");
    console.log("  - Galeria: 4");
    console.log("  - Reservas: 2");
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  }
}

main();

