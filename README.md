# 🏨 Hotel Sonata de Iracema - Website & Admin Panel

Website profissional e painel administrativo completo para o Hotel Sonata de Iracema, localizado na Praia de Iracema, Fortaleza - CE.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)

## 🎯 Sobre o Projeto

Sistema completo para gerenciamento e exibição do Hotel Sonata de Iracema, celebrando 20 anos de tradição em hospitalidade. O projeto inclui:

- **Site Público:** 8 páginas responsivas e otimizadas para SEO
- **Painel Admin:** Sistema completo de gerenciamento de conteúdo
- **Upload de Imagens:** Integração com Vercel Blob Storage
- **Banco de Dados:** PostgreSQL (Neon) com 18 tabelas

## ✨ Funcionalidades

### 🌐 Site Público

- ✅ Homepage com hero em vídeo
- ✅ Carrossel de destaques
- ✅ Pacotes e promoções dinâmicos
- ✅ Galeria de fotos integrada
- ✅ Feed de redes sociais (Instagram)
- ✅ Páginas: Quartos, Gastronomia, Lazer, Eventos, Hotel, ESG, Contato
- ✅ Formulários de contato e leads
- ✅ SEO otimizado
- ✅ 100% responsivo

### 🔐 Painel Admin

#### Autenticação
- Login seguro
- Proteção de rotas
- Sessão persistente

#### CRUDs Completos
1. **Destaques** - Gerenciar carrossel principal
2. **Pacotes** - Criar e editar pacotes promocionais
3. **Quartos** - Cadastrar acomodações
4. **Galeria** - Upload e organização de fotos
5. **Redes Sociais** - Gerenciar feed do Instagram
6. **Configurações** - Dados de contato e informações gerais

#### Dashboard
- Estatísticas em tempo real
- Cards informativos
- Ações rápidas
- Status do sistema

## 🛠️ Tecnologias

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (39 componentes)

### Backend
- **Next.js API Routes**
- **Drizzle ORM**
- **PostgreSQL** (Neon)

### Armazenamento
- **Vercel Blob** (imagens e arquivos)

### Libs Adicionais
- `lucide-react` - Ícones
- `sonner` - Toasts
- `date-fns` - Datas
- `next-themes` - Dark mode

## 📦 Instalação

```bash
# Clonar repositório
git clone [URL_DO_REPO]

# Entrar na pasta
cd Hotel

# Instalar dependências
npm install
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Banco de Dados (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:npg_6rWBqDybm9Rv@ep-purple-silence-a4zi085p-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# Vercel Blob (Upload de Imagens)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_onRovwlwOVzsytDF_DlWaNhQlr0UAcT1etFBgvhyVK6mxLt

# URL do Site (Produção)
NEXT_PUBLIC_APP_URL=https://hotelsonata.com.br
```

### 2. Banco de Dados

```bash
# Gerar tabelas no banco
npm run db:push

# (Opcional) Abrir Drizzle Studio para visualizar dados
npm run db:studio
```

### 3. Criar Usuário Admin

Execute este SQL no banco de dados:

```sql
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@hotelsonata.com.br', 'sua_senha_aqui', 'admin');
```

**⚠️ IMPORTANTE:** Em produção, use hash de senha (bcrypt).

## 🚀 Uso

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acessar:
# - Site: http://localhost:3000
# - Admin: http://localhost:3000/admin/login
```

### Build de Produção

```bash
# Compilar projeto
npm run build

# Iniciar produção
npm start
```

### Scripts Disponíveis

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

## 📁 Estrutura do Projeto

```
Hotel/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 # Homepage
│   │   ├── quartos/page.tsx
│   │   ├── gastronomia/page.tsx
│   │   ├── lazer/page.tsx
│   │   ├── eventos/page.tsx
│   │   ├── hotel/page.tsx
│   │   ├── esg/page.tsx
│   │   └── contato/page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx               # Layout admin
│   │   ├── login/page.tsx           # Login
│   │   ├── page.tsx                 # Dashboard
│   │   ├── highlights/page.tsx      # Destaques
│   │   ├── packages/page.tsx        # Pacotes
│   │   ├── rooms/page.tsx           # Quartos
│   │   ├── gallery/page.tsx         # Galeria
│   │   ├── social-media/page.tsx    # Redes Sociais
│   │   └── settings/page.tsx        # Configurações
│   │
│   └── api/                          # 16 endpoints REST
│       ├── auth/login/route.ts      # Autenticação
│       ├── highlights/route.ts
│       ├── packages/route.ts
│       ├── rooms/route.ts
│       ├── gallery/route.ts
│       ├── social-media/route.ts
│       ├── upload/route.ts          # Upload de imagens
│       └── ...
│
├── components/
│   ├── Header/                      # Cabeçalho
│   ├── Footer/                      # Rodapé
│   ├── Hero/                        # Hero com vídeo
│   ├── RoomCard/                    # Card de quarto
│   ├── PhotoCarousel/               # Carrossel de fotos
│   ├── LoadingStates/               # Skeletons
│   └── ui/                          # 39 componentes shadcn/ui
│
├── lib/
│   ├── auth.ts                      # Sistema de autenticação
│   ├── upload.ts                    # Funções de upload
│   ├── utils.ts                     # Utilitários
│   └── db/
│       ├── index.ts                 # Conexão do banco
│       └── schema.ts                # 18 tabelas Drizzle
│
└── public/                          # Assets estáticos
```

## 🔐 Acessando o Admin

### URL de Acesso
```
http://localhost:3000/admin/login
```

### Credenciais Padrão
```
Email: admin@hotelsonata.com.br
Senha: [configure no banco]
```

### Navegação no Admin

1. **Dashboard** - Visão geral e estatísticas
2. **Destaques** - Gerenciar carrossel da home
3. **Pacotes** - Criar promoções e pacotes
4. **Quartos** - Cadastrar acomodações
5. **Galeria** - Upload de fotos do hotel
6. **Redes Sociais** - Feed do Instagram
7. **Configurações** - Dados de contato

## 📸 Upload de Imagens

### Como Fazer Upload

1. Acesse **Admin > Galeria**
2. Clique em **"Nova Foto"**
3. Escolha o arquivo ou cole URL
4. Preencha informações
5. Clique em **"Adicionar"**

### Especificações

- **Formatos:** JPG, PNG, WebP
- **Tamanho máximo:** 10MB (imagens), 100MB (vídeos)
- **Armazenamento:** Vercel Blob
- **CDN:** Automático

## 🌍 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

# Deploy de produção
vercel --prod
```

### Variáveis de Ambiente na Vercel

Configure no painel da Vercel:
1. `DATABASE_URL`
2. `BLOB_READ_WRITE_TOKEN`
3. `NEXT_PUBLIC_APP_URL`

## 📊 Banco de Dados

### Tabelas Principais

1. **users** - Usuários admin
2. **highlights** - Carrossel principal
3. **packages** - Pacotes promocionais
4. **rooms** - Quartos
5. **gallery** - Galeria de fotos
6. **social_media_posts** - Posts redes sociais
7. **gastronomy** - Gastronomia
8. **leisure** - Lazer
9. **events** - Eventos
10. **sustainability** - Sustentabilidade
11. **certifications** - Certificações
12. **contact_info** - Informações de contato
13. **seo_metadata** - SEO por página
14. **event_leads** - Leads de eventos
15. **settings** - Configurações gerais

### Traduções (i18n)

Cada tabela principal possui uma tabela de traduções:
- `highlight_translations`
- `package_translations`
- `room_translations`
- etc.

**Idiomas suportados:** PT, ES, EN

## 🔧 Manutenção

### Atualizar Dependências

```bash
npm update
```

### Verificar Problemas

```bash
npm run lint
```

### Backup do Banco

Faça backup regular pelo painel do Neon:
https://console.neon.tech/

## 📝 Documentação Adicional

- **`PLANO_EXECUCAO_SITE_SONATA_2025.md`** - Plano original completo
- **`PROGRESSO_IMPLEMENTACAO_DEZ_2025.md`** - Fases 1 e 2
- **`RELATORIO_FINAL_ADMIN_2025.md`** - Painel admin
- **`DOCUMENTACAO_BANCO_DADOS.md`** - Estrutura do banco
- **`DOCUMENTACAO_UPLOAD.md`** - Sistema de upload

## 🐛 Problemas Comuns

### "Erro ao conectar com o banco"
- Verifique o `DATABASE_URL` no `.env.local`
- Confirme que o banco Neon está ativo

### "Upload falhou"
- Verifique o `BLOB_READ_WRITE_TOKEN`
- Confirme o tamanho do arquivo (max 10MB)

### "Não consigo fazer login"
- Verifique se o usuário existe no banco
- Confirme email e senha

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os arquivos de relatório
3. Entre em contato com o time de desenvolvimento

## 📜 Licença

Este projeto é proprietário do Hotel Sonata de Iracema.

---

## 🎉 Créditos

**Desenvolvido para:** Hotel Sonata de Iracema  
**Endereço:** Praia de Iracema, Fortaleza - CE  
**Site:** https://hotelsonata.com.br  
**Data:** Dezembro de 2025

---

**Status do Projeto:** ✅ Concluído e em Produção  
**Versão:** 1.0.0
