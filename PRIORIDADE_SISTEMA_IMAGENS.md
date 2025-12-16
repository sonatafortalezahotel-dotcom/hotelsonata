# 🎯 Prioridade entre Sistemas: Novo vs Antigo

## 📋 Regra de Prioridade

**Sistema Novo (`page` + `section`) SEMPRE tem prioridade sobre Sistema Antigo (`category`)**

---

## 🔍 Como Funciona

### Cenário 1: Imagem com AMBOS cadastrados

**Exemplo:** Uma imagem tem:
- `category = "piscina"` (sistema antigo)
- `page = "home"` (sistema novo)
- `section = "experiencias-piscina"` (sistema novo)

**O que acontece:**

1. **Busca por `page/section`** → ✅ Retorna a imagem
   - `/api/gallery?page=home&section=experiencias-piscina`
   - **Resultado:** Imagem encontrada (usa sistema novo)

2. **Busca por `category`** → ❌ NÃO retorna a imagem
   - `/api/gallery?category=piscina`
   - **Resultado:** Imagem NÃO encontrada (porque tem page/section, então usa sistema novo apenas)
   - **Nota:** A imagem só seria retornada se NÃO tivesse `page` ou `section` preenchidos

3. **Busca sem filtros** → ✅ Retorna a imagem
   - `/api/gallery`
   - **Resultado:** Imagem encontrada (se estiver ativa)

---

## 📊 Tabela de Prioridades

| Situação | Busca por | Resultado |
|----------|-----------|-----------|
| Imagem tem `page/section` | `?page=home&section=hero` | ✅ Retorna se corresponder |
| Imagem tem `page/section` | `?category=piscina` | ❌ NÃO retorna (prioridade do sistema novo) |
| Imagem tem `page/section` | `?page=home` (sem section) | ✅ Retorna todas da página |
| Imagem tem APENAS `category` | `?category=piscina` | ✅ Retorna (compatibilidade) |
| Imagem tem APENAS `category` | `?page=home` | ❌ NÃO retorna |
| Imagem tem AMBOS | `?page=home` | ✅ Retorna (sistema novo tem prioridade) |
| Imagem tem AMBOS | `?category=piscina` | ❌ NÃO retorna (ignora category quando tem page/section) |

---

## 🔧 Lógica da API

### Prioridade na Busca:

1. **Se `page` ou `section` forem fornecidos:**
   - ✅ Usa **SISTEMA NOVO** (page/section)
   - ❌ **IGNORA** `category` completamente
   - Busca apenas imagens com `page/section` correspondentes

2. **Se apenas `category` for fornecido:**
   - ✅ Usa **SISTEMA ANTIGO** (category)
   - Retorna imagens com `category` correspondente
   - **Nota:** Retorna apenas imagens que NÃO têm `page/section` preenchidos (ou seja, só imagens antigas)

3. **Se nenhum filtro for fornecido:**
   - ✅ Retorna todas as imagens ativas
   - Tanto do sistema novo quanto antigo

---

## 💡 Recomendação

### Para Migração:

1. **Imagens antigas** (só têm `category`):
   - Continuam funcionando normalmente
   - Aparecem quando busca por `category`

2. **Imagens migradas** (têm `page/section`):
   - Passam a usar o sistema novo
   - `category` vira apenas referência histórica
   - Não aparecem mais em buscas por `category`

3. **Melhor prática:**
   - Ao migrar uma imagem, mantenha `category` preenchido para referência
   - Mas entenda que a busca sempre prioriza `page/section`

---

## 📝 Exemplos Práticos

### Exemplo 1: Busca na Homepage

```typescript
// Frontend busca imagens para seção "experiencias-piscina"
const images = await fetch('/api/gallery?page=home&section=experiencias-piscina');

// Retorna:
// ✅ Imagens com page="home" E section="experiencias-piscina"
// ❌ NÃO retorna imagens apenas com category="piscina"
```

### Exemplo 2: Compatibilidade com Código Antigo

```typescript
// Código antigo busca por categoria
const images = await fetch('/api/gallery?category=piscina');

// Retorna:
// ✅ Apenas imagens com category="piscina" E que NÃO têm page/section
// ❌ NÃO retorna imagens que já foram migradas (têm page/section)
```

### Exemplo 3: Busca Híbrida (Helper Function)

```typescript
// Usando a função helper que faz fallback inteligente
import { fetchGalleryWithFallback } from '@/lib/utils/gallery-mapper';

const images = await fetchGalleryWithFallback(
  'home',           // page
  'experiencias-piscina',  // section
  'piscina',        // fallback category
  10                // limit
);

// Lógica:
// 1. Tenta buscar por page/section (sistema novo)
// 2. Se não encontrar, tenta por category (sistema antigo)
// 3. Retorna o que encontrar
```

---

## ⚠️ Importante

1. **Uma vez migrada, a imagem usa apenas o sistema novo**
   - Se adicionar `page/section` a uma imagem antiga, ela para de aparecer em buscas por `category`

2. **Não há conflito se ambos estiverem preenchidos**
   - O sistema novo sempre ganha
   - `category` vira apenas metadado/referência

3. **Para garantir compatibilidade total:**
   - Use as funções helper em `lib/utils/gallery-mapper.ts`
   - Elas fazem fallback automático entre sistemas

---

**Última atualização:** Janeiro 2025  
**Regra:** Sistema Novo (page/section) sempre tem prioridade sobre Sistema Antigo (category)

