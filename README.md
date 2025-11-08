# Amigos Cuidadores – Plataforma de Gestão de Cuidadores

Bem-vindo ao repositório oficial da plataforma **Amigos Cuidadores**, um sistema completo para ligar famílias a cuidadores e enfermeiros profissionais em Portugal.  
O projecto inclui landing page pública, fluxo de cadastro, autenticação com JWT e um *dashboard* avançado com funcionalidades distintas para clientes, cuidadores e administradores.

---

## 📚 Sumário

- [Principais funcionalidades](#principais-funcionalidades)
- [Arquitectura e tecnologias](#arquitectura-e-tecnologias)
- [Preparação do ambiente](#preparação-do-ambiente)
- [Como executar](#como-executar)
- [Utilização por perfil](#utilização-por-perfil)
- [Estrutura de directórios](#estrutura-de-directórios)
- [API – visão geral](#api--visão-geral)
- [Próximos passos](#próximos-passos)
- [Créditos](#créditos)

---

## 🚀 Principais funcionalidades

| Área | Descrição |
|------|-----------|
| Landing page | Apresentação institucional, explicação do serviço e chamadas à acção para registo ou acesso. |
| Autenticação | Fluxo de cadastro e login com **JSON Web Token (JWT)**, armazenamento local em JSON para fins de demonstração. |
| Dashboard responsivo | Interface única que adapta funcionalidades consoante o tipo de utilizador (cliente, cuidador ou administrador). |
| Gestão de cuidadores | Cadastro de perfil profissional, disponibilidade, especialidades e certificados, com upload de avatar. |
| Busca avançada | Clientes pesquisam cuidadores verificados por distrito, tipo (cuidador/enfermeiro), especialidades e valor hora. |
| Painel administrativo | Visualização e gestão de todos os utilizadores, edição em linha, controlo de verificação e remoção de contas. |
| Contacto imediato | Botão “Falar no WhatsApp” para que clientes contactem cuidadores (link `wa.me`). |
| Persistência local | Todos os dados são gravados em `backend/data/users.json`, facilitando testes e demonstrações. |

---

## 🛠️ Arquitectura e tecnologias

- **Frontend**: HTML5, CSS3 (layout responsivo), JavaScript vanilla (SPA leve baseada em modais e trocas de secções).
- **Backend**: Node.js (Express 5), validação com `express-validator`, autenticação com JWT (`jsonwebtoken`) e `bcryptjs` desactivado para ambiente demo.
- **Persistência**: Ficheiro JSON local (`backend/data/users.json`) com estrutura completa de utilizadores e perfis profissionais.
- **Outras bibliotecas**:
  - `cors`, `dotenv` para configuração de ambiente e CORS.
  - `uuid` para geração de identificadores únicos.
  - `nodemon` para desenvolvimento.
  - Servidor estático simples (Python `http.server`) para frontend.

> ⚠️ O armazenamento de senhas em texto plano e o servidor de ficheiros estático foram mantidos para fins de demonstração local. Em produção, recomenda-se encriptação de senhas e alojamento moderno (ex.: Vite/React + CDN).

---

## 🧩 Preparação do ambiente

### Requisitos

- [Node.js 18+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (instalado com Node)
- Python 3 (apenas para servir o frontend localmente)  
  ou outra ferramenta de *static hosting* à sua escolha.

### Instalação de dependências

```bash
# Clonar o repositório
git clone https://github.com/brasrio/amigoscuidadorespt.git
cd amigoscuidadorespt

# Instalar dependências do backend
cd backend
npm install
cd ..

# (Opcional) Dependências do frontend mínimo
# npm install http-server --save-dev
```

---

## ▶️ Como executar

Existem duas formas recomendadas para iniciar o projecto durante o desenvolvimento.

### Opção 1 – Script automatizado (Windows)

```bash
.\iniciar.bat
```

O script:
1. Inicia o backend Express na porta **5000**.
2. Aguarda a inicialização.
3. Serve o frontend com `python -m http.server` na porta **3000**.

### Opção 2 – Comandos manuais (cross-platform)

**Terminal 1 – Backend**
```bash
cd backend
npm run dev    # utiliza nodemon para recarregar automaticamente
```

**Terminal 2 – Frontend**
```bash
# A partir da raiz do projecto
python -m http.server 3000
# ou, se preferir:
# npx http-server -p 3000
```

Segue-se aceder, no navegador, às rotas:
- Landing page / Aplicação: **http://localhost:3000/**
- API: **http://localhost:5000/**

---

## 👤 Utilização por perfil

| Perfil | Credenciais (demo) | Funcionalidades |
|--------|--------------------|-----------------|
| **Administrador** | `richard@admin.com` / <br>`barbara@admin.com` / | Acesso total ao dashboard, gestão de utilizadores, verificação de cuidadores, edição de dados alheios e remoção de contas. |
| **Cliente** | Criar conta via `Cadastrar` → “Busco Cuidador” | Pesquisar cuidadores verificados, visualizar detalhes, contactar via WhatsApp e gerir dados pessoais. |
| **Cuidador/Enfermeiro** | Criar conta via `Cadastrar` → “Sou Cuidador” | Actualizar disponibilidade, especialidades, certificados, taxa horária e avatar. Aguarda verificação pelo administrador para aparecer nas buscas. |

### Verificar cuidadores
1. Entre como administrador.
2. Navegue até **Gerenciar Usuários**.
3. Clique em **Editar** no cuidador desejado.
4. Seleccione a opção **Usuário verificado** e salve.
5. O cuidador passa a constar na busca pública dos clientes.

---

## 🗂️ Estrutura de directórios

```
amigoscuidadorespt/
├── backend/
│   ├── config/            # Configurações (JWT, porta, etc.)
│   ├── controllers/       # Controladores Express
│   ├── data/              # Base de dados local (users.json)
│   ├── middlewares/       # Autenticação, validação
│   ├── models/            # Modelos de dados (User)
│   ├── routes/            # Rotas da API
│   ├── server.js          # Ponto de entrada do backend
│   └── package.json
├── assets/                # Imagens, JSON de distritos/municípios
├── css/                   # Folhas de estilo (landing, dashboard)
├── js/                    # Scripts do frontend (api, login, cadastro, dashboard)
├── index.html             # Landing page
├── cadastro.html          # Página de cadastro
├── login.html             # Página de login
├── dashboard.html         # Dashboard autenticado
└── README.md
```

---

## 🔌 API – visão geral

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/register` | Regista um novo utilizador (cliente, cuidador, enfermeiro). |
| `POST` | `/api/auth/login` | Autenticação com geração de JWT. |
| `GET` | `/api/auth/verify` | Valida token activo e devolve dados do utilizador. |
| `GET` | `/api/users/profile` | Obtém o perfil do utilizador autenticado. |
| `PUT` | `/api/users/profile` | Actualiza dados do próprio utilizador (perfil, disponibilidade, skills, certificados, avatar). |
| `GET` | `/api/users/professionals` | Lista cuidadores verificados com filtros opcionais. |
| `GET` | `/api/users/professionals/:id` | Detalhes completos de um cuidador específico. |
| `GET` | `/api/users` *(admin)* | Lista todos os utilizadores. |
| `GET` / `PUT` / `DELETE` | `/api/users/:id` *(admin)* | Consulta, actualiza (com verificação) ou remove qualquer utilizador. |

> A documentação detalhada pode ser expandida com ferramentas como Swagger/OpenAPI para ambientes de produção.

---

## 📈 Próximos passos sugeridos

- Migrar o armazenamento para base de dados relacional ou NoSQL.
- Reintroduzir *hashing* de senha com `bcrypt` para produção.
- Integrar Stripe (ou outro PSP) no fluxo de contratação.
- Criar sistema de agendamentos e gestão de clientes para cuidadores.
- Implementar notificações e histórico de mensagens.
- Desenvolver testes unitários e end-to-end.

---

## 🤝 Créditos

- **Equipa Amigos Cuidadores** – visão e requisitos do produto.
- **Desenvolvimento** – implementação do backend e frontend deste protótipo interativo.
- Tecnologias abertas que tornaram o projeto possível: Node.js, Express, JWT, Python, HTML5, CSS, JavaScript.

---

Para quaisquer dúvidas ou contribuições, abra uma *issue* ou envie um *pull request*.  
Obrigado por utilizar o Amigos Cuidadores!
