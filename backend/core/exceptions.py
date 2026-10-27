# core/exceptions.py
from typing import Any

class AppException(Exception):
    """Base domain exception for Youpass 2.0."""

    def __init__(self, message: str, payload: Any | None = None):
        self.message = message
        self.payload = payload
        super().__init__(self.message)


class DatabaseValidationError(AppException):
    """Raised when data fails database constraints."""


class ResourceNotFoundError(AppException):
    """Raised when a database record is missing."""


class ConflictError(AppException):
    """Raised when a unique constraint is violated."""


class ThirdPartyServiceError(AppException):
    """Raised when external integrations (Gemini, email) fail."""