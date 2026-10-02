import os
import logging
from celery import Celery

logger = logging.getLogger(__name__)

# Retrieve Redis connection URL from environment or fall back to localhost
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Initialize Celery app instance
celery_app = Celery(
    "_backend_worker",
    broker=REDIS_URL,   # Task queue
    backend=REDIS_URL, # Result storage
    include=["workers.tasks"]  # 🟢 ADDED: Tells Celery where your task code is located!   
)

# Global configuration settings
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
)