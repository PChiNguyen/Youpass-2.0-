import pytest
from pydantic import ValidationError
from db.models.test import SkillType
from schemas.test_schemas import TestCreate

def test_test_create_valid_enum():
    test_item = TestCreate(
        title="IELTS Reading Test 1",
        skill_type=SkillType.READING,
        content={"questions": [{"id": "q1", "text": "What is AI?"}]}
    )
    assert test_item.skill_type == SkillType.READING
    assert test_item.skill_type.value == "reading"

def test_test_create_invalid_skill_type():
    with pytest.raises(ValidationError):
        TestCreate(
            title="Math Test",
            skill_type="invalid_skill",
            content={}
        )