
from db.models.test import Test
def test_test_creation(mock_test: Test):
    """
    Verifies that a Test model is created and JSON content is properly stored.
    """
    assert mock_test.id is not None
    assert mock_test.title == "Cambridge 18 - Reading Test 1"
    assert mock_test.skill_type == "reading"
    
    # Verify the JSON data was stored correctly
    assert "questions" in mock_test.content
    assert mock_test.content["questions"][0]["id"] == "q1"