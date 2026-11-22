from fastapi.testclient import TestClient


def test_critical_reading_mvp_flow(client: TestClient):
    """End-to-end API flow: register -> login -> create/fetch test -> submit -> verify grade."""
    # 1. Register student
    reg_res = client.post(
        "/api/auth/register",
        json={
            "email": "e2e_student@example.com",
            "password": "strongpassword123",
            "full_name": "E2E Student",
        },
    )
    assert reg_res.status_code == 201

    # 2. Login via JSON contract
    login_res = client.post(
        "/api/auth/login",
        json={"email": "e2e_student@example.com", "password": "strongpassword123"},
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Seed a reading test via API
    create_test_res = client.post(
        "/api/tests/",
        headers=headers,
        json={
            "title": "Bees on guard E2E",
            "skill_type": "reading",
            "category": "Passage 1",
            "content": {
                "questions": [
                    {"id": "1", "number": 1, "type": "true_false_not_given", "correct_answer": "FALSE"},
                    {"id": "2", "number": 2, "type": "gap_filling", "correct_answer": "maize"},
                ]
            },
        },
    )
    assert create_test_res.status_code == 201
    test_id = create_test_res.json()["id"]

    # 4. Browse Reading catalog & open test detail (public endpoints)
    list_res = client.get("/api/tests/?skill_type=reading")
    assert list_res.status_code == 200
    assert any(item["id"] == test_id for item in list_res.json())

    detail_res = client.get(f"/api/tests/{test_id}")
    assert detail_res.status_code == 200

    # 5. Submit answers & verify proportional band grading
    submit_res = client.post(
        "/api/submissions/",
        headers=headers,
        json={"test_id": test_id, "user_answers": {"1": "FALSE", "2": "  MAIZE "}},
    )
    assert submit_res.status_code == 201
    submission = submit_res.json()
    assert submission["raw_score"] == 2.0
    assert submission["achieved_band"] == 9.0

    # 6. Verify submission appears in /api/submissions/me
    history_res = client.get("/api/submissions/me", headers=headers)
    assert history_res.status_code == 200
    assert any(item["id"] == submission["id"] for item in history_res.json())