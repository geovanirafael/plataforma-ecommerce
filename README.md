# E-commerce — Full-Stack (Laravel + React)

Plataforma de e-commerce completa, construída como projeto de aprendizagem e portfólio, cobrindo o ciclo completo de um sistema real: autenticação, catálogo, carrinho, checkout transacional, pagamentos e um painel administrativo.

## Stack

**Backend**
- PHP 8.3 + Laravel 11
- PostgreSQL 16
- JWT (`tymon/jwt-auth`) para autenticação stateless
- Docker + Docker Compose (Nginx, PHP-FPM, PostgreSQL)

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- React Router, Axios, Context API

## Funcionalidades

- Autenticação JWT (registo, login, refresh, logout) com RBAC (cliente/administrador)
- Catálogo de produtos com busca, filtro por categoria e paginação
- Carrinho de compras persistente por utilizador
- Checkout transacional com proteção contra concorrência (`lockForUpdate`) e congelamento de preço no histórico
- Pagamento simulado via gateway desacoplado (Strategy Pattern — trocável por um gateway real sem alterar a lógica de negócio)
- Painel administrativo: dashboard com métricas agregadas (com cache), gestão de categorias e produtos
- Arquitetura em camadas (Controller → Service → Model), Policies para autorização por posse de recurso, API Resources para formatar respostas

## Arquitetura

Frontend (React) ──HTTPS/JSON──▶ Nginx ──▶ PHP-FPM (Laravel) ──▶ PostgreSQL


Backend organizado em camadas: `Controller` (validação e resposta HTTP) → `Service` (regra de negócio) → `Model` (Eloquent/banco de dados), com `Policies` para autorização baseada em posse de recurso e `Resources` para controlar o formato das respostas da API.

## Como correr localmente

Pré-requisitos: [Docker Desktop](https://www.docker.com/products/docker-desktop/) e [Node.js](https://nodejs.org/).

### Backend

```bash
cp backend/.env.example backend/.env
docker compose build app
docker compose up -d
docker compose exec app php artisan key:generate
docker compose exec app php artisan jwt:secret
docker compose exec app php artisan migrate --seed
```

A API fica disponível em `http://localhost:8000/api`.

Utilizador de teste criado pelo seeder: `admin@teste.com` / `senha1234` (admin).

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`.