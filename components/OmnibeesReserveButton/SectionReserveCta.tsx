"use client";

import OmnibeesReserveButton from "./OmnibeesReserveButton";

interface SectionReserveCtaProps {
  className?: string;
}

/** CTA no espaço após cada bloco de conteúdo. */
export function SectionReserveCta({ className }: SectionReserveCtaProps) {
  return (
    <div
      className={
        className
          ? `flex justify-center items-center pt-8 lg:pt-12 px-4 ${className}`
          : "flex justify-center items-center pt-8 lg:pt-12 px-4"
      }
    >
      <OmnibeesReserveButton size="lg" />
    </div>
  );
}
