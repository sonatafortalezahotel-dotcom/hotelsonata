'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Eye, Home, Dog } from "lucide-react";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEditor } from "@/lib/context/EditorContext";
import { getPageContent } from "@/lib/utils/pageContent";
import { PageText } from "@/components/PageEditor";
import type { PageKey } from "@/lib/utils/pageContent";

export function AccommodationsSection() {
  const { locale } = useLanguage();
  const editor = useEditor();
  const pageKey: PageKey = (editor?.pageKey ?? "hotel") as PageKey;
  const overrides = editor?.overrides ?? {};
  const t = getPageTranslation(locale, "accommodations");
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 min-w-0">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 min-w-0 break-words">
            {editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="title" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "title", locale, overrides) || t.title)}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto min-w-0 break-words">
            {editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="subtitle" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "subtitle", locale, overrides) || t.subtitle)}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <CardContent className="pt-8 pb-6 min-w-0">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 min-w-0 break-words">{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="cards.seaView.title" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "cards.seaView.title", locale, overrides) || t.cards.seaView.title)}</h3>
              <p className="text-muted-foreground min-w-0 break-words">{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="cards.seaView.description" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "cards.seaView.description", locale, overrides) || t.cards.seaView.description)}</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <CardContent className="pt-8 pb-6 min-w-0">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 min-w-0 break-words">{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="cards.comfort.title" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "cards.comfort.title", locale, overrides) || t.cards.comfort.title)}</h3>
              <p className="text-muted-foreground min-w-0 break-words">{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="cards.comfort.description" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "cards.comfort.description", locale, overrides) || t.cards.comfort.description)}</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
            <CardContent className="pt-8 pb-6 min-w-0">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                <Dog className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 min-w-0 break-words">{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="cards.petFriendly.title" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "cards.petFriendly.title", locale, overrides) || t.cards.petFriendly.title)}</h3>
              <p className="text-muted-foreground min-w-0 break-words">{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="cards.petFriendly.description" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "cards.petFriendly.description", locale, overrides) || t.cards.petFriendly.description)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Pet Friendly Details */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6 min-w-0">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Dog className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-2xl font-bold text-foreground mb-2 break-words">{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="petFriendly.title" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "petFriendly.title", locale, overrides) || t.petFriendly.title)}</h3>
                <p className="text-muted-foreground min-w-0 break-words">{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="petFriendly.subtitle" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "petFriendly.subtitle", locale, overrides) || t.petFriendly.subtitle)}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="petFriendly.weOffer" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "petFriendly.weOffer", locale, overrides) || t.petFriendly.weOffer)}</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">✓</span><span>{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="petFriendly.offer1" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "petFriendly.offer1", locale, overrides) || t.petFriendly.offer1)}</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">✓</span><span>{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="petFriendly.offer2" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "petFriendly.offer2", locale, overrides) || t.petFriendly.offer2)}</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">✓</span><span>{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="petFriendly.offer3" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "petFriendly.offer3", locale, overrides) || t.petFriendly.offer3)}</span></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="petFriendly.important" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "petFriendly.important", locale, overrides) || t.petFriendly.important)}</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span>{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="petFriendly.rule1" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "petFriendly.rule1", locale, overrides) || t.petFriendly.rule1)}</span></li>
                  <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span>{editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="petFriendly.rule2" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "petFriendly.rule2", locale, overrides) || t.petFriendly.rule2)}</span></li>
                  {(editor?.editMode ? (getPageContent(pageKey, "accommodations", "petFriendly.fee", locale, overrides) ?? t.petFriendly.fee) : (getPageContent(pageKey, "accommodations", "petFriendly.fee", locale, overrides) ?? t.petFriendly.fee)) ? (
                    <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span dangerouslySetInnerHTML={{ __html: editor?.editMode ? (getPageContent(pageKey, "accommodations", "petFriendly.fee", locale, overrides) || t.petFriendly.fee) : (getPageContent(pageKey, "accommodations", "petFriendly.fee", locale, overrides) || t.petFriendly.fee) }} /></li>
                  ) : null}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <a href="https://api.whatsapp.com/send?phone=558540061616&text=Ol%c3%a1,%20vi%20o%20site%20de%20voc%c3%aas%20e%20gostaria%20de%20mais%20informa%c3%a7%c3%b5es%20por%20favor." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
            {editor?.editMode ? <PageText page={pageKey} section="accommodations" fieldKey="button" locale={locale} as="span" /> : (getPageContent(pageKey, "accommodations", "button", locale, overrides) || t.button)}
          </a>
        </div>
      </div>
    </section>
  );
}

