import nodemailer, { type SentMessageInfo } from "nodemailer";

/** Padrões do Hotel Sonata (Locaweb email-ssl). Sobrescreva via variáveis de ambiente. */
export const SMTP_DEFAULTS = {
  host: "email-ssl.com.br",
  port: 465,
  user: "naoresponda@hotelsonata.com.br",
  fromEmail: "naoresponda@hotelsonata.com.br",
  fromName: "Hotel Sonata",
  rhEmail: "vagas@hotelsonata.com.br",
  eventosEmail: "reservas@sonatadeiracema.com.br",
  contactEmail: "reservas@sonatadeiracema.com.br",
  contactCcEmails: [
    "rafaelcsmarilia@gmail.com",
    "kommucomunicacao@gmail.com",
  ],
} as const;

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function getSmtpConfig() {
  const port = parseInt(
    trimEnv(process.env.SMTP_PORT) || String(SMTP_DEFAULTS.port),
    10
  );
  return {
    host: trimEnv(process.env.SMTP_HOST) || SMTP_DEFAULTS.host,
    port,
    user: trimEnv(process.env.SMTP_USER) || SMTP_DEFAULTS.user,
    pass: trimEnv(process.env.SMTP_PASSWORD),
    fromEmail:
      trimEnv(process.env.SMTP_FROM_EMAIL) || SMTP_DEFAULTS.fromEmail,
    fromName: trimEnv(process.env.SMTP_FROM_NAME) || SMTP_DEFAULTS.fromName,
    rhEmail: trimEnv(process.env.RH_EMAIL) || SMTP_DEFAULTS.rhEmail,
    eventosEmail:
      trimEnv(process.env.EVENTOS_EMAIL) || SMTP_DEFAULTS.eventosEmail,
    contactEmail:
      trimEnv(process.env.CONTACT_EMAIL) || SMTP_DEFAULTS.contactEmail,
  };
}

export function isSmtpConfigured(): boolean {
  const { user, pass } = getSmtpConfig();
  return Boolean(user && pass);
}

/** Cópia (CC) nos alertas do formulário de contato. `CONTACT_CC_EMAILS` = emails separados por vírgula. */
export function getContactCcEmails(): string[] {
  const raw =
    trimEnv(process.env.CONTACT_CC_EMAILS) ||
    SMTP_DEFAULTS.contactCcEmails.join(",");
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export function createMailTransporter() {
  const { host, port, user, pass } = getSmtpConfig();
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  });
}

/** Loga resposta do nodemailer (accepted/rejected) para debug na Vercel. */
export function logMailResult(label: string, result: SentMessageInfo) {
  console.log(label, {
    messageId: result.messageId,
    accepted: result.accepted,
    rejected: result.rejected,
    response: result.response,
  });
  if (result.rejected?.length) {
    console.error(`${label} — destinatários rejeitados pelo SMTP:`, result.rejected);
  }
}

export function escapeHtml(text: string) {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text ?? "").replace(/[&<>"']/g, (m) => map[m]);
}
