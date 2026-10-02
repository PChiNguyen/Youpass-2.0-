import uuid 
import logging 
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from db.models.student_score import StudentScore  
from core.exceptions import DatabaseValidationError, ResourceNotFoundError


logger = logging.getLogger(__name__) 

class StudentScoreRepo:
    def __init__(self, db_session: Session):
        self.db_session = db_session 

   
    def create_student_score(self, **kwargs):
        try:
            student_score = StudentScore(**kwargs)
            self.db_session.add(student_score)
            self.db_session.commit()
            self.db_session.refresh(student_score) 
            logger.info(f"Student score created successfully for student: {student_score.student_id}")
            return student_score
        except SQLAlchemyError as e:
            self.db_session.rollback()
            logger.error(f"Failed to create student score: {e}")
            raise DatabaseValidationError(message=f"Failed to create student score: {str(e)}")

   
    def get_student_scores_by_student_id(self, student_id: uuid.UUID):
        return self.db_session.query(StudentScore).filter_by(student_id=student_id).all()

  
    def get_student_scores_by_skill_id(self, skill_id: int):
        return self.db_session.query(StudentScore).filter_by(skill_id=skill_id).all()

  
    def get_student_score_by_id(self, student_score_id: uuid.UUID):
        return self.db_session.query(StudentScore).filter_by(id=student_score_id).first()

   
    def update_student_score(self, student_score_id: uuid.UUID, **kwargs):
        student_score = self.get_student_score_by_id(student_score_id)
        if not student_score:
            raise ResourceNotFoundError(message=f"Student score with id {student_score_id} not found.")

        for key, value in kwargs.items():
            if hasattr(student_score, key):
                setattr(student_score, key, value)
        try:
            self.db_session.commit()
            self.db_session.refresh(student_score)
            logger.info(f"Student score updated successfully: {student_score_id}")
            return student_score
        except SQLAlchemyError as e:
            self.db_session.rollback()
            logger.error(f"Failed to update student score: {e}")
            raise DatabaseValidationError(message=f"Failed to update student score: {str(e)}")

    
    def delete_student_score(self, student_score_id: uuid.UUID):
        student_score = self.get_student_score_by_id(student_score_id)
        if not student_score:
            raise ResourceNotFoundError(message=f"Student score with id {student_score_id} not found.")

        try:
            self.db_session.delete(student_score)
            self.db_session.commit()
            logger.info(f"Student score deleted successfully: {student_score_id}")
            return True
        except SQLAlchemyError as e:
            self.db_session.rollback()
            logger.error(f"Failed to delete student score: {e}")
            raise DatabaseValidationError(message=f"Failed to delete student score: {str(e)}")