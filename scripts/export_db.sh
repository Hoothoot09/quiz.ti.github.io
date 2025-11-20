#!/usr/bin/env bash
set -euo pipefail
# Exports DB SQL and CSV to backups/ directory
OUTDIR="quiz.ti.github.io/backups"
mkdir -p "$OUTDIR"

echo "Exporting SQL to $OUTDIR/db_export.sql"
sudo docker compose -f quiz.ti.github.io/docker-compose.yml exec -T db pg_dump -U quiz quizdb > "$OUTDIR/db_export.sql"
echo "Exporting CSV to $OUTDIR/db_export.csv"
sudo docker compose -f quiz.ti.github.io/docker-compose.yml exec -T db psql -U quiz -d quizdb -c "\\copy (SELECT id,name,sector,score,date FROM leaderboard ORDER BY score DESC) TO STDOUT WITH CSV HEADER" > "$OUTDIR/db_export.csv"
echo "Done. Files written to $OUTDIR"
