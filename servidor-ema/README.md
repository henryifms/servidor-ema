# Servidor EMA

Servidor da Estação Meteorológica Automática de Três Lagoas.

## Tecnologias

- Node.js 20 + TypeScript
- Express 5
- Sequelize 6 + PostgreSQL/PostGIS
- Redis
- Docker / Docker Compose

## Como rodar com Docker

```bash
# Copie o arquivo de variáveis de ambiente
cp .env.example .env
# Edite o .env e preencha APP_SECRET

# Suba os containers
docker compose up --build

# Em outro terminal, rode as migrações
docker compose run --rm migrate
```

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `yarn dev` | Inicia o servidor em modo desenvolvimento |
| `yarn build` | Compila o TypeScript para `dist/` |
| `yarn start` | Inicia o servidor compilado |
| `yarn migrate` | Executa as migrações do banco |
| `yarn migrate:undo` | Desfaz todas as migrações |
