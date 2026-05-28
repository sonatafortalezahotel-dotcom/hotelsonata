# Next.js: Blob *private* no browser (sem 403)

O cliente não autenticado com o token; URLs `*.private.blob.vercel-storage.com` dão 403. Integração mínima:

1. **Copia** `blobUrl.ts` e `blobAwareImageLoader.ts` para `lib/` (junto com o teu `tsconfig` paths, ex. `@/lib/...`).
2. **Copia** `app-image.tsx` para `lib/app-image.tsx` (ou ajusta imports se usares outro caminho).
3. **Cria** `app/api/blob-proxy/[[...segments]]/route.ts` a partir de `route.ts` nesta pasta.
4. **Env (Vercel + local):** `BLOB_READ_WRITE_TOKEN` = token de leitura/escrita da loja **onde estão** os ficheiros.
5. **`next.config`:** com `images.loader: "custom"`, usa `<AppImage ... />` em vez de `<Image />` para imagens do Blob, ou passa o `loader` em cada `Image` como no wrapper.

A lógica: `toClientBlobUrl()` reescreve hosts private → `/api/blob-proxy/...`; a rota chama `get(pathname, { access: "private" })` no servidor.
