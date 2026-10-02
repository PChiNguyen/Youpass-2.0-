import uuid
from sqlalchemy.orm import Session

from core.exceptions import ResourceNotFoundError
from repo.classroom_repo import ClassroomRepo
from repo.student_repo import StudentRepo
from schemas.student_schemas import StudentCreate, StudentUpdate


class StudentService:
    def __init__(self, db_session: Session):
        self.student_repo = StudentRepo(db_session)
        self.classroom_repo = ClassroomRepo(db_session)

    def create_student(self, student: StudentCreate):
        classroom = self.classroom_repo.get_classroom_by_id(student.classroom_id)
        if not classroom:
            raise ResourceNotFoundError(message="Classroom not found")
        return self.student_repo.create_student(**student.model_dump(exclude_unset=True))

    def get_all_students(self):
        return self.student_repo.get_all_students()

    def get_student_by_id(self, student_id: uuid.UUID):
        student = self.student_repo.get_student_by_id(student_id)
        if not student:
            raise ResourceNotFoundError(message="Student not found")
        return student

    def get_student_by_name(self, name: str):
        student = self.student_repo.get_student_by_name(name)
        if not student:
            raise ResourceNotFoundError(message=f"Student with name '{name}' not found")
        return student

    def get_student_by_classroom_id(self, classroom_id: uuid.UUID):
        if not self.classroom_repo.get_classroom_by_id(classroom_id):
            raise ResourceNotFoundError(message="Classroom not found")
        return self.student_repo.get_student_by_classroom_id(classroom_id)
  
    def update_student(self, student_id: uuid.UUID, student: StudentUpdate):
        if not self.student_repo.get_student_by_id(student_id):
            raise ResourceNotFoundError(message="Student not found")
        return self.student_repo.update_student(
            student_id, **student.model_dump(exclude_unset=True)
        )

    def delete_student(self, student_id: uuid.UUID):
        if not self.student_repo.get_student_by_id(student_id):
            raise ResourceNotFoundError(message="Student not found")
        return self.student_repo.delete_student(student_id)