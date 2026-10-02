import uuid
from typing import List

from sqlalchemy.orm import Session

from core.exceptions import ResourceNotFoundError
from repo.classroom_repo import ClassroomRepo
from repo.user_repo import UserRepo
from schemas.classroom_schemas import ClassroomCreate, ClassroomUpdate


class ClassroomService:
    def __init__(self, db_session: Session):
        self.classroom_repo = ClassroomRepo(db_session)
        self.user_repo = UserRepo(db_session)

    def create_classroom(self, classroom_info: ClassroomCreate):
        if not self.user_repo.get_user_by_id(classroom_info.teacher_id):
            raise ResourceNotFoundError(message="Teacher not found")
        return self.classroom_repo.create_classroom(
            **classroom_info.model_dump(exclude_unset=True)
        )

    def get_all_classrooms(self, skip: int = 0, limit: int = 100):
        return self.classroom_repo.get_all_classrooms(skip=skip, limit=limit)

    def get_classroom_by_id(self, classroom_id: uuid.UUID):
        classroom = self.classroom_repo.get_classroom_by_id(classroom_id)
        if not classroom:
            raise ResourceNotFoundError(message="Classroom not found")
        return classroom

    def get_classroom_by_name(self, classroom_name: str):
        classroom = self.classroom_repo.get_classroom_by_name(classroom_name)
        if not classroom:
            raise ResourceNotFoundError(message="Classroom not found")
        return classroom

    def get_classroom_by_teacher_id(self, teacher_id: uuid.UUID):
        if not self.user_repo.get_user_by_id(teacher_id):
            raise ResourceNotFoundError(message="Teacher not found")
        return self.classroom_repo.get_classroom_by_teacher_id(teacher_id)
  
    def update_classroom(self, classroom_id: uuid.UUID, classroom_info: ClassroomUpdate):
        if not self.classroom_repo.get_classroom_by_id(classroom_id):
            raise ResourceNotFoundError(message="Classroom not found")
        return self.classroom_repo.update_classroom(
            classroom_id, **classroom_info.model_dump(exclude_unset=True)
        )
    
    
    def delete_classroom(self, classroom_id: uuid.UUID):
        if not self.classroom_repo.get_classroom_by_id(classroom_id):
            raise ResourceNotFoundError(message="Classroom not found")
        return self.classroom_repo.delete_classroom(classroom_id)