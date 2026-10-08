# Guia de Setup — Ambiente de Desenvolvimento (Docker)

## Pré-requisito

Instalar o **Docker Desktop** (Windows/Mac) ou **Docker Engine + Docker Compose** (Linux):
https://www.docker.com/products/docker-desktop/

Confirmar que está instalado:

```bash
docker --version
docker compose version
```

## Estrutura de pastas esperada

```
ecommerce/
  backend/
    Dockerfile        ← já fornecido
  docker/
    nginx/
      default.conf    ← já fornecido
  docker-compose.yml   ← já fornecido
```

Coloca os três arquivos que criei exatamente nesses caminhos relativos, dentro de uma pasta `ecommerce/` (ou o nome que preferires para o projeto).

## Passo 1 — Construir a imagem do backend

Dentro da pasta `ecommerce/`:

```bash
docker compose build app
```

Isto lê o `backend/Dockerfile` e monta uma imagem PHP 8.3 com as extensões necessárias e o Composer.

## Passo 2 — Criar o projeto Laravel dentro do container

Como ainda não existe projeto Laravel, usamos o container só para o Composer criar um:

```bash
docker compose run --rm app composer create-project laravel/laravel .
```

Isto vai popular a pasta `backend/` com um projeto Laravel novo (o `.` no fim indica "instalar aqui", já que o `working_dir` do container é `/var/www`, mapeado para `./backend`).

## Passo 3 — Configurar a conexão com o PostgreSQL

Depois do passo 2, vai existir `backend/.env`. Editar estas linhas para bater com o `docker-compose.yml`:

```
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=ecommerce
DB_USERNAME=ecommerce_user
DB_PASSWORD=ecommerce_pass
```

Note: `DB_HOST=db` porque dentro da rede Docker o Postgres é acessível pelo nome do serviço (`db`), não por `localhost`.

## Passo 4 — Subir tudo

```bash
docker compose up -d
```

- `-d` roda em background.
- Isto sobe: `app` (PHP-FPM), `webserver` (Nginx na porta 8000), `db` (Postgres na porta 5432).

## Passo 5 — Verificar

Abrir no browser: http://localhost:8000 — deve aparecer a página inicial do Laravel.

## Comandos do dia a dia

```bash
# Rodar comandos artisan dentro do container
docker compose exec app php artisan migrate
docker compose exec app php artisan make:model Product -m

# Ver logs
docker compose logs -f app

# Parar tudo
docker compose down

# Parar e apagar também os dados do banco (cuidado)
docker compose down -v
```

## O que cada peça faz (resumo)

- **`app` (PHP-FPM):** executa o código PHP do Laravel. Não serve HTTP diretamente.
- **`webserver` (Nginx):** recebe pedidos HTTP na porta 8000 e repassa para o `app` via protocolo FastCGI (porta 9000, interna à rede Docker).
- **`db` (PostgreSQL):** guarda os dados. Porta 5432 exposta ao host para poderes ligar um cliente (ex: DBeaver, TablePlus) diretamente à tua máquina, se quiseres inspecionar o banco fora do container.

Assim que tiveres isto a correr, avisa-me e avançamos para desenhar o schema (migrations) do Módulo 1.
