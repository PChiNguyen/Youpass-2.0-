import uuid
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from db.models.classroom import Classroom 
from core.exceptions import DatabaseValidationError, ResourceNotFoundError   


class ClassroomRepo:
    def __init__(self, db_session: Session):
        self.db_session = db_session

    
    def create_classroom(self, **kwargs):
        try: 
            classroom = Classroom(**kwargs)
            self.db_session.add(classroom)
            self.db_session.commit()
            self.db_session.refresh(classroom) 
            return classroom  
        except IntegrityError as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"Database constraint error: {e.orig}")
        except SQLAlchemyError as e: 
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"Failed to create classroom: {str(e)}")
        except Exception as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"An unexpected error occurred: {str(e)}") 

 
    def get_classroom_by_id(self, classroom_id: uuid.UUID):
        return self.db_session.query(Classroom).filter(Classroom.id == classroom_id).first()

    
    def get_classroom_by_name(self, classroom_name: str):
        return self.db_session.query(Classroom).filter(Classroom.name == classroom_name).first()

    
    def get_classroom_by_teacher_id(self, teacher_id: uuid.UUID):
        return self.db_session.query(Classroom).filter(Classroom.teacher_id == teacher_id).all()

  
    def get_all_classrooms(self, skip: int = 0, limit: int = 100):
        return self.db_session.query(Classroom).offset(skip).limit(limit).all() 

    
    def update_classroom(self, classroom_id: uuid.UUID, **kwargs):
        classroom = self.get_classroom_by_id(classroom_id)
        if not classroom:
            raise ResourceNotFoundError(message=f"Classroom with id {classroom_id} not found.")

        for key, value in kwargs.items():
            if hasattr(classroom, key):
                setattr(classroom, key, value)
        try: 
            self.db_session.commit()
            self.db_session.refresh(classroom) 
            return classroom
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"Failed to update classroom: {str(e)}")  
        except Exception as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"An unexpected error occurred: {str(e)}")   

    
    def delete_classroom(self, classroom_id: uuid.UUID):
        classroom = self.get_classroom_by_id(classroom_id)
        try: 
            self.db_session.delete(classroom)
            self.db_session.commit()
            return True
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"Failed to delete classroom: {str(e)}")
        except Exception as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"An unexpected error occurred: {str(e)}")