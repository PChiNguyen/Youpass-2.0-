import logging
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. LOGGING CONFIGURATION
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s"
)
logger = logging.getLogger("uvicorn.error")

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