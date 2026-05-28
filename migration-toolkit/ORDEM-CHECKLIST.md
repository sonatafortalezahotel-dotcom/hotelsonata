# Checklist — migração Neon + Vercel Blob

- [ ] Criar `.env.migrate.local` a partir de `env.migrate.example` (não commitar).
- [ ] `pg_dump` e `pg_restore` disponíveis (ou migrar a base por outro meio).
- [ ] `npm run migrate:neon-dump`
- [ ] `npm run migrate:blob-copy`
- [ ] `npm run migrate:blob-origins` → preencher `BLOB_PUBLIC_ORIGIN_OLD/NEW` no env.
- [ ] `DRY_RUN=1 npm run migrate:blob-urls-db` (ajustar lista `columns` no script ao teu schema).
- [ ] `npm run migrate:blob-urls-db` (aplicar updates).
- [ ] Atualizar app: `DATABASE_URL` + `BLOB_READ_WRITE_TOKEN` (loja nova), deploy.
- [ ] Se Blob **private** e 403 no browser: integrar `nextjs-blob-private/`.
