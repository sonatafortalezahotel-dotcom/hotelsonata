"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Mail, Phone, MapPin, Instagram, Facebook, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface ContactData {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  instagram: string;
  facebook: string;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [contactData, setContactData] = useState<ContactData>({
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    instagram: "",
    facebook: "",
  });

  // Buscar configurações do banco ao carregar
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoadingData(true);
        const response = await fetch("/api/settings");
        
        if (!response.ok) {
          throw new Error("Erro ao carregar configurações");
        }

        const settings = await response.json();
        
        // Converter array de settings em objeto
        const settingsMap: Record<string, string> = {};
        settings.forEach((setting: any) => {
          settingsMap[setting.key] = setting.value;
        });

        setContactData({
          email: settingsMap.email || "contato@hotelsonata.com.br",
          phone: settingsMap.phone || "(85) 4006-1616",
          whatsapp: settingsMap.whatsapp || "(85) 4006-1616",
          address: settingsMap.address || "Av. Beira Mar, 1000 - Praia de Iracema",
          city: settingsMap.city || "Fortaleza",
          state: settingsMap.state || "CE",
          zipCode: settingsMap.zipCode || "60165-121",
          instagram: settingsMap.instagram || "https://instagram.com/hotelsonata",
          facebook: settingsMap.facebook || "https://facebook.com/hotelsonata",
        });
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toast.error("Erro ao carregar configurações. Usando valores padrão.");
      } finally {
        setLoadingData(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);

      // Preparar dados para envio
      const settingsToSave = {
        email: { value: contactData.email, type: "text", description: "Email principal de contato" },
        phone: { value: contactData.phone, type: "text", description: "Telefone principal" },
        whatsapp: { value: contactData.whatsapp, type: "text", description: "Número do WhatsApp" },
        address: { value: contactData.address, type: "text", description: "Endereço completo" },
        city: { value: contactData.city, type: "text", description: "Cidade" },
        state: { value: contactData.state, type: "text", description: "Estado" },
        zipCode: { value: contactData.zipCode, type: "text", description: "CEP" },
        instagram: { value: contactData.instagram, type: "url", description: "URL do Instagram" },
        facebook: { value: contactData.facebook, type: "url", description: "URL do Facebook" },
      };

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsToSave),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao salvar configurações");
      }

      toast.success("Configurações salvas com sucesso!");
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error(error.message || "Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Configurações gerais do sistema
        </p>
      </div>

      {/* Informações de Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Informações de Contato
          </CardTitle>
          <CardDescription>
            Dados de contato exibidos no site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Principal</Label>
              <Input
                id="email"
                type="email"
                value={contactData.email}
                onChange={(e) =>
                  setContactData({ ...contactData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={contactData.phone}
                onChange={(e) =>
                  setContactData({ ...contactData, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={contactData.whatsapp}
              onChange={(e) =>
                setContactData({ ...contactData, whatsapp: e.target.value })
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={contactData.address}
              onChange={(e) =>
                setContactData({ ...contactData, address: e.target.value })
              }
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={contactData.city}
                onChange={(e) =>
                  setContactData({ ...contactData, city: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={contactData.state}
                onChange={(e) =>
                  setContactData({ ...contactData, state: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={contactData.zipCode}
                onChange={(e) =>
                  setContactData({ ...contactData, zipCode: e.target.value })
                }
              />
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                type="url"
                value={contactData.instagram}
                onChange={(e) =>
                  setContactData({ ...contactData, instagram: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                type="url"
                value={contactData.facebook}
                onChange={(e) =>
                  setContactData({ ...contactData, facebook: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Banco de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Provedor:</span>
                <span className="font-medium">Neon PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-600 font-medium">✓ Conectado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Região:</span>
                <span className="font-medium">US East 1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Armazenamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Provedor:</span>
                <span className="font-medium">Vercel Blob</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-600 font-medium">✓ Configurado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Limite:</span>
                <span className="font-medium">Ilimitado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

