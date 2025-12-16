# 📸 MAPEAMENTO COMPLETO: ONDE CADA FOTO APARECE NO SITE

## 🎯 GUIA RÁPIDO PARA ADMINISTRADORES

Este documento mostra **exatamente** onde cada foto cadastrada no admin aparece no site público.

---

## 1️⃣ **DESTAQUES (Highlights)** - `/admin/highlights`

### 📍 Onde Aparece:
- **Homepage (Página Inicial)** - Carrossel principal no topo da página
- **Componente:** `VideoCarousel` (carrossel com vídeo/imagem de fundo)

### 📋 Como Funciona:
- **Imagem (`imageUrl`)**: Aparece como imagem de fundo do carrossel
- **Vídeo (`videoUrl`)**: Se preenchido, o vídeo aparece por cima da imagem
- **Ordem (`order`)**: Define a sequência de exibição (menor número aparece primeiro)
- **Período (`startDate` / `endDate`)**: Controla quando o destaque é exibido
- **Status (`active`)**: Precisa estar "Ativo" para aparecer

### 💡 Dicas:
- Use imagens de alta qualidade (1920x1080 ou superior)
- A ordem define qual destaque aparece primeiro
- Apenas destaques com `active = true` e dentro do período aparecem

---

## 2️⃣ **GALERIA** - `/admin/gallery`

### 📍 Onde Aparece:

#### **Homepage (Página Inicial):**
1. **Seção "Experiências Visuais"** - Cards interativos
   - Fotos com categoria `"piscina"` → Card "Piscina Vista Mar"
   - Fotos com categoria `"gastronomia"` ou `"restaurante"` → Card "Gastronomia Regional"
   - Fotos com categoria `"quarto"` ou `"recepcao"` → Card "Quartos Confortáveis"
   - Fotos com categoria `"spa"` ou `"academia"` → Card "Spa & Bem-Estar"
   - Fotos com categoria `"lazer"` ou `"esporte"` → Card "Beach Tennis"
   - Fotos com categoria `"sustentabilidade"` ou `"geral"` → Card "Sustentabilidade"

2. **Seção "Um Dia no Hotel" (PhotoStory)**
   - `"piscina"` → Manhã (nascer do sol)
   - `"gastronomia"` ou `"cafe"` → Café da manhã
   - `"lazer"` → Passeio de bike
   - `"esporte"` → Beach Tennis
   - `"restaurante"` ou `"gastronomia"` → Almoço
   - `"spa"` → Spa
   - `"piscina"` (2ª foto) → Tarde na piscina
   - `"piscina"` (3ª foto) → Pôr do sol

3. **Seção "Galeria - Momentos Inesquecíveis"**
   - Primeiras 9 fotos (todas as categorias)
   - Ordenadas por `order` (menor primeiro)

4. **Seção "Praia de Iracema - Localização"**
   - Fotos com categoria `"geral"` ou `"localizacao"` → Cards de pontos turísticos

#### **Página Quartos (`/quartos`):**
- Hero (imagem principal) - Primeira foto com categoria `"quarto"`
- Galeria Visual - Fotos com categoria `"quarto"`, `"piscina"` ou `"recepcao"` (primeiras 6)
- PhotoStory - Fotos com categoria `"quarto"` (4 fotos)

#### **Página Gastronomia (`/gastronomia`):**
- Hero - Foto com categoria `"restaurante"` ou `"gastronomia"`
- Cards de Café da Manhã - Fotos com categoria `"cafe"` ou `"gastronomia"` (primeiras 4)
- Cards de Restaurante - Fotos com categoria `"restaurante"` ou `"gastronomia"` (primeiras 5)
- Galeria de Pratos - Fotos com categoria `"cafe"` ou `"gastronomia"` (primeiras 6)
- PhotoStory - Fotos com categoria `"restaurante"` ou `"gastronomia"`

### 📋 Categorias Disponíveis:
- `"piscina"` - Fotos da piscina
- `"recepcao"` - Fotos da recepção
- `"restaurante"` - Fotos do restaurante
- `"quarto"` - Fotos dos quartos
- `"gastronomia"` - Fotos de pratos/comida
- `"cafe"` - Fotos do café da manhã
- `"spa"` - Fotos do spa
- `"academia"` - Fotos da academia
- `"lazer"` - Fotos de atividades de lazer
- `"esporte"` - Fotos de esportes
- `"sustentabilidade"` - Fotos de ações sustentáveis
- `"geral"` - Fotos gerais (usadas em vários lugares)
- `"localizacao"` - Fotos de pontos turísticos

### 💡 Dicas:
- **Use a categoria correta** - Isso define onde a foto aparece
- **Ordem importa** - Fotos com `order` menor aparecem primeiro
- **Título ajuda** - Use títulos descritivos para melhor organização

---

## 3️⃣ **PACOTES** - `/admin/packages`

### 📍 Onde Aparece:
- **Homepage** - Seção "Pacotes Promocionais"
- **Componente:** `PackagesSection`

### 📋 Como Funciona:
- **Imagem (`imageUrl`)**: Aparece no card do pacote
- **Ordem (`order`)**: Define a posição na grade (menor primeiro)
- **Categoria (`category`)**: Agrupa pacotes similares
- **Período (`startDate` / `endDate`)**: Controla quando o pacote é exibido
- **Status (`active`)**: Precisa estar "Ativo" para aparecer

### 💡 Dicas:
- Use imagens horizontais (16:9) para melhor visualização
- A ordem define a posição na grade (esquerda para direita, cima para baixo)

---

## 4️⃣ **QUARTOS** - `/admin/rooms`

### 📍 Onde Aparece:
- **Página Quartos (`/quartos`)** - Seção principal de quartos
- **Componente:** `RoomsPageContent`

### 📋 Como Funciona:
- **Imagem Principal (`imageUrl`)**: Aparece no card do quarto
- **Galeria (`gallery`)**: Array de URLs - aparece na página de detalhes do quarto
- **Status (`active`)**: Precisa estar "Ativo" para aparecer

### 💡 Dicas:
- A imagem principal deve ser a melhor foto do quarto
- A galeria pode ter múltiplas fotos (formato JSON array)

---

## 5️⃣ **GASTRONOMIA** - `/admin/gastronomy`

### 📍 Onde Aparece:
- **Página Gastronomia (`/gastronomia`)** - Cards de café da manhã e restaurante
- **Componente:** `AmenityCard`

### 📋 Como Funciona:
- **Imagem Principal (`imageUrl`)**: Aparece no card
- **Galeria (`gallery`)**: Array de URLs - aparece no carrossel do card
- **Tipo (`type`)**: Define qual seção usa a foto
  - `"cafe"` ou `"cafe-da-manha"` → Card de Café da Manhã
  - `"restaurante"` → Card de Restaurante
- **Status (`active`)**: Precisa estar "Ativo" para aparecer

### 💡 Dicas:
- Use a galeria para mostrar múltiplos pratos
- O tipo define em qual card a foto aparece

---

## 6️⃣ **LAZER** - `/admin/leisure`

### 📍 Onde Aparece:
- **Página Lazer (`/lazer`)** - Cards de atividades
- **Componente:** `LeisureServicesSection`

### 📋 Como Funciona:
- **Imagem Principal (`imageUrl`)**: Aparece no card da atividade
- **Galeria (`gallery`)**: Array de URLs - aparece na galeria da atividade
- **Tipo (`type`)**: Define qual atividade
  - `"piscina"` → Card de Piscina
  - `"academia"` → Card de Academia
  - `"beach-tennis"` → Card de Beach Tennis
  - `"bike"` → Card de Bike
  - `"spa"` → Card de Spa
- **Status (`active`)**: Precisa estar "Ativo" para aparecer

---

## 7️⃣ **EVENTOS** - `/admin/events`

### 📍 Onde Aparece:
- **Página Eventos (`/eventos`)** - Cards de salas de eventos
- **Componente:** `EventRoomCard`

### 📋 Como Funciona:
- **Imagem Principal (`imageUrl`)**: Aparece no card do evento
- **Galeria (`gallery`)**: Array de URLs - aparece na galeria do evento
- **Tipo (`type`)**: Define qual tipo de evento
  - `"corporativo"` → Eventos corporativos
  - `"casamento"` → Casamentos
  - `"nupcias"` → Núpcias
  - `"social"` → Eventos sociais
- **Status (`active`)**: Precisa estar "Ativo" para aparecer

---

## 8️⃣ **SUSTENTABILIDADE** - `/admin/sustainability`

### 📍 Onde Aparece:
- **Homepage** - Seção "Sustentabilidade e Inclusão"
- **Página ESG (`/esg`)** - Seção principal
- **Componente:** `SustainabilitySection`

### 📋 Como Funciona:
- **Imagem (`imageUrl`)**: Aparece no card de sustentabilidade
- **Categoria (`category`)**: Agrupa itens similares
  - `"sustentabilidade"` → Ações sustentáveis
  - `"inclusao"` → Ações de inclusão
  - `"acoes-sociais"` → Ações sociais
  - `"obras-locais"` → Obras locais
- **Ordem (`order`)**: Define a posição (menor primeiro)
- **Status (`active`)**: Precisa estar "Ativo" para aparecer

---

## 9️⃣ **CERTIFICAÇÕES** - `/admin/certifications`

### 📍 Onde Aparece:
- **Homepage** - Seção "Certificações e Selos"
- **Componente:** `CertificationsSection`

### 📋 Como Funciona:
- **Imagem (`imageUrl`)**: Aparece como logo/selo da certificação
- **Ordem (`order`)**: Define a posição (menor primeiro)
- **Status (`active`)**: Precisa estar "Ativo" para aparecer

### 💡 Dicas:
- Use imagens quadradas ou horizontais (logos/selos)
- A ordem define a sequência de exibição

---

## 🔟 **REDES SOCIAIS** - `/admin/social-media`

### 📍 Onde Aparece:
- **Homepage** - Seção "Nos Acompanhe nas Redes Sociais"
- **Componente:** `SocialMediaFeed`

### 📋 Como Funciona:
- **Imagem (`imageUrl`)**: Aparece no grid de posts
- **Plataforma (`platform`)**: Define o ícone (Instagram, Facebook, Twitter)
- **Link (`link`)**: Link para o post original
- **Ordem (`order`)**: Define a posição no grid (menor primeiro)
- **Status (`active`)**: Precisa estar "Ativo" para aparecer

### 💡 Dicas:
- Use imagens quadradas (1:1) para melhor visualização
- O grid mostra até 6-12 posts (dependendo do tamanho da tela)

---

## 📊 RESUMO VISUAL

### Homepage (Ordem de Aparição):
1. **Destaques** (Highlights) - Carrossel principal
2. **Pacotes** - Seção de pacotes promocionais
3. **Carrossel de Fotos** - Fotos da galeria
4. **Experiências Visuais** - Cards com fotos da galeria (por categoria)
5. **Um Dia no Hotel** - PhotoStory com fotos da galeria
6. **Galeria** - Grid com 9 fotos da galeria
7. **Localização** - Cards com fotos da galeria (categoria "geral" ou "localizacao")
8. **Sustentabilidade** - Cards de sustentabilidade
9. **Certificações** - Logos/selos
10. **Redes Sociais** - Grid de posts

---

## ✅ CHECKLIST PARA CADASTRAR FOTOS

### Antes de Cadastrar:
- [ ] Defina a **categoria** correta (para galeria)
- [ ] Defina a **ordem** (menor número aparece primeiro)
- [ ] Verifique o **período** (para highlights e pacotes)
- [ ] Ative o **status** (active = true)
- [ ] Use imagens de **boa qualidade** (mínimo 1920px de largura para hero)

### Ao Cadastrar na Galeria:
- [ ] Escolha a categoria que define onde a foto aparece
- [ ] Use títulos descritivos
- [ ] Defina a ordem para controlar a sequência
- [ ] Ative o status

---

## 🎨 TAMANHOS RECOMENDADOS DE IMAGENS

- **Hero/Carrossel Principal**: 1920x1080px (16:9)
- **Cards de Pacotes**: 800x450px (16:9)
- **Galeria**: 1200x800px (3:2) ou 1200x1200px (1:1)
- **Redes Sociais**: 1080x1080px (1:1)
- **Certificações**: 300x300px (1:1) ou 400x200px (2:1)

---

## 🚨 PROBLEMAS COMUNS

### Foto não aparece?
1. Verifique se `active = true`
2. Verifique o período (para highlights e pacotes)
3. Verifique a categoria (para galeria)
4. Limpe o cache do navegador

### Foto aparece no lugar errado?
1. Verifique a categoria da galeria
2. Verifique o tipo (para gastronomia, lazer, eventos)
3. Verifique a ordem

### Ordem não funciona?
1. Certifique-se de que os números estão corretos
2. Menor número aparece primeiro
3. Pode haver cache - aguarde alguns minutos

---

**Última atualização:** Janeiro 2025
**Versão:** 1.0

