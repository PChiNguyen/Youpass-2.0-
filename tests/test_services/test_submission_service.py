# tests/test_submission_service.py
import pytest
import uuid
from sqlalchemy.orm import Session

from db.models.user import User
from services.submission_service import SubmissionService
from schemas.submission_schemas import SubmissionCreate
from repo.test_repo import TestRepo
from db.models.test import SkillType
from core.exceptions import ResourceNotFoundError


def test_create_submission_with_auto_grading(db_session: Session, mock_user: User):
    """Tests submitting test answers, automatic raw score calculation, and band conversion."""
    # Create a test with a correct answer for verification
    test_repo = TestRepo(db_session)
    test_obj = test_repo.create(
        title="Graded Reading Test",
        skill_type=SkillType.READING,
        content={"questions": [{"id": "q1", "correct_answer": "True"}]}
    )

    service = SubmissionService(db_session)
    payload = SubmissionCreate(
        test_id=test_obj.id,
        user_answers={"q1": "True"}
    )
    submission = service.create_submission(mock_user.id, payload)
    
    assert submission.id is not None
    assert submission.raw_score == 1.0
    assert submission.achieved_band is not None


def test_get_submission_not_found(db_session: Session):
    """Tests that retrieving a non-existent submission raises ResourceNotFoundError."""
    service = SubmissionService(db_session)
    with pytest.raises(ResourceNotFoundError):
        service.get_submission_by_id(uuid.uuid4())