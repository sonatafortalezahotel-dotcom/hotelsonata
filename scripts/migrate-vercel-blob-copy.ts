/**
 * Copia todos os blobs da loja antiga (OLD_BLOB_READ_WRITE_TOKEN) para a nova (NEW_*),
 * mantendo o mesmo pathname (URLs públicas passam a apontar para o novo store após
 * atualizar o banco com scripts/replace-blob-urls-in-db.ts).
 *
 * Uso: npm run migrate:blob-copy
 */
import { list, put } from "@vercel/blob";
import { loadMigrateEnv } from "./load-migrate-env";

loadMigrateEnv();

const oldToken = process.env.OLD_BLOB_READ_WRITE_TOKEN;
const newToken =
  process.env.NEW_BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN;
const listPrefix = process.env.OLD_BLOB_LIST_PREFIX ?? "";

const putAccessRaw = (process.env.BLOB_MIGRATE_PUT_ACCESS ?? "public").toLowerCase();
const putAccess = putAccessRaw === "private" ? ("private" as const) : ("public" as const);

if (!oldToken || !newToken) {
  console.error(
    "❌ Defina OLD_BLOB_READ_WRITE_TOKEN e NEW_BLOB_READ_WRITE_TOKEN (ou BLOB_READ_WRITE_TOKEN) em .env.migrate.local"
  );
  process.exit(1);
}

async function main() {
  if (putAccess === "private") {
    console.log(
      "ℹ️  BLOB_MIGRATE_PUT_ACCESS=private — URLs serão .private.blob…; o site atual (img diretas) precisa de loja public ou de rotas com get().\n"
    );
  }

  let cursor: string | undefined;
  let total = 0;
  let copied = 0;
  let failed = 0;

  do {
    const { blobs, hasMore, cursor: nextCursor } = await list({
      token: oldToken,
      cursor,
      prefix: listPrefix || undefined,
      limit: 500,
    });

    for (const blob of blobs) {
      total++;
      const pathname = blob.pathname;
      try {
        const res = await fetch(blob.url);
        if (!res.ok) {
          throw new Error(`fetch ${res.status}`);
        }
        const buf = Buffer.from(await res.arrayBuffer());
        const contentType = res.headers.get("content-type") ?? "application/octet-stream";

        await put(pathname, buf, {
          access: putAccess,
          token: newToken,
          contentType,
          allowOverwrite: true,
        });
        copied++;
        if (copied % 25 === 0) {
          console.log(`… ${copied} copiados (último: ${pathname})`);
        }
      } catch (e) {
        failed++;
        console.error(`✗ ${pathname}:`, e instanceof Error ? e.message : e);
      }
    }

    cursor = hasMore ? nextCursor : undefined;
  } while (cursor);

  console.log(`\n✅ Listagem: ${total} objetos | copiados: ${copied} | falhas: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
