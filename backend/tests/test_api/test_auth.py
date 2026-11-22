# tests/test_auth.py

from unittest.mock import patch
from db.models.user import User
from fastapi.testclient import TestClient


def test_register_success(client: TestClient):
    """Tests successful user registration using the new UserRegister schema with a required password."""
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "securepassword123",
            "full_name": "New Student",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New Student"
    assert "id" in data


def test_login_success(client: TestClient, mock_user: User):
    """Tests successful login with correct JSON credentials."""
    response = client.post(
        "/api/auth/login",
        json={"email": "test_mvp@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data.get("message") == "Login successful"
    assert "access_token" in data


def test_login_invalid_password(client: TestClient, mock_user: User):
    """Tests login failure when entering incorrect password."""
    response = client.post(
        "/api/auth/login",
        json={"email": "test_mvp@example.com", "password": "wrong_password"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_nonexistent_user(client: TestClient):
    """Tests login failure for email not registered in database."""
    response = client.post(
        "/api/auth/login",
        json={"email": "notfound@example.com", "password": "password123"},
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
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        "email": "googleuser@example.com",
        "name": "Google User",
        "picture": "https://accounts.google.com/avatar.png",
    }

    response = client.post(
        "/api/auth/google-login",
        json={"token": "mock_google_id_token"},
    )

    assert response.status_code == 200
    assert response.json().get("message") == "Google login successful"
    assert "access_token" in response.cookies


### Điểm cần kiểm tra khi chạy `pytest`
#* Endpoint `/api/auth/login` hiện tại phải nhận JSON body (`{"email": ..., "password": ...}`) và trả về `"access_token"` trong response body (thay vì form `OAuth2PasswordRequestForm` hay chỉ set cookie) thì 3 test `test_login_*` mới pass.
#* Nếu `/api/auth/login` vẫn dùng `OAuth2PasswordRequestForm` (`username` + `password` dạng form `data=...`), các request gửi `json={"email": ...}` sẽ trả về `422 Unprocessable Entity`.