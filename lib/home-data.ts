import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import {
  rooms,
  roomTranslations,
  packages,
  gallery,
  highlights,
  socialMediaPosts,
} from "@/lib/db/schema";
import { eq, and, asc, desc, gte, lte } from "drizzle-orm";

export type HomeInitialData = {
  rooms: Awaited<ReturnType<typeof fetchHomeRooms>>;
  packages: Awaited<ReturnType<typeof fetchHomePackages>>;
  gallery: Awaited<ReturnType<typeof fetchHomeGallery>>;
  galeriaMomentos: Awaited<ReturnType<typeof fetchHomeGaleriaMomentos>>;
  social: Awaited<ReturnType<typeof fetchHomeSocial>>;
  highlights: Awaited<ReturnType<typeof fetchHomeHighlights>>;
};

async function fetchHomeRooms(locale: string) {
  return db
    .select({
      id: rooms.id,
      code: rooms.code,
      size: rooms.size,
      maxGuests: rooms.maxGuests,
      hasSeaView: rooms.hasSeaView,
      hasBalcony: rooms.hasBalcony,
      amenities: rooms.amenities,
      basePrice: rooms.basePrice,
      imageUrl: rooms.imageUrl,
      gallery: rooms.gallery,
      active: rooms.active,
      order: rooms.order,
      name: roomTranslations.name,
      description: roomTranslations.description,
      shortDescription: roomTranslations.shortDescription,
      translatedAmenities: roomTranslations.amenities,
    })
    .from(rooms)
    .leftJoin(
      roomTranslations,
      and(
        eq(roomTranslations.roomId, rooms.id),
        eq(roomTranslations.locale, locale)
      )
    )
    .where(eq(rooms.active, true))
    .orderBy(rooms.order);
}

async function fetchHomePackages() {
  const today = new Date().toISOString().split("T")[0];
  return db
    .select()
    .from(packages)
    .where(
      and(
        eq(packages.active, true),
        lte(packages.startDate, today),
        gte(packages.endDate, today)
      )
    )
    .orderBy(desc(packages.order));
}

async function fetchHomeGallery() {
  return db
    .select()
    .from(gallery)
    .where(and(eq(gallery.page, "home"), eq(gallery.active, true)))
    .orderBy(asc(gallery.order));
}

async function fetchHomeGaleriaMomentos() {
  return db
    .select()
    .from(gallery)
    .where(
      and(
        eq(gallery.page, "home"),
        eq(gallery.section, "galeria-momentos"),
        eq(gallery.active, true)
      )
    )
    .orderBy(asc(gallery.order))
    .limit(9);
}

async function fetchHomeSocial() {
  return db
    .select()
    .from(socialMediaPosts)
    .where(eq(socialMediaPosts.active, true))
    .orderBy(desc(socialMediaPosts.order))
    .limit(6);
}

async function fetchHomeHighlights() {
  const today = new Date().toISOString().split("T")[0];
  return db
    .select()
    .from(highlights)
    .where(
      and(
        eq(highlights.active, true),
        lte(highlights.startDate, today),
        gte(highlights.endDate, today)
      )
    )
    .orderBy(desc(highlights.order));
}

async function getCachedRooms(locale: string) {
  return unstable_cache(
    () => fetchHomeRooms(locale),
    ["home-rooms", locale],
    { revalidate: 60, tags: ["home-rooms"] }
  )();
}

const getCachedPackages = unstable_cache(fetchHomePackages, ["home-packages"], {
  revalidate: 60,
  tags: ["home-packages"],
});

const getCachedGallery = unstable_cache(fetchHomeGallery, ["home-gallery"], {
  revalidate: 60,
  tags: ["home-gallery"],
});

const getCachedGaleriaMomentos = unstable_cache(
  fetchHomeGaleriaMomentos,
  ["home-galeria-momentos"],
  { revalidate: 60, tags: ["home-gallery"] }
);

const getCachedSocial = unstable_cache(fetchHomeSocial, ["home-social"], {
  revalidate: 60,
  tags: ["home-social"],
});

const getCachedHighlights = unstable_cache(
  fetchHomeHighlights,
  ["home-highlights"],
  { revalidate: 60, tags: ["home-highlights"] }
);

export async function getHomeInitialData(
  locale: string = "pt"
): Promise<HomeInitialData> {
  const [roomsData, packagesData, galleryData, galeriaMomentosData, socialData, highlightsData] =
    await Promise.all([
      getCachedRooms(locale),
      getCachedPackages(),
      getCachedGallery(),
      getCachedGaleriaMomentos(),
      getCachedSocial(),
      getCachedHighlights(),
    ]);

  return {
    rooms: roomsData,
    packages: packagesData,
    gallery: galleryData,
    galeriaMomentos: galeriaMomentosData,
    social: socialData,
    highlights: highlightsData,
  };
}
