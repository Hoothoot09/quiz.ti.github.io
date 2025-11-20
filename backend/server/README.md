# Backend — `backend/server/`

Este documento descreve como desenvolver, executar e implantar o backend Flask deste projeto.

Conteúdo
- Execução local (venv + Flask)
- Execução em produção (gunicorn)
- Docker (build da imagem do backend)
- Migração de dados e utilitários
- Variáveis de ambiente
- Observabilidade e troubleshooting

Execução local (desenvolvimento)

1. Crie e ative um virtualenv:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Instale dependências:

```bash
pip install -r requirements.txt
```

3. Rode o servidor em modo desenvolvimento (Flask):

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --port 3000
```

O servidor ficará acessível em `http://127.0.0.1:3000`.

Execução em produção (gunicorn)

Para executar de forma mais robusta, use `gunicorn`:

```bash
# a partir de backend/server
gunicorn app:app -b 0.0.0.0:3000 --workers 2
```

Docker (imagem do backend)

O `Dockerfile` na pasta constrói uma imagem a partir de `python:3.11-slim`, instala dependências e inicia `gunicorn`. No `docker-compose.yml` do projeto raiz o serviço `backend` é construído a partir deste diretório.

Migração de dados (`db.json` → Postgres)

Ferramentas disponíveis:
- `migrate_json_to_pg.py` — script Python que lê `db.json` e insere registros no Postgres apontado por `DATABASE_URL`.
- `db.sql` — arquivo SQL gerado com DDL e INSERTs do conteúdo atual de `db.json`.

Exemplos:

```bash
# Dry-run (mostra o que seria importado)
python migrate_json_to_pg.py --dry-run

# Execução real (precisa de DATABASE_URL configurada)
export DATABASE_URL=postgresql://user:pass@host:5432/dbname
python migrate_json_to_pg.py
```

Variáveis de ambiente importantes
- `DATABASE_URL` — se fornecida, o backend tenta conectar ao Postgres e usar a tabela `leaderboard`.
  - Exemplo: `postgresql://quiz:quizpass@db:5432/quizdb`
- `PORT` — porta em que o processo (se você configurar) deve escutar; por padrão `gunicorn` usa `3000` no Dockerfile.

Fallback para `db.json`

Se `DATABASE_URL` não estiver setada ou o Postgres estiver indisponível, o backend usa `db.json` na raiz deste diretório como armazenamento local. Isso é intencional para permitir desenvolvimento sem banco.

Observabilidade e logs

- Logs do `gunicorn` são impressos no stdout/stderr — em containers use `docker-compose logs backend`.
- Para debug local, rode Flask no modo `development` para ver tracebacks.

Problemas comuns
- Erro de conexão com Postgres: confirme `DATABASE_URL` e conectividade de rede (ex.: `psql "$DATABASE_URL" -c "SELECT 1;"`).
- Dados não aparecem: se estiver usando Docker e o volume `db_data` já existir, o arquivo `db.sql` não será reaplicado — remova o volume (`docker-compose down -v`) ou importe manualmente com `psql -f backend/server/db.sql`.

Se quiser, eu adiciono exemplos de unit tests e um pequeno `Makefile` para facilitar comandos repetitivos.
# Server (leaderboard API)

Este diretório contém o backend da aplicação — uma API REST em Python (Flask) que fornece os endpoints para o leaderboard do quiz.

Localização dos ficheiros principais

- `app.py` — implementação Flask com fallback em `db.json` e suporte a `DATABASE_URL` para Postgres.
- `db.json` — arquivo JSON de fallback com os registos da leaderboard.
- `requirements.txt` — dependências Python.
- `Dockerfile` — imagem Docker para o backend em Python.
- `Procfile` — comando para execução em plataformas como Heroku (usa `gunicorn`).
- `legacy_node/` — versão Node/Express arquivada.

Endpoints

- `GET /leaderboard` — retorna os top 100 registos (ordenados por `score` desc, `date` desc).
- `POST /leaderboard` — recebe JSON `{ name, sector, score }` (score numérico) e devolve o leaderboard atualizado.

Instalação / execução (desenvolvimento)

```bash
cd backend/server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# modo desenvolvimento (rápido):
python app.py
# modo production-like:
gunicorn app:app -b 0.0.0.0:3000 --workers 1
```

Configurar a URL da API no frontend

No `frontend/quiz.html` podes definir a meta tag `quiz-api-url` com a URL do servidor (ex.: `http://localhost:3000`). O `script.js` procura esta meta tag e usa-a como `apiUrl`.

Persistência

- Por defeito o servidor usa `db.json` (fácil para testes locais).
- Se `DATABASE_URL` estiver definida no ambiente, o servidor usa Postgres (cria a tabela `leaderboard` automaticamente na primeira execução).

Migração do `db.json` para Postgres

Um script de migração `migrate_json_to_pg.py` foi adicionado. Ele lê `db.json` e insere os registos na tabela `leaderboard` de um Postgres apontado por `DATABASE_URL` ou por argumento `--database-url`.

Exemplo de uso (local):

```bash
# export DATABASE_URL='postgres://user:pass@host:5432/dbname'
python migrate_json_to_pg.py --file db.json --dry-run
# quando satisfeito (sem --dry-run) irá inserir os registos
python migrate_json_to_pg.py --file db.json
```

Docker

Construir e executar a imagem Docker do backend:

```bash
cd backend/server
docker build -t quiz-api:py .
docker run -p 3000:3000 -v "$(pwd)/db.json":/usr/src/app/db.json quiz-api:py
```

Notas de segurança

- Use uma base de dados gerida (Render, Railway, Supabase, AWS RDS) para produção.
- Proteja o endpoint com TLS e, se necessário, autenticação e rate limiting.

Se precisares, posso:
- executar a migração num ambiente Postgres (se forneceres `DATABASE_URL` local ou remoto),
- ou gerar scripts adicionais para exportar/importar dados em CSV.
# Server (leaderboard API)

This is a small Node.js Express API used to store and return the quiz leaderboard. It supports two persistence modes:

- Postgres (recommended for deployment) when `DATABASE_URL` env var is set.
- local `db.json` file as fallback (used for local testing).

Endpoints:

- `GET /leaderboard` — returns the top 100 scores, ordered by score desc then date desc.

- `POST /leaderboard` — body `{ name, sector, score }` (score must be numeric); returns updated top list.

Quick start (local):

```powershell
cd server
npm install
node index.js
```

By default the server will use `db.json` in the server folder. To use Postgres (recommended for Render):

1. Create a Postgres database (Render, Railway, Supabase or any provider).
2. Set the environment variable `DATABASE_URL` in the Render dashboard (or in your shell for local testing) to the connection string (e.g., `postgres://user:pass@host:5432/dbname`).
3. Restart the server — it will create the `leaderboard` table automatically if missing.

Render deployment tips:

- Connect your GitHub repository to Render and create a Web Service pointing to the `server/` directory.

- Add `DATABASE_URL` as an env var on the service (Render provides managed Postgres or you can create an external DB).

- Ensure the start command is `node index.js` (already configured in package.json scripts).

## Deploying with Docker (optional)

You can also deploy the server as a Docker container (Render supports Docker deployments). A sample `Dockerfile` is provided in the `server/` folder.

Build locally to test the image:

```powershell
cd server
docker build -t quiz-api:local .
docker run -p 3000:3000 -e PORT=3000 quiz-api:local
```

The container will start the server and listen on port 3000.

## render.yaml

A template `render.yaml` is included at the repo root to help with Render's Infrastructure as Code. Edit the `repo`/`branch` fields if needed before using it.

Security:

- Consider adding rate limiting and input sanitization for production.

- Use TLS (https) and restrict DB access appropriately.

If you want, I can prepare a Dockerfile and Render-specific `render.yaml` for faster deployment.
