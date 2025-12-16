# 🌱 Script de Seed - Dados de Teste

Este script popula o banco de dados com dados de teste profissionais para o Hotel Sonata de Iracema.

## 📋 O que será criado:

- ✅ **3 Destaques** (carrossel principal) - com traduções PT/ES/EN
- ✅ **3 Quartos** (Standard, Luxo, Suíte Master) - com traduções e amenidades
- ✅ **3 Pacotes** (Romântico, Familiar, Day Use) - com traduções
- ✅ **2 Certificações** (TripAdvisor, Booking.com) - com traduções
- ✅ **3 Pontos Turísticos** (Praia de Iracema, Ponte dos Ingleses, Dragão do Mar) - com traduções
- ✅ **2 Eventos** (Casamentos, Corporativos) - com traduções
- ✅ **~200+ Imagens da Galeria** organizadas por:
  - **Home**: Experiências (Piscina, Gastronomia, Quartos, Spa, Beach Tennis, Sustentabilidade), Photo Story, Galeria de Momentos, Pontos Turísticos
  - **Lazer**: Hero, Galeria Piscina, Photo Story, Academia, Atividades, Spa, Cards de Atividades, Localização
  - **Gastronomia**: Hero, Cards (Café da Manhã, Restaurante), Galerias, Photo Story
  - **ESG**: Hero, Galeria de Práticas, Photo Story, Ações Sociais
  - **Contato**: Hero, Galeria Equipe, Localização
  - **Reservas**: Hero
  - **SEO Landing Pages**: Hero, Galerias (Quartos, Gastronomia, Lazer, Geral, Localização) - cada seção com versões PT/ES/EN
- ✅ **2 Reservas de Exemplo** (para testes)

## 🚀 Como usar:

### 1. Certifique-se de ter as variáveis de ambiente configuradas:

```env
DATABASE_URL=postgresql://...
```

### 2. Execute o script:

```bash
npm run seed:hotel
```

Ou diretamente:

```bash
npx tsx scripts/seed-hotel-data.ts
```

## 📸 Imagens

O script utiliza imagens do Unsplash como placeholders. Em produção, você deve substituir essas URLs por imagens reais do hotel através do painel admin em `/admin/images`.

## ⚠️ Avisos

- Este script **não verifica** se os dados já existem antes de inserir
- Se executar múltiplas vezes, pode criar duplicatas
- As imagens são placeholders do Unsplash
- Os preços estão em **centavos** (ex: 20000 = R$ 200,00)

## 🔄 Limpar dados

Para limpar os dados antes de executar novamente, você pode:

1. Usar o Drizzle Studio: `npm run db:studio`
2. Ou executar SQL diretamente no banco

## 📝 Personalização

Para personalizar os dados, edite o arquivo `scripts/seed-hotel-data.ts` e ajuste:

- URLs das imagens
- Textos e descrições
- Preços
- Quantidade de itens

## ✅ Verificação

Após executar, verifique os dados em:

- http://localhost:3000/admin/highlights
- http://localhost:3000/admin/rooms
- http://localhost:3000/admin/packages
- http://localhost:3000/admin/certifications
- http://localhost:3000/admin/nearby-attractions
- http://localhost:3000/admin/events
- http://localhost:3000/admin/images
- http://localhost:3000/admin/reservations

