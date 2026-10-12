# schemas/user_schemas.py
from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID
from datetime import date, datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    target_overall: Optional[float] = None
    target_reading: Optional[float] = None
    target_listening: Optional[float] = None
    target_writing: Optional[float] = None
    target_speaking: Optional[float] = None
    exam_date: Optional[date] = None

# 🟢 Make password optional to allow social logins (Google)
class UserCreate(UserBase):
    password: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    target_overall: Optional[float] = None
    target_reading: Optional[float] = None
    target_listening: Optional[float] = None
    target_writing: Optional[float] = None
    target_speaking: Optional[float] = None
    exam_date: Optional[date] = None

class UserResponse(UserBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)