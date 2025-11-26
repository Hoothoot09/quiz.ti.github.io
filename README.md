# Quiz — Guia de Uso Responsável da Tecnologia

Uma aplicação web interativa desenvolvida para avaliar e treinar conhecimentos sobre o uso responsável de equipamentos e softwares corporativos. O sistema consiste em um quiz com 26 questões sobre boas práticas de tecnologia, com sistema de pontuação e ranking.

---

## 📋 Índice

1. [Descrição da Aplicação](#descrição-da-aplicação)
2. [Tutorial de Uso para o Usuário Final](#tutorial-de-uso-para-o-usuário-final)
3. [Pré-requisitos e Dependências](#pré-requisitos-e-dependências)
4. [Como Executar a Aplicação](#como-executar-a-aplicação)
5. [Estrutura do Projeto](#estrutura-do-projeto)
6. [Configuração e Personalização](#configuração-e-personalização)
7. [Solução de Problemas](#solução-de-problemas)

---

## 📖 Descrição da Aplicação

### O que é?

O **Quiz — Guia de Uso Responsável da Tecnologia** é uma aplicação web educativa desenvolvida para o **Coren-BA** (Conselho Regional de Enfermagem da Bahia). A aplicação permite que colaboradores testem seus conhecimentos sobre:

- Uso correto de equipamentos de informática
- Boas práticas de segurança digital
- Procedimentos corporativos (GLPI, SPARK, SIALM)
- Políticas de uso de tecnologia
- Cuidados com equipamentos emprestados

### Funcionalidades Principais

- ✅ **26 questões interativas** sobre uso responsável da tecnologia
- ✅ **Feedback imediato** com explicações detalhadas para cada resposta
- ✅ **Sistema de pontuação** automático (1 ponto por acerto)
- ✅ **Ranking (Leaderboard)** com top 10 pontuações
- ✅ **Persistência de dados** via API REST ou localStorage
- ✅ **Design responsivo** para desktop, tablet e mobile
- ✅ **Acessibilidade** com suporte a leitores de tela

### Tecnologias Utilizadas

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Design responsivo com media queries
- Acessibilidade (ARIA labels, roles)

**Backend:**
- Python 3.11+
- Flask (framework web)
- SQLAlchemy (ORM)
- PostgreSQL (banco de dados)
- Gunicorn (servidor WSGI)

**Infraestrutura:**
- Docker & Docker Compose
- Nginx (servidor web e proxy reverso)
- PostgreSQL 15

---

## 👤 Tutorial de Uso para o Usuário Final

### Passo a Passo: Como Usar o Quiz

#### 1. **Acessar o Quiz**

Abra seu navegador web (Chrome, Firefox, Edge, Safari) e acesse:
```
http://localhost:8080/quiz.html
```

> **Nota:** Se a aplicação estiver em produção, use o endereço fornecido pelo administrador.

#### 2. **Preencher Informações Iniciais**

Ao abrir o quiz, você verá um formulário solicitando:
- **Nome:** Digite seu nome completo ou como deseja aparecer no ranking
- **Setor:** Informe seu setor/departamento

> ⚠️ **Importante:** Ambos os campos são obrigatórios e devem ter no máximo 100 caracteres.

Clique no botão **"Começar"** para iniciar o quiz.

#### 3. **Responder as Questões**

O quiz apresenta **26 questões** sobre uso responsável da tecnologia. Para cada pergunta:

1. **Leia a pergunta** cuidadosamente
2. **Selecione uma das 4 alternativas** (A, B, C ou D) clicando sobre ela
3. **Clique em "Verificar Respostas"** para ver se acertou
4. **Leia a explicação** que aparece abaixo da pergunta
5. **Use os botões "Anterior" ou "Próxima"** para navegar entre as questões

> 💡 **Dica:** Você só pode avançar para a próxima pergunta após verificar a resposta da atual.

#### 4. **Visualizar Resultado Final**

Após responder todas as 26 questões:

- Você verá sua **pontuação final** (ex: "Você acertou 20 de 26 perguntas")
- Sua pontuação será **automaticamente salva** no ranking
- O **Top 10 do ranking** será exibido com:
  - Posição (#1, #2, #3...)
  - Nome e setor
  - Pontuação
  - Data/hora da participação

#### 5. **Refazer o Quiz**

Se desejar tentar novamente:
- Clique no botão **"Refazer Quiz"**
- Preencha novamente seu nome e setor
- Responda as questões novamente

#### 6. **Acessar o Manual**

Para consultar informações detalhadas sobre os tópicos do quiz:
- Clique no botão **"📘 Acessar Manual Completo"** no final do quiz
- Ou acesse diretamente: `http://localhost:8080/manual.html`

O manual contém seções sobre:
- Uso de Equipamentos
- Equipamentos sob Empréstimo
- Acesso Remoto
- Uso do SPARK
- Segurança Digital
- Políticas do Usuário

---

## 🔧 Pré-requisitos e Dependências

### Para Executar com Docker (Recomendado)

#### Requisitos Mínimos:
- **Docker** versão 20.10 ou superior
- **Docker Compose** versão 2.0 ou superior
- **4 GB de RAM** disponível
- **2 GB de espaço em disco** livre

#### Verificar Instalação:

```bash
# Verificar versão do Docker
docker --version

# Verificar versão do Docker Compose
docker compose version
```

> **Nota:** Se não tiver Docker instalado, consulte a [documentação oficial](https://docs.docker.com/get-docker/).

### Para Executar sem Docker (Desenvolvimento)

#### Requisitos:
- **Python 3.11 ou superior**
- **pip** (gerenciador de pacotes Python)
- **PostgreSQL 15** (opcional, se quiser usar banco de dados)
- **Navegador web moderno** (Chrome, Firefox, Edge, Safari)

#### Dependências do Backend (Python):

As dependências estão listadas em `backend/server/requirements.txt`:

```
Flask>=2.3          # Framework web
Flask-Cors>=3.1     # CORS para requisições cross-origin
SQLAlchemy>=1.4     # ORM para banco de dados
psycopg2-binary>=2.9 # Driver PostgreSQL
gunicorn>=21.2      # Servidor WSGI para produção
```

#### Dependências do Frontend:

O frontend **não requer dependências externas** - utiliza apenas:
- HTML5 nativo
- CSS3 nativo
- JavaScript (ES6+) nativo

---

## 🚀 Como Executar a Aplicação

### Opção 1: Executar com Docker Compose (Recomendado)

Esta é a forma mais simples e recomendada, pois configura automaticamente todos os serviços.

#### Passo 1: Navegar até o diretório do projeto

```bash
cd /home/joaojpsa/Documentos/quiz/quiz.ti.github.io
```

#### Passo 2: Subir os serviços

```bash
# Subir em background (recomendado)
docker compose up -d --build

# Ou subir em foreground (ver logs em tempo real)
docker compose up --build
```

#### Passo 3: Aguardar inicialização

Aguarde alguns segundos para que todos os serviços iniciem:
- PostgreSQL (banco de dados)
- Backend Flask (API)
- Nginx (servidor web)

#### Passo 4: Acessar a aplicação

Abra seu navegador e acesse:
- **Quiz:** http://localhost:8080/quiz.html
- **Manual:** http://localhost:8080/manual.html
- **API:** http://localhost:8080/api/leaderboard

#### Comandos Úteis:

```bash
# Ver status dos containers
docker compose ps

# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs backend
docker compose logs nginx
docker compose logs db

# Parar os serviços (mantém dados)
docker compose down

# Parar e remover volumes (apaga dados do banco)
docker compose down -v

# Reiniciar os serviços
docker compose restart
```

### Opção 2: Executar sem Docker (Desenvolvimento)

#### Passo 1: Configurar Backend

```bash
# Navegar até o diretório do backend
cd backend/server

# Criar ambiente virtual
python3 -m venv .venv

# Ativar ambiente virtual
# No Linux/Mac:
source .venv/bin/activate
# No Windows:
.venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt
```

#### Passo 2: Executar Backend

```bash
# Modo desenvolvimento (com auto-reload)
export FLASK_APP=app.py
export FLASK_ENV=development
flask run --port 3000

# Ou modo produção (com gunicorn)
gunicorn app:app -b 0.0.0.0:3000 --workers 2
```

O backend estará disponível em: `http://localhost:3000`

#### Passo 3: Executar Frontend

Em outro terminal:

```bash
# Navegar até o diretório do frontend
cd frontend

# Servir com servidor HTTP simples do Python
python3 -m http.server 5500
```

O frontend estará disponível em: `http://localhost:5500/quiz.html`

> **Importante:** Se executar desta forma, você precisa ajustar a URL da API no `quiz.html`:
> - Edite `frontend/quiz.html`
> - Altere a meta tag: `<meta name="quiz-api-url" content="http://localhost:3000">`

### Opção 3: Usar Makefile (Atalhos)

O projeto inclui um `Makefile` com comandos úteis:

```bash
# Criar ambiente virtual e instalar dependências
make install

# Subir stack Docker (foreground)
make up

# Subir stack Docker (background)
make upd

# Ver logs
make logs

# Rodar migração (dry-run)
make migrate-dry

# Rodar migração real
make migrate

# Parar e remover containers + volumes
make downv
```

---

## 📁 Estrutura do Projeto

```
quiz.ti.github.io/
├── frontend/                 # Aplicação frontend (HTML/CSS/JS)
│   ├── quiz.html            # Página principal do quiz
│   ├── manual.html          # Manual de uso
│   ├── script.js            # Lógica JavaScript do quiz
│   ├── styles.css           # Estilos CSS
│   └── image/               # Imagens e assets
│       └── logo-quiz.png    # Logo do Coren-BA
│
├── backend/server/          # Backend Python (Flask)
│   ├── app.py              # Aplicação Flask principal
│   ├── requirements.txt    # Dependências Python
│   ├── Dockerfile          # Imagem Docker do backend
│   ├── db.json             # Fallback (banco JSON local)
│   ├── db.sql              # Script SQL de inicialização
│   └── migrate_json_to_pg.py  # Script de migração
│
├── docker/                 # Configurações Docker
│   └── nginx.conf          # Configuração do Nginx
│
├── scripts/                # Scripts utilitários
│   ├── export_db.sh        # Exportar banco de dados
│   ├── restore_from_sql.sh # Restaurar banco de dados
│   └── clean_compose.sh    # Limpar containers
│
├── docker-compose.yml      # Orquestração Docker
├── Makefile                # Comandos úteis
└── README.md               # Este arquivo
```

---

## ⚙️ Configuração e Personalização

### Variáveis de Ambiente

O projeto usa variáveis de ambiente para configuração. Crie um arquivo `.env` na raiz:

```bash
# Configurações do PostgreSQL
POSTGRES_USER=quiz
POSTGRES_PASSWORD=sua_senha_segura_aqui
POSTGRES_DB=quizdb

# URL do banco de dados (gerada automaticamente no Docker Compose)
# DATABASE_URL=postgresql://quiz:senha@db:5432/quizdb
```

> **⚠️ Segurança:** Nunca commite o arquivo `.env` no repositório. Ele já está no `.gitignore`.

### Alterar Porta do Nginx

Edite `docker-compose.yml`:

```yaml
nginx:
  ports:
    - "8080:80"  # Altere 8080 para a porta desejada
```

### Configurar URL da API no Frontend

O frontend busca a URL da API nesta ordem:

1. Meta tag no HTML: `<meta name="quiz-api-url" content="/api">`
2. Variável global: `window.QUIZ_CONFIG = { apiUrl: '...' }`
3. Variável global: `window.API_URL`
4. Fallback: `localStorage` (sem API)

Para alterar, edite `frontend/quiz.html`:

```html
<meta name="quiz-api-url" content="http://seu-servidor.com/api">
```

---

## 🔍 Solução de Problemas

### Problema: Erro ao iniciar Docker

**Sintoma:** `docker: command not found`

**Solução:**
```bash
# Instalar Docker (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
# Faça logout e login novamente
```

### Problema: Nginx retorna 502 Bad Gateway

**Sintoma:** Erro 502 ao acessar http://localhost:8080

**Solução:**
```bash
# Verificar se o backend está rodando
docker compose ps

# Ver logs do backend
docker compose logs backend

# Reiniciar serviços
docker compose restart
```

### Problema: Dados não aparecem no ranking

**Sintoma:** Ranking vazio ou dados antigos

**Solução:**
```bash
# Verificar se o banco está funcionando
docker compose exec db psql -U quiz -d quizdb -c "SELECT COUNT(*) FROM leaderboard;"

# Se necessário, reiniciar com volume limpo
docker compose down -v
docker compose up -d --build
```

### Problema: Porta 8080 já está em uso

**Sintoma:** `Error: bind: address already in use`

**Solução:**
```bash
# Verificar qual processo está usando a porta
sudo lsof -i :8080

# Ou alterar a porta no docker-compose.yml
# Edite a linha: "8080:80" para "8081:80" (ou outra porta)
```

### Problema: Frontend não conecta com API

**Sintoma:** Ranking não carrega, erro no console do navegador

**Solução:**
1. Verifique se a meta tag está correta em `quiz.html`
2. Verifique se o backend está rodando: `docker compose ps`
3. Teste a API diretamente: `curl http://localhost:8080/api/leaderboard`
4. Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)

---

## 📊 Informações Técnicas

### Endpoints da API

#### GET /api/leaderboard
Retorna o top 100 do ranking.

**Resposta:**
```json
[
  {
    "name": "João Silva",
    "sector": "TI",
    "score": 25,
    "date": "2025-11-26T00:00:00Z"
  }
]
```

#### POST /api/leaderboard
Salva uma nova pontuação.

**Requisição:**
```json
{
  "name": "João Silva",
  "sector": "TI",
  "score": 25
}
```

**Validações:**
- `name`: obrigatório, máximo 100 caracteres
- `sector`: obrigatório, máximo 100 caracteres
- `score`: obrigatório, número inteiro entre 0 e 30

### Banco de Dados

**Tabela: leaderboard**

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | Chave primária |
| name | TEXT | Nome do participante |
| sector | TEXT | Setor do participante |
| score | INTEGER | Pontuação (0-30) |
| date | TIMESTAMPTZ | Data/hora da participação |

---

## 📝 Licença e Créditos

Este projeto foi desenvolvido para o **Coren-BA** (Conselho Regional de Enfermagem da Bahia).

**Desenvolvido com:**
- Python/Flask
- HTML5/CSS3/JavaScript
- Docker & Docker Compose
- PostgreSQL

---

## 🆘 Suporte

Para problemas ou dúvidas:
1. Consulte a seção [Solução de Problemas](#solução-de-problemas)
2. Verifique os logs: `docker compose logs -f`
3. Consulte a documentação do backend: `backend/server/README.md`

---

**Última atualização:** Novembro 2025
