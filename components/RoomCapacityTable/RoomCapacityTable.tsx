'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useEditor } from "@/lib/context/EditorContext";
import { useLanguage } from "@/lib/context/LanguageContext";
import { getPageContent } from "@/lib/utils/pageContent";
import { PageText } from "@/components/PageEditor";

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

function cellValue(
  get: (section: string, fieldKey: string) => string,
  roomIndex: number,
  field: "name" | "area" | "auditorium" | "espinha" | "escola" | "u" | "banquete",
  fallback: string | number
): string {
  const v = get("capacity", `table.rooms.${roomIndex}.${field}`);
  return v !== "" ? v : String(fallback);
}

export function RoomCapacityTable() {
  const editor = useEditor();
  const { locale } = useLanguage();
  const overrides = editor?.overrides ?? {};
  const get = (section: string, fieldKey: string) =>
    getPageContent("eventos", section, fieldKey, locale, overrides);

  const tipContent = editor?.editMode
    ? <PageText page="eventos" section="capacity" fieldKey="tip" locale={locale} as="span" placeholder="Role horizontalmente para ver todas as configurações em dispositivos móveis" />
    : (get("capacity", "tip") || "Role horizontalmente para ver todas as configurações em dispositivos móveis");

  const cardTitle = editor?.editMode
    ? <PageText page="eventos" section="capacity" fieldKey="title" locale={locale} as="span" className="block" placeholder="Tabela Comparativa de Capacidades" />
    : (get("capacity", "title") || "Tabela Comparativa de Capacidades");

  const cardSubtitle = editor?.editMode
    ? <PageText page="eventos" section="capacity" fieldKey="subtitle" locale={locale} as="span" className="block" placeholder="Compare rapidamente a capacidade de todas as salas em cada configuração" />
    : (get("capacity", "subtitle") || "Compare rapidamente a capacidade de todas as salas em cada configuração");

  return (
    <Card className="overflow-hidden border-2 border-primary/20 dark:border-primary/30">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-background dark:from-primary/10 dark:to-gray-950">
        <CardTitle className="text-2xl text-center">{cardTitle}</CardTitle>
        <p className="text-center text-muted-foreground text-sm">
          {cardSubtitle}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="py-4 px-4 text-left font-semibold sticky left-0 bg-primary z-10">
                  {editor?.editMode ? (
                    <PageText page="eventos" section="capacity" fieldKey="table.columnRoom" locale={locale} as="span" placeholder="Sala" />
                  ) : (
                    get("capacity", "table.columnRoom") || "Sala"
                  )}
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
                          sizes="64px"
                        />
                      </div>
                      <span className="text-sm">
                        {editor?.editMode ? (
                          <PageText page="eventos" section="capacity" fieldKey={`table.configs.${config.key}`} locale={locale} as="span" placeholder={config.label} />
                        ) : (
                          get("capacity", `table.configs.${config.key}`) || config.label
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr
                  key={`${room.name}-${index}`}
                  className={`
                    border-b border-gray-200 dark:border-gray-800
                    hover:bg-primary/5 dark:hover:bg-primary/10
                    transition-colors
                    ${room.isMain ? "bg-primary/5 dark:bg-primary/10" : index % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"}
                  `}
                >
                  <td className="py-4 px-4 font-semibold text-foreground sticky left-0 bg-inherit z-10">
                    <div className="flex items-center gap-2">
                      {editor?.editMode ? (
                        <PageText page="eventos" section="capacity" fieldKey={`table.rooms.${index}.name`} locale={locale} as="span" placeholder={room.name} />
                      ) : (
                        cellValue(get, index, "name", room.name)
                      )}
                      {room.isMain && (
                        <Badge className="bg-primary text-primary-foreground text-xs">Principal</Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-muted-foreground">
                    {editor?.editMode ? (
                      <PageText page="eventos" section="capacity" fieldKey={`table.rooms.${index}.area`} locale={locale} as="span" placeholder={String(room.area)} />
                    ) : (
                      cellValue(get, index, "area", room.area)
                    )}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-lg text-primary">
                    {editor?.editMode ? (
                      <PageText page="eventos" section="capacity" fieldKey={`table.rooms.${index}.auditorium`} locale={locale} as="span" placeholder={String(room.auditorium)} />
                    ) : (
                      cellValue(get, index, "auditorium", room.auditorium)
                    )}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-lg text-primary">
                    {editor?.editMode ? (
                      <PageText page="eventos" section="capacity" fieldKey={`table.rooms.${index}.espinha`} locale={locale} as="span" placeholder={String(room.espinha)} />
                    ) : (
                      cellValue(get, index, "espinha", room.espinha)
                    )}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-lg text-primary">
                    {editor?.editMode ? (
                      <PageText page="eventos" section="capacity" fieldKey={`table.rooms.${index}.escola`} locale={locale} as="span" placeholder={String(room.escola)} />
                    ) : (
                      cellValue(get, index, "escola", room.escola)
                    )}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-lg text-primary">
                    {editor?.editMode ? (
                      <PageText page="eventos" section="capacity" fieldKey={`table.rooms.${index}.u`} locale={locale} as="span" placeholder={String(room.u)} />
                    ) : (
                      cellValue(get, index, "u", room.u)
                    )}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-lg text-primary">
                    {editor?.editMode ? (
                      <PageText page="eventos" section="capacity" fieldKey={`table.rooms.${index}.banquete`} locale={locale} as="span" placeholder={String(room.banquete)} />
                    ) : (
                      cellValue(get, index, "banquete", room.banquete)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-muted/30 text-center text-sm text-muted-foreground border-t">
          <p>💡 <strong>Dica:</strong> {tipContent}</p>
        </div>
      </CardContent>
    </Card>
  );
}

