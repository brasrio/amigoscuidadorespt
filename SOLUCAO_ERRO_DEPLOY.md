# 🔧 Solução: Erro de Conexão com Servidor no Vercel

## ❌ Erro Atual

```
Erro de conexão com o servidor
```

Visto em: `https://amigoscuidadores.vercel.app/login.html`

---

## 🔍 Diagnóstico Rápido

### 1️⃣ Teste o Health Check

Abra em uma nova aba:

```
https://amigoscuidadores.vercel.app/api/health
```

#### ✅ Se retornar JSON com `"status": "OK"`:
- O backend está funcionando!
- O erro é no frontend (cache do navegador)
- **Solução:** Limpar cache (Ctrl+Shift+R)

#### ❌ Se retornar erro 500 ou 404:
- Variáveis de ambiente não configuradas
- Ou erro no Firebase
- **Continue lendo abaixo** 👇

---

## 🛠️ Solução Passo a Passo

### **Passo 1: Verificar Logs do Vercel**

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **amigoscuidadores**
3. Vá em **"Deployments"**
4. Clique no último deployment (com ✅ ou ❌)
5. Clique em **"View Function Logs"** ou **"Runtime Logs"**

**O que procurar nos logs:**
- ❌ `Firebase initialization failed` → Problema com Firebase
- ❌ `Cannot find module` → Problema com dependências
- ❌ `FIREBASE_SERVICE_ACCOUNT_JSON` → Variável não configurada

---

### **Passo 2: Verificar Variáveis de Ambiente**

1. Vercel Dashboard → Seu projeto
2. **Settings** → **Environment Variables**

#### Verifique se TEM as **11 variáveis**:

- [ ] NODE_ENV
- [ ] PORT
- [ ] JWT_SECRET
- [ ] JWT_EXPIRE
- [ ] SMTP_HOST
- [ ] SMTP_PORT
- [ ] SMTP_USER
- [ ] SMTP_PASS
- [ ] SMTP_SECURE
- [ ] EMAIL_FROM
- [ ] **FIREBASE_SERVICE_ACCOUNT_JSON** ← Mais importante!

#### Se faltarem variáveis:

1. Abra o arquivo: **`VARIAVEIS_VERCEL.txt`** (na raiz do projeto)
2. Copie e cole cada variável no Vercel
3. **IMPORTANTE:** Selecione TODOS os ambientes:
   - ☑ Production
   - ☑ Preview
   - ☑ Development

---

### **Passo 3: Verificar Firebase Especificamente**

O erro mais comum é na variável **FIREBASE_SERVICE_ACCOUNT_JSON**.

#### Verificação:

1. Settings → Environment Variables
2. Encontre `FIREBASE_SERVICE_ACCOUNT_JSON`
3. Clique em **"Edit"**
4. Verifique se o valor é um JSON válido em uma única linha

#### Deve parecer com:

```json
{"type":"service_account","project_id":"amigos-cuidadores-pt",...}
```

#### ❌ Se estiver com quebras de linha ou formatado, ESTÁ ERRADO!

#### ✅ Corrigir:

Copie esta linha COMPLETA do arquivo `VARIAVEIS_VERCEL.txt`:

```
{"type":"service_account","project_id":"amigos-cuidadores-pt","private_key_id":"9658cc18c357ba7cf54441bf08def62ddc70baf9","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCeu7SoEes53sAl\nkogFZE2/d8fYcBKVINL2E2y/eziLurVjWS+04h3tFLrgCgxwdLqAkIP9nnil+4tr\nnqSAJ/swtVwsYByLqPRVaLQsbKgxZBm5BdO3QBHxPZweJWrDEysawMkWOaPOWmIf\nrcErX1SCzqSX12OB5z+zjiKxitc6v08f1Eu8+GU1O+fAzZx65dHdwyAQGdjuNkn7\nahMThJPhhXRzsMMjGyG3nna7j5QE2tQFQF74y+ivqNCdGvOb4FvpN98AGRrwjnJD\nUBSpmsuGj5ar1+igsy/zqHqMASHHTBE0XXEQRHtm8QwHNhSNj9mzRNUn6Ip0KQfO\nrUk3Xk9VAgMBAAECggEAFKgHp/GBA2xl493QPqdhaL+9LYDUIjz9xxEbD0YJQ0G+\nVhnml+rvCwmuEfaszLucA5wK2SfUuoDkEVK5RIYvbZTEVHADdvc7KJwyCi/vqVHF\n+Sp1dTzsuNCULuYeoRku/FHHOVGx6+oeJ9I0N6E1vboHeE0KwX5m70ZZZHJVdOr4\nziV1ewWRuFyRg8xt06iSSooHeVDAOi6MZZeygwjI504pp2q20RRH5YtmpSdbiKtC\nngu9XRvHSZvheSEuI0VwC1VjMJh0fbRxhwgyWl8WDNcHmKWLgOyNQNk+7O+FwT7A\nu+cGUb7ty66S10M5PRoVI+Ks8GYN/VdQCP3yClPwBwKBgQDaZOebaO6qVN+yS4Cx\ns/4xTky/Dr/C7p06Gr7sH/rMpsQIw5vA18bJvBSBOi64w85OWf+bqz1/NqaCbHHz\nzEU8D7Na3QQaAnTbAp5Rc+Vs5YIlzUmXOn5dNTpdlv3unxsQWPWOtmVIFzt2xO+B\ne335aeQGZG+iGyqWo9fFa1bSBwKBgQC6EN7NVxz+XyiJy4LPEZM8Y+2bJyL1W2Gx\nfCOIPpY43wWHy93kBz97iv8I3V2IsQiU0X+57VzP4Qr6VleGbHUg4Ist4jnYzrvy\nIUKF4g2MBFyB8Zj0WPPBjA/Gxdejsp1V2HTUcfAkz1DFL5ppdQ5m4kKhfuYNgwYO\nGiFSYXwMwwKBgHF4ignqTE79yDh4GEa8UW9G0oNWY3Yhylk9OkOvHf0lDKfNEmjw\n890vNqwqEcp4GgIFqtQz9cDaIUuUkuRsFvDs63Bjc1UcP6DnTGDfya151dRURE8p\n2iwNkuS7pfZMfqBQyE09IYSCZagBDLwG8N4dEZfsqT/dw5P/TwXJDpQTAoGAWUc7\nAOApw0w5kVSbIWxXb4SrP+UZew0r5ROhoQAW6JbqemwxvfZUWZ0qHkDJXotDiNS1\nKqtf+0cKE3BWcuObl/jmD1AbXZJk0BtxZfg/c82r7ZXVRHliDJ59+2x2uc88ezJv\nbHh3N9JZ+SOMPcmy7V7nhcHz9MvHngCfuH2aHi0CgYAxh628nww2hK9W3wtJ5mqr\naNHgBdhGbxdSG3KH2KnwUeY5qFYbvLkKUoWQHpd+PgYvcnUC72xMfB7pis+z9QxN\n26WAnwz+PZe57viEd4xPwcCRiD5FN053TeA24nXt7fPPzTrV4yESgb8+47lkyW4F\nbnZfCZkBhRq8YlV+0RYwcQ==\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@amigos-cuidadores-pt.iam.gserviceaccount.com","client_id":"106254969911725802435","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40amigos-cuidadores-pt.iam.gserviceaccount.com","universe_domain":"googleapis.com"}
```

---

### **Passo 4: Forçar Redeploy**

Após adicionar/corrigir as variáveis:

1. Vercel Dashboard → **Deployments**
2. Clique nos 3 pontos do último deployment
3. Selecione **"Redeploy"**
4. Aguarde o build completar (2-3 minutos)

---

### **Passo 5: Limpar Cache do Navegador**

Após o redeploy:

1. No site, pressione: **Ctrl + Shift + R** (Windows) ou **Cmd + Shift + R** (Mac)
2. Ou feche e abra uma nova aba anônima
3. Tente fazer login novamente

---

## 🧪 Teste Final

Após seguir os passos acima:

### 1. Teste o health check:
```
https://amigoscuidadores.vercel.app/api/health
```

Deve retornar:
```json
{
  "status": "OK",
  "message": "Servidor Amigos Cuidadores está funcionando!",
  "timestamp": "..."
}
```

### 2. Teste o login:
```
https://amigoscuidadores.vercel.app/login.html
```

Use:
- Email: `richard@admin.com`
- Senha: (a senha que você configurou)

---

## 🔍 Verificação Adicional - Console do Navegador

Abra o **Console do desenvolvedor** (F12) e procure por erros:

### ❌ Se ver erros tipo:
- `Failed to fetch` → Problema de conexão com API
- `404 /api/...` → Backend não está respondendo
- `500 Internal Server Error` → Erro no servidor (verifique logs Vercel)

### ✅ Se NÃO houver erros:
- O sistema deve funcionar normalmente

---

## 📞 Checklist de Verificação

- [ ] Testei `/api/health` e retornou status OK
- [ ] Verifiquei que as 11 variáveis estão no Vercel
- [ ] FIREBASE_SERVICE_ACCOUNT_JSON está em uma única linha
- [ ] Todas as variáveis estão em todos os ambientes (Production, Preview, Development)
- [ ] Fiz redeploy no Vercel
- [ ] Limpei cache do navegador (Ctrl+Shift+R)
- [ ] Testei em aba anônima

---

## 💡 Dicas Extras

### Se NADA funcionar:

1. **Delete o projeto do Vercel** e reimporte
2. Configure as variáveis ANTES do primeiro deploy
3. Use o painel do Vercel para ver exatamente qual erro está acontecendo

### Verificar se o problema é local ou do Vercel:

Teste localmente:
```bash
cd backend
npm run dev
```

Acesse: `http://localhost:5000/api/health`

Se funcionar local mas não no Vercel → É problema de configuração no Vercel

---

## 🎯 Erro Mais Comum

**90% dos casos:** A variável `FIREBASE_SERVICE_ACCOUNT_JSON` não foi configurada ou está formatada incorretamente.

**Solução:** 
1. Delete a variável no Vercel
2. Copie EXATAMENTE do arquivo `VARIAVEIS_VERCEL.txt`
3. Cole sem modificar
4. Redeploy

---

## 📧 Próximo Passo

Depois que o erro for resolvido, teste todas as funcionalidades:

- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Busca de cuidadores funciona
- [ ] Edição de perfil funciona
- [ ] Recuperação de senha funciona (teste o email!)

---

**Boa sorte! Se seguir estes passos, o erro será resolvido! 🚀**

