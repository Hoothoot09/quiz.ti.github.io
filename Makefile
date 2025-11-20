.PHONY: help venv install build up upd down downv migrate-dry migrate logs clean

help:
	@echo "Makefile commands:"
	@echo "  make venv         # create virtualenv .venv"
	@echo "  make install      # install backend dependencies into .venv"
	@echo "  make build        # docker-compose build"
	@echo "  make up           # docker-compose up --build (foreground)"
	@echo "  make upd          # docker-compose up -d --build (background)"
	@echo "  make down         # docker-compose down"
	@echo "  make downv        # docker-compose down -v (remove volumes)"
	@echo "  make migrate-dry  # run migration dry-run"
	@echo "  make migrate      # run migration (requires DATABASE_URL or compose running)"
	@echo "  make logs         # docker-compose logs -f"
	@echo "  make clean        # remove .venv"

venv:
	python3 -m venv .venv

install: venv
	. .venv/bin/activate && pip install --upgrade pip && pip install -r backend/server/requirements.txt

build:
	docker-compose build

up:
	docker-compose up --build

upd:
	docker-compose up -d --build

down:
	docker-compose down

downv:
	docker-compose down -v

migrate-dry:
	if [ -f .venv/bin/activate ]; then . .venv/bin/activate && python backend/server/migrate_json_to_pg.py --dry-run; else python backend/server/migrate_json_to_pg.py --dry-run; fi

migrate:
	if [ -f .venv/bin/activate ]; then . .venv/bin/activate && python backend/server/migrate_json_to_pg.py; else python backend/server/migrate_json_to_pg.py; fi

logs:
	docker-compose logs -f

clean:
	rm -rf .venv
