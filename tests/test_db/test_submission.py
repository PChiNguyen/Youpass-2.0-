from db.models.submission import Submission 
from db.models.user import User
from db.models.test import Test 
import logging 
logger = logging.getLogger(__name__)
def test_submission_creation(mock_submission: Submission, mock_user: User, mock_test: Test):
    """
    Verifies that a Submission correctly links the User and the Test,
    and stores the JSON answers.
    """
    assert mock_submission.id is not None
    
    # Verify relationships
    assert mock_submission.user_id == mock_user.id
    assert mock_submission.test_id == mock_test.id
    
    # Verify JSON answers and scores
    assert mock_submission.user_answers["q1"] == "Climate change"
    assert mock_submission.raw_score == 35.0
    assert mock_submission.achieved_band == 8.0
    logging.info(f"Submission created at: {mock_submission.submitted_at}")