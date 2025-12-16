# 🎯 PLANO DE EXECUÇÃO - WEBSITE HOTEL SONATA DE IRACEMA 2025

**Cliente:** Hotel Sonata de Iracema  
**Projeto:** Novo Website - Reposicionamento Upscale (20 anos)  
**Data de Criação:** 15 de Dezembro de 2025  
**Status Atual:** ⚙️ **EM DESENVOLVIMENTO**  
**Objetivo:** Site profissional focado em conversão direta e reposicionamento de marca

---

## 📋 ÍNDICE

1. [Resumo Executivo](#resumo-executivo)
2. [Análise da Situação Atual](#análise-da-situação-atual)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Fases de Execução](#fases-de-execução)
5. [Cronograma Detalhado](#cronograma-detalhado)
6. [Checklist de Entrega](#checklist-de-entrega)

---

## 🎯 RESUMO EXECUTIVO

### Objetivo Estratégico
Criar um website que **desconstrua a percepção de "hotel 3 estrelas"** e posicione o Sonata como:
- ✨ Produto de hospitalidade confort, moderno e experiencial
- 🏖️ Todos os quartos com vista para o mar (diferencial competitivo)
- 💎 "Sofisticação acessível" - 20 anos de tradição em acolhimento
- 📈 Foco em conversão direta (reduzir dependência de OTAs)

### Referências de Design
- **Benchmark Principal:** [Golden Tulip Natal](https://novo.goldentulipnatal.com.br/)
- **Inspiração Visual:** [Pink Palm Hotel](https://pinkpalmhotel.com/) - Vídeo no header, minimalismo tropical
- **Diferencial Sonata:** Enquanto Pink Palm é "retrô-cool", Sonata será "Modernidade Acolhedora"

### Palavras-Chave SEO (Prioridade)
```
Hotel em Fortaleza
Hotel beira mar em Fortaleza
Hotel Sonata de Iracema
Hotel na Praia de Iracema
Pousada em Fortaleza
Hospedagem Fortaleza
```

---

## 📊 ANÁLISE DA SITUAÇÃO ATUAL

### ✅ O Que Já Temos (Infraestrutura)

#### 1. **Banco de Dados Completo** (18 tabelas)
```typescript
✅ highlights - Carrossel principal (com vídeo)
✅ packages - Pacotes promocionais
✅ rooms - Quartos/acomodações
✅ gastronomy - Restaurante e café da manhã
✅ leisure - Atividades (piscina, beach tennis, bike)
✅ events - Eventos corporativos/casamentos
✅ sustainability - Ações ESG
✅ certifications - Selos e prêmios
✅ socialMediaPosts - Feed do Instagram
✅ gallery - Fotos do hotel
✅ seoMetadata - SEO por página
✅ contactInfo - Informações de contato
```

#### 2. **APIs REST Funcionais** (15 endpoints)
```
✅ /api/highlights - Carrossel principal
✅ /api/packages - Pacotes
✅ /api/rooms - Quartos
✅ /api/gastronomy - Gastronomia
✅ /api/leisure - Lazer
✅ /api/events - Eventos
✅ /api/sustainability - Sustentabilidade
✅ /api/certifications - Certificações
✅ /api/social-media - Feed redes sociais
✅ /api/gallery - Galeria de fotos
✅ /api/seo - Metadados SEO
✅ /api/settings - Configurações
✅ /api/contact - Informações de contato
✅ /api/event-leads - Leads B2B
✅ /api/upload - Upload de imagens
```

#### 3. **Componentes React Criados**
```
✅ Header - Com menu desktop/mobile
✅ Hero - Vídeo hero em tela cheia
✅ BookingBar - Barra de reservas fixa
✅ ReservationForm - Formulário de reserva
✅ PackagesSection - Seção de pacotes
✅ PhotoCarousel - Carrossel de fotos
✅ SocialMediaFeed - Feed do Instagram
✅ SustainabilitySection - Seção ESG
✅ CertificationsSection - Selos
✅ Footer - Rodapé completo
```

#### 4. **Design System Configurado**
```
✅ shadcn/ui (39 componentes)
✅ Tailwind CSS configurado
✅ Sistema de cores do hotel
✅ Dark mode preparado
✅ Responsividade base
```

### ❌ Problemas Críticos Identificados

#### 🔴 **Prioridade Crítica** (Resolver AGORA)
1. **Layout com problemas de espaçamento**
   - BookingBar sobrepõe conteúdo em mobile
   - Footer colado no conteúdo
   - Margens negativas problemáticas no Hero

2. **Componentes não integrados com o banco**
   - PackagesSection não busca dados da API
   - SocialMediaFeed não busca dados da API
   - PhotoCarousel não criado ainda

3. **Falta de feedback para usuário**
   - Sem loading states (skeleton)
   - Sem tratamento de erros
   - Validações silenciosas

#### 🟡 **Prioridade Alta** (Próximos dias)
4. **Faltam páginas principais**
   - /quartos - Página de acomodações
   - /gastronomia - Página de gastronomia
   - /lazer - Página de experiências
   - /eventos - Página B2B
   - /hotel - Sobre o hotel (20 anos)
   - /contato - Página de contato
   - /esg - Sustentabilidade e inclusão

5. **Falta de conteúdo traduzido**
   - Sistema i18n preparado mas não implementado
   - Botões de idioma não funcionais

#### 🟢 **Prioridade Média** (Após lançamento)
6. **Otimizações de performance**
   - Lazy loading de componentes
   - Cache de APIs
   - Otimização de imagens

---

## 🏗️ ESTRUTURA DO PROJETO

### Arquitetura de Navegação (Sitemap)

```
🏠 Home (/)
   ├─ Hero com vídeo de drone
   ├─ Barra de reservas (BookingBar fixa)
   ├─ Pacotes e promoções
   ├─ Carrossel de fotos do hotel
   ├─ Sustentabilidade e inclusão
   ├─ Selos e certificações
   └─ Feed das redes sociais

🛏️ Quartos (/quartos)
   ├─ Filtros (Standard / Luxo / Suíte Luxo)
   ├─ Cards de quartos (Grid responsivo)
   │  ├─ Foto principal
   │  ├─ Nome e descrição curta
   │  ├─ Amenidades (ícones)
   │  ├─ Tamanho e capacidade
   │  └─ Botão "Ver detalhes" ou "Reservar"
   └─ CTA final de reserva

🍽️ Gastronomia (/gastronomia)
   ├─ Café da manhã premiado
   │  ├─ Galeria de fotos
   │  ├─ Horários
   │  └─ Destaques
   ├─ Restaurante
   │  ├─ Menu (se aplicável)
   │  ├─ Ambiente
   │  └─ Horários
   └─ Room Service (se aplicável)

🏖️ Lazer (/lazer) - "Experiências"
   ├─ Piscina
   ├─ Beach Tennis
   ├─ Bike
   ├─ Academia
   ├─ Localização privilegiada
   └─ Praia de Iracema (como "sala de estar")

🎉 Eventos (/eventos)
   ├─ Hero específico
   ├─ Tipos de eventos
   │  ├─ Corporativos
   │  ├─ Casamentos
   │  ├─ Núpcias
   │  └─ Sociais
   ├─ Capacidades e facilidades
   └─ Formulário de lead B2B

🌿 ESG (/esg)
   ├─ Sustentabilidade
   ├─ Inclusão
   ├─ Ações sociais
   └─ Obras locais

🏨 O Hotel (/hotel)
   ├─ História de 20 anos
   ├─ Família Bezerra (humanização)
   ├─ Diferenciais
   ├─ Localização
   └─ Valores

📞 Contato (/contato)
   ├─ Formulário de contato
   ├─ Informações
   │  ├─ Telefone/WhatsApp
   │  ├─ Email
   │  ├─ Endereço
   │  └─ Redes sociais
   └─ Mapa integrado
```

---

## 🚀 FASES DE EXECUÇÃO

---

## **FASE 1: CORREÇÕES CRÍTICAS** ⚡
**Prazo:** 2-3 dias  
**Status:** 🔴 **URGENTE**

### 1.1. Corrigir Layout e Espaçamento

#### ✅ Tarefa 1.1.1: Ajustar padding do `main`
**Arquivo:** `app/layout.tsx`

**Problema Atual:**
```tsx
<main className="pt-20 pb-24 lg:pb-8 lg:pt-32 min-h-screen">
```

**Solução:**
```tsx
<main className="pt-20 pb-32 lg:pb-16 lg:pt-28 min-h-screen">
// pt-20: altura do header mobile (80px)
// pb-32: espaço para BookingBar fixo (128px) 
// lg:pt-28: Header (80px) + pequeno gap
// lg:pb-16: espaço antes do footer (64px)
```

**Tempo estimado:** 15 minutos

---

#### ✅ Tarefa 1.1.2: Corrigir espaçamento do Footer
**Arquivo:** `components/Footer/Footer.tsx`

**Problema Atual:**
```tsx
<footer className="bg-primary text-primary-foreground mt-16 lg:mt-24">
```

**Solução:**
```tsx
<footer className="bg-primary text-primary-foreground mt-24 lg:mt-32 border-t border-primary-foreground/10">
```

**Tempo estimado:** 10 minutos

---

#### ✅ Tarefa 1.1.3: Remover margens negativas problemáticas
**Arquivo:** `app/page.tsx`

**Problema Atual:**
```tsx
<div className="-mt-20 lg:-mt-24 relative z-0">
  <Hero videoId="xptckGz4eH8" height="screen" />
</div>
<div className="relative z-10 -mt-12 lg:-mt-16">
  <ReservationForm locale="pt" />
</div>
```

**Solução:**
```tsx
<div className="relative">
  <Hero videoId="xptckGz4eH8" height="screen" />
</div>
<div className="relative z-10 -mt-56 lg:-mt-96">
  <ReservationForm locale="pt" />
</div>
```

**Tempo estimado:** 20 minutos

---

#### ✅ Tarefa 1.1.4: Melhorar BookingBar (posicionamento)
**Arquivo:** `components/BookingBar/BookingBar.tsx`

**Ações:**
1. Ajustar z-index hierarchy
2. Garantir que não sobreponha conteúdo importante
3. Melhorar responsividade mobile

**Tempo estimado:** 1 hora

---

### 1.2. Integrar Componentes com APIs

#### ✅ Tarefa 1.2.1: Integrar PackagesSection com banco
**Arquivo:** `app/page.tsx`

**Status Atual:** ❌ Componente não aparece (sem dados)

**Solução:**
```tsx
// Adicionar função de fetch
async function getPackages() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/packages`, {
      next: { revalidate: 3600 }, // Cache de 1 hora
      cache: 'force-cache'
    });
    
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    return [];
  }
}

// Usar na página
export default async function Home() {
  const packages = await getPackages();
  
  return (
    <>
      <Hero />
      <ReservationForm />
      <PackagesSection packages={packages} locale="pt" />
    </>
  );
}
```

**Tempo estimado:** 30 minutos

---

#### ✅ Tarefa 1.2.2: Integrar SocialMediaFeed com banco
**Arquivo:** `app/page.tsx`

**Status Atual:** ❌ Componente não aparece (sem dados)

**Solução:** Similar ao PackagesSection

**Tempo estimado:** 30 minutos

---

#### ✅ Tarefa 1.2.3: Criar PhotoCarousel integrado
**Arquivo:** `components/PhotoCarousel/PhotoCarousel.tsx`

**Funcionalidade:**
- Buscar fotos da API `/api/gallery`
- Carrossel com 5 fotos principais (piscina, recepção, restaurante, quarto, geral)
- Auto-play com pausa ao hover
- Indicadores de navegação

**Tempo estimado:** 2 horas

---

### 1.3. Adicionar Loading States e Tratamento de Erros

#### ✅ Tarefa 1.3.1: Criar Skeleton Loaders
**Arquivo:** `components/LoadingStates/`

**Componentes a criar:**
- `PackagesSkeleton.tsx` ✅ (já existe)
- `SocialMediaSkeleton.tsx` ✅ (já existe)
- `PhotoCarouselSkeleton.tsx` (criar)
- `RoomCardSkeleton.tsx` (criar)

**Tempo estimado:** 1 hora

---

#### ✅ Tarefa 1.3.2: Adicionar tratamento de erros
**Padrão a seguir:**

```tsx
'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erro capturado:', error);
    toast.error('Ops! Algo deu errado.', {
      description: 'Tente novamente ou entre em contato conosco.',
      action: {
        label: 'Tentar novamente',
        onClick: () => reset(),
      },
    });
  }, [error, reset]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Algo deu errado!</h2>
      <button onClick={() => reset()}>Tentar novamente</button>
    </div>
  );
}
```

**Aplicar em:**
- `app/error.tsx` (global)
- `app/quartos/error.tsx`
- `app/gastronomia/error.tsx`

**Tempo estimado:** 1 hora

---

### ✅ **RESUMO FASE 1**
- ⏱️ **Tempo Total:** 6-8 horas (1 dia útil)
- 🎯 **Entregas:** Layout corrigido, componentes integrados, loading states
- ✅ **Resultado:** Site funcional com dados reais do banco

---

## **FASE 2: PÁGINAS PRINCIPAIS** 📄
**Prazo:** 5-7 dias  
**Status:** 🟡 **ALTA PRIORIDADE**

### 2.1. Página de Quartos (/quartos)

#### ✅ Tarefa 2.1.1: Estrutura da página
**Arquivo:** `app/quartos/page.tsx`

**Componentes necessários:**
```tsx
- RoomsHero - Hero específico com imagem dos quartos
- RoomsFilter - Filtro por categoria (Standard/Luxo/Suíte)
- RoomCard - Card individual de quarto
- RoomsList - Grid de quartos
- RoomDetailModal - Modal com detalhes completos
```

**Layout:**
```tsx
export default async function RoomsPage() {
  const rooms = await getRooms(); // Fetch da API

  return (
    <>
      <RoomsHero />
      <section className="container py-16 lg:py-24">
        <RoomsFilter />
        <RoomsList rooms={rooms} />
      </section>
      <CTAReservation />
    </>
  );
}
```

**Tempo estimado:** 1 dia (8 horas)

---

#### ✅ Tarefa 2.1.2: RoomCard - Design de Card
**Arquivo:** `components/RoomCard/RoomCard.tsx`

**Especificações:**
```tsx
interface RoomCardProps {
  room: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    size: number; // metros quadrados
    maxGuests: number;
    hasSeaView: boolean;
    hasBalcony: boolean;
    amenities: string[];
    basePrice?: number;
  };
  locale: string;
}
```

**Design:**
- Foto principal (aspect-ratio 16:9)
- Nome do quarto (tipografia destacada)
- Descrição curta (2 linhas, truncate)
- Ícones de amenidades principais
- Badge "Vista Mar" (destaque)
- Tamanho e capacidade
- Botão "Ver detalhes" + "Reservar"

**Copywriting para 20m²:**
```
❌ NÃO: "Quarto compacto de 20m²"
✅ SIM: "Design inteligente com vista infinita"
✅ SIM: "Conforto funcional, experiência completa"
```

**Tempo estimado:** 4 horas

---

#### ✅ Tarefa 2.1.3: RoomDetailModal - Modal de detalhes
**Arquivo:** `components/RoomDetailModal/RoomDetailModal.tsx`

**Conteúdo:**
- Galeria de fotos (swiper)
- Descrição completa
- Lista de amenidades (com ícones)
- Informações técnicas (tamanho, capacidade)
- Preço base (se aplicável)
- Botão "Reservar agora" (CTA)

**Tempo estimado:** 3 horas

---

### 2.2. Página de Gastronomia (/gastronomia)

#### ✅ Tarefa 2.2.1: Estrutura da página
**Arquivo:** `app/gastronomia/page.tsx`

**Seções:**
1. Hero com imagem do café da manhã
2. Café da Manhã Premiado (destaque especial)
3. Restaurante
4. Room Service (se aplicável)

**Tempo estimado:** 6 horas

---

#### ✅ Tarefa 2.2.2: GastronomySection - Componente reutilizável
**Arquivo:** `components/GastronomySection/GastronomySection.tsx`

**Props:**
```tsx
interface GastronomySectionProps {
  type: 'cafe-manha' | 'restaurante' | 'bar' | 'room-service';
  title: string;
  description: string;
  gallery: string[];
  schedule?: {
    days: string;
    hours: string;
  };
  highlights?: string[];
}
```

**Tempo estimado:** 3 horas

---

### 2.3. Página de Lazer (/lazer) - "Experiências"

#### ✅ Tarefa 2.3.1: Estrutura da página
**Arquivo:** `app/lazer/page.tsx`

**Conceito:** Vender a Praia de Iracema como "sala de estar"

**Seções:**
1. Hero: "Sua verdadeira sala de estar é a Praia de Iracema"
2. Piscina com vista
3. Beach Tennis
4. Bike pela orla
5. Academia
6. Localização privilegiada (mapa interativo)

**Tempo estimado:** 6 horas

---

#### ✅ Tarefa 2.3.2: LeisureCard - Card de atividade
**Arquivo:** `components/LeisureCard/LeisureCard.tsx`

**Design:**
- Ícone grande da atividade
- Foto de fundo
- Título
- Descrição curta
- Horários (se aplicável)
- Badge de destaque (ex: "Novo", "Incluso")

**Tempo estimado:** 2 horas

---

### 2.4. Página de Eventos (/eventos)

#### ✅ Tarefa 2.4.1: Estrutura da página (B2B Focus)
**Arquivo:** `app/eventos/page.tsx`

**Objetivo:** Captação de leads corporativos

**Seções:**
1. Hero corporativo
2. Tipos de eventos (grid de cards)
3. Facilidades e capacidades
4. Galeria de eventos anteriores
5. Formulário de lead (destaque)
6. CTA de contato direto

**Tempo estimado:** 8 horas

---

#### ✅ Tarefa 2.4.2: EventLeadForm - Formulário B2B
**Arquivo:** `components/EventLeadForm/EventLeadForm.tsx`

**Campos:**
```tsx
- Nome completo*
- Email corporativo*
- Telefone/WhatsApp*
- Empresa
- Tipo de evento* (select)
- Data prevista* (date picker)
- Número de convidados* (number)
- Mensagem (textarea)
```

**Validação:** react-hook-form + zod  
**Envio:** POST para `/api/event-leads`  
**Feedback:** Toast de sucesso/erro

**Tempo estimado:** 4 horas

---

### 2.5. Página Sobre o Hotel (/hotel)

#### ✅ Tarefa 2.5.1: Estrutura da página
**Arquivo:** `app/hotel/page.tsx`

**Storytelling:**
1. Hero: "20 anos acolhendo sonhos em Fortaleza"
2. História do hotel (timeline visual)
3. Família Bezerra (humanização com fotos)
4. Diferenciais (todos os quartos com vista mar)
5. Localização (Praia de Iracema)
6. Valores e missão
7. Conquistas e prêmios

**Tempo estimado:** 6 horas

---

### 2.6. Página ESG (/esg)

#### ✅ Tarefa 2.6.1: Estrutura da página
**Arquivo:** `app/esg/page.tsx`

**Seções:**
1. Hero: "Comprometidos com o futuro"
2. Sustentabilidade (ações ambientais)
3. Inclusão (acessibilidade e diversidade)
4. Ações sociais (comunidade local)
5. Apoio a obras locais (artistas e fornecedores)
6. Relatório ESG (download PDF, se houver)

**Tempo estimado:** 4 horas

---

### 2.7. Página de Contato (/contato)

#### ✅ Tarefa 2.7.1: Estrutura da página
**Arquivo:** `app/contato/page.tsx`

**Layout:**
```tsx
- Hero simples
- Grid 2 colunas:
  - Coluna 1: Formulário de contato
  - Coluna 2: Informações
    - Endereço
    - Telefone/WhatsApp (clicáveis)
    - Email
    - Redes sociais
- Mapa integrado (Google Maps)
```

**Tempo estimado:** 3 horas

---

### ✅ **RESUMO FASE 2**
- ⏱️ **Tempo Total:** 40-48 horas (5-6 dias úteis)
- 🎯 **Entregas:** 7 páginas completas e funcionais
- ✅ **Resultado:** Site completo navegável

---

## **FASE 3: INTERNACIONALIZAÇÃO (i18n)** 🌍
**Prazo:** 3-4 dias  
**Status:** 🟡 **ALTA PRIORIDADE**

### 3.1. Implementar Sistema de Traduções

#### ✅ Tarefa 3.1.1: Configurar next-intl ou sistema custom
**Arquivo:** `lib/i18n.ts` (já existe)

**Ações:**
1. Validar configuração atual
2. Criar arquivos de tradução
   - `locales/pt.json`
   - `locales/es.json`
   - `locales/en.json`
3. Criar hook `useTranslation`
4. Criar componente `LanguageSwitcher`

**Tempo estimado:** 4 horas

---

#### ✅ Tarefa 3.1.2: Traduzir conteúdo estático
**Arquivos:** Todos os componentes com texto

**Padrão:**
```tsx
// Antes:
<h1>Bem-vindo ao Hotel Sonata</h1>

// Depois:
<h1>{t('home.hero.title')}</h1>
```

**Tempo estimado:** 8 horas

---

#### ✅ Tarefa 3.1.3: Implementar LanguageSwitcher no Header
**Arquivo:** `components/Header/Header.tsx`

**Design:**
- Bandeiras clicáveis (Brasil, Espanha, USA)
- Dropdown elegante
- Persist no localStorage
- Atualiza página automaticamente

**Tempo estimado:** 2 horas

---

#### ✅ Tarefa 3.1.4: Traduzir conteúdo do banco
**Ação:** Popular tabelas de tradução

**Exemplo:**
```sql
INSERT INTO room_translations (room_id, locale, name, description)
VALUES 
  (1, 'pt', 'Quarto Standard Vista Mar', 'Descrição em português...'),
  (1, 'es', 'Habitación Estándar Vista al Mar', 'Descripción en español...'),
  (1, 'en', 'Standard Room Ocean View', 'Description in english...');
```

**Ferramentas:** Usar ChatGPT/DeepL para traduções profissionais

**Tempo estimado:** 12 horas (para todo o conteúdo)

---

### ✅ **RESUMO FASE 3**
- ⏱️ **Tempo Total:** 24-28 horas (3-4 dias úteis)
- 🎯 **Entregas:** Site em 3 idiomas (PT, ES, EN)
- ✅ **Resultado:** Site internacional

---

## **FASE 4: OTIMIZAÇÕES E POLIMENTO** ✨
**Prazo:** 3-4 dias  
**Status:** 🟢 **PÓS-LANÇAMENTO**

### 4.1. SEO e Performance

#### ✅ Tarefa 4.1.1: SEO On-Page
**Ações:**

1. **Metadados por página**
```tsx
// app/quartos/page.tsx
export const metadata = {
  title: 'Quartos com Vista Mar - Hotel Sonata de Iracema | Fortaleza',
  description: 'Todos os quartos com vista para o mar. Escolha entre Standard, Luxo e Suíte Luxo na Praia de Iracema, Fortaleza.',
  keywords: 'hotel beira mar fortaleza, quarto vista mar, hotel praia iracema',
  openGraph: {
    title: 'Quartos com Vista Mar - Hotel Sonata de Iracema',
    description: 'Todos os quartos com vista para o mar.',
    images: ['/og-image-quartos.jpg'],
  },
};
```

2. **Schema.org (JSON-LD)**
```tsx
// components/StructuredData/HotelSchema.tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Hotel Sonata de Iracema",
  "description": "Hotel frente mar na Praia de Iracema, Fortaleza",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Endereço completo",
    "addressLocality": "Fortaleza",
    "addressRegion": "CE",
    "postalCode": "XXXXX-XXX",
    "addressCountry": "BR"
  },
  "starRating": {
    "@type": "Rating",
    "ratingValue": "4"
  }
}
</script>
```

3. **Sitemap.xml automático**
```tsx
// app/sitemap.ts
export default function sitemap() {
  return [
    { url: 'https://hotelsonata.com.br', priority: 1 },
    { url: 'https://hotelsonata.com.br/quartos', priority: 0.9 },
    { url: 'https://hotelsonata.com.br/gastronomia', priority: 0.8 },
    // ...
  ];
}
```

**Tempo estimado:** 6 horas

---

#### ✅ Tarefa 4.1.2: Performance (Core Web Vitals)
**Ações:**

1. **Lazy Loading**
```tsx
// Componentes pesados
const PhotoCarousel = dynamic(() => import('@/components/PhotoCarousel'), {
  loading: () => <Skeleton className="h-96" />
});
```

2. **Otimização de imagens**
```tsx
// Todas as imagens com next/image
<Image
  src={imageUrl}
  alt={alt}
  width={800}
  height={600}
  quality={85}
  loading="lazy"
  placeholder="blur"
/>
```

3. **Cache de APIs**
```tsx
// Todas as fetches com revalidate
fetch(url, { next: { revalidate: 3600 } })
```

**Meta:** PageSpeed > 90

**Tempo estimado:** 4 horas

---

### 4.2. Acessibilidade (WCAG 2.1 AA)

#### ✅ Tarefa 4.2.1: Auditoria de acessibilidade
**Ferramentas:**
- Lighthouse (Chrome DevTools)
- axe DevTools
- WAVE

**Verificar:**
- ✅ Contraste de cores (mínimo 4.5:1)
- ✅ Focus visible em todos elementos interativos
- ✅ Navegação por teclado completa
- ✅ Aria-labels em elementos sem texto
- ✅ Alt text em todas as imagens
- ✅ Formulários com labels corretos

**Tempo estimado:** 4 horas

---

### 4.3. Polimento Visual

#### ✅ Tarefa 4.3.1: Microinterações
**Ações:**
- Hover states suaves em todos os botões
- Transições ao scroll (scroll reveal)
- Animações sutis em cards
- Loading states elegantes

**Tempo estimado:** 3 horas

---

#### ✅ Tarefa 4.3.2: Fotografia profissional
**Necessidade crítica:** Sessão de fotos lifestyle

**Briefing para fotógrafo:**
1. **Café da manhã** (5-8 fotos)
   - Pessoas sorrindo tomando café
   - Close nos pratos (colorido, apetitoso)
   - Vista da área do café
   - Detalhes de produtos locais

2. **Quartos** (8-12 fotos por tipo)
   - Vista da janela para o mar (protagonista)
   - Cama arrumada (roupa de cama de qualidade)
   - Banheiro limpo e moderno
   - Detalhes (amenities, decoração)
   - Pessoa relaxando (lendo, na varanda)

3. **Piscina** (5-8 fotos)
   - Vista geral
   - Pessoas relaxando
   - Close na água (convite ao mergulho)
   - Pôr do sol

4. **Beach Tennis** (3-5 fotos)
   - Pessoas jogando (ação)
   - Equipamento
   - Área da quadra

5. **Áreas comuns** (5-8 fotos)
   - Recepção (acolhedora)
   - Corredores (bem iluminados)
   - Varanda/áreas de convivência

**Estilo:**
- ❌ NÃO: Fotos "cadastrais", quartos vazios e sem vida
- ✅ SIM: Lifestyle, pessoas reais, emoção, calor humano

**Tempo:** 1-2 dias de produção + 2-3 dias de edição

---

#### ✅ Tarefa 4.3.3: Vídeo de drone
**Necessidade:** Vídeo de abertura profissional

**Especificações:**
- Duração: 30-60 segundos
- Qualidade: 4K
- Conteúdo:
  - Abertura: Vista aérea da praia de Iracema
  - Aproximação do hotel
  - Planos da fachada
  - Vista superior da piscina
  - Fechamento: Vista 360° da localização

**Uso:**
- Hero da home (loop)
- Vídeo de destaque nos carrosséis
- Instagram/Reels

**Tempo:** 1 dia de gravação + 2 dias de edição

---

### ✅ **RESUMO FASE 4**
- ⏱️ **Tempo Total:** 24-32 horas (3-4 dias úteis) + Produção audiovisual
- 🎯 **Entregas:** Site otimizado, acessível e com conteúdo premium
- ✅ **Resultado:** Site profissional pronto para lançamento

---

## **FASE 5: INTEGRAÇÕES E AUTOMAÇÕES** 🔌
**Prazo:** 2-3 dias  
**Status:** 🟢 **PÓS-LANÇAMENTO**

### 5.1. Motor de Reservas

#### ✅ Tarefa 5.1.1: Integração com Omnibees (ou similar)
**Ações:**
1. Conectar BookingBar ao motor
2. Garantir continuidade visual (white-label)
3. Testar fluxo completo de reserva
4. Configurar tracking de conversão

**Tempo estimado:** 8 horas (depende da API do fornecedor)

---

### 5.2. CRM e Email Marketing

#### ✅ Tarefa 5.2.1: Integração com RD Station/HubSpot
**Ações:**
1. Conectar formulário de leads de eventos
2. Configurar automação de follow-up
3. Criar fluxos de nutrição

**Tempo estimado:** 4 horas

---

### 5.3. Analytics e Tracking

#### ✅ Tarefa 5.3.1: Google Analytics 4
**Eventos a trackear:**
- `page_view` (automático)
- `search` (busca interna, se houver)
- `view_item` (visualização de quarto)
- `add_to_cart` (início de reserva)
- `begin_checkout` (motor de reservas)
- `purchase` (conversão)
- `generate_lead` (formulário de eventos)

**Tempo estimado:** 3 horas

---

#### ✅ Tarefa 5.3.2: Meta Pixel (Facebook/Instagram)
**Eventos:**
- `PageView`
- `ViewContent` (página de quarto)
- `InitiateCheckout` (BookingBar)
- `Lead` (formulários)

**Tempo estimado:** 2 horas

---

### 5.4. Feed das Redes Sociais (Automação)

#### ✅ Tarefa 5.4.1: API do Instagram (opcional)
**Alternativas:**
1. **Manual:** Admin alimenta via painel
2. **Semi-automático:** Script que puxa do Instagram Business
3. **Automático:** Integração oficial com Meta Graph API

**Recomendação:** Iniciar com manual (mais controle de qualidade)

**Tempo estimado:** 4 horas (se automático)

---

### ✅ **RESUMO FASE 5**
- ⏱️ **Tempo Total:** 16-24 horas (2-3 dias úteis)
- 🎯 **Entregas:** Integrações funcionais e automações
- ✅ **Resultado:** Site conectado ao ecossistema de marketing

---

## 📅 CRONOGRAMA CONSOLIDADO

| Fase | Descrição | Duração | Dependências | Status |
|------|-----------|---------|--------------|--------|
| **Fase 0** | Setup inicial | ✅ Concluído | - | ✅ |
| **Fase 1** | Correções críticas | 1-2 dias | Fase 0 | 🔴 **URGENTE** |
| **Fase 2** | Páginas principais | 5-6 dias | Fase 1 | 🟡 Pendente |
| **Fase 3** | Internacionalização | 3-4 dias | Fase 2 | 🟡 Pendente |
| **Fase 4** | Otimizações | 3-4 dias | Fase 3 | 🟢 Pendente |
| **Fase 5** | Integrações | 2-3 dias | Fase 4 | 🟢 Pendente |
| **Paralelo** | Produção audiovisual | 5-7 dias | - | 🟡 Contratar |

**⏱️ TEMPO TOTAL ESTIMADO:** 14-19 dias úteis (3-4 semanas)

---

## 📋 CHECKLIST DE ENTREGA FINAL

### ✅ Funcionalidades Obrigatórias

#### 🏠 Home
- [ ] Hero com vídeo de drone (loop automático)
- [ ] Destaques (carrossel com 3 próximos meses)
- [ ] BookingBar fixo (acompanha scroll)
- [ ] Pacotes (distribuição tipo Eldorado)
- [ ] Carrossel de fotos (5 fotos principais)
- [ ] Sustentabilidade e inclusão
- [ ] Selos e certificações
- [ ] Feed do Instagram (últimas 6-8 fotos)

#### 🛏️ Quartos
- [ ] Hero específico
- [ ] Filtros (Standard / Luxo / Suíte Luxo)
- [ ] Grid de cards
- [ ] Modal de detalhes
- [ ] CTA de reserva

#### 🍽️ Gastronomia
- [ ] Café da manhã premiado (destaque)
- [ ] Restaurante
- [ ] Galerias de fotos
- [ ] Horários

#### 🏖️ Lazer
- [ ] Conceito "Praia de Iracema como sala de estar"
- [ ] Piscina
- [ ] Beach Tennis
- [ ] Bike
- [ ] Academia
- [ ] Localização (mapa)

#### 🎉 Eventos
- [ ] Hero B2B
- [ ] Tipos de eventos
- [ ] Facilidades
- [ ] Formulário de lead
- [ ] CTA de contato direto

#### 🏨 Sobre o Hotel
- [ ] História de 20 anos
- [ ] Família Bezerra
- [ ] Diferenciais
- [ ] Timeline visual

#### 🌿 ESG
- [ ] Sustentabilidade
- [ ] Inclusão
- [ ] Ações sociais
- [ ] Obras locais

#### 📞 Contato
- [ ] Formulário
- [ ] Informações (telefone, email, endereço)
- [ ] Mapa integrado
- [ ] Links de redes sociais

---

### ✅ Requisitos Técnicos

#### Performance
- [ ] PageSpeed Score > 90 (mobile e desktop)
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Lazy loading implementado
- [ ] Imagens otimizadas (WebP/AVIF)
- [ ] Cache configurado

#### SEO
- [ ] Metadados em todas as páginas
- [ ] Schema.org (Hotel, BreadcrumbList)
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Canonical URLs
- [ ] Alt text em todas as imagens
- [ ] URLs semânticas

#### Acessibilidade
- [ ] WCAG 2.1 AA compliant
- [ ] Navegação por teclado
- [ ] Leitores de tela (NVDA/JAWS testados)
- [ ] Contraste adequado
- [ ] Focus visible
- [ ] Aria-labels corretos

#### Responsividade
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)
- [ ] Testado em dispositivos reais

#### Internacionalização
- [ ] Português (completo)
- [ ] Espanhol (completo)
- [ ] Inglês (completo)
- [ ] Seletor de idioma funcional

#### Integrações
- [ ] Motor de reservas (Omnibees)
- [ ] Google Analytics 4
- [ ] Meta Pixel
- [ ] CRM (RD Station/HubSpot)
- [ ] WhatsApp clicável
- [ ] Telefone clicável (mobile)

---

### ✅ Qualidade de Código

- [ ] TypeScript sem erros
- [ ] ESLint sem warnings
- [ ] Código comentado (partes complexas)
- [ ] Componentes reutilizáveis
- [ ] Pastas organizadas
- [ ] Nomeação consistente
- [ ] Git commits semânticos

---

### ✅ Documentação

- [ ] README.md atualizado
- [ ] Documentação de componentes
- [ ] Guia de estilo (design system)
- [ ] Manual do admin (painel CMS)
- [ ] Variáveis de ambiente (.env.example)

---

## 🎯 MÉTRICAS DE SUCESSO

### KPIs Técnicos
- ⚡ **Performance:** PageSpeed > 90
- ♿ **Acessibilidade:** Score > 95
- 🎨 **SEO:** Score > 90
- 📱 **Responsividade:** 100% funcional em todos dispositivos

### KPIs de Negócio (Pós-Lançamento)
- 📈 **Taxa de conversão:** > 2% (visitantes → reservas diretas)
- ⏱️ **Tempo na página:** > 2 minutos (home)
- 🔄 **Taxa de rejeição:** < 50%
- 📧 **Leads de eventos:** > 10/mês (após 3 meses)
- 🌍 **Visitantes internacionais:** Crescimento de 20% (após 6 meses)

---

## 📞 PRÓXIMOS PASSOS IMEDIATOS

### 🔴 **SEMANA 1** (URGENTE)
1. ✅ Aprovar este plano de execução
2. 🚀 Iniciar Fase 1 (Correções críticas)
3. 📸 Contratar fotógrafo profissional
4. 🎥 Contratar produção de vídeo (drone)
5. ✍️ Definir copywriting oficial (textos do hotel)

### 🟡 **SEMANA 2-3**
6. 📄 Desenvolver todas as páginas (Fase 2)
7. 🌍 Implementar traduções (Fase 3)
8. 📝 Revisar todo o conteúdo (3 idiomas)

### 🟢 **SEMANA 4**
9. ✨ Otimizações e polimento (Fase 4)
10. 🔌 Integrações (Fase 5)
11. 🧪 Testes finais (QA)
12. 🎉 **LANÇAMENTO**

---

## 💡 RECOMENDAÇÕES FINAIS

### 🎨 Design
- **Paleta de cores:** Azuis (mar), beges (areia), toques de dourado (sol)
- **Tipografia:** Elegante mas legível (ex: Inter + Playfair Display)
- **Fotografia:** Lifestyle, não cadastral
- **Espaçamento:** Generoso, com respiro

### ✍️ Copywriting
- **Tom de voz:** Elegante, acolhedor, confiante
- **Headline home:** "Sua casa em Fortaleza" ou "A tradição de acolher, o prazer de se renovar"
- **Quartos 20m²:** Não focar no tamanho, mas na experiência ("Vista infinita, conforto inteligente")
- **Localização:** Vender a Praia de Iracema como coração cultural de Fortaleza

### 📸 Produção
- **Fotos:** Pessoas reais, sorrisos, momentos genuínos
- **Vídeo:** Mostrar a proximidade real com o mar
- **Detalhes:** Close em elementos que despertam emoção (café, roupa de cama, vista)

### 🔧 Técnico
- **Mobile First:** Design pensado primeiro para celular
- **Performance:** Site deve carregar em < 2 segundos
- **SEO Local:** Foco em "Hotel frente mar Fortaleza"
- **Motor de Reservas:** Integração visual perfeita (sem quebra de experiência)

---

## 📂 ESTRUTURA DE ARQUIVOS FINAL

```
Hotel/
├── app/
│   ├── (pages)/
│   │   ├── page.tsx                    # Home
│   │   ├── quartos/
│   │   │   ├── page.tsx               # Lista de quartos
│   │   │   └── [slug]/page.tsx        # Detalhes do quarto
│   │   ├── gastronomia/page.tsx
│   │   ├── lazer/page.tsx
│   │   ├── eventos/page.tsx
│   │   ├── hotel/page.tsx
│   │   ├── esg/page.tsx
│   │   └── contato/page.tsx
│   ├── api/                            # 15 endpoints REST
│   ├── layout.tsx
│   ├── globals.css
│   └── sitemap.ts
├── components/
│   ├── Header/
│   ├── Hero/
│   ├── BookingBar/
│   ├── ReservationForm/
│   ├── PackagesSection/
│   ├── PhotoCarousel/
│   ├── SocialMediaFeed/
│   ├── SustainabilitySection/
│   ├── CertificationsSection/
│   ├── Footer/
│   ├── RoomCard/
│   ├── RoomDetailModal/
│   ├── GastronomySection/
│   ├── LeisureCard/
│   ├── EventLeadForm/
│   ├── LanguageSwitcher/
│   ├── LoadingStates/
│   └── ui/                            # shadcn/ui components
├── lib/
│   ├── db/
│   │   ├── index.ts
│   │   └── schema.ts                  # 18 tabelas
│   ├── i18n.ts
│   ├── upload.ts
│   └── utils.ts
├── locales/
│   ├── pt.json
│   ├── es.json
│   └── en.json
├── public/
│   ├── Logo/
│   ├── images/
│   └── videos/
└── [configs]
```

---

## ✅ APROVAÇÃO E INÍCIO

**Para iniciar a execução deste plano:**

1. ✅ Revisar e aprovar este documento
2. ✅ Confirmar prioridades (Fase 1 é URGENTE)
3. ✅ Definir prazos finais desejados
4. ✅ Contratar produção audiovisual (paralelo ao dev)
5. ✅ Iniciar desenvolvimento

---

**Documento criado em:** 15 de Dezembro de 2025  
**Versão:** 1.0  
**Próxima revisão:** Após Fase 1 (correções críticas)

**Dúvidas ou ajustes?** Entre em contato com o time de desenvolvimento.

---

*Este é um plano de execução profissional e detalhado. Cada fase possui entregas claras e tempo estimado. O sucesso depende de execução disciplinada e revisão constante de qualidade.* 🚀

