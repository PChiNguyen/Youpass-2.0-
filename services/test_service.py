# services/test_service.py
import uuid
from typing import Optional, List
from sqlalchemy.orm import Session

from core.exceptions import ResourceNotFoundError
from repo.test_repo import TestRepo
from schemas.test_schemas import TestCreate, TestUpdate
from db.models.test import Test, SkillType


class TestService:
    __test__ = False
    def __init__(self, db_session: Session):
        # Initialize the test repository with the database session
        self.test_repo = TestRepo(db_session)

    def create_test(self, test_info: TestCreate) -> Test:
        """
        Creates a new IELTS exam test record.
        """
        test_data = test_info.model_dump(exclude_unset=True)
        return self.test_repo.create(**test_data)

    def get_test_by_id(self, test_id: uuid.UUID) -> Test:
        """
        Retrieves a single test by its ID or raises ResourceNotFoundError if missing.
        """
        test = self.test_repo.get_by_id(test_id)
        if not test:
            raise ResourceNotFoundError(message=f"Test with ID '{test_id}' not found.")
        return test

    def get_all_tests(
        self, skill_type: Optional[SkillType] = None, skip: int = 0, limit: int = 100
    ) -> List[Test]:
        """
        Retrieves a paginated list of tests, optionally filtered by skill type (reading, listening, etc.).
        """
        return self.test_repo.get_all(skill_type=skill_type, skip=skip, limit=limit)

    def update_test(self, test_id: uuid.UUID, test_info: TestUpdate) -> Test:
        """
        Updates test details after verifying that the test exists.
        """
        # Ensure test exists first
        self.get_test_by_id(test_id)

        test_data = test_info.model_dump(exclude_unset=True)
        return self.test_repo.update(test_id, **test_data)

    def delete_test(self, test_id: uuid.UUID) -> bool:
        """
        Deletes a test record after verifying its existence.
        """
        # Ensure test exists first
        self.get_test_by_id(test_id)
        return self.test_repo.delete(test_id)