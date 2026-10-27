# services/user_service.py
import uuid
from typing import Optional, List
from sqlalchemy.orm import Session

from core.exceptions import ConflictError, ResourceNotFoundError
from core.security import get_password_hash
from repo.user_repo import UserRepo
from schemas.user_schemas import UserCreate, UserUpdate
from db.models.user import User


class UserService:
    def __init__(self, db_session: Session):
        # 1. Inject database session and initialize repository
        self.user_repo = UserRepo(db_session)

    def create_user(self, user_info: UserCreate) -> User:
        """
        Hashes password and creates a new user.
        Raises ConflictError if email is already registered.
        """
        # 2. Check if email already exists before calling repo
        if self.user_repo.get_by_email(user_info.email):
            raise ConflictError(message="Email address is already in use.")

        # 3. Dump schema fields into a dictionary
        user_data = user_info.model_dump(exclude_unset=True)

        # 4. Securely hash plaintext password
        if "password" in user_data:
            user_data["password"] = get_password_hash(user_data["password"])

        return self.user_repo.create(**user_data)

    def get_user_by_id(self, user_id: uuid.UUID) -> User:
        """Retrieves a user by ID or raises ResourceNotFoundError."""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise ResourceNotFoundError(message=f"User with ID '{user_id}' not found.")
        return user

    def get_or_create_google_user(self, email: str, full_name: Optional[str], avatar_url: Optional[str]) -> User:
        """Finds an existing user or validates and creates a new one using UserCreate schema."""
        user = self.user_repo.get_by_email(email)
        if user:
            return user
        
        # 🟢 Validate input through UserCreate schema (password is Optional for social logins)
        user_in = UserCreate(
            email=email,
            full_name=full_name,
            avatar_url=avatar_url,
            password=None  # Explicitly None for Google users
        )
        
        user_data = user_in.model_dump(exclude_unset=True)
        return self.user_repo.create(**user_data)

    def get_user_by_email(self, email: str) -> User:
        """Retrieves a user by email address or raises ResourceNotFoundError."""
        user = self.user_repo.get_by_email(email)
        if not user:
            raise ResourceNotFoundError(message=f"User with email '{email}' not found.")
        return user

    def update_user(self, user_id: uuid.UUID, user_info: UserUpdate) -> User:
        """
        Updates profile fields and hashes password if updated.
        """
        # Unpack provided fields
        user_data = user_info.model_dump(exclude_unset=True)

        # Re-hash password if provided in update payload
        if "password" in user_data and user_data["password"]:
            user_data["password"] = get_password_hash(user_data["password"])

        return self.user_repo.update(user_id, **user_data)

    def delete_user(self, user_id: uuid.UUID) -> bool:
        """Deletes user record by ID."""
        return self.user_repo.delete(user_id)