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

run:
	python -m uvicorn main:app --reload 
create-user:
	python create_user.py  
create-skill:
	python create_skill.py
check-model:
	python check_models.py




up:
	docker-compose up -d
start-redis:
	docker compose up -d redis

# 2. Stop the project
# What it does: Safely shuts down all containers.
# When to use: When you are done working.
down:
	docker-compose down

# 3. Rebuild the project
# What it does: Re-installs everything from scratch. 
# When to use: Use this ONLY when you add new things to requirements.txt or change the Dockerfile.
build:
	docker-compose up -d --build
build-api:
	docker compose up -d --build api

# 4. Build/Update the Database Tables
# What it does: Runs Alembic to create your tables in Postgres.
# When to use: After you create or change a class in models.py.
migrate:
	docker-compose exec api alembic upgrade head

req:
	pip freeze > requirements.txt

create-user-docker:
	docker exec -it ielts_api python create_user.py
create-skill-docker:
	docker exec -it ielts_api python create_skill.py  
celery-worker-docker:
	docker exec -it ielts_api celery -A core.celery_app worker --pool=gevent --loglevel=info

check-docker:
	docker ps -a 

check-logs:
	docker logs ielts_api  


logs-api:
	docker-compose logs -f api    

celery-worker:
	celery -A core.celery_app worker --pool=gevent --loglevel=info

logs-workerdocker: 
	docker compose logs -f worker  