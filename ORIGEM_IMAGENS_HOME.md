# 📸 Origem das Imagens da Home

## 🎯 Resumo

As imagens da home vêm **diretamente das tabelas principais** do banco de dados, **não das tabelas de traduções**. As tabelas de traduções contêm apenas textos (title, description).

---

## 📋 Detalhamento por Seção

### 1. **Hero/Carrossel Principal (Highlights)**
- **Fonte**: Tabela `highlights`
- **Campo**: `highlights.imageUrl`
- **API**: `GET /api/highlights`
- **Onde**: Linha 189 - `VideoCarousel highlights={highlights}`

```typescript
// Busca direta da tabela highlights
const highlights = await fetch('/api/highlights');
// Retorna: { id, title, description, imageUrl, videoUrl, ... }
```

---

### 2. **Pacotes Promocionais (PackagesSection)**
- **Fonte**: Tabela `packages`
- **Campo**: `packages.imageUrl`
- **API**: `GET /api/packages`
- **Onde**: Linha 203 - `PackagesSection packages={packages}`

```typescript
// Busca direta da tabela packages
const packages = await fetch('/api/packages');
// Retorna: { id, name, description, imageUrl, ... }
```

---

### 3. **Experiências (ExperienceCard) - 6 Cards**
As imagens vêm da tabela `gallery`, filtradas por categoria:

#### a) **Piscina Vista Mar**
- **Fonte**: Tabela `gallery` (filtro: `category === "piscina"`)
- **Linhas**: 228-232
```typescript
images={galleryPhotos
  .filter(p => p.category === "piscina")
  .slice(0, 4)
  .map(p => p.imageUrl)}
```

#### b) **Gastronomia Regional**
- **Fonte**: Tabela `gallery` (filtro: `category === "gastronomia" || "restaurante"`)
- **Linhas**: 243-247

#### c) **Quartos Confortáveis**
- **Fonte**: Tabela `gallery` (filtro: `category === "quarto" || "recepcao"`)
- **Linhas**: 258-262

#### d) **Spa & Bem-Estar**
- **Fonte**: Tabela `gallery` (filtro: `category === "spa" || "academia"`)
- **Linhas**: 273-277

#### e) **Beach Tennis**
- **Fonte**: Tabela `gallery` (filtro: `category === "lazer" || "esporte"`)
- **Linhas**: 288-292

#### f) **Sustentabilidade**
- **Fonte**: Tabela `gallery` (filtro: `category === "sustentabilidade" || "geral"`)
- **Linhas**: 303-307

---

### 4. **PhotoStory - Um Dia no Hotel**
- **Fonte**: Tabela `gallery` (filtros por categoria específica)
- **Linhas**: 318-372
- Busca fotos específicas por categoria para cada momento do dia

---

### 5. **Galeria - Momentos Inesquecíveis**
- **Fonte**: Tabela `gallery` (primeiras 9 fotos)
- **Linhas**: 388-399
```typescript
images={galleryPhotos
  .slice(0, 9)
  .map(photo => photo.imageUrl)}
```

---

### 6. **Localização - 4 Cards (Praia de Iracema, etc)**
- **Fonte**: Tabela `gallery` (filtro: `category === "geral" || "localizacao"`)
- **Linhas**: 421, 435, 449, 463
- Busca fotos filtradas por categoria ou usa primeiras fotos como fallback

---

### 7. **Sustentabilidade (SustainabilitySection)**
- **Fonte**: Tabela `sustainability`
- **Campo**: `sustainability.imageUrl`
- **API**: `GET /api/sustainability`
- **Linha**: 518

---

### 8. **Certificações (CertificationsSection)**
- **Fonte**: Tabela `certifications`
- **Campo**: `certifications.imageUrl`
- **API**: `GET /api/certifications`
- **Linha**: 521

---

## 🔍 Estrutura do Banco de Dados

### Tabelas Principais (com imagens)
```sql
-- Tabela principal tem imageUrl
highlights {
  id, title, description, imageUrl, videoUrl, ...
}

packages {
  id, name, description, imageUrl, ...
}

gallery {
  id, title, imageUrl, category, ...
}

sustainability {
  id, title, description, imageUrl, ...
}

certifications {
  id, title, description, imageUrl, ...
}
```

### Tabelas de Traduções (sem imagens)
```sql
-- Tabelas de tradução NÃO têm imageUrl
eventTranslations {
  eventId, locale, title, description, facilities
}

gastronomyTranslations {
  gastronomyId, locale, title, description, menu
}

roomTranslations {
  roomId, locale, name, description, amenities
}
```

---

## ⚠️ Importante

**As imagens NÃO mudam por idioma atualmente!**

- ✅ As imagens vêm das tabelas principais (sempre as mesmas)
- ✅ Os textos vêm das tabelas de tradução (mudam por locale)

**Se você quiser imagens diferentes por idioma, seria necessário:**

1. **Opção A**: Criar registros diferentes na tabela principal para cada idioma
   - Ex: Evento "Corporativo PT" com imagem PT
   - Ex: Evento "Corporativo ES" com imagem ES

2. **Opção B**: Adicionar campos `imageUrl` nas tabelas de traduções
   - Ex: `eventTranslations.imageUrl`
   - Ex: `gastronomyTranslations.imageUrl`

---

## 📝 Resumo Final

| Seção | Fonte da Imagem | Tabela | Muda por Idioma? |
|-------|----------------|--------|------------------|
| Hero/Carrossel | `highlights.imageUrl` | `highlights` | ❌ Não |
| Pacotes | `packages.imageUrl` | `packages` | ❌ Não |
| Experiências | `gallery.imageUrl` | `gallery` | ❌ Não |
| PhotoStory | `gallery.imageUrl` | `gallery` | ❌ Não |
| Galeria | `gallery.imageUrl` | `gallery` | ❌ Não |
| Localização | `gallery.imageUrl` | `gallery` | ❌ Não |
| Sustentabilidade | `sustainability.imageUrl` | `sustainability` | ❌ Não |
| Certificações | `certifications.imageUrl` | `certifications` | ❌ Não |

**Todas as imagens são fixas, não dependem do idioma selecionado!**

