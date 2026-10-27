import pytest
from fastapi import HTTPException
from jose import jwt

from core.config import settings
from core.security import create_access_token
from api.deps import get_current_user
from db.models.user import User

def test_get_current_user_valid(db_session, mock_user: User):
    """1. Test retrieving current user with a valid JWT token."""
    token = create_access_token(subject=mock_user.id)
    
    # Call get_current_user directly
    user = get_current_user(db=db_session, token=token)
    
    assert user.id == mock_user.id
    assert user.email == mock_user.email


def test_get_current_user_not_found(db_session):
    """2. Test valid token pointing to a non-existent user ID in DB."""
    fake_token = create_access_token(subject="00000000-0000-0000-0000-000000000000")
    
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(db=db_session, token=fake_token)
        
    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "User not found"


def test_get_current_user_invalid_token(db_session):
    """3. Test passing a garbage/malformed token."""
    invalid_token = "invalid.token.string"
    
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(db=db_session, token=invalid_token)
        
    assert exc_info.value.status_code == 401
    assert "Could not validate credentials" in exc_info.value.detail


def test_get_current_user_missing_sub(db_session):
    """4. Test token missing the required 'sub' (subject/user_id) claim."""
    token_without_sub = jwt.encode(
        {"exp": 9999999999}, 
        settings.SECRET_KEY, 
        algorithm=settings.ALGORITHM
    )
    
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(db=db_session, token=token_without_sub)
        
    assert exc_info.value.status_code == 401
    assert "Could not validate credentials" in exc_info.value.detail