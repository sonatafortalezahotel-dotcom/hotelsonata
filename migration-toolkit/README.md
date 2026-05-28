# Kit de migração — Neon (Postgres) + Vercel Blob

Pasta reutilizável noutros projectos: copia o conteúdo para o repo alvo, instala dependências, configura variáveis e segue a **ordem** abaixo.

**Requisitos gerais:** Node 18+, `npm`, projecto com TypeScript/Next se usares a parte de frontend do Blob private.

---

## 1. Ordem recomendada (checklist)

| # | Passo | Comando / ação |
|---|--------|----------------|
| 1 | Criar **Neon novo** e **Vercel Blob** novo; obter connection strings (unpooled) e tokens | Painéis Neon + Vercel |
| 2 | Preencher **`.env.migrate.local`** (nunca commitar; ver `env.migrate.example`) | Ficheiro local + `.gitignore` |
| 3 | **Copiar base** antiga → nova | `npm run migrate:neon-dump` (precisa `pg_dump` / `pg_restore` no PATH) |
| 4 | **Copiar ficheiros** Blob | `npm run migrate:blob-copy` |
| 5 | Obter origens URL para o replace | `npm run migrate:blob-origins` e colar `BLOB_PUBLIC_ORIGIN_*` |
| 6 | **Trocar URLs** no Postgres (no Neon novo) | `DRY_RUN=1` depois sem DRY: `npm run migrate:blob-urls-db` |
| 7 | **App / Vercel:** `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN` (loja **nova**), redeploy | |
| 8 | Se a loja for **private** e o browser fizer **403** às imagens | Ver pasta `nextjs-blob-private/` e integrar `lib` + `app/api` |

---

## 2. Integrar noutro repositório

1. Copia a pasta `migration-toolkit/scripts/` para o teu `scripts/` (ou mantém `migration-toolkit/scripts` e ajusta os `npm` scripts em package.json).
2. Instala:
   - `dotenv` `tsx` (já comuns)
   - `@vercel/blob` (>= 2.3 se usares `access: 'private'`)
   - `pg` + `@types/pg` (dev)
3. Junta as entradas de `package-json-scripts.txt` ao `package.json` do projecto.
4. Adiciona a `.gitignore` (mínimo):
   ```
   .env.migrate.local
   ```
5. Ajusta **`replace-blob-urls-in-db.ts`**: o array `columns` é **específico do schema** (tabelas com URLs do Blob). Edita para o teu Drizzle/Prisma/SQL.
6. No **Windows:** instala PostgreSQL (só precisas de `pg_dump` / `pg_restore`) se fores usar `migrate:neon-dump`, ou corre o dump/restore a partir de WSL/Linux com as mesmas variáveis.

---

## 3. Variáveis de ambiente (`.env.migrate.local`)

Resumo; detalhe em `env.migrate.example`.

| Variável | Uso |
|----------|-----|
| `MIGRATE_NEON_SOURCE_URL` | Neon **antigo** (unpooled) |
| `MIGRATE_NEON_TARGET_URL` | Opcional; se vazio usam-se `DATABASE_URL_UNPOOLED` / `DATABASE_URL` |
| `DATABASE_URL` / `DATABASE_URL_UNPOOLED` | Neon **novo** |
| `OLD_BLOB_READ_WRITE_TOKEN` / `NEW_BLOB_READ_WRITE_TOKEN` | Lojas Blob |
| `BLOB_MIGRATE_PUT_ACCESS` | `public` ou `private` (deve bater com o tipo da loja destino) |
| `BLOB_PUBLIC_ORIGIN_OLD` / `BLOB_PUBLIC_ORIGIN_NEW` | Origem do URL (até `…vercel-storage.com`, sem barra no fim) — também para host **private** |
| `MIGRATE_NEON_CLEAN=1` | Só se precisares de `pg_restore --clean` no destino (apaga conflitos) |
| `DRY_RUN=1` | Só contagens no replace de URLs |

`load-migrate-env.ts` carrega `.env.local` e depois **sobrescreve** com `.env.migrate.local`.

---

## 4. Problemas frequentes

- **`api.neon.tech` / fetch failed (Neon serverless no Node):** o `replace-blob-urls-in-db` usa `pg` por TCP com `DATABASE_URL_UNPOOLED` para evitar isso.
- **DNS** não resolve `api.neon.tech` mas resolve `ep-…neon.tech`: o caminho com `pg` continua a funcionar.
- **Blob private + `put` com public:** erro “Cannot use public access on a private store” → `BLOB_MIGRATE_PUT_ACCESS=private` ou loja pública.
- **Imagens 403 com `.private.blob`:** o browser não acede; usa o kit em `nextjs-blob-private/`.
- **Pooler e `pg_dump`:** preferir **unpooled** na origem/destino no dump.

---

## 5. Ficheiros nesta pasta

| Caminho | Descrição |
|---------|-----------|
| `scripts/*.ts` | Scripts de migração (cópia fiel do fluxo usado no Hotel) |
| `env.migrate.example` | Modelo de variáveis (sem segredos reais) |
| `package-json-scripts.txt` | Snippet para colar no `package.json` |
| `nextjs-blob-private/` | Proxy + `toClientBlobUrl` + wrapper Image para Blob private |
| `ORDEM-CHECKLIST.md` | Checklist mínima em 1 página |

A cópia em `scripts/` no Hotel continua a ser a usada no dia a dia; **este toolkit** é a versão “para levar a outros projectos”.
