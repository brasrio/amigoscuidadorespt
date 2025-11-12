# 🚀 Guia Completo de Deploy no Vercel - Amigos Cuidadores

## 📋 O que foi preparado

✅ Código ajustado para funcionar tanto localmente quanto no Vercel  
✅ Frontend detecta automaticamente o ambiente (local vs produção)  
✅ Backend exporta o app para funcionar em modo serverless  
✅ Banco de dados local JSON removido (agora só Firebase)  
✅ Arquivos de configuração criados (`vercel.json` e `.vercelignore`)

---

## 🔧 Passo 1: Preparar o Repositório Git

### 1.1 - Commit e Push das Mudanças

```bash
git add .
git commit -m "Preparar para deploy no Vercel"
git push origin main
```

**Importante:** Certifique-se de que `.env`, `config.env` e `firebase-service-account.json` **NÃO** estão sendo commitados!

---

## 🌐 Passo 2: Criar Projeto no Vercel

### 2.1 - Acessar Vercel

1. Acesse: https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em **"Add New..."** → **"Project"**

### 2.2 - Importar Repositório

1. Encontre e selecione o repositório `amigoscuidadorespt`
2. Clique em **"Import"**
3. **NÃO** clique em "Deploy" ainda! Primeiro precisamos configurar as variáveis de ambiente

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

### 3.1 - Acessar Configurações

No painel do projeto Vercel:
1. Vá em **"Settings"** (no menu superior)
2. Clique em **"Environment Variables"** (no menu lateral)

### 3.2 - Adicionar TODAS as Variáveis Abaixo

**IMPORTANTE:** Copie e cole EXATAMENTE como está aqui. Clique em "Add" para cada uma.

#### ⚙️ Configurações Gerais

**Nome:** `NODE_ENV`  
**Valor:** `production`  
**Ambiente:** Selecione: Production, Preview e Development

---

**Nome:** `PORT`  
**Valor:** `5000`  
**Ambiente:** Selecione: Production, Preview e Development

---

**Nome:** `JWT_SECRET`  
**Valor:** `amigos_cuidadores_secret_key_2025`  
**Ambiente:** Selecione: Production, Preview e Development

---

**Nome:** `JWT_EXPIRE`  
**Valor:** `7d`  
**Ambiente:** Selecione: Production, Preview e Development

---

#### 📧 Configurações de Email (Gmail)

**Nome:** `SMTP_HOST`  
**Valor:** `smtp.gmail.com`  
**Ambiente:** Selecione: Production, Preview e Development

---

**Nome:** `SMTP_PORT`  
**Valor:** `587`  
**Ambiente:** Selecione: Production, Preview e Development

---

**Nome:** `SMTP_USER`  
**Valor:** `amigoscuidadorespt@gmail.com`  
**Ambiente:** Selecione: Production, Preview e Development

---

**Nome:** `SMTP_PASS`  
**Valor:** `sylunwdeulydjjiv`  
**Ambiente:** Selecione: Production, Preview e Development

---

**Nome:** `SMTP_SECURE`  
**Valor:** `false`  
**Ambiente:** Selecione: Production, Preview e Development

---

**Nome:** `EMAIL_FROM`  
**Valor:** `Amigos Cuidadores <amigoscuidadorespt@gmail.com>`  
**Ambiente:** Selecione: Production, Preview e Development

---

#### 🔥 Configuração do Firebase

**ATENÇÃO:** Esta é a variável mais importante e precisa ser uma única linha!

**Nome:** `FIREBASE_SERVICE_ACCOUNT_JSON`  
**Valor:** (copie a linha abaixo COMPLETA, sem quebras de linha)

```json
{"type":"service_account","project_id":"amigos-cuidadores-pt","private_key_id":"9658cc18c357ba7cf54441bf08def62ddc70baf9","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCeu7SoEes53sAl\nkogFZE2/d8fYcBKVINL2E2y/eziLurVjWS+04h3tFLrgCgxwdLqAkIP9nnil+4tr\nnqSAJ/swtVwsYByLqPRVaLQsbKgxZBm5BdO3QBHxPZweJWrDEysawMkWOaPOWmIf\nrcErX1SCzqSX12OB5z+zjiKxitc6v08f1Eu8+GU1O+fAzZx65dHdwyAQGdjuNkn7\nahMThJPhhXRzsMMjGyG3nna7j5QE2tQFQF74y+ivqNCdGvOb4FvpN98AGRrwjnJD\nUBSpmsuGj5ar1+igsy/zqHqMASHHTBE0XXEQRHtm8QwHNhSNj9mzRNUn6Ip0KQfO\nrUk3Xk9VAgMBAAECggEAFKgHp/GBA2xl493QPqdhaL+9LYDUIjz9xxEbD0YJQ0G+\nVhnml+rvCwmuEfaszLucA5wK2SfUuoDkEVK5RIYvbZTEVHADdvc7KJwyCi/vqVHF\n+Sp1dTzsuNCULuYeoRku/FHHOVGx6+oeJ9I0N6E1vboHeE0KwX5m70ZZZHJVdOr4\nziV1ewWRuFyRg8xt06iSSooHeVDAOi6MZZeygwjI504pp2q20RRH5YtmpSdbiKtC\nngu9XRvHSZvheSEuI0VwC1VjMJh0fbRxhwgyWl8WDNcHmKWLgOyNQNk+7O+FwT7A\nu+cGUb7ty66S10M5PRoVI+Ks8GYN/VdQCP3yClPwBwKBgQDaZOebaO6qVN+yS4Cx\ns/4xTky/Dr/C7p06Gr7sH/rMpsQIw5vA18bJvBSBOi64w85OWf+bqz1/NqaCbHHz\nzEU8D7Na3QQaAnTbAp5Rc+Vs5YIlzUmXOn5dNTpdlv3unxsQWPWOtmVIFzt2xO+B\ne335aeQGZG+iGyqWo9fFa1bSBwKBgQC6EN7NVxz+XyiJy4LPEZM8Y+2bJyL1W2Gx\nfCOIPpY43wWHy93kBz97iv8I3V2IsQiU0X+57VzP4Qr6VleGbHUg4Ist4jnYzrvy\nIUKF4g2MBFyB8Zj0WPPBjA/Gxdejsp1V2HTUcfAkz1DFL5ppdQ5m4kKhfuYNgwYO\nGiFSYXwMwwKBgHF4ignqTE79yDh4GEa8UW9G0oNWY3Yhylk9OkOvHf0lDKfNEmjw\n890vNqwqEcp4GgIFqtQz9cDaIUuUkuRsFvDs63Bjc1UcP6DnTGDfya151dRURE8p\n2iwNkuS7pfZMfqBQyE09IYSCZagBDLwG8N4dEZfsqT/dw5P/TwXJDpQTAoGAWUc7\nAOApw0w5kVSbIWxXb4SrP+UZew0r5ROhoQAW6JbqemwxvfZUWZ0qHkDJXotDiNS1\nKqtf+0cKE3BWcuObl/jmD1AbXZJk0BtxZfg/c82r7ZXVRHliDJ59+2x2uc88ezJv\nbHh3N9JZ+SOMPcmy7V7nhcHz9MvHngCfuH2aHi0CgYAxh628nww2hK9W3wtJ5mqr\naNHgBdhGbxdSG3KH2KnwUeY5qFYbvLkKUoWQHpd+PgYvcnUC72xMfB7pis+z9QxN\n26WAnwz+PZe57viEd4xPwcCRiD5FN053TeA24nXt7fPPzTrV4yESgb8+47lkyW4F\nbnZfCZkBhRq8YlV+0RYwcQ==\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@amigos-cuidadores-pt.iam.gserviceaccount.com","client_id":"106254969911725802435","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40amigos-cuidadores-pt.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

**Ambiente:** Selecione: Production, Preview e Development

---

### 3.3 - Verificar Variáveis

Após adicionar todas as variáveis, você deve ter **11 variáveis** no total:

1. ✅ NODE_ENV
2. ✅ PORT
3. ✅ JWT_SECRET
4. ✅ JWT_EXPIRE
5. ✅ SMTP_HOST
6. ✅ SMTP_PORT
7. ✅ SMTP_USER
8. ✅ SMTP_PASS
9. ✅ SMTP_SECURE
10. ✅ EMAIL_FROM
11. ✅ FIREBASE_SERVICE_ACCOUNT_JSON

---

## 🚀 Passo 4: Fazer o Deploy

### 4.1 - Iniciar Deploy

1. Volte para a aba **"Overview"** ou **"Deployments"**
2. Clique em **"Deploy"** ou **"Redeploy"**
3. Aguarde o build completar (leva alguns minutos)

### 4.2 - Acompanhar o Build

Você verá os logs do build em tempo real. Se tudo correr bem, verá:
- ✅ Building...
- ✅ Deploying...
- ✅ Ready

### 4.3 - Obter a URL

Após o deploy, você receberá uma URL tipo:
```
https://amigoscuidadorespt.vercel.app
```

Ou similar. Copie essa URL!

---

## ✅ Passo 5: Testar a Aplicação

### 5.1 - Testar Health Check

Abra no navegador:
```
https://sua-url.vercel.app/api/health
```

Você deve ver uma resposta JSON:
```json
{
  "status": "OK",
  "message": "Servidor Amigos Cuidadores está funcionando!",
  "timestamp": "2025-11-12T..."
}
```

### 5.2 - Testar o Frontend

Acesse:
```
https://sua-url.vercel.app
```

Você deve ver a página inicial do site.

### 5.3 - Testar Login

1. Acesse: `https://sua-url.vercel.app/login.html`
2. Tente fazer login com um usuário existente
3. Verifique se consegue acessar o dashboard

---

## 🏠 Desenvolvimento Local (Continuar Codando)

### Como funciona agora:

O código está preparado para funcionar em AMBOS os ambientes:

#### 🖥️ Local (Desenvolvimento)

```bash
# No diretório backend
cd backend
npm run dev

# Em outro terminal, no diretório raiz
# Abra os arquivos HTML no navegador ou use Live Server
```

O frontend detecta automaticamente que está rodando em `localhost` e usa:
```
http://localhost:5000/api
```

#### ☁️ Vercel (Produção)

No Vercel, o frontend detecta automaticamente e usa:
```
/api
```

**Você não precisa mudar nada no código!** Funciona automaticamente.

---

## 🔄 Atualizações Futuras

### Como atualizar o site:

1. Faça suas mudanças localmente
2. Teste localmente com `npm run dev`
3. Commit e push:

```bash
git add .
git commit -m "Descrição das mudanças"
git push origin main
```

4. **O Vercel fará deploy automático!** 🎉

Você pode acompanhar o deploy em tempo real no painel do Vercel.

---

## 🌐 Configurar Domínio Personalizado (Opcional)

### Se você tem um domínio próprio:

1. No painel do Vercel, vá em **"Settings"** → **"Domains"**
2. Clique em **"Add Domain"**
3. Digite seu domínio (ex: `amigoscuidadores.pt`)
4. Siga as instruções para configurar os registros DNS

### Registros DNS sugeridos pelo Vercel:

Exemplo:
```
Tipo: A
Nome: @
Valor: 76.76.21.21

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

Após configurar, aguarde propagação DNS (pode levar até 48h).

---

## 🐛 Troubleshooting (Solução de Problemas)

### Problema: "Module not found" no deploy

**Solução:**
```bash
cd backend
npm install
git add package-lock.json
git commit -m "Atualizar dependências"
git push
```

---

### Problema: "Firebase initialization failed"

**Causa:** A variável `FIREBASE_SERVICE_ACCOUNT_JSON` pode estar incorreta.

**Solução:**
1. Verifique se você copiou a string JSON COMPLETA e em uma única linha
2. Verifique se não tem espaços extras no início ou fim
3. No Vercel, delete a variável e adicione novamente

---

### Problema: "Email sending failed"

**Causa:** Credenciais SMTP incorretas ou senha de app expirada.

**Solução:**
1. Verifique se `SMTP_USER` e `SMTP_PASS` estão corretos
2. Se necessário, gere uma nova senha de app:
   - Acesse: https://myaccount.google.com/apppasswords
   - Crie nova senha de app
   - Atualize `SMTP_PASS` no Vercel

---

### Problema: "Cannot GET /api/..." (404)

**Causa:** Rotas não configuradas corretamente.

**Solução:**
1. Verifique o arquivo `vercel.json` na raiz do projeto
2. Faça um redeploy no Vercel

---

### Problema: Site funciona local mas não no Vercel

**Solução:**
1. Verifique os logs do deploy no Vercel
2. Acesse **"Deployments"** → Clique no último deploy → **"View Function Logs"**
3. Procure por erros específicos nos logs

---

## 📊 Monitoramento

### Ver Logs em Tempo Real:

1. Painel Vercel → **"Deployments"**
2. Clique no deployment ativo
3. **"View Function Logs"**

### Analytics:

O Vercel fornece analytics gratuitos:
- Número de requisições
- Tempo de resposta
- Erros
- Visitantes

Acesse em: **"Analytics"** no menu do projeto.

---

## 🔒 Segurança - IMPORTANTE!

### ⚠️ Próximos Passos de Segurança (Recomendado):

#### 1. Gerar JWT_SECRET mais seguro

Atualmente usando: `amigos_cuidadores_secret_key_2025`

**Gere uma chave mais forte:**

```bash
# No terminal (Node.js):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copie o resultado e atualize no Vercel:
- Settings → Environment Variables
- Edite `JWT_SECRET`
- Cole a nova chave
- Save e Redeploy

#### 2. Hash de Senhas

**IMPORTANTE:** O sistema atual armazena senhas **SEM hash** no Firebase.

Para produção real, você DEVE implementar hash de senhas:

1. As senhas devem ser hasheadas com bcrypt antes de salvar
2. Na autenticação, comparar hash ao invés de senha pura
3. Atualize `auth.controller.js` para usar `bcrypt.hash()` e `bcrypt.compare()`

#### 3. Trocar Senha SMTP

A senha atual (`sylunwdeulydjjiv`) está exposta neste documento.

**Gere uma nova senha de app:**
1. https://myaccount.google.com/apppasswords
2. Crie nova senha
3. Atualize no Vercel
4. Delete esta senha antiga no Google

#### 4. Rotacionar Credenciais Firebase

Para máxima segurança:
1. Firebase Console → Project Settings → Service Accounts
2. Crie uma nova chave
3. Delete a chave antiga
4. Atualize no Vercel

---

## 📝 Checklist Final

Antes de considerar o deploy completo:

- [ ] Todas as 11 variáveis de ambiente configuradas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] `/api/health` retorna status OK
- [ ] Site carrega corretamente
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Teste local ainda funciona
- [ ] Firebase conectado e funcionando
- [ ] Emails sendo enviados (teste recuperação de senha)
- [ ] (Opcional) Domínio personalizado configurado
- [ ] (IMPORTANTE) Planejar implementação de hash de senhas
- [ ] (IMPORTANTE) Trocar JWT_SECRET para produção
- [ ] (IMPORTANTE) Trocar senha SMTP

---

## 🎉 Parabéns!

Se chegou até aqui e tudo funcionou, sua aplicação está no ar!

### URLs Importantes:

- **Site:** `https://sua-url.vercel.app`
- **API:** `https://sua-url.vercel.app/api`
- **Health Check:** `https://sua-url.vercel.app/api/health`
- **Dashboard Vercel:** https://vercel.com/dashboard

---

## 📞 Suporte

### Logs e Debugging:

- **Vercel Logs:** Deployments → Seu deploy → View Function Logs
- **Local Logs:** Terminal onde rodou `npm run dev`
- **Browser Console:** F12 → Console (para erros de frontend)

### Recursos Úteis:

- Documentação Vercel: https://vercel.com/docs
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup
- Node.js + Express: https://expressjs.com/

---

**Última atualização:** 2025-11-12

**Versão do documento:** 1.0

