import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { buildContactConfirmationEmail } from "@/lib/email/contactConfirmation";
import {
  createMailTransporter,
  escapeHtml,
  getSmtpConfig,
  isSmtpConfigured,
} from "@/lib/email/smtp";

export async function GET() {
  try {
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens de contato:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mensagens de contato" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, locale } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e email são obrigatórios" },
        { status: 400 }
      );
    }

    const newMessage = await db
      .insert(contactMessages)
      .values({
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message: message || null,
        status: "new",
      })
      .returning();

    if (isSmtpConfigured()) {
      try {
        const { fromEmail, fromName, contactEmail } = getSmtpConfig();
        const transporter = createMailTransporter();
        const html = `
          <h2 style="color: #1e40af; font-size: 24px; margin-bottom: 20px;">Nova mensagem de Contato - Hotel Sonata de Iracema</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Nome:</td><td>${escapeHtml(name)}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Email:</td><td>${escapeHtml(email)}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Telefone:</td><td>${escapeHtml(phone || "-")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600;">Assunto:</td><td>${escapeHtml(subject || "-")}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Mensagem:</td><td>${escapeHtml(message || "-")}</td></tr>
            </table>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">Enviado automaticamente pelo formulário de contato do site.</p>
        `;

        await transporter.sendMail({
          from: `"${fromName}" <${fromEmail}>`,
          to: contactEmail,
          replyTo: email,
          subject: `Contato do site: ${subject?.trim() || name}`,
          html,
        });

        try {
          const confirmation = buildContactConfirmationEmail({
            name,
            subject,
            message,
            phone,
            locale,
          });
          await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: email,
            subject: confirmation.subject,
            html: confirmation.html,
          });
        } catch (confirmErr) {
          console.error("Erro ao enviar email de confirmação ao visitante:", confirmErr);
        }
      } catch (err) {
        console.error("Erro ao enviar email de contato:", err);
      }
    } else {
      console.warn(
        "SMTP não configurado: mensagem de contato salva no banco, email não enviado."
      );
    }

    return NextResponse.json(newMessage[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar mensagem de contato:", error);
    return NextResponse.json(
      { error: "Erro ao enviar mensagem. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
