"use client";

import { Clock, Users, Ban, Music, Dog, Baby, Shield, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/context/LanguageContext";
import { cn } from "@/lib/utils";

interface RoomRulesProps {
  className?: string;
}

export default function RoomRules({ className }: RoomRulesProps) {
  const { locale } = useLanguage();

  const labels = {
    pt: {
      title: "Regras do Quarto",
      checkIn: "Check-in",
      checkOut: "Check-out",
      checkInTime: "A partir das 14h",
      checkOutTime: "Até às 12h",
      guests: "Hóspedes",
      maxGuests: "Máximo de hóspedes conforme capacidade do quarto",
      smoking: "Não é permitido fumar",
      parties: "Festas e eventos não são permitidos",
      pets: "Animais de estimação",
      petsAllowed: "Permitido mediante consulta",
      children: "Crianças",
      childrenInfo: "Crianças são bem-vindas",
      security: "Segurança",
      securityInfo: "Cofre disponível no quarto",
      key: "Chaves",
      keyInfo: "Chaves disponíveis na recepção 24h",
    },
    es: {
      title: "Reglas de la Habitación",
      checkIn: "Entrada",
      checkOut: "Salida",
      checkInTime: "Desde las 14h",
      checkOutTime: "Hasta las 12h",
      guests: "Huéspedes",
      maxGuests: "Máximo de huéspedes según capacidad de la habitación",
      smoking: "No se permite fumar",
      parties: "Fiestas y eventos no están permitidos",
      pets: "Mascotas",
      petsAllowed: "Permitido previa consulta",
      children: "Niños",
      childrenInfo: "Los niños son bienvenidos",
      security: "Seguridad",
      securityInfo: "Caja fuerte disponible en la habitación",
      key: "Llaves",
      keyInfo: "Llaves disponibles en recepción 24h",
    },
    en: {
      title: "Room Rules",
      checkIn: "Check-in",
      checkOut: "Check-out",
      checkInTime: "From 2pm",
      checkOutTime: "Until 12pm",
      guests: "Guests",
      maxGuests: "Maximum guests according to room capacity",
      smoking: "Smoking not allowed",
      parties: "Parties and events not allowed",
      pets: "Pets",
      petsAllowed: "Allowed upon request",
      children: "Children",
      childrenInfo: "Children are welcome",
      security: "Security",
      securityInfo: "Safe available in room",
      key: "Keys",
      keyInfo: "Keys available at 24h reception",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.pt;

  const rules = [
    {
      icon: Clock,
      title: `${t.checkIn} / ${t.checkOut}`,
      description: `${t.checkInTime} • ${t.checkOutTime}`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Users,
      title: t.guests,
      description: t.maxGuests,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Ban,
      title: t.smoking,
      description: t.smoking,
      color: "text-red-600",
      bgColor: "bg-red-50",
      badge: "Não permitido",
    },
    {
      icon: Music,
      title: t.parties,
      description: t.parties,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      badge: "Não permitido",
    },
    {
      icon: Dog,
      title: t.pets,
      description: t.petsAllowed,
      color: "text-green-600",
      bgColor: "bg-green-50",
      badge: "Sob consulta",
    },
    {
      icon: Baby,
      title: t.children,
      description: t.childrenInfo,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      badge: "Permitido",
    },
    {
      icon: Shield,
      title: t.security,
      description: t.securityInfo,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: Key,
      title: t.key,
      description: t.keyInfo,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-2xl">{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {rules.map((rule, index) => {
            const Icon = rule.icon;
            return (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border",
                  rule.bgColor
                )}
              >
                <div className={cn("p-2 rounded-lg bg-white", rule.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{rule.title}</h4>
                    {rule.badge && (
                      <Badge variant="outline" className="text-xs">
                        {rule.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

