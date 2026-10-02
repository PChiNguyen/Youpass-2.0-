#!/usr/bin/env bash

# -------------------------------------------------------------
# 1. Start Celery Worker in the background (&)
# -------------------------------------------------------------
echo "🚀 Starting Celery Worker..."
celery -A core.celery_app worker --loglevel=info &

# -------------------------------------------------------------
# 2. Start FastAPI / Uvicorn in the foreground
# -------------------------------------------------------------
echo "🌐 Starting FastAPI Server..."
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}