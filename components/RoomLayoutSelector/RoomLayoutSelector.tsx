'use client';

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Layout {
  id: string;
  name: string;
  image: string;
  description: string;
}

const layouts: Layout[] = [
  {
    id: "auditorio",
    name: "Auditório",
    image: "/Sobre Hotel/Eventos/auditorio.jpg",
    description: "Cadeiras dispostas em fileiras voltadas para o palco/mesa principal. Ideal para palestras e apresentações."
  },
  {
    id: "espinha",
    name: "Espinha de Peixe",
    image: "/Sobre Hotel/Eventos/espilha.jpg",
    description: "Mesas em ângulo formando espinha de peixe. Perfeito para treinamentos com interação."
  },
  {
    id: "escola",
    name: "Escola",
    image: "/Sobre Hotel/Eventos/Escola.jpg",
    description: "Mesas em fileiras com cadeiras voltadas para frente. Ótimo para cursos e workshops."
  },
  {
    id: "u",
    name: "Formato U",
    image: "/Sobre Hotel/Eventos/u.jpg",
    description: "Mesas em formato de U. Excelente para reuniões e discussões em grupo."
  },
  {
    id: "banquete",
    name: "Banquete",
    image: "/Sobre Hotel/Eventos/BANQUETA.jpg",
    description: "Mesas redondas para refeições. Ideal para jantares, almoços e confraternizações."
  }
];

export function RoomLayoutSelector() {
  const [selectedLayout, setSelectedLayout] = useState<string>("auditorio");

  const currentLayout = layouts.find(l => l.id === selectedLayout) || layouts[0];

  return (
    <div className="space-y-8">
      {/* Seletor de Layouts */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {layouts.map((layout) => (
          <button
            key={layout.id}
            onClick={() => setSelectedLayout(layout.id)}
            className={cn(
              "p-3 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md",
              selectedLayout === layout.id
                ? "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
                : "border-gray-200 dark:border-gray-800 hover:border-purple-300"
            )}
          >
            <div className="text-sm font-semibold text-foreground mb-1">
              {layout.name}
            </div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              {layout.description.split('.')[0]}
            </div>
          </button>
        ))}
      </div>

      {/* Visualização do Layout Selecionado */}
      <Card className="overflow-hidden border-2 border-purple-200 dark:border-purple-900">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            {/* Imagem */}
            <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-900">
              <Image
                src={currentLayout.image}
                alt={currentLayout.name}
                fill
                className="object-contain p-4"
              />
              <Badge className="absolute top-4 left-4 bg-purple-600">
                {currentLayout.name}
              </Badge>
            </div>

            {/* Descrição */}
            <div className="p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-950">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Configuração {currentLayout.name}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {currentLayout.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  <span className="text-muted-foreground">Disponível em todas as nossas salas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  <span className="text-muted-foreground">Montagem inclusa no pacote</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  <span className="text-muted-foreground">Adaptável às suas necessidades</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

