-- Script de migração para adicionar campos page, section e description à tabela gallery
-- Execute este script no seu banco de dados PostgreSQL

-- Adicionar colunas se não existirem
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS page VARCHAR(50),
ADD COLUMN IF NOT EXISTS section VARCHAR(100),
ADD COLUMN IF NOT EXISTS description TEXT;

-- Criar índices para melhor performance nas buscas
CREATE INDEX IF NOT EXISTS idx_gallery_page ON gallery(page);
CREATE INDEX IF NOT EXISTS idx_gallery_section ON gallery(section);
CREATE INDEX IF NOT EXISTS idx_gallery_page_section ON gallery(page, section);
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery(active);

-- Comentários nas colunas para documentação
COMMENT ON COLUMN gallery.page IS 'Página onde a imagem aparece: home, lazer, gastronomia, esg, contato';
COMMENT ON COLUMN gallery.section IS 'Seção específica dentro da página (ex: hero-carousel, galeria-piscina)';
COMMENT ON COLUMN gallery.description IS 'Descrição opcional da imagem';
COMMENT ON COLUMN gallery.category IS 'Categoria antiga (mantida para compatibilidade): piscina, recepcao, restaurante, quarto, geral, etc.';

-- Verificar se as colunas foram criadas
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'gallery'
AND column_name IN ('page', 'section', 'description')
ORDER BY column_name;

