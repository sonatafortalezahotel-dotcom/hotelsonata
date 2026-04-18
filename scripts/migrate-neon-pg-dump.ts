/**
 * Copia a base de dados (Neon A → Neon B) com pg_dump + pg_restore.
 *
 * Requisitos:
 *   - `pg_dump` e `pg_restore` no PATH (ex.: instalar "PostgreSQL client" / kit completo em https://www.postgresql.org/download/windows/)
 *   - Variáveis no .env.migrate.local
 *
 * Uso: npm run migrate:neon-dump
 */
import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadMigrateEnv } from "./load-migrate-env";

loadMigrateEnv();

const source = process.env.MIGRATE_NEON_SOURCE_URL;
const target =
  process.env.MIGRATE_NEON_TARGET_URL ??
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL;
const useClean =
  process.env.MIGRATE_NEON_CLEAN === "1" || process.env.MIGRATE_NEON_CLEAN === "true";

/**
 * Procura `pg_dump` / `pg_restore` no PATH ou em instalações típicas do Windows
 * (útil se o binário ainda não estiver no PATH após instalar).
 */
function resolvePgTool(name: "pg_dump" | "pg_restore"): string {
  if (process.platform === "win32") {
    const w = spawnSync("where", [name], { encoding: "utf-8", windowsHide: true });
    if (w.status === 0) return name;
    for (const ver of [18, 17, 16, 15, 14]) {
      const p = `C:\\Program Files\\PostgreSQL\\${ver}\\bin\\${name}.exe`;
      if (existsSync(p)) return p;
    }
    for (const ver of [18, 17, 16, 15, 14]) {
      const p = `C:\\Program Files (x86)\\PostgreSQL\\${ver}\\bin\\${name}.exe`;
      if (existsSync(p)) return p;
    }
    return "";
  }
  const w = spawnSync("which", [name], { encoding: "utf-8" });
  if (w.status === 0) return name;
  for (const ver of [16, 15, 14]) {
    const p = `/usr/lib/postgresql/${ver}/bin/${name}`;
    if (existsSync(p)) return p;
  }
  if (existsSync("/usr/bin/" + name)) return "/usr/bin/" + name;
  return "";
}

function redactUrl(u: string): string {
  try {
    const x = new URL(u);
    if (x.password) x.password = "****";
    if (x.username) x.username = "****";
    return x.toString();
  } catch {
    return "(url inválida)";
  }
}

async function main() {
  if (!source) {
    console.error("❌ MIGRATE_NEON_SOURCE_URL — string de ligação do PostgreSQL ANTIGO (Neon).");
    process.exit(1);
  }
  if (!target) {
    console.error(
      "❌ Defina MIGRATE_NEON_TARGET_URL, ou então DATABASE_URL_UNPOOLED / DATABASE_URL com o Neon NOVO."
    );
    process.exit(1);
  }
  const binDump = resolvePgTool("pg_dump");
  const binRestore = resolvePgTool("pg_restore");
  if (!binDump || !binRestore) {
    console.error(
      `❌ Não encontro pg_dump/pg_restore. Instale o PostgreSQL (inclui os binários em bin/) ou só as ferramentas:`
    );
    console.error(
      `   PowerShell (Admin): winget install -e --id PostgreSQL.PostgreSQL.17 --accept-package-agreements`
    );
    console.error(`   https://www.postgresql.org/download/windows/  →  depois reabra o terminal.`);
    process.exit(1);
  }
  if (binDump !== "pg_dump") {
    console.log("ℹ️  Usando", binDump);
  }
  if (binRestore !== "pg_restore") {
    console.log("ℹ️  Usando", binRestore);
  }

  const tmpFile = join(tmpdir(), `hotel-neon-migrate-${randomBytes(6).toString("hex")}.dump`);

  console.log("Origem: ", redactUrl(source));
  console.log("Destino:", redactUrl(target));
  if (useClean) {
    console.log("Modo:   --clean --if-exists no destino (apaga objectos existentes com o mesmo nome)\n");
  } else {
    console.log("Modo:   só acrescenta — se o destino já tiver schema, pode dar erro. Use MIGRATE_NEON_CLEAN=1 com cuidado.\n");
  }

  console.log("1/2 pg_dump (custom format) → ficheiro temporário…");
  const dump = spawn(binDump, [
    "-d", source,
    "-Fc",
    "--no-owner",
    "--no-acl",
    "-f",
    tmpFile,
  ], { stdio: ["ignore", "inherit", "inherit"] });
  const [dumpCode] = await once(dump, "close");
  if (dumpCode !== 0) {
    await unlink(tmpFile).catch(() => undefined);
    throw new Error(`pg_dump terminou com código ${dumpCode ?? "?"}.`);
  }

  console.log("\n2/2 pg_restore no destino…");
  const restoreArgs = ["-d", target, "--no-owner", "--no-acl", "-v", tmpFile];
  if (useClean) {
    restoreArgs.splice(0, 0, "--clean", "--if-exists");
  }
  const rest = spawn(binRestore, restoreArgs, { stdio: ["ignore", "inherit", "inherit"] });
  const [restCode] = await once(rest, "close");
  try {
    if (restCode !== 0) {
      throw new Error(`pg_restore terminou com código ${restCode ?? "?"}.`);
    }
  } finally {
    await unlink(tmpFile).catch(() => undefined);
  }

  console.log("\n✅ Restore concluído. De seguida: migrate:blob-copy (se ainda fez falta) e migrate:blob-urls-db.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
