-- Aplica alterações na tabela gallery para suportar vídeo (video_url, media_type).
-- Execute este script no seu banco se GET /api/gallery ou GET /api/admin/media retornar 500.
-- Ex.: no Neon Dashboard (SQL Editor) ou: psql $DATABASE_URL -f scripts/migrate-gallery-video.sql

-- Torna image_url opcional (permite itens só com vídeo)
ALTER TABLE "gallery" ALTER COLUMN "image_url" DROP NOT NULL;

-- Adiciona coluna de URL do vídeo (se já existir, o comando falhará e pode ignorar)
ALTER TABLE "gallery" ADD COLUMN IF NOT EXISTS "video_url" text;

-- Adiciona coluna de tipo de mídia (se já existir, o comando falhará e pode ignorar)
ALTER TABLE "gallery" ADD COLUMN IF NOT EXISTS "media_type" varchar(10) DEFAULT 'image' NOT NULL;
