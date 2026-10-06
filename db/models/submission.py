from sqlalchemy import Float, ForeignKey, DateTime, UUID, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.base import Base
import uuid
from datetime import datetime
# 🟢 Import ZoneInfo từ thư viện chuẩn
from zoneinfo import ZoneInfo
from typing import Dict, Any, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from db.models.user import User
    from db.models.test import Test

class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    test_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tests.id", ondelete="CASCADE"), nullable=False)

    # MAGIC FIX: Uses JSONB for Postgres, but generic JSON for SQLite!
    user_answers: Mapped[Dict[str, Any]] = mapped_column(JSON().with_variant(JSONB, "postgresql"), nullable=False)

    raw_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    achieved_band: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
# 🟢 we dont use datetime.now(timezone.utc) directly because it would be evaluated when the class is defined, not when an instance is created
# Instead, we use a lambda function to ensure the default value is evaluated at instance creation time.
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(ZoneInfo("Asia/Ho_Chi_Minh")), 
        nullable=False
    )


    user: Mapped["User"] = relationship("User", back_populates="submissions")
    test: Mapped["Test"] = relationship("Test", back_populates="submissions")