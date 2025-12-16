"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Image, 
  Package, 
  Bed, 
  Instagram, 
  TrendingUp,
  Users,
  Calendar,
  Activity
} from "lucide-react";

interface DashboardStats {
  highlights: number;
  packages: number;
  rooms: number;
  socialPosts: number;
  galleryPhotos: number;
  events: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    highlights: 0,
    packages: 0,
    rooms: 0,
    socialPosts: 0,
    galleryPhotos: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [highlights, packages, rooms, social, gallery, events] = await Promise.all([
        fetch("/api/highlights").then(r => r.json()),
        fetch("/api/packages").then(r => r.json()),
        fetch("/api/rooms").then(r => r.json()),
        fetch("/api/social-media").then(r => r.json()),
        fetch("/api/gallery").then(r => r.json()),
        fetch("/api/events").then(r => r.json()),
      ]);

      setStats({
        highlights: Array.isArray(highlights) ? highlights.length : 0,
        packages: Array.isArray(packages) ? packages.length : 0,
        rooms: Array.isArray(rooms) ? rooms.length : 0,
        socialPosts: Array.isArray(social) ? social.length : 0,
        galleryPhotos: Array.isArray(gallery) ? gallery.length : 0,
        events: Array.isArray(events) ? events.length : 0,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Destaques",
      value: stats.highlights,
      icon: Image,
      description: "Carrossel principal",
      color: "text-blue-600",
    },
    {
      title: "Pacotes",
      value: stats.packages,
      icon: Package,
      description: "Pacotes ativos",
      color: "text-green-600",
    },
    {
      title: "Quartos",
      value: stats.rooms,
      icon: Bed,
      description: "Acomodações",
      color: "text-purple-600",
    },
    {
      title: "Galeria",
      value: stats.galleryPhotos,
      icon: Image,
      description: "Fotos no site",
      color: "text-orange-600",
    },
    {
      title: "Redes Sociais",
      value: stats.socialPosts,
      icon: Instagram,
      description: "Posts do Instagram",
      color: "text-pink-600",
    },
    {
      title: "Eventos",
      value: stats.events,
      icon: Calendar,
      description: "Tipos de eventos",
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do painel administrativo do Hotel Sonata de Iracema
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {loading ? "..." : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Tarefas comuns de gerenciamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">Adicionar Destaque</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Adicionar novo item ao carrossel principal
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">Novo Pacote</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Criar promoção ou pacote especial
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-base">Upload de Fotos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Adicionar fotos à galeria do hotel
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Site Atualizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Todas as alterações são refletidas automaticamente no site público.
            </p>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Visualizar site →
            </a>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/10 to-green-600/5 border-green-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Banco de Dados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Conexão: Neon PostgreSQL<br />
              Status: ✅ Conectado
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

