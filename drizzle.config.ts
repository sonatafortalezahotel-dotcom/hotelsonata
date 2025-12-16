import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Carrega variáveis de ambiente do .env.local
dotenv.config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

