'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const rooms = [
  { name: "Sonata", area: 196, auditorium: 250, espinha: 100, escola: 130, u: 60, banquete: 100, isMain: true },
  { name: "Sonata 1", area: 94, auditorium: 100, espinha: 40, escola: 50, u: 30, banquete: 50 },
  { name: "Sonata 2", area: 102, auditorium: 120, espinha: 50, escola: 60, u: 35, banquete: 50 },
  { name: "Harmonia", area: 81, auditorium: 100, espinha: 45, escola: 50, u: 32, banquete: 40 },
  { name: "Serenata", area: 77, auditorium: 90, espinha: 35, escola: 45, u: 30, banquete: 30 },
  { name: "Sintonia", area: 76, auditorium: 80, espinha: 30, escola: 40, u: 25, banquete: 25 },
  { name: "Soneto", area: 64, auditorium: 60, espinha: 25, escola: 30, u: 20, banquete: 20 },
  { name: "Melodia", area: 30, auditorium: 50, espinha: 20, escola: 35, u: 18, banquete: 20 }
];

const configurations = [
  { key: "auditorium", label: "Auditório", image: "/Sobre Hotel/Eventos/auditorio.jpg" },
  { key: "espinha", label: "Espinha de Peixe", image: "/Sobre Hotel/Eventos/espilha.jpg" },
  { key: "escola", label: "Escolar", image: "/Sobre Hotel/Eventos/Escola.jpg" },
  { key: "u", label: "U", image: "/Sobre Hotel/Eventos/u.jpg" },
  { key: "banquete", label: "Banquete", image: "/Sobre Hotel/Eventos/BANQUETA.jpg" }
];

export function RoomCapacityTable() {
  return (
    <Card className="overflow-hidden border-2 border-purple-200 dark:border-purple-900">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-950">
        <CardTitle className="text-2xl text-center">Tabela Comparativa de Capacidades</CardTitle>
        <p className="text-center text-muted-foreground text-sm">
          Compare rapidamente a capacidade de todas as salas em cada configuração
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="py-4 px-4 text-left font-semibold sticky left-0 bg-purple-600 z-10">
                  Sala
                </th>
                <th className="py-4 px-4 text-center font-semibold min-w-[80px]">
                  M²
                </th>
                {configurations.map((config) => (
                  <th key={config.key} className="py-4 px-4 text-center font-semibold min-w-[120px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-white/20">
                        <Image
                          src={config.image}
                          alt={config.label}
                          fill
                          className="object-contain p-1 bg-white"
                        />
                      </div>
                      <span className="text-sm">{config.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr 
                  key={room.name}
                  className={`
                    border-b border-gray-200 dark:border-gray-800
                    hover:bg-purple-50 dark:hover:bg-purple-950/10 
                    transition-colors
                    ${room.isMain ? 'bg-purple-50 dark:bg-purple-950/20' : index % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900'}
                  `}
                >
                  <td className="py-4 px-4 font-semibold text-foreground sticky left-0 bg-inherit z-10">
                    <div className="flex items-center gap-2">
                      {room.name}
                      {room.isMain && (
                        <Badge className="bg-purple-600 text-xs">Principal</Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-muted-foreground">
                    {room.area}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-lg text-purple-700 dark:text-purple-400">
                    {room.auditorium}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-lg text-purple-700 dark:text-purple-400">
                    {room.espinha}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-lg text-purple-700 dark:text-purple-400">
                    {room.escola}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-lg text-purple-700 dark:text-purple-400">
                    {room.u}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-lg text-purple-700 dark:text-purple-400">
                    {room.banquete}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-muted/30 text-center text-sm text-muted-foreground border-t">
          <p>💡 <strong>Dica:</strong> Role horizontalmente para ver todas as configurações em dispositivos móveis</p>
        </div>
      </CardContent>
    </Card>
  );
}

