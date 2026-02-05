"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Waves, Bed, UtensilsCrossed, CalendarDays, Leaf, Mail, ExternalLink, Home, Globe } from "lucide-react";
import { PAGE_KEYS, type PageKey } from "@/lib/hooks/usePageData";

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
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-6 min-h-screen">
      <Button
        variant="ghost"
        onClick={() => router.push("/admin")}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Editor Visual</h1>
        <p className="text-muted-foreground">
          Abra a página em tela cheia para editar textos e imagens diretamente no site.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PAGE_KEYS.map((key) => {
          const Icon = PAGE_ICONS[key];
          const path = PAGE_PATHS[key];
          const editUrl = `${baseUrl}${path}?editMode=1`;
          return (
            <a
              key={key}
              href={editUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {Icon && <Icon className="h-8 w-8 shrink-0 text-muted-foreground" />}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{PAGE_LABELS[key]}</p>
                <p className="text-xs text-muted-foreground truncate">{path}?editMode=1</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
