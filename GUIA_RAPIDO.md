# ⚡ Guia Rápido de Deploy no Vercel

## 🎯 5 Passos Essenciais

### 1️⃣ Git Push
```bash
git add .
git commit -m "Deploy Vercel"
git push origin main
```

### 2️⃣ Vercel - Importar
- Acesse: https://vercel.com
- Add New → Project
- Importar repositório `amigoscuidadorespt`
- **NÃO clique em Deploy ainda!**

### 3️⃣ Variáveis de Ambiente
Settings → Environment Variables → Adicione as **11 variáveis**:

Copie de: `VARIAVEIS_VERCEL.txt`

```
NODE_ENV
PORT
JWT_SECRET
JWT_EXPIRE
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_SECURE
EMAIL_FROM
FIREBASE_SERVICE_ACCOUNT_JSON ← Mais importante!
```

**⚠️ Selecione TODOS os ambientes para cada variável!**

### 4️⃣ Deploy
- Clique em **"Deploy"**
- Aguarde build completar
- Copie a URL gerada

### 5️⃣ Testar
```
https://sua-url.vercel.app/api/health
```

Deve retornar:
```json
{
  "status": "OK",
  "message": "Servidor Amigos Cuidadores está funcionando!"
}
```

---

## 📚 Documentação Completa

Para detalhes completos, leia: **`DEPLOY_VERCEL.md`**

---

## 🔄 Próximas Atualizações

```bash
# Faça mudanças localmente, depois:
git add .
git commit -m "Sua mensagem"
git push origin main
# Deploy automático! 🎉
```

---

## 🏠 Continuar Desenvolvimento Local

```bash
cd backend
npm run dev
# Continua funcionando normalmente!
```

---

## ⚠️ Atenção

- Sistema atual **NÃO usa hash de senhas**
- Para produção real, leia seção "Segurança" em `DEPLOY_VERCEL.md`

---

**🎉 É isso! Boa sorte com o deploy!**

