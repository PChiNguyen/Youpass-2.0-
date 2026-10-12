# core/exception_handlers.py
import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from core.exceptions import (
    AppException,
    ResourceNotFoundError,
    ConflictError,
    DatabaseValidationError,
)
from services.ai_service import AIService

logger = logging.getLogger("uvicorn.error")

def _get_ai_suggestion(request: Request, exc: AppException) -> str:
    """Safely invokes AIService to generate error diagnostic without failing HTTP response."""
    try:
        ai_service = AIService()
        context = f"Route: {request.url.path} | Message: {exc.message} | Payload: {exc.payload}"
        analysis = ai_service.generate_smart_error_payload(context)
        return analysis.suggested_fix
    except Exception as e:
        logger.warning(f"AI exception diagnostic skipped: {str(e)}")
        return "Review system logs for details."

def register_exception_handlers(app: FastAPI) -> None:

    @app.exception_handler(ResourceNotFoundError)
    async def resource_not_found_handler(request: Request, exc: ResourceNotFoundError):
        ai_fix = _get_ai_suggestion(request, exc)
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "message": exc.message,
                "ai_suggestion": ai_fix,
            },
        )

    @app.exception_handler(ConflictError)
    async def conflict_handler(request: Request, exc: ConflictError):
        ai_fix = _get_ai_suggestion(request, exc)
        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={
                "message": exc.message,
                "ai_suggestion": ai_fix,
            },
        )

    @app.exception_handler(DatabaseValidationError)
    async def database_validation_handler(request: Request, exc: DatabaseValidationError):
        ai_fix = _get_ai_suggestion(request, exc)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "message": exc.message,
                "ai_suggestion": ai_fix,
            },
        )

    @app.exception_handler(AppException)
    async def generic_app_exception_handler(request: Request, exc: AppException):
        ai_fix = _get_ai_suggestion(request, exc)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "message": exc.message,
                "ai_suggestion": ai_fix,
            },
        )