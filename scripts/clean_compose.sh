#!/usr/bin/env bash
set -euo pipefail
echo "Stopping and removing containers (preserving volumes):"
sudo docker compose -f quiz.ti.github.io/docker-compose.yml down

echo "To remove volumes as well, run:"
echo "  sudo docker compose -f quiz.ti.github.io/docker-compose.yml down -v"
