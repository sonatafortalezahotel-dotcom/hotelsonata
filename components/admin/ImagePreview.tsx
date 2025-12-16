"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Eye, Monitor, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImagePreviewProps {
  imageUrl: string;
  category?: string;
  type?: "gallery" | "highlight" | "package" | "sustainability" | "certification" | "social";
  title?: string;
  description?: string;
}

export function ImagePreview({
  imageUrl,
  category,
  type = "gallery",
  title,
  description,
}: ImagePreviewProps) {
  if (!imageUrl) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
        <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Adicione uma imagem para ver a prévia</p>
      </div>
    );
  }

  const renderPreview = () => {
    switch (type) {
      case "gallery":
        return renderGalleryPreview();
      case "highlight":
        return renderHighlightPreview();
      case "package":
        return renderPackagePreview();
      case "sustainability":
        return renderSustainabilityPreview();
      case "certification":
        return renderCertificationPreview();
      case "social":
        return renderSocialPreview();
      default:
        return renderGalleryPreview();
    }
  };

  const renderGalleryPreview = () => {
    const categoryInfo: Record<string, { title: string; location: string }> = {
      piscina: {
        title: "Card: Piscina Vista Mar",
        location: "Homepage - Seção Experiências Visuais",
      },
      restaurante: {
        title: "Card: Gastronomia Regional",
        location: "Homepage - Seção Experiências Visuais",
      },
      quarto: {
        title: "Card: Quartos Confortáveis",
        location: "Homepage - Seção Experiências Visuais",
      },
      recepcao: {
        title: "Card: Quartos Confortáveis",
        location: "Homepage - Seção Experiências Visuais",
      },
      spa: {
        title: "Card: Spa & Bem-Estar",
        location: "Homepage - Seção Experiências Visuais",
      },
      academia: {
        title: "Card: Spa & Bem-Estar",
        location: "Homepage - Seção Experiências Visuais",
      },
      lazer: {
        title: "Card: Beach Tennis",
        location: "Homepage - Seção Experiências Visuais",
      },
      esporte: {
        title: "Card: Beach Tennis",
        location: "Homepage - Seção Experiências Visuais",
      },
      sustentabilidade: {
        title: "Card: Sustentabilidade",
        location: "Homepage - Seção Experiências Visuais",
      },
      geral: {
        title: "Galeria Geral",
        location: "Homepage - Seção Galeria",
      },
      localizacao: {
        title: "Localização",
        location: "Homepage - Seção Praia de Iracema",
      },
      gastronomia: {
        title: "Card: Gastronomia Regional",
        location: "Homepage - Seção Experiências Visuais",
      },
      cafe: {
        title: "Café da Manhã",
        location: "Página Gastronomia",
      },
    };

    const info = category ? categoryInfo[category] : { title: "Galeria", location: "Vários lugares" };

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-2">
          <p className="font-semibold text-foreground">{info.title}</p>
          <p className="text-xs">{info.location}</p>
        </div>
        {category === "piscina" || category === "restaurante" || category === "quarto" || 
         category === "spa" || category === "lazer" || category === "sustentabilidade" ? (
          // Preview como ExperienceCard
          <div className="relative overflow-hidden rounded-2xl shadow-lg border">
            <div className="relative aspect-[4/5]">
              <Image
                src={imageUrl}
                alt={title || "Preview"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-bold mb-1 drop-shadow-lg">
                  {title || info.title}
                </h3>
                {description && (
                  <p className="text-xs text-white/90 line-clamp-2 drop-shadow">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : category === "geral" ? (
          // Preview como Grid de Galeria
          <div className="grid grid-cols-3 gap-2">
            <div className="relative aspect-square rounded-lg overflow-hidden border">
              <Image
                src={imageUrl}
                alt={title || "Preview"}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted opacity-50" />
            <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted opacity-50" />
          </div>
        ) : (
          // Preview padrão
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <Image
              src={imageUrl}
              alt={title || "Preview"}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    );
  };

  const renderHighlightPreview = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        <p className="font-semibold text-foreground">Carrossel Principal</p>
        <p className="text-xs">Homepage - Topo da página (Hero)</p>
      </div>
      <div className="relative aspect-video rounded-lg overflow-hidden border shadow-lg">
        <Image
          src={imageUrl}
          alt={title || "Preview"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 drop-shadow-lg">
              {title || "Título do Destaque"}
            </h2>
            {description && (
              <p className="text-sm drop-shadow">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPackagePreview = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        <p className="font-semibold text-foreground">Card de Pacote</p>
        <p className="text-xs">Homepage - Seção Pacotes Promocionais</p>
      </div>
      <Card className="overflow-hidden">
        <div className="relative w-full">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={imageUrl}
              alt={title || "Preview"}
              fill
              className="object-cover"
            />
          </AspectRatio>
        </div>
        <CardHeader>
          <CardTitle className="text-lg">{title || "Nome do Pacote"}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
      </Card>
    </div>
  );

  const renderSustainabilityPreview = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        <p className="font-semibold text-foreground">Card de Sustentabilidade</p>
        <p className="text-xs">Homepage - Seção Sustentabilidade e Inclusão</p>
      </div>
      <Card className="overflow-hidden">
        <div className="relative w-full">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={imageUrl}
              alt={title || "Preview"}
              fill
              className="object-cover"
            />
          </AspectRatio>
        </div>
        <CardHeader>
          <CardTitle className="text-lg">{title || "Título"}</CardTitle>
        </CardHeader>
        <CardContent>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderCertificationPreview = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        <p className="font-semibold text-foreground">Certificação/Selo</p>
        <p className="text-xs">Homepage - Seção Certificações e Selos</p>
      </div>
      <Card className="flex flex-col items-center text-center">
        <CardHeader className="pb-4">
          <div className="relative w-24 h-24 mx-auto">
            <AspectRatio ratio={1}>
              <Image
                src={imageUrl}
                alt={title || "Preview"}
                fill
                className="object-contain"
              />
            </AspectRatio>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardTitle className="text-base">{title || "Nome da Certificação"}</CardTitle>
        </CardContent>
      </Card>
    </div>
  );

  const renderSocialPreview = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        <p className="font-semibold text-foreground">Post de Rede Social</p>
        <p className="text-xs">Homepage - Seção Redes Sociais</p>
      </div>
      <div className="relative aspect-square rounded-lg overflow-hidden border shadow-lg">
        <Image
          src={imageUrl}
          alt="Preview"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Eye className="h-4 w-4" />
        Prévia de Como Aparece no Site
      </div>
      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="desktop" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile
          </TabsTrigger>
        </TabsList>
        <TabsContent value="desktop" className="mt-4">
          <div className="border rounded-lg p-4 bg-muted/30">
            {renderPreview()}
          </div>
        </TabsContent>
        <TabsContent value="mobile" className="mt-4">
          <div className="border rounded-lg p-4 bg-muted/30 max-w-sm mx-auto">
            {renderPreview()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

