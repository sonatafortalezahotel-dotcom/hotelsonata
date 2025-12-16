import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "../lib/db/schema";

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
 * Script para listar todos os usuários do banco de dados
 * 
 * Uso:
 * npm run list-users
 */

async function listUsers() {
  try {
    const allUsers = await db.select().from(users);

    if (allUsers.length === 0) {
      console.log("❌ Nenhum usuário encontrado no banco de dados.");
      console.log("\n💡 Execute: npm run create-admin");
      process.exit(0);
    }

    console.log(`\n✅ Encontrados ${allUsers.length} usuário(s):\n`);
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Senha: ${user.password} (texto plano - apenas desenvolvimento)`);
      console.log(`   Role: ${user.role}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Criado em: ${user.createdAt}`);
      console.log("");
    });

    console.log("🔗 Use estas credenciais para fazer login em: http://localhost:3000/admin/login");
  } catch (error) {
    console.error("❌ Erro ao listar usuários:", error);
    process.exit(1);
  }
}

listUsers();

