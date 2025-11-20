import os
import json
from datetime import datetime
from pathlib import Path

from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, text


BASE_DIR = Path(__file__).resolve().parent
DB_FILE = BASE_DIR / 'db.json'

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.environ.get('DATABASE_URL')
use_postgres = bool(DATABASE_URL)
engine = None


def init_postgres():
    global engine
    if not use_postgres:
        return
    engine = create_engine(DATABASE_URL)
    # create table if not exists
    with engine.connect() as conn:
        conn.execute(text('''
        CREATE TABLE IF NOT EXISTS leaderboard (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            sector TEXT NOT NULL,
            score INTEGER NOT NULL,
            date TIMESTAMPTZ NOT NULL
        )
        '''))
        conn.commit()


def read_db():
    if use_postgres:
        with engine.connect() as conn:
            res = conn.execute(text('SELECT name, sector, score, date FROM leaderboard ORDER BY score DESC, date DESC LIMIT 100'))
            rows = [dict(row) for row in res]
            return {'leaderboard': rows}
    try:
        if not DB_FILE.exists():
            return {'leaderboard': []}
        with DB_FILE.open('r', encoding='utf8') as f:
            return json.load(f)
    except Exception:
        return {'leaderboard': []}


def write_db(data):
    if use_postgres:
        # Not used in postgres mode
        return
    tmp = DB_FILE.with_suffix('.tmp')
    with tmp.open('w', encoding='utf8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    tmp.replace(DB_FILE)


@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    dbdata = read_db()
    lb = dbdata.get('leaderboard', [])
    # ensure sorted
    try:
        sorted_lb = sorted(lb, key=lambda x: (-int(x.get('score', 0)), x.get('date', '')))
    except Exception:
        sorted_lb = lb
    return jsonify(sorted_lb[:100])


@app.route('/leaderboard', methods=['POST'])
def post_leaderboard():
    payload = request.get_json(force=True)
    name = payload.get('name')
    sector = payload.get('sector')
    score = payload.get('score')
    if not name or not sector or not isinstance(score, (int, float)):
        return jsonify({'error': 'name, sector and numeric score are required'}), 400

    now_iso = datetime.utcnow().isoformat() + 'Z'

    if use_postgres:
        with engine.connect() as conn:
            conn.execute(text('INSERT INTO leaderboard (name, sector, score, date) VALUES (:name, :sector, :score, :date)'),
                         {'name': name, 'sector': sector, 'score': int(score), 'date': now_iso})
            conn.commit()
            res = conn.execute(text('SELECT name, sector, score, date FROM leaderboard ORDER BY score DESC, date DESC LIMIT 100'))
            rows = [dict(row) for row in res]
            return jsonify(rows)

    dbdata = read_db()
    dbdata.setdefault('leaderboard', [])
    dbdata['leaderboard'].append({'name': name, 'sector': sector, 'score': int(score), 'date': now_iso})
    write_db(dbdata)
    # return top 100
    lb = sorted(dbdata['leaderboard'], key=lambda x: (-int(x.get('score', 0)), x.get('date', '')))
    return jsonify(lb[:100])


if __name__ == '__main__':
    init_postgres()
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port)
