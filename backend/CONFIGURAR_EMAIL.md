# 📧 Configuração de Email - Amigos Cuidadores

## ⚠️ Importante

O sistema de recuperação de senha está funcionando, mas o envio de emails precisa ser configurado. Enquanto isso não é feito, o código aparece no console do servidor.

## 🔧 Como Configurar

### 1. Adicione as variáveis no arquivo `backend/config.env`:

```env
# Configurações de Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
EMAIL_FROM=Amigos Cuidadores <seu-email@gmail.com>
```

### 2. Para Gmail, você precisa:

1. **Ativar verificação em duas etapas** na sua conta Google
2. **Gerar uma senha de app**:
   - Acesse: https://myaccount.google.com/apppasswords
   - Crie uma nova senha de app
   - Use essa senha no `SMTP_PASS`

### 3. Para outros provedores:

#### Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

#### Yahoo:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

## 🧪 Modo Desenvolvimento

Enquanto o email não está configurado:

1. **O código aparece no console do servidor**:
   ```
   ⚠️  EMAIL NÃO CONFIGURADO - MODO DESENVOLVIMENTO
   --------------------------------------------
   📧 Email: usuario@email.com
   🔑 CÓDIGO DE RECUPERAÇÃO: 123456
   ⏰ Válido até: 12/11/2025 10:45:00
   --------------------------------------------
   ```

2. **O código também aparece na tela** (apenas em desenvolvimento)

3. **Abra o Console do Navegador (F12)** para ver o código também

## 🚀 Em Produção

Em produção, remova a linha que retorna o código:

```javascript
// backend/controllers/password.controller.js
// REMOVER esta linha em produção:
devCode: resetData.code,
```

## 📝 Teste Rápido

1. Vá para a tela de login
2. Clique em "Esqueci a senha"
3. Digite seu email
4. Veja o código no:
   - Console do servidor (terminal)
   - Tela do navegador (modo dev)
   - Console do navegador (F12)

## 🔐 Segurança

- **NUNCA** commite as credenciais de email no Git
- Use variáveis de ambiente
- Em produção, use um serviço profissional (SendGrid, AWS SES, etc.)
