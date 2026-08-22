"use client";

import { CalendarCheck } from "lucide-react";
import {
  OMNIBEES_HOTEL_URL,
  OMNIBEES_RESERVE_BUTTON_CLASSNAME,
  getReserveNowLabel,
} from "@/lib/utils/omnibees";
import { useLanguage } from "@/lib/context/LanguageContext";

const SIZE_CLASSES = {
  sm: "h-9 min-h-[36px] px-3 text-xs rounded-md",
  md: "h-11 min-h-[44px] px-6 text-sm rounded-md",
  lg: "h-12 min-h-[48px] px-8 text-base rounded-md",
  header: "h-10 min-h-[40px] px-4 text-sm rounded-md",
} as const;

interface OmnibeesReserveButtonProps {
  className?: string;
  size?: keyof typeof SIZE_CLASSES;
  showIcon?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

export default function OmnibeesReserveButton({
  className,
  size = "md",
  showIcon = true,
  children,
  onClick,
}: OmnibeesReserveButtonProps) {
  const { locale } = useLanguage();
  const label = getReserveNowLabel(locale);

  return (
    <a
      href={OMNIBEES_HOTEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(OMNIBEES_RESERVE_BUTTON_CLASSNAME, SIZE_CLASSES[size], className)}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
    >
      {showIcon && <CalendarCheck className="h-4 w-4 flex-shrink-0" aria-hidden />}
      <span className="whitespace-nowrap">{children ?? label}</span>
    </a>
  );
}
