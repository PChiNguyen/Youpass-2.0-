import uuid
from sqlalchemy.orm import Session

from core.exceptions import ResourceNotFoundError
from repo.skill_repo import SkillRepo
from repo.student_repo import StudentRepo
from repo.student_score_repo import StudentScoreRepo
from schemas.student_score_schemas import StudentScoreCreate, StudentScoreUpdate
from core.cache_decorator import invalidate_cache  # Added
from core.lock_decorator import distributed_lock  # Added   
import time 

class StudentScoreService:
    def __init__(self, db_session: Session):
        self.student_score_repo = StudentScoreRepo(db_session)
        self.student_repo = StudentRepo(db_session)
        self.skill_repo = SkillRepo(db_session)

    def create_student_score(self, student_score: StudentScoreCreate):
        if not self.student_repo.get_student_by_id(student_score.student_id):
            raise ResourceNotFoundError(message="Student not found")
        if not self.skill_repo.get_by_id(student_score.skill_id):
            raise ResourceNotFoundError(message="Skill not found")
        return self.student_score_repo.create_student_score(
            **student_score.model_dump(exclude_unset=True)
        )

    def get_student_scores_by_student_id(self, student_id: uuid.UUID):
        if not self.student_repo.get_student_by_id(student_id):
            raise ResourceNotFoundError(message="Student not found")
        return self.student_score_repo.get_student_scores_by_student_id(student_id)

    def get_student_scores_by_skill_id(self, skill_id: int):
        if not self.skill_repo.get_by_id(skill_id):
            raise ResourceNotFoundError(message="Skill not found")
        return self.student_score_repo.get_student_scores_by_skill_id(skill_id)

    def get_student_score_by_id(self, student_score_id: uuid.UUID):
        score = self.student_score_repo.get_student_score_by_id(student_score_id)
        if not score:
            raise ResourceNotFoundError(message="Student score not found")
        return score
    @distributed_lock(
      lock_key_pattern="lock:score:{student_score_id}",
      timeout=5,
      blocking_timeout=1.0,
  )
    @invalidate_cache(prefixes=["grading"])  # Added
    def update_student_score(self, student_score_id: uuid.UUID, student_score: StudentScoreUpdate):
        # stop the execution for 5 seconds so that we can check if the lock is working properly
        time.sleep(5)

        if not self.student_score_repo.get_student_score_by_id(student_score_id):
            raise ResourceNotFoundError(message="Student score not found")
        return self.student_score_repo.update_student_score(
            student_score_id, **student_score.model_dump(exclude_unset=True)
        )

    def delete_student_score(self, student_score_id: uuid.UUID):
        if not self.student_score_repo.get_student_score_by_id(student_score_id):
            raise ResourceNotFoundError(message="Student score not found")
        return self.student_score_repo.delete_student_score(student_score_id)