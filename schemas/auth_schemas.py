# schemas/auth_schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[str] = None

# 🟢 Add this schema for Google Login request payload
class GoogleLoginRequest(BaseModel):
    token: str  # The Google ID token (credential) received from frontend