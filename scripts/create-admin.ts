import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";

// Carrega .env.local primeiro, depois .env
const envLocalPath = resolve(process.cwd(), ".env.local");
const envPath = resolve(process.cwd(), ".env");

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
}
if (existsSync(envPath)) {
  config({ path: envPath });
}

// Verifica se DATABASE_URL foi carregada
if (!process.env.DATABASE_URL) {
  console.error("❌ Erro: DATABASE_URL não está definida nas variáveis de ambiente");
  console.error("💡 Verifique se o arquivo .env.local existe e contém DATABASE_URL");
  process.exit(1);
}

// Cria conexão direta com o banco (sem usar lib/db que carrega antes do dotenv)
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

/**
 * Script para criar usuário admin no banco de dados
 * 
 * Uso:
 * npx tsx scripts/create-admin.ts
 * 
 * Ou configure no package.json:
 * npm run create-admin
 */

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@hotelsonata.com.br";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "Administrador";

  try {
    // Verifica se já existe um usuário com este email
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log("❌ Usuário já existe com este email:", email);
      console.log("💡 Para criar um novo usuário, use um email diferente ou delete o existente.");
      process.exit(1);
    }

    // Cria o novo usuário
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password, // ⚠️ Em produção, use hash bcrypt
        role: "admin",
      })
      .returning();

    console.log("✅ Usuário admin criado com sucesso!");
    console.log("\n📋 Credenciais de acesso:");
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Senha: ${password}`);
    console.log(`   Role: ${newUser.role}`);
    console.log("\n🔗 Acesse o painel em: http://localhost:3000/admin/login");
    console.log("\n⚠️  IMPORTANTE: Em produção, use hash de senha (bcrypt)!");
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin:", error);
    process.exit(1);
  }
}

createAdmin();

