.PHONY: help \
	run req \
	test test-repo test-services test-db test-schemas test-core test-api watch \
	lint format-check typecheck verify \
	migrate check-model create-user create-skill \
	up start-redis down build build-api check-docker check-logs logs-api logs-worker-docker \
	celery-worker celery-worker-docker create-user-docker create-skill-docker

help:
	@echo "Available targets:"
	@echo "  Dev & Local : run, req"
	@echo "  Quality/Test: verify, lint, format-check, typecheck, test, watch"
	@echo "  DB & Scripts: migrate, check-model, create-user, create-skill"
	@echo "  Docker      : up, start-redis, down, build, build-api, check-docker, check-logs, logs-api, logs-worker-docker"
	@echo "  Workers     : celery-worker, celery-worker-docker, create-user-docker, create-skill-docker"

# ==============================================================================
# 1. Local Dev & Dependencies
# ==============================================================================
run:
	python -m uvicorn main:app --reload

req:
	pip freeze > requirements.txt

# ==============================================================================
# 2. Quality Gates & Testing
# ==============================================================================
verify:
	ruff check .
	mypy api core db repo schemas services workers main.py
	pytest -q

lint:
	ruff check .

format-check:
	ruff format --check .

typecheck:
	mypy api core db repo schemas services workers main.py

test:
	pytest -s

test-repo:
	pytest -s tests/test_repo

test-services:
	pytest -s tests/test_services

test-db:
	pytest -s tests/test_db

test-schemas:
	pytest -s tests/test_schemas

test-core:
	pytest -s tests/test_core

test-api:
	pytest -s tests/test_api

watch:
	python -m pytest_watch -- --cov=. --cov-report=term-missing --cov-report=xml

# ==============================================================================
# 3. Database & Helper Scripts (Local)
# ==============================================================================
# Runs Alembic to update database tables after model changes.
migrate:
	docker-compose exec api alembic upgrade head

check-model:
	python check_models.py

create-user:
	python create_user.py

create-skill:
	python create_skill.py

# ==============================================================================
# 4. Docker & Background Workers
# ==============================================================================
up:
	docker-compose up -d

start-redis:
	docker compose up -d redis

# Safely shuts down all containers when done working.
down:
	docker-compose down

# Rebuilds images; use when requirements.txt or Dockerfile changes.
build:
	docker-compose up -d --build

build-api:
	docker compose up -d --build api

check-docker:
	docker ps -a

check-logs:
	docker logs ielts_api

logs-api:
	docker-compose logs -f api

logs-worker-docker:
	docker compose logs -f worker

celery-worker:
	celery -A core.celery_app worker --pool=gevent --loglevel=info

celery-worker-docker:
	docker exec -it ielts_api celery -A core.celery_app worker --pool=gevent --loglevel=info

create-user-docker:
	docker exec -it ielts_api python create_user.py

create-skill-docker:
	docker exec -it ielts_api python create_skill.py

