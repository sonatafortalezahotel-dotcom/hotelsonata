"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/context/LanguageContext";

export default function GastronomyPageContent() {
  const { locale } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/gastronomy?locale=${locale}&active=true`, {
          cache: 'no-store'
        });
        
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        }
      } catch (error) {
        console.error('Erro ao buscar gastronomia:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [locale]);

  if (loading) {
    return <div className="text-center py-10">Carregando...</div>;
  }

  if (items.length === 0) {
    return <div className="text-center py-10">Nenhum item disponível.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item: any) => (
        <div key={item.id} className="p-6 bg-card rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">{item.name}</h3>
          <p className="text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

