'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Square } from "lucide-react";

interface RoomCapacity {
  auditorium: number;
  espinha: number;
  escola: number;
  u: number;
  banquete: number;
}

interface EventRoomCardProps {
  name: string;
  area: number;
  capacity: RoomCapacity;
  isMainRoom?: boolean;
}

export function EventRoomCard({ name, area, capacity, isMainRoom = false }: EventRoomCardProps) {
  const maxCapacity = Math.max(...Object.values(capacity));

  return (
    <Card className={`hover:shadow-xl transition-all duration-300 ${isMainRoom ? 'border-2 border-primary' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 ${isMainRoom ? 'bg-primary' : 'bg-primary/10'} rounded-lg`}>
              <Building2 className={`h-5 w-5 ${isMainRoom ? 'text-primary-foreground' : 'text-primary'}`} />
            </div>
            <CardTitle className="text-xl">{name}</CardTitle>
          </div>
          {isMainRoom && (
            <Badge className="bg-primary">Principal</Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{area}m²</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Até {maxCapacity} pessoas</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Auditório</p>
            <p className="text-lg font-bold text-foreground">{capacity.auditorium}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Espinha</p>
            <p className="text-lg font-bold text-foreground">{capacity.espinha}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Escola</p>
            <p className="text-lg font-bold text-foreground">{capacity.escola}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">U</p>
            <p className="text-lg font-bold text-foreground">{capacity.u}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Banquete</p>
            <p className="text-lg font-bold text-foreground">{capacity.banquete}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

