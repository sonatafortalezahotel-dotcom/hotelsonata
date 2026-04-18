import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

/**
 * Carrega `.env.local` (base) e depois `.env.migrate.local` com override,
 * para tokens de migração prevalecerem mas ainda poder usar BLOB_READ_WRITE_TOKEN só no .env.local.
 */
export function loadMigrateEnv(): void {
  const migratePath = resolve(process.cwd(), ".env.migrate.local");
  const localPath = resolve(process.cwd(), ".env.local");

  if (!existsSync(migratePath)) {
    console.error("❌ Crie .env.migrate.local (veja .env.migrate.example)");
    process.exit(1);
  }

  if (existsSync(localPath)) {
    config({ path: localPath });
  }
  config({ path: migratePath, override: true });
}
