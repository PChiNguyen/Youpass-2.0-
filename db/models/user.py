import uuid
from datetime import date
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Float, Date, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base

if TYPE_CHECKING:
    from db.models.submission import Submission
class User(Base):
    __tablename__ = "users"

    # Core Identifiers
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    
    # Nullable password to support Google OAuth users
    password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Dashboard Goal Metrics
    target_overall: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    target_reading: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    target_listening: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    target_writing: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    target_speaking: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    # Exam Date Countdown Widget
    exam_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    # Relationships
    submissions: Mapped[List["Submission"]] = relationship("Submission", back_populates="user", cascade="all, delete-orphan")