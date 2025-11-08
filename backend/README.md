# Backend Amigos Cuidadores

Backend em Node.js para a plataforma Amigos Cuidadores, com sistema de autenticação JWT e armazenamento local em JSON.

## 🚀 Instalação

1. Navegue até a pasta backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do backend
   - Copie o conteúdo abaixo:

```env
# Configurações do servidor
PORT=5000

# JWT Secret - Em produção, use uma chave mais segura
JWT_SECRET=amigos_cuidadores_secret_key_2025

# Configurações de JWT
JWT_EXPIRE=7d

# Ambiente
NODE_ENV=development
```

## 🏃‍♂️ Executar o servidor

### Modo desenvolvimento (com auto-reload):
```bash
npm run dev
```

### Modo produção:
```bash
npm start
```

O servidor estará disponível em `http://localhost:5000`

## 📚 API Endpoints

### Autenticação

#### Registro de novo usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "userType": "client", // ou "caregiver", "nurse"
  "phone": "912345678",
  "address": {
    "street": "Rua Principal",
    "city": "Lisboa",
    "state": "Lisboa",
    "zipCode": "1000-001"
  }
}
```

Para cuidadores/enfermeiros, adicione também:
```json
{
  "experience": "5 anos de experiência...",
  "specialties": ["idosos", "alzheimer"],
  "certifications": ["Certificado X", "Curso Y"],
  "hourlyRate": 15.50,
  "bio": "Profissional dedicado..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

#### Verificar token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### Usuários (Rotas protegidas - requerem token)

#### Obter perfil do usuário atual
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Atualizar perfil
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "phone": "919876543",
  "address": {
    "street": "Rua Nova",
    "city": "Porto"
  }
}
```

#### Deletar conta
```http
DELETE /api/users/profile
Authorization: Bearer <token>
```

#### Listar profissionais
```http
GET /api/users/professionals
Authorization: Bearer <token>

Query params opcionais:
- userType: "caregiver" ou "nurse"
- specialties: "idosos,alzheimer" (separados por vírgula)
- minRating: 4.0
- maxRate: 20.00
```

#### Obter detalhes de um profissional
```http
GET /api/users/professionals/:id
Authorization: Bearer <token>
```

## 📁 Estrutura de dados

Os usuários são salvos em `backend/data/users.json` com a seguinte estrutura:

```json
{
  "id": "uuid",
  "name": "Nome do Usuário",
  "email": "email@exemplo.com",
  "password": "hash_bcrypt",
  "userType": "client|caregiver|nurse",
  "phone": "912345678",
  "address": {
    "street": "Rua",
    "city": "Cidade",
    "state": "Estado",
    "zipCode": "0000-000"
  },
  "profileComplete": false,
  "verified": false,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "professional": {
    "experience": "Descrição da experiência",
    "specialties": ["especialidade1", "especialidade2"],
    "certifications": ["cert1", "cert2"],
    "availability": {},
    "hourlyRate": 15.50,
    "bio": "Biografia",
    "rating": 0,
    "totalReviews": 0
  }
}
```

## 🔐 Segurança

- Senhas são criptografadas com bcrypt (10 salt rounds)
- Autenticação via JWT tokens
- Tokens expiram em 7 dias (configurável)
- Validação de dados com express-validator

## 🛠️ Tecnologias utilizadas

- **Express.js** - Framework web
- **bcryptjs** - Criptografia de senhas
- **jsonwebtoken** - Autenticação JWT
- **cors** - Habilitar CORS
- **dotenv** - Variáveis de ambiente
- **express-validator** - Validação de dados
- **uuid** - Geração de IDs únicos
- **nodemon** - Auto-reload em desenvolvimento

## 📝 Notas

- Este é um backend simples com armazenamento em JSON, adequado para desenvolvimento e testes
- Para produção, considere usar um banco de dados real (PostgreSQL, MongoDB, etc.)
- Adicione mais validações e tratamento de erros conforme necessário
- Implemente rate limiting e outras medidas de segurança para produção
