from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import Dict, Any, Optional
from db.models.test import SkillType

# 1. Base Test Schema
class TestBase(BaseModel):
    __test__ = False
    
    title: str
    skill_type: SkillType            # 🟢 Uses SkillType Enum for automatic validation
    category: Optional[str] = None
    content: Dict[str, Any]

# 2. Schema for Creating a Test
class TestCreate(TestBase):
    __test__ = False

# 3. Schema for Updating a Test (PATCH)
class TestUpdate(BaseModel):
    __test__ = False
    
    title: Optional[str] = None
    skill_type: Optional[SkillType] = None
    category: Optional[str] = None
    content: Optional[Dict[str, Any]] = None

# 4. Schema for Returning Test Data
class TestResponse(TestBase):
    __test__ = False
    
    id: UUID

    model_config = ConfigDict(from_attributes=True)