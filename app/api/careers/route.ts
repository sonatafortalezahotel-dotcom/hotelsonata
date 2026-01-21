import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configuração SMTP Zoho
const createTransporter = () => {
  const host = process.env.SMTP_HOST || "smtppro.zoho.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER || "dev@opendreams.com.br";
  const pass = process.env.SMTP_PASSWORD || "Rafael@20213413";
  
  // Log de configuração (sem expor a senha completa)
  console.log("Configurando SMTP:", {
    host,
    port,
    user,
    passLength: pass ? pass.length : 0,
    secure: port === 465,
  });

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true para porta 465 (SSL), false para 587 (TLS)
    auth: {
      user,
      pass,
    },
    // Opções adicionais para melhor compatibilidade
    tls: {
      rejectUnauthorized: false, // Aceitar certificados auto-assinados (apenas para desenvolvimento)
    },
  });
};

// Email do RH - será configurado via variável de ambiente
const RH_EMAIL = process.env.RH_EMAIL || "rh@hotelsonata.com.br";
const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || "dev@opendreams.com.br";
const FROM_NAME = process.env.SMTP_FROM_NAME || "Open Dreams";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string;
    const message = formData.get("message") as string;
    const resume = formData.get("resume") as File | null;

    // Validações básicas
    if (!name || !email || !phone || !position) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Preparar anexo do currículo se existir
    let attachments = [];
    if (resume && resume.size > 0) {
      const arrayBuffer = await resume.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      attachments.push({
        filename: resume.name,
        content: buffer,
      });
    }

    // Função para escapar HTML e prevenir XSS
    const escapeHtml = (text: string) => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    // Preparar conteúdo do email
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
            <td style="padding: 8px 0; color: #111827; font-weight: 600; color: #1e40af;">${escapeHtml(position)}</td>
          </tr>
        </table>
      </div>

      ${message ? `
      <div style="margin-top: 20px;">
        <h3 style="color: #111827; font-size: 18px; margin-bottom: 10px;">Mensagem do Candidato</h3>
        <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #1e40af; border-radius: 4px;">
          <p style="color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      </div>
      ` : ''}

      ${resume ? `
      <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
        <p style="color: #1e40af; margin: 0; font-weight: 600;">
          📎 Currículo anexado: ${escapeHtml(resume.name)} (${(resume.size / 1024).toFixed(2)} KB)
        </p>
      </div>
      ` : ''}

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          Este email foi enviado automaticamente através do formulário de recrutamento do site Hotel Sonata de Iracema.
        </p>
      </div>
    `;

    // Enviar email via SMTP (Zoho)
    try {
      const transporter = createTransporter();
      
      // Verificar conexão antes de enviar (apenas em desenvolvimento)
      if (process.env.NODE_ENV === "development") {
        try {
          await transporter.verify();
          console.log("Conexão SMTP verificada com sucesso");
        } catch (verifyError: any) {
          console.error("Erro ao verificar conexão SMTP:", {
            code: verifyError.code,
            command: verifyError.command,
            response: verifyError.response,
            responseCode: verifyError.responseCode,
            message: verifyError.message,
          });
          // Continuar mesmo com erro de verificação, pode ser apenas um aviso
        }
      }
      
      const mailOptions = {
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: RH_EMAIL,
        replyTo: email,
        subject: `Nova Candidatura: ${name} - ${position}`,
        html: emailContent,
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      console.log("Enviando email para:", RH_EMAIL);
      const info = await transporter.sendMail(mailOptions);
      console.log("Email enviado com sucesso:", info.messageId);

      return NextResponse.json({
        success: true,
        message: "Candidatura enviada com sucesso!",
        messageId: info.messageId,
      });
    } catch (emailError: any) {
      console.error("Erro ao enviar email:", {
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
        responseCode: emailError.responseCode,
        message: emailError.message,
        stack: emailError.stack,
      });
      
      // Mensagens de erro mais específicas
      let errorMessage = "Erro ao enviar email. Tente novamente mais tarde.";
      
      if (emailError.code === "EAUTH") {
        errorMessage = "Erro de autenticação SMTP. Verifique as credenciais e configurações do servidor.";
      } else if (emailError.code === "ECONNECTION") {
        errorMessage = "Erro de conexão com o servidor SMTP. Verifique o host e a porta.";
      } else if (emailError.code === "ETIMEDOUT") {
        errorMessage = "Timeout ao conectar com o servidor SMTP.";
      } else if (emailError.response) {
        errorMessage = `Erro do servidor SMTP: ${emailError.response}`;
      } else if (emailError.message) {
        errorMessage = `Erro: ${emailError.message}`;
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          // Em desenvolvimento, incluir mais detalhes
          ...(process.env.NODE_ENV === "development" && {
            debug: {
              code: emailError.code,
              command: emailError.command,
              response: emailError.response,
              responseCode: emailError.responseCode,
              host: process.env.SMTP_HOST || "smtppro.zoho.com",
              port: process.env.SMTP_PORT || "465",
              user: process.env.SMTP_USER || "dev@opendreams.com.br",
              // Não incluir senha por segurança
            }
          })
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Erro ao processar candidatura:", error);
    
    // Mensagem de erro mais específica
    const errorMessage = error?.message || "Erro ao processar candidatura. Tente novamente mais tarde.";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
