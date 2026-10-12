from uuid import uuid4
from schemas.submission_schemas import SubmissionCreate, SubmissionUpdate

def test_submission_create_valid():
    test_id = uuid4()
    sub = SubmissionCreate(
        test_id=test_id,
        user_answers={"q1": "True", "q2": "False"}
    )
    assert sub.test_id == test_id
    assert sub.user_answers["q1"] == "True"

def test_submission_update():
    update = SubmissionUpdate(raw_score=35.0, achieved_band=8.0)
    assert update.raw_score == 35.0
    assert update.achieved_band == 8.0