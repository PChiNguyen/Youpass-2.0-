import uuid 
from sqlalchemy.orm import Session
from sqlalchemy import exists 
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from db.models.user import User
from core.exceptions import DatabaseValidationError, ResourceNotFoundError, ConflictError


class UserRepo:
    def __init__(self, db_session: Session):
        self.db_session: Session = db_session

    
    def create_user(self, **kwargs):
        try: 
            user = User(**kwargs)
            self.db_session.add(user)
            self.db_session.commit()
            self.db_session.refresh(user) 
            return user    
        except IntegrityError:
            self.db_session.rollback()
            raise ConflictError(message="User with this email already exists.")
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"Failed to create user: {str(e)}")
        except Exception as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"An unexpected error occurred: {str(e)}")

  
    def get_user_by_email(self, email: str):
        return self.db_session.query(User).filter(User.email == email).first()  

 
    def get_user_by_id(self, user_id: uuid.UUID):
        return self.db_session.query(User).filter(User.id == user_id).first()

  
    def user_exists_by_email(self, email: str):
        return self.db_session.query(exists().where(User.email == email)).scalar()

    
    def update_user(self, user_id: uuid.UUID, **kwargs):
        user = self.get_user_by_id(user_id)

        for key, value in kwargs.items():
            if hasattr(user, key):
                setattr(user, key, value)
            else:
                raise AttributeError(f"User model has no attribute '{key}'")
        try:
            self.db_session.commit()
            self.db_session.refresh(user)   
            return user 
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"Failed to update user: {str(e)}")
        except Exception as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"An unexpected error occurred: {str(e)}")  

  
    def delete_user(self, user_id: uuid.UUID):
        user = self.get_user_by_id(user_id)

        try: 
            self.db_session.delete(user)
            self.db_session.commit()
            return True
        except SQLAlchemyError as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"Failed to delete user: {str(e)}")
        except Exception as e:
            self.db_session.rollback()
            raise DatabaseValidationError(message=f"An unexpected error occurred: {str(e)}")