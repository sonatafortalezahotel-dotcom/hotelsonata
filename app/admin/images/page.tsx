"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Waves, UtensilsCrossed, Leaf, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const pages = [
  {
    id: "home",
    name: "Home / Hotel",
    description: "Página inicial do site",
    icon: Home,
    color: "bg-blue-600",
    sections: 10
  },
  {
    id: "lazer",
    name: "Lazer",
    description: "Página de atividades e lazer",
    icon: Waves,
    color: "bg-cyan-600",
    sections: 8
  },
  {
    id: "gastronomia",
    name: "Gastronomia",
    description: "Página de restaurante e gastronomia",
    icon: UtensilsCrossed,
    color: "bg-amber-600",
    sections: 6
  },
  {
    id: "esg",
    name: "ESG",
    description: "Página de sustentabilidade e responsabilidade social",
    icon: Leaf,
    color: "bg-green-600",
    sections: 4
  },
  {
    id: "contato",
    name: "Contato",
    description: "Página de informações de contato",
    icon: Mail,
    color: "bg-purple-600",
    sections: 3
  }
];

export default function ImagesAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gerenciar Imagens por Página</h1>
        <p className="text-muted-foreground">
          Organize as imagens do site por página. Cada página possui seções específicas onde as imagens aparecem.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <Card key={page.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${page.color} rounded-lg text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">{page.sections} seções</Badge>
                </div>
                <CardTitle className="text-xl">{page.name}</CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/images/${page.id}`}>
                  <Button className="w-full" variant="outline">
                    Gerenciar Imagens
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-lg">ℹ️ Como funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Organização por Página:</strong> As imagens são organizadas pela página onde aparecem no site.
          </p>
          <p>
            <strong className="text-foreground">Seções Específicas:</strong> Cada página possui várias seções (Hero, Galerias, Cards, etc.) onde as imagens são exibidas.
          </p>
          <p>
            <strong className="text-foreground">Descrição Clara:</strong> Para cada seção, você verá exatamente onde a imagem aparece no site e quantas imagens são recomendadas.
          </p>
          <p>
            <strong className="text-foreground">Hero/Carrossel:</strong> O carrossel principal da homepage (que pode ter vídeos) é gerenciado em <strong>"Destaques"</strong> no menu admin, não aqui.
          </p>
          <p>
            <strong className="text-foreground">Quartos e Eventos:</strong> Essas páginas possuem sistemas próprios de cadastro e não estão incluídas aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

