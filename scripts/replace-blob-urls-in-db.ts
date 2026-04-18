/**
 * Substitui o host do Vercel Blob (URL antiga → nova) em colunas text/jsonb.
 * Usa `pg` por **TCP** ao host `ep-….neon.tech`, evitando o driver HTTP do Neon
 * (que exige `api.neon.tech` a resolver no DNS).
 *
 * Preferir `DATABASE_URL_UNPOOLED` (connection direta) no .env.migrate.local.
 *
 * Uso: npm run migrate:blob-urls-db
 * Simulação: DRY_RUN=1 npm run migrate:blob-urls-db
 */
import { Client } from "pg";
import { loadMigrateEnv } from "./load-migrate-env";

loadMigrateEnv();

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
const oldOrigin = (process.env.BLOB_PUBLIC_ORIGIN_OLD ?? "").replace(/\/$/, "");
const newOrigin = (process.env.BLOB_PUBLIC_ORIGIN_NEW ?? "").replace(/\/$/, "");
const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

if (!connectionString) {
  console.error("❌ Defina DATABASE_URL (e idealmente DATABASE_URL_UNPOOLED) em .env.migrate.local");
  process.exit(1);
}
if (!oldOrigin || !newOrigin || oldOrigin === newOrigin) {
  console.error("❌ Defina BLOB_PUBLIC_ORIGIN_OLD e BLOB_PUBLIC_ORIGIN_NEW (distintos, sem / no fim)");
  process.exit(1);
}

const client = new Client({ connectionString, connectionTimeoutMillis: 60_000 });

type Col = { table: string; column: string; kind: "text" | "jsonb" };

const columns: Col[] = [
  { table: "highlights", column: "image_url", kind: "text" },
  { table: "highlights", column: "video_url", kind: "text" },
  { table: "packages", column: "image_url", kind: "text" },
  { table: "rooms", column: "image_url", kind: "text" },
  { table: "rooms", column: "gallery", kind: "jsonb" },
  { table: "gastronomy", column: "image_url", kind: "text" },
  { table: "gastronomy", column: "gallery", kind: "jsonb" },
  { table: "leisure", column: "image_url", kind: "text" },
  { table: "leisure", column: "gallery", kind: "jsonb" },
  { table: "events", column: "image_url", kind: "text" },
  { table: "events", column: "gallery", kind: "jsonb" },
  { table: "seo_metadata", column: "og_image", kind: "text" },
  { table: "gallery", column: "image_url", kind: "text" },
  { table: "gallery", column: "video_url", kind: "text" },
  { table: "sustainability", column: "image_url", kind: "text" },
  { table: "certifications", column: "image_url", kind: "text" },
  { table: "social_media_posts", column: "image_url", kind: "text" },
  { table: "nearby_attractions", column: "image_url", kind: "text" },
  { table: "seo_landing_pages", column: "og_image", kind: "text" },
  { table: "blog_posts", column: "featured_image_url", kind: "text" },
  { table: "blog_posts", column: "og_image", kind: "text" },
  { table: "blog_posts", column: "content", kind: "text" },
  { table: "page_content", column: "value", kind: "text" },
  { table: "site_settings", column: "value", kind: "text" },
];

function ident(s: string): string {
  if (!/^[a-z_][a-z0-9_]*$/.test(s)) {
    throw new Error(`ident inválido: ${s}`);
  }
  return s;
}

async function countMatches(table: string, column: string, kind: "text" | "jsonb"): Promise<number> {
  const t = ident(table);
  const c = ident(column);
  const text =
    kind === "text"
      ? `SELECT COUNT(*)::int AS n FROM ${t} WHERE ${c} IS NOT NULL AND position($1 in ${c}) > 0`
      : `SELECT COUNT(*)::int AS n FROM ${t} WHERE ${c} IS NOT NULL AND position($1 in (${c}::text)) > 0`;
  const { rows } = await client.query<{ n: string }>(text, [oldOrigin]);
  return Number(rows[0]?.n ?? 0);
}

async function runUpdate(table: string, column: string, kind: "text" | "jsonb"): Promise<number> {
  const t = ident(table);
  const c = ident(column);
  const text =
    kind === "text"
      ? `UPDATE ${t} SET ${c} = REPLACE(${c}, $1, $2) WHERE ${c} IS NOT NULL AND position($1 in ${c}) > 0 RETURNING 1`
      : `UPDATE ${t} SET ${c} = REPLACE((${c}::text), $1, $2)::jsonb WHERE ${c} IS NOT NULL AND position($1 in (${c}::text)) > 0 RETURNING 1`;
  const res = await client.query(text, [oldOrigin, newOrigin]);
  return res.rowCount ?? 0;
}

async function main() {
  console.log("🔗 Ligação PostgreSQL (pg) por TCP — não usa api.neon.tech.\n");
  if (process.env.DATABASE_URL_UNPOOLED) {
    console.log("   (DATABASE_URL_UNPOOLED)\n");
  }

  try {
    await client.connect();

    console.log(dryRun ? "🔎 DRY_RUN: só contagens\n" : "⚠️  A aplicar UPDATEs…\n");
    console.log(`Antigo: ${oldOrigin}\nNovo:   ${newOrigin}\n`);

    for (const { table, column, kind } of columns) {
      const n = await countMatches(table, column, kind);
      if (n === 0) continue;
      console.log(`${table}.${column} (${kind}): ${n} linha(s)`);
      if (!dryRun) {
        const updated = await runUpdate(table, column, kind);
        console.log(`   → linhas afetadas: ${updated}`);
      }
    }

    console.log(dryRun ? "\n(Remova DRY_RUN para executar.)" : "\n✅ Concluído.");
  } finally {
    await client.end().catch(() => undefined);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
