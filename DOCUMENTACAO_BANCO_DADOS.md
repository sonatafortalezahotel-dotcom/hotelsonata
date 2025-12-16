# Documentação - Estrutura do Banco de Dados e APIs
## Hotel Sonata de Iracema

---

## 📊 ESTRUTURA DO BANCO DE DADOS

### 1. **Tabela: `users`** (Usuários do Painel Admin)
Gerenciamento de usuários administrativos do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `name` | text | Nome do usuário |
| `email` | text | Email único |
| `password` | text | Hash da senha |
| `role` | varchar(20) | Função: "admin" ou "editor" |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

---

### 2. **Tabela: `highlights`** (Destaques do Carrossel Principal)
Destaques com vídeo de drone e promoções dos próximos 3 meses.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `title` | text | Título |
| `description` | text | Descrição |
| `image_url` | text | URL da imagem |
| `video_url` | text | URL do vídeo (drone) |
| `link` | text | Link de destino |
| `start_date` | date | Data de início |
| `end_date` | date | Data de término |
| `active` | boolean | Ativo/Inativo |
| `order` | integer | Ordem de exibição |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

**Tabela Relacionada: `highlight_translations`**
- Suporta traduções em PT, ES, EN
- Campos: `highlight_id`, `locale`, `title`, `description`

---

### 3. **Tabela: `packages`** (Pacotes Promocionais)
Pacotes até o final do ano: Cabana Kids, Pet Friendly, Day Use, Casamento, Eventos, Núpcias.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `name` | text | Nome do pacote |
| `description` | text | Descrição |
| `image_url` | text | URL da imagem |
| `price` | integer | Preço (em centavos) |
| `start_date` | date | Data de início |
| `end_date` | date | Data de término |
| `active` | boolean | Ativo/Inativo |
| `order` | integer | Ordem de exibição |
| `category` | varchar(50) | Categoria: "cabana-kids", "pet-friendly", "day-use", "casamento", "eventos", "nupcias" |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

**Tabela Relacionada: `package_translations`**
- Suporta traduções em PT, ES, EN
- Campos: `package_id`, `locale`, `name`, `description`

---

### 4. **Tabela: `rooms`** (Quartos/Acomodações)
Quartos Standard/Modernizados e Novas Suítes Luxo.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `code` | varchar(50) | Código único: "standard", "luxo", "suite-luxo" |
| `size` | integer | Metros quadrados (ex: 20m²) |
| `max_guests` | integer | Capacidade máxima de hóspedes |
| `has_sea_view` | boolean | Vista para o mar |
| `has_balcony` | boolean | Possui varanda |
| `amenities` | jsonb | Array de amenidades (ex: ["WiFi", "Ar-condicionado"]) |
| `base_price` | integer | Preço base (em centavos) |
| `image_url` | text | URL da imagem principal |
| `gallery` | jsonb | Array de URLs de imagens da galeria |
| `active` | boolean | Ativo/Inativo |
| `order` | integer | Ordem de exibição |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

**Tabela Relacionada: `room_translations`**
- Suporta traduções em PT, ES, EN
- Campos: `room_id`, `locale`, `name`, `description`, `short_description`, `amenities` (traduzidas)

---

### 5. **Tabela: `gastronomy`** (Gastronomia)
Café da manhã premiado, restaurante, bar, room service.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `type` | varchar(50) | Tipo: "cafe-manha", "restaurante", "bar", "room-service" |
| `image_url` | text | URL da imagem |
| `gallery` | jsonb | Array de URLs de imagens |
| `schedule` | jsonb | Horários de funcionamento (JSON) |
| `active` | boolean | Ativo/Inativo |
| `order` | integer | Ordem de exibição |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

**Tabela Relacionada: `gastronomy_translations`**
- Suporta traduções em PT, ES, EN
- Campos: `gastronomy_id`, `locale`, `title`, `description`, `menu` (estrutura de menu traduzido)

---

### 6. **Tabela: `leisure`** (Lazer/Atividades)
Piscina, Academia, Beach Tennis, Bike, Spa.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `type` | varchar(50) | Tipo: "piscina", "academia", "beach-tennis", "bike", "spa" |
| `image_url` | text | URL da imagem |
| `gallery` | jsonb | Array de URLs de imagens |
| `icon` | varchar(50) | Nome do ícone |
| `active` | boolean | Ativo/Inativo |
| `order` | integer | Ordem de exibição |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

**Tabela Relacionada: `leisure_translations`**
- Suporta traduções em PT, ES, EN
- Campos: `leisure_id`, `locale`, `title`, `description`, `schedule`

---

### 7. **Tabela: `events`** (Eventos)
Eventos corporativos, casamentos, núpcias, sociais.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `type` | varchar(50) | Tipo: "corporativo", "casamento", "nupcias", "social" |
| `capacity` | integer | Capacidade de pessoas |
| `image_url` | text | URL da imagem |
| `gallery` | jsonb | Array de URLs de imagens |
| `facilities` | jsonb | Array de facilidades |
| `active` | boolean | Ativo/Inativo |
| `order` | integer | Ordem de exibição |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

**Tabela Relacionada: `event_translations`**
- Suporta traduções em PT, ES, EN
- Campos: `event_id`, `locale`, `title`, `description`, `facilities` (traduzidas)

---

### 8. **Tabela: `contact_info`** (Informações de Contato)
Telefone, email, endereço, WhatsApp, Instagram, Facebook.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `type` | varchar(50) | Tipo: "telefone", "email", "endereco", "whatsapp", "instagram", "facebook" |
| `value` | text | Valor (número, email, URL, etc) |
| `label` | text | Rótulo |
| `order` | integer | Ordem de exibição |
| `active` | boolean | Ativo/Inativo |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

**Tabela Relacionada: `contact_info_translations`**
- Suporta traduções em PT, ES, EN
- Campos: `contact_info_id`, `locale`, `label`

---

### 9. **Tabela: `seo_metadata`** (SEO Internacional)
Metadados SEO por página e idioma para otimização de busca.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `page` | varchar(100) | Página: "home", "quartos", "gastronomia", "lazer", "eventos", "esg", "contatos" |
| `locale` | varchar(5) | Idioma: "pt", "es", "en" |
| `title` | text | Título SEO |
| `description` | text | Meta description |
| `keywords` | text | Palavras-chave (separadas por vírgula) |
| `og_image` | text | Imagem Open Graph |
| `canonical_url` | text | URL canônica |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

**Palavras-chave principais para SEO:**
- Hotel em Fortaleza
- Hotel beira mar em Fortaleza
- Hotel Sonata de Iracema
- Hotel Sonata
- Pousada em fortaleza
- Hotel Ceará
- Pousada Ceará
- Hospedagem Fortaleza
- Hotel frente mar Fortaleza
- Hotel na Praia de Iracema

---

### 10. **Tabela: `site_settings`** (Configurações do Site)
Configurações gerais do site (redes sociais, endereço, etc).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `key` | varchar(100) | Chave única (ex: "instagram_url", "address", "phone") |
| `value` | text | Valor da configuração |
| `type` | varchar(50) | Tipo: "text", "json", "url", "image" |
| `description` | text | Descrição da configuração |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

**Exemplos de configurações:**
- `instagram_url`: URL do Instagram
- `facebook_url`: URL do Facebook
- `whatsapp_number`: Número do WhatsApp
- `address`: Endereço completo
- `phone`: Telefone principal
- `email`: Email de contato
- `booking_engine_url`: URL do motor de reservas

---

### 11. **Tabela: `gallery`** (Galeria de Fotos)
Fotos gerais do hotel: piscina, recepção, restaurante, quarto, etc.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `title` | text | Título da foto |
| `image_url` | text | URL da imagem |
| `category` | varchar(50) | Categoria: "piscina", "recepcao", "restaurante", "quarto", "geral" |
| `order` | integer | Ordem de exibição |
| `active` | boolean | Ativo/Inativo |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

---

### 12. **Tabela: `sustainability`** (Sustentabilidade e Inclusão)
Ações de sustentabilidade, inclusão, obras locais e ações sociais.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `title` | text | Título |
| `description` | text | Descrição |
| `image_url` | text | URL da imagem |
| `category` | varchar(50) | Categoria: "sustentabilidade", "inclusao", "acoes-sociais", "obras-locais" |
| `order` | integer | Ordem de exibição |
| `active` | boolean | Ativo/Inativo |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

**Tabela Relacionada: `sustainability_translations`**
- Suporta traduções em PT, ES, EN
- Campos: `sustainability_id`, `locale`, `title`, `description`

---

### 13. **Tabela: `certifications`** (Selos e Certificações)
Selos ganhos: SEBRAE, Pet Friendly, etc.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `name` | text | Nome do selo |
| `image_url` | text | URL da imagem do selo |
| `description` | text | Descrição |
| `order` | integer | Ordem de exibição |
| `active` | boolean | Ativo/Inativo |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

**Tabela Relacionada: `certification_translations`**
- Suporta traduções em PT, ES, EN
- Campos: `certification_id`, `locale`, `name`, `description`

---

### 14. **Tabela: `social_media_posts`** (Posts das Redes Sociais)
Fotos que estão circulando no Instagram.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `platform` | varchar(20) | Plataforma: "instagram", "facebook" |
| `image_url` | text | URL da imagem |
| `link` | text | Link do post |
| `order` | integer | Ordem de exibição |
| `active` | boolean | Ativo/Inativo |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

---

### 15. **Tabela: `event_leads`** (Leads de Eventos - B2B)
Captação de leads corporativos para eventos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | serial | ID único (PK) |
| `name` | text | Nome do contato |
| `email` | text | Email |
| `phone` | text | Telefone |
| `company` | text | Empresa |
| `event_type` | varchar(50) | Tipo de evento |
| `event_date` | date | Data do evento |
| `guests` | integer | Número de convidados |
| `message` | text | Mensagem |
| `status` | varchar(20) | Status: "new", "contacted", "quoted", "closed" |
| `created_at` | timestamp | Data de criação |
| `updated_at` | timestamp | Data de atualização |

---

## 🔌 APIs IMPLEMENTADAS

### Endpoints Disponíveis:

1. **`GET /api/highlights?locale=pt&active=true`**
   - Retorna destaques do carrossel principal
   - Suporta filtro por idioma e status ativo

2. **`GET /api/packages?locale=pt&active=true`**
   - Retorna pacotes promocionais
   - Suporta filtro por idioma e status ativo

3. **`GET /api/rooms?locale=pt&active=true`**
   - Retorna quartos/acomodações
   - Suporta filtro por idioma e status ativo

4. **`GET /api/gastronomy?locale=pt&active=true`**
   - Retorna informações de gastronomia
   - Suporta filtro por idioma e status ativo

5. **`GET /api/leisure?locale=pt&active=true`**
   - Retorna atividades de lazer
   - Suporta filtro por idioma e status ativo

6. **`GET /api/events?locale=pt&active=true`**
   - Retorna informações de eventos
   - Suporta filtro por idioma e status ativo

7. **`GET /api/contact?locale=pt&active=true`**
   - Retorna informações de contato
   - Suporta filtro por idioma e status ativo

8. **`GET /api/gallery?active=true`**
   - Retorna galeria de fotos
   - Suporta filtro por status ativo

9. **`GET /api/sustainability?locale=pt&active=true`**
   - Retorna ações de sustentabilidade
   - Suporta filtro por idioma e status ativo

10. **`GET /api/certifications?locale=pt&active=true`**
    - Retorna selos e certificações
    - Suporta filtro por idioma e status ativo

11. **`GET /api/social-media?active=true`**
    - Retorna posts das redes sociais
    - Suporta filtro por status ativo

12. **`GET /api/seo?page=home&locale=pt`**
    - Retorna metadados SEO para uma página específica
    - Requer parâmetros: `page` e `locale`

13. **`GET /api/settings?key=instagram_url`**
    - Retorna configurações do site
    - Pode buscar por chave específica ou todas as configurações

14. **`GET /api/event-leads`**
    - Retorna todos os leads de eventos (B2B)

15. **`POST /api/event-leads`**
    - Cria um novo lead de evento
    - Body: `{ name, email, phone?, company?, eventType?, eventDate?, guests?, message? }`

---

## 🌐 SISTEMA DE INTERNACIONALIZAÇÃO (i18n)

### Idiomas Suportados:
- **PT** (Português) - Idioma padrão
- **ES** (Espanhol)
- **EN** (Inglês)

### Estrutura:
- Todas as tabelas de conteúdo possuem tabelas de tradução relacionadas
- As APIs aceitam parâmetro `locale` para retornar conteúdo traduzido
- Sistema de fallback: se não houver tradução, retorna o conteúdo padrão (PT)

### Arquivo: `lib/i18n.ts`
- Define tipos e constantes de idiomas
- Contém traduções básicas de interface (menu, botões, etc)

---

## 🔐 ESTRUTURA DO PAINEL ADMIN

### Tabela de Usuários:
- Sistema de autenticação com hash de senha
- Níveis de acesso: `admin` e `editor`
- Campos: `id`, `name`, `email`, `password`, `role`

### Funcionalidades Planejadas do Painel:
1. **Gerenciamento de Conteúdo:**
   - CRUD de Destaques (highlights)
   - CRUD de Pacotes
   - CRUD de Quartos
   - CRUD de Gastronomia
   - CRUD de Lazer
   - CRUD de Eventos
   - CRUD de Galeria
   - CRUD de Sustentabilidade
   - CRUD de Certificações
   - CRUD de Posts de Redes Sociais

2. **Gerenciamento de Traduções:**
   - Interface para adicionar/editar traduções em PT, ES, EN
   - Validação de campos obrigatórios por idioma

3. **Gerenciamento de SEO:**
   - Edição de metadados por página e idioma
   - Preview de como aparecerá nos resultados de busca

4. **Gerenciamento de Configurações:**
   - Edição de informações de contato
   - Links de redes sociais
   - Configurações gerais do site

5. **Gerenciamento de Leads:**
   - Visualização de leads de eventos (B2B)
   - Atualização de status dos leads
   - Exportação de dados

6. **Gerenciamento de Usuários:**
   - CRUD de usuários do painel
   - Controle de permissões

---

## 📝 PRÓXIMOS PASSOS

1. **Criar migrações do banco de dados:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

2. **Implementar painel admin:**
   - Criar rotas de autenticação
   - Criar interface administrativa
   - Implementar CRUDs para todas as entidades

3. **Sistema de upload de imagens:**
   - ✅ Integração com Vercel Blob Storage implementada
   - ✅ APIs de upload único e múltiplo criadas
   - ✅ Validações de tipo e tamanho implementadas
   - 📄 Ver documentação completa em `DOCUMENTACAO_UPLOAD.md`

4. **Integração com motor de reservas:**
   - Configurar integração com Omnibees ou similar
   - Implementar redirecionamento do BookingBar

---

## 🔍 OBSERVAÇÕES IMPORTANTES

1. **Nunca usar dados mockados** - Todas as informações devem vir do banco de dados
2. **SEO Internacional** - Todas as páginas devem ter metadados SEO por idioma
3. **Performance** - APIs otimizadas com filtros e ordenação
4. **Segurança** - Senhas devem ser hasheadas (bcrypt recomendado)
5. **Validação** - Todas as APIs devem validar dados de entrada

---

**Documentação criada em:** 2025
**Versão do Schema:** 1.0
**Status:** ✅ Estrutura completa implementada

---

## 📤 SISTEMA DE UPLOAD DE ARQUIVOS

### Configuração
- ✅ Integração com **Vercel Blob Storage**
- ✅ Token configurado: `BLOB_READ_WRITE_TOKEN`
- ✅ APIs de upload implementadas

### Endpoints de Upload:
- ✅ `POST /api/upload` - Upload de arquivo único
- ✅ `POST /api/upload/multiple` - Upload de múltiplos arquivos
- ✅ `DELETE /api/upload/delete` - Deletar arquivo

### Validações:
- ✅ Tipos permitidos: Imagens e Vídeos
- ✅ Tamanho máximo: 10MB (imagens) / 100MB (vídeos)
- ✅ Nomes únicos gerados automaticamente

📄 **Documentação completa:** Ver `DOCUMENTACAO_UPLOAD.md`

