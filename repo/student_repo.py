import uuid 
from sqlalchemy.orm import Session 
from sqlalchemy.exc import SQLAlchemyError
from db.models.student import Student 
from core.exceptions import DatabaseValidationError, ResourceNotFoundError


class StudentRepo:
    def __init__(self, db_session: Session):
        self.db_session = db_session   

    def create_student(self, **kwargs):
        try:
            student = Student(**kwargs)
            self.db_session.add(student)
            self.db_session.commit()
            self.db_session.refresh(student) 
            return student
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"Failed to create student: {str(e)}")

    def get_all_students(self):
        return self.db_session.query(Student).all()

    
    def get_student_by_id(self, student_id: uuid.UUID):
        return self.db_session.query(Student).filter_by(id=student_id).first()

  
    def get_student_by_name(self, name: str):
        return self.db_session.query(Student).filter_by(name=name).first()

    
    def get_student_by_classroom_id(self, classroom_id: uuid.UUID):
        return self.db_session.query(Student).filter_by(classroom_id=classroom_id).all()

    
    def update_student(self, student_id: uuid.UUID, **kwargs):
        student = self.get_student_by_id(student_id)
        if not student:
            raise ResourceNotFoundError(message=f"Student with id {student_id} not found.")

        for key, value in kwargs.items():
            if hasattr(student, key):
                setattr(student, key, value)
        try: 
            self.db_session.commit()
            self.db_session.refresh(student) 
            return student 
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"Failed to update student: {str(e)}")


    def delete_student(self, student_id: uuid.UUID):
        student = self.get_student_by_id(student_id)
        if not student:
            raise ResourceNotFoundError(message=f"Student with id {student_id} not found.")

        try:
            self.db_session.delete(student)
            self.db_session.commit()
            return True
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"Failed to delete student: {str(e)}")