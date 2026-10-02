import logging
from uuid import UUID

from fastapi.encoders import jsonable_encoder  # Converts dataclasses & SQLAlchemy models safely to dicts

from core.celery_app import celery_app
from db.session import Sessionlocal

# 1. Import active DB models to register SQLAlchemy mappers properly
from db.models.user import User
from db.models.classroom import Classroom
from db.models.student import Student
from db.models.student_score import StudentScore
from db.models.skill import SkillModel

# 2. Import the updated GradingRepo class
from repo.grading_repo import GradingRepo

logger = logging.getLogger(__name__)


@celery_app.task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={'max_retries': 3, 'countdown': 5},
    name="calculate_classroom_overall_band_scores"
)
def calculate_classroom_overall_band_scores_task(self, classroom_id_str: str) -> dict:
    """
    Background worker task to calculate IELTS Overall Band scores for an entire 
    classroom using the updated GradingRepo.
    """
    logger.info(f"⏳ [CELERY WORKER] Starting overall band score calculation for classroom: {classroom_id_str}")

    # 1. Create a fresh DB session for the worker process
    db = Sessionlocal()

    try:
        # 2. Convert string representation to UUID object
        classroom_id = UUID(classroom_id_str)

        # 3. Instantiate the updated repository
        repo = GradingRepo(db)

        # 4. Call the new method for classroom IELTS band scores
        overall_scores = repo.get_classroom_overall_band_scores(classroom_id)

        # 5. Safely serialize Dataclass objects into JSON-compatible dictionaries
        serialized_data = jsonable_encoder(overall_scores)

        logger.info(f"✅ [CELERY WORKER] Processed {len(serialized_data)} student band scores successfully.")

        return {
            "status": "SUCCESS",
            "classroom_id": classroom_id_str,
            "processed_count": len(serialized_data),
            "data": serialized_data
        }

    except Exception as exc:
        logger.error(f"❌ [CELERY WORKER FAILED] Error during calculation: {exc}")
        db.rollback()
        raise exc

    finally:
        # 6. Always close database session
        db.close()