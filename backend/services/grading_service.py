
# services/grading_service.py
class GradingService:
    
    case_insensitive_match = True

    @classmethod
    def calculate_raw_score(cls, questions: list, user_answers: dict) -> float:
        """Compares user answers against correct answers in test content JSON."""
        correct_count = 0
        for q in questions:
            q_id = q.get("id")
            correct_ans = str(q.get("correct_answer", "")).strip().lower()
            user_ans = str(user_answers.get(q_id, "")).strip().lower()
            
            if user_ans and user_ans == correct_ans:
                correct_count += 1
        return float(correct_count)

    @classmethod
    def convert_raw_to_band(cls, raw_score: float, skill_type: str) -> float:
        """Simplified IELTS Reading/Listening band score conversion scale."""
        if skill_type not in ["reading", "listening"]:
            return 0.0  # Writing/Speaking require human or AI grading
        
        # Standard IELTS Academic Reading approximate conversion scale
        if raw_score >= 39: return 9.0
        if raw_score >= 37: return 8.5
        if raw_score >= 35: return 8.0
        if raw_score >= 33: return 7.5
        if raw_score >= 30: return 7.0
        if raw_score >= 27: return 6.5
        if raw_score >= 23: return 6.0
        if raw_score >= 19: return 5.5
        if raw_score >= 15: return 5.0
        return 4.5