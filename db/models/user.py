import uuid
import enum
from typing import TYPE_CHECKING, List
from sqlalchemy import String, Enum as SQLEnum, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base




class UserRole(str, enum.Enum):
    ADMIN = 'admin'
    TEACHER = 'teacher'
    STUDENT = 'student'


class User(Base):
    __tablename__ = 'users'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), nullable=False)

    