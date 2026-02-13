/**
 * Aplica na tabela gallery as colunas video_url e media_type e torna image_url opcional.
 * Execute: npm run migrate:gallery
 * Ou: npx dotenv -e .env.local -- tsx scripts/run-migrate-gallery-video.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config(); // fallback .env
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("Defina DATABASE_URL (ex.: em .env.local)");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function main() {
  console.log("Aplicando alterações na tabela gallery...");

  try {
    await sql`ALTER TABLE gallery ALTER COLUMN image_url DROP NOT NULL`;
    console.log("  - image_url agora é opcional");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("already") || msg.includes("cannot")) {
      console.log("  - image_url já estava opcional ou sem alteração");
    } else throw e;
  }

  try {
    await sql`ALTER TABLE gallery ADD COLUMN IF NOT EXISTS video_url text`;
    console.log("  - coluna video_url ok");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("already exists") || msg.includes("duplicate")) {
      console.log("  - video_url já existe");
    } else throw e;
  }

  try {
    await sql`ALTER TABLE gallery ADD COLUMN IF NOT EXISTS media_type varchar(10) DEFAULT 'image' NOT NULL`;
    console.log("  - coluna media_type ok");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("already exists") || msg.includes("duplicate")) {
      console.log("  - media_type já existe");
    } else throw e;
  }

  console.log("Concluído. Reinicie o app e teste /api/gallery e /api/admin/media");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
