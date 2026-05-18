import nodemailer from "nodemailer";

/** Padrões do Hotel Sonata (Locaweb email-ssl). Sobrescreva via variáveis de ambiente. */
export const SMTP_DEFAULTS = {
  host: "email-ssl.com.br",
  port: 465,
  user: "naoresponda@hotelsonata.com.br",
  fromEmail: "naoresponda@hotelsonata.com.br",
  fromName: "Hotel Sonata",
  rhEmail: "vagas@hotelsonata.com.br",
  eventosEmail: "reservas@sonatadeiracema.com.br",
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
  };
}

export function isSmtpConfigured(): boolean {
  const { user, pass } = getSmtpConfig();
  return Boolean(user && pass);
}

export function createMailTransporter() {
  const { host, port, user, pass } = getSmtpConfig();
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
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
