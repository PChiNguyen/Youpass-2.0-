from core.security import get_password_hash, verify_password, create_access_token 
import pytest 
import logging 

logger = logging.getLogger(__name__)


def test_get_password_hash():
    password = 'test_password'
    hashed_password = get_password_hash(password)
    assert verify_password(password, hashed_password) 
    assert not verify_password('wrong_password', hashed_password) 

def test_create_access_token_success():
    subject = 'test_subject'
    access_token = create_access_token(subject)
    assert access_token 
    print(f"Generated access token: {access_token}")  # Optional: Print the token for debugging
def test_create_access_token_failure():
    with pytest.raises(Exception) as e:
        create_access_token() 
    logger.error(f"Error creating access token: {e}") 