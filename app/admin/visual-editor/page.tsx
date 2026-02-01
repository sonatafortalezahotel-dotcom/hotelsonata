"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Waves, Bed, UtensilsCrossed, CalendarDays, Leaf, Mail, ExternalLink, Pencil, Home, Globe } from "lucide-react";
import { usePageData, type PageKey, PAGE_KEYS } from "@/lib/hooks/usePageData";

const PAGE_LABELS: Record<PageKey, string> = {
  hotel: "Hotel",
  lazer: "Lazer",
  quartos: "Quartos",
  gastronomia: "Gastronomia",
  eventos: "Eventos",
  esg: "ESG",
  contato: "Contato",
  home: "Home",
  global: "Global",
  reservas: "Reservas",
  pacotes: "Pacotes",
  trabalhe: "Trabalhe conosco",
};

const PAGE_PATHS: Record<PageKey, string> = {
  hotel: "/hotel",
  lazer: "/lazer",
  quartos: "/quartos",
  gastronomia: "/gastronomia",
  eventos: "/eventos",
  esg: "/esg",
  contato: "/contato",
  home: "/",
  global: "/hotel",
  reservas: "/reservas",
  pacotes: "/pacotes",
  trabalhe: "/trabalhe-conosco",
};

const PAGE_ICONS: Record<PageKey, React.ComponentType<{ className?: string }>> = {
  hotel: Building2,
  lazer: Waves,
  quartos: Bed,
  gastronomia: UtensilsCrossed,
  eventos: CalendarDays,
  esg: Leaf,
  contato: Mail,
  home: Home,
  global: Globe,
  reservas: CalendarDays,
  pacotes: Bed,
  trabalhe: Mail,
};

export default function VisualEditorPage() {
  const router = useRouter();
  const [pageKey, setPageKey] = useState<PageKey>("hotel");
  const { loading, error, refetch } = usePageData(pageKey);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const editModeUrl = `${baseUrl}${PAGE_PATHS[pageKey]}?editMode=1`;
  const iframeSrc = baseUrl ? `${PAGE_PATHS[pageKey]}?editMode=1` : PAGE_PATHS[pageKey];

  const openInNewTab = () => {
    if (baseUrl) window.open(editModeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6 min-h-screen flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0 flex-wrap gap-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold mb-2">Editor Visual</h1>
          <p className="text-muted-foreground">
            Página completa por aba. Clique em uma aba para carregar Home, Global, Hotel, Lazer, Quartos, Gastronomia, Eventos, ESG, Contato, Reservas, Pacotes ou Trabalhe conosco.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-3 py-1.5 text-sm font-medium border border-primary/30">
            <Pencil className="h-4 w-4" />
            Modo edição ativo
          </span>
          <Button variant="outline" size="sm" onClick={openInNewTab} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Abrir &quot;{PAGE_LABELS[pageKey]}&quot; em modo edição (nova aba)
          </Button>
        </div>
      </div>

      <Tabs value={pageKey} onValueChange={(v) => setPageKey(v as PageKey)} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 p-1">
          {PAGE_KEYS.map((key) => {
            const Icon = PAGE_ICONS[key];
            return (
              <TabsTrigger key={key} value={key} className="gap-2">
                {Icon && <Icon className="h-4 w-4 shrink-0" />}
                {PAGE_LABELS[key]}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {PAGE_KEYS.map((key) => (
          <TabsContent
            key={key}
            value={key}
            className="flex-1 mt-4 min-h-0 data-[state=inactive]:hidden flex flex-col"
          >
            {loading && key === pageKey ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground py-12">
                Carregando página...
              </div>
            ) : error && key === pageKey ? (
              <div className="flex-1 flex items-center justify-center text-destructive py-12">
                {error}
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-2 min-h-0">
                <p className="text-sm text-muted-foreground bg-muted/50 border rounded-md px-3 py-2 flex-shrink-0">
                  <strong>Modo edição:</strong> a página no quadro abaixo já está com <code className="bg-muted px-1 rounded">?editMode=1</code>.
                  Deve aparecer uma <strong>faixa no topo</strong> da página; <strong>clique nos títulos e subtítulos do hero</strong> (primeiro bloco) para editar. Se não vir a faixa, use o botão &quot;Abrir em modo edição (nova aba)&quot; acima.
                </p>
                <div className="flex-1 min-h-[600px] border rounded-lg overflow-hidden bg-muted/30">
                <iframe
                  key={key}
                  src={key === pageKey ? iframeSrc : undefined}
                  title={PAGE_LABELS[key]}
                  className="w-full h-full min-h-[600px] border-0"
                  referrerPolicy="no-referrer"
                />
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
