# tests/test_api_submission.py
from fastapi.testclient import TestClient
from db.models.submission import Submission
from db.models.test import Test

def test_create_submission_success(client: TestClient, user_token: str, mock_test: Test):
    """Tests creating a submission successfully with Bearer token authentication."""
    headers = {"Authorization": f"Bearer {user_token}"}
    response = client.post(
        "/api/submissions/",
        json={
            "test_id": str(mock_test.id),
            "user_answers": {"q1": "Climate change"}
        },
        headers=headers
    )
    assert response.status_code == 201, f"Raw Error Response: {response.text}"
    data = response.json()
    assert data["test_id"] == str(mock_test.id)
    assert "raw_score" in data
    assert "achieved_band" in data
    assert "id" in data

def test_get_my_submissions(client: TestClient, user_token: str, mock_submission: Submission):
    """Tests fetching user submission history with Bearer token authentication."""
    headers = {"Authorization": f"Bearer {user_token}"}
    response = client.get(
        "/api/submissions/me",
        headers=headers
    )
    assert response.status_code == 200, f"Raw Error Response: {response.text}"
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["id"] == str(mock_submission.id)

def test_get_submission_by_id(client: TestClient, user_token: str, mock_submission: Submission):
    """Tests fetching a specific submission by ID with Bearer token authentication."""
    headers = {"Authorization": f"Bearer {user_token}"}
    response = client.get(
        f"/api/submissions/{mock_submission.id}",
        headers=headers
    )
    assert response.status_code == 200, f"Raw Error Response: {response.text}"
    data = response.json()
    assert data["id"] == str(mock_submission.id)
    assert data["raw_score"] == mock_submission.raw_score

def test_delete_submission_success(client: TestClient, user_token: str, mock_submission: Submission):
    """Tests deleting a submission record with Bearer token authentication."""
    headers = {"Authorization": f"Bearer {user_token}"}
    response = client.delete(
        f"/api/submissions/{mock_submission.id}",
        headers=headers
    )
    assert response.status_code == 204, f"Raw Error Response: {response.text}"