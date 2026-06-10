"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://api.whatsapp.com/send?phone=558540061616&text=Ol%c3%a1,%20vi%20o%20site%20de%20voc%c3%aas%20e%20gostaria%20de%20mais%20informa%c3%a7%c3%b5es%20por%20favor.";

export function WhatsAppFloatButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Hotel Sonata no WhatsApp"
      className="fixed bottom-24 left-6 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#20bc59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 lg:bottom-6"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
