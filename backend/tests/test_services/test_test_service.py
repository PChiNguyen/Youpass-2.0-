# tests/test_test_service.py
import pytest
import uuid
from sqlalchemy.orm import Session

from services.test_service import TestService
from schemas.test_schemas import TestCreate
from db.models.test import SkillType
from core.exceptions import ResourceNotFoundError
from db.models.test import Test


def test_create_test_success(db_session: Session):
    """Tests creating an IELTS test through the service layer."""
    service = TestService(db_session)
    payload = TestCreate(
        title="Listening Test Practice 1",
        skill_type=SkillType.LISTENING,
        content={"questions": [{"id": "q1", "correct_answer": "B"}]}
    )
    test_obj = service.create_test(payload)
    
    assert test_obj.id is not None
    assert test_obj.title == "Listening Test Practice 1"
    assert test_obj.skill_type == SkillType.LISTENING


def test_get_test_by_id_success(db_session: Session, mock_test: Test):
    """Tests retrieving an existing test by ID."""
    service = TestService(db_session)
    test_obj = service.get_test_by_id(mock_test.id)
    assert test_obj.id == mock_test.id


def test_get_test_not_found(db_session: Session):
    """Tests that retrieving a non-existent test raises ResourceNotFoundError."""
    service = TestService(db_session)
    with pytest.raises(ResourceNotFoundError):
        service.get_test_by_id(uuid.uuid4())