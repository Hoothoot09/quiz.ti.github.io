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
