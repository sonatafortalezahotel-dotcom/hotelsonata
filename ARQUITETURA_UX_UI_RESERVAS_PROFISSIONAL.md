# 🏨 ARQUITETURA UX/UI - SISTEMA DE RESERVAS PROFISSIONAL
## Hotel Sonata de Iracema - Referências: Airbnb & Booking.com

---

## 📋 SUMÁRIO EXECUTIVO

Este documento apresenta a arquitetura completa e as diretrizes de UX/UI para o sistema de reservas do Hotel Sonata de Iracema, baseado nas melhores práticas de plataformas líderes como Airbnb e Booking.com.

**Objetivo:** Criar uma experiência de reserva fluida, intuitiva e profissional que maximize conversões e satisfação do usuário.

---

## 🎯 PRINCÍPIOS FUNDAMENTAIS

### 1. **Clareza e Transparência**
- Preços sempre visíveis e claros
- Sem taxas ocultas
- Disponibilidade em tempo real
- Informações completas antes da reserva

### 2. **Simplicidade**
- Fluxo linear e intuitivo
- Mínimo de cliques para completar reserva
- Formulários progressivos (não sobrecarregar)
- Feedback visual imediato

### 3. **Confiança**
- Garantias visíveis (cancelamento grátis, melhor preço)
- Testemunhos e avaliações
- Informações de segurança
- Suporte acessível

### 4. **Responsividade**
- Funciona perfeitamente em mobile, tablet e desktop
- Performance otimizada
- Carregamento rápido de imagens
- Navegação touch-friendly

---

## 🗺️ MAPA DO FLUXO DE RESERVA

### **Fluxo Atual vs. Fluxo Ideal**

#### **FLUXO ATUAL (Problemas Identificados)**
```
1. Home → BookingBar (datas/hóspedes)
2. /reservas → Lista TODOS os quartos (mesmo indisponíveis)
3. Seleciona quarto → Preenche formulário completo
4. Confirma → /reservas/confirmacao
```

**Problemas:**
- ❌ Mostra quartos indisponíveis (confusão)
- ❌ Formulário muito longo de uma vez
- ❌ Não há verificação de disponibilidade antes de selecionar
- ❌ Falta de feedback visual durante o processo
- ❌ Não há comparação de quartos

#### **FLUXO IDEAL (Airbnb/Booking.com)**
```
1. Home → BookingBar (datas/hóspedes) → Busca disponibilidade
2. /reservas → Lista APENAS quartos disponíveis
   - Filtros visíveis (preço, amenidades, vista)
   - Ordenação (preço, popularidade, avaliação)
   - Comparação rápida
3. Clica em quarto → /quartos/[code]
   - Galeria completa
   - Detalhes expandidos
   - Mapa do hotel
   - Avaliações
   - Widget de reserva sticky (sempre visível)
4. Verifica disponibilidade → Preenche dados progressivamente
5. Revisão final → Confirmação
6. /reservas/confirmacao → Email + Download PDF
```

---

## 🎨 COMPONENTES E PÁGINAS

### **1. BOOKING BAR (Componente Global)**

**Localização:** Header fixo (desktop) / Bottom bar (mobile)

**Funcionalidades:**
- ✅ Seleção de datas (check-in/check-out)
- ✅ Número de hóspedes (adultos + crianças)
- ✅ Botão "Verificar Disponibilidade"
- ✅ Validação em tempo real
- ✅ Feedback visual de erros

**UX Melhorias:**
- Calendário inline (não popover)
- Indicador de preço médio por noite
- Sugestões de datas (fins de semana, feriados)
- Histórico de buscas recentes

**Design:**
```
┌─────────────────────────────────────────────────────────┐
│  📅 Check-in: 15/01/2025  📅 Check-out: 18/01/2025     │
│  👥 2 Adultos, 0 Crianças  [VERIFICAR DISPONIBILIDADE] │
└─────────────────────────────────────────────────────────┘
```

---

### **2. PÁGINA DE BUSCA DE QUARTOS (/reservas)**

#### **Layout Principal**

**Desktop:**
```
┌─────────────────────────────────────────────────────────────┐
│  Filtros (Sidebar)  │  Lista de Quartos (Grid)             │
│  - Preço            │  ┌─────┐ ┌─────┐ ┌─────┐            │
│  - Amenidades       │  │ Q1  │ │ Q2  │ │ Q3  │            │
│  - Vista            │  └─────┘ └─────┘ └─────┘            │
│  - Capacidade       │  ┌─────┐ ┌─────┐                     │
│                     │  │ Q4  │ │ Q5  │                     │
│  Ordenar:          │  └─────┘ └─────┘                     │
│  [Preço] [Popular] │                                       │
└─────────────────────────────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────┐
│  [Filtros] [Ordenar] │
├─────────────────────┤
│  ┌─────────────────┐ │
│  │  Quarto 1       │ │
│  │  [Imagem]        │ │
│  │  R$ 250/noite    │ │
│  │  [Ver Detalhes]  │ │
│  └─────────────────┘ │
│  ┌─────────────────┐ │
│  │  Quarto 2       │ │
│  └─────────────────┘ │
└─────────────────────┘
```

#### **Card de Quarto (Melhorado)**

**Informações Essenciais:**
- ✅ Imagem principal (carrossel se houver galeria)
- ✅ Nome do quarto
- ✅ Preço por noite (destacado)
- ✅ Total estimado para o período
- ✅ Badges: Vista Mar, Varanda, etc.
- ✅ Capacidade (ícone de pessoas)
- ✅ Amenidades principais (3 primeiras)
- ✅ Botão "Ver Detalhes" (CTA principal)
- ✅ Botão "Reservar Agora" (CTA secundário)

**Estados Visuais:**
- 🟢 Disponível: Card normal, botões ativos
- 🔴 Indisponível: Card com overlay escuro, botão desabilitado
- ⚠️ Últimas unidades: Badge "Poucas unidades disponíveis"
- ⭐ Popular: Badge "Mais reservado"

**Interações:**
- Hover: Zoom suave na imagem, sombra aumentada
- Click na imagem: Lightbox com galeria completa
- Click no card: Navega para página de detalhes

---

### **3. PÁGINA DE DETALHES DO QUARTO (/quartos/[code])**

#### **Layout Principal**

```
┌─────────────────────────────────────────────────────────────┐
│  [Galeria Principal - Hero Grande]                         │
│  ┌─────┬─────┬─────┐                                       │
│  │ 1   │ 2   │ 3   │  [Ver todas as fotos]                │
│  └─────┴─────┴─────┘                                       │
├─────────────────────────────────────────────────────────────┤
│  Conteúdo Principal        │  Widget de Reserva (Sticky) │
│  ┌───────────────────────┐ │  ┌─────────────────────┐   │
│  │ Nome do Quarto        │ │  │ 📅 Selecionar Datas │   │
│  │ Badges (Vista, etc)   │ │  │ 👥 Hóspedes          │   │
│  │                       │ │  │                      │   │
│  │ Descrição Completa    │ │  │ 💰 R$ 250/noite      │   │
│  │                       │ │  │ Total: R$ 750        │   │
│  │ Amenidades            │ │  │                      │   │
│  │ - WiFi                │ │  │ [Verificar Dispon.] │   │
│  │ - Ar Condicionado    │ │  │                      │   │
│  │ - ...                 │ │  │ ✅ Disponível        │   │
│  │                       │ │  │ [Continuar Reserva] │   │
│  │ Galeria Completa      │ │  └─────────────────────┘   │
│  │                       │ │                            │
│  │ Mapa do Hotel         │ │  Informações:              │
│  │                       │ │  ✅ Café da manhã incl.   │
│  │ Avaliações            │ │  ✅ Cancelamento grátis   │
│  │ ⭐⭐⭐⭐⭐ (4.8)        │ │  ✅ Melhor preço garantido│
│  │                       │ │                            │
│  │ Quartos Similares     │ │                            │
│  └───────────────────────┘ │                            │
└─────────────────────────────────────────────────────────────┘
```

#### **Widget de Reserva (Sticky Sidebar)**

**Funcionalidades:**
1. **Seleção de Datas**
   - Calendário inline (não popover)
   - Destaque de datas disponíveis/indisponíveis
   - Mínimo de noites (se aplicável)
   - Bloqueio de datas passadas

2. **Hóspedes**
   - Seletor de adultos (1-8)
   - Seletor de crianças (0-6)
   - Validação de capacidade em tempo real
   - Aviso se exceder capacidade

3. **Verificação de Disponibilidade**
   - Botão "Verificar Disponibilidade"
   - Loading state durante verificação
   - Feedback visual (verde = disponível, vermelho = indisponível)
   - Cálculo automático de preço total

4. **Formulário Progressivo**
   - **Etapa 1:** Datas e Hóspedes
   - **Etapa 2:** Dados do Hóspede (aparece após verificar disponibilidade)
   - **Etapa 3:** Revisão e Confirmação

5. **Informações de Confiança**
   - ✅ Café da manhã incluído
   - ✅ Cancelamento gratuito
   - ✅ Melhor preço garantido
   - ✅ Pagamento seguro

---

### **4. FORMULÁRIO DE RESERVA (Progressivo)**

#### **Etapa 1: Datas e Hóspedes**
- Já no widget de reserva
- Validação em tempo real
- Feedback visual imediato

#### **Etapa 2: Dados do Hóspede** (Aparece após verificar disponibilidade)

**Campos:**
- Nome Completo * (obrigatório)
- E-mail * (obrigatório, validação de formato)
- Telefone * (obrigatório, máscara)
- CPF/Passaporte (opcional)
- Código Promocional (opcional)
- Solicitações Especiais (opcional, textarea)

**UX:**
- Validação em tempo real
- Mensagens de erro claras
- Autocomplete de dados (se usuário logado)
- Salvar dados para próximas reservas

#### **Etapa 3: Revisão e Confirmação**

**Resumo da Reserva:**
```
┌─────────────────────────────────────┐
│  RESUMO DA RESERVA                  │
├─────────────────────────────────────┤
│  Quarto: Suíte Master               │
│  Check-in: 15/01/2025               │
│  Check-out: 18/01/2025              │
│  Noites: 3                          │
│  Hóspedes: 2 Adultos                │
├─────────────────────────────────────┤
│  Preço por noite: R$ 250,00         │
│  3 noites × R$ 250,00 = R$ 750,00  │
│  Desconto: -R$ 50,00                │
├─────────────────────────────────────┤
│  TOTAL: R$ 700,00                   │
└─────────────────────────────────────┘
```

**Botão de Confirmação:**
- Texto: "CONFIRMAR RESERVA - R$ 700,00"
- Ícone de cadeado (segurança)
- Loading state durante processamento
- Desabilitado até todos os campos obrigatórios preenchidos

---

### **5. PÁGINA DE CONFIRMAÇÃO (/reservas/confirmacao)**

#### **Layout**

```
┌─────────────────────────────────────────────────────────────┐
│  ✅ RESERVA CONFIRMADA!                                     │
│                                                             │
│  Número de Confirmação: SON-20250115-1234                  │
│                                                             │
│  ┌─────────────────────┬─────────────────────────────────┐ │
│  │ Detalhes da Reserva │  Ações                          │ │
│  │                     │  [Imprimir]                     │ │
│  │ Check-in: 15/01/25  │  [Enviar por Email]            │ │
│  │ Check-out: 18/01/25 │  [Adicionar ao Calendário]     │ │
│  │ Noites: 3            │  [Voltar ao Início]            │ │
│  │ Quarto: Suíte Master │                                 │ │
│  │ Total: R$ 700,00     │                                 │ │
│  │                     │                                 │ │
│  │ Próximos Passos:     │                                 │ │
│  │ ✅ Email enviado     │                                 │ │
│  │ ✅ Chegue no dia...  │                                 │ │
│  │ ✅ Traga documento... │                                 │ │
│  └─────────────────────┴─────────────────────────────────┘ │
│                                                             │
│  [Explorar Mais] [Fazer Outra Reserva]                    │
└─────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Download de PDF de confirmação
- ✅ Envio de email (automático + botão manual)
- ✅ Adicionar ao calendário (Google, Outlook, iCal)
- ✅ Compartilhar reserva (WhatsApp, Email)
- ✅ QR Code para check-in rápido
- ✅ Link para modificar/cancelar reserva

---

## 🎨 DESIGN SYSTEM

### **Cores**

**Primárias:**
- Azul Oceano: `#0066CC` (Principal, CTAs)
- Azul Claro: `#E6F2FF` (Backgrounds, hovers)

**Secundárias:**
- Verde: `#00AA44` (Disponível, sucesso)
- Vermelho: `#CC0000` (Indisponível, erro)
- Amarelo: `#FFAA00` (Avisos, promoções)

**Neutras:**
- Cinza Escuro: `#1A1A1A` (Textos)
- Cinza Médio: `#666666` (Textos secundários)
- Cinza Claro: `#F5F5F5` (Backgrounds)

### **Tipografia**

**Títulos:**
- Font: Inter, sans-serif
- Pesos: 700 (Bold), 600 (SemiBold)

**Corpo:**
- Font: Inter, sans-serif
- Peso: 400 (Regular)
- Tamanhos: 14px (base), 16px (destaque)

### **Componentes**

**Botões:**
- Primário: Azul Oceano, texto branco, padding 12px 24px
- Secundário: Borda azul, texto azul, fundo branco
- Desabilitado: Cinza, cursor not-allowed, opacity 0.5

**Cards:**
- Border radius: 12px
- Sombra: 0 2px 8px rgba(0,0,0,0.1)
- Hover: Sombra aumentada, transform scale(1.02)

**Inputs:**
- Border: 1px solid #DDD
- Border radius: 8px
- Padding: 12px 16px
- Focus: Borda azul, outline azul

---

## 📱 RESPONSIVIDADE

### **Breakpoints**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### **Adaptações Mobile**

1. **Booking Bar:**
   - Vira bottom sheet
   - Campos empilhados verticalmente
   - Botão full-width

2. **Lista de Quartos:**
   - Grid 1 coluna
   - Cards full-width
   - Imagens maiores

3. **Página de Detalhes:**
   - Widget de reserva vira bottom sheet fixo
   - Galeria em carrossel horizontal
   - Conteúdo empilhado verticalmente

4. **Formulário:**
   - Campos full-width
   - Botões full-width
   - Teclado numérico para datas

---

## ⚡ PERFORMANCE

### **Otimizações**

1. **Imagens:**
   - Lazy loading
   - WebP format
   - Responsive images (srcset)
   - Placeholder blur

2. **API Calls:**
   - Cache de disponibilidade (5 minutos)
   - Debounce em buscas
   - Paginação de resultados
   - Loading states

3. **Code Splitting:**
   - Lazy load de componentes pesados
   - Route-based code splitting
   - Dynamic imports

---

## 🔒 SEGURANÇA E CONFIABILIDADE

### **Validações**

1. **Client-side:**
   - Validação de formato de email
   - Validação de datas
   - Validação de capacidade
   - Feedback visual imediato

2. **Server-side:**
   - Validação completa de todos os campos
   - Verificação de disponibilidade em tempo real
   - Prevenção de double-booking
   - Sanitização de inputs

### **Proteções**

- Rate limiting em APIs
- CSRF protection
- XSS prevention
- SQL injection prevention
- HTTPS obrigatório

---

## 📊 MÉTRICAS DE SUCESSO

### **KPIs**

1. **Conversão:**
   - Taxa de conversão: Visitas → Reservas
   - Meta: > 3%

2. **Engajamento:**
   - Tempo na página de detalhes
   - Taxa de cliques em "Ver Detalhes"
   - Taxa de abandono no formulário

3. **Performance:**
   - Tempo de carregamento < 2s
   - First Contentful Paint < 1s
   - Time to Interactive < 3s

4. **Satisfação:**
   - NPS (Net Promoter Score)
   - Taxa de cancelamento
   - Reclamações

---

## 🚀 ROADMAP DE IMPLEMENTAÇÃO

### **Fase 1: Correções Críticas (Imediato)**
- ✅ Corrigir erros de fetch (URLs relativas)
- ✅ Filtrar apenas quartos disponíveis na lista
- ✅ Melhorar feedback visual de disponibilidade

### **Fase 2: Melhorias UX (Curto Prazo)**
- [ ] Implementar formulário progressivo
- [ ] Adicionar filtros e ordenação
- [ ] Melhorar widget de reserva sticky
- [ ] Adicionar comparação de quartos

### **Fase 3: Features Avançadas (Médio Prazo)**
- [ ] Sistema de avaliações
- [ ] Recomendações personalizadas
- [ ] Histórico de reservas
- [ ] Programa de fidelidade

### **Fase 4: Otimizações (Longo Prazo)**
- [ ] A/B testing
- [ ] Analytics avançado
- [ ] Machine learning para preços dinâmicos
- [ ] Integração com sistemas externos (PMS)

---

## 📚 REFERÊNCIAS

### **Inspirações**
- Airbnb: Experiência visual, galeria de fotos, confiança
- Booking.com: Filtros poderosos, comparação, transparência
- Expedia: Simplicidade, velocidade, mobile-first

### **Padrões de UI**
- Material Design (Google)
- Human Interface Guidelines (Apple)
- Design System do Next.js

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### **Página de Busca (/reservas)**
- [ ] Mostrar apenas quartos disponíveis
- [ ] Filtros funcionais (preço, amenidades, vista)
- [ ] Ordenação (preço, popularidade)
- [ ] Cards de quarto melhorados
- [ ] Loading states
- [ ] Empty states
- [ ] Error states

### **Página de Detalhes (/quartos/[code])**
- [ ] Galeria completa com lightbox
- [ ] Widget de reserva sticky
- [ ] Formulário progressivo
- [ ] Validação em tempo real
- [ ] Cálculo automático de preço
- [ ] Mapa do hotel
- [ ] Quartos similares

### **Página de Confirmação (/reservas/confirmacao)**
- [ ] Design celebratório
- [ ] Download de PDF
- [ ] Envio de email
- [ ] Adicionar ao calendário
- [ ] QR Code para check-in
- [ ] Link para modificar/cancelar

### **Componentes Globais**
- [ ] BookingBar melhorado
- [ ] Sistema de notificações (toast)
- [ ] Modais de confirmação
- [ ] Loading overlays

---

**Documento criado em:** Janeiro 2025  
**Versão:** 1.0  
**Autor:** Equipe de Desenvolvimento Hotel Sonata

