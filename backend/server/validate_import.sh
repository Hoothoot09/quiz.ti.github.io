#!/usr/bin/env bash
# Simple validation helper for imported leaderboard
# Usage examples:
#   DATABASE_URL="postgres://user:pass@host:5432/dbname" ./validate_import.sh
#   ./validate_import.sh -h host -p 5432 -U user -d dbname -W pass

set -euo pipefail

usage(){
  cat <<'USAGE'
Usage: validate_import.sh [options]

Options:
  --database-url URL    Use a DATABASE_URL (overrides other params)
  -h host               DB host
  -p port               DB port
  -U user               DB user
  -d dbname             Database name
  -W password           Password (or set PGPASSWORD env var)
  -help                 Show this help

This script prints the total rows in `leaderboard` and the top 10 rows ordered
by score desc, date desc.
USAGE
}

DATABASE_URL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --database-url) DATABASE_URL="$2"; shift 2;;
    -h) HOST="$2"; shift 2;;
    -p) PORT="$2"; shift 2;;
    -U) USER="$2"; shift 2;;
    -d) DBNAME="$2"; shift 2;;
    -W) PGPASSWORD_VAL="$2"; shift 2;;
    -help|--help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 1;;
  esac
done

if [ -n "${PGPASSWORD_VAL-}" ]; then
  export PGPASSWORD="$PGPASSWORD_VAL"
fi

if [ -z "${DATABASE_URL}" ]; then
  if [ -z "${HOST-}" ] || [ -z "${USER-}" ] || [ -z "${DBNAME-}" ]; then
    echo "No DATABASE_URL and missing connection params. Use --database-url or -h -U -d." >&2
    usage
    exit 2
  fi
  PORT_ARG=""
  if [ -n "${PORT-}" ]; then PORT_ARG="-p $PORT"; fi
  PSQL_CMD=(psql -h "$HOST" $PORT_ARG -U "$USER" -d "$DBNAME" -t -c)
else
  PSQL_CMD=(psql "$DATABASE_URL" -t -c)
fi

echo "Counting rows in leaderboard..."
"${PSQL_CMD[@]}" "SELECT COUNT(*) FROM leaderboard;"

echo
echo "Top 10 leaderboard (name | sector | score | date):"
"${PSQL_CMD[@]}" "SELECT name, sector, score, date FROM leaderboard ORDER BY score DESC, date DESC LIMIT 10;"
