# tests/test_test_repo.py
import pytest
import uuid
from sqlalchemy.orm import Session

from repo.test_repo import TestRepo
from db.models.test import SkillType, Test
from core.exceptions import ResourceNotFoundError


def test_create_test_success(db_session: Session):
    """Tests creating a new IELTS exam entry."""
    repo = TestRepo(db_session)
    test_item = repo.create(
        title="Listening Mock Test 1",
        skill_type=SkillType.LISTENING,
        content={"questions": []}
    )
    
    assert test_item.id is not None
    assert test_item.title == "Listening Mock Test 1"
    assert test_item.skill_type == SkillType.LISTENING


def test_get_all_tests_filtered_by_skill(db_session: Session, mock_test: Test):
    """Tests retrieving tests filtered by skill type using mock_test fixture."""
    repo = TestRepo(db_session)
    
    reading_tests = repo.get_all(skill_type=SkillType.READING)
    assert len(reading_tests) >= 1
    assert reading_tests[0].id == mock_test.id

    listening_tests = repo.get_all(skill_type=SkillType.LISTENING)
    assert len(listening_tests) == 0


def test_update_test_not_found_raises_exception(db_session: Session):
    """Tests updating a non-existent test record raises ResourceNotFoundError."""
    repo = TestRepo(db_session)
    
    with pytest.raises(ResourceNotFoundError):
        repo.update(uuid.uuid4(), title="Updated Non-existent Title")