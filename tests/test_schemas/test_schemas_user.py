import pytest
from pydantic import ValidationError
from schemas.user_schemas import UserCreate, UserUpdate

def test_user_create_valid():
    user = UserCreate(
        email="test@example.com",
        password="securepassword123",
        target_overall=7.5
    )
    assert user.email == "test@example.com"
    assert user.target_overall == 7.5

def test_user_create_invalid_email():
    with pytest.raises(ValidationError):
        UserCreate(email="not-an-email", password="securepassword123")

def test_user_update_partial():
    update_data = UserUpdate(target_overall=8.0)
    assert update_data.target_overall == 8.0
    assert update_data.email is None
    assert update_data.password is None