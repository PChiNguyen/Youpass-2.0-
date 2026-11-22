run:
	npm run dev
.PHONY: verify verify-backend verify-frontend

verify-backend:
	cd backend && ruff check . && mypy api core db repo schemas services workers main.py && pytest -q

verify-frontend:
	cd frontend && npm run verify

verify: verify-backend verify-frontend