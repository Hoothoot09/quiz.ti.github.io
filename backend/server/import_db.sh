#!/usr/bin/env bash
# Simple helper to import backend/server/db.sql into Postgres
# Usage:
#   1) Provide DATABASE_URL env var (recommended):
#        export DATABASE_URL="postgres://user:pass@host:5432/dbname"
#        ./import_db.sh
#   2) Or pass connection parameters:
#        ./import_db.sh -h host -p 5432 -U user -d dbname -W password

set -euo pipefail

usage(){
  cat <<'USAGE'
Usage: import_db.sh [options]

Options:
  --database-url URL    Use a DATABASE_URL (overrides other params)
  -h host               DB host
  -p port               DB port
  -U user               DB user
  -d dbname             Database name
  -W password           Password (or set PGPASSWORD env var)
  -f file               SQL file to import (default: db.sql)
  -y                    Skip confirmation
  -help                 Show this help

Examples:
  DATABASE_URL="postgres://user:pass@host:5432/db" ./import_db.sh
  ./import_db.sh -h localhost -p 5432 -U user -d db -W pass
USAGE
}

DB_FILE="db.sql"
DATABASE_URL=""
CONFIRM=yes

while [[ $# -gt 0 ]]; do
  case "$1" in
    --database-url) DATABASE_URL="$2"; shift 2;;
    -h) HOST="$2"; shift 2;;
    -p) PORT="$2"; shift 2;;
    -U) USER="$2"; shift 2;;
    -d) DBNAME="$2"; shift 2;;
    -W) PGPASSWORD_VAL="$2"; shift 2;;
    -f) DB_FILE="$2"; shift 2;;
    -y) CONFIRM=no; shift ;;
    -help|-h|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 1;;
  esac
done

if [ ! -f "$DB_FILE" ]; then
  echo "SQL file '$DB_FILE' not found in $(pwd)" >&2
  exit 2
fi

if [ -n "${PGPASSWORD_VAL-}" ]; then
  export PGPASSWORD="$PGPASSWORD_VAL"
fi

if [ -z "${DATABASE_URL}" ]; then
  if [ -z "${HOST-}" ] || [ -z "${USER-}" ] || [ -z "${DBNAME-}" ]; then
    echo "No DATABASE_URL and missing connection params. Use --database-url or -h -U -d." >&2
    usage
    exit 2
  fi
  # build psql command
  PORT_ARG=""
  if [ -n "${PORT-}" ]; then PORT_ARG="-p $PORT"; fi
  CMD=(psql -h "$HOST" $PORT_ARG -U "$USER" -d "$DBNAME" -f "$DB_FILE")
else
  CMD=(psql "$DATABASE_URL" -f "$DB_FILE")
fi

if [ "$CONFIRM" = yes ]; then
  echo "About to run: ${CMD[*]}"
  read -p "Proceed? [y/N] " ans
  case "$ans" in
    [Yy]*) ;;
    *) echo "Aborted."; exit 0;;
  esac
fi

echo "Running import..."
"${CMD[@]}"
echo "Import finished."
