# 📸 GUIA DE USO DE FOTOS POR SEÇÃO

## 🎯 OBJETIVO

Este documento define **exatamente** quais categorias de fotos devem ser usadas em cada seção do site, evitando repetições e garantindo organização.

---

## 📋 REGRAS GERAIS

1. **Prioridade de Uso:**
   - Hero/Destaque: Fotos de alta qualidade, específicas
   - Galeria: Fotos para grids e carrosséis
   - Cards: Fotos para cards pequenos
   - Fallback: Apenas quando não houver fotos específicas

2. **Evitar Repetições:**
   - Cada foto deve aparecer no máximo 1 vez por página
   - Usar sistema de rastreamento (`usePhotoTracker`)
   - Priorizar fotos não utilizadas

3. **Ordenação:**
   - Sempre ordenar por `order` (menor primeiro)
   - Depois por `id` se `order` for igual

---

## 🏠 HOMEPAGE (`app/page.tsx`)

### 1. Hero/Carrossel Principal
- **Fonte:** `highlights` (tabela)
- **Categoria:** Não aplicável (vem de highlights)
- **Quantidade:** Todas as highlights ativas
- **Prioridade:** Alta (primeira coisa que o usuário vê)

### 2. Experiências Visuais (6 Cards)

#### Card: Piscina Vista Mar
- **Categoria:** `piscina`
- **Quantidade:** 4 fotos
- **Prioridade:** Média-Alta
- **Fallback:** Não usar fallback (deve ter fotos específicas)

#### Card: Gastronomia Regional
- **Categoria:** `gastronomia` OU `restaurante`
- **Quantidade:** 4 fotos
- **Prioridade:** Média-Alta
- **Fallback:** Não usar fallback

#### Card: Quartos Confortáveis
- **Categoria:** `quarto` OU `recepcao`
- **Quantidade:** 3 fotos
- **Prioridade:** Média-Alta
- **Fallback:** Não usar fallback

#### Card: Spa & Bem-Estar
- **Categoria:** `spa` OU `academia`
- **Quantidade:** 3 fotos
- **Prioridade:** Média-Alta
- **Fallback:** Não usar fallback

#### Card: Beach Tennis
- **Categoria:** `lazer` OU `esporte`
- **Quantidade:** 2 fotos
- **Prioridade:** Média
- **Fallback:** Não usar fallback

#### Card: Sustentabilidade
- **Categoria:** `sustentabilidade` (preferencial) OU `geral` (apenas se necessário)
- **Quantidade:** 2 fotos
- **Prioridade:** Média
- **Fallback:** `geral` (apenas se não houver `sustentabilidade`)

### 3. PhotoStory "Um Dia no Hotel" (8 itens)

**IMPORTANTE:** Usar fotos DIFERENTES das usadas nos cards acima!

#### Item 1: Nascer do Sol
- **Categoria:** `piscina` (2ª foto, não a 1ª)
- **Prioridade:** Média

#### Item 2: Café da Manhã
- **Categoria:** `gastronomia` OU `cafe` (diferente das usadas no card)
- **Prioridade:** Média

#### Item 3: Passeio de Bike
- **Categoria:** `lazer` (diferente das usadas no card Beach Tennis)
- **Prioridade:** Média

#### Item 4: Beach Tennis
- **Categoria:** `esporte` (diferente das usadas no card)
- **Prioridade:** Média

#### Item 5: Almoço
- **Categoria:** `restaurante` OU `gastronomia` (diferente das usadas no card)
- **Prioridade:** Média

#### Item 6: Spa
- **Categoria:** `spa` (diferente das usadas no card)
- **Prioridade:** Média

#### Item 7: Tarde na Piscina
- **Categoria:** `piscina` (3ª foto)
- **Prioridade:** Média

#### Item 8: Pôr do Sol
- **Categoria:** `piscina` (4ª foto)
- **Prioridade:** Média

### 4. Galeria "Momentos Inesquecíveis"
- **Categoria:** TODAS (mas priorizar não utilizadas)
- **Quantidade:** 9 fotos
- **Prioridade:** Baixa-Média
- **Regra:** Usar fotos que NÃO foram usadas nas seções anteriores

### 5. Localização - Praia de Iracema (4 cards)
- **Categoria:** `localizacao` (preferencial) OU `geral` (apenas se necessário)
- **Quantidade:** 4 fotos
- **Prioridade:** Média
- **Fallback:** `geral` (apenas se não houver `localizacao` suficiente)
- **Regra:** Usar fotos DIFERENTES das usadas na galeria principal

### 6. Sustentabilidade e Inclusão
- **Fonte:** `sustainability` (tabela)
- **Categoria:** Não aplicável (vem de sustainability)
- **Quantidade:** Todas as sustainability ativas

### 7. Certificações
- **Fonte:** `certifications` (tabela)
- **Categoria:** Não aplicável (vem de certifications)
- **Quantidade:** Todas as certifications ativas

### 8. Redes Sociais
- **Fonte:** `social-media` (tabela)
- **Categoria:** Não aplicável (vem de social-media)
- **Quantidade:** Todas as social-media ativas

---

## 🛏️ PÁGINA QUARTOS (`app/quartos/page.tsx`)

### 1. Hero
- **Prioridade 1:** `rooms[0]?.imageUrl` (foto do primeiro quarto)
- **Prioridade 2:** `galleryPhotos.find(p => p.category === "quarto")` (primeira foto de quarto não usada)
- **Prioridade:** Alta

### 2. Galeria Visual de Quartos
- **Categoria:** `quarto` (preferencial) OU `recepcao` (apenas se necessário)
- **Quantidade:** 6 fotos da galeria + 3 fotos dos quartos
- **Prioridade:** Média-Alta
- **Regra:** NÃO usar fotos já usadas na Home

### 3. PhotoStory "Detalhes que Fazem Diferença"
- **Categoria:** `quarto` (4 fotos diferentes)
- **Prioridade:** Média
- **Fallback:** Fotos dos quartos (`rooms[].imageUrl` ou `rooms[].gallery[]`)
- **Regra:** NÃO usar fotos já usadas na galeria acima

---

## 🍽️ PÁGINA GASTRONOMIA (`app/gastronomia/page.tsx`)

### 1. Hero
- **Prioridade 1:** `gastronomy.find(g => g.type === "restaurante")?.imageUrl`
- **Prioridade 2:** `galleryPhotos.find(p => p.category === "restaurante" || "gastronomia")` (não usada)
- **Prioridade:** Alta

### 2. Card: Café da Manhã
- **Prioridade 1:** `gastronomy.find(g => g.type === "cafe")?.gallery` (array de fotos)
- **Prioridade 2:** `galleryPhotos.filter(p => p.category === "cafe" || "gastronomia")` (4 fotos não usadas)
- **Quantidade:** 4 fotos
- **Prioridade:** Média-Alta

### 3. Card: Restaurante
- **Prioridade 1:** `gastronomy.find(g => g.type === "restaurante")?.gallery` (array de fotos)
- **Prioridade 2:** `galleryPhotos.filter(p => p.category === "restaurante" || "gastronomia")` (5 fotos não usadas)
- **Quantidade:** 5 fotos
- **Prioridade:** Média-Alta

### 4. Galeria de Pratos - Café da Manhã
- **Categoria:** `cafe` OU `gastronomia`
- **Quantidade:** 6 fotos
- **Prioridade:** Média
- **Regra:** NÃO usar fotos já usadas no card acima

### 5. PhotoStory "Experiência Gastronômica"
- **Categoria:** `restaurante`, `gastronomia`, `cafe` (4 fotos diferentes)
- **Prioridade:** Média
- **Regra:** NÃO usar fotos já usadas nas seções acima

### 6. Galeria do Restaurante
- **Categoria:** `restaurante` OU `gastronomia`
- **Quantidade:** 6 fotos
- **Prioridade:** Média
- **Regra:** NÃO usar fotos já usadas nas seções acima

---

## 🏊 PÁGINA LAZER (`app/lazer/page.tsx`)

### 1. Hero
- **Prioridade 1:** `leisure.find(l => l.type === "piscina")?.imageUrl`
- **Prioridade 2:** `galleryPhotos.find(p => p.category === "piscina")` (não usada)
- **Prioridade:** Alta

### 2. Galeria - Piscina Vista Mar
- **Categoria:** `piscina`
- **Quantidade:** 6 fotos
- **Prioridade:** Média-Alta
- **Regra:** NÃO usar foto do hero, NÃO usar fotos já usadas na Home

### 3. PhotoStory "Atividades do Dia"
- **Categoria:** `academia`, `esporte`, `lazer`, `spa` (4 fotos diferentes)
- **Prioridade:** Média
- **Regra:** NÃO usar fotos já usadas nas seções acima

### 4. Galeria - Academia & Fitness
- **Categoria:** `academia`
- **Quantidade:** 4 fotos
- **Prioridade:** Média
- **Regra:** NÃO usar fotos já usadas no PhotoStory

### 5. Galeria - Atividades ao Ar Livre
- **Categoria:** `esporte` (2 fotos) + `lazer` OU `bikes` (2 fotos)
- **Quantidade:** 4 fotos total
- **Prioridade:** Média
- **Regra:** NÃO usar fotos já usadas nas seções acima

### 6. Galeria - Spa & Relaxamento
- **Categoria:** `spa`
- **Quantidade:** 4 fotos
- **Prioridade:** Média
- **Regra:** NÃO usar fotos já usadas nas seções acima

### 7. Cards de Atividades (5 cards)
- **Categoria:** Depende do tipo de atividade
- **Prioridade:** Média
- **Regra:** Usar fotos das galerias acima ou fotos não utilizadas

### 8. Localização Privilegiada
- **Categoria:** `localizacao` OU `geral` (fallback)
- **Quantidade:** 1 foto
- **Prioridade:** Baixa

---

## 🎉 PÁGINA EVENTOS (`app/eventos/page.tsx`)

### 1. Hero
- **Prioridade 1:** `events[0]?.imageUrl`
- **Prioridade 2:** `galleryPhotos.find(p => p.category === "eventos" || "recepcao")` (não usada)
- **Prioridade:** Alta

### 2. Galeria de Eventos
- **Categoria:** `eventos` OU `recepcao` OU `geral` (fallback)
- **Quantidade:** 6 fotos
- **Prioridade:** Média-Alta
- **Regra:** NÃO usar foto do hero

### 3. PhotoStory "Tipos de Eventos"
- **Categoria:** `eventos` (4 fotos diferentes)
- **Prioridade:** Média
- **Fallback:** Fotos dos eventos (`events[].imageUrl`)
- **Regra:** NÃO usar fotos já usadas na galeria

---

## 🌱 PÁGINA ESG (`app/esg/page.tsx`)

### 1. Hero
- **Prioridade 1:** `sustainability[0]?.imageUrl`
- **Prioridade 2:** `galleryPhotos.find(p => p.category === "sustentabilidade")` (não usada)
- **Prioridade:** Alta

### 2. Galeria de Sustentabilidade
- **Categoria:** `sustentabilidade` OU `geral` (fallback)
- **Quantidade:** 6 fotos
- **Prioridade:** Média-Alta
- **Regra:** NÃO usar foto do hero

### 3. PhotoStory "Ações Sustentáveis"
- **Categoria:** `sustentabilidade` (4 fotos diferentes)
- **Prioridade:** Média
- **Fallback:** Fotos da sustainability (`sustainability[].imageUrl`)
- **Regra:** NÃO usar fotos já usadas na galeria

---

## 📞 PÁGINA CONTATO (`app/contato/page.tsx`)

### 1. Hero
- **Categoria:** `recepcao` (preferencial) OU primeira foto disponível
- **Prioridade:** Alta

### 2. Cards de Informação (3 cards)
- **Card 1:** `recepcao` OU primeira foto disponível
- **Card 2:** `gastronomia` OU `restaurante` OU segunda foto disponível
- **Card 3:** `lazer` OU `piscina` OU terceira foto disponível
- **Prioridade:** Média

### 3. Galeria "Conheça Nossas Instalações"
- **Categoria:** `recepcao` OU `geral` OU `piscina`
- **Quantidade:** 6 fotos
- **Prioridade:** Baixa-Média
- **Regra:** NÃO usar fotos já usadas nos cards acima

---

## 🏨 PÁGINA HOTEL (`app/hotel/page.tsx`)

### 1. Hero
- **Categoria:** `recepcao` (preferencial) OU primeira foto disponível
- **Prioridade:** Alta

### 2. Seção "Nossa História"
- **Categoria:** `piscina` OU `geral`
- **Quantidade:** 1 foto
- **Prioridade:** Média

### 3. PhotoStory "Linha do Tempo"
- **Categoria:** `geral` OU `localizacao` (3 fotos diferentes)
- **Prioridade:** Média
- **Regra:** NÃO usar fotos já usadas nas seções acima

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

Para cada seção, verificar:

- [ ] Está usando `usePhotoTracker` para evitar repetições?
- [ ] Está ordenando por `order` antes de filtrar?
- [ ] Está usando categorias específicas (não "geral" como primeira opção)?
- [ ] Está respeitando a prioridade de uso (hero > galeria > cards)?
- [ ] Está usando fallback apenas quando necessário?
- [ ] Está documentando exceções/comportamentos especiais?

---

## 🚨 REGRAS DE OURO

1. **Nunca usar a mesma foto duas vezes na mesma página**
2. **Priorizar categorias específicas sobre "geral"**
3. **Sempre ordenar por `order` antes de usar**
4. **Hero sempre tem prioridade máxima**
5. **Fallback apenas quando realmente necessário**

---

**Última atualização:** Janeiro 2025  
**Versão:** 1.0

