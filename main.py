import logging
import os
import traceback
from datetime import datetime, timezone

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# 1. CORE & SERVICE IMPORTS
from core.exceptions import AppException
from services.ai_service import AIService

# 2. DATABASE & MODEL IMPORTS
from db.base import Base
from db.models import user, classroom, student, student_score, skill
from db.models.skill import SkillModel   
from db.session import engine

# 3. ROUTER IMPORTS
from api import (auth, classrooms, students, student_scores, setup, grading) 

# Configure logging for stdout / Docker logs
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s"
)
logger = logging.getLogger("uvicorn.error")

# Initialize database tables automatically
Base.metadata.create_all(bind=engine)

# Initialize FastAPI Application
app = FastAPI(
    title="Ielts Exam API",
    description="Backend service for managing IELTS tests, student scoring, and automated grading.",
    version="2.0.0"
)

# ==========================================
# 4. CORS CONFIGURATION (ADDED)
# ==========================================
# Allows your frontend applications to make requests to this backend
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React / Next.js local dev server
    "http://localhost:5173",  # Vite local dev server
    "https://your-frontend-domain.com", # Future production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 5. ROUTER REGISTRATION
# ==========================================
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])  
app.include_router(classrooms.router, prefix="/api/classrooms", tags=["Classrooms"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(student_scores.router, prefix="/api/student-scores", tags=["Student Scores"])
app.include_router(grading.router, prefix="/api/grading", tags=["Grading"])
app.include_router(setup.router, prefix="/api/setup", tags=["System Setup"]) 

# ==========================================
# 6. SYSTEM HEALTH ENDPOINTS (ADDED)
# ==========================================
@app.get("/", tags=["Health Check"])
def root():
    """Root endpoint verifying API availability."""
    return {"message": "API is live! Go to /docs to view the Swagger UI."}

@app.get("/health", tags=["System Health"])
def health_check():
    """Lightweight endpoint for Docker / Cloud service health monitoring."""
    return {
        "status": "operational",
        "version": "2.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

# ==========================================
# 7. EXCEPTION HANDLERS
# ==========================================

# 🟢 AUTOMATIC INTERCEPTOR: Catches business logic errors & asks Gemini AI for help
@app.exception_handler(AppException)
async def automatic_ai_exception_handler(request: Request, exc: AppException):
    """
    Runs automatically whenever 'raise AppException' occurs in business logic.
    Sends error details to Gemini AI to generate helpful debugging advice.
    """
    ai_explanation = "Please review system logs for full details."
    error = None 
    
    try:
        ai_service = AIService()
        ai_analysis = ai_service.generate_smart_error_payload(
            error_context=f"Route: {request.url.path} | Error: {exc.message} | Payload: {exc.payload}"
        )
        ai_explanation = ai_analysis.suggested_fix
    except Exception as ai_err:
        error = f"AI service failed: {str(ai_err)}"

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": exc.message,  
            "payload": exc.payload,
            "ai_suggestion": ai_explanation,
            "error": error
        }
    )     

# 🔴 GLOBAL EXCEPTION HANDLER: Catches unhandled 500 runtime crashes
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches unexpected Python crashes, logs tracebacks to Docker stdout,
    and returns full error context for rapid debugging in Swagger UI.
    """
    error_traceback = traceback.format_exc()
    logger.error(
        f"\n💥 [INTERNAL SERVER ERROR 500]\n"
        f"Route: {request.method} {request.url.path}\n"
        f"Traceback:\n{error_traceback}"
    )
    return JSONResponse(
        status_code=500,
        content={
            "status": "fail",
            "message": "An unexpected internal server error occurred.",
            "error_type": type(exc).__name__,
            "detail": str(exc),
            "endpoint": request.url.path,
            "traceback": error_traceback.split("\n"), # Helps you debug directly in Swagger UI
        }
    )