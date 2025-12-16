import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não está definida nas variáveis de ambiente");
}

// Cria a conexão com o banco de dados Neon
const sql = neon(process.env.DATABASE_URL);

// Cria a instância do Drizzle ORM
export const db = drizzle(sql, { schema });

// Exporta o schema para uso em outros arquivos
export * from "./schema";

