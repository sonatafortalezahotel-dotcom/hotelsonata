# 📸 ANÁLISE: ORGANIZAÇÃO E REPETIÇÃO DE FOTOS

## 🎯 RESUMO EXECUTIVO

**Data:** Janeiro 2025  
**Objetivo:** Analisar a organização das fotos no site e identificar repetições excessivas ou problemas de organização

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### 1. **REPETIÇÕES EXCESSIVAS**

#### Homepage (`app/page.tsx`)
A mesma foto pode aparecer em **múltiplas seções**:

- **Experiências Visuais (6 cards):**
  - Piscina: 4 fotos de `category === "piscina"`
  - Gastronomia: 4 fotos de `category === "gastronomia" || "restaurante"`
  - Quartos: 3 fotos de `category === "quarto" || "recepcao"`
  - Spa: 3 fotos de `category === "spa" || "academia"`
  - Beach Tennis: 2 fotos de `category === "lazer" || "esporte"`
  - Sustentabilidade: 2 fotos de `category === "sustentabilidade" || "geral"`

- **PhotoStory "Um Dia no Hotel" (8 itens):**
  - Usa `find()` para buscar primeira foto de cada categoria
  - **RISCO:** Pode repetir fotos já usadas nos cards acima

- **Galeria "Momentos Inesquecíveis":**
  - Primeiras 9 fotos de `galleryPhotos.slice(0, 9)`
  - **RISCO:** Pode incluir fotos já usadas nas seções anteriores

- **Localização (4 cards):**
  - Usa `category === "geral" || "localizacao"` ou fallback para `galleryPhotos[0-3]`
  - **RISCO:** Pode repetir fotos da galeria principal

**Total estimado de repetições na Home:** 5-8 fotos podem aparecer 2-3 vezes

---

#### Página Quartos (`app/quartos/page.tsx`)

- **Hero:** `rooms[0]?.imageUrl || galleryPhotos.find(p => p.category === "quarto")`
- **Galeria Visual:** 6 fotos de `category === "quarto" || "piscina" || "recepcao"` + 3 fotos de `rooms`
- **PhotoStory:** 4 fotos de `category === "quarto"` com fallback para `rooms`

**Problema:** Fotos de "piscina" e "recepcao" aparecem tanto na Home quanto em Quartos

---

#### Página Gastronomia (`app/gastronomia/page.tsx`)

- **Hero:** `gastronomy.find(g => g.type === "restaurante") || galleryPhotos.find(p => p.category === "restaurante" || "gastronomia")`
- **Cards:** 4-5 fotos de `category === "cafe" || "gastronomia"` ou `category === "restaurante" || "gastronomia"`
- **Galeria de Pratos:** 6 fotos de `category === "cafe" || "gastronomia"`
- **PhotoStory:** 4 fotos de `category === "gastronomia" || "restaurante"` ou `category === "cafe"`

**Problema:** Mesmas categorias usadas na Home (Experiências Visuais e PhotoStory)

---

#### Página Lazer (`app/lazer/page.tsx`)

- **Hero:** `category === "piscina"`
- **Galeria Piscina:** 6 fotos de `category === "piscina"`
- **PhotoStory:** 4 fotos de diferentes categorias
- **Galeria Academia:** 4 fotos de `category === "academia"`
- **Galeria Atividades:** 2 fotos de `category === "esporte"` + 2 de `category === "lazer" || "bikes"`
- **Galeria Spa:** 4 fotos de `category === "spa"`
- **Cards de Atividades:** 5 cards com fotos das mesmas categorias acima

**Problema:** Categorias "piscina", "spa", "esporte", "lazer" já usadas na Home

---

### 2. **CATEGORIAS GENÉRICAS DEMASIADAMENTE USADAS**

A categoria `"geral"` é usada como fallback em **múltiplos lugares**:

- Home: Experiências (Sustentabilidade), Localização (4 cards)
- Quartos: Galeria Visual (fallback)
- Lazer: Localização (fallback)
- Contato: Galeria (fallback)
- Hotel: Vários lugares (fallback)

**Problema:** Fotos marcadas como "geral" podem aparecer em contextos diferentes e confundir o usuário

---

### 3. **FALTA DE SISTEMA DE RASTREAMENTO**

Não há mecanismo para:
- Evitar que a mesma foto apareça em múltiplas seções
- Priorizar fotos não utilizadas
- Garantir diversidade visual entre seções
- Rastrear onde cada foto está sendo usada

---

### 4. **ORDEM NÃO CONSISTENTE**

A ordenação por `order` não é respeitada em todos os lugares:
- Alguns usam `.slice(0, N)` sem ordenar
- Outros usam `.find()` que pega a primeira encontrada
- Falta ordenação consistente antes de filtrar

---

## 📊 MAPEAMENTO DE USO POR CATEGORIA

| Categoria | Home | Quartos | Gastronomia | Lazer | Eventos | ESG | Contato | Hotel |
|-----------|------|---------|-------------|-------|---------|-----|---------|-------|
| `piscina` | ✅ (4) | ✅ (6) | ❌ | ✅ (6+) | ❌ | ❌ | ❌ | ✅ |
| `gastronomia` | ✅ (4) | ❌ | ✅ (6+) | ❌ | ❌ | ❌ | ✅ | ❌ |
| `restaurante` | ✅ (4) | ❌ | ✅ (6+) | ❌ | ❌ | ❌ | ✅ | ❌ |
| `quarto` | ✅ (3) | ✅ (6+) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `recepcao` | ✅ (3) | ✅ (6+) | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| `spa` | ✅ (3) | ❌ | ❌ | ✅ (4+) | ❌ | ❌ | ❌ | ❌ |
| `academia` | ✅ (3) | ❌ | ❌ | ✅ (4+) | ❌ | ❌ | ❌ | ❌ |
| `lazer` | ✅ (2) | ❌ | ❌ | ✅ (2+) | ❌ | ❌ | ❌ | ❌ |
| `esporte` | ✅ (2) | ❌ | ❌ | ✅ (2+) | ❌ | ❌ | ❌ | ❌ |
| `sustentabilidade` | ✅ (2) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `geral` | ✅ (2+) | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `localizacao` | ✅ (4) | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| `cafe` | ✅ (1) | ❌ | ✅ (4+) | ❌ | ❌ | ❌ | ❌ | ❌ |

**Legenda:**
- ✅ = Usado
- (N) = Quantidade aproximada de fotos usadas
- ❌ = Não usado

---

## 💡 SOLUÇÕES PROPOSTAS

### 1. **SISTEMA DE RASTREAMENTO DE FOTOS USADAS**

Criar um hook `usePhotoTracker` que:
- Mantém um Set de IDs de fotos já utilizadas
- Filtra automaticamente fotos já usadas
- Permite resetar o tracker por seção/página

```typescript
// Exemplo de implementação
const usedPhotoIds = new Set<string>();
const getUnusedPhotos = (photos: Photo[], category: string, limit: number) => {
  return photos
    .filter(p => p.category === category && !usedPhotoIds.has(p.id))
    .sort((a, b) => a.order - b.order)
    .slice(0, limit)
    .map(p => {
      usedPhotoIds.add(p.id);
      return p;
    });
};
```

---

### 2. **REORGANIZAÇÃO DE CATEGORIAS**

#### Criar categorias mais específicas:
- `piscina-vista-mar` (específica para hero/destaque)
- `piscina-galeria` (para galerias)
- `gastronomia-pratos` (pratos específicos)
- `gastronomia-ambiente` (ambiente do restaurante)
- `quarto-standard` (quartos padrão)
- `quarto-premium` (quartos premium)
- `localizacao-iracema` (Praia de Iracema)
- `localizacao-pontos-turisticos` (pontos turísticos)

#### Separar categorias por contexto:
- **Hero/Destaque:** Fotos de alta qualidade, específicas
- **Galeria:** Fotos para grids e carrosséis
- **Cards:** Fotos para cards pequenos
- **Background:** Fotos para fundos

---

### 3. **PRIORIZAÇÃO INTELIGENTE**

Criar função que prioriza fotos não utilizadas:

```typescript
function getPrioritizedPhotos(
  photos: Photo[],
  category: string,
  limit: number,
  usedIds: Set<string>
) {
  // 1. Fotos não usadas da categoria específica
  const unused = photos.filter(
    p => p.category === category && !usedIds.has(p.id)
  );
  
  // 2. Se não houver suficientes, usar fotos não usadas de categoria relacionada
  if (unused.length < limit) {
    const related = photos.filter(
      p => getRelatedCategories(category).includes(p.category) && !usedIds.has(p.id)
    );
    unused.push(...related);
  }
  
  // 3. Ordenar por `order` e pegar as primeiras
  return unused
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
}
```

---

### 4. **DOCUMENTAÇÃO DE USO**

Criar arquivo `FOTOS_USO_POR_SECAO.md` que documenta:
- Quais categorias são usadas em cada seção
- Quantas fotos cada seção precisa
- Prioridade de uso (hero > galeria > cards)
- Regras de fallback

---

### 5. **MELHORIAS NO ADMIN**

Adicionar no painel admin:
- **Indicador de uso:** Mostrar onde cada foto está sendo usada
- **Sugestão de categoria:** Baseado no contexto
- **Validação:** Alertar se foto está sendo usada em muitos lugares
- **Estatísticas:** Quantas fotos por categoria, quantas não utilizadas

---

## 🎯 PLANO DE AÇÃO RECOMENDADO

### Fase 1: Análise e Documentação (Imediato)
- [x] ✅ Criar este documento de análise
- [ ] Mapear todas as fotos atuais no banco
- [ ] Identificar fotos duplicadas/sobrepostas
- [ ] Criar documento de uso por seção

### Fase 2: Reorganização de Categorias (Curto Prazo)
- [ ] Criar categorias mais específicas
- [ ] Migrar fotos existentes para novas categorias
- [ ] Atualizar código para usar novas categorias

### Fase 3: Sistema de Rastreamento (Médio Prazo)
- [ ] Criar hook `usePhotoTracker`
- [ ] Implementar em todas as páginas
- [ ] Testar para garantir diversidade visual

### Fase 4: Melhorias no Admin (Longo Prazo)
- [ ] Adicionar indicadores de uso
- [ ] Criar validações
- [ ] Adicionar estatísticas

---

## 📋 CHECKLIST DE VERIFICAÇÃO

Antes de adicionar uma nova foto, verificar:

- [ ] A categoria está correta e específica?
- [ ] A foto não está sendo usada em muitos lugares?
- [ ] A ordem (`order`) está definida corretamente?
- [ ] A foto está ativa (`active = true`)?
- [ ] A resolução é adequada para o uso pretendido?
- [ ] O título/alt text está descritivo?

---

## 🔍 EXEMPLOS DE REPETIÇÕES IDENTIFICADAS

### Exemplo 1: Foto de Piscina
**Cenário:** Foto com `category === "piscina"` e `order === 1`

**Onde aparece:**
1. Home - Experiências Visuais (Card Piscina) - 1ª foto
2. Home - PhotoStory (Nascer do sol) - `find(p => p.category === "piscina")`
3. Lazer - Hero - `find(p => p.category === "piscina")`
4. Lazer - Galeria Piscina - 1ª foto

**Resultado:** Mesma foto aparece 4 vezes em contextos diferentes

---

### Exemplo 2: Foto "Geral"
**Cenário:** Foto com `category === "geral"` e `order === 0`

**Onde aparece:**
1. Home - Experiências (Sustentabilidade) - fallback
2. Home - Localização (Card 1) - fallback
3. Quartos - Galeria Visual - fallback
4. Lazer - Localização - fallback
5. Contato - Hero - fallback

**Resultado:** Foto genérica aparece em 5+ lugares diferentes

---

## ✅ RECOMENDAÇÕES FINAIS

1. **Imediato:** Revisar e reorganizar categorias das fotos existentes
2. **Curto Prazo:** Implementar sistema de rastreamento básico
3. **Médio Prazo:** Criar categorias mais específicas
4. **Longo Prazo:** Melhorar admin com indicadores de uso

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0  
**Autor:** Análise Automatizada

