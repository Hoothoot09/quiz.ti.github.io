const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const { Client } = require('pg');

// This server supports two persistence modes:
// - Postgres when process.env.DATABASE_URL is provided
// - local file (db.json) fallback when DATABASE_URL is not provided

const app = express();
app.use(cors());
app.use(express.json());

const file = path.join(__dirname, 'db.json');

const usePostgres = !!process.env.DATABASE_URL;
let pgClient;

async function initPostgres() {
  if (!usePostgres) return;
  pgClient = new Client({ connectionString: process.env.DATABASE_URL });
  await pgClient.connect();
  // create table if not exists
  await pgClient.query(
    `CREATE TABLE IF NOT EXISTS leaderboard (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      sector TEXT NOT NULL,
      score INTEGER NOT NULL,
      date TIMESTAMPTZ NOT NULL
    )`
  );
}

async function readDb() {
  if (usePostgres) {
    const res = await pgClient.query('SELECT name, sector, score, date FROM leaderboard');
    return { leaderboard: res.rows };
  }
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    return { leaderboard: [] };
  }
}

async function writeDb(data) {
  if (usePostgres) {
    // Not used in Postgres mode; inserts use SQL insert per-entry
    return;
  }
  try {
    await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Erro ao gravar db.json', e);
    throw e;
  }
}

// GET leaderboard (top N)
app.get('/leaderboard', async (req, res) => {
  const dbdata = await readDb();
  const list = (dbdata.leaderboard || []).slice().sort((a, b) => b.score - a.score || (new Date(b.date) - new Date(a.date)));
    try {
      if (usePostgres) {
        const result = await pgClient.query('SELECT name, sector, score, date FROM leaderboard ORDER BY score DESC, date DESC LIMIT 100');
        return res.json(result.rows);
      }
      res.json(list.slice(0, 100));
    } catch (e) {
      console.error('Erro GET /leaderboard', e);
      res.status(500).json({ error: 'internal' });
    }
});

// POST new score: { name, sector, score }
app.post('/leaderboard', async (req, res) => {
  const { name, sector, score } = req.body;
  if (!name || !sector || typeof score !== 'number') {
    return res.status(400).json({ error: 'name, sector and numeric score are required' });
  }
  const dbdata = await readDb();
  dbdata.leaderboard = dbdata.leaderboard || [];
  dbdata.leaderboard.push({ name, sector, score, date: new Date().toISOString() });
  // persist
  await writeDb(dbdata);
  const list = dbdata.leaderboard.slice().sort((a, b) => b.score - a.score || (new Date(b.date) - new Date(a.date)));
    try {
      if (usePostgres) {
        await pgClient.query('INSERT INTO leaderboard(name, sector, score, date) VALUES($1,$2,$3,$4)', [name, sector, score, new Date().toISOString()]);
        const result = await pgClient.query('SELECT name, sector, score, date FROM leaderboard ORDER BY score DESC, date DESC LIMIT 100');
        return res.json(result.rows);
      }
      res.json(list.slice(0, 100));
    } catch (e) {
      console.error('Erro POST /leaderboard', e);
      res.status(500).json({ error: 'internal' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Quiz API listening on port ${PORT}`));
