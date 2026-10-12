# core/exceptions.py
from typing import Any, Optional

class AppException(Exception):
    """Base domain exception for Youpass 2.0."""
    def __init__(self, message: str, payload: Optional[Any] = None):
        self.message = message
        self.payload = payload
        super().__init__(self.message)

class DatabaseValidationError(AppException):
    """Raised when data fails database constraints."""
    pass

class ResourceNotFoundError(AppException):
    """Raised when a database record is missing."""
    pass

class ConflictError(AppException):
    """Raised when a unique constraint is violated."""
    pass

class ThirdPartyServiceError(AppException):
    """Raised when external integrations (Gemini, email) fail."""
    pass