# repo/test_repo.py
import uuid
from typing import List

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from core.exceptions import DatabaseValidationError, ResourceNotFoundError
from db.models.test import SkillType, Test


class TestRepo:
    __test__ = False

    def __init__(self, db: Session):
        self.db = db

    def create(self, **kwargs) -> Test:
        """Creates a new exam test record."""
        try:
            test = Test(**kwargs)
            self.db.add(test)
            self.db.commit()
            self.db.refresh(test)
            return test
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseValidationError(message=f"Failed to create test: {e!s}")

    def get_by_id(self, test_id: uuid.UUID) -> Test | None:
        """Retrieves a single test by ID."""
        return self.db.query(Test).filter(Test.id == test_id).first()

    def get_all(
        self, skill_type: SkillType | None = None, skip: int = 0, limit: int = 100
    ) -> list[Test]:
        """Retrieves a paginated list of tests, optionally filtered by skill type."""
        query = self.db.query(Test)
        if skill_type:
            query = query.filter(Test.skill_type == skill_type)
        return query.offset(skip).limit(limit).all()

    def update(self, test_id: uuid.UUID, **kwargs) -> Test:
        """Updates test details."""
        test = self.get_by_id(test_id)
        if not test:
            raise ResourceNotFoundError(message=f"Test with ID '{test_id}' not found.")

        for key, value in kwargs.items():
            if hasattr(test, key) and value is not None:
                setattr(test, key, value)

        try:
            self.db.commit()
            self.db.refresh(test)
            return test
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseValidationError(message=f"Failed to update test: {e!s}")

    def delete(self, test_id: uuid.UUID) -> bool:
        """Deletes a test record."""
        test = self.get_by_id(test_id)
        if not test:
            raise ResourceNotFoundError(message=f"Test with ID '{test_id}' not found.")

        try:
            self.db.delete(test)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseValidationError(message=f"Failed to delete test: {e!s}")