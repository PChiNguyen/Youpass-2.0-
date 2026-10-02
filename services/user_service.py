import logging
import uuid
from sqlalchemy.orm import Session

from core.exceptions import ConflictError, ResourceNotFoundError
from core.security import get_password_hash
from repo.user_repo import UserRepo
from schemas.user_schemas import UserCreate, UserUpdate
from core.cache_decorator import invalidate_cache  # Added
logger = logging.getLogger(__name__)


class UserService:
    def __init__(self, db_session: Session):
        self.user_repo = UserRepo(db_session)

    def create_user(self, user_info: UserCreate):
        if self.user_repo.user_exists_by_email(user_info.email):
            raise ConflictError(message="Email already registered")

        user_data = user_info.model_dump(exclude_unset=True)
        if "password" in user_data:
            user_data["password"] = get_password_hash(user_data["password"])

        return self.user_repo.create_user(**user_data)
    
    def update_user(self, user_id: uuid.UUID, user_info: UserUpdate):
        user = self.user_repo.get_user_by_id(user_id)
        if not user:
            raise ResourceNotFoundError(message="User not found")

        user_data = user_info.model_dump(exclude_unset=True)
        if "password" in user_data and user_data["password"]:
            user_data["password"] = get_password_hash(user_data["password"])

        return self.user_repo.update_user(user_id, **user_data)

    def delete_user(self, user_id: uuid.UUID):
        user = self.user_repo.get_user_by_id(user_id)
        if not user:
            raise ResourceNotFoundError(message="User not found")
        return self.user_repo.delete_user(user_id)

    def get_user_by_id(self, user_id: uuid.UUID):
        user = self.user_repo.get_user_by_id(user_id)
        if not user:
            raise ResourceNotFoundError(message="User not found")
        return user

    def get_user_by_email(self, email: str):
        user = self.user_repo.get_user_by_email(email)
        if not user:
            raise ResourceNotFoundError(message="User not found")
        return user