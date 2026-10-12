import uuid
import enum
from typing import Dict, Any, List, Optional, TYPE_CHECKING 
from sqlalchemy import String, UUID, JSON, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base

if TYPE_CHECKING:
    from db.models.submission import Submission


# 🟢 Python String Enum for IELTS Skill Types
class SkillType(str, enum.Enum):
    LISTENING = "listening"
    READING = "reading"
    WRITING = "writing"
    SPEAKING = "speaking"


class Test(Base):
    __tablename__ = "tests"
    __test__ = False 

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # 🟢 Updated column using SQLEnum with Python SkillType
    skill_type: Mapped[SkillType] = mapped_column(
        SQLEnum(SkillType, native_enum=False, values_callable=lambda obj: [e.value for e in obj]),
        index=True,
        nullable=False
    )
# we set native_enum=False to store the enum as a string in the database, which is more portable across different database backends.
#  The values_callable ensures that the enum values are correctly extracted for SQLAlchemy's use.
    
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    content: Mapped[Dict[str, Any]] = mapped_column(JSON().with_variant(JSONB, "postgresql"), nullable=False)

    submissions: Mapped[List["Submission"]] = relationship("Submission", back_populates="test", cascade="all, delete-orphan")