# Frontend — `frontend/`

Este diretório contém os arquivos estáticos do quiz: `quiz.html`, `styles.css`, `script.js` e a pasta `image/`.

Configuração da URL da API

O frontend decide para onde enviar as requisições do leaderboard seguindo esta ordem (prioridade):

1. Meta tag no HTML: `<meta name="quiz-api-url" content="...">` (p.ex. `/api` quando executado via nginx no docker-compose)
2. Objeto global: `window.QUIZ_CONFIG = { apiUrl: 'https://meu-servidor.com' }`
3. Variável global simples: `window.API_URL = 'https://meu-servidor.com'`
4. Se nenhuma das anteriores estiver configurada, o frontend usa `localStorage` como fallback.

No repositório já atualizamos `quiz.html` para usar `content="/api"`, para que quando você rode `docker-compose` o nginx proxie `/api` para o backend.

Servindo localmente (sem Docker)

```bash
cd frontend
python3 -m http.server 5500
# Abra http://localhost:5500/quiz.html
```

Observações de desenvolvimento
- Se estiver rodando o backend localmente (ex.: `flask run --port 3000`), defina a meta para `http://localhost:3000` ou abra o console do navegador e defina `window.API_URL = 'http://localhost:3000'` antes de usar o quiz.
- O arquivo `script.js` contém comentários explicando como o cliente escolhe a URL da API.

Testes rápidos

1. Abrir o frontend no navegador e preencher nome/setor, responder o quiz e submeter; o leaderboard deverá aparecer.
2. Verifique via rede (DevTools) as chamadas para `/api/leaderboard` (ou `http://localhost:3000/leaderboard` se estiver apontando direto para o backend).

Se quiser que eu adicione um pequeno servidor de desenvolvimento com hot-reload (ex.: `live-server` ou `browser-sync`) eu posso incluir instruções e um `package.json` mínimo para facilitar.
# Frontend (quiz)

Este diretório contém a aplicação estática do quiz (HTML/CSS/JS).

Conteúdo principal

- `quiz.html` — página principal do quiz.
- `script.js` — lógica do quiz (navegação, verificação, pontuação, integração com API quando configurada).
- `styles.css` — estilos.
- `image/` — imagens usadas na interface.

Como executar localmente

1. Servir os ficheiros estáticos com um servidor local (recomendado durante o desenvolvimento):

```bash
cd frontend
python3 -m http.server 5500
# abra http://localhost:5500/quiz.html
```

2. Configurar a API do backend (opcional):

O `script.js` procura a URL da API na seguinte ordem:

- meta tag `<meta name="quiz-api-url" content="http://localhost:3000">` no `<head>` de `quiz.html`;
- `window.QUIZ_CONFIG = { apiUrl: 'https://your-api' }` antes de carregar `script.js`;
- `window.API_URL = 'https://your-api'` antes de carregar `script.js`.

Se nenhuma for encontrada, o frontend usa `localStorage` para persistência local.

Desenvolvimento

- Edite `script.js` e recarregue a página.
- Para ver erros, abra o console do navegador (F12).
