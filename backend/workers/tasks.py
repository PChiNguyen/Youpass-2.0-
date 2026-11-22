import logging
from core.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="health_ping_task")
def health_ping_task() -> dict[str, str]:
    """Minimal worker health task. Replace with async AI Writing/Speaking grading in Milestone 4."""
    logger.info("Celery worker health ping executed.")
    return {"status": "ok"}