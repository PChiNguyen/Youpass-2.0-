from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Dict, Any, Optional

# 1. Base Submission Schema
class SubmissionBase(BaseModel):
    test_id: UUID
    user_answers: Dict[str, Any]  # Stores user submitted answers matching question IDs

# 2. Schema for Submitting Test Answers (Request payload from user)
class SubmissionCreate(SubmissionBase):
    pass  # user_id is injected automatically from the JWT authentication token in API routes

# 3. Schema for Updating Submission (e.g., automated grading or instructor feedback)
class SubmissionUpdate(BaseModel):
    raw_score: Optional[float] = None
    achieved_band: Optional[float] = None
    user_answers: Optional[Dict[str, Any]] = None

# 4. Schema for Returning Submission Results (Response payload)
class SubmissionResponse(SubmissionBase):
    id: UUID
    user_id: UUID
    raw_score: Optional[float] = None
    achieved_band: Optional[float] = None
    submitted_at: datetime

    model_config = ConfigDict(from_attributes=True)