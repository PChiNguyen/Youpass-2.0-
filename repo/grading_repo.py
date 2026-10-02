from dataclasses import dataclass
from typing import List, Optional
from sqlalchemy import case, func, cast, Numeric
from sqlalchemy.orm import Session 
from db.models.student import Student 
from db.models.classroom import Classroom 
from db.models.student_score import StudentScore, BandScore
from db.models.skill import SkillModel 
import uuid 
from core.cache_decorator import cache_response # Added

@dataclass 
class Overall_Band:
    student_id: uuid.UUID
    student_name: str
    overall: float
    completed_tests: int

class GradingRepo:
    def __init__(self, db: Session):
        self.db = db 

    def _build_overall_band_score(self, classroom_id:uuid.UUID): 
        numeric_score = case(
            (StudentScore.score == BandScore.BAND_6_0, 6.0),
            (StudentScore.score == BandScore.BAND_6_5, 6.5),
            (StudentScore.score == BandScore.BAND_7_0, 7.0),
            (StudentScore.score == BandScore.BAND_7_5, 7.5),
            else_=None
        )
        overall_band_score_calc = func.round(
            cast(func.sum(numeric_score) / 4, Numeric), 
            2
        )
        return (
            self.db.query(
                Student.id.label("student_id"),
                Student.name.label("student_name"),
                overall_band_score_calc.label("overall"),
                func.count(StudentScore.id).label("completed_tests")
            )
            .join(StudentScore, Student.id == StudentScore.student_id)
            .filter(
                Student.classroom_id == classroom_id,
            )
            .group_by(Student.id) 
            .subquery()
        )

    @cache_response(prefix="grading")
    def get_classroom_overall_band_scores(self, classroom_id: uuid.UUID): 
        ovr_query= self._build_overall_band_score(classroom_id)
        raw_rows = self.db.query(ovr_query).all() 
        return  [Overall_Band(student_id=row.student_id,
                               student_name=row.student_name,
                           overall=row.overall,
                         completed_tests=row.completed_tests)
                           for row in raw_rows]

    @cache_response(prefix="grading")
    def get_student_overall_band_score(self,classroom_id: uuid.UUID, student_id: uuid.UUID): 
        ovr_query= self._build_overall_band_score(classroom_id)
        raw_rows = self.db.query(ovr_query).filter(ovr_query.c.student_id == student_id).all()
        return  [Overall_Band(student_id=row.student_id,
                               student_name=row.student_name,
                           overall=row.overall,
                         completed_tests=row.completed_tests)
                           for row in raw_rows]