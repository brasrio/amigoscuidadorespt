# 🚨 ALERTA DE SEGURANÇA - Chave Firebase Exposta

## ❌ O que aconteceu:

A chave do Firebase foi exposta publicamente no GitHub e foi **DESABILITADA** pelo Google.

## ✅ Próximos Passos:

### 1. Gerar Nova Chave Firebase

1. https://console.firebase.google.com/
2. Projeto: amigos-cuidadores-pt
3. ⚙️ Project Settings → Service Accounts
4. **Generate new private key**
5. Baixe o arquivo JSON

### 2. Adicionar no Vercel (APENAS LÁ!)

1. https://vercel.com/dashboard
2. Seu projeto → Settings → Environment Variables
3. Edite: `FIREBASE_SERVICE_ACCOUNT_JSON`
4. Cole a nova chave (em uma linha, sem quebras)
5. Selecione todos os ambientes
6. Save

### 3. Delete a Chave Antiga

No Firebase Console:
- Service Accounts → Encontre chave antiga → Delete

### 4. Commit e Push

```bash
git add .
git commit -m "Remove arquivos com credenciais sensíveis"
git push origin main
```

### 5. Redeploy no Vercel

Vercel → Deployments → Redeploy

## ⚠️ IMPORTANTE:

**NUNCA** mais commite credenciais no Git!
- ❌ Chaves Firebase
- ❌ Senhas SMTP
- ❌ JWT Secrets
- ❌ Qualquer credencial

✅ Use APENAS as Environment Variables do Vercel!

## 🔒 Segurança Futura:

1. Todas as credenciais APENAS no painel do Vercel
2. NUNCA em arquivos .md, .txt, ou código
3. Mantenha .gitignore atualizado
4. Use diferentes credenciais para dev/prod

---

**Após gerar nova chave e adicionar no Vercel, o sistema vai funcionar!**

