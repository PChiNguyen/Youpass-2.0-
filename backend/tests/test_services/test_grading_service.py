# tests/test_grading_service.py
import pytest
from services.grading_service import GradingService


def test_calculate_raw_score_success():
    """Tests calculating correct raw score with case-insensitivity and whitespace trimming."""
    questions = [
        {"id": "q1", "correct_answer": "True"},
        {"id": "q2", "correct_answer": "B"},
        {"id": "q3", "correct_answer": "1995"}
    ]
    
    # Student answers q1 and q2 correctly (with extra spaces/lowercase), q3 incorrectly
    user_answers = {
        "q1": "  true ",
        "q2": "b",
        "q3": "2000"
    }
    
    score = GradingService.calculate_raw_score(questions, user_answers)
    assert score == 2.0


def test_convert_raw_to_band_reading_listening():
    """Tests converting raw scores to official IELTS band scores for Reading and Listening."""
    # High score (39/40) -> Band 9.0
    assert GradingService.convert_raw_to_band(39.0, "reading") == 9.0
    
    # Moderate score (30/40) -> Band 7.0
    assert GradingService.convert_raw_to_band(30.0, "listening") == 7.0
    
    # Low score -> Minimum base band 4.5
    assert GradingService.convert_raw_to_band(10.0, "reading") == 4.5


def test_convert_raw_to_band_unsupported_skill():
    """Tests that skills requiring manual/AI grading (Writing/Speaking) return 0.0 automatically."""
    assert GradingService.convert_raw_to_band(35.0, "writing") == 0.0
    assert GradingService.convert_raw_to_band(35.0, "speaking") == 0.0