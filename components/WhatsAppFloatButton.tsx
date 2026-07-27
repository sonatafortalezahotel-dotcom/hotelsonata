"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=558540061616&text=Ol%c3%a1,%20vi%20o%20site%20de%20voc%c3%aas%20e%20gostaria%20de%20mais%20informa%c3%a7%c3%b5es%20por%20favor.";

const HOME_PATHS = new Set(["/", "/pt", "/en", "/es"]);

export function WhatsAppFloatButton() {
  const pathname = usePathname();
  const isHomePage = HOME_PATHS.has(pathname ?? "");

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Hotel Sonata no WhatsApp"
      className={cn(
        "fixed left-4 z-[70] inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#20bc59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 lg:left-6 lg:h-14 lg:w-14 lg:bottom-6",
        isHomePage
          ? "bottom-6"
          : "bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))]"
      )}
    >
      <MessageCircle className="h-6 w-6 lg:h-7 lg:w-7" />
    </a>
  );
}
