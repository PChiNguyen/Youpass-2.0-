# services/submission_service.py
import uuid
from typing import List
from sqlalchemy.orm import Session

from core.exceptions import ResourceNotFoundError
from repo.submission_repo import SubmissionRepo
from repo.test_repo import TestRepo
from schemas.submission_schemas import SubmissionCreate
from db.models.submission import Submission
from services.grading_service import GradingService


class SubmissionService:
    def __init__(self, db_session: Session):
        self.submission_repo = SubmissionRepo(db_session)
        self.test_repo = TestRepo(db_session)

    def create_submission(self, user_id: uuid.UUID, submission_info: SubmissionCreate) -> Submission:
        """Grades user answers automatically and stores the test submission."""
        test = self.test_repo.get_by_id(submission_info.test_id)
        if not test:
            raise ResourceNotFoundError(message=f"Test with ID '{submission_info.test_id}' not found.")

        questions = test.content.get("questions", [])
        raw_score = GradingService.calculate_raw_score(questions, submission_info.user_answers)
        achieved_band = GradingService.convert_raw_to_band(raw_score, test.skill_type)

        submission_data = {
            "user_id": user_id,
            "test_id": submission_info.test_id,
            "user_answers": submission_info.user_answers,
            "raw_score": raw_score,
            "achieved_band": achieved_band
        }

        return self.submission_repo.create(**submission_data)

    def get_submission_by_id(self, submission_id: uuid.UUID) -> Submission:
        """Retrieves a submission by its unique ID."""
        submission = self.submission_repo.get_by_id(submission_id)
        if not submission:
            raise ResourceNotFoundError(message=f"Submission with ID '{submission_id}' not found.")
        return submission

    def get_user_submissions(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Submission]:
        """Retrieves all submissions made by a specific user."""
        return self.submission_repo.get_by_user_id(user_id, skip=skip, limit=limit)

    def get_test_submissions(self, test_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Submission]:
        """Retrieves all submissions associated with a specific test."""
        test = self.test_repo.get_by_id(test_id)
        if not test:
            raise ResourceNotFoundError(message=f"Test with ID '{test_id}' not found.")
        return self.submission_repo.get_by_test_id(test_id, skip=skip, limit=limit)

    def delete_submission(self, submission_id: uuid.UUID) -> bool:
        """Deletes a submission record by ID."""
        return self.submission_repo.delete(submission_id)