import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import nodemailer from "nodemailer";
import { db } from "@/lib/db";
import { eventLeads } from "@/lib/db/schema";

const EVENTOS_EMAIL = process.env.EVENTOS_EMAIL || "eventos@sonatadeiracema.com.br";
const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || "dev@opendreams.com.br";
const FROM_NAME = process.env.SMTP_FROM_NAME || "Hotel Sonata";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtppro.zoho.com",
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });
}

function escapeHtml(text: string) {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text ?? "").replace(/[&<>"']/g, (m) => map[m]);
}

export async function GET() {
  try {
    const leads = await db.select().from(eventLeads).orderBy(desc(eventLeads.createdAt));
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Erro ao buscar leads de eventos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar leads de eventos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, eventType, eventDate, guests, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e email são obrigatórios" },
        { status: 400 }
      );
    }

    const newLead = await db
      .insert(eventLeads)
      .values({
        name,
        email,
        phone,
        company,
        eventType,
        eventDate: eventDate || null,
        guests,
        message,
        status: "new",
      })
      .returning();

    // Enviar email para eventos@ (formulário de eventos)
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      try {
        const transporter = createTransporter();
        const html = `
          <h2 style="color: #1e40af; font-size: 24px; margin-bottom: 20px;">Novo lead de Eventos - Hotel Sonata de Iracema</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Nome:</td><td>${escapeHtml(name)}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Email:</td><td>${escapeHtml(email)}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Telefone:</td><td>${escapeHtml(phone || "-")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Empresa:</td><td>${escapeHtml(company || "-")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Tipo de evento:</td><td>${escapeHtml(eventType || "-")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Data prevista:</td><td>${escapeHtml(eventDate || "-")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Nº convidados:</td><td>${escapeHtml(guests ?? "-")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Mensagem:</td><td>${escapeHtml(message || "-")}</td></tr>
            </table>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">Enviado automaticamente pelo formulário de eventos do site.</p>
        `;
        await transporter.sendMail({
          from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
          to: EVENTOS_EMAIL,
          replyTo: email,
          subject: `Novo lead de Eventos: ${name}${company ? ` - ${company}` : ""}`,
          html,
        });
      } catch (err) {
        console.error("Erro ao enviar email de lead de eventos:", err);
      }
    }

    return NextResponse.json(newLead[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar lead de evento:", error);
    return NextResponse.json(
      { error: "Erro ao criar lead de evento" },
      { status: 500 }
    );
  }
}

