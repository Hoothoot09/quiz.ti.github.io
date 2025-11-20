#!/usr/bin/env python3
"""Import leaderboard entries from a local JSON file into Postgres.

Usage:
  migrate_json_to_pg.py --file db.json [--database-url URL] [--dry-run]

The script looks for a DATABASE_URL environment variable if --database-url
is not provided.
"""
import argparse
import json
import os
import sys
from datetime import datetime

from sqlalchemy import create_engine, text


def parse_args():
    p = argparse.ArgumentParser(description="Migrate db.json leaderboard into Postgres")
    p.add_argument("--file", required=True, help="Path to db.json file")
    p.add_argument("--database-url", default=os.environ.get('DATABASE_URL'), help="Postgres database URL")
    p.add_argument("--dry-run", action="store_true", help="Don't write to DB, only show summary")
    return p.parse_args()


def load_json(path):
    with open(path, 'r', encoding='utf8') as f:
        return json.load(f)


def ensure_table(engine):
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


def insert_rows(engine, rows):
    with engine.connect() as conn:
        for r in rows:
            conn.execute(text('INSERT INTO leaderboard (name, sector, score, date) VALUES (:name, :sector, :score, :date)'),
                         {'name': r['name'], 'sector': r['sector'], 'score': int(r['score']), 'date': r['date']})
        conn.commit()


def main():
    args = parse_args()
    if not args.database_url and not args.dry_run:
        print('Error: No database URL provided. Set DATABASE_URL or use --database-url', file=sys.stderr)
        sys.exit(2)

    data = load_json(args.file)
    rows = data.get('leaderboard') or []
    print(f'Loaded {len(rows)} rows from {args.file}')

    # normalize dates if necessary
    for r in rows:
        if 'date' not in r or not r['date']:
            r['date'] = datetime.utcnow().isoformat() + 'Z'

    if args.dry_run:
        # print a small preview
        print('Dry run: showing first 5 rows:')
        for r in rows[:5]:
            print(r)
        print('Dry run complete — no changes made.')
        return

    engine = create_engine(args.database_url)
    print('Ensuring leaderboard table exists...')
    ensure_table(engine)
    print('Inserting rows...')
    insert_rows(engine, rows)
    print('Done.')


if __name__ == '__main__':
    main()
