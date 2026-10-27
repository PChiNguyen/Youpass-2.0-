# repo/user_repo.py
import uuid
from typing import List

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from core.exceptions import ConflictError, DatabaseValidationError, ResourceNotFoundError
from db.models.user import User


class UserRepo:
    def __init__(self, db: Session):
        self.db = db

    def create(self, **kwargs) -> User:
        """Creates a new user record in the database."""
        try:
            user = User(**kwargs)
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user
        except IntegrityError:
            self.db.rollback()
            raise ConflictError(message="A user with this email already exists.")
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseValidationError(message=f"Failed to create user: {e!s}")

    def get_by_id(self, user_id: uuid.UUID) -> User | None:
        """Retrieves a single user by primary key."""
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> User | None:
        """Retrieves a single user by email address."""
        return self.db.query(User).filter(User.email == email).first()

    def update(self, user_id: uuid.UUID, **kwargs) -> User:
        """Updates attributes of an existing user."""
        user = self.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundError(message=f"User with ID '{user_id}' not found.")

        for key, value in kwargs.items():
            if hasattr(user, key) and value is not None:
                setattr(user, key, value)

        try:
            self.db.commit()
            self.db.refresh(user)
            return user
        except IntegrityError:
            self.db.rollback()
            raise ConflictError(message="Email address is already in use by another account.")
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseValidationError(message=f"Failed to update user: {e!s}")

    def delete(self, user_id: uuid.UUID) -> bool:
        """Deletes a user record by ID."""
        user = self.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundError(message=f"User with ID '{user_id}' not found.")

        try:
            self.db.delete(user)
            self.db.commit()
            return True
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseValidationError(message=f"Failed to delete user: {e!s}")