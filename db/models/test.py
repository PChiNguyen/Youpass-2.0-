from sqlalchemy import String, UUID, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base
import uuid
from typing import Dict, Any, List, Optional, TYPE_CHECKING 

if TYPE_CHECKING:
    from db.models.submission import Submission


class Test(Base):
    __tablename__ = "tests"
    # 🟢 TELLS PYTEST THIS IS A DATABASE MODEL, NOT A TEST CLASS
    __test__ = False 

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    skill_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # MAGIC FIX: Uses JSONB for Postgres, but generic JSON for SQLite!
    content: Mapped[Dict[str, Any]] = mapped_column(JSON().with_variant(JSONB, "postgresql"), nullable=False)

    submissions: Mapped[List["Submission"]] = relationship("Submission", back_populates="test", cascade="all, delete-orphan")