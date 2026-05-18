import { escapeHtml } from "@/lib/email/smtp";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://hotelsonata.com.br";

type ContactLocale = "pt" | "en" | "es";

const copy: Record<
  ContactLocale,
  {
    subject: string;
    greeting: (name: string) => string;
    body: string;
    summaryTitle: string;
    labels: { subject: string; message: string };
    footer: string;
    phone: string;
  }
> = {
  pt: {
    subject: "Recebemos sua mensagem - Hotel Sonata de Iracema",
    greeting: (name) => `Olá, ${name}!`,
    body: "Confirmamos o recebimento da sua mensagem enviada pelo site. Nossa equipe irá analisar e responder em até 24 horas úteis.",
    summaryTitle: "Resumo do seu contato",
    labels: { subject: "Assunto", message: "Mensagem" },
    footer: `Hotel Sonata de Iracema · Praia de Iracema, Fortaleza<br/>Tel: (85) 4006-1600 · <a href="${SITE_URL}/contato">${SITE_URL}/contato</a>`,
    phone: "Telefone",
  },
  en: {
    subject: "We received your message - Hotel Sonata de Iracema",
    greeting: (name) => `Hello, ${name}!`,
    body: "We confirm receipt of your message sent through our website. Our team will review it and reply within 24 business hours.",
    summaryTitle: "Your message summary",
    labels: { subject: "Subject", message: "Message" },
    footer: `Hotel Sonata de Iracema · Iracema Beach, Fortaleza<br/>Phone: (85) 4006-1600 · <a href="${SITE_URL}/contato">${SITE_URL}/contato</a>`,
    phone: "Phone",
  },
  es: {
    subject: "Recibimos su mensaje - Hotel Sonata de Iracema",
    greeting: (name) => `Hola, ${name}!`,
    body: "Confirmamos la recepción de su mensaje enviado por el sitio web. Nuestro equipo lo revisará y responderá en un plazo de hasta 24 horas hábiles.",
    summaryTitle: "Resumen de su contacto",
    labels: { subject: "Asunto", message: "Mensaje" },
    footer: `Hotel Sonata de Iracema · Playa de Iracema, Fortaleza<br/>Tel: (85) 4006-1600 · <a href="${SITE_URL}/contato">${SITE_URL}/contato</a>`,
    phone: "Teléfono",
  },
};

function normalizeLocale(locale?: string): ContactLocale {
  if (locale === "en" || locale === "es") return locale;
  return "pt";
}

export function buildContactConfirmationEmail(params: {
  name: string;
  subject?: string | null;
  message?: string | null;
  phone?: string | null;
  locale?: string;
}): { subject: string; html: string } {
  const locale = normalizeLocale(params.locale);
  const t = copy[locale];
  const firstName = params.name.trim().split(/\s+/)[0] || params.name;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
      <h2 style="color: #1e40af; font-size: 22px; margin-bottom: 16px;">${escapeHtml(t.greeting(firstName))}</h2>
      <p style="line-height: 1.6; margin: 0 0 20px;">${escapeHtml(t.body)}</p>
      <div style="background-color: #f3f4f6; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px;">
        <p style="margin: 0 0 12px; font-weight: 600;">${escapeHtml(t.summaryTitle)}</p>
        ${
          params.subject
            ? `<p style="margin: 0 0 8px;"><strong>${escapeHtml(t.labels.subject)}:</strong> ${escapeHtml(params.subject)}</p>`
            : ""
        }
        ${
          params.phone
            ? `<p style="margin: 0 0 8px;"><strong>${escapeHtml(t.phone)}:</strong> ${escapeHtml(params.phone)}</p>`
            : ""
        }
        ${
          params.message
            ? `<p style="margin: 0; white-space: pre-wrap;"><strong>${escapeHtml(t.labels.message)}:</strong><br/>${escapeHtml(params.message)}</p>`
            : ""
        }
      </div>
      <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0;">${t.footer}</p>
    </div>
  `;

  return { subject: t.subject, html };
}
