# tests/test_submission_repo.py
import pytest
import uuid
from sqlalchemy.orm import Session

from db.models.test import Test
from db.models.user import User
from db.models.submission import Submission
from repo.submission_repo import SubmissionRepo
from core.exceptions import DatabaseValidationError, ResourceNotFoundError


def test_create_submission_success(db_session: Session, mock_user: User, mock_test: Test):
    """Tests saving a test submission linked to existing user and test models."""
    repo = SubmissionRepo(db_session)
    submission = repo.create(
        user_id=mock_user.id,
        test_id=mock_test.id,
        user_answers={"q1": "True", "q2": "False"}
    )
    
    assert submission.id is not None
    assert submission.user_id == mock_user.id
    assert submission.test_id == mock_test.id


def test_create_submission_foreign_key_violation(db_session: Session):
    """Tests creating a submission with non-existent user and test UUIDs."""
    repo = SubmissionRepo(db_session)
    
    with pytest.raises(DatabaseValidationError):
        repo.create(
            user_id=uuid.uuid4(),
            test_id=uuid.uuid4(),
            user_answers={"q1": "A"}
        )


def test_get_submissions_by_user_id(db_session: Session, mock_submission: Submission):
    """Tests retrieving submissions associated with a specific user ID."""
    repo = SubmissionRepo(db_session)
    
    results = repo.get_by_user_id(mock_submission.user_id)
    assert len(results) >= 1
    assert results[0].id == mock_submission.id


def test_delete_submission_not_found(db_session: Session):
    """Tests deleting a non-existent submission raises ResourceNotFoundError."""
    repo = SubmissionRepo(db_session)
    
    with pytest.raises(ResourceNotFoundError):
        repo.delete(uuid.uuid4())