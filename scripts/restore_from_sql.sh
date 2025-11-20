#!/usr/bin/env bash
set -euo pipefail
# Usage: restore_from_sql.sh path/to/dump.sql
FILE=${1:-quiz.ti.github.io/backups/db_export.sql}
if [ ! -f "$FILE" ]; then
  echo "File not found: $FILE"
  exit 1
fi
echo "Restoring $FILE into Postgres (container db)"
# Use psql -f - to read from stdin
sudo docker compose -f quiz.ti.github.io/docker-compose.yml exec -T db psql -U quiz -d quizdb -f - < "$FILE"
echo "Restore complete"
