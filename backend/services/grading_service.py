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
    def convert_raw_to_band(
        cls,
        raw_score: float,
        skill_type: str,
        total_questions: int = 40,
    ) -> float:
        """Converts raw score to IELTS band score; uses raw score directly when total_questions < 40."""
        if skill_type not in ["reading", "listening"]:
            return 0.0

        score_for_band = (
            raw_score
            if total_questions < 40
            else (raw_score / total_questions) * 40.0
            if total_questions > 0 and total_questions != 40
            else raw_score
        )

        if score_for_band >= 39:
            return 9.0
        if score_for_band >= 37:
            return 8.5
        if score_for_band >= 35:
            return 8.0
        if score_for_band >= 33:
            return 7.5
        if score_for_band >= 30:
            return 7.0
        if score_for_band >= 27:
            return 6.5
        if score_for_band >= 23:
            return 6.0
        if score_for_band >= 19:
            return 5.5
        if score_for_band >= 15:
            return 5.0
        return 4.5