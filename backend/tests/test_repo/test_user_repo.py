# tests/test_user_repo.py
import pytest
import uuid
from sqlalchemy.orm import Session

from repo.user_repo import UserRepo
from core.exceptions import ConflictError, ResourceNotFoundError
from db.models.user import User
from tests.conftest import db_session, mock_user 




def test_create_user_success(db_session: Session):
    """Tests successful creation of a new user."""
    repo = UserRepo(db_session)
    user = repo.create(email="new_student@example.com", target_overall=7.5)
    
    assert user.id is not None
    assert user.email == "new_student@example.com"
    assert user.target_overall == 7.5


def test_create_user_duplicate_email_raises_conflict(db_session: Session, mock_user: User):
    """Tests that creating a user with an existing email raises ConflictError."""
    repo = UserRepo(db_session)
    
    with pytest.raises(ConflictError):
        repo.create(email=mock_user.email)


def test_get_user_by_id_and_email(db_session: Session, mock_user: User):
    """Tests retrieving an existing user by primary key and email."""
    repo = UserRepo(db_session)
    
    found_by_id = repo.get_by_id(mock_user.id)
    found_by_email = repo.get_by_email(mock_user.email)
    
    assert found_by_id is not None
    assert found_by_id.id == mock_user.id
    assert found_by_email is not None
    assert found_by_email.email == mock_user.email


def test_update_user_success(db_session: Session, mock_user: User):
    """Tests updating attributes on an existing user."""
    repo = UserRepo(db_session)
    updated_user = repo.update(mock_user.id, target_overall=8.0)
    
    assert updated_user.target_overall == 8.0


def test_delete_user_success(db_session: Session, mock_user: User ):
    """Tests deleting an existing user record."""
    repo = UserRepo(db_session)
    result = repo.delete(mock_user.id)
    
    assert result is True
    assert repo.get_by_id(mock_user.id) is None


def test_delete_user_not_found(db_session: Session):
    """Tests that deleting a non-existent user raises ResourceNotFoundError."""
    repo = UserRepo(db_session)
    
    with pytest.raises(ResourceNotFoundError):
        repo.delete(uuid.uuid4())