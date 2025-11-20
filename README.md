Quiz — Guia completo de execução, desenvolvimento e implantação
=============================================================

Resumo
------
Este repositório contém um quiz estático (frontend) e um backend em Python (Flask). O backend suporta persistência em PostgreSQL quando `DATABASE_URL` está configurada e possui um fallback para um arquivo local `db.json` para desenvolvimento simples.

O projeto foi estruturado para facilitar desenvolvimento local e um deploy reproduzível via `docker compose` (Postgres + backend + nginx que serve o frontend e proxya `/api` para o backend).

Estrutura principal
------------------
- `frontend/` — HTML/CSS/JS e assets do quiz (`quiz.html`, `script.js`, `styles.css`, `image/`).
- `backend/server/` — backend Flask, `requirements.txt`, `Dockerfile`, scripts de migração e `db.json` (fallback).
- `docker/` — configuração do `nginx` usada pelo `docker compose`.
- `quiz.ti.github.io/docker-compose.yml` — compose para `db`, `backend` e `nginx`.
- `scripts/` — utilitários (exportar/restore/clean).
- `backups/` — backups gerados (não deve ser comitado).

Riscos e notas rápidas
----------------------
- Este README assume uso local para desenvolvimento e testes. Não use as senhas padrão em produção.
- O compose inicializa o Postgres com `backend/server/db.sql` apenas na primeira criação do volume. Para reimportar, remova o volume `db_data` e suba novamente, ou use nossos scripts de restauração.

Pré-requisitos
--------------
- Docker + Docker Compose v2 (recomendado para reproduzir o ambiente)
- Python 3.11+ (para desenvolvimento sem Docker)
- `make` (opcional — há um `Makefile` com atalhos)

Quickstart — executar a stack com Docker (recomendado)
---------------------------------------------------
1. No diretório raiz do repositório:

```bash
# build e subir em background
docker compose -f quiz.ti.github.io/docker-compose.yml up -d --build

# ver status
docker compose -f quiz.ti.github.io/docker-compose.yml ps
```

2. Acesse o frontend em `http://localhost:8080/quiz.html`.

3. Testes rápidos:

```bash
# GET leaderboard via nginx proxy
curl -s http://localhost:8080/api/leaderboard | jq .

# POST exemplo
curl -X POST http://localhost:8080/api/leaderboard \
  -H 'Content-Type: application/json' \
  -d '{"name":"Teste","sector":"Dev","score":9}' | jq .
```

Executando localmente sem Docker (desenvolvimento)
-----------------------------------------------
1. Crie e ative um virtualenv, instale dependências:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/server/requirements.txt
```

2. Rodar o backend (modo dev):

```bash
cd backend/server
FLASK_APP=app.py FLASK_ENV=development flask run --port 3000
# ou, para um runner WSGI: gunicorn app:app -b 0.0.0.0:3000 --workers 2
```

3. Servir frontend localmente (opcional):

```bash
cd frontend
python3 -m http.server 5500
# abrir http://localhost:5500/quiz.html
```

Observação sobre a URL da API
----------------------------
O frontend obtém a URL da API nesta ordem de prioridade:
1. Meta tag no HTML: `<meta name="quiz-api-url" content="...">`
2. `window.QUIZ_CONFIG = { apiUrl: '...' }`
3. `window.API_URL`
4. fallback para `localStorage` (sem API)

No deployment via nginx (compose), o `quiz.html` já foi ajustado para `content="/api"`, assim as chamadas do browser vão para `http://localhost:8080/api/...` e o nginx proxya para o backend.

Migração de dados e persistência
--------------------------------
O projeto suporta duas formas de persistência:

- Fallback `db.json`: arquivo em `backend/server/db.json` usado quando `DATABASE_URL` não está definido.
- Postgres: quando `DATABASE_URL` está configurado o backend usa Postgres.

Ferramentas de migração/disponíveis:
- `backend/server/db.sql` — DDL + INSERTs gerados a partir do `db.json` (usado pelo compose na inicialização do container `db`).
- `backend/server/migrate_json_to_pg.py --file path/to/db.json [--database-url URL] [--dry-run]` — script Python para importar JSON em Postgres.
- `scripts/export_db.sh` — exporta SQL e CSV para `quiz.ti.github.io/backups/`.
- `scripts/restore_from_sql.sh <path>` — restaura SQL para o Postgres do compose.

Como migrar rapidamente (usando a stack que o compose inicia):

```bash
# supondo que o compose está rodando e o serviço db expõe o Postgres
sudo docker compose -f quiz.ti.github.io/docker-compose.yml exec backend python migrate_json_to_pg.py --file db.json
```

Backup e restauração (safety-first)
----------------------------------
Use os scripts incluídos para export/import:

```bash
# cria backups em quiz.ti.github.io/backups/
./scripts/export_db.sh

# restaurar de SQL (ex.: backups/db_export.sql)
./scripts/restore_from_sql.sh quiz.ti.github.io/backups/db_export.sql

# parar e limpar containers (preserva volumes):
./scripts/clean_compose.sh

# parar e apagar volumes (apaga dados):
sudo docker compose -f quiz.ti.github.io/docker-compose.yml down -v
```

Nota: os backups gerados são colocados em `quiz.ti.github.io/backups/`. Esta pasta está em `.gitignore` para evitar comitar dumps.

Makefile e automações
---------------------
Há um `Makefile` com atalhos úteis:

```bash
make install      # cria .venv e instala dependências
make up           # docker compose up --build (foreground)
make upd          # docker compose up -d --build (background)
make migrate-dry  # executa migrate_json_to_pg.py --dry-run
make migrate      # executa a migração (precisa DATABASE_URL ou compose rodando)
make logs         # docker compose logs -f
```

CI
--
Incluí um workflow simples em `.github/workflows/ci.yml` que roda em push/PR contra `main` e executa:
- instalação das dependências Python do backend
- verificação de sintaxe (py_compile)
- execução `migrate_json_to_pg.py --dry-run`

Melhores práticas e segurança
----------------------------
- Nunca mantenha senhas padrão em repositórios públicos. Troque `quizpass` antes de expor a stack.
- Não comite dumps de banco. Use `quiz.ti.github.io/backups/` localmente e configure backups externos seguros para produção.
- Se for para produção, use variáveis de ambiente seguras (ex.: `DATABASE_URL`) e um Postgres gerenciado.

Verificação de código — checagens realizadas
------------------------------------------
- Verifiquei sintaxe Python (`py_compile`) em `backend/server/app.py` e `migrate_json_to_pg.py`.
- Rodei migração dry-run com o conteúdo atual de `db.json` e importei os dados em um Postgres local via `docker compose`.
- Exporteis backups SQL/CSV em `quiz.ti.github.io/backups/`.

Problemas comuns e solução rápida
--------------------------------
- Erro de permissão ao usar Docker: rode `sudo` ou adicione seu usuário ao grupo `docker` (`sudo usermod -aG docker $USER` e re-login).
- `nginx` retorna 502: verifique `docker compose logs backend` e `docker compose logs nginx`.
- Os dados não mudam após reiniciar: provavelmente o volume `db_data` já existe — para reaplicar `db.sql` remova o volume com `down -v` e suba novamente.

Próximos passos recomendados (se quiser)
--------------------------------------
1. Eu aplico pequenos housekeeping: remover `version` do `docker-compose.yml` (já feito), mover backups para `backups/` (feito) e criar scripts de export/restore (feito).
2. Posso também adicionar um `docker-compose.prod.yml` e instruções para deploy em um VPS ou cloud provider.
3. Adicionar testes automatizados (unit + E2E com Playwright) e pipeline de CI mais completo.

Suporte
-------
Se quiser, eu:
- atualizo mais exemplos no README (ex.: comandos para PostgreSQL remoto),
- adiciono scripts adicionais (ex.: `scripts/reset_db.sh`),
- implemento testes E2E automatizados que abrem o frontend, executam um quiz e validam o leaderboard.

Diga qual destas ações você quer que eu realize a seguir.
<!--- Top-level README: Full documentation for running, developing and deploying the quiz application -->

# Quiz — Guia de execução e desenvolvimento

Este repositório contém um quiz estático (frontend) e um backend em Python (Flask) com persistência opcional em PostgreSQL ou fallback em `db.json` para desenvolvimento local.

Resumo das pastas
- `frontend/` — arquivos estáticos (HTML, CSS, JS, imagens). A aplicação browser obtém/ envia pontuações para `/api/leaderboard` quando executada via `nginx` no `docker-compose`, ou diretamente para o backend quando configurado.
- `backend/server/` — backend Python (Flask). Contém `app.py`, `requirements.txt`, `db.json` (fallback), scripts de migração e Dockerfile.

Objetivos deste README
- Explicar como executar localmente com e sem Docker
- Documentar como usar `docker-compose.yml` para um deploy local reproduzível (Postgres + backend + nginx)
- Instruções de migração de dados (`db.json` → Postgres)
- Comandos úteis para desenvolvedores e solução de problemas

Conteúdo rápido
- Executar com Docker (recomendado, reproduzível):

```bash
docker-compose up --build
```

- Acesse o frontend em: `http://localhost:8080/quiz.html`
- A API é exposta pelo nginx em `/api/leaderboard` (proxy para o backend). Internamente o backend escuta em `3000`.

Arquitetura
- `nginx` (servindo `frontend/`) — proxy `/api` → `backend:3000`.
- `backend` — Flask + gunicorn, se `DATABASE_URL` apontar para Postgres usa banco; caso contrário usa o arquivo `db.json` (modo development/fallback).
- `db` — Postgres (opcional com Docker). O compose inicializa o banco com `backend/server/db.sql` se esse arquivo existir.

Executando com Docker (passo a passo)

1. Garanta que `docker` e `docker-compose` estejam instalados.
2. No diretório raiz do projeto, execute:

```bash
docker-compose up --build
```

3. Na primeira vez o Postgres será inicializado. O serviço nginx ficará disponível na porta `8080` do host.

Comandos úteis:

```bash
# Subir em background
docker-compose up --build -d

# Ver logs (todos os serviços)
docker-compose logs -f

# Parar e remover containers (mantém volumes)
docker-compose down

# Parar e remover containers e volumes (remove dados do Postgres)
docker-compose down -v
```

Configuração do compose (padrões)
- Postgres: usuário `quiz`, senha `quizpass`, db `quizdb`.
- Backend: `DATABASE_URL` configurado automaticamente para `postgresql://quiz:quizpass@db:5432/quizdb` dentro do compose.
- Nginx publica porta `8080:80` — altere `docker-compose.yml` se desejar outra porta.

Executando sem Docker (modo desenvolvedor)

1. Crie um virtualenv e instale dependências:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/server/requirements.txt
```

2. Inicie o backend (modo desenvolvimento):

```bash
cd backend/server
FLASK_APP=app.py FLASK_ENV=development flask run --port 3000
```

3. Sirva o frontend localmente (por exemplo usando Python HTTP server):

```bash
cd frontend
python3 -m http.server 5500
# Acesse http://localhost:5500/quiz.html
```

Observação: o `frontend/quiz.html` contém a meta `quiz-api-url` apontando para `/api` no modo Docker (nginx). Se for executar o backend diretamente e acessar o frontend via `http.server`, ajuste temporariamente a meta para `http://localhost:3000` ou defina `window.API_URL` no console.

Migração de dados (`db.json` → Postgres)

Opções disponíveis:

- Automática (script Python): `backend/server/migrate_json_to_pg.py` — lê `backend/server/db.json` e insere no banco apontado por `DATABASE_URL`.
- Manual (arquivo SQL): `backend/server/db.sql` — contém DDL e INSERTs gerados a partir do JSON; você pode importar diretamente com `psql -f`.

Exemplo usando `psql` (fora do Docker):

```bash
# usando DATABASE_URL
export DATABASE_URL=postgresql://user:pass@host:5432/dbname
psql "$DATABASE_URL" -f backend/server/db.sql

# ou com parâmetros
psql -h host -U user -d dbname -f backend/server/db.sql
```

Se quiser executar a migração via script Python:

```bash
cd backend/server
source ../../.venv/bin/activate   # caminho relativo ao root, ajuste conforme seu ambiente
export DATABASE_URL=postgresql://user:pass@host:5432/dbname
python migrate_json_to_pg.py --dry-run   # primeiro veja o que seria importado
python migrate_json_to_pg.py              # então execute
```

Notas importantes
- O compose atual monta `./backend/server/db.sql` em `/docker-entrypoint-initdb.d/` no container Postgres — isso só é usado na inicialização do banco (quando o volume `db_data` ainda não existe). Se quiser reimportar, rode `docker-compose down -v` e suba novamente, ou importe manualmente com `psql -f backend/server/db.sql`.
- Se você prefere um banco vazio ao rodar o compose, remova a linha do volume `./backend/server/db.sql:/docker-entrypoint-initdb.d/db.sql:ro` em `docker-compose.yml`.
- O backend faz fallback para `db.json` caso não consiga se conectar ao Postgres (útil para desenvolvimento local sem banco).

Testes / Verificação

1. Verifique o endpoint GET `/api/leaderboard` (via nginx):

```bash
curl -s http://localhost:8080/api/leaderboard | jq .
```

2. Enviar uma pontuação (POST):

```bash
curl -X POST http://localhost:8080/api/leaderboard \
  -H 'Content-Type: application/json' \
  -d '{"name":"Teste","sector":"Dev","score":9}' | jq .
```

3. Se o Postgres estiver ativo, verifique as tabelas:

```bash
docker-compose exec db psql -U quiz -d quizdb -c "SELECT count(*) FROM leaderboard;"
docker-compose exec db psql -U quiz -d quizdb -c "SELECT * FROM leaderboard ORDER BY score DESC LIMIT 5;"
```

Resolução de problemas

- Problema: `curl` retorna 502/504 do nginx
  - Causa: backend não iniciado ou não acessível. Verifique logs do backend: `docker-compose logs backend`.

- Problema: dados não aparecem no Postgres após levantar o compose
  - Causa provável: volume `db_data` já existia antes da inclusão de `db.sql`. Para reimportar, rode `docker-compose down -v` e suba novamente, ou importe manualmente com `psql -f backend/server/db.sql`.

- Problema: frontend tenta acessar `http://localhost:3000` quando está via nginx
  - Solução: confirme que `frontend/quiz.html` tem `<meta name="quiz-api-url" content="/api">`. Se não, atualize ou limpe cache do navegador.

Contribuição e desenvolvimento

- Para alterações no backend, entre em `backend/server/` e edite `app.py`. As dependências ficam em `backend/server/requirements.txt`.
- Para alterar o frontend, edite `frontend/quiz.html`, `frontend/script.js` e `frontend/styles.css`.
- Se quiser adicionar testes automatizados ou docker-compose para CI, posso ajudar a escrever um `docker-compose.ci.yml` e um `Makefile` com comandos úteis.

Licença e créditos

Este repositório foi adaptado para uso local com instruções de migração. Ajuste configurações, senhas e volumes antes de usar em produção.

---
Se quiser, atualizo também `backend/server/README.md` com instruções específicas do backend e os comandos de migração (ou adiciono exemplos de `docker-compose.override.yml`). Quer que eu faça isso agora?

Makefile e CI

Incluí um `Makefile` na raiz para facilitar tarefas comuns. Exemplos:

```bash
# criar venv e instalar dependências
make install

# subir stack (foreground)
make up

# subir stack em background
make upd

# rodar dry-run da migração
make migrate-dry

# parar e remover containers + volumes
make downv
```

Adicionalmente há um workflow de CI em `.github/workflows/ci.yml` que roda em push/PR contra `main` e realiza:
- instalação das dependências Python do backend
- verificação de sintaxe (py_compile)
- execução de `migrate_json_to_pg.py --dry-run`
- execução opcional de `flake8` (não blockeia o job por padrão)

Esses itens ajudam a garantir que alterações no backend não quebrem a migração ou causem erros de sintaxe automaticamente.

# Guia / Quiz — Uso Responsável da Tecnologia

Uma aplicação estática (HTML/CSS/JS) para avaliar conhecimentos sobre o uso responsável de equipamentos e softwares corporativos. Este repositório contém um quiz interativo pensado para treinamento interno: o usuário responde uma pergunta por vez, recebe feedback imediato, pode ver explicações e, ao final, salvar seu resultado em um ranking (nome + setor) armazenado no navegador.

## Principais funcionalidades

- Exibição de 1 pergunta por vez com navegação Anterior / Próxima.

- Seleção de uma opção por pergunta (marcação visual `.selected`).

- Verificação por pergunta: ao clicar em "Verificar Respostas" a pergunta atual é avaliada, a alternativa correta é destacada e o usuário recebe feedback (correto/errado) e uma explicação.

- Pontuação: cada acerto vale 1 ponto; pontuação total exibida ao completar todas as questões.

- Ranking (leaderboard): ao finalizar o quiz o usuário pode gravar nome e setor e salvar a pontuação; os resultados são persistidos no `localStorage` e exibidos em um leaderboard (top 10).

- Reiniciar quiz: botão "Refazer Quiz" reseta o estado para jogar novamente.

## Onde editar perguntas e explicações


- `quiz.html` — cada pergunta está dentro de uma `<div class="quiz-question">` com as opções `.quiz-option`.

Para adicionar uma explicação visível quando a pergunta for verificada, inclua no elemento da pergunta o atributo `data-explanation`, por exemplo:

```html
<div class="quiz-question" data-explanation="Explicação breve sobre por que a alternativa X é correta.">
  <!-- conteúdo da pergunta -->
</div>
```

Se `data-explanation` não existir, o quiz mostrará uma mensagem orientando como adicionar a explicação.

## Arquivos principais

- `quiz.html` — marcação do quiz e controles.

- `styles.css` — estilos, incluindo classes para estados de opção (`.selected`, `.correct`, `.incorrect`, `.locked`), feedback e controle de layout.

- `script.js` — lógica do quiz: navegação por pergunta, seleção, verificação, feedback, pontuação, ranking e persistência (`localStorage`).

## Como executar localmente

1. Este é um site estático — basta abrir `quiz.html` no navegador (duplo clique no arquivo ou via menu do editor).

2. Recomendo usar uma extensão como "Live Server" no VS Code para servir o site (recomendado para desenvolvimento):

```powershell
# Com Live Server: abra a pasta no VS Code e clique em "Go Live" na barra de status.
```
**Quiz — Uso Responsável da Tecnologia**

Este repositório foi reorganizado para separar claramente frontend e backend.

Estrutura do repositório

- `frontend/` — conteúdos estáticos (HTML, CSS, JS, imagens). Contém a aplicação do quiz: `quiz.html`, `script.js`, `styles.css`, `image/`, `manual.html`, `render.yaml`.
- `backend/` — o servidor (API) e artefactos relacionados. Atualmente contém o servidor Python (Flask) em `backend/server/` e um diretório `legacy_node/` com a versão Node arquivada.
- `.github/`, `.vscode/` — configurações do repositório/IDE.

Resumo rápido

- Frontend: app estática que serve o quiz. Por padrão guarda resultados no `localStorage` do navegador. Pode ser configurada para apontar para uma API centralizada através de uma meta tag ou variável global (`window.QUIZ_CONFIG.apiUrl` ou `window.API_URL`).
- Backend: API REST simples com endpoints `GET /leaderboard` e `POST /leaderboard`. Implementado em Python (Flask) com fallback de persistência em `backend/server/db.json`. Se `DATABASE_URL` estiver definida, usa PostgreSQL.

Instalação e execução (desenvolvimento)

Pré-requisitos

- Python 3.10+ (recomendado) e `pip`.
- Docker (opcional) para executar o backend em container.

Rodar apenas o frontend (rápido)

1. Abra `frontend/quiz.html` diretamente no navegador (duplo clique) ou sirva com um servidor local (recomendado para desenvolvimento):

```bash
cd frontend
# servir com Python embutido (simples):
python3 -m http.server 5500
# abrir http://localhost:5500/quiz.html
```

Rodar o backend localmente (venv)

1. Entrar na pasta do servidor:

```bash
cd backend/server
```

2. Criar/ativar um virtualenv e instalar dependências:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

3. Executar em modo desenvolvimento (Flask dev server):

```bash
python app.py
# ou (modo production-like):
gunicorn app:app -b 0.0.0.0:3000 --workers 1
```

4. Configurar o frontend para apontar para a API (ex.: `http://localhost:3000`) usando uma meta tag no `<head>` de `quiz.html` ou `window.QUIZ_CONFIG`.

Executar com Docker (backend)

1. Construir a imagem:

```bash
docker build -t quiz-api:py -f backend/server/Dockerfile backend/server
```

2. Executar (com persistência local de `db.json`):

```bash
docker run -p 3000:3000 -v "$(pwd)/backend/server/db.json":/usr/src/app/db.json quiz-api:py
```

3. Ou executar apontando para um Postgres externo:

```bash
docker run -p 3000:3000 -e DATABASE_URL="postgres://user:pass@host:5432/dbname" quiz-api:py
```

Migração dos dados (`db.json`) para Postgres

Se quiser migrar `backend/server/db.json` para uma base Postgres, posso gerar um script `backend/server/migrate_json_to_pg.py` que importa os registos para a tabela `leaderboard` (usa `DATABASE_URL`). Diga-me se queres que eu o adicione.

Arquivo `legacy_node/`

O código original em Node/Express foi arquivado dentro de `backend/server/legacy_node/` caso queiras consultar ou restaurar. Não é usado pela nova stack Python por defeito.

Contribuir / desenvolvimento

- Para mudanças no frontend, edite `frontend/quiz.html`, `frontend/script.js` e `frontend/styles.css`.
- Para o backend, edite `backend/server/app.py`.
- Tests rápidos:
  - `GET /leaderboard` — lista (top 100)
  - `POST /leaderboard` — aceita `{ name, sector, score }`

Se quiseres, eu:
- adiciono `backend/server/migrate_json_to_pg.py` para migração para Postgres;
- escrevo um `README` específico dentro de `backend/server/` com comandos e exemplos de `curl` (vou fazer isso se quiseres agora);
- atualizo o `frontend/quiz.html` para incluir um exemplo de meta tag com URL da API.

---

Structure and instructions updated by me — diga o que queres que eu faça a seguir (ex: gerar script de migração, atualizar o frontend para apontar automaticamente para a API, criar README do backend mais detalhado).
