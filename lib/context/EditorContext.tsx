"use client";

import React, { createContext, useContext, useCallback, useMemo, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { usePageContent } from "@/lib/hooks/usePageContent";
import type { PageKey } from "@/lib/hooks/usePageContent";
import { useLanguage } from "@/lib/context/LanguageContext";
import { EditModeBanner } from "@/components/PageEditor/EditModeBanner";
import { notifyGalleryUpdated } from "@/lib/galleryRefetch";

const LOCALES = ["pt", "es", "en"] as const;

interface EditorContextValue {
  editMode: boolean;
  pageKey: PageKey | null;
  locale: string;
  overrides: Record<string, string>;
  globalOverrides: Record<string, string>;
  /** URL salva por path (ex: gallery:hotel:galeria:2) para atualização imediata na UI, como no admin. */
  imageOverrides: Record<string, string>;
  /** Limpa os overrides de imagem para forçar exibição dos dados recarregados da galeria (ex.: ao clicar em Atualizar). */
  clearImageOverrides: () => void;
  loading: boolean;
  onEditText: (section: string, fieldKey: string, value: string) => Promise<void>;
  onEditGlobal: (section: string, fieldKey: string, value: string) => Promise<void>;
  /** Salva o valor em PT, ES e EN de uma vez. */
  onEditTextAllLocales: (section: string, fieldKey: string, value: string) => Promise<void>;
  /** Salva o valor em PT, ES e EN para conteúdo global. */
  onEditGlobalAllLocales: (section: string, fieldKey: string, value: string) => Promise<void>;
  onEditImage: (path: string, url: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

const PAGE_PATH_TO_KEY: Record<string, PageKey> = {
  "/": "home",
  "/pt": "home",
  "/en": "home",
  "/es": "home",
  "/hotel": "hotel",
  "/lazer": "lazer",
  "/quartos": "quartos",
  "/gastronomia": "gastronomia",
  "/eventos": "eventos",
  "/esg": "esg",
  "/contato": "contato",
  "/reservas": "reservas",
  "/pacotes": "pacotes",
  "/trabalhe-conosco": "trabalhe",
};

export function EditorProvider({
  children,
  pageKey: pageKeyProp,
}: {
  children: React.ReactNode;
  pageKey?: PageKey | null;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "";
  const editMode = searchParams.get("editMode") === "1";
  const { locale } = useLanguage();
  const pageKeyFromPath =
    PAGE_PATH_TO_KEY[pathname] ??
    (pathname?.startsWith("/quartos") ? "quartos" : pathname?.startsWith("/pacotes") ? "pacotes" : null);
  const pageKey = pageKeyProp ?? pageKeyFromPath;

  const [imageOverrides, setImageOverrides] = useState<Record<string, string>>({});
  const clearImageOverrides = useCallback(() => setImageOverrides({}), []);

  const { overrides, loading, refetch } = usePageContent(pageKey, locale);
  const { overrides: globalOverrides, refetch: refetchGlobal } = usePageContent(
    editMode ? "global" : null,
    locale
  );

  const onEditText = useCallback(
    async (section: string, fieldKey: string, value: string) => {
      if (!pageKey) throw new Error("Página não identificada. Recarregue e tente novamente.");
      const res = await fetch("/api/page-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pageKey,
          section,
          field_key: fieldKey,
          locale,
          value,
        }),
      });
      if (res.ok) await refetch();
    },
    [pageKey, locale, refetch]
  );

  const onEditGlobal = useCallback(
    async (section: string, fieldKey: string, value: string) => {
      const res = await fetch("/api/page-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: "global",
          section,
          field_key: fieldKey,
          locale,
          value,
        }),
      });
      if (res.ok) {
        await refetchGlobal();
        if (pageKey) await refetch();
      }
    },
    [locale, refetchGlobal, refetch, pageKey]
  );

  const onEditTextAllLocales = useCallback(
    async (section: string, fieldKey: string, value: string) => {
      if (!pageKey) throw new Error("Página não identificada. Recarregue e tente novamente.");
      const valueStr = typeof value === "string" ? value : String(value ?? "");
      await Promise.all(
        LOCALES.map((loc) =>
          fetch("/api/page-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page: pageKey,
              section,
              field_key: fieldKey,
              locale: loc,
              value: valueStr,
            }),
          })
        )
      );
      await refetch();
    },
    [pageKey, refetch]
  );

  const onEditGlobalAllLocales = useCallback(
    async (section: string, fieldKey: string, value: string) => {
      const valueStr = typeof value === "string" ? value : String(value ?? "");
      await Promise.all(
        LOCALES.map((loc) =>
          fetch("/api/page-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page: "global",
              section,
              field_key: fieldKey,
              locale: loc,
              value: valueStr,
            }),
          })
        )
      );
      await refetchGlobal();
      if (pageKey) await refetch();
    },
    [pageKey, refetchGlobal, refetch]
  );

  const onEditImage = useCallback(
    async (path: string, url: string) => {
      if (!pageKey) throw new Error("Página não identificada. Recarregue e tente novamente.");
      if (!url?.trim()) return;
      const parts = path.split(":");
      if (parts[0] !== "gallery" || parts.length < 4) throw new Error("Caminho da imagem inválido.");
      const [, page, section, orderStr] = parts;
      const order = parseInt(orderStr ?? "0", 10) || 0;
      const listUrl = `/api/gallery?page=${encodeURIComponent(page)}&section=${encodeURIComponent(section)}&active=all`;
      const resList = await fetch(listUrl, { cache: "no-store" });
      if (!resList.ok) throw new Error("Erro ao buscar galeria");
      const list = (await resList.json()) || [];
      const existing = list.find((p: { order: number }) => p.order === order);
      if (existing?.id) {
        const resPut = await fetch(`/api/gallery/${existing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...existing, imageUrl: url }),
        });
        if (!resPut.ok) {
          const err = await resPut.json().catch(() => ({}));
          throw new Error(err?.error ?? "Erro ao atualizar imagem");
        }
      } else {
        const resPost = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page, section, imageUrl: url, order, active: true }),
        });
        if (!resPost.ok) {
          const err = await resPost.json().catch(() => ({}));
          throw new Error(err?.error ?? "Erro ao salvar imagem");
        }
      }
      setImageOverrides((prev) => ({ ...prev, [path]: url }));
      await refetch();
      notifyGalleryUpdated();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("gallery-updated"));
      }
    },
    [pageKey, refetch]
  );

  const value = useMemo<EditorContextValue>(
    () => ({
      editMode,
      pageKey,
      locale: locale as string,
      overrides,
      globalOverrides,
      imageOverrides,
      clearImageOverrides,
      loading,
      onEditText,
      onEditGlobal,
      onEditTextAllLocales,
      onEditGlobalAllLocales,
      onEditImage,
      refetch,
    }),
    [editMode, pageKey, locale, overrides, globalOverrides, imageOverrides, clearImageOverrides, loading, onEditText, onEditGlobal, onEditTextAllLocales, onEditGlobalAllLocales, onEditImage, refetch]
  );

  return (
    <EditorContext.Provider value={value}>
      {editMode && <EditModeBanner />}
      <div className={editMode ? "pt-12" : undefined}>
        {children}
      </div>
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  return ctx;
}
