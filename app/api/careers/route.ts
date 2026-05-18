import { NextRequest, NextResponse } from "next/server";
import {
  createMailTransporter,
  escapeHtml,
  getSmtpConfig,
  isSmtpConfigured,
} from "@/lib/email/smtp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string;
    const message = formData.get("message") as string;
    const resume = formData.get("resume") as File | null;

    if (!name || !email || !phone || !position) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    if (!isSmtpConfigured()) {
      return NextResponse.json(
        { error: "Serviço de email não configurado. Defina SMTP_PASSWORD." },
        { status: 503 }
      );
    }

    const { fromEmail, fromName, rhEmail } = getSmtpConfig();

    const attachments = [];
    if (resume && resume.size > 0) {
      const arrayBuffer = await resume.arrayBuffer();
      attachments.push({
        filename: resume.name,
        content: Buffer.from(arrayBuffer),
      });
    }

    const emailContent = `
      <h2 style="color: #1e40af; font-size: 24px; margin-bottom: 20px;">Nova Candidatura - Hotel Sonata de Iracema</h2>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #111827; font-size: 18px; margin-bottom: 15px;">Dados do Candidato</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #374151; font-weight: 600; width: 150px;">Nome:</td>
            <td style="padding: 8px 0; color: #111827;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #374151; font-weight: 600;">Email:</td>
            <td style="padding: 8px 0; color: #111827;">${escapeHtml(email)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #374151; font-weight: 600;">Telefone:</td>
            <td style="padding: 8px 0; color: #111827;">${escapeHtml(phone)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #374151; font-weight: 600;">Cargo de Interesse:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #1e40af;">${escapeHtml(position)}</td>
          </tr>
        </table>
      </div>

      ${
        message
          ? `
      <div style="margin-top: 20px;">
        <h3 style="color: #111827; font-size: 18px; margin-bottom: 10px;">Mensagem do Candidato</h3>
        <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #1e40af; border-radius: 4px;">
          <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      </div>
      `
          : ""
      }

      ${
        resume
          ? `
      <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
        <p style="color: #1e40af; margin: 0; font-weight: 600;">
          Currículo anexado: ${escapeHtml(resume.name)} (${(resume.size / 1024).toFixed(2)} KB)
        </p>
      </div>
      `
          : ""
      }

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          Este email foi enviado automaticamente através do formulário de recrutamento do site Hotel Sonata de Iracema.
        </p>
      </div>
    `;

    try {
      const transporter = createMailTransporter();

      if (process.env.NODE_ENV === "development") {
        try {
          await transporter.verify();
        } catch (verifyError) {
          console.error("Erro ao verificar conexão SMTP:", verifyError);
        }
      }

      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: rhEmail,
        replyTo: email,
        subject: `Nova Candidatura: ${name} - ${position}`,
        html: emailContent,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      return NextResponse.json({
        success: true,
        message: "Candidatura enviada com sucesso!",
        messageId: info.messageId,
      });
    } catch (emailError: unknown) {
      const err = emailError as {
        code?: string;
        command?: string;
        response?: string;
        responseCode?: number;
        message?: string;
      };
      console.error("Erro ao enviar email:", err);

      let errorMessage = "Erro ao enviar email. Tente novamente mais tarde.";
      if (err.code === "EAUTH") {
        errorMessage =
          "Erro de autenticação SMTP. Verifique as credenciais e configurações do servidor.";
      } else if (err.code === "ECONNECTION") {
        errorMessage =
          "Erro de conexão com o servidor SMTP. Verifique o host e a porta.";
      } else if (err.code === "ETIMEDOUT") {
        errorMessage = "Timeout ao conectar com o servidor SMTP.";
      } else if (err.response) {
        errorMessage = `Erro do servidor SMTP: ${err.response}`;
      } else if (err.message) {
        errorMessage = `Erro: ${err.message}`;
      }

      const smtp = getSmtpConfig();
      return NextResponse.json(
        {
          error: errorMessage,
          ...(process.env.NODE_ENV === "development" && {
            debug: {
              code: err.code,
              command: err.command,
              response: err.response,
              responseCode: err.responseCode,
              host: smtp.host,
              port: smtp.port,
              user: smtp.user,
            },
          }),
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Erro ao processar candidatura:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro ao processar candidatura. Tente novamente mais tarde.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
