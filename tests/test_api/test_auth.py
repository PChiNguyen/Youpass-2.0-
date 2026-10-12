import pytest
from db.models.user import User
from fastapi.testclient import TestClient
from unittest.mock import patch
from fastapi.testclient import TestClient  


def test_login_success(client: TestClient, mock_user: User):
    """Tests successful login with correct credentials."""
    response = client.post(
        "/api/auth/login",
        data={"username": "test_mvp@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert response.json().get("message") == "Login successful"
    assert "access_token" in response.cookies


def test_login_invalid_password(client: TestClient, mock_user: User):
    """Tests login failure when entering incorrect password."""
    response = client.post(
        "/api/auth/login",
        data={"username": "test_mvp@example.com", "password": "wrong_password"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_nonexistent_user(client: TestClient):
    """Tests login failure for email not registered in database."""
    response = client.post(
        "/api/auth/login",
        data={"username": "notfound@example.com", "password": "password123"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_get_current_user_success(client: TestClient, mock_user: User, user_token: str):
    """Tests get_current_user dependency with a valid JWT Bearer token."""
    headers = {"Authorization": f"Bearer {user_token}"}
    response = client.get("/api/auth/me", headers=headers)
    
    assert response.status_code == 200
    assert response.json()["email"] == mock_user.email
    assert response.json()["target_overall"] == 7.0


def test_get_current_user_unauthorized(client: TestClient):
    """Tests get_current_user dependency when missing authentication token."""
    response = client.get("/api/auth/me")
    assert response.status_code == 401



@patch("httpx.Client.get")
def test_google_login_success(mock_get, client: TestClient):
    """Tests Google login by mocking Google's token verification response."""
    # 1. Configure the mock to simulate a successful response (Status 200) from Google
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        "email": "googleuser@example.com",
        "name": "Google User",
        "picture": "https://accounts.google.com/avatar.png"
    }

    # 2. Send request to your FastAPI backend
    response = client.post(
        "/api/auth/google-login",
        json={"token": "fake-google-id-token"}
    )

    # 3. Assert success
    assert response.status_code == 200
    assert response.json().get("message") == "Google login successful"
    assert "access_token" in response.cookies