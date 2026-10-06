from db.models.user import User
def test_user_creation(mock_user: User):
    """
    Verifies that the mock_user fixture successfully creates a user in the test database.
    """
    assert mock_user.id is not None
    assert mock_user.email == 'test_mvp@example.com'
    assert mock_user.target_overall == 7.0