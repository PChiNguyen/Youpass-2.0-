import logging
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pytest_cov import engine
from api import auth, submission_api, test_api   
from core.exception_handlers import register_exception_handlers
from db.base import Base 

# 1. LOGGING CONFIGURATION
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s"
)
logger = logging.getLogger("uvicorn.error")
Base.metadata.create_all(bind=engine)
# 2. FASTAPI APPLICATION INITIALIZATION
app = FastAPI(
    title="YouPass 2.0 API",
    description="Minimal backend API for YouPass 2.0 IELTS preparation platform.",
    version="2.0.0"
)

# 3. CORS CONFIGURATION
ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React / Next.js local dev
    "http://localhost:5173",  # Vite local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
register_exception_handlers(app)     
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(test_api.router, prefix="/api/tests", tags=["Tests"])
app.include_router(submission_api.router, prefix="/api/submissions", tags=["Submissions"])

# 4. BASIC HEALTH CHECK ENDPOINTS
@app.get("/", tags=["Health Check"])
def root():
    """Root endpoint verifying API availability."""
    return {"message": "YouPass 2.0 API is live!"}

@app.get("/health", tags=["System Health"])
def health_check():
    """Lightweight endpoint for health monitoring."""
    return {
        "status": "operational",
        "version": "2.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }