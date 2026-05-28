/**
 * Testa credenciais SMTP do .env.local (mesmo fluxo do formulário de contato).
 *
 * Uso:
 *   npm run test:smtp              → só verify (login no servidor)
 *   npm run test:smtp -- --send      → verify + envia email de teste
 *   npm run test:smtp -- --send --to voce@gmail.com
 */
import { config } from "dotenv";
// override: true — senão variáveis SMTP antigas no shell/IDE mascaram o .env.local
config({ path: ".env.local", override: true });

import {
  createMailTransporter,
  getContactCcEmails,
  getSmtpConfig,
  isSmtpConfigured,
  logMailResult,
} from "../lib/email/smtp";

function parseArgs() {
  const argv = process.argv.slice(2);
  return {
    send: argv.includes("--send"),
    to: argv.includes("--to")
      ? argv[argv.indexOf("--to") + 1]?.trim()
      : undefined,
  };
}

async function main() {
  const { send, to } = parseArgs();
  const cfg = getSmtpConfig();
  const cc = getContactCcEmails();

  console.log("=== Teste SMTP (Hotel Sonata) ===\n");
  console.log("Host:", cfg.host);
  console.log("Port:", cfg.port);
  console.log("User:", cfg.user);
  console.log("From:", `${cfg.fromName} <${cfg.fromEmail}>`);
  console.log("Password definida:", cfg.pass ? `sim (${cfg.pass.length} caracteres)` : "NÃO");
  console.log("Contato (to):", cfg.contactEmail);
  console.log("Contato (cc):", cc.join(", ") || "(nenhum)");
  console.log("");

  if (!isSmtpConfigured()) {
    console.error("❌ SMTP_PASSWORD ausente ou vazio no .env.local");
    process.exit(1);
  }

  const transporter = createMailTransporter();

  console.log("1/2 Verificando conexão e autenticação (verify)...");
  try {
    await transporter.verify();
    console.log("✅ verify() OK — credenciais aceitas pelo servidor\n");
  } catch (err) {
    console.error("❌ verify() falhou — credenciais ou host/porta incorretos:\n");
    console.error(err);
    process.exit(1);
  }

  if (!send) {
    console.log("Dica: para enviar um email de teste (como o formulário de contato):");
    console.log("  npm run test:smtp -- --send");
    console.log("  npm run test:smtp -- --send --to seu@gmail.com");
    return;
  }

  const toAddress = to || cfg.contactEmail;
  const now = new Date().toISOString();
  console.log(`2/2 Enviando email de teste para: ${toAddress}`);
  if (cc.length) console.log(`    CC: ${cc.join(", ")}`);

  try {
    const result = await transporter.sendMail({
      from: `"${cfg.fromName}" <${cfg.fromEmail}>`,
      to: toAddress,
      cc: cc.length > 0 ? cc : undefined,
      replyTo: "teste-contato@hotelsonata.com.br",
      subject: `[TESTE SMTP] Contato do site — ${now}`,
      text: [
        "Email de teste do script scripts/test-smtp.ts",
        "Se você recebeu isto, o SMTP está funcionando.",
        `Para: ${toAddress}`,
        `CC: ${cc.join(", ") || "-"}`,
        `Data: ${now}`,
      ].join("\n"),
      html: `
        <h2 style="color:#1e40af">Teste SMTP — Hotel Sonata</h2>
        <p>Email de teste do script <code>test-smtp.ts</code>.</p>
        <p><strong>Para:</strong> ${toAddress}</p>
        <p><strong>CC:</strong> ${cc.join(", ") || "-"}</p>
        <p style="color:#6b7280;font-size:12px">${now}</p>
      `,
    });
    logMailResult("✅ sendMail", result);
    console.log("\n✅ Envio concluído. Confira a caixa de entrada e o spam.");
  } catch (err) {
    console.error("\n❌ sendMail falhou:\n");
    console.error(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
