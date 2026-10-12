# repo/submission_repo.py
import uuid
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from db.models.submission import Submission
from core.exceptions import DatabaseValidationError, ResourceNotFoundError


class SubmissionRepo:
    def __init__(self, db: Session):
        self.db = db

    def create(self, **kwargs) -> Submission:
        """Stores a test submission in the database."""
        try:
            submission = Submission(**kwargs)
            self.db.add(submission)
            self.db.commit()
            self.db.refresh(submission)
            return submission
        except IntegrityError:
            self.db.rollback()
            raise DatabaseValidationError(message="Invalid user_id or test_id foreign key reference.")
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseValidationError(message=f"Failed to create submission: {str(e)}")

    def get_by_id(self, submission_id: uuid.UUID) -> Optional[Submission]:
        """Retrieves a submission by its unique ID."""
        return self.db.query(Submission).filter(Submission.id == submission_id).first()

    def get_by_user_id(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> List[Submission]:
        """Retrieves all submissions made by a specific user ordered by submission time."""
        return (
            self.db.query(Submission)
            .filter(Submission.user_id == user_id)
            .order_by(Submission.submitted_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_test_id(
        self, test_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> List[Submission]:
        """Retrieves all submissions associated with a specific test."""
        return (
            self.db.query(Submission)
            .filter(Submission.test_id == test_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def delete(self, submission_id: uuid.UUID) -> bool:
        """Deletes a submission record."""
        submission = self.get_by_id(submission_id)
        if not submission:
            raise ResourceNotFoundError(message=f"Submission with ID '{submission_id}' not found.")

        try:
            self.db.delete(submission)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseValidationError(message=f"Failed to delete submission: {str(e)}")