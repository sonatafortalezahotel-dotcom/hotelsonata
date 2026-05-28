/**
 * Lê uma amostra de cada loja Vercel Blob (list limit 1) e imprime as origens públicas
 * para colar em BLOB_PUBLIC_ORIGIN_OLD / BLOB_PUBLIC_ORIGIN_NEW.
 *
 * Variáveis: OLD_BLOB_READ_WRITE_TOKEN e NEW_BLOB_READ_WRITE_TOKEN
 * (em .env.migrate.local ou .env.local — carrega os dois ficheiros nesta ordem.)
 *
 * Uso: npm run migrate:blob-origins
 */
import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";
import { list } from "@vercel/blob";

const migratePath = resolve(process.cwd(), ".env.migrate.local");
const localPath = resolve(process.cwd(), ".env.local");
if (existsSync(migratePath)) config({ path: migratePath });
if (existsSync(localPath)) config({ path: localPath });

const oldToken = process.env.OLD_BLOB_READ_WRITE_TOKEN;
const newToken =
  process.env.NEW_BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN;

function originFromUrl(url: string): string {
  return new URL(url).origin;
}

async function sampleOrigin(
  token: string | undefined,
  label: string,
  hint: string
): Promise<string | null> {
  if (!token) {
    console.error(`❌ Falta token (${label}). ${hint}`);
    return null;
  }
  const { blobs } = await list({ token, limit: 1 });
  if (blobs.length === 0) {
    return null;
  }
  return originFromUrl(blobs[0].url);
}

async function main() {
  const oldOrigin = await sampleOrigin(
    oldToken,
    "antigo",
    "Defina OLD_BLOB_READ_WRITE_TOKEN (ou crie .env.migrate.local)."
  );
  const newOrigin = await sampleOrigin(
    newToken,
    "novo",
    "Defina NEW_BLOB_READ_WRITE_TOKEN ou BLOB_READ_WRITE_TOKEN no .env.local."
  );

  console.log("");
  if (oldOrigin) {
    console.log(`BLOB_PUBLIC_ORIGIN_OLD=${oldOrigin}`);
  } else {
    console.log(
      "# BLOB_PUBLIC_ORIGIN_OLD: loja antiga sem blobs (list vazio). Use uma URL de imagem do site ou do admin e copie até .public.blob.vercel-storage.com"
    );
  }

  if (newOrigin) {
    console.log(`BLOB_PUBLIC_ORIGIN_NEW=${newOrigin}`);
  } else {
    console.log(
      "# BLOB_PUBLIC_ORIGIN_NEW: loja nova ainda vazia. Faça um upload de teste ou rode migrate:blob-copy e volte a executar este script."
    );
  }
  console.log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
