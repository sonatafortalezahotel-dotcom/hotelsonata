# 🔐 Guia de Acesso ao Painel Admin

## 📍 Como Acessar o Painel Admin

### 1. Acesse a URL de Login

- **Desenvolvimento:** `http://localhost:3000/admin/login`
- **Produção:** `https://seu-dominio.com/admin/login`

### 2. Credenciais de Acesso

Você precisa ter um usuário criado no banco de dados. Veja abaixo como criar.

---

## 👤 Criar Usuário Admin

### Opção 1: Usando o Script Automático (Recomendado)

Execute o comando:

```powershell
npm run create-admin
```

Isso criará um usuário com as credenciais padrão:
- **Email:** `admin@hotelsonata.com.br`
- **Senha:** `admin123`
- **Nome:** `Administrador`

#### Personalizar Credenciais

Você pode definir variáveis de ambiente antes de executar:

```powershell
$env:ADMIN_EMAIL="seu-email@exemplo.com"
$env:ADMIN_PASSWORD="sua-senha-segura"
$env:ADMIN_NAME="Seu Nome"
npm run create-admin
```

### Opção 2: Usando SQL Direto no Banco

Se preferir criar manualmente, execute este SQL no banco de dados:

```sql
INSERT INTO users (name, email, password, role)
VALUES ('Administrador', 'admin@hotelsonata.com.br', 'sua_senha_aqui', 'admin');
```

**⚠️ IMPORTANTE:** 
- Em desenvolvimento, a senha é armazenada em texto plano
- Em produção, você DEVE usar hash bcrypt para a senha

### Opção 3: Usando Drizzle Studio

1. Execute: `npm run db:studio`
2. Acesse: `http://localhost:4983`
3. Navegue até a tabela `users`
4. Clique em "Add Row" e preencha os campos

---

## 🚀 Passo a Passo Completo

### 1. Certifique-se de que o banco está configurado

```powershell
# Verifique se o .env.local existe e tem DATABASE_URL
# Se não tiver, crie o arquivo .env.local com:
# DATABASE_URL=sua_url_do_banco
```

### 2. Crie as tabelas no banco (se ainda não criou)

```powershell
npm run db:push
```

### 3. Crie o usuário admin

```powershell
npm run create-admin
```

### 4. Inicie o servidor de desenvolvimento

```powershell
npm run dev
```

### 5. Acesse o painel

Abra no navegador: `http://localhost:3000/admin/login`

### 6. Faça login

Use as credenciais criadas no passo 3.

---

## 🔒 Segurança

### ⚠️ Avisos Importantes

1. **Senhas em Texto Plano:** 
   - O sistema atual armazena senhas em texto plano (apenas para desenvolvimento)
   - **NUNCA use isso em produção!**

2. **Hash de Senha em Produção:**
   - Implemente bcrypt ou similar antes de ir para produção
   - Atualize a função `verifyCredentials` em `lib/auth.ts`

3. **Token de Autenticação:**
   - O token atual é simples (base64)
   - Em produção, use JWT com expiração

---

## 🛠️ Solução de Problemas

### Erro: "Credenciais inválidas"

1. Verifique se o usuário existe no banco:
   ```powershell
   npm run db:studio
   ```
   Verifique a tabela `users`

2. Verifique se a senha está correta (em desenvolvimento, deve ser exatamente igual)

3. Tente criar um novo usuário:
   ```powershell
   npm run create-admin
   ```

### Erro: "Não autorizado" ou redirecionamento para login

1. Limpe o localStorage do navegador
2. Faça login novamente
3. Verifique se o token está sendo salvo: `localStorage.getItem("admin_token")`

### Erro ao executar o script create-admin

1. Verifique se o `.env.local` existe e tem `DATABASE_URL`
2. Verifique se o banco está acessível
3. Execute `npm run db:push` para garantir que as tabelas existem

---

## 📋 Estrutura do Painel Admin

Após fazer login, você terá acesso a:

- **Dashboard** - Visão geral e estatísticas
- **Destaques** - Gerenciar carrossel principal
- **Pacotes** - Criar e editar pacotes promocionais
- **Quartos** - Cadastrar acomodações
- **Galeria** - Upload e organização de fotos
- **Gastronomia** - Gerenciar conteúdo de gastronomia
- **Lazer** - Gerenciar serviços de lazer
- **Eventos** - Gerenciar tipos de eventos
- **Sustentabilidade** - Conteúdo ESG
- **Certificações** - Gerenciar certificações
- **Redes Sociais** - Feed do Instagram
- **Configurações** - Dados de contato e informações gerais

---

## 📞 Suporte

Se tiver problemas, verifique:
1. Logs do console do navegador (F12)
2. Logs do servidor (terminal onde roda `npm run dev`)
3. Documentação do banco: `DOCUMENTACAO_BANCO_DADOS.md`

