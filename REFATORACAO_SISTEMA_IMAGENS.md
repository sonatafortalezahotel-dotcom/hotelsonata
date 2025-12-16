# 🎨 REFATORAÇÃO: Sistema de Cadastro de Imagens por Página

## 📋 Resumo da Mudança

O sistema de cadastro de imagens foi completamente refatorado para ser **organizado por página** em vez de categorias genéricas. Isso torna muito mais claro onde cada imagem aparece no site.

---

## ✅ O Que Foi Feito

### 1. **Atualização do Schema do Banco de Dados**

A tabela `gallery` agora possui os seguintes campos adicionais:

- `page` (varchar) - Página onde a imagem aparece: "home", "lazer", "gastronomia", "esg", "contato"
- `section` (varchar) - Seção específica dentro da página (ex: "hero-carousel", "galeria-piscina")
- `description` (text) - Descrição opcional da imagem

**Compatibilidade:** Os campos antigos (`category`) foram mantidos para não quebrar o sistema existente.

### 2. **Nova Interface Admin**

Criado novo sistema de administração em `/admin/images` com:

- **Página Principal** (`/admin/images`): Lista todas as páginas disponíveis
- **Páginas Específicas** (`/admin/images/[page]`): Gerenciamento de imagens por página
- **Organização por Seções**: Cada página possui abas para suas seções específicas
- **Descrições Claras**: Para cada seção, há uma explicação de onde a imagem aparece

### 3. **Constantes de Seções**

Arquivo `lib/constants/page-sections.ts` define todas as seções disponíveis para cada página:

- **Home**: 10 seções (Hero, Experiências Visuais, Photo Story, Galeria, Localização, etc.)
- **Lazer**: 8 seções (Hero, Galeria Piscina, Academia, Spa, Atividades, etc.)
- **Gastronomia**: 6 seções (Hero, Cards, Galerias, Photo Story, etc.)
- **ESG**: 4 seções (Hero, Galeria, Photo Story, Ações Sociais)
- **Contato**: 3 seções (Hero, Equipe, Localização)

### 4. **API Atualizada**

A API `/api/gallery` agora suporta filtros por:

- `page` - Filtrar por página
- `section` - Filtrar por seção
- `category` - Mantido para compatibilidade

---

## 🚀 Como Usar o Novo Sistema

### Passo 1: Executar Migração do Banco

Execute este SQL no banco de dados para adicionar os novos campos:

```sql
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS page VARCHAR(50),
ADD COLUMN IF NOT EXISTS section VARCHAR(100),
ADD COLUMN IF NOT EXISTS description TEXT;
```

Ou use o comando do Drizzle:

```bash
npm run db:push
```

### Passo 2: Acessar o Novo Admin

1. Acesse `/admin/images`
2. Escolha a página que deseja gerenciar
3. Selecione a seção na aba correspondente
4. Clique em "Nova Imagem" para adicionar

### Passo 3: Cadastrar Imagens

Ao cadastrar uma imagem:

1. **Selecione a Seção**: Escolha onde a imagem vai aparecer
2. **Veja a Descrição**: Leia onde a imagem será exibida no site
3. **Informe Quantidade Recomendada**: Cada seção mostra quantas imagens são recomendadas
4. **Adicione Título e Descrição**: Ajuda na organização
5. **Defina a Ordem**: Imagens com ordem menor aparecem primeiro

---

## 📊 Organização por Página

### Home / Hotel

- **Hero Carousel**: Carrossel principal (5 imagens)
- **Experiências - Piscina**: Card de piscina (4 imagens)
- **Experiências - Gastronomia**: Card de gastronomia (4 imagens)
- **Experiências - Quartos**: Card de quartos (3 imagens)
- **Experiências - Spa**: Card de spa (3 imagens)
- **Experiências - Beach Tennis**: Card de beach tennis (2 imagens)
- **Experiências - Sustentabilidade**: Card de sustentabilidade (2 imagens)
- **Photo Story**: Timeline "Um Dia no Hotel" (8 imagens)
- **Galeria Momentos**: Grid de momentos inesquecíveis (9 imagens)
- **Localização**: Pontos turísticos próximos (4 imagens)

### Lazer

- **Hero**: Imagem principal do topo (1 imagem)
- **Galeria Piscina**: Grid da piscina (6 imagens)
- **Photo Story**: Atividades do dia (4 imagens)
- **Galeria Academia**: Grid da academia (4 imagens)
- **Galeria Atividades**: Atividades ao ar livre (4 imagens)
- **Galeria Spa**: Grid do spa (4 imagens)
- **Cards Atividades**: Cards informativos (15 imagens)
- **Localização**: Imagem de contexto (1 imagem)

### Gastronomia

- **Hero**: Imagem principal (1 imagem)
- **Card Café da Manhã**: Carrossel do card (4 imagens)
- **Card Restaurante**: Carrossel do card (5 imagens)
- **Galeria Café**: Grid do café (6 imagens)
- **Photo Story**: Experiência gastronômica (4 imagens)
- **Galeria Restaurante**: Grid do restaurante (6 imagens)

### ESG

- **Hero**: Imagem principal (1 imagem)
- **Galeria Práticas**: Práticas sustentáveis (6 imagens)
- **Photo Story**: Impacto social e ambiental (4 imagens)
- **Ações Sociais**: Imagem destaque (1 imagem)

### Contato

- **Hero**: Imagem principal (1 imagem)
- **Galeria Equipe**: Cards da equipe (3 imagens)
- **Galeria Localização**: Como chegar (4 imagens)

---

## 🔄 Compatibilidade com Sistema Antigo

O sistema antigo usando `category` continua funcionando. As imagens antigas podem ser migradas gradualmente para o novo sistema:

- Imagens com `category` continuam sendo exibidas normalmente
- Ao editar uma imagem antiga, você pode adicionar `page` e `section`
- A API aceita ambos os sistemas

---

## 📝 Próximos Passos

### Para Migrar Imagens Existentes

1. Acesse `/admin/images`
2. Para cada página, organize as imagens existentes nas seções corretas
3. Adicione `page` e `section` às imagens antigas ao editá-las

### Para Atualizar Frontend (Futuro)

As páginas frontend podem ser atualizadas para buscar imagens por página e seção:

```typescript
// Exemplo: Buscar imagens do hero da home
const heroImages = await fetch('/api/gallery?page=home&section=hero-carousel');
```

---

## 🎯 Benefícios do Novo Sistema

1. **Clareza**: Você sabe exatamente onde cada imagem aparece
2. **Organização**: Imagens agrupadas por página e seção
3. **Facilidade**: Interface intuitiva com abas por seção
4. **Profissionalismo**: Sistema estruturado e bem documentado
5. **Flexibilidade**: Fácil adicionar novas seções ou páginas

---

## ⚠️ Notas Importantes

- **Quartos e Eventos**: Essas páginas têm sistemas próprios de cadastro e não estão incluídas neste novo sistema
- **Imagens Antigas**: Continuam funcionando, mas recomenda-se migrá-las gradualmente
- **Ordem**: Use o campo `order` para controlar a ordem de exibição dentro de cada seção

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0

