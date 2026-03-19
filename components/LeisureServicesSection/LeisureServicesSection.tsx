'use client';

import { AmenityCard } from "@/components/AmenityCard";
import { Waves, Dumbbell, Bike, Trophy, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContent } from "@/lib/utils/pageContent";
import { PageText, PageImage, EditableIcon, EditableTagList } from "@/components/PageEditor";
import { getGalleryImageByPath } from "@/lib/utils/gallery-helpers";
import { getPageContentIcon } from "@/lib/utils/pageContent";
import { getIcon } from "@/lib/icon-registry";
import type { PageKey } from "@/lib/utils/pageContent";
import { useGallery } from "@/lib/hooks/useGallery";

const SERVICE_KEYS = ["pool", "fitness", "bikes", "beachTennis", "massage"] as const;
const DEFAULT_ICON_NAMES: Record<string, string> = {
  pool: "Waves",
  fitness: "Dumbbell",
  bikes: "Bike",
  beachTennis: "Trophy",
  massage: "Sparkles",
};

const SERVICE_CONFIG: Record<string, { icon: typeof Waves; images: string[] }> = {
  pool: { icon: Waves, images: ["/Sobre Hotel/Piscina/1-1_500n80cc400.jpg", "/Sobre Hotel/Piscina/2-1_500n80cc400.jpg", "/Sobre Hotel/Piscina/3-2_500n80cc400.jpg", "/Sobre Hotel/Piscina/5-1_500n80cc400.jpg", "/Sobre Hotel/Piscina/6s_500n80cc400.jpg"] },
  fitness: { icon: Dumbbell, images: ["/Sobre Hotel/Academia/1-2_500n80cc400.jpg", "/Sobre Hotel/Academia/3-3_274n85cc219.jpg", "/Sobre Hotel/Academia/4-3_274n85cc219.jpg", "/Sobre Hotel/Academia/5-2_274n85cc219.jpg"] },
  bikes: { icon: Bike, images: ["/Sobre Hotel/Bikes/159213578_500n80cc400.jpg", "/Sobre Hotel/Bikes/4_500n80cc400.jpg"] },
  beachTennis: { icon: Trophy, images: ["/Sobre Hotel/Aula Beach Tenis/beach-tenis2_274n85cc219.jpg", "/Sobre Hotel/Aula Beach Tenis/beach-tenis4_274n85cc219.jpg"] },
  massage: { icon: Sparkles, images: ["/Sobre Hotel/Spa/DSC-9823_274n85cc219.jpg", "/Sobre Hotel/Spa/DSC-9824_274n85cc219.jpg", "/Sobre Hotel/Spa/MAX-7163_274n85cc219.jpg", "/Sobre Hotel/Spa/MAX-7198_274n85cc219.jpg"] },
};

export function LeisureServicesSection() {
  const { locale } = useLanguage();
  const editor = useEditor();
  const pageKey: PageKey = (editor?.pageKey ?? "hotel") as PageKey;
  const overrides = editor?.overrides ?? {};
  const t = getPageTranslation(locale, "leisureServices");
  const { photos: galleryPhotos } = useGallery();

  return (
    <section className="py-10 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {editor?.editMode ? <PageText page={pageKey} section="leisureServices" fieldKey="title" locale={locale} as="span" /> : (getPageContent(pageKey, "leisureServices", "title", locale, overrides) || t.title)}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {editor?.editMode ? <PageText page={pageKey} section="leisureServices" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent(pageKey, "leisureServices", "subtitle", locale, overrides) || t.subtitle)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICE_KEYS.map((key, index) => {
            const config = SERVICE_CONFIG[key];
            const serviceT = (t as Record<string, unknown>)[key] as { title?: string; description?: string; schedule?: string; badge?: string; tags?: string[] } | undefined;
            const gallerySection = `leisure-${key}`;
            const firstImageUrl = getGalleryImageByPath(galleryPhotos, `gallery:hotel:${gallerySection}:0`) || config.images[0];
            const imagesForCard = editor?.editMode
              ? [<PageImage key="edit" src={firstImageUrl} path={`gallery:hotel:${gallerySection}:0`} aspectRatio="auto" className="absolute inset-0 w-full h-full" />]
              : config.images;
            const iconName = getPageContentIcon("leisureServices", `${key}.icon`, overrides, DEFAULT_ICON_NAMES[key] ?? "Waves");
            const resolvedIcon = getIcon(iconName) ?? config.icon;
            const iconProp = editor?.editMode ? (
              <EditableIcon
                page={pageKey}
                section="leisureServices"
                fieldKey={`${key}.icon`}
                locale={locale}
                defaultIconName={DEFAULT_ICON_NAMES[key] ?? "Waves"}
                defaultIcon={config.icon}
                iconClassName="h-6 w-6 text-primary"
              />
            ) : resolvedIcon;

            return (
              <AmenityCard
                key={index}
                title={editor?.editMode ? <PageText page={pageKey} section="leisureServices" fieldKey={`${key}.title`} locale={locale} as="span" /> : (getPageContent(pageKey, "leisureServices", `${key}.title`, locale, overrides) || (serviceT?.title as string))}
                description={editor?.editMode ? <PageText page={pageKey} section="leisureServices" fieldKey={`${key}.description`} locale={locale} as="span" /> : (getPageContent(pageKey, "leisureServices", `${key}.description`, locale, overrides) || (serviceT?.description as string))}
                images={imagesForCard}
                icon={iconProp}
                schedule={editor?.editMode && "schedule" in (serviceT || {}) ? <PageText page={pageKey} section="leisureServices" fieldKey={`${key}.schedule`} locale={locale} as="span" /> : (getPageContent(pageKey, "leisureServices", `${key}.schedule`, locale, overrides) || ((serviceT as { schedule?: string })?.schedule ?? ""))}
                badge={editor?.editMode ? <PageText page={pageKey} section="leisureServices" fieldKey={`${key}.badge`} locale={locale} as="span" /> : (getPageContent(pageKey, "leisureServices", `${key}.badge`, locale, overrides) || (serviceT?.badge as string))}
                tags={editor?.editMode ? [] : ((serviceT?.tags as string[] | undefined) ?? [])}
                tagsSlot={editor?.editMode ? <EditableTagList page={pageKey} section="leisureServices" fieldKey={`${key}.tags`} locale={locale} /> : undefined}
              />
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            {editor?.editMode ? <PageText page={pageKey} section="leisureServices" fieldKey="footer.text" locale={locale} as="span" /> : (getPageContent(pageKey, "leisureServices", "footer.text", locale, overrides) || t.footer.text)}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/lazer" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
              {editor?.editMode ? <PageText page={pageKey} section="leisureServices" fieldKey="footer.exploreButton" locale={locale} as="span" /> : (getPageContent(pageKey, "leisureServices", "footer.exploreButton", locale, overrides) || t.footer.exploreButton)}
            </a>
            <a href="/contato" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
              {editor?.editMode ? <PageText page={pageKey} section="leisureServices" fieldKey="footer.contactButton" locale={locale} as="span" /> : (getPageContent(pageKey, "leisureServices", "footer.contactButton", locale, overrides) || t.footer.contactButton)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

