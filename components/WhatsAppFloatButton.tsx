"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_PHONE = "558540061616";
const WHATSAPP_MESSAGE =
  "Olá, vi o site do Hotel Sonata e gostaria de mais informações por favor";

const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

export function WhatsAppFloatButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Hotel Sonata no WhatsApp"
      className="fixed bottom-6 right-6 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#20bc59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
