# tests/test_user_service.py
import pytest
import uuid
from sqlalchemy.orm import Session

from services.user_service import UserService
from schemas.user_schemas import UserCreate, UserUpdate
from core.exceptions import ConflictError, ResourceNotFoundError
from db.models.user import User 


def test_create_user_success(db_session: Session):
    """Tests successful user registration and password hashing."""
    service = UserService(db_session)
    payload = UserCreate(
        email="service_test@example.com",
        password="securepassword123",
        target_overall=7.5
    )
    user = service.create_user(payload)
    
    assert user.id is not None
    assert user.email == "service_test@example.com"
    # Ensure password is securely hashed, not stored as plaintext
    assert user.password != "securepassword123"


def test_create_user_conflict_email(db_session: Session, mock_user: User):
    """Tests that registering with an existing email raises ConflictError."""
    service = UserService(db_session)
    payload = UserCreate(
        email=mock_user.email,
        password="password123"
    )
    
    with pytest.raises(ConflictError):
        service.create_user(payload)


def test_get_user_by_id_success(db_session: Session, mock_user: User):
    """Tests retrieving an existing user by ID."""
    service = UserService(db_session)
    user = service.get_user_by_id(mock_user.id)
    assert user.id == mock_user.id


def test_get_user_not_found(db_session: Session):
    """Tests that getting a non-existent user raises ResourceNotFoundError."""
    service = UserService(db_session)
    with pytest.raises(ResourceNotFoundError):
        service.get_user_by_id(uuid.uuid4())
def test_get_or_create_google_user_new(db_session: Session):
    """Tests creating a new user profile when signing in with Google for the first time."""
    service = UserService(db_session)
    user: User = service.get_or_create_google_user(
        email="new_google_student@example.com",
        full_name="Google Student",
        avatar_url="https://example.com/avatar.png"
    )
    
    assert user.id is not None
    assert user.email == "new_google_student@example.com"
    assert user.full_name == "Google Student"
    assert user.avatar_url == "https://example.com/avatar.png"
    assert user.password is None  # Social login users should not have a password hash


def test_get_or_create_google_user_existing(db_session: Session, mock_user: User):
    """Tests retrieving an existing user profile when logging in with Google again."""
    service = UserService(db_session)
    user: User
    # mock_user already exists in the test database with email "test_mvp@example.com"
    user = service.get_or_create_google_user(
        email=mock_user.email,
        full_name="Existing User",
        avatar_url="https://example.com/avatar.png"
    )
    
    # Should return the exact same user ID without creating a duplicate record
    assert user.id == mock_user.id
    assert user.email == mock_user.email