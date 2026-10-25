# tests/test_api_test.py
from fastapi.testclient import TestClient
from db.models.test import Test

def test_create_test_success(client: TestClient, user_token: str):
    """Tests creating a new IELTS test successfully with Bearer token authentication."""
    headers = {"Authorization": f"Bearer {user_token}"}
    response = client.post(
        "/api/tests/",
        json={
            "title": "Cambridge 19 - Reading Test 1",
            "skill_type": "reading",
            "category": "Passage 1",
            "content": {"questions": [{"id": "q1", "text": "Sample question text"}]}
        },
        headers=headers
    )
    assert response.status_code == 201, f"Raw Error Response: {response.text}"
    data = response.json()
    assert data["title"] == "Cambridge 19 - Reading Test 1"
    assert data["skill_type"] == "reading"
    assert "id" in data

def test_get_all_tests(client: TestClient, mock_test: Test):
    """Tests retrieving a list of all tests without requiring auth."""
    response = client.get("/api/tests/")
    assert response.status_code == 200, f"Raw Error Response: {response.text}"
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_get_test_by_id(client: TestClient, mock_test: Test):
    """Tests fetching a single test by ID without requiring auth."""
    response = client.get(f"/api/tests/{mock_test.id}")
    assert response.status_code == 200, f"Raw Error Response: {response.text}"
    data = response.json()
    assert data["id"] == str(mock_test.id)
    assert data["title"] == mock_test.title

def test_update_test_success(client: TestClient, user_token: str, mock_test: Test):
    """Tests updating an existing test with Bearer token authentication."""
    headers = {"Authorization": f"Bearer {user_token}"}
    response = client.patch(
        f"/api/tests/{mock_test.id}",
        json={"title": "Updated Cambridge Title"},
        headers=headers
    )
    assert response.status_code == 200, f"Raw Error Response: {response.text}"
    data = response.json()
    assert data["title"] == "Updated Cambridge Title"

def test_delete_test_success(client: TestClient, user_token: str, mock_test: Test):
    """Tests deleting an IELTS test with Bearer token authentication."""
    headers = {"Authorization": f"Bearer {user_token}"}
    response = client.delete(
        f"/api/tests/{mock_test.id}",
        headers=headers
    )
    assert response.status_code == 204, f"Raw Error Response: {response.text}"