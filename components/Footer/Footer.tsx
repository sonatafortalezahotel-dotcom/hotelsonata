"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, MessageCircle, MapPin, Phone, Mail, Award, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageTranslation } from "@/lib/translations/pages";
import { useEditor } from "@/lib/context/EditorContext";
import { PageText } from "@/components/PageEditor";
import { getPageContent } from "@/lib/utils/pageContent";
import { useEffect, useState } from "react";

interface SiteSettings {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  instagram: string;
  facebook: string;
}

export default function Footer() {
  const { locale } = useLanguage();
  const t = getPageTranslation(locale, "footer");
  const [settings, setSettings] = useState<SiteSettings>({
    email: "contato@hotelsonata.com.br",
    phone: "(85) 3456-7890",
    whatsapp: "(85) 99999-9999",
    address: "Av. Beira Mar, 1000 - Praia de Iracema",
    city: "Fortaleza",
    state: "CE",
    zipCode: "60165-121",
    instagram: "https://instagram.com/hotelsonata",
    facebook: "https://facebook.com/hotelsonata",
  });

  // Buscar configurações do banco
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/settings");

        if (response.ok) {
          const data = await response.json();
          const settingsMap: Record<string, string> = {};
          
          if (Array.isArray(data)) {
            data.forEach((setting: any) => {
              settingsMap[setting.key] = setting.value;
            });

            setSettings({
              email: settingsMap.email || settings.email,
              phone: settingsMap.phone || settings.phone,
              whatsapp: settingsMap.whatsapp || settings.whatsapp,
              address: settingsMap.address || settings.address,
              city: settingsMap.city || settings.city,
              state: settingsMap.state || settings.state,
              zipCode: settingsMap.zipCode || settings.zipCode,
              instagram: settingsMap.instagram || settings.instagram,
              facebook: settingsMap.facebook || settings.facebook,
            });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        // Mantém valores padrão em caso de erro
      }
    }

    loadSettings();
  }, []);
  
  const editor = useEditor();
  const globalOverrides = editor?.globalOverrides ?? {};
  const menuItems = [
    { fieldKey: "nav.hotel", href: "/hotel" },
    { fieldKey: "nav.lazer", href: "/lazer" },
    { fieldKey: "nav.quartos", href: "/quartos" },
    { fieldKey: "nav.gastronomia", href: "/gastronomia" },
    { fieldKey: "nav.eventos", href: "/eventos" },
    { fieldKey: "nav.blog", href: "/blog" },
    { fieldKey: "nav.esg", href: "/esg" },
    { fieldKey: "nav.contato", href: "/contato" },
    { fieldKey: "nav.trabalhe", href: "/trabalhe-conosco" },
  ];
  const getFooterNavLabel = (fieldKey: string) => {
    if (editor?.editMode) {
      return <PageText page="global" section="footer" fieldKey={fieldKey} locale={locale} as="span" />;
    }
    return getPageContent("global", "footer", fieldKey, locale, globalOverrides) || "";
  };
  const getFooterText = (fieldKey: string, fallback: string) => {
    if (editor?.editMode) {
      return <PageText page="global" section="footer" fieldKey={fieldKey} locale={locale} as="span" />;
    }
    return getPageContent("global", "footer", fieldKey, locale, globalOverrides) || fallback;
  };

  // Construir endereço completo
  const fullAddress = `${settings.address}, ${settings.city} - ${settings.state}, ${settings.zipCode}`;

  // Formatar WhatsApp para link
  const whatsappLink = settings.whatsapp.replace(/\D/g, ""); // Remove caracteres não numéricos
  const whatsappUrl = `https://wa.me/${whatsappLink}`;

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: settings.instagram },
    { name: "Facebook", icon: Facebook, href: settings.facebook },
    { name: "WhatsApp", icon: MessageCircle, href: whatsappUrl },
  ];

  return (
    <footer className="mt-0 relative" style={{ zIndex: 9999, position: 'relative' }}>
      <div 
        className="bg-primary text-primary-foreground border-t-4 border-primary relative shadow-2xl"
        style={{
          background: 'hsl(var(--primary))',
          backgroundImage: 'none',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll',
          isolation: 'isolate',
          zIndex: 9999,
          position: 'relative',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
            {/* Logo e Descrição */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-2xl font-bold mb-4">Hotel Sonata de Iracema</h3>
              <p className="text-primary-foreground/80 mb-6 leading-relaxed text-sm">
                {getFooterText("description", t.description)}
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-primary-foreground hover:bg-primary-foreground/10"
                      asChild
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.name}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Menu Rápido */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2">
              <h4 className="text-lg font-semibold mb-4">{getFooterText("quickMenu", t.quickMenu)}</h4>
              <ul className="space-y-3">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                    >
                      {getFooterNavLabel(item.fieldKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div className="col-span-1 md:col-span-1 lg:col-span-3">
              <h4 className="text-lg font-semibold mb-4">{getFooterText("contact", t.contact)}</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 text-primary-foreground/80">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{fullAddress}</span>
                </li>
                <li className="flex items-center gap-3 text-primary-foreground/80">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <a href={`tel:${settings.phone.replace(/\D/g, "")}`} className="hover:underline">
                    {settings.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-primary-foreground/80">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:underline">
                    {settings.email}
                  </a>
                </li>
                {settings.whatsapp && (
                  <li className="flex items-center gap-3 text-primary-foreground/80">
                    <MessageCircle className="h-5 w-5 flex-shrink-0" />
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {settings.whatsapp}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* Credibilidade e Certificações */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                {getFooterText("credibility.title", t.credibility?.title || "Certificações")}
              </h4>
              <div className="space-y-4">
                {/* TripAdvisor */}
                <div className="bg-primary-foreground/10 rounded-lg p-3 flex items-center gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src="/Sobre Hotel/certificados/tchotel_2022_LL (1).png"
                      alt="TripAdvisor Travellers' Choice 2022"
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-foreground">TripAdvisor</p>
                    <p className="text-xs text-primary-foreground/70">Travellers' Choice 2022</p>
                  </div>
                </div>

                {/* Travel Awards */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative w-full h-12 bg-white/10 rounded p-2 flex items-center justify-center">
                    <Image
                      src="/Sobre Hotel/certificados/ORANGE_MEDIUM_TRAVEL_AWARDS.png"
                      alt="Travel Awards"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="relative w-full h-12 bg-white/10 rounded p-2 flex items-center justify-center">
                    <Image
                      src="/Sobre Hotel/certificados/LIGHT_MEDIUM_TRAVEL_AWARDS.png"
                      alt="Travel Awards"
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain p-1"
                    />
                  </div>
                </div>

                {/* Selos de Qualidade */}
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div
                      key={num}
                      className="relative w-10 h-10 bg-white/10 rounded flex items-center justify-center flex-shrink-0"
                    >
                      <Image
                        src={`/Sobre Hotel/certificados/logo${num}-rodape.png`}
                        alt={`Certificação ${num}`}
                        fill
                        sizes="40px"
                        className="object-contain p-1.5"
                      />
                    </div>
                  ))}
                </div>

                {/* Badge de Confiança */}
                <div className="flex items-center gap-2 text-xs text-primary-foreground/70 pt-2 border-t border-primary-foreground/20">
                  <Shield className="h-4 w-4" />
                  <span>{t.credibility?.trust || "Hotel Certificado e Seguro"}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-primary-foreground/20" />

          <div className="text-center text-sm text-primary-foreground/60">
            <p>
              © {new Date().getFullYear()} Hotel Sonata de Iracema. {t.copyright} {t.developedBy && (
                <>
                  {" "}{t.developedBy}{" "}
                  <a
                    href="https://www.kommu.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    (www.kommu.com.br)
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

