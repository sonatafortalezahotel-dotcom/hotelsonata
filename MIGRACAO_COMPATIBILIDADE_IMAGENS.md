# 🔄 Sistema de Compatibilidade - Imagens Antigas e Novas

## 📋 Como Funciona a Compatibilidade

O sistema foi projetado para funcionar **perfeitamente** com imagens já cadastradas usando o sistema antigo (`category`). Não é necessário migrar nada imediatamente!

---

## ✅ O Que Está Funcionando

### 1. **API Compatível**

A API `/api/gallery` aceita **ambos os sistemas**:

```typescript
// Sistema antigo (continua funcionando)
GET /api/gallery?category=piscina

// Sistema novo
GET /api/gallery?page=home&section=experiencias-piscina

// Ou ambos juntos (busca em qualquer um)
GET /api/gallery?page=home&category=piscina
```

### 2. **Mapeamento Automático**

Existe um mapeamento que relaciona categorias antigas com páginas/seções novas:

| Categoria Antiga | Página Nova | Seções Sugeridas |
|-----------------|-------------|------------------|
| `piscina` | `home` | experiencias-piscina, galeria-momentos |
| `gastronomia` | `home` | experiencias-gastronomia |
| `restaurante` | `gastronomia` | hero-gastronomia, card-restaurante |
| `cafe` | `gastronomia` | card-cafe-manha, galeria-cafe |
| `quarto` | `home` | experiencias-quartos |
| `recepcao` | `home` | experiencias-quartos |
| `spa` | `lazer` | galeria-spa, cards-atividades |
| `academia` | `lazer` | galeria-academia |
| `lazer` | `lazer` | galeria-atividades |
| `esporte` | `lazer` | galeria-atividades |
| `sustentabilidade` | `esg` | galeria-praticas |
| `geral` | `home` | galeria-momentos, localizacao-pontos |
| `localizacao` | `home` | localizacao-pontos |

### 3. **Frontend Funciona com Ambos**

As páginas frontend continuam funcionando normalmente:

- **Código antigo** que busca por `category` continua funcionando
- **Novo código** pode buscar por `page/section`
- **Sistema híbrido** funciona - busca primeiro pelo novo, se não encontrar, busca pelo antigo

---

## 🔍 Como o Sistema Decide Qual Usar

### Ordem de Prioridade na Busca:

1. **Sistema Novo (page + section)**: Se você busca por página e seção específica
2. **Apenas Página**: Se você busca apenas por página
3. **Sistema Antigo (category)**: Se não encontrar pelo sistema novo, busca pela categoria

### Exemplo Prático:

```typescript
// Frontend busca imagens para a seção "experiencias-piscina" da home
const images = await fetch("/api/gallery?page=home&section=experiencias-piscina");

// Se não encontrar imagens com page/section, o sistema pode usar:
// - Imagens com category="piscina" 
// - Mapeamento automático faz a correspondência
```

---

## 📝 Migração Gradual (Opcional)

### Você NÃO precisa migrar agora, mas pode quando quiser:

1. **Acesse `/admin/images`**
2. **Escolha a página** (ex: Home)
3. **Selecione a seção** (ex: Experiências - Piscina)
4. **Edite as imagens antigas** e adicione `page` e `section`
5. Ou simplesmente **cadastre novas imagens** já com o novo sistema

### Sugestão Automática:

No admin, quando você editar uma imagem antiga (que só tem `category`), o sistema sugere automaticamente qual `page` e `section` usar baseado no mapeamento.

---

## 🎯 Exemplos de Uso

### Código Antigo (continua funcionando):
```typescript
// Hook antigo - continua funcionando
const { photos } = useGallery("piscina", 10);

// Função antiga - continua funcionando
const photos = await getGallery("piscina", 10);
```

### Código Novo:
```typescript
// Hook novo
const { photos } = useGallery({ 
  page: "home", 
  section: "experiencias-piscina",
  limit: 10 
});

// Função nova
const photos = await getGallery({ 
  page: "home", 
  section: "experiencias-piscina",
  limit: 10 
});
```

### Sistema Híbrido (busca com fallback):
```typescript
import { getImagesForSection } from "@/lib/utils/gallery-helpers";

// Tenta novo sistema primeiro, se não encontrar usa categoria antiga
const images = await getImagesForSection(
  "home",
  "experiencias-piscina",
  "piscina", // fallback
  10
);
```

---

## 🔧 Arquivos Criados

1. **`lib/utils/gallery-mapper.ts`**: 
   - Mapeamento de categorias para páginas/seções
   - Funções de busca com fallback

2. **`lib/utils/gallery-helpers.ts`**:
   - Helpers para trabalhar com ambos os sistemas
   - Funções de filtragem e organização

3. **`lib/hooks/useGallery.ts`** (atualizado):
   - Suporta ambos os sistemas
   - Mantém compatibilidade com código antigo

---

## ✅ Garantias

✅ **Imagens antigas continuam funcionando**  
✅ **Frontend não quebra**  
✅ **Não precisa migrar nada agora**  
✅ **Pode migrar gradualmente quando quiser**  
✅ **Sistema sugere automaticamente page/section para imagens antigas**

---

## 🚀 Próximos Passos (Opcional)

1. **Deixe como está**: Tudo funciona normalmente
2. **Migre gradualmente**: Quando editar uma imagem antiga, adicione page/section
3. **Cadastre novas**: Use sempre o novo sistema para imagens novas

---

**Última atualização:** Janeiro 2025  
**Status:** ✅ Totalmente compatível e funcional

