import logging
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import settings

# Load environment variables for standalone script execution
load_dotenv()

logger = logging.getLogger(__name__)

# Resolve database URL from settings or directly from .env
DATABASE_URL = os.getenv("DATABASE_URL") or getattr(settings, "SQLALCHEMY_DATABASE_URL", None)
# pool_pre_ping=True automatically reconnects to Neon if a connection drops
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

Sessionlocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

# Connection check
try:
    with engine.connect() as connection:
        logger.info("Database connection successful")
except Exception as e:
    logger.error(f"Database connection failed: {e}")

# Session test (properly closed to prevent leaking connections on import)
try:
    test_db = Sessionlocal()
    logger.info("Session created successfully")
    test_db.close()  # 🟢 Closed session to prevent connection leaks on module import
except Exception as e:
    logger.error(f"Session creation failed: {e}")