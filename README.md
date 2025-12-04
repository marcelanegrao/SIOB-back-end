# Repositório do Backend da Aplicação SIOB

*Backend do Sistema Integrado de Operações de Bombeiros (SIOB).*

### Framework e Ambiente Principal
![Node.js](https://img.shields.io/badge/Node.js-800080?style=for-the-badge&logo=nodedotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-800080?style=for-the-badge&logo=typescript&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-800080?style=for-the-badge&logo=express&logoColor=white)

### Banco de Dados e ORM
![MySQL](https://img.shields.io/badge/MySQL-800080?style=for-the-badge&logo=mysql&logoColor=white) ![TiDB](https://img.shields.io/badge/TiDB-800080?style=for-the-badge&logo=mysql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-800080?style=for-the-badge&logo=prisma&logoColor=white)

### Infraestrutura e Deploy
![Docker](https://img.shields.io/badge/Docker-800080?style=for-the-badge&logo=docker&logoColor=white) [![Deploy to Render](https://img.shields.io/badge/Render-800080?style=for-the-badge&logo=render&logoColor=white)](https://render.com)

### Validação e Ferramentas
![Zod](https://img.shields.io/badge/Zod-800080?style=for-the-badge&logo=zod&logoColor=white) ![Swagger](https://img.shields.io/badge/Swagger-800080?style=for-the-badge&logo=swagger&logoColor=white) ![Cloudinary](https://img.shields.io/badge/Cloudinary-800080?style=for-the-badge&logo=cloudinary&logoColor=white)

---

## 1. Visão Geral

Este repositório contém o código-fonte do backend do **SIOB (Sistema Integrado de Operações de Bombeiros)**.
Trata-se de uma **API RESTful** robusta e segura, projetada para gerenciar ocorrências operacionais, usuários militares, logs de auditoria e geração de relatórios estatísticos.

**API ao vivo:** [https://siob-back-end.onrender.com](https://siob-back-end.onrender.com)

**Documentação da API (Swagger):** [https://siob-back-end.onrender.com/api-docs](https://siob-back-end.onrender.com/api-docs)

## 2. Estado do Projeto

A implementação dos requisitos funcionais do backend foi **concluída e implantada em produção**.

* [x] **W-01 | Login & Perfis:** Controle de acesso (Admin, Analista, Chefe, Operador de Campo).
* [x] **W-02 | Lista & Filtros de Ocorrências:** Listagem com filtros por status, bairro, tipo, prioridade e data.
* [x] **W-03 | Visualização de Detalhes:** Dados completos da ocorrência, incluindo vítimas e mídia.
* [x] **W-04 | Relatórios Básicos & Exportação:** Geração de arquivos PDF e CSV.
* [x] **W-05 | Gestão de Usuários:** CRUD completo com validação de patentes militares.
* [x] **W-06 | Auditoria & Logs:** Registro automático de ações críticas (criação, edição, exclusão).
* [x] **W-07 | Dashboard Operacional:** KPIs de ocorrências por Status, Tipo e Bairro.
* [x] **(Novo) | Upload de Mídia:** Integração com **Cloudinary** para armazenamento de fotos e anexos.

## 3. Arquitetura e Decisões de Design

A aplicação segue uma arquitetura modular baseada em serviços.

* **Framework Web:** Express.js
* **Banco de Dados:** MySQL 8.0 (Local) / TiDB Cloud (Produção)
* **ORM:** Prisma (Schema-first)
* **Segurança (Autenticação):** Tokens JWT (`jsonwebtoken`) e Hash de senha com `bcrypt`.
* **Segurança (Headers):** `helmet` para proteção HTTP.
* **Upload de Mídia:** `multer` + `cloudinary` para gestão eficiente de arquivos.
* **Validação:** `zod` para garantir a integridade dos dados de entrada.
* **Documentação:** Swagger (OpenAPI 3.0) gerado automaticamente via código.

## 4. Como Executar o Projeto Localmente

### 1. Pré-requisitos
* Node.js (v18+)
* Docker e Docker Compose (para o banco de dados local)

### 2. Configuração

1. Clone este repositório.
2. Na raiz do projeto, crie um arquivo `.env` com as seguintes variáveis:

```env
# Banco de Dados (MySQL Docker Local)
DATABASE_URL="mysql://user:password@localhost:3306/siob_db"

# Segurança
JWT_SECRET="sua_chave_secreta_aqui"

# Uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret

# Configuração API
PORT=3000
NODE_ENV=development
````

### 3\. Execução

Suba o banco de dados MySQL via Docker:

```bash
docker-compose up -d
```

Instale as dependências e rode as migrações do banco:

```bash
npm install
npx prisma db push
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

## 5\. Deployment (Render + TiDB)

A aplicação está hospedada no **Render**, conectada a um banco de dados MySQL Serverless no **TiDB Cloud**.

  * **Build Command:** `npm install && npm run build`
  * **Start Command:** `npm start`
  * **Variáveis de Ambiente:** Configuradas diretamente no dashboard do Render.

## 6\. Documentação da API (Endpoints)

Todos os endpoints são prefixados com `/api/v1`.

### Autenticação (`/auth`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/register` | Registra um novo usuário (criação inicial ou admin) |
| `POST` | `/login` | Autentica e retorna um token JWT |

### Ocorrências (`/ocorrencias`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/` | Cria uma nova ocorrência |
| `GET` | `/` | Lista ocorrências (com paginação e filtros) |
| `GET` | `/:id` | Detalhes completos de uma ocorrência |
| `PUT` | `/:id` | Atualiza status ou dados da ocorrência |
| `DELETE` | `/:id` | Remove uma ocorrência |
| `POST` | `/:id/midias` | Upload de imagem/PDF para a ocorrência |

### Gestão de Usuários (`/users`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/` | Lista todos os usuários |
| `POST` | `/` | Cria um usuário (acesso restrito) |
| `GET` | `/:id` | Detalhes de um usuário |
| `PUT` | `/:id` | Atualiza dados/cargo de um usuário |
| `DELETE` | `/:id` | Inativa ou remove um usuário |

### Dashboard e Relatórios

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/dashboard` | KPIs para gráficos (Status, Tipo, Bairro) |
| `GET` | `/relatorios?format=pdf` | Baixa relatório completo em PDF |
| `GET` | `/relatorios?format=csv` | Baixa relatório completo em CSV |
